import { Inter, Manrope } from "next/font/google";
import "./style.css";
const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const metadata = {
  title: "Putkikasvu | Verkkosivut putkialalle",
  description: "Verkkosivut putkialan yrityksille. Näet omasi ennen ostopäätöstä.",
  robots: { index: false, follow: false },
  icons: { icon: "/brand/putkikasvu-symbol-v1.1.png", apple: "/brand/putkikasvu-symbol-v1.1.png" }
};
export default function Layout({ children }) {
  return <html lang="fi"><body className={manrope.variable + " " + inter.variable}>
    <a className="skip-link" href="#main-content">Siirry sisältöön</a>
    {children}
  </body></html>;
}
