"use client";

import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useRef, useState } from "react";
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
const ALL_ORIGIN = "全部產地" as const;
const ALL_FACTORY = "全部" as const;

const TABS: (typeof ALL | PetProductCategory)[] = [
  ALL,
  "貓咪主食罐",
  "貓咪乾糧",
  "貓咪零食",
  "貓砂/用品",
  "狗狗主食罐",
  "狗狗乾糧",
  "毛孩保健品",
  "貓咪處方乾糧",
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
  return [...(product.features ?? []), ...product.debugTags];
}

/** 生命階段／適用對象標籤，會顯示在進階篩選最上層（與 AAFCO/NRC/HACCP/FEDIAF 同排） */
const LIFE_STAGE_TAGS = new Set([
  "幼犬",
  "成犬",
  "熟齡犬",
  "幼貓",
  "成貓",
  "熟齡貓",
  "懷孕授乳貓",
]);

/** 保健功能類標籤，收合於「保健功能篩選」 */
const HEALTH_PURPOSE_TAGS = new Set([
  "體重控制",
  "減重配方",
  "低卡",
  "熱量管理",
  "泌尿道保健",
  "化毛",
  "關節保健",
  "皮毛保健",
  "腸胃排毛",
  "亮毛護膚",
  "降低便臭",
  "挑嘴",
]);

/** 肉源種類分桶：原始標籤 → 統一顯示的物種分類（用於「肉類與成分篩選」） */
const MEAT_SPECIES_GROUPS: Record<string, string[]> = {
  雞: ["雞肉", "雞心", "鮮雞"],
  魚海鮮: [
    "鮭魚",
    "鮭魚油",
    "鮪魚",
    "鱒魚",
    "鱈魚",
    "石斑魚",
    "鯡魚",
    "魚肉",
    "魚",
    "海魚",
    "多種魚",
    "明蝦",
    "草蝦",
    "甲魚",
    "旗魚",
    "海瓜子",
    "鰹魚",
    "魩仔魚",
  ],
  鴨: ["鴨肉"],
  鵝: ["鵝肉"],
  牛: ["牛肉"],
  羊: ["羊肉"],
  火雞: ["火雞肉", "火雞"],
  鹿: ["鹿肉", "馴鹿"],
  兔: ["兔肉"],
  其他肉源: ["袋鼠肉", "馬肉", "豬肉", "鵪鶉", "麵包蟲", "黑水虻"],
};

/** 較少見的肉源分類（用於「少見肉源」快速篩選） */
const EXOTIC_MEAT_SPECIES = new Set(["鹿", "兔", "火雞", "其他肉源"]);

/** 肉源 chip 固定顯示順序，與 MEAT_SPECIES_GROUPS 的 key 順序一致 */
const MEAT_SPECIES_ORDER = Object.keys(MEAT_SPECIES_GROUPS);

const RAW_TAG_TO_SPECIES: Record<string, string> = Object.fromEntries(
  Object.entries(MEAT_SPECIES_GROUPS).flatMap(([bucket, rawTags]) =>
    rawTags.map((rawTag) => [rawTag, bucket])
  )
);

/** 屬性型標籤（非物種、非生命階段、非保健功能），會用不同顏色顯示在「肉類與成分篩選」 */
const ATTRIBUTE_TAGS = new Set(["單一肉源", "單一蛋白質", "少見肉源", "低磷"]);

function getMeatSpeciesBuckets(tags: string[]): Set<string> {
  const buckets = new Set<string>();
  for (const tag of tags) {
    const bucket = RAW_TAG_TO_SPECIES[tag];
    if (bucket) buckets.add(bucket);
  }
  return buckets;
}

/** 依標籤性質分類：生命階段／保健功能／肉源種類（分桶）／屬性／其餘成分 */
function classifyFeatureTags(tags: string[]) {
  const lifeStage: string[] = [];
  const healthPurpose: string[] = [];
  const attribute: string[] = [];
  const otherIngredient: string[] = [];
  const speciesBuckets = new Set<string>();

  for (const tag of tags) {
    if (LIFE_STAGE_TAGS.has(tag)) lifeStage.push(tag);
    else if (HEALTH_PURPOSE_TAGS.has(tag)) healthPurpose.push(tag);
    else if (ATTRIBUTE_TAGS.has(tag)) {
      if (tag !== "單一蛋白質") attribute.push(tag);
    } else if (RAW_TAG_TO_SPECIES[tag]) speciesBuckets.add(RAW_TAG_TO_SPECIES[tag]);
    else otherIngredient.push(tag);
  }

  // 「少見肉源」不是資料裡的字面標籤，是依物種分桶推算出來的快速篩選項目；
  // 「其他肉源」桶本身不單獨顯示成 chip，直接併入少見肉源
  if (
    Array.from(speciesBuckets).some((bucket) => EXOTIC_MEAT_SPECIES.has(bucket)) &&
    !attribute.includes("少見肉源")
  ) {
    attribute.push("少見肉源");
  }
  const meatSpecies = Array.from(speciesBuckets)
    .filter((bucket) => bucket !== "其他肉源")
    .sort((a, b) => MEAT_SPECIES_ORDER.indexOf(a) - MEAT_SPECIES_ORDER.indexOf(b));

  return {
    lifeStage,
    healthPurpose,
    meatSpecies,
    attribute,
    otherIngredient,
    meatAndIngredient: [...meatSpecies, ...otherIngredient],
  };
}

function isSingleMeatSource(tags: string[]): boolean {
  const buckets = getMeatSpeciesBuckets(tags);
  if (buckets.size === 1) return true;
  return tags.includes("單一肉源") || tags.includes("單一蛋白質");
}

/** 「肉類與成分篩選」chip 判斷邏輯：肉源分桶／少見肉源／單一肉源用推算的，其餘用字面比對 */
function productMatchesFeatureFilter(product: PetProduct, filter: string): boolean {
  const tags = getFilterTags(product);
  if (filter === "單一肉源") return isSingleMeatSource(tags);
  if (filter === "少見肉源") {
    const buckets = getMeatSpeciesBuckets(tags);
    return Array.from(buckets).some((bucket) => EXOTIC_MEAT_SPECIES.has(bucket));
  }
  if (MEAT_SPECIES_GROUPS[filter]) {
    return getMeatSpeciesBuckets(tags).has(filter);
  }
  return tags.includes(filter);
}

/** 依字串與亂數種子產生穩定的排序權重，用來實作「隨機看看」（同一次種子下排序固定，重點是可重新洗牌） */
function hashSeed(id: string, seed: number): number {
  const str = `${seed}-${id}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return hash;
}

function getProductOrigin(product: PetProduct): string | undefined {
  return product.detailedAnalysis?.originCountry ?? product.originCountry;
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

/** 快速需求篩選：腎臟友善（低磷或泌尿道保健標籤） */
function isKidneyFriendly(product: PetProduct): boolean {
  const tags = getFilterTags(product);
  return tags.includes("低磷") || tags.includes("泌尿道保健");
}

/** 快速需求篩選：低碳水（沿用與 DMB 徽章相同的門檻） */
function isLowCarbProduct(product: PetProduct): boolean {
  if (product.dmbCarb === undefined) return false;
  const passMax = isDogCategory(product.category) ? 25 : 10;
  return product.dmbCarb < passMax;
}

/** 快速需求篩選：高蛋白（依乾物比蛋白質門檻，犬 ≥30%／貓 ≥40%） */
function isHighProteinProduct(product: PetProduct): boolean {
  if (!product.detailedAnalysis) return false;
  const { dm } = computeAnalysisTable(product.detailedAnalysis);
  const floor = isDogCategory(product.category) ? 30 : 40;
  return dm.protein >= floor;
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
  // 貓咪處方乾糧是為特定病理狀況設計（例如刻意降蛋白／調整礦物質），
  // 套用一般保健飼料的評分邏輯會誤導使用者，故一律不計分。
  if (product.category === "貓咪處方乾糧") return null;

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

  // 磷／鈣磷比：僅在有熱量與磷數值時才計分（磷可能是非官方推估值，來源需在 note 註明）
  const hasPhosphorus = inputs.phosphorus !== undefined && inputs.kcalPer100g !== undefined;
  const phosphorusMgPer100kcal = hasPhosphorus
    ? ((inputs.phosphorus! * 1000) / inputs.kcalPer100g!) * 100
    : undefined;
  const phosphorusScore =
    phosphorusMgPer100kcal !== undefined
      ? clamp((25 * (400 - phosphorusMgPer100kcal)) / (400 - 250), 0, 25)
      : undefined;
  const caPhosRatio =
    inputs.calcium !== undefined && inputs.phosphorus !== undefined
      ? inputs.calcium / inputs.phosphorus
      : undefined;
  const caPhosScore =
    caPhosRatio !== undefined ? (caPhosRatio >= 1.1 && caPhosRatio <= 1.4 ? 15 : 0) : undefined;

  const knownMax =
    25 + 20 + 15 + (phosphorusScore !== undefined ? 25 : 0) + (caPhosScore !== undefined ? 15 : 0);
  const rawTotal =
    carbScore +
    aafcoScore +
    proteinScore +
    (phosphorusScore ?? 0) +
    (caPhosScore ?? 0);
  const shouldCap =
    (phosphorusMgPer100kcal !== undefined && phosphorusMgPer100kcal > 400) ||
    (caPhosRatio !== undefined && caPhosRatio < 1.0);
  const total = Math.round(
    shouldCap ? Math.min((rawTotal / knownMax) * 100, 59) : (rawTotal / knownMax) * 100
  );

  return {
    total,
    band: getScoreBand(total),
    capped: shouldCap,
    isEstimate: true,
    items: [
      {
        label: "磷含量",
        points: phosphorusScore !== undefined ? Math.round(phosphorusScore) : null,
        max: 25,
        detail:
          phosphorusMgPer100kcal !== undefined
            ? `推估 ${phosphorusMgPer100kcal.toFixed(0)}mg/100kcal（非官方）`
            : "資料不足",
      },
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
      {
        label: "鈣磷比",
        points: caPhosScore ?? null,
        max: 15,
        detail: caPhosRatio !== undefined ? `推估 ${caPhosRatio.toFixed(2)}:1（非官方）` : "資料不足",
      },
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
  const [searchQuery, setSearchQuery] = useState("");
  const [brandFilter, setBrandFilter] = useState<string>(ALL_BRANDS);
  const [litterFilter, setLitterFilter] = useState<
    typeof ALL_LITTER | LitterSubCategory
  >(ALL_LITTER);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [certFilters, setCertFilters] = useState<
    Set<"aafco" | "nrc" | "haccp" | "fediaf">
  >(new Set());
  const [featureFilters, setFeatureFilters] = useState<Set<string>>(
    new Set()
  );
  const [quickFilters, setQuickFilters] = useState<
    Set<"kidney" | "highProtein" | "lowCarb" | "singleMeat">
  >(new Set());
  const [originFilter, setOriginFilter] = useState<string>(ALL_ORIGIN);
  const [filingFilters, setFilingFilters] = useState<Set<string>>(new Set());
  const [manufacturerFactory, setManufacturerFactory] = useState<string>(ALL_FACTORY);
  const [subcontractorFactory, setSubcontractorFactory] = useState<string>(ALL_FACTORY);
  const [sortOrder, setSortOrder] = useState<"random" | "desc">("random");
  // 初始值固定，避免 SSR／CSR 洗牌結果不一致造成 hydration mismatch；掛載後才在 client 端重新洗牌
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const [showMeatSection, setShowMeatSection] = useState(false);
  const [showHealthSection, setShowHealthSection] = useState(false);
  const [showFilingSection, setShowFilingSection] = useState(false);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const moreFiltersRef = useRef<HTMLDivElement>(null);

  const { getQuantity, setQuantity } = useFavoriteQuantities();

  const handleTabChange = (tab: (typeof ALL) | PetProductCategory) => {
    setActiveTab(tab);
    setBrandFilter(ALL_BRANDS);
    setLitterFilter(ALL_LITTER);
    setCertFilters(new Set());
    setFeatureFilters(new Set());
    setQuickFilters(new Set());
    setOriginFilter(ALL_ORIGIN);
    setFilingFilters(new Set());
    setManufacturerFactory(ALL_FACTORY);
    setSubcontractorFactory(ALL_FACTORY);
  };

  const toggleCertFilter = (cert: "aafco" | "nrc" | "haccp" | "fediaf") => {
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

  const toggleQuickFilter = (
    key: "kidney" | "highProtein" | "lowCarb" | "singleMeat"
  ) => {
    setQuickFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleFilingFilter = (sourceType: string) => {
    setFilingFilters((prev) => {
      const next = new Set(prev);
      if (next.has(sourceType)) next.delete(sourceType);
      else next.add(sourceType);
      return next;
    });
  };

  const handlePairingWizard = () => {
    const seniorTag = availableFeatures.includes("熟齡貓")
      ? "熟齡貓"
      : availableFeatures.includes("熟齡犬")
        ? "熟齡犬"
        : undefined;
    if (seniorTag) setFeatureFilters(new Set([seniorTag]));
    setQuickFilters(new Set(["kidney"]));
    requestAnimationFrame(() => {
      moreFiltersRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  // 掛載後才在 client 端重新洗牌一次，避免 SSR 輸出的固定順序一直維持不變
  useEffect(() => {
    setShuffleSeed(Math.random());
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

  const {
    lifeStage: lifeStageTags,
    healthPurpose: healthPurposeTags,
    meatSpecies: meatSpeciesTags,
    attribute: attributeTags,
    otherIngredient: otherIngredientTags,
  } = useMemo(() => classifyFeatureTags(availableFeatures), [availableFeatures]);

  const availableOrigins = useMemo(() => {
    const origins = baseFilteredProducts
      .map((product) => getProductOrigin(product))
      .filter((origin): origin is string => Boolean(origin));
    return Array.from(new Set(origins));
  }, [baseFilteredProducts]);

  const availableFilingSourceTypes = useMemo(() => {
    const types = baseFilteredProducts.flatMap(
      (product) => product.officialFiling?.records.map((record) => record.sourceType) ?? []
    );
    return Array.from(new Set(types));
  }, [baseFilteredProducts]);

  const availableManufacturerFactories = useMemo(() => {
    const names = baseFilteredProducts.flatMap(
      (product) =>
        product.officialFiling?.records
          .filter((record) => record.sourceType === "製造、加工")
          .map((record) => record.company) ?? []
    );
    return Array.from(new Set(names));
  }, [baseFilteredProducts]);

  const availableSubcontractorFactories = useMemo(() => {
    const names = baseFilteredProducts.flatMap(
      (product) =>
        product.officialFiling?.records
          .filter(
            (record) =>
              (record.sourceType === "委託代工廠製造" || record.sourceType === "輸入") &&
              record.subcontractor &&
              record.subcontractor !== "—"
          )
          .map((record) => record.subcontractor) ?? []
    );
    return Array.from(new Set(names));
  }, [baseFilteredProducts]);

  const filteredProducts = useMemo(() => {
    let products = baseFilteredProducts;
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query)
      );
    }
    if (quickFilters.has("kidney")) {
      products = products.filter(isKidneyFriendly);
    }
    if (quickFilters.has("highProtein")) {
      products = products.filter(isHighProteinProduct);
    }
    if (quickFilters.has("lowCarb")) {
      products = products.filter(isLowCarbProduct);
    }
    if (quickFilters.has("singleMeat")) {
      products = products.filter((product) => isSingleMeatSource(getFilterTags(product)));
    }
    if (certFilters.has("aafco")) {
      products = products.filter(
        (product) =>
          product.aafcoCertified && (product.certStandard ?? "AAFCO") === "AAFCO"
      );
    }
    if (certFilters.has("fediaf")) {
      products = products.filter(
        (product) => product.aafcoCertified && product.certStandard === "FEDIAF"
      );
    }
    if (certFilters.has("nrc")) {
      products = products.filter((product) => product.nrcCertified);
    }
    if (certFilters.has("haccp")) {
      products = products.filter((product) => product.haccpCertified);
    }
    if (featureFilters.size > 0) {
      products = products.filter((product) =>
        Array.from(featureFilters).every((feature) =>
          productMatchesFeatureFilter(product, feature)
        )
      );
    }
    if (originFilter !== ALL_ORIGIN) {
      products = products.filter(
        (product) => getProductOrigin(product) === originFilter
      );
    }
    if (filingFilters.size > 0) {
      products = products.filter((product) =>
        product.officialFiling?.records.some((record) =>
          filingFilters.has(record.sourceType)
        )
      );
    }
    if (manufacturerFactory !== ALL_FACTORY) {
      products = products.filter((product) =>
        product.officialFiling?.records.some(
          (record) =>
            record.sourceType === "製造、加工" && record.company === manufacturerFactory
        )
      );
    }
    if (subcontractorFactory !== ALL_FACTORY) {
      products = products.filter((product) =>
        product.officialFiling?.records.some(
          (record) =>
            (record.sourceType === "委託代工廠製造" || record.sourceType === "輸入") &&
            record.subcontractor === subcontractorFactory
        )
      );
    }
    return [...products].sort((a, b) => {
      if (sortOrder === "random") {
        return hashSeed(a.id, shuffleSeed) - hashSeed(b.id, shuffleSeed);
      }
      const scoreA = computeProductScore(a)?.total ?? -1;
      const scoreB = computeProductScore(b)?.total ?? -1;
      return scoreB - scoreA;
    });
  }, [
    baseFilteredProducts,
    searchQuery,
    quickFilters,
    certFilters,
    featureFilters,
    originFilter,
    filingFilters,
    manufacturerFactory,
    subcontractorFactory,
    sortOrder,
    shuffleSeed,
  ]);

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

      <div className="mb-4">
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜尋品牌或飼料、主食罐名稱..."
            className="w-full rounded-full border border-cream-border bg-white py-2.5 pl-10 pr-4 text-sm text-stone-700 outline-none transition focus:border-milktea focus:ring-1 focus:ring-milktea"
          />
        </div>
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

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-stone-400">排序</span>
        <button
          type="button"
          onClick={() => {
            setSortOrder("random");
            setShuffleSeed(Math.random());
          }}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            sortOrder === "random"
              ? "border-stone-800 bg-stone-800 text-white"
              : "border-cream-border bg-white text-stone-600 hover:border-milktea/60 hover:text-milktea-dark"
          }`}
        >
          隨機看看
        </button>
        <button
          type="button"
          onClick={() => setSortOrder("desc")}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
            sortOrder === "desc"
              ? "border-stone-800 bg-stone-800 text-white"
              : "border-cream-border bg-white text-stone-600 hover:border-milktea/60 hover:text-milktea-dark"
          }`}
        >
          分數高到低
        </button>
      </div>

      <button
        type="button"
        onClick={handlePairingWizard}
        className="mb-4 w-full rounded-2xl bg-gradient-to-r from-stone-800 to-stone-700 px-5 py-4 text-center text-white transition hover:brightness-110 active:scale-[0.99]"
      >
        <p className="font-bold">✨ 30 秒配對精靈</p>
        <p className="mt-0.5 text-xs text-white/70">
          告訴我毛孩狀況，幫你篩出適合又高分的主食
        </p>
      </button>

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterChip
          label="🩺 腎臟友善"
          checked={quickFilters.has("kidney")}
          onToggle={() => toggleQuickFilter("kidney")}
        />
        <FilterChip
          label="💪 高蛋白"
          checked={quickFilters.has("highProtein")}
          onToggle={() => toggleQuickFilter("highProtein")}
        />
        <FilterChip
          label="🌾 低碳水"
          checked={quickFilters.has("lowCarb")}
          onToggle={() => toggleQuickFilter("lowCarb")}
        />
        <FilterChip
          label="🥩 單一肉源"
          checked={quickFilters.has("singleMeat")}
          onToggle={() => toggleQuickFilter("singleMeat")}
        />
        <button
          type="button"
          onClick={() =>
            moreFiltersRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
          className="rounded-full border border-cream-border bg-white px-3 py-1.5 text-xs font-medium text-stone-500 transition hover:border-milktea/60 hover:text-milktea-dark"
        >
          更多需求 →
        </button>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-xs font-medium text-stone-400">基本篩選</p>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="全部"
              checked={featureFilters.size === 0 && !certFilters.has("aafco") && !certFilters.has("fediaf")}
              onToggle={() => {
                setFeatureFilters((prev) => {
                  const next = new Set(prev);
                  lifeStageTags.forEach((tag) => next.delete(tag));
                  return next;
                });
                setCertFilters((prev) => {
                  const next = new Set(prev);
                  next.delete("aafco");
                  next.delete("fediaf");
                  return next;
                });
              }}
            />
            {lifeStageTags.map((tag) => (
              <FilterChip
                key={tag}
                label={tag}
                checked={featureFilters.has(tag)}
                onToggle={() => toggleFeatureFilter(tag)}
              />
            ))}
            <FilterChip
              label="AAFCO"
              checked={certFilters.has("aafco")}
              onToggle={() => toggleCertFilter("aafco")}
            />
            <FilterChip
              label="FEDIAF"
              checked={certFilters.has("fediaf")}
              onToggle={() => toggleCertFilter("fediaf")}
            />
            {availableOrigins.length > 0 && (
              <select
                value={originFilter}
                onChange={(e) => setOriginFilter(e.target.value)}
                className="rounded-full border border-cream-border bg-white px-3 py-1.5 text-xs font-medium text-stone-600 outline-none transition focus:border-milktea focus:ring-1 focus:ring-milktea"
              >
                <option value={ALL_ORIGIN}>🌏 {ALL_ORIGIN}</option>
                {availableOrigins.map((origin) => (
                  <option key={origin} value={origin}>
                    {getCountryFlagEmoji(origin)} {origin}
                  </option>
                ))}
              </select>
            )}
        </div>
      </div>

      <p className="mb-4 text-xs text-stone-400">
        {activeTab === ALL ? "全部分類" : activeTab}
        {searchQuery.trim() ||
        quickFilters.size > 0 ||
        certFilters.size > 0 ||
        featureFilters.size > 0 ||
        originFilter !== ALL_ORIGIN ||
        filingFilters.size > 0
          ? "已篩選"
          : sortOrder === "random"
            ? "隨機瀏覽"
            : "全部"}
        {" · "}
        {filteredProducts.length} 款
      </p>

      <div className="mb-6 flex flex-col gap-4" ref={moreFiltersRef}>
        {(meatSpeciesTags.length > 0 || attributeTags.length > 0 || otherIngredientTags.length > 0) && (
              <div>
                <button
                  type="button"
                  onClick={() => setShowMeatSection((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-milktea-dark"
                >
                  肉類與成分篩選
                  <span
                    className={`text-xs transition-transform ${showMeatSection ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
                {showMeatSection && (
                  <div className="mt-2 flex flex-col gap-2">
                    {meatSpeciesTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {meatSpeciesTags.map((tag) => (
                          <FilterChip
                            key={tag}
                            label={tag}
                            checked={featureFilters.has(tag)}
                            onToggle={() => toggleFeatureFilter(tag)}
                          />
                        ))}
                      </div>
                    )}
                    {attributeTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {attributeTags.map((tag) => (
                          <FilterChip
                            key={tag}
                            label={tag}
                            checked={featureFilters.has(tag)}
                            onToggle={() => toggleFeatureFilter(tag)}
                            variant="attribute"
                          />
                        ))}
                      </div>
                    )}
                    {otherIngredientTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {otherIngredientTags.map((tag) => (
                          <FilterChip
                            key={tag}
                            label={tag}
                            checked={featureFilters.has(tag)}
                            onToggle={() => toggleFeatureFilter(tag)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {healthPurposeTags.length > 0 && (
              <div className="border-t border-cream-border pt-4">
                <button
                  type="button"
                  onClick={() => setShowHealthSection((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-milktea-dark"
                >
                  保健功能篩選
                  <span
                    className={`text-xs transition-transform ${showHealthSection ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
                {showHealthSection && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {healthPurposeTags.map((tag) => (
                      <FilterChip
                        key={tag}
                        label={tag}
                        checked={featureFilters.has(tag)}
                        onToggle={() => toggleFeatureFilter(tag)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {(availableFilingSourceTypes.length > 0 ||
              certFilters.has("nrc") ||
              certFilters.has("haccp")) && (
              <div className="border-t border-cream-border pt-4">
                <button
                  type="button"
                  onClick={() => setShowFilingSection((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-600 hover:text-milktea-dark"
                >
                  官方申報資料篩選
                  <span
                    className={`text-xs transition-transform ${showFilingSection ? "rotate-180" : ""}`}
                  >
                    ▾
                  </span>
                </button>
                {showFilingSection && (
                  <div className="mt-2 flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                      <FilterChip
                        label="NRC 認證"
                        checked={certFilters.has("nrc")}
                        onToggle={() => toggleCertFilter("nrc")}
                      />
                      <FilterChip
                        label="HACCP 認證"
                        checked={certFilters.has("haccp")}
                        onToggle={() => toggleCertFilter("haccp")}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableFilingSourceTypes.map((type) => (
                        <FilterChip
                          key={type}
                          label={type}
                          checked={filingFilters.has(type)}
                          onToggle={() => toggleFilingFilter(type)}
                        />
                      ))}
                    </div>
                    {(availableManufacturerFactories.length > 0 ||
                      availableSubcontractorFactories.length > 0) && (
                      <div>
                        <p className="mb-1.5 text-stone-500">
                          代工／製造廠（要先選上面的來源類型）
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {filingFilters.has("製造、加工") &&
                            availableManufacturerFactories.length > 0 && (
                              <select
                                value={manufacturerFactory}
                                onChange={(e) => setManufacturerFactory(e.target.value)}
                                className="rounded-lg border border-cream-border bg-white px-2 py-1.5 text-xs text-stone-700 outline-none transition focus:border-milktea focus:ring-1 focus:ring-milktea"
                              >
                                <option value={ALL_FACTORY}>🏭 製造加工廠</option>
                                {availableManufacturerFactories.map((name) => (
                                  <option key={name} value={name}>
                                    {name}
                                  </option>
                                ))}
                              </select>
                            )}
                          {(filingFilters.has("委託代工廠製造") || filingFilters.has("輸入")) &&
                            availableSubcontractorFactories.length > 0 && (
                              <select
                                value={subcontractorFactory}
                                onChange={(e) => setSubcontractorFactory(e.target.value)}
                                className="rounded-lg border border-cream-border bg-white px-2 py-1.5 text-xs text-stone-700 outline-none transition focus:border-milktea focus:ring-1 focus:ring-milktea"
                              >
                                <option value={ALL_FACTORY}>🏭 委託代工廠</option>
                                {availableSubcontractorFactories.map((name) => (
                                  <option key={name} value={name}>
                                    {name}
                                  </option>
                                ))}
                              </select>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

        <p className="text-[11px] leading-relaxed text-stone-400">
          資料來自農業部寵物食品申報網。是廠商自己申報、任何人都查得到的公開紀錄。比對是程式自動跑的，偶爾會對錯。
        </p>
      </div>

      <div className="mb-4 flex items-center justify-end gap-1 rounded-lg border border-cream-border bg-white p-1">
        <button
          type="button"
          onClick={() => setViewMode("list")}
          aria-label="橫式清單檢視"
          title="橫式清單檢視"
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            viewMode === "list"
              ? "bg-milktea/15 text-milktea-dark"
              : "text-stone-400 hover:text-stone-600"
          }`}
        >
          ☰ 清單
        </button>
        <button
          type="button"
          onClick={() => setViewMode("grid")}
          aria-label="格狀檢視"
          title="格狀檢視"
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
            viewMode === "grid"
              ? "bg-milktea/15 text-milktea-dark"
              : "text-stone-400 hover:text-stone-600"
          }`}
        >
          ⊞ 格狀
        </button>
      </div>

      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            : "flex flex-col gap-6"
        }
      >
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            liked={likedIds.has(product.id)}
            onToggleLike={handleToggleLike}
            compact={viewMode === "grid"}
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
  variant = "default",
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
  variant?: "default" | "attribute";
}) {
  const uncheckedClass =
    variant === "attribute"
      ? "border-milktea/50 bg-milktea/5 text-milktea-dark hover:border-milktea"
      : "border-cream-border bg-white text-stone-600 hover:border-milktea/60 hover:text-milktea-dark";
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        checked ? "border-milktea bg-milktea text-cream-card" : uncheckedClass
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
  compact = false,
}: {
  product: PetProduct;
  liked: boolean;
  onToggleLike: (productId: string) => void;
  compact?: boolean;
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

  if (compact) {
    return (
      <article className="flex flex-col gap-2 rounded-2xl border border-amber-100/60 bg-white p-3 shadow-sm transition-all hover:shadow-md">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white">
          <Image
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-3"
          />
          <div className="absolute right-2 top-2">
            <LikeButton liked={liked} onToggle={() => onToggleLike(product.id)} />
          </div>
        </div>

        {score && <ScoreBadge score={score} />}
        {!score && product.category === "貓咪處方乾糧" && (
          <PrescriptionBadge info={product.prescriptionInfo} />
        )}

        <div>
          <p className="text-xs font-medium text-amber-800/60">{product.brand}</p>
          <h3 className="line-clamp-2 text-sm font-bold text-slate-800">
            {product.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {product.dmbCarb !== undefined && (
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getDmbBadgeClass(product.dmbCarb, product.category)}`}
            >
              DMB {product.dmbCarb.toFixed(1)}%
            </span>
          )}
          {product.aafcoCertified !== undefined && (
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                product.aafcoCertified
                  ? "border-matcha/40 bg-matcha/10 text-matcha"
                  : "border-amber-500/40 bg-amber-400/10 text-amber-700"
              }`}
            >
              {product.aafcoCertified ? `✅ ${certStandard}` : `⚠️ 未標示`}
            </span>
          )}
        </div>

        {catVerdictSummary && (
          <p className="line-clamp-1 text-xs text-stone-500">
            🐾 {catVerdictSummary}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <p className="text-base font-bold text-stone-800">NT$ {product.price}</p>
          <a
            href={product.affiliateUrl}
            target="_blank"
            rel="nofollow sponsored noopener noreferrer"
            className="flex items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-bold text-white transition-all hover:bg-orange-600 active:scale-[0.98]"
          >
            🛒 購買
          </a>
        </div>
      </article>
    );
  }

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
        {!score && product.category === "貓咪處方乾糧" && (
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
            {product.haccpCertified !== undefined && (
              <span
                className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                  product.haccpCertified
                    ? "border-matcha/40 bg-matcha/10 text-matcha"
                    : "border-amber-500/40 bg-amber-400/10 text-amber-700"
                }`}
              >
                {product.haccpCertified ? "✅ HACCP 認證" : "⚠️ 未標示 HACCP"}
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
            {(product.detailedAnalysis?.originCountry ?? product.originCountry) && (
              <span className="rounded-full border border-stone-300 bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600">
                {getCountryFlagEmoji(
                  product.detailedAnalysis?.originCountry ?? product.originCountry!
                )}
                {product.detailedAnalysis?.originCountry ?? product.originCountry}
              </span>
            )}
          </div>

          <p className="text-sm text-stone-600">{product.review.comment}</p>
          {catVerdictSummary && (
            <p className="mt-1.5 text-sm text-stone-500">
              🐾 毛孩評價：{catVerdictSummary}
            </p>
          )}
          {product.relatedNews && product.relatedNews.length > 0 && (
            <div className="mt-1.5 flex flex-col gap-0.5">
              {product.relatedNews.map((news) => (
                <a
                  key={news.url}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-brand-orange-dark hover:underline"
                >
                  📰 {news.date ? `${news.date}｜` : ""}
                  {news.title} →
                </a>
              ))}
            </div>
          )}

          {score && (
            <div className="mt-3">
              <ScoreBreakdown score={score} />
            </div>
          )}
          {!score && product.category === "貓咪處方乾糧" && product.prescriptionInfo && (
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

          <div className="flex flex-wrap items-center gap-2">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
              className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-orange-500 px-6 py-2.5 font-bold text-white transition-all hover:bg-orange-600 active:scale-[0.98]"
            >
              🛒 前往購買
            </a>
            {product.additionalPurchaseLinks?.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                style={{ backgroundColor: link.color }}
                className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-6 py-2.5 font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
              >
                {link.label}
              </a>
            ))}
          </div>
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
          (score.items[0].points === null
            ? "此商品缺灰分／磷／熱量資料，磷與鈣磷比無法計分，總分是用其餘三項（碳水、AAFCO、蛋白質，滿分60）按比例換算成 100 分制，僅供粗略參考，不代表完整評分。"
            : "此商品官方未公布磷／鈣數值，磷含量與鈣磷比項目改用非官方推估值計分（詳見下方成分說明），總分為粗略估算，不代表完整評分。")}
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
          貓咪處方乾糧
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
      <p className="font-semibold text-rose-600">⚕️ 貓咪處方乾糧資訊</p>
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
        ⓘ 貓咪處方乾糧是為特定病理狀況設計，刻意調整蛋白質／礦物質等比例，套用一般保健飼料的評分邏輯會誤導，故不計分。請務必經獸醫診斷評估後使用，不要自行更換或長期餵食。
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
