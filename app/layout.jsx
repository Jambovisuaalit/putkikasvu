import { Inter, Manrope } from "next/font/google";
import "./style.css";
import SkipLink from "./components/SkipLink";
const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const metadata = {
  title: "PutkiKasvu — Verkkosivut LVI-yrityksille 590 €",
  description: "Verkkosivut putkialan yrityksille. Näet omasi ennen ostopäätöstä.",
  robots: { index: true, follow: true },
  icons: { icon: "/brand/putkikasvu-symbol-v1.1.png", apple: "/brand/putkikasvu-symbol-v1.1.png" }
};
export default function Layout({ children }) {
  return <html lang="fi"><body className={manrope.variable + " " + inter.variable}>
    <SkipLink />
    {children}
  </body></html>;
}
