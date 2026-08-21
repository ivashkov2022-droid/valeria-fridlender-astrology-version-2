import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Валерия Фридлендер — персональный разбор жизненного вопроса",
  description:
    "Индивидуальный разбор отношений, карьеры, бизнеса и жизненных решений через астрологию, нумерологию и цифровую психологию.",
  openGraph: {
    title: "Какой вопрос не даёт вам покоя?",
    description: "Персональный разбор жизненной ситуации с Валерией Фридлендер.",
    images: [{ url: "/og-question.png", width: 1740, height: 915, alt: "Какой вопрос не даёт вам покоя?" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Какой вопрос не даёт вам покоя?",
    description: "Персональный разбор жизненной ситуации с Валерией Фридлендер.",
    images: ["/og-question.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
