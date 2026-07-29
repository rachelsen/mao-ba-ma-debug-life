import type { Metadata } from "next";
import FavoritesView from "@/components/pets/FavoritesView";

export const metadata: Metadata = {
  title: "我的收藏｜毛拔麻 Debug 生活",
  description: "查看你收藏的所有商品，方便直接前往購買。",
};

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-cream-bg">
      <header className="border-b border-cream-border bg-gradient-to-b from-cream-bg-light via-cream-bg to-cream-bg px-4 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-extrabold text-stone-800 sm:text-4xl">
            ❤️ 我的收藏
          </h1>
          <p className="mt-3 text-sm text-stone-500 sm:text-base">
            這裡整理了你按過愛心收藏的商品，方便直接前往購買。
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-8">
        <FavoritesView />
      </div>
    </main>
  );
}
