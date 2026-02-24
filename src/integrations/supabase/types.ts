export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assessment_questions: {
        Row: {
          ai_evaluation: Json | null
          answered_at: string | null
          assessment_id: string
          bloom_level: string
          created_at: string
          difficulty: string
          id: string
          question_number: number
          question_text: string
          question_type: string
          score: number | null
          time_estimate_minutes: number | null
          time_spent_seconds: number | null
          user_answer: string | null
        }
        Insert: {
          ai_evaluation?: Json | null
          answered_at?: string | null
          assessment_id: string
          bloom_level?: string
          created_at?: string
          difficulty?: string
          id?: string
          question_number: number
          question_text: string
          question_type?: string
          score?: number | null
          time_estimate_minutes?: number | null
          time_spent_seconds?: number | null
          user_answer?: string | null
        }
        Update: {
          ai_evaluation?: Json | null
          answered_at?: string | null
          assessment_id?: string
          bloom_level?: string
          created_at?: string
          difficulty?: string
          id?: string
          question_number?: number
          question_text?: string
          question_type?: string
          score?: number | null
          time_estimate_minutes?: number | null
          time_spent_seconds?: number | null
          user_answer?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assessment_questions_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessment_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      assessment_sessions: {
        Row: {
          bloom_distribution: Json | null
          completed_at: string | null
          correct_answers: number
          created_at: string
          current_difficulty: string
          difficulty: string
          id: string
          profile_id: string | null
          questions_answered: number
          session_id: string
          status: string
          topic: string
          total_questions: number
        }
        Insert: {
          bloom_distribution?: Json | null
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          current_difficulty?: string
          difficulty?: string
          id?: string
          profile_id?: string | null
          questions_answered?: number
          session_id: string
          status?: string
          topic: string
          total_questions?: number
        }
        Update: {
          bloom_distribution?: Json | null
          completed_at?: string | null
          correct_answers?: number
          created_at?: string
          current_difficulty?: string
          difficulty?: string
          id?: string
          profile_id?: string | null
          questions_answered?: number
          session_id?: string
          status?: string
          topic?: string
          total_questions?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessment_sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          ai_confidence: number | null
          ai_extracted_skills: Json | null
          career_cluster: string | null
          career_trajectory: string | null
          created_at: string
          experience_text: string | null
          full_name: string | null
          goals_text: string | null
          id: string
          raw_ai_response: Json | null
          session_id: string
          skill_levels: Json | null
          skill_vector: Json | null
          skills_text: string | null
          updated_at: string
        }
        Insert: {
          ai_confidence?: number | null
          ai_extracted_skills?: Json | null
          career_cluster?: string | null
          career_trajectory?: string | null
          created_at?: string
          experience_text?: string | null
          full_name?: string | null
          goals_text?: string | null
          id?: string
          raw_ai_response?: Json | null
          session_id: string
          skill_levels?: Json | null
          skill_vector?: Json | null
          skills_text?: string | null
          updated_at?: string
        }
        Update: {
          ai_confidence?: number | null
          ai_extracted_skills?: Json | null
          career_cluster?: string | null
          career_trajectory?: string | null
          created_at?: string
          experience_text?: string | null
          full_name?: string | null
          goals_text?: string | null
          id?: string
          raw_ai_response?: Json | null
          session_id?: string
          skill_levels?: Json | null
          skill_vector?: Json | null
          skills_text?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
