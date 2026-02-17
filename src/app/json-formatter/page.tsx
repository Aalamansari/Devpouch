"use client";

import { useState, useCallback, useRef } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { formatJson, minifyJson, validateJson } from "@/lib/tools/json/jsonEngine";
import { AdBanner } from "@/components/ads/AdBanner";

const SAMPLE_JSON = `{
  "name": "DevToolKit",
  "version": "1.0.0",
  "description": "Developer data formatting tools",
  "tools": ["JSON", "XML", "YAML", "CSV", "SQL"],
  "features": {
    "clientSide": true,
    "darkMode": true,
    "responsive": true
  }
}`;

export default function JsonFormatterPage() {
    const [input, setInput] = useState(SAMPLE_JSON);
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [processingTime, setProcessingTime] = useState<number | null>(null);
    const [indent, setIndent] = useState(2);

    const handleFormat = useCallback(() => {
        const start = performance.now();
        const result = formatJson(input, indent);
        setProcessingTime(Math.round(performance.now() - start));
        setOutput(result.output);
        setError(result.error ? `${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}` : null);
    }, [input, indent]);

    const handleMinify = useCallback(() => {
        const start = performance.now();
        const result = minifyJson(input);
        setProcessingTime(Math.round(performance.now() - start));
        setOutput(result.output);
        setError(result.error ? result.error.message : null);
    }, [input]);

    const handleValidate = useCallback(() => {
        const start = performance.now();
        const result = validateJson(input);
        setProcessingTime(Math.round(performance.now() - start));
        setOutput(result.output);
        setError(result.error ? `${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}` : null);
    }, [input]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(output || input);
    }, [output, input]);

    const handleDownload = useCallback(() => {
        const blob = new Blob([output || input], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "formatted.json";
        a.click();
        URL.revokeObjectURL(url);
    }, [output, input]);

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
            {/* Toolbar */}
            <Toolbar
                onFormat={handleFormat}
                onMinify={handleMinify}
                onValidate={handleValidate}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onClear={handleClear}
                onFileUpload={handleFileUpload}
                formatLabel="Format JSON"
                extraActions={
                    <select
                        value={indent}
                        onChange={(e) => setIndent(Number(e.target.value))}
                        className="rounded-lg bg-muted px-2 py-1.5 text-xs font-medium text-foreground border-0 outline-none cursor-pointer"
                    >
                        <option value={2}>2 Spaces</option>
                        <option value={4}>4 Spaces</option>
                        <option value={8}>Tab (8)</option>
                    </select>
                }
            />

            {/* Editor panels */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                {/* Input */}
                <div className="flex-1 flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-border">
                    <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
                        style={{ background: "var(--editor-gutter)" }}>
                        Input
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
                        placeholder="Paste your JSON here..."
                        spellCheck={false}
                    />
                </div>

                {/* Output */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
                        style={{ background: "var(--editor-gutter)" }}>
                        Output
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        className={`flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none ${error ? "text-destructive" : ""
                            }`}
                        placeholder="Formatted output will appear here..."
                        spellCheck={false}
                    />
                </div>
            </div>

            {/* Status bar */}
            <StatusBar
                inputSize={new Blob([input]).size}
                outputSize={new Blob([output]).size}
                lineCount={input.split("\n").length}
                processingTime={processingTime}
                error={error}
            />

            {/* Ad banner */}
            <AdBanner slot="json-footer" format="horizontal" />
        </div>
    );
}
