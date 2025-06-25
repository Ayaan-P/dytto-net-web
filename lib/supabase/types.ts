export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          color: string
          icon: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          icon?: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          icon?: string
          description?: string | null
          created_at?: string
        }
      }
      relationships: {
        Row: {
          id: string
          user_id: string
          name: string
          bio: string | null
          photo_url: string | null
          level: number
          xp: number
          relationship_type: string | null
          reminder_interval: string
          contact_info: Json
          tags: string[]
          last_interaction: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          bio?: string | null
          photo_url?: string | null
          level?: number
          xp?: number
          relationship_type?: string | null
          reminder_interval?: string
          contact_info?: Json
          tags?: string[]
          last_interaction?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          bio?: string | null
          photo_url?: string | null
          level?: number
          xp?: number
          relationship_type?: string | null
          reminder_interval?: string
          contact_info?: Json
          tags?: string[]
          last_interaction?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      relationship_categories: {
        Row: {
          id: string
          relationship_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          category_id?: string
          created_at?: string
        }
      }
      interactions: {
        Row: {
          id: string
          relationship_id: string
          content: string
          sentiment_score: number | null
          xp_gained: number
          ai_analysis: Json | null
          tags: string[]
          is_milestone: boolean
          created_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          content: string
          sentiment_score?: number | null
          xp_gained?: number
          ai_analysis?: Json | null
          tags?: string[]
          is_milestone?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          content?: string
          sentiment_score?: number | null
          xp_gained?: number
          ai_analysis?: Json | null
          tags?: string[]
          is_milestone?: boolean
          created_at?: string
        }
      }
      quests: {
        Row: {
          id: string
          relationship_id: string | null
          title: string
          description: string
          type: string
          difficulty: string
          xp_reward: number
          status: string
          deadline: string | null
          milestone_level: number | null
          completion_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          relationship_id?: string | null
          title: string
          description: string
          type?: string
          difficulty?: string
          xp_reward?: number
          status?: string
          deadline?: string | null
          milestone_level?: number | null
          completion_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string | null
          title?: string
          description?: string
          type?: string
          difficulty?: string
          xp_reward?: number
          status?: string
          deadline?: string | null
          milestone_level?: number | null
          completion_date?: string | null
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          icon: string
          category: string
          unlocked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          icon?: string
          category?: string
          unlocked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          icon?: string
          category?: string
          unlocked_at?: string
        }
      }
      insights: {
        Row: {
          id: string
          relationship_id: string
          interaction_trends: Json | null
          emotional_summary: Json | null
          relationship_forecasts: Json | null
          smart_suggestions: Json | null
          generated_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          interaction_trends?: Json | null
          emotional_summary?: Json | null
          relationship_forecasts?: Json | null
          smart_suggestions?: Json | null
          generated_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          interaction_trends?: Json | null
          emotional_summary?: Json | null
          relationship_forecasts?: Json | null
          smart_suggestions?: Json | null
          generated_at?: string
        }
      }
      level_history: {
        Row: {
          id: string
          relationship_id: string
          old_level: number
          new_level: number
          xp_gained: number
          interaction_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          old_level: number
          new_level: number
          xp_gained: number
          interaction_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          old_level?: number
          new_level?: number
          xp_gained?: number
          interaction_id?: string | null
          created_at?: string
        }
      }
      category_history: {
        Row: {
          id: string
          relationship_id: string
          category_id: string
          change_type: string
          user_confirmed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          category_id: string
          change_type: string
          user_confirmed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          category_id?: string
          change_type?: string
          user_confirmed?: boolean
          created_at?: string
        }
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