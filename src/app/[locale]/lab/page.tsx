import { MathApp } from "@/components/math-app";
import type { Language } from "@/lib/i18n";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Language }>;
}) {
  const { locale } = await params;
  return <MathApp initialView="lab" routeLang={locale} />;
}
