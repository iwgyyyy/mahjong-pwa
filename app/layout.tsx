import type { Metadata, Viewport } from "next";
import { PwaProvider } from "@/components/providers/pwa-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "立直麻将工具集",
  description: "立直麻将番符计算、PT 计算与规则文档工具站",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/180x180.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
};

export const viewport: Viewport = {
  themeColor: "#111111",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full w-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full w-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
        <PwaProvider />
      </body>
    </html>
  );
}
