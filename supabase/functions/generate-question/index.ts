import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { topic, difficulty, questionType, bloomLevel, previousQuestions } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert assessment question generator implementing Computerized Adaptive Testing (CAT) with Bloom's Taxonomy classification.

Generate a UNIQUE question based on the parameters. The question must:
1. Match the specified difficulty level exactly
2. Align with the specified Bloom's Taxonomy level
3. Be different from any previously asked questions
4. Include clear evaluation criteria

Bloom's Taxonomy levels (in order):
- Remember: Recall facts and basic concepts
- Understand: Explain ideas or concepts
- Apply: Use information in new situations
- Analyze: Draw connections among ideas
- Evaluate: Justify a stand or decision
- Create: Produce new or original work

Return ONLY valid JSON:
{
  "question_text": "The full question text",
  "question_type": "coding|theory|system_design|debugging",
  "difficulty": "easy|medium|hard|expert",
  "bloom_level": "Remember|Understand|Apply|Analyze|Evaluate|Create",
  "time_estimate_minutes": number,
  "evaluation_rubric": {
    "criteria": [{"name": "string", "weight": number, "description": "string"}],
    "max_score": 100
  },
  "hints": ["string"],
  "expected_concepts": ["string"]
}`;

    const userPrompt = `Generate a ${difficulty} difficulty ${questionType || "coding"} question about: ${topic}

Target Bloom's Level: ${bloomLevel || "Apply"}

${previousQuestions?.length ? `Previously asked questions (DO NOT repeat):\n${previousQuestions.map((q: string, i: number) => `${i + 1}. ${q}`).join("\n")}` : "This is the first question."}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1].trim());
    } catch {
      console.error("Failed to parse:", content);
      throw new Error("Failed to parse AI question");
    }

    return new Response(JSON.stringify({ success: true, question: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-question error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
