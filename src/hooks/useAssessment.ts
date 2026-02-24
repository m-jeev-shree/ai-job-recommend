import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Question {
  question_text: string;
  question_type: string;
  difficulty: string;
  bloom_level: string;
  time_estimate_minutes: number;
  evaluation_rubric?: any;
  hints?: string[];
  expected_concepts?: string[];
}

interface Evaluation {
  score: number;
  is_correct: boolean;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  complexity_analysis?: { time: string; space: string } | null;
  bloom_achievement: string;
  confidence: number;
  next_difficulty_recommendation: string;
}

interface AssessmentState {
  sessionId: string | null;
  assessmentId: string | null;
  topic: string;
  currentQuestion: Question | null;
  currentQuestionNumber: number;
  totalQuestions: number;
  currentDifficulty: string;
  questionsAnswered: number;
  correctAnswers: number;
  evaluations: Evaluation[];
  previousQuestions: string[];
  status: "idle" | "setup" | "generating" | "answering" | "evaluating" | "reviewed" | "completed";
  error: string;
}

const BLOOM_LEVELS = ["Remember", "Understand", "Apply", "Analyze", "Evaluate", "Create"];

function getNextDifficulty(current: string, recommendation: string): string {
  const levels = ["easy", "medium", "hard", "expert"];
  const idx = levels.indexOf(current);
  if (recommendation === "harder" && idx < levels.length - 1) return levels[idx + 1];
  if (recommendation === "easier" && idx > 0) return levels[idx - 1];
  return current;
}

function getBloomForQuestion(questionNumber: number, totalQuestions: number): string {
  const progressRatio = questionNumber / totalQuestions;
  if (progressRatio <= 0.2) return "Remember";
  if (progressRatio <= 0.4) return "Understand";
  if (progressRatio <= 0.6) return "Apply";
  if (progressRatio <= 0.8) return "Analyze";
  if (progressRatio <= 0.9) return "Evaluate";
  return "Create";
}

export function useAssessment() {
  const [state, setState] = useState<AssessmentState>({
    sessionId: null,
    assessmentId: null,
    topic: "",
    currentQuestion: null,
    currentQuestionNumber: 0,
    totalQuestions: 5,
    currentDifficulty: "medium",
    questionsAnswered: 0,
    correctAnswers: 0,
    evaluations: [],
    previousQuestions: [],
    status: "idle",
    error: "",
  });

  const startAssessment = useCallback(async (topic: string, totalQuestions: number, difficulty: string) => {
    const sessionId = crypto.randomUUID();
    
    const { data, error } = await supabase.from("assessment_sessions").insert({
      session_id: sessionId,
      topic,
      difficulty,
      current_difficulty: difficulty,
      total_questions: totalQuestions,
      status: "in_progress",
    }).select("id").single();

    if (error) {
      setState(s => ({ ...s, error: error.message }));
      return;
    }

    setState(s => ({
      ...s,
      sessionId,
      assessmentId: data.id,
      topic,
      totalQuestions,
      currentDifficulty: difficulty,
      questionsAnswered: 0,
      correctAnswers: 0,
      evaluations: [],
      previousQuestions: [],
      currentQuestionNumber: 0,
      status: "setup",
      error: "",
    }));

    // Generate first question
    await generateQuestion(topic, difficulty, 1, totalQuestions, [], data.id);
  }, []);

  const generateQuestion = useCallback(async (
    topic: string, difficulty: string, questionNumber: number, totalQuestions: number,
    previousQuestions: string[], assessmentId: string
  ) => {
    setState(s => ({ ...s, status: "generating" }));

    const bloomLevel = getBloomForQuestion(questionNumber, totalQuestions);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-question", {
        body: { topic, difficulty, bloomLevel, previousQuestions },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const question = data.question as Question;

      // Save to DB
      await supabase.from("assessment_questions").insert({
        assessment_id: assessmentId,
        question_number: questionNumber,
        question_text: question.question_text,
        question_type: question.question_type,
        difficulty: question.difficulty,
        bloom_level: question.bloom_level,
        time_estimate_minutes: question.time_estimate_minutes,
      });

      setState(s => ({
        ...s,
        currentQuestion: question,
        currentQuestionNumber: questionNumber,
        status: "answering",
        error: "",
      }));
    } catch (err: any) {
      setState(s => ({ ...s, error: err.message || "Failed to generate question", status: "setup" }));
    }
  }, []);

  const submitAnswer = useCallback(async (answer: string, timeSpentSeconds: number) => {
    const { currentQuestion, assessmentId, currentQuestionNumber, topic, totalQuestions, previousQuestions, currentDifficulty } = state;
    if (!currentQuestion || !assessmentId) return;

    setState(s => ({ ...s, status: "evaluating" }));

    try {
      const { data, error } = await supabase.functions.invoke("evaluate-answer", {
        body: {
          question: currentQuestion.question_text,
          answer,
          questionType: currentQuestion.question_type,
          difficulty: currentQuestion.difficulty,
          bloomLevel: currentQuestion.bloom_level,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const evaluation = data.evaluation as Evaluation;

      // Update question in DB
      await supabase.from("assessment_questions")
        .update({
          user_answer: answer,
          ai_evaluation: evaluation as any,
          score: evaluation.score,
          answered_at: new Date().toISOString(),
          time_spent_seconds: timeSpentSeconds,
        })
        .eq("assessment_id", assessmentId)
        .eq("question_number", currentQuestionNumber);

      const newQuestionsAnswered = state.questionsAnswered + 1;
      const newCorrectAnswers = state.correctAnswers + (evaluation.is_correct ? 1 : 0);
      const newPreviousQuestions = [...previousQuestions, currentQuestion.question_text];
      const newDifficulty = getNextDifficulty(currentDifficulty, evaluation.next_difficulty_recommendation);

      // Update session
      await supabase.from("assessment_sessions")
        .update({
          questions_answered: newQuestionsAnswered,
          correct_answers: newCorrectAnswers,
          current_difficulty: newDifficulty,
        })
        .eq("id", assessmentId);

      const isCompleted = newQuestionsAnswered >= totalQuestions;

      if (isCompleted) {
        await supabase.from("assessment_sessions")
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", assessmentId);
      }

      setState(s => ({
        ...s,
        questionsAnswered: newQuestionsAnswered,
        correctAnswers: newCorrectAnswers,
        previousQuestions: newPreviousQuestions,
        currentDifficulty: newDifficulty,
        evaluations: [...s.evaluations, evaluation],
        status: isCompleted ? "completed" : "reviewed",
        error: "",
      }));
    } catch (err: any) {
      setState(s => ({ ...s, error: err.message || "Failed to evaluate answer", status: "answering" }));
    }
  }, [state]);

  const nextQuestion = useCallback(async () => {
    const { topic, currentDifficulty, currentQuestionNumber, totalQuestions, previousQuestions, assessmentId } = state;
    if (!assessmentId) return;
    await generateQuestion(topic, currentDifficulty, currentQuestionNumber + 1, totalQuestions, previousQuestions, assessmentId);
  }, [state, generateQuestion]);

  const reset = useCallback(() => {
    setState({
      sessionId: null, assessmentId: null, topic: "", currentQuestion: null,
      currentQuestionNumber: 0, totalQuestions: 5, currentDifficulty: "medium",
      questionsAnswered: 0, correctAnswers: 0, evaluations: [], previousQuestions: [],
      status: "idle", error: "",
    });
  }, []);

  return { state, startAssessment, submitAnswer, nextQuestion, reset };
}
