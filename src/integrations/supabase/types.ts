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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ad_packages: {
        Row: {
          created_at: string
          duration: number
          id: string
          is_featured: boolean
          name_bn: string
          name_en: string
          price: number
        }
        Insert: {
          created_at?: string
          duration?: number
          id?: string
          is_featured?: boolean
          name_bn: string
          name_en: string
          price?: number
        }
        Update: {
          created_at?: string
          duration?: number
          id?: string
          is_featured?: boolean
          name_bn?: string
          name_en?: string
          price?: number
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          is_read: boolean
          message: string
          name: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          is_read?: boolean
          message: string
          name: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          is_read?: boolean
          message?: string
          name?: string
          subject?: string | null
        }
        Relationships: []
      }
      contact_unlocks: {
        Row: {
          created_at: string
          id: string
          land_id: string
          purchase_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          land_id: string
          purchase_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          land_id?: string
          purchase_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_unlocks_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_unlocks_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "unlock_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          land_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          land_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          land_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
        ]
      }
      lands: {
        Row: {
          area_size: number
          created_at: string
          description_bn: string | null
          description_en: string | null
          id: string
          images: string[] | null
          is_featured: boolean
          land_type: string
          location_bn: string
          location_en: string
          owner_address: string | null
          owner_name: string
          owner_phone: string
          price: number
          road_width: number
          status: string
          title_bn: string
          title_en: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          area_size?: number
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean
          land_type?: string
          location_bn?: string
          location_en?: string
          owner_address?: string | null
          owner_name?: string
          owner_phone?: string
          price?: number
          road_width?: number
          status?: string
          title_bn: string
          title_en: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          area_size?: number
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean
          land_type?: string
          location_bn?: string
          location_en?: string
          owner_address?: string | null
          owner_name?: string
          owner_phone?: string
          price?: number
          road_width?: number
          status?: string
          title_bn?: string
          title_en?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          account_number: string
          created_at: string
          id: string
          is_active: boolean
          method_name: string
          payment_type: string
        }
        Insert: {
          account_number: string
          created_at?: string
          id?: string
          is_active?: boolean
          method_name: string
          payment_type?: string
        }
        Update: {
          account_number?: string
          created_at?: string
          id?: string
          is_active?: boolean
          method_name?: string
          payment_type?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          land_id: string | null
          package_id: string | null
          payment_method_id: string | null
          payment_type: string
          sender_number: string | null
          sender_transaction_id: string | null
          status: string
          transaction_id: string | null
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          land_id?: string | null
          package_id?: string | null
          payment_method_id?: string | null
          payment_type: string
          sender_number?: string | null
          sender_transaction_id?: string | null
          status?: string
          transaction_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          land_id?: string | null
          package_id?: string | null
          payment_method_id?: string | null
          payment_type?: string
          sender_number?: string | null
          sender_transaction_id?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "ad_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          land_id: string | null
          rating: number
          reviewer_name: string
          status: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          land_id?: string | null
          rating?: number
          reviewer_name?: string
          status?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          land_id?: string | null
          rating?: number
          reviewer_name?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
        ]
      }
      unlock_packages: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name_bn: string
          name_en: string
          price: number
          unlock_count: number
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_bn: string
          name_en: string
          price?: number
          unlock_count?: number
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_bn?: string
          name_en?: string
          price?: number
          unlock_count?: number
        }
        Relationships: []
      }
      unlock_purchases: {
        Row: {
          created_at: string
          id: string
          package_id: string | null
          payment_method_id: string | null
          sender_number: string | null
          sender_transaction_id: string | null
          status: string
          total_unlocks: number
          used_unlocks: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          package_id?: string | null
          payment_method_id?: string | null
          sender_number?: string | null
          sender_transaction_id?: string | null
          status?: string
          total_unlocks?: number
          used_unlocks?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          package_id?: string | null
          payment_method_id?: string | null
          sender_number?: string | null
          sender_transaction_id?: string | null
          status?: string
          total_unlocks?: number
          used_unlocks?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "unlock_purchases_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "unlock_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unlock_purchases_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
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
          role: Database["public"]["Enums"]["app_role"]
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
