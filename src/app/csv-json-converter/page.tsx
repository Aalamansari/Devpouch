"use client";

import { useState, useCallback } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { csvToJson, jsonToCsv, type CsvToJsonOptions, type JsonToCsvOptions } from "@/lib/tools/csv/csvEngine";
import { AdBanner } from "@/components/ads/AdBanner";

const SAMPLE_CSV = `name,role,department,salary
Alice Johnson,Developer,Engineering,95000
Bob Smith,Designer,Design,85000
Carol Williams,Manager,Engineering,120000
David Brown,Analyst,Data,90000
Eve Davis,DevOps,Infrastructure,105000`;

const SAMPLE_JSON_ARRAY = `[
  {"name": "Alice Johnson", "role": "Developer", "department": "Engineering", "salary": 95000},
  {"name": "Bob Smith", "role": "Designer", "department": "Design", "salary": 85000},
  {"name": "Carol Williams", "role": "Manager", "department": "Engineering", "salary": 120000}
]`;

export default function CsvJsonConverterPage() {
    const [input, setInput] = useState(SAMPLE_CSV);
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [processingTime, setProcessingTime] = useState<number | null>(null);
    const [mode, setMode] = useState<"csvToJson" | "jsonToCsv">("csvToJson");
    const [delimiter, setDelimiter] = useState(",");
    const [hasHeader, setHasHeader] = useState(true);

    const handleFormat = useCallback(() => {
        const start = performance.now();
        let result;
        if (mode === "csvToJson") {
            result = csvToJson(input, { delimiter, hasHeader, indent: 2 });
        } else {
            result = jsonToCsv(input, { delimiter, includeHeader: hasHeader });
        }
        setProcessingTime(Math.round(performance.now() - start));
        setOutput(result.output);
        setError(result.error ? result.error.message : null);
    }, [input, mode, delimiter, hasHeader]);

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

    const handleModeChange = useCallback((newMode: "csvToJson" | "jsonToCsv") => {
        setMode(newMode);
        setInput(newMode === "csvToJson" ? SAMPLE_CSV : SAMPLE_JSON_ARRAY);
        setOutput("");
        setError(null);
    }, []);

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
                <div className="flex-1 flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-border">
                    <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
                        style={{ background: "var(--editor-gutter)" }}>
                        Input ({mode === "csvToJson" ? "CSV" : "JSON"})
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
                        placeholder={mode === "csvToJson" ? "Paste your CSV here..." : "Paste your JSON array here..."}
                        spellCheck={false}
                    />
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
                        style={{ background: "var(--editor-gutter)" }}>
                        Output ({mode === "csvToJson" ? "JSON" : "CSV"})
                    </div>
                    <textarea
                        value={output}
                        readOnly
                        className={`flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none ${error ? "text-destructive" : ""}`}
                        placeholder="Converted output will appear here..."
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
            <AdBanner slot="csv-footer" format="horizontal" />
        </div>
    );
}
