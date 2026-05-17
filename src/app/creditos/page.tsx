import CreditCalculator from "@/components/CreditCalculator";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créditos de Marmitas | Restaurante",
  description: "Calculadora de créditos, retiradas e prazo de marmitas.",
};

export default function CreditsPage() {
  return <CreditCalculator />;
}
