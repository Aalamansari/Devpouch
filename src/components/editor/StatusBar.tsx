"use client";

import { useEffect, useState } from "react";

interface StatusBarProps {
    inputSize: number;
    outputSize: number;
    lineCount: number;
    processingTime: number | null;
    error?: string | null;
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function StatusBar({ inputSize, outputSize, lineCount, processingTime, error }: StatusBarProps) {
    return (
        <div
            className="flex items-center justify-between gap-4 px-4 py-1.5 text-[11px] font-medium border-t border-border"
            style={{ background: "var(--status-bar)" }}
        >
            <div className="flex items-center gap-4 text-muted-foreground">
                <span>Input: {formatBytes(inputSize)}</span>
                <span>Output: {formatBytes(outputSize)}</span>
                <span>Lines: {lineCount}</span>
                {processingTime !== null && <span>Time: {processingTime}ms</span>}
            </div>
            {error && (
                <span className="text-destructive truncate max-w-[50%]" title={error}>
                    ⚠ {error}
                </span>
            )}
            {!error && (
                <span className="text-muted-foreground">
                    All processing is client-side
                </span>
            )}
        </div>
    );
}
