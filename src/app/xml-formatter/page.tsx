"use client";

import { useState, useCallback } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { formatXml, validateXml, xmlToJson } from "@/lib/tools/xml/xmlEngine";
import { AdBanner } from "@/components/ads/AdBanner";

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project>
  <name>DevToolKit</name>
  <version>1.0.0</version>
  <description>Developer data formatting tools</description>
  <tools>
    <tool id="1">JSON Formatter</tool>
    <tool id="2">XML Formatter</tool>
    <tool id="3">YAML Validator</tool>
  </tools>
</project>`;

export default function XmlFormatterPage() {
    const [input, setInput] = useState(SAMPLE_XML);
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [processingTime, setProcessingTime] = useState<number | null>(null);
    const [indent, setIndent] = useState(2);
    const [mode, setMode] = useState<"format" | "toJson">("format");

    const handleFormat = useCallback(() => {
        const start = performance.now();
        const result = mode === "toJson" ? xmlToJson(input, indent) : formatXml(input, indent);
        setProcessingTime(Math.round(performance.now() - start));
        setOutput(result.output);
        setError(result.error ? `${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}` : null);
    }, [input, indent, mode]);

    const handleValidate = useCallback(() => {
        const start = performance.now();
        const result = validateXml(input);
        setProcessingTime(Math.round(performance.now() - start));
        setOutput(result.output);
        setError(result.error ? `${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}` : null);
    }, [input]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(output || input);
    }, [output, input]);

    const handleDownload = useCallback(() => {
        const ext = mode === "toJson" ? "json" : "xml";
        const blob = new Blob([output || input], { type: `application/${ext}` });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `formatted.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    }, [output, input, mode]);

    const handleClear = useCallback(() => {
        setInput("");
        setOutput("");
        setError(null);
        setProcessingTime(null);
    }, []);

    const handleFileUpload = useCallback((content: string) => {
        setInput(content);
        setOutput("");
        setError(null);
    }, []);

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
            <Toolbar
                onFormat={handleFormat}
                onValidate={handleValidate}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onClear={handleClear}
                onFileUpload={handleFileUpload}
                formatLabel={mode === "toJson" ? "Convert to JSON" : "Format XML"}
                showMinify={false}
                extraActions={
                    <div className="flex items-center gap-2">
                        <select
                            value={mode}
                            onChange={(e) => setMode(e.target.value as "format" | "toJson")}
                            className="rounded-lg bg-muted px-2 py-1.5 text-xs font-medium text-foreground border-0 outline-none cursor-pointer"
                        >
                            <option value="format">Format XML</option>
                            <option value="toJson">XML → JSON</option>
                        </select>
                        <select
                            value={indent}
                            onChange={(e) => setIndent(Number(e.target.value))}
                            className="rounded-lg bg-muted px-2 py-1.5 text-xs font-medium text-foreground border-0 outline-none cursor-pointer"
                        >
                            <option value={2}>2 Spaces</option>
                            <option value={4}>4 Spaces</option>
                        </select>
                    </div>
                }
            />

            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                <div className="flex-1 flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-border">
                    <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
                        style={{ background: "var(--editor-gutter)" }}>
                        Input (XML)
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
                        placeholder="Paste your XML here..."
                        spellCheck={false}
                    />
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
                        style={{ background: "var(--editor-gutter)" }}>
                        Output {mode === "toJson" ? "(JSON)" : "(XML)"}
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        className={`flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none ${error ? "text-destructive" : ""}`}
                        placeholder="Formatted output will appear here..."
                        spellCheck={false}
                    />
                </div>
            </div>

            <StatusBar
                inputSize={new Blob([input]).size}
                outputSize={new Blob([output]).size}
                lineCount={input.split("\n").length}
                processingTime={processingTime}
                error={error}
            />
            <AdBanner slot="xml-footer" format="horizontal" />
        </div>
    );
}
