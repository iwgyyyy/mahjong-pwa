import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="app-shell flex min-h-screen items-center px-4 py-8 md:px-6">
      <section className="mx-auto grid w-full max-w-6xl gap-6 rounded-[2rem] border border-primary/10 bg-card/90 p-6 shadow-sm md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div className="space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Mahjong PWA</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">立直麻将番符计算器</h1>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            单页输入流已经搭好：场况条件、手牌、副露、和了牌和固定键盘都在同一页完成。结果区会自动刷新，不需要额外提交。
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/calculator">进入计算器</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-3 rounded-[1.5rem] border border-border/80 bg-background/80 p-4">
          {[
            "场风 / 自风 / 本场数",
            "门前手牌 13 张输入",
            "吃碰杠分区录入",
            "和了牌与自摸 / 荣和切换",
            "剩余张数实时扣减",
            "结果区自动预计算",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm text-foreground"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
