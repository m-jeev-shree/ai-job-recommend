
-- Assessment sessions table
CREATE TABLE public.assessment_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  profile_id UUID REFERENCES public.user_profiles(id),
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  current_difficulty TEXT NOT NULL DEFAULT 'medium',
  total_questions INTEGER NOT NULL DEFAULT 5,
  questions_answered INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress',
  bloom_distribution JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Assessment questions table
CREATE TABLE public.assessment_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'coding',
  difficulty TEXT NOT NULL DEFAULT 'medium',
  bloom_level TEXT NOT NULL DEFAULT 'Apply',
  time_estimate_minutes INTEGER DEFAULT 10,
  user_answer TEXT,
  ai_evaluation JSONB,
  score NUMERIC,
  answered_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read assessments" ON public.assessment_sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert assessments" ON public.assessment_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update assessments" ON public.assessment_sessions FOR UPDATE USING (true);

CREATE POLICY "Allow public read questions" ON public.assessment_questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert questions" ON public.assessment_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update questions" ON public.assessment_questions FOR UPDATE USING (true);
