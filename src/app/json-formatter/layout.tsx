import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "JSON Formatter & Validator",
    description:
        "Format, validate, and minify JSON data instantly in your browser. Client-side processing, zero data transmission.",
};

export default function JsonFormatterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
