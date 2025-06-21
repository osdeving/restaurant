import Image from "next/image";
import MenuPage from "./menu/page";

export default function Home() {
  return (
  <main >
    Hello world!
    <Image
      src="/cart.png"
      alt="Cart Icon"
      width={50}
      height={50}
    />
    <MenuPage />
  </main>
  );
}
