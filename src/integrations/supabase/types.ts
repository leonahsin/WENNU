export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      case_attachments: {
        Row: {
          attachment_type: Database["public"]["Enums"]["attachment_type"];
          case_id: string;
          created_at: string;
          id: string;
          mime_type: string;
          original_filename: string;
          size_bytes: number;
          storage_path: string;
        };
        Insert: {
          attachment_type: Database["public"]["Enums"]["attachment_type"];
          case_id: string;
          created_at?: string;
          id?: string;
          mime_type: string;
          original_filename: string;
          size_bytes: number;
          storage_path: string;
        };
        Update: {
          attachment_type?: Database["public"]["Enums"]["attachment_type"];
          case_id?: string;
          created_at?: string;
          id?: string;
          mime_type?: string;
          original_filename?: string;
          size_bytes?: number;
          storage_path?: string;
        };
        Relationships: [
          {
            foreignKeyName: "case_attachments_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "support_cases";
            referencedColumns: ["id"];
          },
        ];
      };
      case_events: {
        Row: {
          actor_user_id: string | null;
          case_id: string;
          created_at: string;
          event_type: string;
          id: string;
          internal_note: string | null;
          new_status: Database["public"]["Enums"]["case_status"] | null;
          previous_status: Database["public"]["Enums"]["case_status"] | null;
        };
        Insert: {
          actor_user_id?: string | null;
          case_id: string;
          created_at?: string;
          event_type: string;
          id?: string;
          internal_note?: string | null;
          new_status?: Database["public"]["Enums"]["case_status"] | null;
          previous_status?: Database["public"]["Enums"]["case_status"] | null;
        };
        Update: {
          actor_user_id?: string | null;
          case_id?: string;
          created_at?: string;
          event_type?: string;
          id?: string;
          internal_note?: string | null;
          new_status?: Database["public"]["Enums"]["case_status"] | null;
          previous_status?: Database["public"]["Enums"]["case_status"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "case_events_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "support_cases";
            referencedColumns: ["id"];
          },
        ];
      };
      case_submission_throttle: {
        Row: {
          fingerprint: string;
          submission_count: number;
          window_started_at: string;
        };
        Insert: {
          fingerprint: string;
          submission_count?: number;
          window_started_at?: string;
        };
        Update: {
          fingerprint?: string;
          submission_count?: number;
          window_started_at?: string;
        };
        Relationships: [];
      };
      support_cases: {
        Row: {
          created_at: string;
          customer_email: string;
          damaged_or_leaking_battery: boolean;
          id: string;
          issue_description: string;
          issue_started_at: string | null;
          issue_title: string;
          locale: Database["public"]["Enums"]["case_locale"];
          market: Database["public"]["Enums"]["market_code"];
          optional_product_identifier: string | null;
          order_reference: string | null;
          pet_guide: Database["public"]["Enums"]["pet_guide"];
          privacy_consent_version: string;
          product_code: string;
          public_reference: string;
          purchase_channel: string;
          purchase_date: string | null;
          setup_state: Database["public"]["Enums"]["setup_state"];
          status: Database["public"]["Enums"]["case_status"];
          steps_already_tried: string[];
          submission_key: string;
          support_topic: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          customer_email: string;
          damaged_or_leaking_battery?: boolean;
          id?: string;
          issue_description: string;
          issue_started_at?: string | null;
          issue_title: string;
          locale: Database["public"]["Enums"]["case_locale"];
          market: Database["public"]["Enums"]["market_code"];
          optional_product_identifier?: string | null;
          order_reference?: string | null;
          pet_guide: Database["public"]["Enums"]["pet_guide"];
          privacy_consent_version: string;
          product_code?: string;
          public_reference: string;
          purchase_channel: string;
          purchase_date?: string | null;
          setup_state: Database["public"]["Enums"]["setup_state"];
          status?: Database["public"]["Enums"]["case_status"];
          steps_already_tried?: string[];
          submission_key: string;
          support_topic: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          customer_email?: string;
          damaged_or_leaking_battery?: boolean;
          id?: string;
          issue_description?: string;
          issue_started_at?: string | null;
          issue_title?: string;
          locale?: Database["public"]["Enums"]["case_locale"];
          market?: Database["public"]["Enums"]["market_code"];
          optional_product_identifier?: string | null;
          order_reference?: string | null;
          pet_guide?: Database["public"]["Enums"]["pet_guide"];
          privacy_consent_version?: string;
          product_code?: string;
          public_reference?: string;
          purchase_channel?: string;
          purchase_date?: string | null;
          setup_state?: Database["public"]["Enums"]["setup_state"];
          status?: Database["public"]["Enums"]["case_status"];
          steps_already_tried?: string[];
          submission_key?: string;
          support_topic?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      support_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["support_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["support_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["support_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_support_role: {
        Args: {
          _role: Database["public"]["Enums"]["support_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_support_staff: { Args: { _user_id: string }; Returns: boolean };
    };
    Enums: {
      attachment_type: "proof_of_purchase" | "complete_product" | "issue_closeup" | "additional";
      case_locale: "en-US" | "ja-JP";
      case_status: "new" | "triaged" | "awaiting_customer" | "in_review" | "resolved" | "closed";
      market_code: "US" | "JP";
      pet_guide: "dog" | "cat" | "not_applicable";
      setup_state: "bare" | "blue_silicone_cover";
      support_role: "admin" | "support";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      attachment_type: ["proof_of_purchase", "complete_product", "issue_closeup", "additional"],
      case_locale: ["en-US", "ja-JP"],
      case_status: ["new", "triaged", "awaiting_customer", "in_review", "resolved", "closed"],
      market_code: ["US", "JP"],
      pet_guide: ["dog", "cat", "not_applicable"],
      setup_state: ["bare", "blue_silicone_cover"],
      support_role: ["admin", "support"],
    },
  },
} as const;
