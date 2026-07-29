import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserFavoriteIds, toggleFavorite } from "@/lib/favorites";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ favorites: [] });
  }

  const favorites = await getUserFavoriteIds(session.user.email);
  return NextResponse.json({ favorites });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const productId = body?.productId;
  if (!productId || typeof productId !== "string") {
    return NextResponse.json({ error: "缺少 productId" }, { status: 400 });
  }

  try {
    const liked = await toggleFavorite(session.user.email, productId);
    return NextResponse.json({ liked });
  } catch {
    return NextResponse.json({ error: "收藏功能尚未設定完成" }, { status: 503 });
  }
}
