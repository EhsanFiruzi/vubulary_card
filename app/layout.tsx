import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ehsanfiruzi.github.io/vubulary_card/"),

  title: {
    default:
      "Vocabulary Card Maker | Create English Vocabulary Cards",
    template: "%s | Vocabulary Card Maker",
  },

  description:
    "Create beautiful English vocabulary cards with meanings, example sentences, word types, word families, and custom colors. Share or download your vocabulary cards instantly.",

  keywords: [
    "vocabulary card maker",
    "vocabulary card creator",
    "English vocabulary cards",
    "English vocabulary card maker",
    "vocabulary flashcards",
    "English flashcards",
    "word card maker",
    "English word cards",
    "learn English vocabulary",
    "vocabulary learning tool",
    "ساخت کارت لغت",
    "کارت لغت انگلیسی",
    "ساخت فلش کارت انگلیسی",
    "یادگیری لغات انگلیسی",
  ],

  authors: [
    {
      name: "Vocabulary Card Maker",
    },
  ],

  creator: "Vocabulary Card Maker",
  publisher: "Vocabulary Card Maker",

  applicationName: "Vocabulary Card Maker",

  category: "education",

  alternates: {
    canonical: "/",
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

  openGraph: {
    type: "website",

    locale: "en_US",

    url: "/",

    siteName: "Vocabulary Card Maker",

    title:
      "Vocabulary Card Maker | Create English Vocabulary Cards",

    description:
      "Create beautiful English vocabulary cards with meanings, example sentences, word types, and custom colors. Share or download them instantly.",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt:
          "Vocabulary Card Maker - Create English Vocabulary Cards",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title:
      "Vocabulary Card Maker | Create English Vocabulary Cards",

    description:
      "Create beautiful English vocabulary cards with meanings, examples, word types, and custom colors.",

    images: ["/og-image.png"],
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
    ],

    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/manifest.webmanifest",

  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      translate="no"
    >
      <body
        className={cn(
          inter.variable,
          "font-sans"
        )}
      >
        {children}
      </body>
    </html>
  );
}