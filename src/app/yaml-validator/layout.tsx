import type { Metadata } from "next";

const SITE_URL = "https://www.devpouch.space";

export const metadata: Metadata = {
    title: "YAML Validator Online — Free YAML to JSON Converter",
    description:
        "Validate YAML syntax and convert between YAML and JSON online for free. Detect common YAML pitfalls instantly. 100% client-side — your data never leaves the browser.",
    keywords: [
        "yaml validator", "yaml validator online", "yaml to json", "json to yaml",
        "yaml converter", "yaml lint", "yaml checker", "validate yaml online",
        "yaml parser", "yaml syntax checker", "free yaml validator",
        "yaml json converter", "online yaml tool",
    ],
    alternates: {
        canonical: `${SITE_URL}/yaml-validator`,
    },
    openGraph: {
        title: "YAML Validator Online — Free YAML to JSON Converter | Devpouch",
        description:
            "Validate YAML syntax and convert between YAML and JSON instantly in your browser. Free and private.",
        url: `${SITE_URL}/yaml-validator`,
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "YAML Validator Online | Devpouch",
        description:
            "Free online YAML validator with YAML-to-JSON and JSON-to-YAML conversion.",
    },
};

export default function YamlValidatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
