"use client";

import { useState, useCallback } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { EditorPanel } from "@/components/editor/EditorPanel";
import { formatSql, minifySql, SQL_DIALECTS, KEYWORD_CASES } from "@/lib/tools/sql/sqlEngine";
import { AdBanner } from "@/components/ads/AdBanner";
import { useAppStore } from "@/store/store";
import type { KeywordCase, SqlLanguage } from "sql-formatter";

export default function SqlFormatterPage() {
    const { toolStates, setToolInput, setToolOutput, clearTool } = useAppStore();
    const { input, output, error, processingTime } = toolStates.sql;
    const [dialect, setDialect] = useState<string>("sql");
    const [indent, setIndent] = useState(2);
    const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");

    const setInput = useCallback((val: string) => setToolInput("sql", val), [setToolInput]);

    const handleFormat = useCallback(() => {
        const start = performance.now();
        const result = formatSql(input, {
            dialect: dialect as SqlLanguage,
            indent,
            keywordCase,
        });
        const time = Math.round(performance.now() - start);
        setToolOutput("sql", result.output, result.error ? result.error.message : null, time);
    }, [input, dialect, indent, keywordCase, setToolOutput]);

    const handleMinify = useCallback(() => {
        const start = performance.now();
        const result = minifySql(input);
        const time = Math.round(performance.now() - start);
        setToolOutput("sql", result.output, result.error ? result.error.message : null, time);
    }, [input, setToolOutput]);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(output || input);
    }, [output, input]);

    const handleDownload = useCallback(() => {
        const blob = new Blob([output || input], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "formatted.sql";
        a.click();
        URL.revokeObjectURL(url);
    }, [output, input]);

    const handleClear = useCallback(() => {
        clearTool("sql");
    }, [clearTool]);

    const handleFileUpload = useCallback((content: string) => {
        setToolInput("sql", content);
        setToolOutput("sql", "", null, null);
    }, [setToolInput, setToolOutput]);

    return (
        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
            <Toolbar
                onFormat={handleFormat}
                onMinify={handleMinify}
                onCopy={handleCopy}
                onDownload={handleDownload}
                onClear={handleClear}
                onFileUpload={handleFileUpload}
                formatLabel="Format SQL"
                showValidate={false}
                extraActions={
                    <div className="flex items-center gap-2">
                        <select
                            value={dialect}
                            onChange={(e) => setDialect(e.target.value)}
                            className="rounded-lg bg-muted px-2 py-1.5 text-xs font-medium text-foreground border-0 outline-none cursor-pointer"
                        >
                            {SQL_DIALECTS.map((d) => (
                                <option key={d.value} value={d.value}>{d.label}</option>
                            ))}
                        </select>
                        <select
                            value={keywordCase}
                            onChange={(e) => setKeywordCase(e.target.value as KeywordCase)}
                            className="rounded-lg bg-muted px-2 py-1.5 text-xs font-medium text-foreground border-0 outline-none cursor-pointer"
                        >
                            {KEYWORD_CASES.map((k) => (
                                <option key={k.value} value={k.value}>{k.label}</option>
                            ))}
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
                <EditorPanel label="Input (SQL)" className="border-b md:border-b-0 md:border-r border-border">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
                        placeholder="Paste your SQL here..."
                        spellCheck={false}
                    />
                </EditorPanel>

                <EditorPanel label="Output (SQL)">
                    <textarea
                        value={output}
                        readOnly
                        className={`flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none ${error ? "text-destructive" : ""}`}
                        placeholder="Formatted output will appear here..."
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
            <AdBanner slot="sql-footer" format="horizontal" />
        </div>
    );
}
