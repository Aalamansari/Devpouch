import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "YAML Validator",
    description:
        "Validate YAML syntax, convert between YAML and JSON, and detect common pitfalls. All processing in your browser.",
};

export default function YamlValidatorLayout({ children }: { children: React.ReactNode }) {
    return children;
}
