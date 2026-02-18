import type { Metadata } from "next";

const SITE_URL = "https://www.devpouch.space";

export const metadata: Metadata = {
    title: "CSV to JSON Converter Online — Free CSV ↔ JSON Tool",
    description:
        "Convert CSV to JSON and JSON to CSV online for free. Supports custom delimiters (comma, semicolon, tab, pipe) and header options. 100% client-side — your data stays private.",
    keywords: [
        "csv to json", "csv to json converter", "json to csv", "csv converter online",
        "csv to json online", "json to csv online", "convert csv to json",
        "csv parser", "csv json tool", "free csv converter",
        "csv to json free", "online csv tool", "csv delimiter",
    ],
    alternates: {
        canonical: `${SITE_URL}/csv-json-converter`,
    },
    openGraph: {
        title: "CSV to JSON Converter Online — Free CSV ↔ JSON Tool | Devpouch",
        description:
            "Convert between CSV and JSON instantly in your browser. Supports custom delimiters and headers. Free and private.",
        url: `${SITE_URL}/csv-json-converter`,
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "CSV to JSON Converter Online | Devpouch",
        description:
            "Free online CSV to JSON and JSON to CSV converter with custom delimiter support.",
    },
};

export default function CsvJsonConverterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
