-- CreateTable
CREATE TABLE "CreditCalculatorState" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,
    "updatedBy" TEXT,

    CONSTRAINT "CreditCalculatorState_pkey" PRIMARY KEY ("id")
);
