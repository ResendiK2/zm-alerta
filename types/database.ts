// Example types for your Supabase database
// Update these based on your actual database schema

export interface Alert {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: Alert;
        Insert: Omit<Alert, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Alert, "id" | "created_at" | "updated_at">>;
      };
    };
  };
};
