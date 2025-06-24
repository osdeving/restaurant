import { prisma } from "@/app/utils/connect";
import { featuredProducts } from "./data";
import { Prisma } from "./generated/prisma";


async function seedProducts() {
  try {
    for (const product of featuredProducts) {
      await prisma.product.create({
        data: {
          title: product.title,
          desc: product.desc || "",
          img: product.img || "",
          price: new Prisma.Decimal(product.price),
          options: product.options ?? [],
          isFeatured: true,
          catSlug: 
        },
      });
    }

    console.log("Produtos inseridos com sucesso!");
  } catch (error) {
    console.error("Erro ao inserir produtos:", error);
  }
}

seedProducts();
