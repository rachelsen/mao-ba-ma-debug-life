import type { Metadata } from "next";
import Link from "next/link";
import PetProductList from "@/components/pets/PetProductList";
import PetSection from "@/components/pets/PetSection";

export const metadata: Metadata = {
  title: "寵物專區｜毛拔麻 Debug 生活",
  description:
    "工程師毛拔麻嚴選！用數據幫你把關碳水成分、鈣磷比與高 CP 值寵物用品，內建乾物質碳水化合物 Debug 計算器。",
};

export default function PetsPage() {
  return (
    <main className="min-h-screen bg-cream-bg">
      <header className="relative overflow-hidden border-b border-cream-border bg-gradient-to-b from-cream-bg-light via-cream-bg to-cream-bg px-4 py-16 sm:px-8 sm:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(176,137,104,0.16),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(124,148,115,0.14),transparent_40%)]"
        />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-matcha/40 bg-matcha/10 px-3 py-1 font-mono text-xs text-matcha">
            ● status: debugging life
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight text-stone-800 sm:text-4xl lg:text-5xl">
            🐾 計算萌寵的飲食與開銷
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-500 sm:text-lg">
            工程師毛拔麻嚴選！用數據幫你把關碳水成分、鈣磷比與高 CP
            值寵物用品。
          </p>
        </div>
      </header>

      <PetSection />

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-8">
        <Link
          href="/pets/carb-calculator"
          className="group flex items-center justify-between gap-4 rounded-2xl border border-cream-border bg-white p-6 shadow-sm transition hover:border-milktea/60 hover:shadow-md sm:p-8"
        >
          <div>
            <h2 className="text-lg font-bold text-stone-800 sm:text-xl">
              🧮 碳水化合物 Debug 計算器
            </h2>
            <p className="mt-1.5 text-sm text-stone-500">
              輸入飼料保證分析值，自動換算乾物質基礎碳水化合物比例，貓咪、狗狗的乾糧與罐頭皆適用。
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-milktea-dark transition group-hover:translate-x-1">
            前往計算 →
          </span>
        </Link>
        <PetProductList />
      </div>
    </main>
  );
}
