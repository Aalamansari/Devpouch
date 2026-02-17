import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

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

export const metadata: Metadata = {
  title: {
    default: "DevToolKit — Developer Data Formatting & Validation Tools",
    template: "%s | DevToolKit",
  },
  description:
    "Free, fast, privacy-first browser-based developer tools. Format, validate, and convert JSON, XML, YAML, CSV, and SQL — all client-side.",
  keywords: [
    "json formatter", "xml formatter", "yaml validator", "csv to json",
    "sql formatter", "developer tools", "data formatting", "json validator",
  ],
  authors: [{ name: "DevToolKit" }],
  openGraph: {
    title: "DevToolKit — Developer Data Formatting & Validation Tools",
    description:
      "Free, fast, privacy-first browser-based developer tools for JSON, XML, YAML, CSV, and SQL.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
