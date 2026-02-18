import type { Metadata } from "next";

const SITE_URL = "https://www.devpouch.space";

export const metadata: Metadata = {
    title: "JSON Formatter & Validator Online — Free JSON Beautifier",
    description:
        "Format, validate, and minify JSON online for free. Pretty-print JSON with syntax highlighting, bracket matching, and collapsible sections. 100% client-side — your data never leaves the browser.",
    keywords: [
        "json formatter", "json formatter online", "json validator", "json beautifier",
        "json minifier", "json pretty print", "json viewer", "format json online",
        "validate json", "json lint", "json parser", "json syntax checker",
        "free json formatter", "online json tool",
    ],
    alternates: {
        canonical: `${SITE_URL}/json-formatter`,
    },
    openGraph: {
        title: "JSON Formatter & Validator Online — Free JSON Beautifier | Devpouch",
        description:
            "Format, validate, and minify JSON instantly in your browser. Free, fast, and private.",
        url: `${SITE_URL}/json-formatter`,
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "JSON Formatter & Validator Online | Devpouch",
        description:
            "Free online JSON formatter with validation, minification, syntax highlighting, and bracket matching.",
    },
};

export default function JsonFormatterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
