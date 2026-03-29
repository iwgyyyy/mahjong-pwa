import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import type { CalculationSummary } from "@/lib/mahjong/types";

type ResultAlert = {
  title: string;
  description: string;
};

type ResultPanelProps = {
  summary: CalculationSummary;
  alerts: ResultAlert[];
};

export function ResultPanel({ summary, alerts }: ResultPanelProps) {
  if (summary.status === "incomplete") {
    return (
      <Card className="panel-surface min-w-0">
        <CardHeader className="border-b border-border/70">
          <CardTitle>计算结果</CardTitle>
          <CardDescription>输入完整后自动计算，无需手动点击按钮。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-4">
          {alerts.map((item) => (
            <Alert key={item.title}>
              <AlertTitle>{item.title}</AlertTitle>
              <AlertDescription>{item.description}</AlertDescription>
            </Alert>
          ))}
          <Alert>
            <AlertTitle>等待计算</AlertTitle>
            <AlertDescription>{summary.message}</AlertDescription>
          </Alert>
        </CardContent>
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
      <CardContent className="flex flex-col gap-4 pt-4">
        {alerts.map((item) => (
          <Alert key={item.title}>
            <AlertTitle>{item.title}</AlertTitle>
            <AlertDescription>{item.description}</AlertDescription>
          </Alert>
        ))}

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">役种</p>
          {summary.yaku.length === 0 ? (
            <Alert>
              <AlertTitle>役种提示</AlertTitle>
              <AlertDescription>当前只检测到手牌完成状态，还没有命中场况类番种。</AlertDescription>
            </Alert>
          ) : (
            <div className="flex flex-col gap-2">
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
          <CollapsibleContent className="mt-3 flex flex-col gap-2">
            {summary.fuBreakdown.map((line) => (
              <div key={line.label} className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{line.label}</span>
                <span>+{line.value}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Alert>
          <AlertTitle>说明</AlertTitle>
          <AlertDescription>{summary.note}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
