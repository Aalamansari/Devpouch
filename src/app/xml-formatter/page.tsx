"use client";

import { useState, useCallback } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { CodeViewer } from "@/components/editor/CodeViewer";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { formatXml, validateXml, xmlToJson } from "@/lib/tools/xml/xmlEngine";
import { AdBanner } from "@/components/ads/AdBanner";
import { useAppStore } from "@/store/store";

export default function XmlFormatterPage() {
    const { toolStates, setToolInput, setToolOutput, clearTool } = useAppStore();
    const { input, output, error, processingTime } = toolStates.xml;
    const [indent, setIndent] = useState(2);
    const [mode, setMode] = useState<"format" | "toJson">("format");

    const setInput = useCallback((val: string) => setToolInput("xml", val), [setToolInput]);

    const handleFormat = useCallback(() => {
        const start = performance.now();
        const result = mode === "toJson" ? xmlToJson(input, indent) : formatXml(input, indent);
        const time = Math.round(performance.now() - start);
        const err = result.error ? `${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}` : null;
        setToolOutput("xml", result.output, err, time);
    }, [input, indent, mode, setToolOutput]);

    const handleValidate = useCallback(() => {
        const start = performance.now();
        const result = validateXml(input);
        const time = Math.round(performance.now() - start);
        const err = result.error ? `${result.error.message}${result.error.line ? ` (line ${result.error.line})` : ""}` : null;
        setToolOutput("xml", result.output, err, time);
    }, [input, setToolOutput]);

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
        clearTool("xml");
    }, [clearTool]);

    const handleFileUpload = useCallback((content: string) => {
        setToolInput("xml", content);
        setToolOutput("xml", "", null, null);
    }, [setToolInput, setToolOutput]);

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
                <EditorPanel label="Input (XML)" className="border-b md:border-b-0 md:border-r border-border">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
                        placeholder="Paste your XML here..."
                        spellCheck={false}
                    />
                </EditorPanel>

                <EditorPanel label={`Output ${mode === "toJson" ? "(JSON)" : "(XML)"}`}>
                    <CodeViewer content={output} language={mode === "toJson" ? "json" : "xml"} error={!!error} />
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
