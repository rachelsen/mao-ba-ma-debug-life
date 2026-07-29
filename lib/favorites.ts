import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

/** 統計每個商品被收藏的人數；Supabase 未設定時回傳空物件。 */
export async function getFavoriteCounts(): Promise<Record<string, number>> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return {};

  const { data, error } = await supabase.from("favorites").select("product_id");
  if (error || !data) return {};

  const counts: Record<string, number> = {};
  for (const row of data) {
    counts[row.product_id] = (counts[row.product_id] ?? 0) + 1;
  }
  return counts;
}

/** 取得指定使用者已收藏的商品 id 清單；Supabase 未設定時回傳空陣列。 */
export async function getUserFavoriteIds(userEmail: string): Promise<string[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select("product_id")
    .eq("user_email", userEmail);
  if (error || !data) return [];

  return data.map((row) => row.product_id as string);
}

/** 切換收藏狀態，回傳切換後是否為已收藏。 */
export async function toggleFavorite(
  userEmail: string,
  productId: string
): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("Supabase 尚未設定");

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_email", userEmail)
    .eq("product_id", productId)
    .maybeSingle();

  if (existing) {
    await supabase.from("favorites").delete().eq("id", existing.id);
    return false;
  }

  await supabase.from("favorites").insert({ user_email: userEmail, product_id: productId });
  return true;
}
