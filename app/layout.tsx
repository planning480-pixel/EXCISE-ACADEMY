import type { Metadata, Viewport } from "next";
import { Anuphan, IBM_Plex_Sans_Thai } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const head = Anuphan({
  variable: "--font-head",
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const body = IBM_Plex_Sans_Thai({
  variable: "--font-body",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Excise Academy", template: "%s · Excise Academy" },
  description:
    "แหล่งเรียนรู้กลางของกรมสรรพสามิต เรียนภาษีสรรพสามิตมาตรฐานเดียว ถูกต้อง ทันสมัย และถาม Expert ได้ทุกห้อง",
};

export const viewport: Viewport = {
  themeColor: "#06122a",
};

// ตั้งธีมก่อนหน้าเว็บแสดง เพื่อไม่ให้สีกระพริบ
const themeScript = `(function(){try{var t=localStorage.getItem('ea-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${head.variable} ${body.variable} antialiased min-h-screen flex flex-col`}>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
