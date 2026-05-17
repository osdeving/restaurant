import { prisma } from "@/app/utils/connect";
import { featuredProducts, menu } from "./data";
import { Prisma } from "@prisma/client";

async function seed() {
  try {
    for (const category of menu) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          title: category.title,
          desc: category.desc || "",
          img: category.img || "",
          color: category.color,
        },
        create: {
          slug: category.slug,
          title: category.title,
          desc: category.desc || "",
          img: category.img || "",
          color: category.color,
        },
      });
    }

    for (const product of featuredProducts) {
      await prisma.product.upsert({
        where: { id: product.id },
        update: {
          title: product.title,
          desc: product.desc || "",
          img: product.img || "",
          price: new Prisma.Decimal(product.price),
          options: product.options ?? [],
          isFeatured: product.isFeatured ?? true,
          catSlug: product.catSlug,
        },
        create: {
          id: product.id,
          title: product.title,
          desc: product.desc || "",
          img: product.img || "",
          price: new Prisma.Decimal(product.price),
          options: product.options ?? [],
          isFeatured: product.isFeatured ?? true,
          catSlug: product.catSlug,
        },
      });
    }

    console.log("Cardápio inserido com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir cardápio:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
