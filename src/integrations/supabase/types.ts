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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_reminders: {
        Row: {
          admin_user_id: string | null
          created_at: string
          id: string
          message: string
          recipient_count: number
          target: string
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          message: string
          recipient_count?: number
          target: string
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string
          id?: string
          message?: string
          recipient_count?: number
          target?: string
        }
        Relationships: []
      }
      bills: {
        Row: {
          amount: number
          bill_number: string
          billing_month: string
          consumer_id: string | null
          created_at: string
          due_date: string
          id: string
          status: string
          units_consumed: number
          user_id: string
        }
        Insert: {
          amount?: number
          bill_number: string
          billing_month: string
          consumer_id?: string | null
          created_at?: string
          due_date: string
          id?: string
          status?: string
          units_consumed?: number
          user_id: string
        }
        Update: {
          amount?: number
          bill_number?: string
          billing_month?: string
          consumer_id?: string | null
          created_at?: string
          due_date?: string
          id?: string
          status?: string
          units_consumed?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bills_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      consumer_bill_detail: {
        Row: {
          bill_amount: number
          bill_date: string
          bill_sequence: number
          consumer_number: string
          created_at: string
          due_date: string
          prompt_amount: number
          prompt_date: string
          user_id: string
        }
        Insert: {
          bill_amount?: number
          bill_date: string
          bill_sequence?: never
          consumer_number: string
          created_at?: string
          due_date: string
          prompt_amount?: number
          prompt_date: string
          user_id: string
        }
        Update: {
          bill_amount?: number
          bill_date?: string
          bill_sequence?: never
          consumer_number?: string
          created_at?: string
          due_date?: string
          prompt_amount?: number
          prompt_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumer_bill_detail_consumer_number_fkey"
            columns: ["consumer_number"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
        ]
      }
      consumer_payment_detail: {
        Row: {
          amount_paid: number
          consumer_number: string
          created_at: string
          entry_date_time: string
          payment_date_time: string
          payment_sequence: number
          user_id: string
        }
        Insert: {
          amount_paid?: number
          consumer_number: string
          created_at?: string
          entry_date_time?: string
          payment_date_time: string
          payment_sequence?: never
          user_id: string
        }
        Update: {
          amount_paid?: number
          consumer_number?: string
          created_at?: string
          entry_date_time?: string
          payment_date_time?: string
          payment_sequence?: never
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consumer_payment_detail_consumer_number_fkey"
            columns: ["consumer_number"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
        ]
      }
      consumers: {
        Row: {
          address: string | null
          consumer_no: string
          created_at: string
          id: string
          meter_no: string
          name: string
          status: string
          user_id: string
        }
        Insert: {
          address?: string | null
          consumer_no: string
          created_at?: string
          id?: string
          meter_no: string
          name: string
          status?: string
          user_id: string
        }
        Update: {
          address?: string | null
          consumer_no?: string
          created_at?: string
          id?: string
          meter_no?: string
          name?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          bill_id: string | null
          created_at: string
          id: string
          payment_method: string
          status: string
          transaction_id: string
          user_id: string
        }
        Insert: {
          amount: number
          bill_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string
          status?: string
          transaction_id: string
          user_id: string
        }
        Update: {
          amount?: number
          bill_id?: string | null
          created_at?: string
          id?: string
          payment_method?: string
          status?: string
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_bill_id_fkey"
            columns: ["bill_id"]
            isOneToOne: false
            referencedRelation: "bills"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          category: string
          created_at: string
          feedback: string | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          feedback?: string | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: []
      }
      usage_data: {
        Row: {
          consumer_id: string | null
          created_at: string
          date: string
          id: string
          kwh: number
          user_id: string
        }
        Insert: {
          consumer_id?: string | null
          created_at?: string
          date: string
          id?: string
          kwh?: number
          user_id: string
        }
        Update: {
          consumer_id?: string | null
          created_at?: string
          date?: string
          id?: string
          kwh?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_data_consumer_id_fkey"
            columns: ["consumer_id"]
            isOneToOne: false
            referencedRelation: "consumers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
