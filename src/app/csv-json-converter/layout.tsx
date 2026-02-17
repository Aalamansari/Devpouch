import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "CSV ↔ JSON Converter",
    description:
        "Convert between CSV and JSON formats with configurable delimiters and headers. Client-side, privacy-first.",
};

export default function CsvJsonConverterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
