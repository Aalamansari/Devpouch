"use client";

import { useRef, useCallback, useState, useEffect, DragEvent, ChangeEvent } from "react";
import {
    Copy,
    Download,
    Trash2,
    Play,
    Minimize2,
    Check,
    Upload,
    ChevronDown,
} from "lucide-react";

interface ToolbarProps {
    onFormat?: () => void;
    onMinify?: () => void;
    onValidate?: () => void;
    onCopy: () => void;
    onClear: () => void;
    onDownload: () => void;
    onFileUpload?: (content: string) => void;
    formatLabel?: string;
    showMinify?: boolean;
    showValidate?: boolean;
    extraActions?: React.ReactNode;
}

export function Toolbar({
    onFormat,
    onMinify,
    onValidate,
    onCopy,
    onClear,
    onDownload,
    onFileUpload,
    formatLabel = "Format",
    showMinify = true,
    showValidate = true,
    extraActions,
}: ToolbarProps) {
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Ctrl+Enter triggers format (primary action)
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                onFormat?.();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onFormat]);

    const handleCopy = useCallback(() => {
        onCopy();
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [onCopy]);

    const handleFileChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file || !onFileUpload) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                onFileUpload(ev.target?.result as string);
            };
            reader.readAsText(file);
            e.target.value = "";
        },
        [onFileUpload]
    );

    return (
        <div className="flex items-center gap-2 flex-wrap px-4 py-2 bg-toolbar-bg border-b border-border"
            style={{ background: "var(--toolbar-bg)" }}>
            {/* Primary actions */}
            {onFormat && (
                <button
                    onClick={onFormat}
                    title="Ctrl + Enter"
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95"
                >
                    <Play className="h-3 w-3" />
                    {formatLabel}
                    <kbd className="ml-1 hidden sm:inline-block rounded bg-primary-foreground/20 px-1 py-0.5 text-[10px] font-mono leading-none">Ctrl+&crarr;</kbd>
                </button>
            )}
            {showMinify && onMinify && (
                <button
                    onClick={onMinify}
                    className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted/80 active:scale-95"
                >
                    <Minimize2 className="h-3 w-3" />
                    Minify
                </button>
            )}
            {showValidate && onValidate && (
                <button
                    onClick={onValidate}
                    className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:bg-muted/80 active:scale-95"
                >
                    <Check className="h-3 w-3" />
                    Validate
                </button>
            )}

            {extraActions}

            <div className="flex-1" />

            {/* Utility actions */}
            {onFileUpload && (
                <>
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept=".json,.xml,.yaml,.yml,.csv,.sql,.txt"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-95"
                    >
                        <Upload className="h-3 w-3" />
                        Upload
                    </button>
                </>
            )}
            <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-95"
            >
                {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied!" : "Copy"}
            </button>
            <button
                onClick={onDownload}
                className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground active:scale-95"
            >
                <Download className="h-3 w-3" />
                Download
            </button>
            <button
                onClick={onClear}
                className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-destructive transition-all hover:bg-destructive/10 active:scale-95"
            >
                <Trash2 className="h-3 w-3" />
                Clear
            </button>
        </div>
    );
}
