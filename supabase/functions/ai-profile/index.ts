import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, experience, skills, goals } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert AI career profiler and NLP skill extraction engine. Analyze the user's input and return a structured JSON response.

You MUST perform:
1. **Skill Extraction (NLP)**: Extract ALL skills from free text using keyword extraction and contextual understanding. Include technical skills, soft skills, tools, frameworks, methodologies.
2. **Skill Level Inference**: For each skill, infer a proficiency level (0-100) based on context clues like years of experience, depth of description, project complexity.
3. **Career Trajectory Detection**: Analyze career progression pattern (e.g., "IC track", "Management track", "Transitioning to ML", "Early career explorer").
4. **Career Cluster Classification**: Classify into one primary cluster (e.g., "Full-Stack Engineer", "Data Scientist", "DevOps Engineer", "Product Manager", "ML Engineer", "Frontend Specialist", "Backend Architect", "Cloud Engineer").
5. **Skill Vector Profile**: Generate a normalized vector of top skill categories with weights summing to 1.0.
6. **Hidden Skills Detection**: Infer skills not explicitly mentioned but implied by context (e.g., someone doing "microservices" likely knows "Docker", "API design", "distributed systems").
7. **AI Confidence Score**: Rate your overall confidence in the analysis (0-100).

Return ONLY valid JSON with this exact structure:
{
  "extracted_skills": [{"name": "string", "category": "string", "confidence": number}],
  "skill_levels": {"skill_name": number},
  "career_trajectory": "string description",
  "career_cluster": "string",
  "skill_vector": [{"category": "string", "weight": number}],
  "hidden_skills": [{"name": "string", "reason": "string"}],
  "ai_confidence": number,
  "summary": "string - 2-3 sentence profile summary"
}`;

    const userPrompt = `Analyze this professional profile:

**Name**: ${name || "Not provided"}

**Experience & Background**:
${experience || "Not provided"}

**Skills & Technologies**:
${skills || "Not provided"}

**Career Goals**:
${goals || "Not provided"}`;

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

    // Parse AI response - extract JSON from potential markdown code blocks
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      parsed = JSON.parse(jsonMatch[1].trim());
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI analysis");
    }

    return new Response(JSON.stringify({ success: true, profile: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-profile error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
