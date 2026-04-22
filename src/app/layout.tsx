import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/themeProvider/theme-provider";
import AuthProvider from "@/components/AuthProvider";

/*
 * Scholarly Architect typography:
 * - Manrope: Display, headlines, all h1-h4, numbers/data
 * - Inter: Body copy, labels, functional UI text
 */
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "LearnHub — AI-Powered Online Learning Platform",
    template: "%s | LearnHub",
  },
  description:
    "LearnHub is an AI-powered LMS built by SMIT students. Browse courses in web development, Python, UI/UX & more. Watch lessons, track progress, earn certificates — for free.",

  keywords: [
    "LearnHub",
    "AI-Powered LMS",
    "Online Learning Platform",
    "SMIT Capstone Project 2026",
    "Next.js 14 LMS",
    "Learn Web Development",
    "Full-Stack Development Course",
    "Python for Data Science",
    "UI UX Design Course",
    "Free Online Courses",
    "AI Study Assistant",
    "Talal Ahmed SMIT",
    "Saylani Mass IT Training",
    "Student Learning Portal",
    "Progress Tracking LMS",
  ],

  authors: [
    { name: "Zain Khan" },
    { name: "Salman Khan" },
    { name: "Zaid Khan" },
    { name: "Faisal" },
    { name: "Abdullah" },
    { name: "Mubeen" },
  ],
  creator: "LearnHub Team — SMIT Capstone 2026",
  publisher: "LearnHub",

  alternates: {
    canonical:
      "https://github.com/zaid-khan-code/learnHub-ai-powered-online-learning-platform-lms",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/zaid-khan-code/learnHub-ai-powered-online-learning-platform-lms",
    siteName: "LearnHub",
    title: "LearnHub — AI-Powered Online Learning Platform",
    description:
      "An AI-powered LMS built with Next.js 14, Prisma & NextAuth by 6 SMIT students. Browse, enroll, watch lessons and track your progress.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LearnHub — AI-Powered Online Learning Platform",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "LearnHub — AI-Powered Online Learning Platform",
    description:
      "AI-powered LMS built with Next.js 14 by SMIT Capstone students. Enroll in courses, track progress & learn with an AI study assistant.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  applicationName: "LearnHub",
  category: "Education",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL(
    "https://github.com/zaid-khan-code/learnHub-ai-powered-online-learning-platform-lms",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        manrope.variable,
        inter.variable,
        "font-sans",
      )}
    >
      <head>
        {/* Material Symbols Outlined icon font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="min-h-full flex bg-background text-foreground flex-col max-w-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
