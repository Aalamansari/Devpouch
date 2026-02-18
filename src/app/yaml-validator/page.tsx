"use client";

import { useState, useCallback } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { validateYaml, yamlToJson, jsonToYaml } from "@/lib/tools/yaml/yamlEngine";
import { AdBanner } from "@/components/ads/AdBanner";
import { useAppStore } from "@/store/store";

export default function YamlValidatorPage() {
    const { toolStates, setToolInput, setToolOutput, clearTool } = useAppStore();
    const { input, output, error, processingTime } = toolStates.yaml;
    const [warnings, setWarnings] = useState<string[]>([]);
    const [mode, setMode] = useState<"validate" | "toJson" | "fromJson">("validate");

    const setInput = useCallback((val: string) => setToolInput("yaml", val), [setToolInput]);

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
        const time = Math.round(performance.now() - start);
        setWarnings(result.warnings || []);
        const err = result.error ? `${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}` : null;
        setToolOutput("yaml", result.output, err, time);
    }, [input, mode, setToolOutput]);

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
        clearTool("yaml");
        setWarnings([]);
    }, [clearTool]);

    const handleFileUpload = useCallback((content: string) => {
        setToolInput("yaml", content);
        setToolOutput("yaml", "", null, null);
        setWarnings([]);
    }, [setToolInput, setToolOutput]);

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
                <EditorPanel label={`Input ${mode === "fromJson" ? "(JSON)" : "(YAML)"}`} className="border-b md:border-b-0 md:border-r border-border">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
                        placeholder={mode === "fromJson" ? "Paste your JSON here..." : "Paste your YAML here..."}
                        spellCheck={false}
                    />
                </EditorPanel>

                <EditorPanel label="Output">
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
                </EditorPanel>
            </div>

            <StatusBar
                inputSize={new Blob([input]).size}
                outputSize={new Blob([output]).size}
                lineCount={input.split("\n").length}
                processingTime={processingTime}
                error={error}
            />
            <AdBanner />
        </div>
    );
}
