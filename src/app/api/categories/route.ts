import { NextResponse } from "next/server"
import { prisma } from "@/app/utils/connect"
import { menu } from "@/data"

// FETCH ALL CATEGORIES
export const GET = async () => {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories.length ? categories : menu, { status: 200 })
  } catch {
    return NextResponse.json(menu, { status: 200 })
  }
}

