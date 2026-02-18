import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Changelog",
    description: "Devpouch version history and updates.",
};

export default function ChangelogPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-3xl font-bold mb-8">Changelog</h1>

            <div className="space-y-8">
                {/* v1.0.0 */}
                <div className="relative pl-8 border-l-2 border-primary/20">
                    <div className="absolute left-0 top-0 -translate-x-1/2 h-4 w-4 rounded-full bg-primary shadow-lg shadow-primary/30" />
                    <div className="mb-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-0.5 text-sm font-semibold text-primary">
                            v1.0.0
                        </span>
                        <span className="ml-3 text-sm text-muted-foreground">February 17, 2026</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Initial Release</h3>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                        <li>🎉 Launch of Devpouch platform</li>
                        <li>📄 JSON Formatter & Validator with pretty-print, minify, and validation</li>
                        <li>📄 XML Formatter & Validator with XML-to-JSON conversion</li>
                        <li>📄 YAML Validator with YAML/JSON bidirectional conversion</li>
                        <li>📄 CSV ↔ JSON Converter with configurable delimiters</li>
                        <li>📄 SQL Formatter with multi-dialect support</li>
                        <li>🌙 Dark mode and light mode with system detection</li>
                        <li>📱 Responsive design for mobile and desktop</li>
                        <li>🔒 100% client-side processing — zero data transmission</li>
                        <li>📋 Copy to clipboard and file download for all tools</li>
                        <li>📂 File upload support</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
