"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const NAV_ITEMS: {
  label: string;
  href: string;
  emoji: string;
  children: { label: string; href: string; emoji: string }[];
}[] = [
  { label: "首頁 Home", href: "/", emoji: "🏠", children: [] },
  {
    label: "寵物 Pet",
    href: "/pets",
    emoji: "🐾",
    children: [
      {
        label: "碳水化合物 Debug 計算器",
        href: "/pets/carb-calculator",
        emoji: "🧮",
      },
    ],
  },
  { label: "旅行 Travel", href: "/travel", emoji: "✈️", children: [] },
  { label: "信用卡 Credit Card", href: "/cards", emoji: "💳", children: [] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpanded = (href: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  };

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
            const hasChildren = item.children.length > 0;
            const isChildActive = item.children.some(
              (child) => pathname === child.href
            );
            const isExpanded = hasChildren && (expanded.has(item.href) || isChildActive);

            return (
              <div key={item.href}>
                <div className="flex items-center gap-1">
                  <Link
                    href={item.href}
                    className={`flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-brand-orange/10 text-brand-orange-dark"
                        : "text-stone-600 hover:bg-cream-bg-light hover:text-stone-800"
                    }`}
                  >
                    <span>{item.emoji}</span>
                    <span>{item.label}</span>
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(item.href)}
                      aria-label={`展開${item.label}子選單`}
                      aria-expanded={isExpanded}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-400 transition hover:bg-cream-bg-light hover:text-stone-600"
                    >
                      <span
                        className={`text-xs transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      >
                        ▾
                      </span>
                    </button>
                  )}
                </div>
                {hasChildren && isExpanded && (
                  <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-cream-border pl-3">
                    {item.children.map((child) => {
                      const isChildLinkActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                            isChildLinkActive
                              ? "bg-brand-orange/10 text-brand-orange-dark"
                              : "text-stone-500 hover:bg-cream-bg-light hover:text-stone-800"
                          }`}
                        >
                          <span>{child.emoji}</span>
                          <span>{child.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Link
            href="/favorites"
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
              pathname === "/favorites"
                ? "bg-rose-50 text-rose-500"
                : "text-stone-600 hover:bg-cream-bg-light hover:text-stone-800"
            }`}
          >
            <span>❤️</span>
            <span>我的收藏</span>
          </Link>
          <AuthWidget />
          <p className="px-2 pt-1 text-[11px] leading-relaxed text-stone-400">
            🔒 溫馨提醒：此網站由資安工程師維護，請大家安心使用。
          </p>
        </div>
      </aside>

      {/* 手機版：頂部橫向導覽列 */}
      <nav className="sticky top-0 z-40 flex gap-2 overflow-x-auto border-b border-cream-border bg-white px-4 py-3 [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden">
        {NAV_ITEMS.flatMap((item) => {
          const isActive = pathname === item.href;
          const links = [
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
            </Link>,
          ];
          for (const child of item.children) {
            const isChildActive = pathname === child.href;
            links.push(
              <Link
                key={child.href}
                href={child.href}
                className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isChildActive
                    ? "border-brand-orange bg-brand-orange text-white"
                    : "border-cream-border bg-white text-stone-600"
                }`}
              >
                {child.emoji} {child.label}
              </Link>
            );
          }
          return links;
        })}
        <Link
          href="/favorites"
          className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
            pathname === "/favorites"
              ? "border-rose-400 bg-rose-400 text-white"
              : "border-cream-border bg-white text-stone-600"
          }`}
        >
          ❤️ 我的收藏
        </Link>
      </nav>
    </>
  );
}

function AuthWidget() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (session?.user) {
    return (
      <div className="flex items-center gap-2 border-t border-cream-border pt-4">
        {session.user.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={session.user.name ?? "使用者頭像"}
            className="h-8 w-8 shrink-0 rounded-full"
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-stone-700">
            {session.user.name}
          </p>
          <button
            type="button"
            onClick={() => signOut()}
            className="text-xs text-stone-400 hover:text-stone-600"
          >
            登出
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => signIn("google")}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-cream-border px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-cream-bg-light"
    >
      使用 Google 登入
    </button>
  );
}
