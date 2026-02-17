"use client";

import { useState, useCallback } from "react";
import { Toolbar } from "@/components/editor/Toolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { formatSql, minifySql, SQL_DIALECTS, KEYWORD_CASES } from "@/lib/tools/sql/sqlEngine";
import { AdBanner } from "@/components/ads/AdBanner";
import type { KeywordCase, SqlLanguage } from "sql-formatter";

const SAMPLE_SQL = `SELECT u.id, u.name, u.email, o.order_id, o.total_amount, o.created_at FROM users u INNER JOIN orders o ON u.id = o.user_id LEFT JOIN payments p ON o.order_id = p.order_id WHERE u.status = 'active' AND o.created_at >= '2024-01-01' AND o.total_amount > 100 GROUP BY u.id, u.name, u.email, o.order_id, o.total_amount, o.created_at HAVING COUNT(o.order_id) > 5 ORDER BY o.total_amount DESC LIMIT 50;`;

export default function SqlFormatterPage() {
    const [input, setInput] = useState(SAMPLE_SQL);
    const [output, setOutput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [processingTime, setProcessingTime] = useState<number | null>(null);
    const [dialect, setDialect] = useState<string>("sql");
    const [indent, setIndent] = useState(2);
    const [keywordCase, setKeywordCase] = useState<KeywordCase>("upper");

    const handleFormat = useCallback(() => {
        const start = performance.now();
        const result = formatSql(input, {
            dialect: dialect as SqlLanguage,
            indent,
            keywordCase,
        });
        setProcessingTime(Math.round(performance.now() - start));
        setOutput(result.output);
        setError(result.error ? result.error.message : null);
    }, [input, dialect, indent, keywordCase]);

    const handleMinify = useCallback(() => {
        const start = performance.now();
        const result = minifySql(input);
        setProcessingTime(Math.round(performance.now() - start));
        setOutput(result.output);
        setError(result.error ? result.error.message : null);
    }, [input]);

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
                <div className="flex-1 flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-border">
                    <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
                        style={{ background: "var(--editor-gutter)" }}>
                        Input (SQL)
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 w-full resize-none bg-[var(--editor-bg)] p-4 font-mono text-sm leading-relaxed outline-none placeholder:text-muted-foreground/50"
                        placeholder="Paste your SQL here..."
                        spellCheck={false}
                    />
                </div>

                <div className="flex-1 flex flex-col min-h-0">
                    <div className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border"
                        style={{ background: "var(--editor-gutter)" }}>
                        Output (SQL)
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
            <AdBanner slot="sql-footer" format="horizontal" />
        </div>
    );
}
