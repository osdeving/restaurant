"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { formatCurrency, siteConfig } from "@/config/site";

type PersistedCreditConfig = {
  creditAmount: string;
  mealPrice: string;
  dailyLimit: number;
  startDate: string;
  closedWeekdays: number[];
  dayAdjustments: Record<string, number>;
};

type DayPlan = {
  key: string;
  date: Date;
  planned: number;
  baseline: number;
  remainingAfter: number;
  isClosed: boolean;
  isWeeklyClosed: boolean;
  isAdjusted: boolean;
  isCovered: boolean;
};

type AdjustmentEntry = {
  key: string;
  date: Date;
  baseline: number;
  planned: number;
};

type MonthPlan = {
  key: string;
  label: string;
  blanks: number[];
  days: DayPlan[];
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MAX_DAYS_TO_SIMULATE = 730;
const API_ROUTE = "/api/credit-config";

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
});

const decimalFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

function parseCurrency(value: string) {
  const clean = value.trim();
  if (!clean) return 0;

  const normalized = clean.includes(",")
    ? clean.replaceAll(".", "").replace(",", ".")
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
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getTodayKey() {
  return toKey(new Date());
}

function defaultConfig(): PersistedCreditConfig {
  return {
    creditAmount: "",
    mealPrice: "",
    dailyLimit: 2,
    startDate: getTodayKey(),
    closedWeekdays: [0],
    dayAdjustments: {},
  };
}

function toDayNumber(date: Date) {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000,
  );
}

function diffInDays(from: Date, to: Date) {
  return toDayNumber(to) - toDayNumber(from);
}

function getDisplayedEndDate(
  lastMealDate: Date | null,
  startDate: Date,
  closedWeekdays: number[],
) {
  let displayedEndDate = new Date(lastMealDate ?? startDate);

  for (let guard = 0; guard < 20; guard += 1) {
    const nextDate = addDays(displayedEndDate, 1);
    if (!closedWeekdays.includes(nextDate.getDay())) break;
    displayedEndDate = nextDate;
  }

  return displayedEndDate;
}

function buildCalendarDays(
  simulation: DayPlan[],
  calendarStart: Date,
  calendarEnd: Date,
  closedWeekdays: number[],
) {
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

    const isWeeklyClosed = closedWeekdays.includes(calendarDate.getDay());

    calendarDays.push({
      key,
      date: new Date(calendarDate),
      planned: 0,
      baseline: 0,
      remainingAfter: 0,
      isClosed: isWeeklyClosed,
      isWeeklyClosed,
      isAdjusted: false,
      isCovered: false,
    });
  }

  return calendarDays;
}

function getDailyMeals(
  remaining: number,
  perDay: number,
  isClosed: boolean,
  requested: number | undefined,
) {
  if (isClosed || remaining <= 0) {
    return { baseline: 0, planned: 0 };
  }

  const baseline = Math.min(remaining, perDay);

  if (requested === undefined) {
    return { baseline, planned: baseline };
  }

  return {
    baseline,
    planned: Math.min(remaining, Math.max(0, Math.floor(requested))),
  };
}

function simulateDays(
  totalMeals: number,
  startDate: Date,
  perDay: number,
  closedWeekdays: number[],
  dayAdjustments: Record<string, number>,
) {
  const simulation: DayPlan[] = [];
  const adjustments: AdjustmentEntry[] = [];

  let remaining = totalMeals;
  let date = startDate;
  let lastMealDate: Date | null = null;

  for (let guard = 0; guard < MAX_DAYS_TO_SIMULATE; guard += 1) {
    const key = toKey(date);
    const isWeeklyClosed = closedWeekdays.includes(date.getDay());
    const isClosed = isWeeklyClosed;
    const requested = dayAdjustments[key];
    const { baseline, planned } = getDailyMeals(
      remaining,
      perDay,
      isClosed,
      requested,
    );

    remaining -= planned;

    if (planned > 0) {
      lastMealDate = new Date(date);
    }

    const isAdjusted =
      !isClosed && requested !== undefined && planned !== baseline;

    if (isAdjusted) {
      adjustments.push({
        key,
        date: new Date(date),
        baseline,
        planned,
      });
    }

    simulation.push({
      key,
      date: new Date(date),
      planned,
      baseline,
      remainingAfter: Math.max(0, remaining),
      isClosed,
      isWeeklyClosed,
      isAdjusted,
      isCovered: remaining > 0 || planned > 0,
    });

    if (remaining <= 0 && lastMealDate) {
      break;
    }

    date = addDays(date, 1);
  }

  return {
    simulation,
    adjustments,
    lastMealDate,
    lastConsumptionDate: lastMealDate ?? startDate,
  };
}

function buildPlan(
  creditValue: number,
  mealPrice: number,
  dailyLimit: number,
  startDateKey: string,
  closedWeekdays: number[],
  dayAdjustments: Record<string, number>,
) {
  const rawMeals = mealPrice > 0 ? creditValue / mealPrice : 0;
  const totalMeals = Math.max(0, Math.ceil(rawMeals));
  const perDay = Math.max(1, dailyLimit);
  const startDate = parseDate(startDateKey);
  const { simulation, adjustments, lastMealDate, lastConsumptionDate } =
    simulateDays(totalMeals, startDate, perDay, closedWeekdays, dayAdjustments);
  const displayedEndDate = getDisplayedEndDate(
    lastMealDate,
    startDate,
    closedWeekdays,
  );

  const calendarStart = startOfMonth(startDate);
  const calendarEnd = endOfMonth(displayedEndDate);
  const calendarDays = buildCalendarDays(
    simulation,
    calendarStart,
    calendarEnd,
    closedWeekdays,
  );

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
      blanks: Array.from(
        { length: currentMonth.getDay() },
        (_, index) => index,
      ),
      days: monthDays,
    });

    currentMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1,
      12,
    );
  }

  return {
    rawMeals,
    totalMeals,
    lastConsumptionDate,
    displayedEndDate,
    adjustments,
    months,
  };
}

function plural(value: number, singular: string, pluralText: string) {
  return value === 1 ? singular : pluralText;
}

function buildSummary(
  customerPlan: ReturnType<typeof buildPlan>,
  defaultPlan: ReturnType<typeof buildPlan>,
  creditValue: number,
  mealPrice: number,
  dailyLimit: number,
  startDate: string,
  closedWeekdays: number[],
) {
  if (creditValue <= 0 || mealPrice <= 0) {
    return [
      "Preencha os campos para gerar o resumo:",
      "- Valor do crédito",
      "- Valor por refeição",
      "- Retiradas por dia",
      "- Data de início",
    ].join("\n");
  }

  const weekdaysClosedText =
    closedWeekdays.length > 0
      ? closedWeekdays.map((day) => WEEKDAYS[day]).join(", ")
      : "Nenhum";

  let lines = [
    "Boa tarde,",
    "",
    "Segue o cálculo dos créditos:",
    `- Valor do crédito: ${formatCurrency(creditValue)}`,
    `- Valor por refeição: ${formatCurrency(mealPrice)}`,
    `- Início dos créditos: ${formatLongDate(parseDate(startDate))}`,
    `- Retiradas por dia: ${dailyLimit}`,
    `- Dias sem atendimento: ${weekdaysClosedText}`,
    "",
    `${formatCurrency(creditValue)} ÷ ${formatCurrency(mealPrice)} = ${decimalFormatter.format(customerPlan.rawMeals)} refeições (arredondado):`,
    "",
    `${customerPlan.totalMeals} ${plural(customerPlan.totalMeals, "refeição", "refeições")} 😋`,
    "",
  ];

  if (customerPlan.adjustments.length > 0) {
    lines = lines.concat(["Ajustes manuais no calendário:"]);

    for (const adjustment of customerPlan.adjustments) {
      if (adjustment.planned < adjustment.baseline) {
        lines = lines.concat([
          `- O cliente retirou apenas ${adjustment.planned} ${plural(adjustment.planned, "marmita", "marmitas")} no dia ${formatShortDate(adjustment.date)} (padrão ${adjustment.baseline}).`,
        ]);
      } else {
        lines = lines.concat([
          `- O cliente retirou ${adjustment.planned} ${plural(adjustment.planned, "marmita", "marmitas")} no dia ${formatShortDate(adjustment.date)} (padrão ${adjustment.baseline}).`,
        ]);
      }
    }

    lines = lines.concat([""]);
  }

  const shiftDays = diffInDays(
    defaultPlan.displayedEndDate,
    customerPlan.displayedEndDate,
  );

  if (shiftDays > 0) {
    lines = lines.concat([
      `Com esses ajustes, o prazo foi prorrogado em ${shiftDays} ${plural(shiftDays, "dia", "dias")}.`,
    ]);
  } else if (shiftDays < 0) {
    const advancedDays = Math.abs(shiftDays);
    lines = lines.concat([
      `Com esses ajustes, o prazo foi adiantado em ${advancedDays} ${plural(advancedDays, "dia", "dias")}.`,
    ]);
  } else {
    lines = lines.concat([
      "Com esses ajustes, o prazo final permaneceu o mesmo.",
    ]);
  }

  lines = lines.concat([
    "",
    `As ${customerPlan.totalMeals} ${plural(customerPlan.totalMeals, "refeição", "refeições")} vão até: ${formatLongDate(customerPlan.displayedEndDate)}.`,
  ]);

  return lines.join("\n");
}

function getDayClass(day: DayPlan) {
  const base =
    "min-h-[5.25rem] w-full border p-2 text-left transition focus:outline-none focus:ring-2 focus:ring-red-600";

  if (day.isAdjusted) {
    return `${base} border-amber-300 bg-amber-100 text-red-700`;
  }

  if (day.isWeeklyClosed) {
    return `${base} border-neutral-200 bg-neutral-100 text-neutral-400`;
  }

  if (day.planned > 0) {
    return `${base} border-red-100 bg-white text-red-700 hover:bg-[#fff4c7]`;
  }

  return `${base} border-neutral-200 bg-white text-neutral-400`;
}

function getDayTag(day: DayPlan) {
  if (day.isClosed) return "Fechado";
  if (day.planned > 0) {
    return day.isAdjusted ? `${day.planned} ref.*` : `${day.planned} ref.`;
  }
  return "0 ref.";
}

export default function CreditCalculator() {
  const [creditAmount, setCreditAmount] = useState(
    defaultConfig().creditAmount,
  );
  const [mealPrice, setMealPrice] = useState(defaultConfig().mealPrice);
  const [dailyLimit, setDailyLimit] = useState(defaultConfig().dailyLimit);
  const [startDate, setStartDate] = useState(defaultConfig().startDate);
  const [closedWeekdays, setClosedWeekdays] = useState<number[]>(
    defaultConfig().closedWeekdays,
  );
  const [dayAdjustments, setDayAdjustments] = useState<Record<string, number>>(
    defaultConfig().dayAdjustments,
  );
  const [selectedDate, setSelectedDate] = useState(defaultConfig().startDate);
  const [requiresAuth, setRequiresAuth] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "loading" | "saving" | "saved" | "error" | "auth"
  >("loading");
  const [saveMessage, setSaveMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const saveConfig = useCallback(async () => {
    if (requiresAuth && (!adminUser || !adminPassword)) {
      setSaveStatus("auth");
      setSaveMessage("Informe usuário e senha admin para salvar.");
      return;
    }

    const payload: PersistedCreditConfig = {
      creditAmount,
      mealPrice,
      dailyLimit,
      startDate,
      closedWeekdays,
      dayAdjustments,
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (requiresAuth) {
      const authValue = `${adminUser}:${adminPassword}`;
      headers.Authorization = `Basic ${globalThis.btoa(authValue)}`;
    }

    setSaveStatus("saving");
    setSaveMessage("Salvando configuração compartilhada...");

    try {
      const response = await fetch(API_ROUTE, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        setSaveStatus("auth");
        setSaveMessage("Usuário ou senha admin inválidos.");
        return;
      }

      if (!response.ok) {
        throw new Error("Falha ao salvar");
      }

      const result = (await response.json()) as { updatedAt?: string };
      setSaveStatus("saved");
      setSaveMessage("Configuração compartilhada salva com sucesso.");
      setUpdatedAt(result.updatedAt ?? null);
    } catch {
      setSaveStatus("error");
      setSaveMessage("Não foi possível salvar. Tente novamente.");
    }
  }, [
    adminPassword,
    adminUser,
    closedWeekdays,
    creditAmount,
    dailyLimit,
    dayAdjustments,
    mealPrice,
    requiresAuth,
    startDate,
  ]);

  useEffect(() => {
    let cancelled = false;

    async function loadSharedConfig() {
      setSaveStatus("loading");
      setSaveMessage("Carregando configuração compartilhada...");

      try {
        const response = await fetch(API_ROUTE, { cache: "no-store" });
        const result = (await response.json()) as {
          requiresAuth: boolean;
          data: PersistedCreditConfig | null;
          updatedAt: string | null;
        };

        if (cancelled) return;

        setRequiresAuth(Boolean(result.requiresAuth));
        setUpdatedAt(result.updatedAt);

        if (result.data) {
          setCreditAmount(result.data.creditAmount ?? "");
          setMealPrice(result.data.mealPrice ?? "");
          setDailyLimit(Math.max(1, Number(result.data.dailyLimit) || 1));
          setStartDate(result.data.startDate ?? getTodayKey());
          setSelectedDate(result.data.startDate ?? getTodayKey());
          setClosedWeekdays(result.data.closedWeekdays ?? [0]);
          setDayAdjustments(result.data.dayAdjustments ?? {});
        }

        setSaveStatus("idle");
        setSaveMessage("");
      } catch {
        if (cancelled) return;
        setSaveStatus("error");
        setSaveMessage("Falha ao carregar configuração compartilhada.");
      }
    }

    void loadSharedConfig();

    return () => {
      cancelled = true;
    };
  }, []);

  const creditValue = parseCurrency(creditAmount);
  const unitPrice = parseCurrency(mealPrice);

  const defaultPlan = useMemo(
    () =>
      buildPlan(
        creditValue,
        unitPrice,
        dailyLimit,
        startDate,
        closedWeekdays,
        {},
      ),
    [closedWeekdays, creditValue, dailyLimit, startDate, unitPrice],
  );

  const plan = useMemo(
    () =>
      buildPlan(
        creditValue,
        unitPrice,
        dailyLimit,
        startDate,
        closedWeekdays,
        dayAdjustments,
      ),
    [
      closedWeekdays,
      creditValue,
      dailyLimit,
      dayAdjustments,
      startDate,
      unitPrice,
    ],
  );

  const summary = useMemo(
    () =>
      buildSummary(
        plan,
        defaultPlan,
        creditValue,
        unitPrice,
        dailyLimit,
        startDate,
        closedWeekdays,
      ),
    [
      closedWeekdays,
      creditValue,
      dailyLimit,
      defaultPlan,
      plan,
      startDate,
      unitPrice,
    ],
  );

  const selectedPlan = useMemo(
    () =>
      plan.months
        .flatMap((month) => month.days)
        .find((day) => day.key === selectedDate),
    [plan.months, selectedDate],
  );

  const selectedRequested = dayAdjustments[selectedDate];

  const setDayAdjustment = (
    dateKey: string,
    value: number | undefined,
    baseline: number,
    isClosed: boolean,
  ) => {
    if (isClosed) return;

    setDayAdjustments((current) => {
      const next = { ...current };

      if (value === undefined || value === baseline) {
        delete next[dateKey];
        return next;
      }

      next[dateKey] = Math.max(0, Math.floor(value));
      return next;
    });
  };

  const toggleWeekday = (weekday: number) => {
    setClosedWeekdays((current) =>
      current.includes(weekday)
        ? current.filter((item) => item !== weekday)
        : [...current, weekday].sort((a, b) => a - b),
    );
  };

  const copySummary = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    globalThis.setTimeout(() => setCopied(false), 1800);
  };

  const defaultDeadline = defaultPlan.displayedEndDate;
  const currentDeadline = plan.displayedEndDate;
  const deadlineShift = diffInDays(defaultDeadline, currentDeadline);
  let deadlineShiftText = "Prazo sem alteração.";

  if (deadlineShift > 0) {
    deadlineShiftText = `Prazo prorrogado em ${deadlineShift} ${plural(deadlineShift, "dia", "dias")}.`;
  }

  if (deadlineShift < 0) {
    const advancedDays = Math.abs(deadlineShift);
    deadlineShiftText = `Prazo adiantado em ${advancedDays} ${plural(advancedDays, "dia", "dias")}.`;
  }

  const selectedSuggestedValue =
    selectedRequested ?? selectedPlan?.baseline ?? dailyLimit;

  return (
    <main className="min-h-screen bg-[#f4c624] text-red-700">
      <section className="px-4 py-8 lg:px-12 xl:px-28">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center gap-5">
            <p className="text-sm font-black uppercase tracking-wide text-red-800">
              Créditos de marmitas
            </p>
            <h1 className="max-w-2xl text-4xl font-black uppercase leading-tight text-red-700 md:text-6xl">
              Calculadora de prazo
            </h1>
            <p className="max-w-xl text-lg font-bold text-red-900">
              Informe os valores do cliente, ajuste o calendário dia a dia e
              acompanhe o prazo recalculado automaticamente.
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
              <span>Valor do crédito</span>
              <input
                value={creditAmount}
                onChange={(event) => setCreditAmount(event.target.value)}
                className="h-12 rounded-md border border-red-100 px-3 text-lg font-black text-red-700 outline-none ring-red-600 focus:ring-2"
                inputMode="decimal"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-bold text-red-800">
              <span>Valor por refeição</span>
              <input
                value={mealPrice}
                onChange={(event) => setMealPrice(event.target.value)}
                className="h-12 rounded-md border border-red-100 px-3 text-lg font-black text-red-700 outline-none ring-red-600 focus:ring-2"
                inputMode="decimal"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-bold text-red-800">
              <span>Retiradas por dia</span>
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
              <span>Início dos créditos</span>
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
          <p className="text-sm font-bold text-red-700">
            refeições antes do arred.
          </p>
        </div>
        <div className="rounded-md bg-white p-4 shadow-md">
          <p className="text-sm font-bold text-red-800">Retiradas por dia</p>
          <strong className="text-3xl text-red-700">{dailyLimit}</strong>
          <p className="text-sm font-bold text-red-700">
            {plural(dailyLimit, "refeição", "refeições")}
          </p>
        </div>
        <div className="rounded-md bg-red-700 p-4 text-white shadow-md">
          <p className="text-sm font-bold text-[#f4c624]">Prazo</p>
          <strong className="text-3xl">
            {formatLongDate(currentDeadline)}
          </strong>
          <p className="text-sm font-bold">data final calculada</p>
        </div>
      </section>

      <section className="px-4 pb-8 lg:px-12 xl:px-28">
        <div className="rounded-md bg-white p-4 shadow-md">
          <p className="text-sm font-bold text-red-800">Comparativo de prazo</p>
          <p className="mt-1 text-sm font-bold text-red-700">
            Padrão: {formatLongDate(defaultDeadline)}
          </p>
          <p className="text-sm font-bold text-red-700">
            Ajustado: {formatLongDate(currentDeadline)}
          </p>
          <p className="mt-1 text-sm font-black text-red-900">
            {deadlineShiftText}
          </p>
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
                Distribuição automática de {dailyLimit} por dia útil. Dias com *
                foram ajustados manualmente.
              </p>
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {plan.months.map((month) => (
              <div
                key={month.key}
                className="rounded-md border border-red-100 p-3"
              >
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
                      className={`${getDayClass(day)} ${selectedDate === day.key ? "ring-2 ring-red-600" : ""}`}
                    >
                      <span className="block text-sm font-black">
                        {day.date.getDate()}
                      </span>
                      <span className="mt-3 block text-[11px] font-black uppercase leading-tight">
                        {getDayTag(day)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-md bg-[#fff4c7] p-4">
            <h2 className="text-lg font-black uppercase text-red-700">
              Ajuste do Dia
            </h2>
            <p className="mt-1 text-sm font-bold text-red-800">
              {formatLongDate(parseDate(selectedDate))}
            </p>

            {selectedPlan === undefined && (
              <p className="mt-3 text-sm font-bold text-red-700">
                Selecione um dia no calendário.
              </p>
            )}

            {selectedPlan?.isClosed && (
              <p className="mt-3 text-sm font-bold text-red-700">
                Dia fechado. Não é possível ajustar retiradas.
              </p>
            )}

            {selectedPlan && !selectedPlan.isClosed && (
              <div className="mt-3 space-y-3">
                <p className="text-sm font-bold text-red-800">
                  Padrão do dia: {selectedPlan.baseline}{" "}
                  {plural(selectedPlan.baseline, "retirada", "retiradas")}
                </p>
                <label className="flex flex-col gap-2 text-sm font-bold text-red-800">
                  <span>Retiradas nesse dia</span>
                  <input
                    type="number"
                    min={0}
                    max={99}
                    value={selectedSuggestedValue}
                    onChange={(event) =>
                      setDayAdjustment(
                        selectedDate,
                        Number(event.target.value),
                        selectedPlan.baseline,
                        selectedPlan.isClosed,
                      )
                    }
                    className="h-11 rounded-md border border-red-100 px-3 text-lg font-black text-red-700 outline-none ring-red-600 focus:ring-2"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setDayAdjustment(
                        selectedDate,
                        undefined,
                        selectedPlan.baseline,
                        selectedPlan.isClosed,
                      )
                    }
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-black text-white"
                  >
                    Auto
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDayAdjustment(
                        selectedDate,
                        0,
                        selectedPlan.baseline,
                        selectedPlan.isClosed,
                      )
                    }
                    className="rounded-md bg-white px-3 py-2 text-sm font-black text-red-700"
                  >
                    0 retirada
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDayAdjustment(
                        selectedDate,
                        1,
                        selectedPlan.baseline,
                        selectedPlan.isClosed,
                      )
                    }
                    className="rounded-md bg-white px-3 py-2 text-sm font-black text-red-700"
                  >
                    1 retirada
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setDayAdjustment(
                        selectedDate,
                        dailyLimit + 1,
                        selectedPlan.baseline,
                        selectedPlan.isClosed,
                      )
                    }
                    className="rounded-md bg-white px-3 py-2 text-sm font-black text-red-700"
                  >
                    {dailyLimit + 1} retiradas
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-md bg-white p-4 shadow-md">
            <h2 className="text-lg font-black uppercase text-red-700">
              Configuração Compartilhada
            </h2>
            <p className="mt-1 text-sm font-bold text-red-800">
              Os dados ficam salvos no banco e aparecem para todos os acessos na
              Vercel.
            </p>

            {requiresAuth && (
              <div className="mt-3 grid gap-2">
                <input
                  value={adminUser}
                  onChange={(event) => setAdminUser(event.target.value)}
                  placeholder="Usuário admin"
                  className="h-10 rounded-md border border-red-100 px-3 text-sm font-bold text-red-700 outline-none ring-red-600 focus:ring-2"
                />
                <input
                  value={adminPassword}
                  onChange={(event) => setAdminPassword(event.target.value)}
                  placeholder="Senha admin"
                  type="password"
                  className="h-10 rounded-md border border-red-100 px-3 text-sm font-bold text-red-700 outline-none ring-red-600 focus:ring-2"
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => void saveConfig()}
              className="mt-3 w-full rounded-full bg-red-600 px-4 py-3 text-sm font-black text-white"
            >
              {saveStatus === "saving"
                ? "Salvando..."
                : "Salvar dados compartilhados"}
            </button>

            <p className="mt-2 text-xs font-bold text-red-700">{saveMessage}</p>
            {updatedAt && (
              <p className="mt-1 text-xs font-bold text-red-700">
                Última atualização:{" "}
                {new Date(updatedAt).toLocaleString("pt-BR")}
              </p>
            )}
          </div>

          <div className="rounded-md bg-red-600 p-4 text-white">
            <h2 className="text-xl font-black uppercase">
              Texto para WhatsApp
            </h2>
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
