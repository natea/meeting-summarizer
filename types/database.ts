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
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          subscription_tier: 'free' | 'pro' | 'enterprise'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          subscription_tier?: 'free' | 'pro' | 'enterprise'
          created_at?: string
        }
      }
      meetings: {
        Row: {
          id: string
          user_id: string
          title: string
          audio_url: string | null
          transcript: string | null
          summary: string | null
          duration: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          audio_url?: string | null
          transcript?: string | null
          summary?: string | null
          duration?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          audio_url?: string | null
          transcript?: string | null
          summary?: string | null
          duration?: number | null
          created_at?: string
        }
      }
      action_items: {
        Row: {
          id: string
          meeting_id: string
          description: string
          assignee: string | null
          priority: 'low' | 'medium' | 'high'
          status: 'pending' | 'completed'
          due_date: string | null
          created_at: string
        }
        Insert: {
          id?: string
          meeting_id: string
          description: string
          assignee?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed'
          due_date?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          meeting_id?: string
          description?: string
          assignee?: string | null
          priority?: 'low' | 'medium' | 'high'
          status?: 'pending' | 'completed'
          due_date?: string | null
          created_at?: string
        }
      }
      usage_tracking: {
        Row: {
          id: string
          user_id: string
          month_year: string
          summaries_count: number
          audio_minutes: number
        }
        Insert: {
          id?: string
          user_id: string
          month_year: string
          summaries_count?: number
          audio_minutes?: number
        }
        Update: {
          id?: string
          user_id?: string
          month_year?: string
          summaries_count?: number
          audio_minutes?: number
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
  }
}