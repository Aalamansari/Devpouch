"use client";

import { useState, useEffect, useCallback } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface EditorPanelProps {
    label: string;
    children: React.ReactNode;
    /** Extra classes when NOT fullscreen (e.g. border-r) */
    className?: string;
}

export function EditorPanel({ label, children, className = "" }: EditorPanelProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen((prev) => !prev);
    }, []);

    // Escape key exits fullscreen
    useEffect(() => {
        if (!isFullscreen) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setIsFullscreen(false);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isFullscreen]);

    return (
        <div
            className={
                isFullscreen
                    ? "fixed inset-0 z-50 flex flex-col bg-[var(--editor-bg)]"
                    : `flex-1 flex flex-col min-h-0 ${className}`
            }
        >
            {/* Header bar */}
            <div
                className="flex items-center justify-between px-4 py-1.5 border-b border-border shrink-0"
                style={{ background: "var(--editor-gutter)" }}
            >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                </span>
                <button
                    onClick={toggleFullscreen}
                    title={isFullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
                    className="flex items-center justify-center h-5 w-5 rounded text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
                >
                    {isFullscreen ? (
                        <Minimize2 className="h-3 w-3" />
                    ) : (
                        <Maximize2 className="h-3 w-3" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col min-h-0">
                {children}
            </div>
        </div>
    );
}
