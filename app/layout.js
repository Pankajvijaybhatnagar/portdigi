import "./globals.css";
import { Plus_Jakarta_Sans } from "next/font/google";
import { CONFIG } from "@/lib/config";
import WhatsAppButton from "@/components/WhatsAppButton";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata = {
  title: `${CONFIG.agencyName} — Digital Marketing Portfolio`,
  description: CONFIG.tagline,
  openGraph: {
    title: `${CONFIG.agencyName} — Digital Marketing Portfolio`,
    description: CONFIG.tagline,
    siteName: CONFIG.agencyName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${CONFIG.agencyName} — Digital Marketing Portfolio`,
    description: CONFIG.tagline,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="bg-white text-ink font-sans leading-[1.6] antialiased">
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
