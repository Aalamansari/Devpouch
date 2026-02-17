"use client";

import { useState, useCallback } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { validateYaml, yamlToJson, jsonToYaml } from "@/lib/tools/yaml/yamlEngine";
import { AdBanner } from "@/components/ads/AdBanner";

const SAMPLE_YAML = `name: DevToolKit
version: "1.0.0"
description: Developer data formatting tools

tools:
  - name: JSON Formatter
    category: formatting
  - name: XML Formatter
    category: formatting
  - name: YAML Validator
    category: validation

config:
  clientSide: true
  darkMode: true
  responsive: true`;

export default function YamlValidatorPage() {
    const [input, setInput] = useState(SAMPLE_YAML);
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [warnings, setWarnings] = useState<string[]>([]);
    const [processingTime, setProcessingTime] = useState<number | null>(null);
    const [mode, setMode] = useState<"validate" | "toJson" | "fromJson">("validate");

    const handleFormat = useCallback(() => {
        const start = performance.now();
        let result;
        switch (mode) {
            case "toJson":
                result = yamlToJson(input);
                break;
            case "fromJson":
                result = jsonToYaml(input);
                break;
            default:
                result = validateYaml(input);
        }
        setProcessingTime(Math.round(performance.now() - start));
        setOutput(result.output);
        setWarnings(result.warnings || []);
        setError(result.error ? `${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}` : null);
    }, [input, mode]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(output || input);
    }, [output, input]);

    const handleDownload = useCallback(() => {
        const ext = mode === "toJson" ? "json" : "yaml";
        const blob = new Blob([output || input], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `output.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    }, [output, input, mode]);

    const handleClear = useCallback(() => {
        setInput("");
        setOutput("");
        setError(null);
        setWarnings([]);
        setProcessingTime(null);
    }, []);

    const handleFileUpload = useCallback((content: string) => {
        setInput(content);
        setOutput("");
        setError(null);
        setWarnings([]);
    }, []);

    const actionLabel = mode === "toJson" ? "Convert to JSON" : mode === "fromJson" ? "Convert to YAML" : "Validate";

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
            <Toolbar
                onFormat={handleFormat}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onClear={handleClear}
                onFileUpload={handleFileUpload}
                formatLabel={actionLabel}
                showMinify={false}
                showValidate={false}
                extraActions={
                    <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value as "validate" | "toJson" | "fromJson")}
                        className="rounded-lg bg-muted px-2 py-1.5 text-xs font-medium text-foreground border-0 outline-none cursor-pointer"
                    >
                        <option value="validate">Validate YAML</option>
                        <option value="toJson">YAML → JSON</option>
                        <option value="fromJson">JSON → YAML</option>
                    </select>
                }
            />

            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                <div className="flex-1 flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-border">
                    <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
                        style={{ background: "var(--editor-gutter)" }}>
                        Input {mode === "fromJson" ? "(JSON)" : "(YAML)"}
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
                        placeholder={mode === "fromJson" ? "Paste your JSON here..." : "Paste your YAML here..."}
                        spellCheck={false}
                    />
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
                        style={{ background: "var(--editor-gutter)" }}>
                        Output
                    </div>
                    <div className="flex-1 flex flex-col min-h-0">
                        <textarea
                            value={output}
                            readOnly
                            className={`flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none ${error ? "text-destructive" : ""}`}
                            placeholder="Output will appear here..."
                            spellCheck={false}
                        />
                        {warnings.length > 0 && (
                            <div className="border-t border-border p-3" style={{ background: "var(--editor-gutter)" }}>
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-warning mb-1">Warnings</p>
                                {warnings.map((w, i) => (
                                    <p key={i} className="text-xs text-warning/80 font-mono">{w}</p>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <StatusBar
                inputSize={new Blob([input]).size}
                outputSize={new Blob([output]).size}
                lineCount={input.split("\n").length}
                processingTime={processingTime}
                error={error}
            />
            <AdBanner slot="yaml-footer" format="horizontal" />
        </div>
    );
}
