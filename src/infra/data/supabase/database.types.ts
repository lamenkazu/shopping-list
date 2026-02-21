export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      list_invites: {
        Row: {
          created_at: string;
          created_by: string;
          expires_at: string;
          id: string;
          list_id: string;
          revoked_at: string | null;
          token_hash: string;
          uses_count: number;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          expires_at: string;
          id?: string;
          list_id: string;
          revoked_at?: string | null;
          token_hash: string;
          uses_count?: number;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          expires_at?: string;
          id?: string;
          list_id?: string;
          revoked_at?: string | null;
          token_hash?: string;
          uses_count?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'list_invites_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'list_invites_list_id_fkey';
            columns: ['list_id'];
            isOneToOne: false;
            referencedRelation: 'shopping_lists';
            referencedColumns: ['id'];
          },
        ];
      };
      list_members: {
        Row: {
          created_at: string;
          list_id: string;
          role: 'member' | 'owner';
          user_id: string;
        };
        Insert: {
          created_at?: string;
          list_id: string;
          role?: 'member' | 'owner';
          user_id: string;
        };
        Update: {
          created_at?: string;
          list_id?: string;
          role?: 'member' | 'owner';
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'list_members_list_id_fkey';
            columns: ['list_id'];
            isOneToOne: false;
            referencedRelation: 'shopping_lists';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'list_members_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
        };
        Update: {
          created_at?: string;
          full_name?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      shopping_items: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          is_purchased: boolean;
          list_id: string;
          purchased_at: string | null;
          purchased_by: string | null;
          quantity: number | null;
          title: string;
          unit: string | null;
          updated_at: string;
          updated_by: string;
        };
        Insert: {
          created_at?: string;
          created_by: string;
          id?: string;
          is_purchased?: boolean;
          list_id: string;
          purchased_at?: string | null;
          purchased_by?: string | null;
          quantity?: number | null;
          title: string;
          unit?: string | null;
          updated_at?: string;
          updated_by: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          is_purchased?: boolean;
          list_id?: string;
          purchased_at?: string | null;
          purchased_by?: string | null;
          quantity?: number | null;
          title?: string;
          unit?: string | null;
          updated_at?: string;
          updated_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shopping_items_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'shopping_items_list_id_fkey';
            columns: ['list_id'];
            isOneToOne: false;
            referencedRelation: 'shopping_lists';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'shopping_items_purchased_by_fkey';
            columns: ['purchased_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'shopping_items_updated_by_fkey';
            columns: ['updated_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      shopping_lists: {
        Row: {
          created_at: string;
          created_by: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'shopping_lists_created_by_fkey';
            columns: ['created_by'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      accept_invite: {
        Args: { p_token: string };
        Returns: string;
      };
      create_invite: {
        Args: { p_list_id: string };
        Returns: {
          expires_at: string;
          token: string;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
