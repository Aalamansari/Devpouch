import type { Metadata } from "next";
import { Shield, Zap, Code2 } from "lucide-react";

export const metadata: Metadata = {
    title: "About",
    description: "About DevToolKit — a privacy-first suite of developer data formatting and validation tools.",
};

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-3xl px-4 py-16">
            <h1 className="text-3xl font-bold mb-6">About DevToolKit</h1>

            <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    DevToolKit is a free, browser-based platform providing developers with essential data formatting
                    and validation tools. Our mission is to eliminate the need for scattered online utilities and
                    provide a single, reliable, privacy-first toolkit.
                </p>

                <div className="grid gap-6 mb-12">
                    <div className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Shield className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Privacy First</h3>
                            <p className="text-sm text-muted-foreground">
                                All data processing happens entirely in your browser. We never transmit, store, or log any
                                of your data. No cookies, no tracking, no server-side processing.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Zap className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Lightning Fast</h3>
                            <p className="text-sm text-muted-foreground">
                                Client-side processing means zero network latency. Format, validate, and convert your data
                                in milliseconds, even for large files.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 p-4 rounded-xl border border-border bg-card">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <Code2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-1">Developer Focused</h3>
                            <p className="text-sm text-muted-foreground">
                                Built by developers, for developers. Familiar IDE-inspired interface with keyboard shortcuts,
                                dark mode, and monospace fonts.
                            </p>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-4">Available Tools</h2>
                <ul className="space-y-2 text-muted-foreground mb-8">
                    <li><strong className="text-foreground">JSON Formatter & Validator</strong> — Format, validate, minify, and inspect JSON data</li>
                    <li><strong className="text-foreground">XML Formatter & Validator</strong> — Pretty-print XML and convert to JSON</li>
                    <li><strong className="text-foreground">YAML Validator</strong> — Validate YAML syntax and convert between YAML/JSON</li>
                    <li><strong className="text-foreground">CSV ↔ JSON Converter</strong> — Bidirectional conversion with delimiter config</li>
                    <li><strong className="text-foreground">SQL Formatter</strong> — Beautify SQL with multi-dialect support</li>
                </ul>

                <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                <p className="text-muted-foreground mb-4">
                    DevToolKit processes all data entirely within your web browser. No data is ever sent to our
                    servers or any third party. We use privacy-friendly analytics that do not use cookies or
                    collect personal information.
                </p>
                <p className="text-muted-foreground">
                    User preferences (theme, tool settings) are stored in your browser&apos;s localStorage
                    and never transmitted.
                </p>
            </div>
        </div>
    );
}
