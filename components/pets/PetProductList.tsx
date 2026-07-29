"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  mockPetProducts,
  type CatRating,
  type CatVerdict,
  type PetProduct,
  type PetProductCategory,
} from "@/data/mockPetProducts";

const ALL = "全部分類" as const;
const TABS: (typeof ALL | PetProductCategory)[] = [
  ALL,
  "貓咪主食罐",
  "貓砂/用品",
  "狗狗糧食/零食",
  "毛孩保健品",
];

function getDmbBadgeClass(carb: number, category: PetProductCategory) {
  const isDog = category === "狗狗糧食/零食";
  const passMax = isDog ? 25 : 10;
  return carb < passMax
    ? "border-matcha/40 bg-matcha/10 text-matcha"
    : "border-slate-200 bg-slate-100 text-slate-500";
}

function buildCatVerdictSummary(ratings?: CatRating[]): string | null {
  if (!ratings || ratings.length === 0) return null;
  const groups: Record<CatVerdict, string[]> = { like: [], neutral: [], dislike: [] };
  ratings.forEach((rating) => groups[rating.verdict].push(rating.cat));

  const parts: string[] = [];
  if (groups.like.length) parts.push(`${groups.like.join("、")}愛吃`);
  if (groups.neutral.length) parts.push(`${groups.neutral.join("、")}看心情`);
  if (groups.dislike.length) parts.push(`${groups.dislike.join("、")}不捧場`);
  return parts.join("，");
}

export default function PetProductList() {
  const [activeTab, setActiveTab] = useState<(typeof ALL) | PetProductCategory>(
    ALL
  );

  const filteredProducts = useMemo(() => {
    if (activeTab === ALL) return mockPetProducts;
    return mockPetProducts.filter((product) => product.category === activeTab);
  }, [activeTab]);

  return (
    <section>
      <div className="mb-6 flex items-center gap-2">
        <h2 className="text-xl font-bold text-stone-800 sm:text-2xl">
          🐾 毛拔麻嚴選清單
        </h2>
        <span className="rounded-md border border-milktea/40 bg-milktea/10 px-2 py-0.5 font-mono text-xs text-milktea-dark">
          products.json
        </span>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-milktea bg-milktea text-cream-card"
                  : "border-cream-border bg-cream-card text-stone-600 hover:border-milktea/60 hover:text-milktea-dark"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="rounded-xl border border-dashed border-cream-border p-8 text-center text-stone-400">
          此分類目前尚無商品，敬請期待。
        </p>
      )}
    </section>
  );
}

function ProductCard({ product }: { product: PetProduct }) {
  const hasDiscount =
    product.originalPrice !== undefined &&
    product.originalPrice > product.price;
  const catVerdictSummary = buildCatVerdictSummary(product.ourCatsRating);

  return (
    <article className="flex flex-col gap-6 rounded-2xl border border-amber-100/60 bg-white p-4 shadow-sm transition-all hover:shadow-md md:flex-row md:p-6">
      {/* 左側：圖片與互動 */}
      <div className="flex flex-shrink-0 flex-col gap-3 md:w-1/3 lg:w-1/4">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white">
          <Image
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3"
          />
          <div className="absolute right-2 top-2">
            <LikeButton productId={product.id} />
          </div>
        </div>
        <MyCatLikes productId={product.id} ourCatsRating={product.ourCatsRating} />
      </div>

      {/* 右側：商品完整資訊 */}
      <div className="flex flex-1 flex-col justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-amber-800/60">
            {product.brand}
          </p>
          <h3 className="mb-2 text-xl font-bold text-slate-800">
            {product.name}
          </h3>

          <div className="mb-3 flex flex-wrap gap-2">
            {product.dmbCarb !== undefined && (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${getDmbBadgeClass(product.dmbCarb, product.category)}`}
              >
                DMB 碳水 {product.dmbCarb.toFixed(2)}%
              </span>
            )}
            {product.aafcoCertified !== undefined && (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  product.aafcoCertified
                    ? "border-matcha/40 bg-matcha/10 text-matcha"
                    : "border-amber-500/40 bg-amber-400/10 text-amber-700"
                }`}
              >
                {product.aafcoCertified ? "✅ AAFCO 認證" : "⚠️ 未標示 AAFCO"}
              </span>
            )}
            {product.features?.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-brand-orange/30 bg-brand-orange/10 px-3 py-1 text-xs font-medium text-brand-orange-dark"
              >
                {feature}
              </span>
            ))}
            {product.debugTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-milktea/30 bg-milktea/10 px-3 py-1 font-mono text-xs text-milktea-dark"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="text-sm text-stone-600">{product.review.comment}</p>
          {catVerdictSummary && (
            <p className="mt-1.5 text-sm text-stone-500">
              🐱 三貓評價：{catVerdictSummary}
            </p>
          )}

          <div className="mt-3 grid grid-cols-1 gap-3 rounded-xl bg-amber-50/40 p-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-matcha">👍 優點</p>
              <ul className="mt-1 space-y-0.5 text-xs text-stone-500">
                {product.review.pros.map((pro) => (
                  <li key={pro}>・{pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500">👎 缺點</p>
              <ul className="mt-1 space-y-0.5 text-xs text-stone-500">
                {product.review.cons.map((con) => (
                  <li key={con}>・{con}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            {hasDiscount && (
              <p className="text-xs text-stone-400 line-through">
                NT$ {product.originalPrice}
              </p>
            )}
            <p className="text-lg font-bold text-stone-800">
              NT$ {product.price}
            </p>
            {product.discountNote && (
              <p className="text-xs text-milktea-dark">{product.discountNote}</p>
            )}
          </div>

          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-orange-500 px-6 py-2.5 font-bold text-white transition-all hover:bg-orange-600 active:scale-[0.98]"
          >
            🛒 前往官方購買 / 優惠連結
          </a>
        </div>
      </div>
    </article>
  );
}

function LikeButton({ productId }: { productId: string }) {
  const SEED_LIKES = 12;
  const storageKey = `petfood-like-${productId}`;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(window.localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  const toggleLike = () => {
    const next = !liked;
    setLiked(next);
    window.localStorage.setItem(storageKey, next ? "1" : "0");
  };

  return (
    <button
      type="button"
      onClick={toggleLike}
      aria-pressed={liked}
      className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white/90 px-2.5 py-1 text-xs font-semibold text-rose-500 shadow-sm backdrop-blur transition active:scale-95"
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{SEED_LIKES + (liked ? 1 : 0)}</span>
    </button>
  );
}

function MyCatLikes({
  productId,
  ourCatsRating,
}: {
  productId: string;
  ourCatsRating?: CatRating[];
}) {
  const storageKey = `petfood-mycats-${productId}`;
  const [names, setNames] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setNames(parsed);
    } catch {
      // 忽略毀損的本機資料
    }
  }, [storageKey]);

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed || names.includes(trimmed)) {
      setInput("");
      return;
    }
    const next = [...names, trimmed];
    setNames(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
    setInput("");
    setShowForm(false);
  };

  const likedCats =
    ourCatsRating
      ?.filter((rating) => rating.verdict === "like")
      .map((rating) => rating.cat) ?? [];
  const allNames = [...likedCats, ...names];

  return (
    <div className="text-sm">
      {allNames.length > 0 && (
        <p className="text-xs text-stone-500">推薦的貓咪：{allNames.join("、")}</p>
      )}

      {showForm ? (
        <div className="mt-1.5 flex gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="輸入你家貓咪的名字"
            autoFocus
            className="w-full rounded-lg border border-cream-border bg-white px-3 py-1.5 text-sm text-stone-800 outline-none transition focus:border-milktea focus:ring-1 focus:ring-milktea"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="shrink-0 rounded-lg bg-matcha px-3 py-1.5 text-sm font-semibold text-cream-card transition hover:brightness-105 active:scale-[0.98]"
          >
            送出
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="inline-flex w-full items-center justify-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-100 active:scale-[0.98]"
        >
          ❤️ 我家貓咪也喜歡 (+1)
        </button>
      )}
    </div>
  );
}
