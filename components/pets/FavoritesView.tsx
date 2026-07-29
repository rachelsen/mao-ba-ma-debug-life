"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { mockPetProducts } from "@/data/mockPetProducts";

export default function FavoritesView() {
  const { status } = useSession();
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {favoriteProducts.map((product) => (
        <div
          key={product.id}
          className="flex gap-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm"
        >
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
            <div>
              <p className="text-xs font-medium text-amber-800/60">
                {product.brand}
              </p>
              <h3 className="text-sm font-bold text-slate-800">
                {product.name}
              </h3>
              <p className="mt-1 text-sm font-bold text-stone-800">
                NT$ {product.price}
              </p>
            </div>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="mt-2 inline-flex w-fit items-center justify-center gap-1 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600 active:scale-[0.98]"
            >
              🛒 前往官方購買
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
