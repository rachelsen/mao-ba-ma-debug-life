import { NextResponse } from "next/server";
import { getFavoriteCounts } from "@/lib/favorites";

export const dynamic = "force-dynamic";

export async function GET() {
  const counts = await getFavoriteCounts();
  return NextResponse.json({ counts });
}
