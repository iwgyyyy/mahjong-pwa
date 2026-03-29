"use client";

import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { calculatePt, formatPt, getOka, type PtPlayerKey } from "@/lib/mahjong/pt";

const PLAYER_CONFIG: Array<{ key: PtPlayerKey; label: string; seatOrder: number }> = [
  { key: "east", label: "东家", seatOrder: 0 },
  { key: "south", label: "南家", seatOrder: 1 },
  { key: "west", label: "西家", seatOrder: 2 },
  { key: "north", label: "北家", seatOrder: 3 },
];

const NULLABLE_INT_NON_NEGATIVE_SCHEMA = z.number().int().min(0, "点数不能小于 0").nullable();
const NULLABLE_POSITIVE_INT_SCHEMA = z.number().int().positive("必须大于 0").nullable();
const NULLABLE_NON_NEGATIVE_SCHEMA = z.number().min(0, "马点不能小于 0").nullable();

const PT_FORM_SCHEMA = z.object({
  east: NULLABLE_INT_NON_NEGATIVE_SCHEMA,
  south: NULLABLE_INT_NON_NEGATIVE_SCHEMA,
  west: NULLABLE_INT_NON_NEGATIVE_SCHEMA,
  north: NULLABLE_INT_NON_NEGATIVE_SCHEMA,
  startPoints: NULLABLE_POSITIVE_INT_SCHEMA,
  returnPoints: NULLABLE_POSITIVE_INT_SCHEMA,
  umaHigh: NULLABLE_NON_NEGATIVE_SCHEMA,
  umaLow: NULLABLE_NON_NEGATIVE_SCHEMA,
});

type PtFormValues = z.infer<typeof PT_FORM_SCHEMA>;
type CompletePtFormValues = Record<keyof PtFormValues, number>;

const DEFAULT_VALUES: CompletePtFormValues = {
  east: 25000,
  south: 25000,
  west: 25000,
  north: 25000,
  startPoints: 25000,
  returnPoints: 30000,
  umaHigh: 20,
  umaLow: 10,
};

function getInputValue(value: number | null | undefined) {
  return value ?? "";
}

function getChangedNumber(value: string) {
  if (value === "") {
    return null;
  }

  return Number(value);
}

function isNumber(value: number | null | undefined): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function toCompleteValues(values: Partial<PtFormValues>): CompletePtFormValues | null {
  if (
    !isNumber(values.east) ||
    !isNumber(values.south) ||
    !isNumber(values.west) ||
    !isNumber(values.north) ||
    !isNumber(values.startPoints) ||
    !isNumber(values.returnPoints) ||
    !isNumber(values.umaHigh) ||
    !isNumber(values.umaLow)
  ) {
    return null;
  }

  return {
    east: values.east,
    south: values.south,
    west: values.west,
    north: values.north,
    startPoints: values.startPoints,
    returnPoints: values.returnPoints,
    umaHigh: values.umaHigh,
    umaLow: values.umaLow,
  };
}

export function PtCalculatorClient() {
  const form = useForm<PtFormValues>({
    resolver: zodResolver(PT_FORM_SCHEMA),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const values = useWatch({
    control: form.control,
    defaultValue: DEFAULT_VALUES,
  });
  const completeValues = toCompleteValues(values);
  const isFormComplete = completeValues !== null;
  const currentValues: CompletePtFormValues = completeValues ?? DEFAULT_VALUES;
  const totalPoints =
    (values.east ?? 0) + (values.south ?? 0) + (values.west ?? 0) + (values.north ?? 0);
  const isTotalValid = totalPoints === 100000;
  const players = PLAYER_CONFIG.map((player) => ({
    ...player,
    points: currentValues[player.key],
  }));
  const result = calculatePt({
    startPoints: currentValues.startPoints,
    returnPoints: currentValues.returnPoints,
    umaHigh: currentValues.umaHigh,
    umaLow: currentValues.umaLow,
    players,
  });
  const oka = getOka(currentValues.startPoints, currentValues.returnPoints);

  return (
    <main className="app-shell min-h-screen px-4 py-6 md:px-6 md:py-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-card/90 p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-4">
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs tracking-[0.2em]">
                  PT CALCULATOR
                </Badge>
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">日麻 PT 计算器</h1>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                    按四家终局点数直接换算 pt。默认采用常见的 `25000 起点 / 30000 返点 / 20-10 马`，并支持手动修改规则参数。
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/">返回首页</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/calculator">番符计算器</Link>
                </Button>
              </div>
            </div>

            <Alert>
              <AlertTitle>规则说明</AlertTitle>
              <AlertDescription>
                    当前默认按 `同点时上家取` 的常见顺位方式处理。这里用输入顺序 `东 → 南 → 西 → 北` 作为同点时的优先顺序。
              </AlertDescription>
            </Alert>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card className="panel-surface min-w-0">
            <CardHeader className="border-b border-border/70">
              <CardTitle>输入参数</CardTitle>
              <CardDescription>先填四家终局点数，再确认当前采用的起点、返点与马点规则。</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <form className="flex flex-col gap-6">
                <FieldGroup>
                  {PLAYER_CONFIG.map((player) => (
                    <Controller
                      key={player.key}
                      name={player.key}
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor={player.key}>{player.label}终局点数</FieldLabel>
                          <FieldContent>
                            <Input
                              id={player.key}
                              type="number"
                              step={100}
                              value={getInputValue(field.value)}
                              onChange={(event) => field.onChange(getChangedNumber(event.target.value))}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              aria-invalid={fieldState.invalid}
                            />
                          </FieldContent>
                          {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                        </Field>
                      )}
                    />
                  ))}
                </FieldGroup>

                <Separator />

                <FieldGroup>
                  <Controller
                    name="startPoints"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="startPoints">起点</FieldLabel>
                        <FieldContent>
                          <Input
                            id="startPoints"
                            type="number"
                            value={getInputValue(field.value)}
                            onChange={(event) => field.onChange(getChangedNumber(event.target.value))}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            aria-invalid={fieldState.invalid}
                          />
                        </FieldContent>
                        <FieldDescription>默认 25000 点。</FieldDescription>
                        {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                      </Field>
                    )}
                  />

                  <Controller
                    name="returnPoints"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="returnPoints">返点</FieldLabel>
                        <FieldContent>
                          <Input
                            id="returnPoints"
                            type="number"
                            value={getInputValue(field.value)}
                            onChange={(event) => field.onChange(getChangedNumber(event.target.value))}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            aria-invalid={fieldState.invalid}
                          />
                        </FieldContent>
                        <FieldDescription>默认 30000 点，会自动算出 oka。</FieldDescription>
                        {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                      </Field>
                    )}
                  />

                  <Controller
                    name="umaHigh"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="umaHigh">一四位马</FieldLabel>
                        <FieldContent>
                          <Input
                            id="umaHigh"
                            type="number"
                            value={getInputValue(field.value)}
                            onChange={(event) => field.onChange(getChangedNumber(event.target.value))}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            aria-invalid={fieldState.invalid}
                          />
                        </FieldContent>
                        <FieldDescription>默认 20，对应一位 +20、四位 -20。</FieldDescription>
                        {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                      </Field>
                    )}
                  />

                  <Controller
                    name="umaLow"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="umaLow">二三位马</FieldLabel>
                        <FieldContent>
                          <Input
                            id="umaLow"
                            type="number"
                            value={getInputValue(field.value)}
                            onChange={(event) => field.onChange(getChangedNumber(event.target.value))}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            aria-invalid={fieldState.invalid}
                          />
                        </FieldContent>
                        <FieldDescription>默认 10，对应二位 +10、三位 -10。</FieldDescription>
                        {fieldState.invalid ? <FieldError errors={[fieldState.error]} /> : null}
                      </Field>
                    )}
                  />
                </FieldGroup>

                <div className="flex flex-wrap gap-3">
                  <Button type="button" variant="secondary" onClick={() => form.reset(DEFAULT_VALUES)}>
                    重置为默认规则
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="panel-surface min-w-0">
            <CardHeader className="border-b border-border/70">
              <CardTitle>计算结果</CardTitle>
              <CardDescription>pt = `(终局点数 - 返点) / 1000 + 顺位点`。顺位点已包含 oka 与 uma。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-4">
              {!isFormComplete ? (
                <Alert>
                  <AlertTitle>请先补全输入</AlertTitle>
                  <AlertDescription>四家终局点数、起点、返点和马点都填完整后，才会显示最终 pt。</AlertDescription>
                </Alert>
              ) : null}

              {isFormComplete && !isTotalValid ? (
                <Alert>
                  <AlertTitle>总点数未闭合</AlertTitle>
                  <AlertDescription>
                    四家终局点数之和需要等于 `100000`。当前总和为 `{totalPoints}`，请先修正点数后再查看最终 pt。
                  </AlertDescription>
                </Alert>
              ) : null}

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                  <p className="text-sm font-medium">当前 oka</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{formatPt(oka)}</p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                  <p className="text-sm font-medium">当前马点</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">
                    {currentValues.umaHigh}/{currentValues.umaLow}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
                  <p className="text-sm font-medium">总点数</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{totalPoints}</p>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-3">
                {(isFormComplete ? result : []).map((row) => (
                  <div
                    key={row.key}
                    className="rounded-[1.5rem] border border-border/70 bg-background/80 px-4 py-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">第 {row.rank} 位</Badge>
                          <span className="text-base font-medium">{row.label}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">终局点数 {row.points}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">最终 pt</p>
                        <p className="text-3xl font-semibold tracking-tight">{formatPt(row.totalPt)}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                        <p className="text-sm font-medium">基础 pt</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          ({row.points} - {currentValues.returnPoints}) / 1000 = {formatPt(row.basePt)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-border/70 bg-card px-4 py-3">
                        <p className="text-sm font-medium">顺位点</p>
                        <p className="mt-1 text-sm text-muted-foreground">{formatPt(row.rankBonus)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
