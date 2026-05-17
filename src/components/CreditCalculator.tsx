"use client";

import React, { useEffect, useMemo, useState } from "react";
import { formatCurrency, siteConfig } from "@/config/site";

type Override =
  | { mode: "used"; amount: number }
  | { mode: "closed" };

type DayPlan = {
  key: string;
  date: Date;
  planned: number;
  remainingAfter: number;
  isClosed: boolean;
  isWeeklyClosed: boolean;
  isCustomClosed: boolean;
  isManual: boolean;
  isCovered: boolean;
};

type MonthPlan = {
  key: string;
  label: string;
  blanks: number[];
  days: DayPlan[];
};

const STORAGE_KEY = "marmitex-credit-calculator-v1";
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const SAMPLE_START_DATE = "2025-04-17";

const sampleOverrides: Record<string, Override> = {
  "2025-04-17": { mode: "used", amount: 1 },
  "2025-04-18": { mode: "used", amount: 1 },
};

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
});

const shortDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
});

const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const listFormatter = new Intl.ListFormat("pt-BR", {
  style: "long",
  type: "conjunction",
});

function parseCurrency(value: string) {
  const clean = value.trim();
  if (!clean) return 0;

  const normalized = clean.includes(",")
    ? clean.replace(/\./g, "").replace(",", ".")
    : clean;

  return Number(normalized.replace(/[^\d.-]/g, "")) || 0;
}

function toKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 12);
}

function formatLongDate(date: Date) {
  return longDateFormatter.format(date);
}

function formatShortDate(date: Date) {
  return shortDateFormatter.format(date);
}

function isClosedDate(
  date: Date,
  closedWeekdays: number[],
  overrides: Record<string, Override>,
) {
  const override = overrides[toKey(date)];
  return closedWeekdays.includes(date.getDay()) || override?.mode === "closed";
}

function buildPlan(
  creditValue: number,
  mealPrice: number,
  dailyLimit: number,
  startDateKey: string,
  closedWeekdays: number[],
  overrides: Record<string, Override>,
) {
  const rawMeals = mealPrice > 0 ? creditValue / mealPrice : 0;
  const totalMeals = Math.max(0, Math.ceil(rawMeals));
  const perDay = Math.max(1, dailyLimit);
  const startDate = parseDate(startDateKey);
  const simulation: DayPlan[] = [];

  let remaining = totalMeals;
  let date = startDate;
  let lastMealDate: Date | null = null;

  for (let guard = 0; guard < 730; guard += 1) {
    const key = toKey(date);
    const override = overrides[key];
    const isWeeklyClosed = closedWeekdays.includes(date.getDay());
    const isCustomClosed = override?.mode === "closed";
    const isClosed = isWeeklyClosed || isCustomClosed;
    const isManual = override?.mode === "used";
    let planned = 0;

    if (!isClosed && remaining > 0) {
      planned = isManual
        ? Math.min(remaining, Math.max(0, Math.min(perDay, override.amount)))
        : Math.min(remaining, perDay);
      remaining -= planned;
      if (planned > 0) {
        lastMealDate = new Date(date);
      }
    }

    simulation.push({
      key,
      date: new Date(date),
      planned,
      remainingAfter: Math.max(0, remaining),
      isClosed,
      isWeeklyClosed,
      isCustomClosed,
      isManual,
      isCovered: remaining > 0 || planned > 0,
    });

    if (remaining <= 0 && lastMealDate) break;
    date = addDays(date, 1);
  }

  const lastConsumptionDate = lastMealDate ?? startDate;
  let displayedEndDate = new Date(lastConsumptionDate);

  for (let guard = 0; guard < 20; guard += 1) {
    const nextDate = addDays(displayedEndDate, 1);
    if (!isClosedDate(nextDate, closedWeekdays, overrides)) break;
    displayedEndDate = nextDate;
  }

  const calendarStart = startOfMonth(startDate);
  const calendarEnd = endOfMonth(displayedEndDate);
  const simulationByKey = new Map(simulation.map((day) => [day.key, day]));
  const calendarDays: DayPlan[] = [];

  for (
    let calendarDate = calendarStart;
    calendarDate <= calendarEnd;
    calendarDate = addDays(calendarDate, 1)
  ) {
    const key = toKey(calendarDate);
    const plannedDay = simulationByKey.get(key);

    if (plannedDay) {
      calendarDays.push(plannedDay);
      continue;
    }

    const override = overrides[key];
    const isWeeklyClosed = closedWeekdays.includes(calendarDate.getDay());
    const isCustomClosed = override?.mode === "closed";

    calendarDays.push({
      key,
      date: new Date(calendarDate),
      planned: 0,
      remainingAfter: 0,
      isClosed: isWeeklyClosed || isCustomClosed,
      isWeeklyClosed,
      isCustomClosed,
      isManual: override?.mode === "used",
      isCovered: false,
    });
  }

  const months: MonthPlan[] = [];
  let currentMonth = startOfMonth(calendarStart);

  while (currentMonth <= calendarEnd) {
    const monthKey = `${currentMonth.getFullYear()}-${currentMonth.getMonth()}`;
    const monthDays = calendarDays.filter(
      (day) =>
        day.date.getFullYear() === currentMonth.getFullYear() &&
        day.date.getMonth() === currentMonth.getMonth(),
    );

    months.push({
      key: monthKey,
      label: monthFormatter.format(currentMonth),
      blanks: Array.from({ length: currentMonth.getDay() }, (_, index) => index),
      days: monthDays,
    });

    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1,
      12,
    );
  }

  const manualEntries = Object.entries(overrides)
    .filter(([, override]) => override.mode === "used" && override.amount > 0)
    .sort(([a], [b]) => a.localeCompare(b));

  const manualTotal = manualEntries.reduce(
    (sum, [, override]) =>
      override.mode === "used" ? sum + override.amount : sum,
    0,
  );

  const customClosures = Object.entries(overrides)
    .filter(([, override]) => override.mode === "closed")
    .map(([key]) => key)
    .sort((a, b) => a.localeCompare(b));

  return {
    rawMeals,
    totalMeals,
    remainingAfterManual: Math.max(0, totalMeals - manualTotal),
    manualEntries,
    manualTotal,
    customClosures,
    lastConsumptionDate,
    displayedEndDate,
    months,
  };
}

function plural(value: number, singular: string, pluralText: string) {
  return value === 1 ? singular : pluralText;
}

function buildSummary(
  creditValue: number,
  mealPrice: number,
  plan: ReturnType<typeof buildPlan>,
) {
  const lines = [
    "Boa tarde,",
    "",
    `${formatCurrency(creditValue)} ÷ ${formatCurrency(mealPrice)} = ${decimalFormatter.format(plan.rawMeals)} refeições arredondado ficam:`,
    "",
    `${plan.totalMeals} ${plural(plan.totalMeals, "refeição", "refeições")} 😋`,
    "",
  ];

  if (plan.manualTotal > 0) {
    const dates = listFormatter.format(
      plan.manualEntries.map(([key]) => formatShortDate(parseDate(key))),
    );
    const dayLabel = plan.manualEntries.length === 1 ? "O dia" : "Os dias";
    const verb = plan.manualEntries.length === 1 ? "soma" : "somam";

    lines.push(
      `${dayLabel} ${dates} ${verb} ${plan.manualTotal} ${plural(plan.manualTotal, "retirada", "retiradas")}.`,
      "",
    );
  }

  const remainingText =
    plan.manualTotal > 0
      ? `As ${plan.remainingAfterManual} restantes`
      : `As ${plan.totalMeals} ${plural(plan.totalMeals, "refeição", "refeições")}`;

  lines.push(`${remainingText} vão até: ${formatLongDate(plan.displayedEndDate)}.`);

  if (plan.customClosures.length > 0) {
    const closures = listFormatter.format(
      plan.customClosures.map((key) => formatShortDate(parseDate(key))),
    );
    lines.push(
      "",
      `Obs: com ${closures} sem atendimento, vai até ${formatLongDate(plan.displayedEndDate)}.`,
    );
  }

  return lines.join("\n");
}

function getDayClass(day: DayPlan, isSelected: boolean) {
  const base =
    "min-h-[5.25rem] w-full border p-2 text-left transition focus:outline-none focus:ring-2 focus:ring-red-600";

  if (isSelected) {
    return `${base} border-red-700 bg-red-600 text-white shadow-md`;
  }

  if (day.isCustomClosed) {
    return `${base} border-neutral-300 bg-neutral-900 text-white`;
  }

  if (day.isWeeklyClosed) {
    return `${base} border-neutral-200 bg-neutral-100 text-neutral-400`;
  }

  if (day.isManual) {
    return `${base} border-amber-300 bg-amber-100 text-red-700`;
  }

  if (day.planned > 0) {
    return `${base} border-red-100 bg-white text-red-700 hover:bg-[#fff4c7]`;
  }

  return `${base} border-neutral-200 bg-white text-neutral-400`;
}

export default function CreditCalculator() {
  const [creditAmount, setCreditAmount] = useState("792,11");
  const [mealPrice, setMealPrice] = useState("20,00");
  const [dailyLimit, setDailyLimit] = useState(2);
  const [startDate, setStartDate] = useState(SAMPLE_START_DATE);
  const [closedWeekdays, setClosedWeekdays] = useState<number[]>([0]);
  const [overrides, setOverrides] =
    useState<Record<string, Override>>(sampleOverrides);
  const [selectedDate, setSelectedDate] = useState("2025-05-01");
  const [copied, setCopied] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored) as {
          creditAmount?: string;
          mealPrice?: string;
          dailyLimit?: number;
          startDate?: string;
          closedWeekdays?: number[];
          overrides?: Record<string, Override>;
          selectedDate?: string;
        };

        setCreditAmount(parsed.creditAmount ?? "792,11");
        setMealPrice(parsed.mealPrice ?? "20,00");
        setDailyLimit(parsed.dailyLimit ?? 2);
        setStartDate(parsed.startDate ?? SAMPLE_START_DATE);
        setClosedWeekdays(parsed.closedWeekdays ?? [0]);
        setOverrides(parsed.overrides ?? sampleOverrides);
        setSelectedDate(parsed.selectedDate ?? "2025-05-01");
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        creditAmount,
        mealPrice,
        dailyLimit,
        startDate,
        closedWeekdays,
        overrides,
        selectedDate,
      }),
    );
  }, [
    closedWeekdays,
    creditAmount,
    dailyLimit,
    loaded,
    mealPrice,
    overrides,
    selectedDate,
    startDate,
  ]);

  const creditValue = parseCurrency(creditAmount);
  const unitPrice = parseCurrency(mealPrice);

  const plan = useMemo(
    () =>
      buildPlan(
        creditValue,
        unitPrice,
        dailyLimit,
        startDate,
        closedWeekdays,
        overrides,
      ),
    [closedWeekdays, creditValue, dailyLimit, overrides, startDate, unitPrice],
  );

  const summary = useMemo(
    () => buildSummary(creditValue, unitPrice, plan),
    [creditValue, plan, unitPrice],
  );

  const selectedOverride = overrides[selectedDate];
  const selectedPlan = plan.months
    .flatMap((month) => month.days)
    .find((day) => day.key === selectedDate);

  const setDayOverride = (override?: Override) => {
    setOverrides((current) => {
      const next = { ...current };

      if (!override) {
        delete next[selectedDate];
        return next;
      }

      next[selectedDate] = override;
      return next;
    });
  };

  const toggleWeekday = (weekday: number) => {
    setClosedWeekdays((current) =>
      current.includes(weekday)
        ? current.filter((item) => item !== weekday)
        : [...current, weekday].sort(),
    );
  };

  const resetExample = () => {
    setCreditAmount("792,11");
    setMealPrice("20,00");
    setDailyLimit(2);
    setStartDate(SAMPLE_START_DATE);
    setClosedWeekdays([0]);
    setOverrides(sampleOverrides);
    setSelectedDate("2025-05-01");
  };

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen bg-[#f4c624] text-red-700">
      <section className="px-4 py-8 lg:px-12 xl:px-28">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center gap-5">
            <p className="text-sm font-black uppercase tracking-wide text-red-800">
              Créditos de marmitas
            </p>
            <h1 className="max-w-2xl text-4xl font-black uppercase leading-tight text-red-700 md:text-6xl">
              Calculadora de prazo e retiradas
            </h1>
            <p className="max-w-xl text-lg font-bold text-red-900">
              Informe o crédito, ajuste o calendário e gere o resumo pronto para
              enviar no WhatsApp.
            </p>
            <a
              href={siteConfig.whatsappHref}
              className="w-fit rounded-full bg-red-600 px-5 py-3 font-black text-white shadow-md"
            >
              WhatsApp {siteConfig.phone}
            </a>
          </div>

          <div className="grid gap-3 rounded-md bg-white p-4 shadow-xl md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-bold text-red-800">
              Valor do crédito
              <input
                value={creditAmount}
                onChange={(event) => setCreditAmount(event.target.value)}
                className="h-12 rounded-md border border-red-100 px-3 text-lg font-black text-red-700 outline-none ring-red-600 focus:ring-2"
                inputMode="decimal"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-bold text-red-800">
              Valor por refeição
              <input
                value={mealPrice}
                onChange={(event) => setMealPrice(event.target.value)}
                className="h-12 rounded-md border border-red-100 px-3 text-lg font-black text-red-700 outline-none ring-red-600 focus:ring-2"
                inputMode="decimal"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-bold text-red-800">
              Retiradas por dia
              <input
                value={dailyLimit}
                min={1}
                max={9}
                onChange={(event) =>
                  setDailyLimit(Math.max(1, Number(event.target.value) || 1))
                }
                className="h-12 rounded-md border border-red-100 px-3 text-lg font-black text-red-700 outline-none ring-red-600 focus:ring-2"
                type="number"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-bold text-red-800">
              Início dos créditos
              <input
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setSelectedDate(event.target.value);
                }}
                className="h-12 rounded-md border border-red-100 px-3 text-lg font-black text-red-700 outline-none ring-red-600 focus:ring-2"
                type="date"
              />
            </label>

            <div className="md:col-span-2">
              <p className="mb-2 text-sm font-bold text-red-800">
                Dias sem atendimento
              </p>
              <div className="grid grid-cols-7 gap-2">
                {WEEKDAYS.map((weekday, index) => {
                  const isClosed = closedWeekdays.includes(index);

                  return (
                    <button
                      key={weekday}
                      type="button"
                      onClick={() => toggleWeekday(index)}
                      className={`h-10 rounded-md border text-xs font-black ${
                        isClosed
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-red-100 bg-[#fff4c7] text-red-700"
                      }`}
                    >
                      {weekday}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 px-4 pb-8 lg:grid-cols-4 lg:px-12 xl:px-28">
        <div className="rounded-md bg-red-600 p-4 text-white shadow-md">
          <p className="text-sm font-bold text-[#f4c624]">Total</p>
          <strong className="text-3xl">{plan.totalMeals}</strong>
          <p className="text-sm font-bold">refeições arredondadas</p>
        </div>
        <div className="rounded-md bg-white p-4 shadow-md">
          <p className="text-sm font-bold text-red-800">Cálculo</p>
          <strong className="text-3xl text-red-700">
            {decimalFormatter.format(plan.rawMeals)}
          </strong>
          <p className="text-sm font-bold text-red-700">refeições antes do arred.</p>
        </div>
        <div className="rounded-md bg-white p-4 shadow-md">
          <p className="text-sm font-bold text-red-800">Já marcado</p>
          <strong className="text-3xl text-red-700">{plan.manualTotal}</strong>
          <p className="text-sm font-bold text-red-700">
            {plural(plan.manualTotal, "retirada", "retiradas")}
          </p>
        </div>
        <div className="rounded-md bg-red-700 p-4 text-white shadow-md">
          <p className="text-sm font-bold text-[#f4c624]">Prazo</p>
          <strong className="text-3xl">
            {formatLongDate(plan.displayedEndDate)}
          </strong>
          <p className="text-sm font-bold">data final calculada</p>
        </div>
      </section>

      <section className="grid gap-6 bg-white px-4 py-8 lg:grid-cols-[1.35fr_0.65fr] lg:px-12 xl:px-28">
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black uppercase text-red-700">
                Calendário
              </h2>
              <p className="text-sm font-bold text-red-800">
                Auto = {dailyLimit} por dia. Dias marcados reajustam o prazo.
              </p>
            </div>
            <button
              type="button"
              onClick={resetExample}
              className="rounded-full bg-[#f4c624] px-4 py-2 text-sm font-black text-red-700"
            >
              Recarregar exemplo
            </button>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {plan.months.map((month) => (
              <div key={month.key} className="rounded-md border border-red-100 p-3">
                <h3 className="mb-3 text-lg font-black text-red-700">
                  {month.label}
                </h3>
                <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-black text-red-800">
                  {WEEKDAYS.map((weekday) => (
                    <span key={weekday}>{weekday}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {month.blanks.map((blank) => (
                    <div key={blank} />
                  ))}
                  {month.days.map((day) => (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => setSelectedDate(day.key)}
                      className={getDayClass(day, selectedDate === day.key)}
                    >
                      <span className="block text-sm font-black">
                        {day.date.getDate()}
                      </span>
                      <span className="mt-3 block text-[11px] font-black uppercase leading-tight">
                        {day.isClosed
                          ? "Fechado"
                          : day.planned > 0
                            ? `${day.planned} ref.`
                            : "0 ref."}
                      </span>
                      {day.isManual && (
                        <span className="mt-1 block text-[10px] font-black uppercase">
                          Manual
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-md bg-[#fff4c7] p-4">
            <p className="text-sm font-bold text-red-800">Dia selecionado</p>
            <strong className="mt-1 block text-2xl font-black capitalize text-red-700">
              {formatLongDate(parseDate(selectedDate))}
            </strong>
            <p className="mt-1 text-sm font-bold text-red-800">
              {selectedPlan?.isClosed
                ? "Sem atendimento"
                : `${selectedPlan?.planned ?? 0} ${plural(selectedPlan?.planned ?? 0, "retirada", "retiradas")}`}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDayOverride()}
                className={`rounded-md px-3 py-2 text-sm font-black ${
                  !selectedOverride
                    ? "bg-red-600 text-white"
                    : "bg-white text-red-700"
                }`}
              >
                Auto
              </button>
              <button
                type="button"
                onClick={() => setDayOverride({ mode: "used", amount: 0 })}
                className={`rounded-md px-3 py-2 text-sm font-black ${
                  selectedOverride?.mode === "used" && selectedOverride.amount === 0
                    ? "bg-red-600 text-white"
                    : "bg-white text-red-700"
                }`}
              >
                0 retirada
              </button>
              <button
                type="button"
                onClick={() => setDayOverride({ mode: "used", amount: 1 })}
                className={`rounded-md px-3 py-2 text-sm font-black ${
                  selectedOverride?.mode === "used" && selectedOverride.amount === 1
                    ? "bg-red-600 text-white"
                    : "bg-white text-red-700"
                }`}
              >
                1 retirada
              </button>
              <button
                type="button"
                onClick={() => setDayOverride({ mode: "used", amount: dailyLimit })}
                className={`rounded-md px-3 py-2 text-sm font-black ${
                  selectedOverride?.mode === "used" &&
                  selectedOverride.amount === dailyLimit
                    ? "bg-red-600 text-white"
                    : "bg-white text-red-700"
                }`}
              >
                {dailyLimit} retiradas
              </button>
              <button
                type="button"
                onClick={() => setDayOverride({ mode: "closed" })}
                className={`col-span-2 rounded-md px-3 py-2 text-sm font-black ${
                  selectedOverride?.mode === "closed"
                    ? "bg-neutral-950 text-white"
                    : "bg-white text-red-700"
                }`}
              >
                Restaurante fechado
              </button>
            </div>
          </div>

          <div className="rounded-md bg-red-600 p-4 text-white">
            <h2 className="text-xl font-black uppercase">Texto para WhatsApp</h2>
            <textarea
              value={summary}
              readOnly
              className="mt-3 min-h-[22rem] w-full resize-none rounded-md border border-red-400 bg-white p-3 text-sm font-semibold leading-relaxed text-neutral-950 outline-none"
            />
            <button
              type="button"
              onClick={copySummary}
              className="mt-3 w-full rounded-full bg-[#f4c624] px-4 py-3 font-black text-red-700"
            >
              {copied ? "Texto copiado" : "Copiar resumo"}
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
