import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NaturalPhoto } from "@/components/home/NaturalPhoto";
import { mockPetProducts } from "@/data/mockPetProducts";
import { getFavoriteCounts } from "@/lib/favorites";

export const metadata: Metadata = {
  title: "毛拔麻 Debug 生活",
  description:
    "工程師毛拔麻打造的全方位導購網站，用數據與邏輯 Debug 毛孩養護與生活開銷。",
};

// 每小時重新計算一次「大家最愛的商品」，避免每次都要重新部署才能更新
export const revalidate = 3600;

const CATS = {
  shorthair: { src: "/images/cats/shorthair.png", name: "灰美短" },
  white: { src: "/images/cats/white.png", name: "白貓" },
  norwegianForest: { src: "/images/cats/norwegian-forest.png", name: "挪威森林貓" },
};

export default async function HomePage() {
  const counts = await getFavoriteCounts();
  const rankedProducts = mockPetProducts
    .map((product) => ({ product, count: counts[product.id] ?? 0 }))
    .sort((a, b) => b.count - a.count);
  const topProducts = rankedProducts.filter((entry) => entry.count > 0).slice(0, 10);
  const hasFavorites = topProducts.length > 0;

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
            毛拔麻 <span className="text-brand-orange">Debug</span> 生活
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-stone-500 sm:text-lg">
            從毛孩飲食成分分析、信用卡刷卡回饋，到食衣住行旅遊優惠，
            <br />
            數據化幫你挑選最高 CP 值生活提案。
          </p>
          <p className="mx-auto mt-2 max-w-2xl text-xs text-stone-400 sm:text-sm">
            🔒 溫馨提醒：此網站由資安工程師維護，請大家安心使用。
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
          <div className="flex items-center p-8 sm:p-10">
            <div>
              <h2 className="text-2xl font-extrabold leading-snug text-stone-800 sm:text-3xl">
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
          </div>
        </section>

        {/* 大家最愛的商品 */}
        {hasFavorites && (
          <section className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm sm:p-10">
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-rose-300/50 bg-rose-50 px-3 py-1 text-sm font-medium text-rose-500">
              🏆 大家最愛的商品 Top {topProducts.length}
            </div>
            <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {topProducts.map(({ product, count }, index) => (
                <Link
                  key={product.id}
                  href="/pets"
                  className="group flex w-40 shrink-0 flex-col gap-3 sm:w-48"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-slate-100 bg-cream-bg-light">
                    <span className="absolute left-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-slate-800/85 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <Image
                      src={product.image}
                      alt={`${product.brand} ${product.name}`}
                      fill
                      sizes="192px"
                      className="object-contain p-3 transition group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-amber-800/60">
                      {product.brand}
                    </p>
                    <h3 className="mt-0.5 line-clamp-2 text-sm font-bold text-slate-800">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs text-stone-500">
                      ❤️ {count} 人收藏
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 關於創作者 About Section */}
        <section className="rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-sm sm:p-10">
          <div className="mx-auto mb-5 flex max-w-xs items-center justify-center gap-2">
            <NaturalPhoto src={CATS.shorthair.src} alt={CATS.shorthair.name} className="w-14" />
            <NaturalPhoto src={CATS.white.src} alt={CATS.white.name} className="w-14" />
            <NaturalPhoto src={CATS.norwegianForest.src} alt={CATS.norwegianForest.name} className="w-14" />
          </div>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-stone-500 sm:text-base">
            🌿 關於這裡：由生活在森林裡，擁有三隻貓咪的工程師毛拔麻打造。
            <br />
            用理性數據幫大家找到最高 CP 值的生活提案！
          </p>
        </section>
      </div>
    </main>
  );
}
