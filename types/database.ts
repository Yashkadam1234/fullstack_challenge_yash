export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string
          title: string
          content: string | null
          user_id: string
          category_id: string | null
          is_archived: boolean
          is_public: boolean
          share_id: string | null
          ai_summary: string | null
          ai_action_items: string[] | null
          suggested_title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          user_id: string
          category_id?: string | null
          is_archived?: boolean
          is_public?: boolean
          share_id?: string | null
          ai_summary?: string | null
          ai_action_items?: string[] | null
          suggested_title?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          content?: string | null
          category_id?: string | null
          is_archived?: boolean
          is_public?: boolean
          share_id?: string | null
          ai_summary?: string | null
          ai_action_items?: string[] | null
          suggested_title?: string | null
          updated_at?: string
        }
      }

      tags: {
        Row: {
          id: string
          name: string
          user_id: string
          color: string | null
          note_count: number
          created_at: string
        }
      }

      categories: {
        Row: {
          id: string
          name: string
          user_id: string
          color: string | null
          created_at: string
        }
      }
    }
  }
}