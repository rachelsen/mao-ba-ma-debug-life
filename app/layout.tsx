import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "毛拔麻 Debug 生活",
  description:
    "工程師毛拔麻打造的全方位導購網站，用數據與邏輯 Debug 毛孩養護與生活開銷。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body className="min-h-screen bg-cream-bg font-sans text-stone-700 antialiased">
        <Sidebar />
        <div className="md:pl-56">{children}</div>
      </body>
    </html>
  );
}
