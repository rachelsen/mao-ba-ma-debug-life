"use client";

import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import {
  mockPetProducts,
  type CatRating,
  type CatVerdict,
  type LitterSubCategory,
  type PetProduct,
  type PetProductCategory,
} from "@/data/mockPetProducts";

const ALL = "全部分類" as const;
const ALL_BRANDS = "全部品牌" as const;
const ALL_LITTER = "全部" as const;

const TABS: (typeof ALL | PetProductCategory)[] = [
  ALL,
  "貓咪主食罐",
  "貓砂/用品",
  "狗狗主食罐",
  "毛孩保健品",
];

const LITTER_SUB_CATEGORIES: LitterSubCategory[] = ["礦砂", "豆腐砂", "用品"];

function getDmbBadgeClass(carb: number, category: PetProductCategory) {
  const isDog = category === "狗狗主食罐";
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
  const { status } = useSession();
  const [activeTab, setActiveTab] = useState<(typeof ALL) | PetProductCategory>(
    ALL
  );
  const [brandFilter, setBrandFilter] = useState<string>(ALL_BRANDS);
  const [litterFilter, setLitterFilter] = useState<
    typeof ALL_LITTER | LitterSubCategory
  >(ALL_LITTER);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const handleTabChange = (tab: (typeof ALL) | PetProductCategory) => {
    setActiveTab(tab);
    setBrandFilter(ALL_BRANDS);
    setLitterFilter(ALL_LITTER);
  };

  useEffect(() => {
    fetch("/api/favorites/counts")
      .then((res) => res.json())
      .then((data) => setCounts(data.counts ?? {}))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (status !== "authenticated") {
      setLikedIds(new Set());
      return;
    }
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => setLikedIds(new Set<string>(data.favorites ?? [])))
      .catch(() => {});
  }, [status]);

  const handleToggleLike = async (productId: string) => {
    if (status !== "authenticated") {
      signIn("google");
      return;
    }

    const wasLiked = likedIds.has(productId);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (wasLiked) next.delete(productId);
      else next.add(productId);
      return next;
    });
    setCounts((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] ?? 0) + (wasLiked ? -1 : 1)),
    }));

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("toggle failed");
    } catch {
      // 失敗時重新從伺服器同步正確狀態
      fetch("/api/favorites/counts")
        .then((res) => res.json())
        .then((data) => setCounts(data.counts ?? {}))
        .catch(() => {});
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => setLikedIds(new Set<string>(data.favorites ?? [])))
        .catch(() => {});
    }
  };

  const catCanBrands = useMemo(
    () =>
      Array.from(
        new Set(
          mockPetProducts
            .filter((product) => product.category === "貓咪主食罐")
            .map((product) => product.brand)
        )
      ),
    []
  );

  const filteredProducts = useMemo(() => {
    let products =
      activeTab === ALL
        ? mockPetProducts
        : mockPetProducts.filter((product) => product.category === activeTab);

    if (activeTab === "貓咪主食罐" && brandFilter !== ALL_BRANDS) {
      products = products.filter((product) => product.brand === brandFilter);
    }
    if (activeTab === "貓砂/用品" && litterFilter !== ALL_LITTER) {
      products = products.filter(
        (product) => product.litterSubCategory === litterFilter
      );
    }
    return products;
  }, [activeTab, brandFilter, litterFilter]);

  const favoriteProducts = useMemo(
    () => mockPetProducts.filter((product) => likedIds.has(product.id)),
    [likedIds]
  );

  return (
    <section>
      {status === "authenticated" && favoriteProducts.length > 0 && (
        <div className="mb-8 rounded-2xl border border-rose-200/60 bg-rose-50/40 p-4 sm:p-6">
          <h3 className="mb-4 flex items-center gap-1.5 text-base font-bold text-stone-800">
            ❤️ 我的收藏（{favoriteProducts.length}）
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="flex w-36 shrink-0 flex-col gap-2 rounded-xl border border-rose-100 bg-white p-3 sm:w-40"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-cream-bg-light">
                  <Image
                    src={product.image}
                    alt={`${product.brand} ${product.name}`}
                    fill
                    sizes="160px"
                    className="object-contain p-2"
                  />
                </div>
                <p className="line-clamp-2 text-xs font-medium text-stone-700">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-stone-800">
                  NT$ {product.price}
                </p>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-1 rounded-lg bg-orange-500 px-2 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600 active:scale-[0.98]"
                >
                  🛒 前往官方購買
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center gap-2">
        <h2 className="text-xl font-bold text-stone-800 sm:text-2xl">
          🐾 毛拔麻嚴選清單
        </h2>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
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

      {activeTab === "貓咪主食罐" && catCanBrands.length > 0 && (
        <div className="mb-6">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-cream-border bg-white px-3 py-2 text-sm text-stone-700 outline-none transition focus:border-milktea focus:ring-1 focus:ring-milktea sm:w-auto"
          >
            <option value={ALL_BRANDS}>{ALL_BRANDS}</option>
            {catCanBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      )}

      {activeTab === "貓砂/用品" && (
        <div className="mb-6">
          <select
            value={litterFilter}
            onChange={(e) =>
              setLitterFilter(e.target.value as typeof ALL_LITTER | LitterSubCategory)
            }
            className="w-full max-w-xs rounded-lg border border-cream-border bg-white px-3 py-2 text-sm text-stone-700 outline-none transition focus:border-milktea focus:ring-1 focus:ring-milktea sm:w-auto"
          >
            <option value={ALL_LITTER}>{ALL_LITTER}</option>
            {LITTER_SUB_CATEGORIES.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            liked={likedIds.has(product.id)}
            count={counts[product.id] ?? 0}
            onToggleLike={handleToggleLike}
          />
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

function ProductCard({
  product,
  liked,
  count,
  onToggleLike,
}: {
  product: PetProduct;
  liked: boolean;
  count: number;
  onToggleLike: (productId: string) => void;
}) {
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
            <LikeButton
              liked={liked}
              count={count}
              onToggle={() => onToggleLike(product.id)}
            />
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

function LikeButton({
  liked,
  count,
  onToggle,
}: {
  liked: boolean;
  count: number;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={liked}
      title={liked ? "取消收藏" : "登入後即可收藏"}
      className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white/90 px-2.5 py-1 text-xs font-semibold text-rose-500 shadow-sm backdrop-blur transition active:scale-95"
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{count}</span>
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
