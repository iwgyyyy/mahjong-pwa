import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ZoomableDocImage } from "@/components/docs/ZoomableDocImage";
import {
  BASIC_IMAGES,
  DRAW_RULES,
  FURITEN_RULES,
  MELD_RULES,
  QUICK_REFERENCE_IMAGES,
  TILE_CATEGORIES,
  YAKU_SECTIONS,
  type RuleImage,
  type RuleItem,
} from "@/lib/docs/riichi-rule";

const NAV_ITEMS = [
  { href: "#basic", label: "基础规则" },
  { href: "#meld", label: "鸣牌与流局" },
  { href: "#furiten", label: "振听" },
  { href: "#quick-ref", label: "快捷表" },
  { href: "#yaku", label: "役种 / 番种" },
] as const;

function DocImage({ image }: { image: RuleImage }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-border/70 bg-background/80 p-3">
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted/40">
        <ZoomableDocImage
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{image.alt}</p>
    </div>
  );
}

function RuleGallery({ items }: { items: RuleImage[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((image) => (
        <DocImage key={image.src} image={image} />
      ))}
    </div>
  );
}

function YakuCard({ item }: { item: RuleItem }) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card/90">
      <CardHeader className="gap-2">
        <CardTitle className="text-lg">{item.title}</CardTitle>
        {item.description ? <CardDescription>{item.description}</CardDescription> : null}
      </CardHeader>
      {item.images?.length ? (
        <CardContent className="flex flex-col gap-4 pt-0">
          <div className={`grid gap-3 ${item.images.length > 1 ? "lg:grid-cols-1" : ""}`}>
            {item.images.map((image) => (
              <div key={image.src} className="overflow-hidden rounded-xl bg-muted/30">
                <ZoomableDocImage
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={240}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-auto w-full object-contain"
                />
              </div>
            ))}
          </div>
        </CardContent>
      ) : null}
    </Card>
  );
}

export default function DocsPage() {
  return (
    <main className="app-shell min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-card/90 p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-4">
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs tracking-[0.2em]">
                  RULE DOCS
                </Badge>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">立直麻将规则文档</h1>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                    按当前项目的页面体系整理成单独的 docs 页面，包含基础规则、鸣牌与流局、振听、符数与点数速查，以及常见役种 / 役满图例。
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/">返回首页</Link>
                </Button>
                <Button asChild>
                  <Link href="/calculator">打开计算器</Link>
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {NAV_ITEMS.map((item) => (
                <Button key={item.href} asChild variant="secondary" size="sm">
                  <a href={item.href}>{item.label}</a>
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section id="basic" className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card className="panel-surface min-w-0">
            <CardHeader>
              <CardTitle>一、牌种</CardTitle>
              <CardDescription>先对牌种做统一定义，后面的规则与役种判断都基于这些基础概念。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {TILE_CATEGORIES.map((item) => (
                <div key={item.name} className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="panel-surface min-w-0">
            <CardHeader>
              <CardTitle>二、面子、搭子、雀头</CardTitle>
              <CardDescription>把基础牌型先看清楚，后面拆牌和听牌判断会更直观。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <RuleGallery items={BASIC_IMAGES} />
            </CardContent>
          </Card>
        </section>

        <section id="meld" className="grid gap-6 xl:grid-cols-2">
          <Card className="panel-surface min-w-0">
            <CardHeader>
              <CardTitle>三、鸣牌（吃、碰、杠）</CardTitle>
              <CardDescription>这里整理了副露、暗杠、抢杠和连续开杠等常见判断。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {MELD_RULES.map((rule) => (
                <div key={rule} className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-muted-foreground">
                  {rule}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="panel-surface min-w-0">
            <CardHeader>
              <CardTitle>四、流局</CardTitle>
              <CardDescription>这些情况一旦满足，牌局会直接按流局处理。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {DRAW_RULES.map((rule, index) => (
                <div key={rule} className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                  <p className="text-sm font-medium">规则 {index + 1}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{rule}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section id="furiten">
          <Card className="panel-surface min-w-0">
            <CardHeader>
              <CardTitle>五、振听</CardTitle>
              <CardDescription>振听表示只能自摸，不能荣和。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Alert>
                <AlertTitle>振听核心</AlertTitle>
                <AlertDescription>只要进入振听状态，就不能对他家打出的和牌张进行荣和，只能等待自摸。</AlertDescription>
              </Alert>
              <div className="grid gap-3 md:grid-cols-3">
                {FURITEN_RULES.map((rule, index) => (
                  <div key={rule} className="rounded-2xl border border-border/70 bg-background/80 px-4 py-4">
                    <p className="text-sm font-medium">振听类型 {index + 1}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{rule}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <section id="quick-ref">
          <Card className="panel-surface min-w-0">
            <CardHeader>
              <CardTitle>六、快捷表</CardTitle>
              <CardDescription>符数计算与庄 / 闲家点数计算速查。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {QUICK_REFERENCE_IMAGES.map((image) => (
                <DocImage key={image.src} image={image} />
              ))}
            </CardContent>
          </Card>
        </section>

        <section id="yaku" className="flex flex-col gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">七、役种 / 番种</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              按番数分组整理，保留原文中的图例，便于快速对照。
            </p>
          </div>

          {YAKU_SECTIONS.map((section, index) => (
            <div key={section.id} id={section.id} className="flex flex-col gap-4">
              {index > 0 ? <Separator /> : null}
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold tracking-tight md:text-2xl">{section.title}</h3>
                  {section.description ? (
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  ) : null}
                </div>
                <Badge variant="secondary">{section.items.length} 项</Badge>
              </div>
              <div className="grid gap-4">
                {section.items.map((item) => (
                  <YakuCard key={`${section.id}-${item.title}`} item={item} />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
