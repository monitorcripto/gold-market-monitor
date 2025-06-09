
export interface AdminLog {
  id: string;
  admin_id: string | null;
  action_type: string;
  target_user_id?: string | null;
  details?: any;
  ip_address?: string | null;
  created_at: string;
  admin_email?: string;
  target_email?: string;
}
