import type { Metadata } from "next";
import Link from "next/link";
import { NaturalPhoto } from "@/components/home/NaturalPhoto";

export const metadata: Metadata = {
  title: "毛拔麻 Debug 生活",
  description:
    "工程師毛拔麻打造的全方位導購網站，用數據與邏輯 Debug 毛孩養護與生活開銷。",
};

const CATS = {
  shorthair: { src: "/images/cats/shorthair.png", name: "灰美短" },
  white: { src: "/images/cats/white.png", name: "白貓" },
  norwegianForest: { src: "/images/cats/norwegian-forest.png", name: "挪威森林貓" },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <header className="relative overflow-hidden border-b border-slate-100 px-4 py-16 sm:px-8 sm:py-24">
        {/* 水彩暈染背景 */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.14),transparent_70%)]" />
        <div className="pointer-events-none absolute -right-16 -top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_70%)]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(176,137,104,0.12),transparent_70%)]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 bg-brand-green/10 px-3 py-1 font-mono text-xs text-brand-green">
            status: debugging life 🐾
          </span>
          <h1 className="mt-5 text-3xl font-extrabold leading-tight text-stone-800 sm:text-4xl lg:text-5xl">
            毛拔麻的生活開銷，讓工程師來
            <span className="text-brand-orange">Debug</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-500 sm:text-lg">
            從毛孩飲食成分分析、信用卡刷卡回饋，到食衣住行旅遊優惠，數據化幫你挑選最高
            CP 值生活提案。
          </p>
        </div>

        {/* 靈魂主角：三隻貓咪水彩寫真 */}
        <div className="relative mx-auto mt-12 flex max-w-2xl items-start justify-center gap-3 sm:gap-6">
          <NaturalPhoto
            src={CATS.shorthair.src}
            alt={CATS.shorthair.name}
            className="w-28 sm:w-36"
            sizes="(min-width: 640px) 144px, 112px"
          />
          <NaturalPhoto
            src={CATS.white.src}
            alt={CATS.white.name}
            className="mt-4 w-28 sm:w-36"
            sizes="(min-width: 640px) 144px, 112px"
          />
          <NaturalPhoto
            src={CATS.norwegianForest.src}
            alt={CATS.norwegianForest.name}
            className="w-28 sm:w-36"
            sizes="(min-width: 640px) 144px, 112px"
          />
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-16 px-4 py-14 sm:px-8">
        {/* 寵物 Debug 亮點引導區 */}
        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="grid grid-cols-1 items-center gap-8 p-8 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/40 bg-brand-green/10 px-3 py-1 font-mono text-xs text-brand-green">
                function checkCarbRatio()
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-snug text-stone-800 sm:text-3xl">
                想知道毛孩吃的乾乾與罐罐有合格嗎？
                <br />
                立刻 <span className="text-brand-orange">Debug</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-stone-500 sm:text-base">
                輸入保證分析值，一鍵換算乾物質基礎碳水化合物比例，三秒揪出高碳水地雷罐頭，用數據幫毛孩把關飲食品質。
              </p>
              <Link
                href="/pets"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-white shadow-md shadow-brand-orange/30 transition hover:bg-brand-orange-dark active:scale-[0.98]"
              >
                🐾 立即試算
              </Link>
            </div>

            <div className="rounded-2xl border border-cream-border bg-cream-bg-light/60 p-6 font-mono text-xs text-stone-500 sm:text-sm">
              <p className="text-stone-400"># dryMatterCarb.ts</p>
              <p className="mt-2">
                carb = <span className="text-brand-orange">(100 - 水分 - 蛋白質 - 脂肪 - 灰份 - 纖維)</span>
              </p>
              <p>&nbsp;&nbsp;&nbsp;&nbsp;/ (100 - 水分) * 100</p>
              <p className="mt-3 flex items-center gap-2">
                <span className="rounded border border-brand-green/40 bg-brand-green/10 px-2 py-0.5 text-brand-green">
                  🎉 PASS
                </span>
                <span className="text-stone-400">&lt; 10%</span>
              </p>
              <p className="mt-1 flex items-center gap-2">
                <span className="rounded border border-amber-500/40 bg-amber-400/20 px-2 py-0.5 text-amber-700">
                  ⚠️ WARNING
                </span>
                <span className="text-stone-400">10% – 25%</span>
              </p>
              <p className="mt-1 flex items-center gap-2">
                <span className="rounded border border-red-400/40 bg-red-400/15 px-2 py-0.5 text-red-600">
                  ❌ FAIL
                </span>
                <span className="text-stone-400">&gt; 25%</span>
              </p>
            </div>
          </div>
        </section>

        {/* 關於創作者 About Section */}
        <section className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex max-w-xs items-center justify-center gap-2">
            <NaturalPhoto src={CATS.shorthair.src} alt={CATS.shorthair.name} className="w-14" />
            <NaturalPhoto src={CATS.white.src} alt={CATS.white.name} className="w-14" />
            <NaturalPhoto src={CATS.norwegianForest.src} alt={CATS.norwegianForest.name} className="w-14" />
          </div>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-stone-500 sm:text-base">
            🌿 關於這裡：由生活在鹿角蕨、龜背芋與蘋果竹芋森林裡，擁有三隻貓咪（灰銀美短、粉耳白貓、蓬鬆挪威森林貓）的工程師毛拔麻打造。用理性數據幫大家找到最高
            CP 值的生活提案！
          </p>
        </section>
      </div>
    </main>
  );
}
