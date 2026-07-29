"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "首頁", href: "/", emoji: "🏠" },
  { label: "寵物專區", href: "/pets", emoji: "🐾" },
  { label: "旅遊專區", href: "/travel", emoji: "✈️" },
  { label: "信用卡推薦", href: "/cards", emoji: "💳" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* 桌機版：固定左側欄 */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-56 flex-col border-r border-cream-border bg-white px-4 py-6 md:flex">
        <Link
          href="/"
          className="mb-8 px-2 text-base font-bold text-stone-800"
        >
          🐾 毛拔麻 Debug 生活
        </Link>
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-brand-orange/10 text-brand-orange-dark"
                    : "text-stone-600 hover:bg-cream-bg-light hover:text-stone-800"
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 手機版：頂部橫向導覽列 */}
      <nav className="sticky top-0 z-40 flex gap-2 overflow-x-auto border-b border-cream-border bg-white px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-brand-orange bg-brand-orange text-white"
                  : "border-cream-border bg-white text-stone-600"
              }`}
            >
              {item.emoji} {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
