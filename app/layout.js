import "./globals.css";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import { CONFIG } from "@/lib/config";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata = {
  title: `${CONFIG.agencyName} — Digital Marketing Portfolio`,
  description: CONFIG.tagline,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${fraunces.variable}`}>
      <body className="bg-white text-ink font-sans leading-[1.6] antialiased">
        {children}
      </body>
    </html>
  );
}
