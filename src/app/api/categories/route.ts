import { NextResponse } from "next/server"
import { prisma } from "@/app/utils/connect"

// FETCH ALL CATEGORIES
export const GET = async () => {
  try {
    const categories = await prisma.category.findMany()
    return NextResponse.json(categories, { status: 200 })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}



