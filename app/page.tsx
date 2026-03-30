import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="app-shell flex min-h-screen items-center px-4 py-8 md:px-6">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-[2rem] border border-primary/10 bg-card/90 p-6 shadow-sm md:p-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-5">
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">Mahjong PWA</p>
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">立直麻将工具集</h1>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              当前提供番符计算、PT 换算和规则文档三个入口，整体沿用同一套页面风格和交互体系。
            </p>
          </div>
          <div className="shrink-0">
            <Button asChild variant="outline" className="w-full md:w-auto">
              <Link href="/docs">查看规则文档</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="grid gap-4 rounded-[1.5rem] border border-border/80 bg-background/80 p-5">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">Calculator</p>
              <h2 className="text-2xl font-semibold tracking-tight">立直麻将番符计算器</h2>
              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                单页输入流已经搭好：场况条件、手牌、副露、和了牌和固定键盘都在同一页完成。结果区会自动刷新，不需要额外提交。
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.25rem] border border-border/70 bg-card p-4">
              {[
                "场风 / 自风 / 本场数",
                "门前手牌 13 张输入",
                "吃碰杠分区录入",
                "结果区自动预计算",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button asChild size="lg" className="max-md:w-full">
                <Link href="/calculator">进入计算器</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 rounded-[1.5rem] border border-border/80 bg-background/80 p-5">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-foreground">PT</p>
              <h2 className="text-2xl font-semibold tracking-tight">日麻 PT 计算器</h2>
              <p className="text-sm leading-7 text-muted-foreground md:text-base">
                输入四家终局点数，按常见的 `25000 起点 / 30000 返点 / 20-10 马` 规则直接换算最终 pt，也支持改成你自己的比赛规则。
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.25rem] border border-border/70 bg-card p-4">
              {[
                "四家点数实时校验",
                "默认 25000 / 30000",
                "支持 oka / uma 调整",
                "输出顺位与最终 pt",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm text-foreground"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button asChild size="lg" className="max-md:w-full">
                <Link href="/pt">打开 PT 计算器</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
