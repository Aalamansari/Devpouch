"use client";

import { useState, useCallback } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { CodeViewer } from "@/components/editor/CodeViewer";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { formatJson, minifyJson, validateJson } from "@/lib/tools/json/jsonEngine";
import { AdBanner } from "@/components/ads/AdBanner";
import { useAppStore } from "@/store/store";

export default function JsonFormatterPage() {
    const { toolStates, setToolInput, setToolOutput, clearTool } = useAppStore();
    const { input, output, error, processingTime } = toolStates.json;
    const [indent, setIndent] = useState(2);

    const setInput = useCallback((val: string) => setToolInput("json", val), [setToolInput]);

    const handleFormat = useCallback(() => {
        const start = performance.now();
        const result = formatJson(input, indent);
        const time = Math.round(performance.now() - start);
        const err = result.error ? `${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}` : null;
        setToolOutput("json", result.output, err, time);
    }, [input, indent, setToolOutput]);

    const handleMinify = useCallback(() => {
        const start = performance.now();
        const result = minifyJson(input);
        const time = Math.round(performance.now() - start);
        setToolOutput("json", result.output, result.error ? result.error.message : null, time);
    }, [input, setToolOutput]);

    const handleValidate = useCallback(() => {
        const start = performance.now();
        const result = validateJson(input);
        const time = Math.round(performance.now() - start);
        const err = result.error ? `${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}` : null;
        setToolOutput("json", result.output, err, time);
    }, [input, setToolOutput]);

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
        clearTool("json");
    }, [clearTool]);

    const handleFileUpload = useCallback((content: string) => {
        setToolInput("json", content);
        setToolOutput("json", "", null, null);
    }, [setToolInput, setToolOutput]);

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
                <EditorPanel label="Input" className="border-b md:border-b-0 md:border-r border-border">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
                        placeholder="Paste your JSON here..."
                        spellCheck={false}
                    />
                </EditorPanel>

                <EditorPanel label="Output">
                    <CodeViewer content={output} language="json" error={!!error} />
                </EditorPanel>
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
