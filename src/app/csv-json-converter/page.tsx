"use client";

import { useState, useCallback } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { csvToJson, jsonToCsv, type CsvToJsonOptions, type JsonToCsvOptions } from "@/lib/tools/csv/csvEngine";
import { AdBanner } from "@/components/ads/AdBanner";
import { useAppStore } from "@/store/store";

export default function CsvJsonConverterPage() {
    const { toolStates, setToolInput, setToolOutput, clearTool } = useAppStore();
    const { input, output, error, processingTime } = toolStates.csv;
    const [mode, setMode] = useState<"csvToJson" | "jsonToCsv">("csvToJson");
    const [delimiter, setDelimiter] = useState(",");
    const [hasHeader, setHasHeader] = useState(true);

    const setInput = useCallback((val: string) => setToolInput("csv", val), [setToolInput]);

    const handleFormat = useCallback(() => {
        const start = performance.now();
        let result;
        if (mode === "csvToJson") {
            result = csvToJson(input, { delimiter, hasHeader, indent: 2 });
        } else {
            result = jsonToCsv(input, { delimiter, includeHeader: hasHeader });
        }
        const time = Math.round(performance.now() - start);
        setToolOutput("csv", result.output, result.error ? result.error.message : null, time);
    }, [input, mode, delimiter, hasHeader, setToolOutput]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(output || input);
    }, [output, input]);

    const handleDownload = useCallback(() => {
        const ext = mode === "csvToJson" ? "json" : "csv";
        const blob = new Blob([output || input], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `output.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
    }, [output, input, mode]);

    const handleClear = useCallback(() => {
        clearTool("csv");
    }, [clearTool]);

    const handleFileUpload = useCallback((content: string) => {
        setToolInput("csv", content);
        setToolOutput("csv", "", null, null);
    }, [setToolInput, setToolOutput]);

    const handleModeChange = useCallback((newMode: "csvToJson" | "jsonToCsv") => {
        setMode(newMode);
        setToolOutput("csv", "", null, null);
    }, [setToolOutput]);

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
            <Toolbar
                onFormat={handleFormat}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onClear={handleClear}
                onFileUpload={handleFileUpload}
                formatLabel={mode === "csvToJson" ? "Convert to JSON" : "Convert to CSV"}
                showMinify={false}
                showValidate={false}
                extraActions={
                    <div className="flex items-center gap-2">
                        <select
                            value={mode}
                            onChange={(e) => handleModeChange(e.target.value as "csvToJson" | "jsonToCsv")}
                            className="rounded-lg bg-muted px-2 py-1.5 text-xs font-medium text-foreground border-0 outline-none cursor-pointer"
                        >
                            <option value="csvToJson">CSV → JSON</option>
                            <option value="jsonToCsv">JSON → CSV</option>
                        </select>
                        <select
                            value={delimiter}
                            onChange={(e) => setDelimiter(e.target.value)}
                            className="rounded-lg bg-muted px-2 py-1.5 text-xs font-medium text-foreground border-0 outline-none cursor-pointer"
                        >
                            <option value=",">Comma (,)</option>
                            <option value=";">Semicolon (;)</option>
                            <option value="	">Tab</option>
                            <option value="|">Pipe (|)</option>
                        </select>
                        <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer">
                            <input
                                type="checkbox"
                                checked={hasHeader}
                                onChange={(e) => setHasHeader(e.target.checked)}
                                className="rounded"
                            />
                            Headers
                        </label>
                    </div>
                }
            />

            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                <EditorPanel label={`Input (${mode === "csvToJson" ? "CSV" : "JSON"})`} className="border-b md:border-b-0 md:border-r border-border">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
                        placeholder={mode === "csvToJson" ? "Paste your CSV here..." : "Paste your JSON array here..."}
                        spellCheck={false}
                    />
                </EditorPanel>

                <EditorPanel label={`Output (${mode === "csvToJson" ? "JSON" : "CSV"})`}>
                    <textarea
                        value={output}
                        readOnly
                        className={`flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none ${error ? "text-destructive" : ""}`}
                        placeholder="Converted output will appear here..."
                        spellCheck={false}
                    />
                </EditorPanel>
            </div>

            <StatusBar
                inputSize={new Blob([input]).size}
                outputSize={new Blob([output]).size}
                lineCount={input.split("\n").length}
                processingTime={processingTime}
                error={error}
            />
            <AdBanner slot="csv-footer" format="horizontal" />
        </div>
    );
}
