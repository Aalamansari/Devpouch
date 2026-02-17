"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
    Braces,
    Code2,
    FileJson,
    FileSpreadsheet,
    Database,
    Sun,
    Moon,
    Menu,
    X,
    Wrench,
} from "lucide-react";

const tools = [
    { name: "JSON", href: "/json-formatter", icon: Braces, color: "text-amber-500" },
    { name: "XML", href: "/xml-formatter", icon: Code2, color: "text-orange-500" },
    { name: "YAML", href: "/yaml-validator", icon: FileJson, color: "text-emerald-500" },
    { name: "CSV", href: "/csv-json-converter", icon: FileSpreadsheet, color: "text-blue-500" },
    { name: "SQL", href: "/sql-formatter", icon: Database, color: "text-purple-500" },
];

export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
            <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent">
                        <Wrench className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        DevToolKit
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {tools.map((tool) => {
                        const isActive = pathname === tool.href;
                        const Icon = tool.icon;
                        return (
                            <Link
                                key={tool.href}
                                href={tool.href}
                                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200
                  ${isActive
                                        ? "bg-primary/10 text-primary shadow-sm"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                <Icon className={`h-4 w-4 ${isActive ? tool.color : ""}`} />
                                <span>{tool.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2">
                    {/* Theme toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                    )}

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {mobileMenuOpen && (
                <div className="border-t border-border bg-card px-4 py-3 md:hidden">
                    <div className="flex flex-col gap-1">
                        {tools.map((tool) => {
                            const isActive = pathname === tool.href;
                            const Icon = tool.icon;
                            return (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                    ${isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                >
                                    <Icon className={`h-4 w-4 ${isActive ? tool.color : ""}`} />
                                    <span>{tool.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
