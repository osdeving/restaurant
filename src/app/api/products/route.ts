import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/app/utils/connect"

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
    return NextResponse.json(products, { status: 200 })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}




