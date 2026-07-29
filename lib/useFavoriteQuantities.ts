"use client";

import { useEffect, useState } from "react";

const QTY_STORAGE_KEY = "petfood-favorite-quantities";

function loadQuantities(): Record<string, number> {
  try {
    const raw = window.localStorage.getItem(QTY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

/** 收藏商品的預計購買數量，存在瀏覽器本機，跨頁面共用。 */
export function useFavoriteQuantities() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    setQuantities(loadQuantities());
  }, []);

  const getQuantity = (productId: string) => quantities[productId] ?? 1;

  const setQuantity = (productId: string, quantity: number) => {
    const next = Math.max(1, quantity);
    setQuantities((prev) => {
      const updated = { ...prev, [productId]: next };
      window.localStorage.setItem(QTY_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { getQuantity, setQuantity };
}
