import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "立直麻将番符计算器",
  description: "Riichi mahjong han and fu calculator prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full w-full antialiased">
      <body className="min-h-full w-full flex flex-col">{children}</body>
    </html>
  );
}
