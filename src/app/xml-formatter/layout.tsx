import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "XML Formatter & Validator",
    description:
        "Format, validate, and convert XML to JSON in your browser. Client-side processing, zero data transmission.",
};

export default function XmlFormatterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
