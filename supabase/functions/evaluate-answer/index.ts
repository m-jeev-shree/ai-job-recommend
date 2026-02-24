import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { question, answer, questionType, difficulty, bloomLevel } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert answer evaluation engine. Evaluate the user's answer with multiple analysis techniques:

For CODING questions:
- Code correctness and logic analysis
- Time & space complexity assessment
- Best practices and code quality
- Edge case handling
- Partial credit for partially correct solutions

For THEORY questions:
- Semantic similarity to expected answer
- Completeness of explanation
- Use of correct terminology
- Depth of understanding

For SYSTEM DESIGN questions:
- Scalability considerations
- Component selection
- Trade-off analysis
- Real-world applicability

Score on a 0-100 scale. Be fair but rigorous. Award partial credit where deserved.

Return ONLY valid JSON:
{
  "score": number (0-100),
  "is_correct": boolean (score >= 60),
  "feedback": "Detailed feedback string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "suggestions": ["string"],
  "complexity_analysis": {"time": "string", "space": "string"} | null,
  "bloom_achievement": "Remember|Understand|Apply|Analyze|Evaluate|Create",
  "confidence": number (0-100),
  "next_difficulty_recommendation": "easier|same|harder"
}`;

    const userPrompt = `Evaluate this answer:

**Question** (${questionType}, ${difficulty}, Bloom: ${bloomLevel}):
${question}

**User's Answer**:
${answer}`;

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
      throw new Error("Failed to parse AI evaluation");
    }

    return new Response(JSON.stringify({ success: true, evaluation: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("evaluate-answer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
