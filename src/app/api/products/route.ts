import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/utils/connect"
import { featuredProducts, productsByCategory } from "@/data"

// FETCH ALL PRODUCTS
export const GET = async (req : NextRequest) => {
  const { searchParams } = req.nextUrl
  const cat = searchParams.get("cat")

  try {
    const products = await prisma.product.findMany({
      where: {
        ...(cat ? { catSlug: cat }  : {isFeatured: true}),
      },
    })
    const fallbackProducts = cat ? productsByCategory[cat] ?? [] : featuredProducts
    return NextResponse.json(products.length ? products : fallbackProducts, { status: 200 })
  } catch {
    return NextResponse.json(cat ? productsByCategory[cat] ?? [] : featuredProducts, { status: 200 })
  }
}


