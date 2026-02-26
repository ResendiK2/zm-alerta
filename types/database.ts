import { AlertType } from "./alert";

// Types for Supabase database
export interface DatabaseAlert {
  id: string;
  type: AlertType;
  latitude: number;
  longitude: number;
  created_at: string;
  expires_at: string;
}

export type Database = {
  public: {
    Tables: {
      alerts: {
        Row: DatabaseAlert;
        Insert: Omit<DatabaseAlert, "id" | "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Omit<DatabaseAlert, "id" | "created_at">>;
      };
    };
  };
};
