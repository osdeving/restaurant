import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/utils/connect";

const STATE_ID = "global";

type CreditConfigPayload = {
  creditAmount: string;
  mealPrice: string;
  dailyLimit: number;
  startDate: string;
  closedWeekdays: number[];
  dayAdjustments: Record<string, number>;
};

function isAuthRequired() {
  return Boolean(
    process.env.CREDIT_ADMIN_USER && process.env.CREDIT_ADMIN_PASSWORD,
  );
}

function readBasicCredentials(req: NextRequest) {
  const header = req.headers.get("authorization");
  if (!header?.startsWith("Basic ")) {
    return null;
  }

  const token = header.slice("Basic ".length);

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const separator = decoded.indexOf(":");

    if (separator < 0) {
      return null;
    }

    return {
      user: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

function isAuthorized(req: NextRequest) {
  if (!isAuthRequired()) {
    return { ok: true, user: "open" };
  }

  const credentials = readBasicCredentials(req);
  const expectedUser = process.env.CREDIT_ADMIN_USER;
  const expectedPassword = process.env.CREDIT_ADMIN_PASSWORD;

  if (
    credentials?.user === expectedUser &&
    credentials?.password === expectedPassword
  ) {
    return { ok: true, user: credentials?.user ?? "admin" };
  }

  return { ok: false, user: null };
}

function isValidPayload(payload: unknown): payload is CreditConfigPayload {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const data = payload as CreditConfigPayload;

  return (
    typeof data.creditAmount === "string" &&
    typeof data.mealPrice === "string" &&
    typeof data.dailyLimit === "number" &&
    typeof data.startDate === "string" &&
    Array.isArray(data.closedWeekdays) &&
    data.closedWeekdays.every((day) => Number.isInteger(day)) &&
    Boolean(data.dayAdjustments) &&
    typeof data.dayAdjustments === "object"
  );
}

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = await prisma.creditCalculatorState.findUnique({
      where: { id: STATE_ID },
    });

    return NextResponse.json(
      {
        requiresAuth: isAuthRequired(),
        data: state?.data ?? null,
        updatedAt: state?.updatedAt ?? null,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        requiresAuth: isAuthRequired(),
        data: null,
        updatedAt: null,
      },
      { status: 200 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const auth = isAuthorized(req);

  if (!auth.ok) {
    return NextResponse.json(
      { message: "Não autorizado" },
      {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Credit Calculator Admin"',
        },
      },
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "JSON inválido" }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ message: "Payload inválido" }, { status: 400 });
  }

  try {
    const saved = await prisma.creditCalculatorState.upsert({
      where: { id: STATE_ID },
      update: {
        data: body,
        updatedBy: auth.user,
      },
      create: {
        id: STATE_ID,
        data: body,
        updatedBy: auth.user,
      },
      select: {
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        message: "Configuração salva",
        updatedAt: saved.updatedAt,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: "Falha ao salvar" }, { status: 500 });
  }
}
