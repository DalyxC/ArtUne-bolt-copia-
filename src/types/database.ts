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
          role: 'artist' | 'client' | 'admin'
          full_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: 'artist' | 'client' | 'admin'
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'artist' | 'client' | 'admin'
          full_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      artist_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string
          bio: string | null
          profile_image_url: string | null
          portfolio_images: string[] | null
          location: string | null
          years_experience: number | null
          hourly_rate: number | null
          availability_status: 'available' | 'busy' | 'unavailable'
          verified: boolean
          last_active: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          bio?: string | null
          profile_image_url?: string | null
          portfolio_images?: string[] | null
          location?: string | null
          years_experience?: number | null
          hourly_rate?: number | null
          availability_status?: 'available' | 'busy' | 'unavailable'
          verified?: boolean
          last_active?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          bio?: string | null
          profile_image_url?: string | null
          portfolio_images?: string[] | null
          location?: string | null
          years_experience?: number | null
          hourly_rate?: number | null
          availability_status?: 'available' | 'busy' | 'unavailable'
          verified?: boolean
          last_active?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      artist_services: {
        Row: {
          id: string
          artist_id: string
          category: string
          title: string
          description: string | null
          price: number | null
          price_type: 'fixed' | 'hourly' | 'negotiable'
          duration_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          artist_id: string
          category: string
          title: string
          description?: string | null
          price?: number | null
          price_type?: 'fixed' | 'hourly' | 'negotiable'
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          artist_id?: string
          category?: string
          title?: string
          description?: string | null
          price?: number | null
          price_type?: 'fixed' | 'hourly' | 'negotiable'
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
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
