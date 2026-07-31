"use client";

import { useState } from "react";

export default function Footer() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-cream-border bg-cream-bg-light/95 backdrop-blur supports-[backdrop-filter]:bg-cream-bg-light/85 md:left-56">
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 px-4 py-2 text-left text-xs font-medium text-stone-500 sm:px-8"
      >
        <span>⚠️ 免責聲明與資料時效說明</span>
        <span
          className={`shrink-0 text-xs transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      {expanded && (
        <div className="mx-auto max-w-6xl space-y-2 px-4 pb-4 text-xs leading-relaxed text-stone-500 sm:px-8">
          <p>
            ⚠️ 免責聲明：本網站所有評分與內容僅供參考，不構成獸醫診斷或醫療建議。若你的貓咪及狗狗有特殊疾病（腎臟病、糖尿病、消化道疾病等），請務必在更換飼料前諮詢獸醫。
          </p>
          <p>
            📋 資料時效：飼料配方可能因批次或年份調整，我們的資料以收集當時為準，實際成分請以產品標示為主。
          </p>
        </div>
      )}
    </div>
  );
}
