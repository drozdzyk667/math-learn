import type { Metadata } from "next";
import "./globals.css";

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
