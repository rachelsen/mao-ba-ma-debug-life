"use client";

import { useMemo, useState } from "react";

interface NutrientInputs {
  protein: string;
  fat: string;
  fiber: string;
  ash: string;
  moisture: string;
}

type FoodType = "dry" | "wet";

interface FoodTypeConfig {
  label: string;
  emoji: string;
  moistureHint: string;
  preset: NutrientInputs;
}

const FOOD_TYPE_CONFIG: Record<FoodType, FoodTypeConfig> = {
  dry: {
    label: "乾糧 Dry",
    emoji: "🌾",
    moistureHint: "乾糧水分通常落在 6%–10%",
    preset: { protein: "30", fat: "15", fiber: "3", ash: "7", moisture: "10" },
  },
  wet: {
    label: "主食罐/濕糧 Wet",
    emoji: "🥫",
    moistureHint: "主食罐／濕糧水分建議落在 75%–85%",
    preset: { protein: "10", fat: "5", fiber: "1", ash: "2", moisture: "78" },
  },
};

type Species = "cat" | "dog";

interface SpeciesStandard {
  label: string;
  emoji: string;
  passMax: number;
  warningMax: number;
  tierText: { pass: string; warning: string; fail: string };
}

const SPECIES_STANDARDS: Record<Species, SpeciesStandard> = {
  cat: {
    label: "貓咪",
    emoji: "🐱",
    passMax: 10,
    warningMax: 25,
    tierText: { pass: "優良低碳水", warning: "中等", fail: "偏高" },
  },
  dog: {
    label: "狗狗",
    emoji: "🐶",
    passMax: 25,
    warningMax: 40,
    tierText: { pass: "低碳水配方", warning: "標準範圍", fail: "偏高" },
  },
};

type DebugTier = "pass" | "warning" | "fail";

interface DebugResult {
  tier: DebugTier;
  label: string;
  emoji: string;
  description: string;
  badgeClass: string;
  cardClass: string;
}

const TIER_DESCRIPTIONS: Record<Species, Record<DebugTier, string>> = {
  cat: {
    pass: "優質低碳水主食，適合長期食用。",
    warning: "碳水偏高，建議搭配其他低碳飲食輪替。",
    fail: "碳水過高，不建議當長期主食。",
  },
  dog: {
    pass: "低碳水配方，適合長期作為主食。",
    warning: "碳水落在標準範圍內，可作為日常主食。",
    fail: "碳水偏高，建議搭配其他低碳飲食輪替或當點心。",
  },
};

function getDebugResult(carb: number, species: Species): DebugResult {
  const standard = SPECIES_STANDARDS[species];

  if (carb < standard.passMax) {
    return {
      tier: "pass",
      label: `PASS・${standard.tierText.pass}`,
      emoji: "🎉",
      description: TIER_DESCRIPTIONS[species].pass,
      badgeClass: "bg-matcha/15 text-matcha border-matcha/40",
      cardClass: "border-matcha/50",
    };
  }
  if (carb <= standard.warningMax) {
    return {
      tier: "warning",
      label: `WARNING・${standard.tierText.warning}`,
      emoji: "⚠️",
      description: TIER_DESCRIPTIONS[species].warning,
      badgeClass: "bg-amber-400/20 text-amber-700 border-amber-500/40",
      cardClass: "border-amber-500/50",
    };
  }
  return {
    tier: "fail",
    label: `FAIL・${standard.tierText.fail}`,
    emoji: "❌",
    description: TIER_DESCRIPTIONS[species].fail,
    badgeClass: "bg-red-400/15 text-red-600 border-red-400/40",
    cardClass: "border-red-400/50",
  };
}

const FIELDS: { key: keyof NutrientInputs; label: string }[] = [
  { key: "protein", label: "蛋白質" },
  { key: "fat", label: "脂肪" },
  { key: "fiber", label: "粗纖維" },
  { key: "ash", label: "灰份" },
  { key: "moisture", label: "水分" },
];

interface ChecklistState {
  aafco: boolean;
  caPRatio: boolean;
}

const INITIAL_CHECKLIST: ChecklistState = { aafco: false, caPRatio: false };

export default function CarbCalculator() {
  const [foodType, setFoodType] = useState<FoodType>("wet");
  const [species, setSpecies] = useState<Species>("cat");
  const [inputs, setInputs] = useState<NutrientInputs>(
    FOOD_TYPE_CONFIG.wet.preset
  );
  const [checklist, setChecklist] = useState<ChecklistState>(INITIAL_CHECKLIST);

  const handleChange = (key: keyof NutrientInputs, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const handleFoodTypeChange = (type: FoodType) => {
    setFoodType(type);
    setInputs(FOOD_TYPE_CONFIG[type].preset);
  };

  const handleChecklistChange = (key: keyof ChecklistState, value: boolean) => {
    setChecklist((prev) => ({ ...prev, [key]: value }));
  };

  const calculation = useMemo(() => {
    const protein = parseFloat(inputs.protein) || 0;
    const fat = parseFloat(inputs.fat) || 0;
    const fiber = parseFloat(inputs.fiber) || 0;
    const ash = parseFloat(inputs.ash) || 0;
    const moisture = parseFloat(inputs.moisture) || 0;

    if (moisture >= 100) {
      return { status: "error" as const, error: "水分不可為 100% 或以上" };
    }

    const sumOthers = protein + fat + fiber + ash + moisture;
    if (sumOthers > 100) {
      return {
        status: "error" as const,
        error: "各項數值加總已超過 100%，請檢查輸入是否正確",
      };
    }

    const dryMatterCarb =
      ((100 - moisture - protein - fat - ash - fiber) / (100 - moisture)) * 100;

    return { status: "ok" as const, carb: dryMatterCarb };
  }, [inputs]);

  const result =
    calculation.status === "ok"
      ? getDebugResult(calculation.carb, species)
      : null;

  const idealCarb =
    calculation.status === "ok" &&
    calculation.carb < SPECIES_STANDARDS[species].passMax;

  const compliance =
    calculation.status === "ok"
      ? !checklist.aafco
        ? {
            type: "warning" as const,
            text: "⚠️ 注意：若未標示符合 AAFCO/FEDIAF，可能為副食罐，不宜作為每日唯一主食喔！",
          }
        : checklist.caPRatio && idealCarb
          ? {
              type: "success" as const,
              text: `🎉 通過毛拔麻嚴選！這是一款優質的${foodType === "dry" ? "乾糧" : "主食罐"}。`,
            }
          : {
              type: "info" as const,
              text: "請完成以上檢核項目，確認鈣磷比與碳水標準是否皆符合，才能完整判斷是否適合當主食。",
            }
      : null;

  return (
    <section className="rounded-2xl border border-cream-border bg-cream-card p-6 shadow-lg shadow-stone-300/40 sm:p-8">
      <div className="mb-6 flex items-center gap-2">
        <h2 className="text-xl font-bold text-stone-800 sm:text-2xl">
          碳水化合物 Debug 計算器
        </h2>
      </div>
      <p className="mb-6 text-sm text-stone-500">
        輸入飼料保證分析值（As-Fed 濕基），自動換算乾物質基礎碳水化合物比例。貓咪、狗狗的乾糧與罐頭皆適用。
      </p>

      <div className="mb-6 flex flex-wrap gap-3">
        {/* 乾糧 / 濕糧切換 */}
        <div className="inline-flex rounded-full border border-cream-border bg-cream-bg p-1">
          {(Object.keys(FOOD_TYPE_CONFIG) as FoodType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handleFoodTypeChange(type)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                foodType === type
                  ? "bg-matcha text-cream-card shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {FOOD_TYPE_CONFIG[type].emoji} {FOOD_TYPE_CONFIG[type].label}
            </button>
          ))}
        </div>

        {/* 犬貓切換 */}
        <div className="inline-flex rounded-full border border-cream-border bg-cream-bg p-1">
          {(Object.keys(SPECIES_STANDARDS) as Species[]).map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => setSpecies(sp)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                species === sp
                  ? "bg-milktea text-cream-card shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {SPECIES_STANDARDS[sp].emoji} {SPECIES_STANDARDS[sp].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {FIELDS.map(({ key, label }) => (
          <label key={key} className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-stone-600">{label}</span>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                step={0.1}
                value={inputs[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full rounded-lg border border-cream-border bg-white px-3 py-2 pr-7 text-stone-800 outline-none transition focus:border-milktea focus:ring-1 focus:ring-milktea"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                %
              </span>
            </div>
            {key === "moisture" && (
              <span className="text-xs text-stone-400">
                💡 {FOOD_TYPE_CONFIG[foodType].moistureHint}
              </span>
            )}
          </label>
        ))}
      </div>

      <div className="mt-6">
        {calculation.status === "error" ? (
          <div className="rounded-xl border border-red-400/50 bg-red-50 p-4 text-sm text-red-600">
            {calculation.error}
          </div>
        ) : (
          result && (
            <div
              className={`flex flex-col gap-4 rounded-xl border bg-cream-bg p-5 sm:flex-row sm:items-center sm:justify-between ${result.cardClass}`}
            >
              <div>
                <p className="font-mono text-xs uppercase tracking-wide text-stone-400">
                  Debug Output — dryMatterCarb ({SPECIES_STANDARDS[species].label}標準)
                </p>
                <p className="mt-1 text-3xl font-bold text-stone-800">
                  {calculation.carb.toFixed(1)}
                  <span className="text-lg text-stone-400"> %</span>
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold ${result.badgeClass}`}
                >
                  {result.emoji} {result.label}
                </span>
                <p className="text-sm text-stone-500 sm:text-right">
                  {result.description}
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* 犬貓對照標準 */}
      <div className="mt-5 rounded-xl border border-cream-border bg-cream-bg p-4">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-stone-400">
          Evaluation Standard — 犬貓對照標準
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(SPECIES_STANDARDS) as Species[]).map((sp) => {
            const standard = SPECIES_STANDARDS[sp];
            const isActive = sp === species;
            return (
              <div
                key={sp}
                className={`rounded-lg border p-3 transition ${
                  isActive
                    ? "border-milktea bg-white shadow-sm"
                    : "border-cream-border/70 bg-cream-bg-light/40"
                }`}
              >
                <p className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-stone-700">
                  {standard.emoji} {standard.label}標準
                  {isActive && (
                    <span className="rounded-full bg-milktea/15 px-2 py-0.5 text-[10px] font-medium text-milktea-dark">
                      目前套用
                    </span>
                  )}
                </p>
                <ul className="space-y-0.5 text-xs text-stone-500 sm:text-sm">
                  <li>
                    &lt; {standard.passMax}%{" "}
                    <span className="text-matcha">
                      （{standard.tierText.pass}）
                    </span>
                  </li>
                  <li>
                    {standard.passMax}%–{standard.warningMax}%{" "}
                    <span className="text-amber-600">
                      （{standard.tierText.warning}）
                    </span>
                  </li>
                  <li>
                    &gt; {standard.warningMax}%{" "}
                    <span className="text-red-500">
                      （{standard.tierText.fail}）
                    </span>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* AAFCO / FEDIAF 主食合規性 Check List */}
      <div className="mt-5 rounded-xl border border-cream-border bg-cream-bg p-4">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-stone-400">
          Compliance Checklist — 毛拔麻嚴選把關
        </p>
        <div className="space-y-2.5">
          <label className="flex items-start gap-2.5 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={checklist.aafco}
              onChange={(e) => handleChecklistChange("aafco", e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-cream-border text-milktea focus:ring-milktea"
            />
            <span>
              包裝標示符合 AAFCO 或 FEDIAF 營養標準（確認為主食而非副食罐）
            </span>
          </label>
          <label className="flex items-start gap-2.5 text-sm text-stone-600">
            <input
              type="checkbox"
              checked={checklist.caPRatio}
              onChange={(e) =>
                handleChecklistChange("caPRatio", e.target.checked)
              }
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-cream-border text-milktea focus:ring-milktea"
            />
            <span>鈣磷比符合標準（理想範圍約 1.1:1 ~ 1.4:1）</span>
          </label>
          <div className="flex items-start gap-2.5 text-sm text-stone-500">
            <input
              type="checkbox"
              checked={idealCarb}
              disabled
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-cream-border text-matcha"
            />
            <span>
              乾物質碳水化合物符合理想標準
              <span className="ml-1.5 inline-block rounded-full bg-milktea/10 px-1.5 py-0.5 text-[10px] text-milktea-dark">
                依上方計算結果自動判讀
              </span>
            </span>
          </div>
        </div>

        {compliance && (
          <div
            className={`mt-4 rounded-lg border p-3 text-sm ${
              compliance.type === "success"
                ? "border-matcha/50 bg-matcha/10 text-matcha-dark"
                : compliance.type === "warning"
                  ? "border-amber-500/50 bg-amber-400/10 text-amber-700"
                  : "border-cream-border bg-white text-stone-500"
            }`}
          >
            {compliance.text}
          </div>
        )}
      </div>

    </section>
  );
}
