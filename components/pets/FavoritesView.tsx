"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { mockPetProducts } from "@/data/mockPetProducts";
import { useFavoriteQuantities } from "@/lib/useFavoriteQuantities";

export default function FavoritesView() {
  const { status } = useSession();
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);
  const { getQuantity, setQuantity } = useFavoriteQuantities();

  useEffect(() => {
    if (status !== "authenticated") {
      setLikedIds(new Set());
      setLoaded(true);
      return;
    }
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => setLikedIds(new Set<string>(data.favorites ?? [])))
      .finally(() => setLoaded(true));
  }, [status]);

  const favoriteProducts = mockPetProducts.filter((product) =>
    likedIds.has(product.id)
  );

  const handleRemove = async (productId: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("remove failed");
    } catch {
      // 失敗時重新從伺服器同步正確狀態
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => setLikedIds(new Set<string>(data.favorites ?? [])))
        .catch(() => {});
    }
  };

  if (status !== "authenticated") {
    return (
      <div className="rounded-2xl border border-cream-border bg-white p-10 text-center">
        <p className="text-stone-500">登入後即可查看你收藏的商品。</p>
        <button
          type="button"
          onClick={() => signIn("google")}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-orange/30 transition hover:bg-brand-orange-dark active:scale-[0.98]"
        >
          使用 Google 登入
        </button>
      </div>
    );
  }

  if (!loaded) return null;

  if (favoriteProducts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-cream-border bg-white p-10 text-center">
        <p className="text-stone-500">你還沒有收藏任何商品。</p>
        <Link
          href="/pets"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-orange hover:underline"
        >
          前往寵物專區看看 →
        </Link>
      </div>
    );
  }

  const monthlyTotal = favoriteProducts.reduce(
    (sum, product) => sum + product.price * getQuantity(product.id),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/10 p-5 text-center sm:text-left">
        <p className="text-sm font-medium text-brand-orange-dark">
          💡 本月伙食費估算
        </p>
        <p className="mt-1 text-3xl font-extrabold text-stone-800">
          NT$ {monthlyTotal.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-stone-500">
          （依據您設定的預估數量計算，點擊卡片按鈕可直接跳轉至賣場複製下單數量）
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {favoriteProducts.map((product) => {
          const quantity = getQuantity(product.id);
          return (
            <div
              key={product.id}
              className="relative flex gap-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
            >
              <button
                type="button"
                onClick={() => handleRemove(product.id)}
                aria-label="取消收藏"
                title="取消收藏"
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-stone-400 shadow-sm transition hover:bg-rose-50 hover:text-rose-500 active:scale-95"
              >
                ✕
              </button>
              <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-cream-bg-light">
                <Image
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="pr-6">
                  <p className="text-xs font-medium text-amber-800/60">
                    {product.brand}
                  </p>
                  <h3 className="text-sm font-bold text-slate-800">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-stone-800">
                    NT$ {product.price}
                    <span className="ml-1 font-normal text-stone-400">
                      × {quantity} = NT$ {product.price * quantity}
                    </span>
                  </p>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-full border border-cream-border bg-cream-bg-light px-1 py-1">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(product.id, quantity - 1)
                      }
                      disabled={quantity <= 1}
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-stone-600 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-sm font-semibold text-stone-700">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(product.id, quantity + 1)
                      }
                      className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-bold text-stone-600 shadow-sm transition active:scale-95"
                    >
                      ＋
                    </button>
                  </div>

                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600 active:scale-[0.98]"
                  >
                    🛒 前往購買 ({quantity}罐)
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
