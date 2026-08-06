import type { Metadata } from "next";
import Link from "next/link";
import CarbCalculator from "@/components/pets/CarbCalculator";

export const metadata: Metadata = {
  title: "碳水化合物 Debug 計算器｜毛拔麻 Debug 生活",
  description:
    "輸入飼料保證分析值（As-Fed 濕基），自動換算乾物質基礎碳水化合物比例，貓咪、狗狗的乾糧與罐頭皆適用。",
};

export default function CarbCalculatorPage() {
  return (
    <main className="min-h-screen bg-cream-bg">
      <header className="relative overflow-hidden border-b border-cream-border bg-gradient-to-b from-cream-bg-light via-cream-bg to-cream-bg px-4 py-16 sm:px-8 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(176,137,104,0.16),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(124,148,115,0.14),transparent_40%)]"
        />
        <div className="relative mx-auto max-w-5xl text-center">
          <Link
            href="/pets"
            className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-cream-border bg-white px-3 py-1 text-xs text-stone-500 hover:border-milktea/60 hover:text-milktea-dark"
          >
            ← 回到寵物專區
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold leading-tight text-stone-800 sm:text-4xl lg:text-5xl">
            🧮 碳水化合物 Debug 計算器
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-500 sm:text-lg">
            工程師毛拔麻嚴選！用數據幫你把關碳水成分、鈣磷比與高 CP 值寵物用品。
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <CarbCalculator />
      </div>
    </main>
  );
}
