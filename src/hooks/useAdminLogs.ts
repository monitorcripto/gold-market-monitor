
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLog } from "@/types/adminLogs";

export const useAdminLogs = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      // First get the logs
      const { data: logsData, error: logsError } = await supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (logsError) throw logsError;

      // Then get admin and target user emails separately
      const adminIds = [...new Set(logsData?.map(log => log.admin_id).filter(Boolean) as string[])];
      const targetIds = [...new Set(logsData?.map(log => log.target_user_id).filter(Boolean) as string[])];
      
      const [adminProfiles, targetProfiles] = await Promise.all([
        adminIds.length > 0 ? supabase
          .from('profiles')
          .select('id, email')
          .in('id', adminIds) : Promise.resolve({ data: [] }),
        targetIds.length > 0 ? supabase
          .from('profiles')
          .select('id, email')
          .in('id', targetIds) : Promise.resolve({ data: [] })
      ]);

      // Create lookup maps with proper typing
      const adminEmailMap = new Map<string, string>();
      const targetEmailMap = new Map<string, string>();

      adminProfiles.data?.forEach(profile => {
        if (profile.id && profile.email) {
          adminEmailMap.set(profile.id, profile.email);
        }
      });

      targetProfiles.data?.forEach(profile => {
        if (profile.id && profile.email) {
          targetEmailMap.set(profile.id, profile.email);
        }
      });

      // Combine the data
      const formattedLogs: AdminLog[] = logsData?.map(log => ({
        ...log,
        ip_address: log.ip_address ? String(log.ip_address) : null,
        admin_email: log.admin_id ? adminEmailMap.get(log.admin_id) : undefined,
        target_email: log.target_user_id ? targetEmailMap.get(log.target_user_id) : undefined
      })) || [];

      setLogs(formattedLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { logs, loading, refetch: fetchLogs };
};
