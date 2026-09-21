import { notFound } from "next/navigation";
import { curriculum } from "@/content/curriculum";
import { LessonExperience } from "@/components/lesson-experience";
import type { Language } from "@/lib/i18n";

export function generateStaticParams() {
  return curriculum.flatMap((unit) =>
    unit.lessons.map((lesson) => ({ lessonId: lesson.id })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Language; lessonId: string }>;
}) {
  const { locale, lessonId } = await params;
  const lesson = curriculum
    .flatMap((unit) => unit.lessons)
    .find((item) => item.id === lessonId);

  return {
    title: lesson
      ? `${lesson.title[locale]} — Mathly`
      : "Mathly",
    robots: { index: false },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Language; lessonId: string }>;
}) {
  const { locale, lessonId } = await params;
  const exists = curriculum.some((unit) =>
    unit.lessons.some((lesson) => lesson.id === lessonId),
  );
  if (!exists) notFound();

  return <LessonExperience lessonId={lessonId} lang={locale} />;
}
