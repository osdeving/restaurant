type Product = {
  id: string;
  title: string;
  desc?: string;
  img?: string;
  price: number;
  catSlug: string;
  isFeatured?: boolean;
  options?: { title: string; additionalPrice: number }[];
};

type Products = Product[];

const marmitexOptions = [
  {
    title: "Individual",
    additionalPrice: 0,
  },
  {
    title: "Grande",
    additionalPrice: 5,
  },
  {
    title: "Família",
    additionalPrice: 16,
  },
];

export const featuredProducts: Products = [
  {
    id: "marmitex-tradicional",
    title: "Marmitex tradicional",
    desc: "Arroz, feijão, farofa, salada e carne do dia em uma marmita bem servida.",
    img: "/temporary/p4.png",
    price: 24.9,
    catSlug: "marmitex",
    isFeatured: true,
    options: marmitexOptions,
  },
  {
    id: "prato-feito-bife",
    title: "Prato-feito com bife",
    desc: "Bife acebolado, arroz branco, feijão, batata frita, salada fresca e farofa.",
    img: "/temporary/p7.png",
    price: 29.9,
    catSlug: "prato-feito",
    isFeatured: true,
    options: marmitexOptions,
  },
  {
    id: "frango-grelhado",
    title: "Frango grelhado",
    desc: "Filé de frango grelhado com arroz, feijão, legumes, salada e molho da casa.",
    img: "/temporary/p6.png",
    price: 27.9,
    catSlug: "prato-feito",
    isFeatured: true,
    options: marmitexOptions,
  },
  {
    id: "marmitex-parmegiana",
    title: "Marmitex parmegiana",
    desc: "Filé à parmegiana com arroz, feijão, purê, salada e acompanhamento do dia.",
    img: "/temporary/p10.png",
    price: 32.9,
    catSlug: "marmitex",
    isFeatured: true,
    options: marmitexOptions,
  },
  {
    id: "feijoada",
    title: "Feijoada da casa",
    desc: "Feijoada completa com arroz, couve, farofa, torresmo e laranja.",
    img: "/temporary/p8.png",
    price: 34.9,
    catSlug: "prato-feito",
    isFeatured: true,
    options: marmitexOptions,
  },
  {
    id: "salada-completa",
    title: "Salada completa",
    desc: "Folhas, legumes, tomate, proteína grelhada e molho especial para uma opção leve.",
    img: "/temporary/p11.png",
    price: 25.9,
    catSlug: "saladas",
    isFeatured: true,
    options: [
      {
        title: "Simples",
        additionalPrice: 0,
      },
      {
        title: "Com proteína",
        additionalPrice: 7,
      },
    ],
  },
];

export const productsByCategory: Record<string, Products> = {
  marmitex: featuredProducts.filter((product) => product.catSlug === "marmitex"),
  "prato-feito": featuredProducts.filter(
    (product) => product.catSlug === "prato-feito",
  ),
  saladas: featuredProducts.filter((product) => product.catSlug === "saladas"),
};

export const singleProduct: Product = featuredProducts[0];

type Menu = {
  id: string;
  slug: string;
  title: string;
  desc?: string;
  img?: string;
  color: string;
}[];

export const menu: Menu = [
  {
    id: "marmitex",
    slug: "marmitex",
    title: "Marmitex",
    desc: "Marmitas completas, bem servidas e prontas para retirar ou receber.",
    img: "/temporary/m1.png",
    color: "white",
  },
  {
    id: "prato-feito",
    slug: "prato-feito",
    title: "Prato-feito",
    desc: "Almoço de verdade com arroz, feijão, salada e proteína do dia.",
    img: "/temporary/m2.png",
    color: "black",
  },
  {
    id: "saladas",
    slug: "saladas",
    title: "Saladas",
    desc: "Opções leves para acompanhar ou pedir como refeição completa.",
    img: "/temporary/m3.png",
    color: "white",
  },
];
