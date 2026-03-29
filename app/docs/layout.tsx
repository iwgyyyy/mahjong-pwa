import type { Metadata } from "next";
import { PhotoProvider } from "@/components/docs/PhotoProvider";

export const metadata: Metadata = {
  title: "立直麻将规则文档",
  description: "立直麻将规则、符数与点数速查、常见役种与役满整理。",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <PhotoProvider>{children}</PhotoProvider>;
}
