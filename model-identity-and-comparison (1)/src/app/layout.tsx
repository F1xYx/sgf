import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Пары — расписание занятий",
  description: "Мобильное расписание пар: чётность недели, звонки, live-индикатор текущей пары.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e9edf6" },
    { media: "(prefers-color-scheme: dark)", color: "#070b14" },
  ],
};

const themeSnippet = `try{var t=localStorage.getItem("bpi_theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark"){document.documentElement.classList.add("dark")}}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className="bg-ink font-sans text-snow antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeSnippet }} />
        {children}
      </body>
    </html>
  );
}
