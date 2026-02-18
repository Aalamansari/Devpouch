import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://www.devpouch.space";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Devpouch — Free Online JSON, XML, YAML, CSV & SQL Formatter",
    template: "%s | Devpouch",
  },
  description:
    "Free online developer tools to format, validate, and convert JSON, XML, YAML, CSV, and SQL instantly. 100% client-side — your data never leaves the browser. No sign-up required.",
  keywords: [
    "json formatter", "json formatter online", "json validator", "json beautifier", "json minifier",
    "xml formatter", "xml formatter online", "xml validator", "xml to json",
    "yaml validator", "yaml to json", "json to yaml",
    "csv to json", "json to csv", "csv converter",
    "sql formatter", "sql beautifier", "sql formatter online",
    "developer tools", "online developer tools", "data formatting tools",
    "free developer tools", "browser-based tools", "client-side tools",
    "devpouch", "privacy-first developer tools",
  ],
  authors: [{ name: "Devpouch", url: SITE_URL }],
  creator: "Devpouch",
  publisher: "Devpouch",
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
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Devpouch",
    title: "Devpouch — Free Online JSON, XML, YAML, CSV & SQL Formatter",
    description:
      "Free online developer tools to format, validate, and convert JSON, XML, YAML, CSV, and SQL. 100% client-side, no data transmission.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Devpouch — Free Online Developer Formatting Tools",
    description:
      "Format, validate, and convert JSON, XML, YAML, CSV, and SQL instantly in your browser. Free, fast, and private.",
  },
  category: "Developer Tools",
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Devpouch",
  url: SITE_URL,
  description:
    "Free online developer tools to format, validate, and convert JSON, XML, YAML, CSV, and SQL. 100% client-side processing.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires a modern web browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "JSON Formatter & Validator",
    "XML Formatter & Validator",
    "YAML Validator & Converter",
    "CSV to JSON Converter",
    "SQL Formatter & Beautifier",
    "100% Client-Side Processing",
    "Dark Mode Support",
    "No Sign-Up Required",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd data={siteJsonLd} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6847588376023576"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
