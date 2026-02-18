import type { Metadata } from "next";

const SITE_URL = "https://www.devpouch.space";

export const metadata: Metadata = {
    title: "XML Formatter & Validator Online — Free XML Beautifier",
    description:
        "Format, validate, and convert XML to JSON online for free. Pretty-print XML with syntax highlighting and collapsible elements. 100% client-side — your data stays in your browser.",
    keywords: [
        "xml formatter", "xml formatter online", "xml validator", "xml beautifier",
        "xml pretty print", "xml to json", "xml to json converter", "format xml online",
        "validate xml", "xml viewer", "xml parser", "free xml formatter",
        "online xml tool", "xml syntax checker",
    ],
    alternates: {
        canonical: `${SITE_URL}/xml-formatter`,
    },
    openGraph: {
        title: "XML Formatter & Validator Online — Free XML Beautifier | Devpouch",
        description:
            "Format, validate XML, and convert XML to JSON instantly in your browser. Free and private.",
        url: `${SITE_URL}/xml-formatter`,
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "XML Formatter & Validator Online | Devpouch",
        description:
            "Free online XML formatter with validation, XML-to-JSON conversion, and syntax highlighting.",
    },
};

export default function XmlFormatterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
