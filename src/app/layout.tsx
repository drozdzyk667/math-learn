import type { Metadata } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import "./polish.css";
import "./audit.css";

export const metadata: Metadata = {
  title: "Mathly — nauka matematyki",
  description: "Interaktywna nauka matematyki licealnej: teoria, fiszki, zadania, klasówki i próbna matura.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
