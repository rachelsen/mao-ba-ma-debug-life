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
  type PetProductDetailedAnalysis,
  type PetProductPartialNutrition,
  type PetProductOfficialFiling,
  type PetProductPrescriptionInfo,
} from "@/data/mockPetProducts";
import { useFavoriteQuantities } from "@/lib/useFavoriteQuantities";

const ALL = "全部分類" as const;
const ALL_BRANDS = "全部品牌" as const;
const ALL_LITTER = "全部" as const;

const TABS: (typeof ALL | PetProductCategory)[] = [
  ALL,
  "貓咪主食罐",
  "貓咪乾糧",
  "貓砂/用品",
  "狗狗主食罐",
  "狗狗乾糧",
  "毛孩保健品",
  "處方飼料",
];

const LITTER_SUB_CATEGORIES: LitterSubCategory[] = ["礦砂", "豆腐砂", "用品"];

function getDmbBadgeClass(carb: number, category: PetProductCategory) {
  const isDog = category === "狗狗主食罐" || category === "狗狗乾糧";
  const passMax = isDog ? 25 : 10;
  return carb < passMax
    ? "border-matcha/40 bg-matcha/10 text-matcha"
    : "border-slate-200 bg-slate-100 text-slate-500";
}

const COUNTRY_FLAG_EMOJI: Record<string, string> = {
  台灣: "🇹🇼",
  日本: "🇯🇵",
  韓國: "🇰🇷",
  中國: "🇨🇳",
  美國: "🇺🇸",
  加拿大: "🇨🇦",
  紐西蘭: "🇳🇿",
  澳洲: "🇦🇺",
  泰國: "🇹🇭",
  德國: "🇩🇪",
  法國: "🇫🇷",
  英國: "🇬🇧",
  義大利: "🇮🇹",
  荷蘭: "🇳🇱",
};

function getCountryFlagEmoji(country: string): string {
  return COUNTRY_FLAG_EMOJI[country] ?? "";
}

function getFilterTags(product: PetProduct): string[] {
  return [
    ...(product.features ?? []),
    ...product.debugTags,
    ...(product.detailedAnalysis?.productType
      ? [product.detailedAnalysis.productType]
      : []),
  ];
}

/** 從保證分析（以現狀為準）數值，換算出乾物比與熱量佔比對照表所需的數字 */
function computeAnalysisTable(analysis: PetProductDetailedAnalysis) {
  const { moisture, protein, fat, fiber, ash, phosphorus, kcalPer100g } = analysis;
  const dryMatter = 100 - moisture;
  const carbAsFed = Math.max(
    0,
    100 - moisture - protein - fat - ash - fiber
  );

  const toDm = (value: number) => (value / dryMatter) * 100;

  // 修正版 Atwater 熱量係數：蛋白質 3.5、脂肪 8.5、碳水 3.5 kcal/g
  const proteinKcal = protein * 3.5;
  const fatKcal = fat * 8.5;
  const carbKcal = carbAsFed * 3.5;
  const totalMacroKcal = proteinKcal + fatKcal + carbKcal;
  const toMePercent = (kcal: number) =>
    totalMacroKcal > 0 ? (kcal / totalMacroKcal) * 100 : 0;

  return {
    carbAsFed,
    dm: {
      protein: toDm(protein),
      fat: toDm(fat),
      carb: toDm(carbAsFed),
      fiber: toDm(fiber),
      ash: toDm(ash),
    },
    me: {
      protein: toMePercent(proteinKcal),
      fat: toMePercent(fatKcal),
      carb: toMePercent(carbKcal),
      phosphorusMgPer100kcal:
        kcalPer100g > 0 ? ((phosphorus * 1000) / kcalPer100g) * 100 : 0,
    },
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function isDogCategory(category: PetProductCategory) {
  return category === "狗狗主食罐" || category === "狗狗乾糧";
}

function isDryCategory(category: PetProductCategory) {
  return category === "貓咪乾糧" || category === "狗狗乾糧";
}

interface ProductScoreBreakdownItem {
  label: string;
  /** null 代表資料不足，無法計分 */
  points: number | null;
  max: number;
  detail: string;
}

interface ProductScore {
  total: number;
  band: { label: string; className: string };
  capped: boolean;
  items: ProductScoreBreakdownItem[];
  /** true 代表灰分/磷/熱量等資料不足，只用磷、鈣磷比以外的項目估算並按比例換算成 100 分制 */
  isEstimate: boolean;
}

function getScoreBand(total: number) {
  if (total >= 75)
    return { label: "優質主食", className: "text-matcha border-matcha/40 bg-matcha/10" };
  if (total >= 60)
    return { label: "均衡日常", className: "text-sky-600 border-sky-400/40 bg-sky-50" };
  if (total >= 45)
    return { label: "基礎配方", className: "text-amber-600 border-amber-400/40 bg-amber-50" };
  return { label: "建議搭配", className: "text-rose-600 border-rose-400/40 bg-rose-50" };
}

// 碳水（25分）：依犬貓、乾濕標準不同（乾糧需要澱粉塑形，門檻比主食罐寬鬆）
function scoreCarb(dmCarb: number, isDog: boolean, isDry: boolean) {
  const ceiling = isDry ? (isDog ? 55 : 50) : isDog ? 40 : 25;
  return clamp((25 * (ceiling - dmCarb)) / ceiling, 0, 25);
}

// 蛋白質（15分）：以乾物比（DM）蛋白質，從犬貓 AAFCO 最低標準往上算
function scoreProtein(dmProtein: number, isDog: boolean) {
  const floor = isDog ? 18 : 26;
  const ceiling = isDog ? 35 : 45;
  return clamp((15 * (dmProtein - floor)) / (ceiling - floor), 0, 15);
}

/**
 * 毛拔麻自訂的 0-100 分評分邏輯（非取自其他網站的黑箱演算法）。
 * 資料完整（detailedAnalysis）時計算完整 5 項；只有部分揭露資料
 * （partialNutrition.estimateInputs）時，磷與鈣磷比會標示「資料不足」，
 * 剩下 3 項（碳水/AAFCO/蛋白質，滿分60）依比例換算成 100 分制估算分數。
 * 兩者皆無資料時回傳 null，不硬算分數。
 */
function computeProductScore(product: PetProduct): ProductScore | null {
  // 處方飼料是為特定病理狀況設計（例如刻意降蛋白／調整礦物質），
  // 套用一般保健飼料的評分邏輯會誤導使用者，故一律不計分。
  if (product.category === "處方飼料") return null;

  const isDog = isDogCategory(product.category);
  const isDry = isDryCategory(product.category);
  const analysis = product.detailedAnalysis;

  if (analysis) {
    const { dm, me } = computeAnalysisTable(analysis);

    // 磷（25分）：以每 100kcal 磷含量計算，對齊 NRC 攝取上限 2.5–3.5g/1000kcal，≤250mg 滿分，≥400mg 0分
    const phosphorusScore = clamp(
      (25 * (400 - me.phosphorusMgPer100kcal)) / (400 - 250),
      0,
      25
    );
    const carbScore = scoreCarb(dm.carb, isDog, isDry);
    const aafcoScore = product.aafcoCertified ? 20 : 0;

    // 鈣磷比（15分）：落在理想範圍 1.1–1.4 才給分
    const caPhosRatio = analysis.caPhosRatio
      ? parseFloat(analysis.caPhosRatio)
      : analysis.calcium !== undefined
        ? analysis.calcium / analysis.phosphorus
        : undefined;
    const caPhosScore =
      caPhosRatio !== undefined && caPhosRatio >= 1.1 && caPhosRatio <= 1.4 ? 15 : 0;

    const proteinScore = scoreProtein(dm.protein, isDog);

    const rawTotal =
      phosphorusScore + carbScore + aafcoScore + caPhosScore + proteinScore;
    const shouldCap =
      me.phosphorusMgPer100kcal > 400 ||
      (caPhosRatio !== undefined && caPhosRatio < 1.0);
    const total = Math.round(shouldCap ? Math.min(rawTotal, 59) : rawTotal);

    return {
      total,
      band: getScoreBand(total),
      capped: shouldCap,
      isEstimate: false,
      items: [
        {
          label: "磷含量",
          points: Math.round(phosphorusScore),
          max: 25,
          detail: `${me.phosphorusMgPer100kcal.toFixed(0)}mg/100kcal`,
        },
        {
          label: "碳水化合物",
          points: Math.round(carbScore),
          max: 25,
          detail: `DM ${dm.carb.toFixed(1)}%`,
        },
        {
          label: "AAFCO／FEDIAF",
          points: aafcoScore,
          max: 20,
          detail: product.aafcoCertified ? "已標示" : "未標示",
        },
        {
          label: "鈣磷比",
          points: caPhosScore,
          max: 15,
          detail: caPhosRatio !== undefined ? `${caPhosRatio.toFixed(2)}:1` : "未標示",
        },
        {
          label: "蛋白質",
          points: Math.round(proteinScore),
          max: 15,
          detail: `DM ${dm.protein.toFixed(1)}%`,
        },
      ],
    };
  }

  // 資料不足時的估算模式：只用碳水／AAFCO／蛋白質（缺灰分、磷、熱量，故磷與鈣磷比無法計分）
  const inputs = product.partialNutrition?.estimateInputs;
  if (!inputs || inputs.protein === undefined || inputs.moisture === undefined) {
    return null;
  }
  const { protein, moisture } = inputs;
  const fat = inputs.fat ?? 0;
  const fiber = inputs.fiber ?? 0;
  const dryMatter = 100 - moisture;
  const carbAsFed = Math.max(0, 100 - moisture - protein - fat - fiber);
  const dmCarb = (carbAsFed / dryMatter) * 100;
  const dmProtein = (protein / dryMatter) * 100;

  const carbScore = scoreCarb(dmCarb, isDog, isDry);
  const aafcoScore = product.aafcoCertified ? 20 : 0;
  const proteinScore = scoreProtein(dmProtein, isDog);

  const knownMax = 25 + 20 + 15;
  const total = Math.round(
    ((carbScore + aafcoScore + proteinScore) / knownMax) * 100
  );

  return {
    total,
    band: getScoreBand(total),
    capped: false,
    isEstimate: true,
    items: [
      { label: "磷含量", points: null, max: 25, detail: "資料不足" },
      {
        label: "碳水化合物",
        points: Math.round(carbScore),
        max: 25,
        detail: `估算 DM ${dmCarb.toFixed(1)}%（未扣灰分，實際碳水可能更低）`,
      },
      {
        label: "AAFCO／FEDIAF",
        points: aafcoScore,
        max: 20,
        detail: product.aafcoCertified ? "已標示" : "未標示",
      },
      { label: "鈣磷比", points: null, max: 15, detail: "資料不足" },
      {
        label: "蛋白質",
        points: Math.round(proteinScore),
        max: 15,
        detail: `估算 DM ${dmProtein.toFixed(1)}%`,
      },
    ],
  };
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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [certFilters, setCertFilters] = useState<Set<"aafco" | "nrc">>(
    new Set()
  );
  const [featureFilters, setFeatureFilters] = useState<Set<string>>(
    new Set()
  );
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const { getQuantity, setQuantity } = useFavoriteQuantities();

  const handleTabChange = (tab: (typeof ALL) | PetProductCategory) => {
    setActiveTab(tab);
    setBrandFilter(ALL_BRANDS);
    setLitterFilter(ALL_LITTER);
    setCertFilters(new Set());
    setFeatureFilters(new Set());
  };

  const toggleCertFilter = (cert: "aafco" | "nrc") => {
    setCertFilters((prev) => {
      const next = new Set(prev);
      if (next.has(cert)) next.delete(cert);
      else next.add(cert);
      return next;
    });
  };

  const toggleFeatureFilter = (feature: string) => {
    setFeatureFilters((prev) => {
      const next = new Set(prev);
      if (next.has(feature)) next.delete(feature);
      else next.add(feature);
      return next;
    });
  };

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

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) throw new Error("toggle failed");
    } catch {
      // 失敗時重新從伺服器同步正確狀態
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => setLikedIds(new Set<string>(data.favorites ?? [])))
        .catch(() => {});
    }
  };

  const availableBrands = useMemo(() => {
    const products =
      activeTab === ALL
        ? mockPetProducts
        : mockPetProducts.filter((product) => product.category === activeTab);
    return Array.from(new Set(products.map((product) => product.brand)));
  }, [activeTab]);

  const baseFilteredProducts = useMemo(() => {
    let products =
      activeTab === ALL
        ? mockPetProducts
        : mockPetProducts.filter((product) => product.category === activeTab);

    if (activeTab !== "貓砂/用品" && brandFilter !== ALL_BRANDS) {
      products = products.filter((product) => product.brand === brandFilter);
    }
    if (activeTab === "貓砂/用品" && litterFilter !== ALL_LITTER) {
      products = products.filter(
        (product) => product.litterSubCategory === litterFilter
      );
    }
    return products;
  }, [activeTab, brandFilter, litterFilter]);

  const availableFeatures = useMemo(
    () =>
      Array.from(
        new Set(baseFilteredProducts.flatMap((product) => getFilterTags(product)))
      ),
    [baseFilteredProducts]
  );

  const filteredProducts = useMemo(() => {
    let products = baseFilteredProducts;
    if (certFilters.has("aafco")) {
      products = products.filter((product) => product.aafcoCertified);
    }
    if (certFilters.has("nrc")) {
      products = products.filter((product) => product.nrcCertified);
    }
    if (featureFilters.size > 0) {
      products = products.filter((product) =>
        Array.from(featureFilters).every((feature) =>
          getFilterTags(product).includes(feature)
        )
      );
    }
    return [...products].sort((a, b) => {
      const scoreA = computeProductScore(a)?.total ?? -1;
      const scoreB = computeProductScore(b)?.total ?? -1;
      return scoreB - scoreA;
    });
  }, [baseFilteredProducts, certFilters, featureFilters]);

  const favoriteProducts = useMemo(
    () => mockPetProducts.filter((product) => likedIds.has(product.id)),
    [likedIds]
  );

  const favoritesMonthlyTotal = favoriteProducts.reduce(
    (sum, product) => sum + product.price * getQuantity(product.id),
    0
  );

  return (
    <section>
      {status === "authenticated" && favoriteProducts.length > 0 && (
        <div className="mb-8 rounded-2xl border border-rose-200/60 bg-rose-50/40 p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
            <h3 className="flex items-center gap-1.5 text-base font-bold text-stone-800">
              ❤️ 我的收藏（{favoriteProducts.length}）
            </h3>
            <div className="text-right">
              <p className="text-sm font-semibold text-brand-orange-dark">
                💡 本月伙食費估算：NT$ {favoritesMonthlyTotal.toLocaleString()}
              </p>
              <p className="mt-0.5 text-xs text-stone-400">
                （依據您設定的預估數量計算，點擊卡片按鈕可直接跳轉至賣場複製下單數量）
              </p>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {favoriteProducts.map((product) => {
              const quantity = getQuantity(product.id);
              return (
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
                  <div className="inline-flex items-center justify-center gap-2 self-center rounded-full border border-cream-border bg-cream-bg-light px-1 py-1">
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, quantity - 1)}
                      disabled={quantity <= 1}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-stone-600 shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
                    >
                      −
                    </button>
                    <span className="w-4 text-center text-xs font-semibold text-stone-700">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(product.id, quantity + 1)}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-stone-600 shadow-sm transition active:scale-95"
                    >
                      ＋
                    </button>
                  </div>
                  <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    className="mt-auto inline-flex items-center justify-center gap-1 rounded-lg bg-orange-500 px-2 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600 active:scale-[0.98]"
                  >
                    🛒 前往購買 ({quantity}罐)
                  </a>
                </div>
              );
            })}
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

      {activeTab !== "貓砂/用品" && availableBrands.length > 0 && (
        <div className="mb-6">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-cream-border bg-white px-3 py-2 text-sm text-stone-700 outline-none transition focus:border-milktea focus:ring-1 focus:ring-milktea sm:w-auto"
          >
            <option value={ALL_BRANDS}>{ALL_BRANDS}</option>
            {availableBrands.map((brand) => (
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

      <div className="mb-6">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-cream-border bg-white px-3 py-2 text-sm font-medium text-stone-600 transition hover:border-milktea/60 hover:text-milktea-dark"
        >
          🔍 進階篩選
          {certFilters.size + featureFilters.size > 0 && (
            <span className="rounded-full bg-milktea/15 px-2 py-0.5 text-xs font-semibold text-milktea-dark">
              {certFilters.size + featureFilters.size}
            </span>
          )}
          <span
            className={`text-xs transition-transform ${showAdvanced ? "rotate-180" : ""}`}
          >
            ▾
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-3 flex flex-wrap gap-2 rounded-xl border border-cream-border bg-cream-bg-light/60 p-4">
            <FilterChip
              label="AAFCO 認證"
              checked={certFilters.has("aafco")}
              onToggle={() => toggleCertFilter("aafco")}
            />
            <FilterChip
              label="NRC 認證"
              checked={certFilters.has("nrc")}
              onToggle={() => toggleCertFilter("nrc")}
            />
            {availableFeatures.map((feature) => (
              <FilterChip
                key={feature}
                label={feature}
                checked={featureFilters.has(feature)}
                onToggle={() => toggleFeatureFilter(feature)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            liked={likedIds.has(product.id)}
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

function FilterChip({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        checked
          ? "border-milktea bg-milktea text-cream-card"
          : "border-cream-border bg-white text-stone-600 hover:border-milktea/60 hover:text-milktea-dark"
      }`}
    >
      {label}
    </button>
  );
}

function ProductCard({
  product,
  liked,
  onToggleLike,
}: {
  product: PetProduct;
  liked: boolean;
  onToggleLike: (productId: string) => void;
}) {
  const hasDiscount =
    product.originalPrice !== undefined &&
    product.originalPrice > product.price;
  const catVerdictSummary = buildCatVerdictSummary(product.ourCatsRating);
  const score = computeProductScore(product);
  const certStandard = product.certStandard ?? "AAFCO";
  const [showDetails, setShowDetails] = useState(false);
  const hasMoreDetails =
    product.detailedAnalysis || product.partialNutrition || product.officialFiling;

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
              onToggle={() => onToggleLike(product.id)}
            />
          </div>
        </div>
        {score && <ScoreBadge score={score} />}
        {!score && product.category === "處方飼料" && (
          <PrescriptionBadge info={product.prescriptionInfo} />
        )}
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
                {product.aafcoCertified
                  ? `✅ ${certStandard} 認證`
                  : `⚠️ 未標示 ${certStandard}`}
              </span>
            )}
            {product.nrcCertified !== undefined && (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  product.nrcCertified
                    ? "border-matcha/40 bg-matcha/10 text-matcha"
                    : "border-amber-500/40 bg-amber-400/10 text-amber-700"
                }`}
              >
                {product.nrcCertified ? "✅ NRC 認證" : "⚠️ 未標示 NRC"}
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
            {product.detailedAnalysis?.productType && (
              <span className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                {product.detailedAnalysis.productType}
              </span>
            )}
          </div>

          <p className="text-sm text-stone-600">{product.review.comment}</p>
          {catVerdictSummary && (
            <p className="mt-1.5 text-sm text-stone-500">
              🐾 毛孩評價：{catVerdictSummary}
            </p>
          )}

          {score && (
            <div className="mt-3">
              <ScoreBreakdown score={score} />
            </div>
          )}
          {!score && product.category === "處方飼料" && product.prescriptionInfo && (
            <div className="mt-3">
              <PrescriptionInfoBox info={product.prescriptionInfo} />
            </div>
          )}

          {hasMoreDetails && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-milktea-dark hover:underline"
              >
                {showDetails ? "收合成分／申報資訊" : "查看更多（成分／官方申報資訊）"}
                <span
                  className={`text-[10px] transition-transform ${showDetails ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </button>

              {showDetails && (
                <div className="mt-3 flex flex-col gap-3">
                  {product.detailedAnalysis && (
                    <AnalysisTable analysis={product.detailedAnalysis} />
                  )}
                  {product.partialNutrition && (
                    <PartialNutritionBox nutrition={product.partialNutrition} />
                  )}
                  {product.officialFiling && (
                    <OfficialFilingBox filing={product.officialFiling} />
                  )}
                </div>
              )}
            </div>
          )}
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
            🛒 前往購買
          </a>
        </div>
      </div>
    </article>
  );
}

function ScoreBadge({ score }: { score: ProductScore }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-cream-border bg-cream-bg-light/50 p-3">
      <div
        className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-full text-center ${score.band.className} ${
          score.isEstimate ? "border-2 border-dashed" : "border-2"
        }`}
      >
        <span className="text-lg font-extrabold leading-none">{score.total}</span>
        <span className="text-[9px] leading-none opacity-70">/100</span>
      </div>
      <div>
        <span
          className={`inline-block rounded-full border px-2 py-0.5 text-xs font-semibold ${score.band.className}`}
        >
          {score.isEstimate ? "約 " : ""}
          {score.band.label}
        </span>
        {score.isEstimate && (
          <p className="mt-1 text-[10px] text-stone-400">
            資料不足，僅估算參考分數
          </p>
        )}
        {score.capped && (
          <p className="mt-1 text-[10px] text-rose-500">
            磷過高或鈣磷比不足，分數已封頂
          </p>
        )}
      </div>
    </div>
  );
}

function ScoreBreakdown({ score }: { score: ProductScore }) {
  return (
    <div className="rounded-xl border border-cream-border bg-cream-bg-light/50 p-3 text-xs">
      <p className="font-semibold text-stone-600">
        📊 {score.isEstimate ? "評分明細（估算）" : "評分明細（滿分 100）"}
      </p>
      <div className="mt-2 flex flex-col gap-1.5">
        {score.items.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-2">
            <span className="text-stone-500">
              {item.label}
              <span className="ml-1 text-stone-400">（{item.detail}）</span>
            </span>
            <span
              className={`font-semibold ${item.points === null ? "text-stone-400" : "text-stone-700"}`}
            >
              {item.points === null ? "—" : item.points} / {item.max}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-stone-400">
        ⓘ
        這是毛拔麻自訂的評分邏輯（非取自其他網站），依磷含量、碳水、AAFCO／FEDIAF、鈣磷比、蛋白質五項計算，僅供參考，不是醫療建議。
        {score.isEstimate &&
          "此商品缺灰分／磷／熱量資料，磷與鈣磷比無法計分，總分是用其餘三項（碳水、AAFCO、蛋白質，滿分60）按比例換算成 100 分制，僅供粗略參考，不代表完整評分。"}
      </p>
    </div>
  );
}

function PrescriptionBadge({ info }: { info?: PetProductPrescriptionInfo }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 p-3">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-rose-300 bg-white text-2xl">
        ⚕️
      </div>
      <div>
        <span className="inline-block rounded-full border border-rose-300 bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-600">
          處方飼料
        </span>
        <p className="mt-1 text-[10px] text-stone-400">
          {info?.requiresVetPrescription
            ? "需憑獸醫處方使用，不適用一般評分"
            : "特殊配方，不適用一般評分"}
        </p>
      </div>
    </div>
  );
}

function PrescriptionInfoBox({ info }: { info: PetProductPrescriptionInfo }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-3 text-xs">
      <p className="font-semibold text-rose-600">⚕️ 處方飼料資訊</p>
      <dl className="mt-2 flex flex-col gap-1.5">
        <div className="flex justify-between gap-3">
          <dt className="shrink-0 text-stone-500">適應症／設計目標</dt>
          <dd className="text-right font-semibold text-stone-700">{info.indication}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="shrink-0 text-stone-500">是否需獸醫處方</dt>
          <dd className="text-right font-semibold text-stone-700">
            {info.requiresVetPrescription ? "是" : "否，但建議獸醫評估後使用"}
          </dd>
        </div>
        {info.targetUrinePh && (
          <div className="flex justify-between gap-3">
            <dt className="shrink-0 text-stone-500">目標尿液 pH 誘導範圍</dt>
            <dd className="text-right font-semibold text-stone-700">{info.targetUrinePh}</dd>
          </div>
        )}
        {info.keyMechanism && (
          <div className="flex justify-between gap-3">
            <dt className="shrink-0 text-stone-500">關鍵機制</dt>
            <dd className="text-right font-semibold text-stone-700">{info.keyMechanism}</dd>
          </div>
        )}
      </dl>
      {info.note && <p className="mt-2 text-stone-500">📌 {info.note}</p>}
      <p className="mt-2 text-stone-400">
        ⓘ 處方飼料是為特定病理狀況設計，刻意調整蛋白質／礦物質等比例，套用一般保健飼料的評分邏輯會誤導，故不計分。請務必經獸醫診斷評估後使用，不要自行更換或長期餵食。
      </p>
    </div>
  );
}

function OfficialFilingBox({ filing }: { filing: PetProductOfficialFiling }) {
  return (
    <div className="rounded-xl border border-cream-border bg-cream-bg-light/50 p-3 text-xs">
      <p className="font-semibold text-stone-600">
        📋 官方申報資訊
        <span className="ml-2 font-normal text-stone-400">
          資料來源：農業部寵物食品申報網（{filing.queryDate}）
        </span>
      </p>
      <div className="mt-2 overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-center">
          <thead>
            <tr className="border-b border-cream-border text-stone-500">
              <th className="px-2 py-1.5 text-left font-medium">規格</th>
              <th className="px-2 py-1.5 font-medium">申報方式</th>
              <th className="px-2 py-1.5 font-medium">產地</th>
              <th className="px-2 py-1.5 font-medium">業者</th>
              <th className="px-2 py-1.5 font-medium">代工廠</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-border">
            {filing.records.map((record, index) => (
              <tr key={index}>
                <td className="px-2 py-1.5 text-left">{record.spec}</td>
                <td className="px-2 py-1.5">{record.sourceType}</td>
                <td className="px-2 py-1.5">{record.origin}</td>
                <td className="px-2 py-1.5">{record.company}</td>
                <td className="px-2 py-1.5">{record.subcontractor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-stone-400">
        這是廠商自己向農業部申報、任何人都查得到的公開資料，僅供參考。
      </p>
    </div>
  );
}

function PartialNutritionBox({
  nutrition,
}: {
  nutrition: PetProductPartialNutrition;
}) {
  return (
    <div className="rounded-xl border border-cream-border bg-cream-bg-light/50 p-3 text-xs">
      <p className="font-semibold text-stone-600">📋 官方營養標示（部分揭露）</p>
      {nutrition.ingredientsText && (
        <p className="mt-2 leading-relaxed text-stone-500">
          {nutrition.ingredientsText}
        </p>
      )}
      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
        {nutrition.items.map((item) => (
          <div key={item.label} className="flex justify-between gap-2">
            <dt className="text-stone-500">{item.label}</dt>
            <dd className="font-semibold text-stone-700">{item.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-stone-400">⚠️ {nutrition.note}</p>
    </div>
  );
}

function AnalysisTable({
  analysis,
}: {
  analysis: PetProductDetailedAnalysis;
}) {
  const { carbAsFed, dm, me } = computeAnalysisTable(analysis);
  const pricePerGram =
    analysis.weightGrams > 0 ? analysis.salePrice / analysis.weightGrams : 0;

  const otherInfoParts: string[] = [];
  if (analysis.calcium !== undefined) otherInfoParts.push(`鈣${analysis.calcium}%`);
  if (analysis.caPhosRatio) otherInfoParts.push(`鈣磷比${analysis.caPhosRatio}`);
  if (analysis.sodium !== undefined) otherInfoParts.push(`鈉${analysis.sodium}%`);

  return (
    <div className="rounded-xl border border-cream-border bg-cream-bg-light/50 p-3 text-xs">
      <p className="leading-relaxed text-stone-500">
        {analysis.ingredientsText}
      </p>
      <p className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-stone-500">
        <span>
          其他：{otherInfoParts.length > 0 ? otherInfoParts.join("、") : "—"}
        </span>
        <span className="text-stone-400">
          產地：{getCountryFlagEmoji(analysis.originCountry)}{" "}
          {analysis.originCountry}
        </span>
      </p>

      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-center">
          <thead>
            <tr className="border-b border-cream-border text-stone-500">
              <th className="px-2 py-1.5 text-left font-medium"> </th>
              <th className="px-2 py-1.5 font-medium">蛋白質</th>
              <th className="px-2 py-1.5 font-medium">脂肪</th>
              <th className="px-2 py-1.5 font-medium">碳水</th>
              <th className="px-2 py-1.5 font-medium">水份</th>
              <th className="px-2 py-1.5 font-medium">磷</th>
              <th className="px-2 py-1.5 font-medium">纖維</th>
              <th className="px-2 py-1.5 font-medium">灰質</th>
              <th className="px-2 py-1.5 font-medium">熱量</th>
              <th className="px-2 py-1.5 font-medium">容量(g)</th>
              <th className="px-2 py-1.5 font-medium">定價</th>
              <th className="px-2 py-1.5 font-medium">售價</th>
              <th className="px-2 py-1.5 font-medium">價格/g</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cream-border">
            <tr>
              <td className="px-2 py-1.5 text-left font-semibold text-stone-600">
                分析成分
              </td>
              <td className="px-2 py-1.5">{analysis.protein}%</td>
              <td className="px-2 py-1.5">{analysis.fat}%</td>
              <td className="px-2 py-1.5">{carbAsFed.toFixed(1)}%</td>
              <td className="px-2 py-1.5">{analysis.moisture}%</td>
              <td className="px-2 py-1.5">{analysis.phosphorus}%</td>
              <td className="px-2 py-1.5">{analysis.fiber}%</td>
              <td className="px-2 py-1.5">{analysis.ash}%</td>
              <td className="px-2 py-1.5">{analysis.kcalPer100g} kcal/100g</td>
              <td className="px-2 py-1.5">{analysis.weightGrams}</td>
              <td className="px-2 py-1.5">{analysis.listPrice}</td>
              <td className="px-2 py-1.5">{analysis.salePrice}</td>
              <td className="px-2 py-1.5">{pricePerGram.toFixed(2)}</td>
            </tr>
            <tr className="text-stone-500">
              <td className="px-2 py-1.5 text-left font-semibold text-stone-600">
                乾物比(DM)
              </td>
              <td className="px-2 py-1.5">{dm.protein.toFixed(1)}%</td>
              <td className="px-2 py-1.5">{dm.fat.toFixed(1)}%</td>
              <td className="px-2 py-1.5">{dm.carb.toFixed(1)}%</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">{dm.fiber.toFixed(1)}%</td>
              <td className="px-2 py-1.5">{dm.ash.toFixed(1)}%</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">—</td>
            </tr>
            <tr className="text-matcha">
              <td className="px-2 py-1.5 text-left font-semibold text-stone-600">
                熱量佔(ME)
              </td>
              <td className="px-2 py-1.5">{me.protein.toFixed(1)}%</td>
              <td className="px-2 py-1.5">{me.fat.toFixed(1)}%</td>
              <td className="px-2 py-1.5">{me.carb.toFixed(1)}%</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">
                {me.phosphorusMgPer100kcal.toFixed(0)} mg/100kcal
              </td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">—</td>
              <td className="px-2 py-1.5">—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LikeButton({
  liked,
  onToggle,
}: {
  liked: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={liked}
      title={liked ? "取消收藏" : "登入後即可收藏"}
      className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-white/90 p-1.5 text-sm shadow-sm backdrop-blur transition active:scale-95"
    >
      {liked ? "❤️" : "🤍"}
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
        <p className="text-xs text-stone-500">推薦的毛孩：{allNames.join("、")}</p>
      )}

      {showForm ? (
        <div className="mt-1.5 flex gap-1.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="輸入你家毛孩的名字"
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
          ❤️ 我家毛孩也喜歡 (+1)
        </button>
      )}
    </div>
  );
}
