import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import type { CalculationSummary } from "@/lib/mahjong/types";

type ResultPanelProps = {
  summary: CalculationSummary;
};

export function ResultPanel({ summary }: ResultPanelProps) {
  if (summary.status === "incomplete") {
    return (
      <Card className="panel-surface min-w-0">
        <CardHeader className="border-b border-border/70">
          <CardTitle>计算结果</CardTitle>
          <CardDescription>输入完整后自动计算，无需手动点击按钮。</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 text-sm text-muted-foreground">{summary.message}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="panel-surface min-w-0">
      <CardHeader className="border-b border-border/70">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
          <div>
            <CardTitle>{summary.title}</CardTitle>
            <CardDescription>{summary.subtitle}</CardDescription>
          </div>
          <Badge className="max-w-full whitespace-normal break-words">{summary.pointsLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">役种</p>
          {summary.yaku.length === 0 ? (
            <p className="text-sm text-muted-foreground">当前只检测到手牌完成状态，还没有命中场况类番种。</p>
          ) : (
            <div className="space-y-2">
              {summary.yaku.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <span>{item.han} 番</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <div className="flex items-center justify-between text-sm font-medium">
          <span>合计</span>
          <span>
            {summary.han} 番 {summary.fu} 符
          </span>
        </div>

        <Collapsible>
          <CollapsibleTrigger className="text-sm font-medium underline-offset-4 hover:underline">
            展开符数详情
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 space-y-2">
            {summary.fuBreakdown.map((line) => (
              <div key={line.label} className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{line.label}</span>
                <span>+{line.value}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <div className="rounded-2xl border border-dashed border-border p-3 text-sm text-muted-foreground">
          {summary.note}
        </div>
      </CardContent>
    </Card>
  );
}
