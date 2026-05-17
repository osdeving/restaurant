export const siteConfig = {
  name: "Restaurante",
  specialty: "Marmitex e Prato-Feito",
  phone: "(19) 98272-5050",
  whatsappHref: "https://wa.me/5519982725050",
  hours: "Segunda a sábado, 10h às 14h",
};

export const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
