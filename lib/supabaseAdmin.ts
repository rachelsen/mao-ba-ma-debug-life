import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

/** 回傳 Supabase 伺服端用戶端；若尚未設定環境變數則回傳 null（功能優雅降級，不中斷建置）。 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (client !== undefined) return client;

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  client =
    url && serviceRoleKey
      ? createClient(url, serviceRoleKey, { auth: { persistSession: false } })
      : null;

  return client;
}
