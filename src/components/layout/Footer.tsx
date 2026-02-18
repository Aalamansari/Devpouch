import Link from "next/link";
import { Wrench } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border bg-card/50">
            <div className="mx-auto max-w-screen-2xl px-4 py-6">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent">
                            <Wrench className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">Devpouch</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            About
                        </Link>
                        <Link href="/changelog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Changelog
                        </Link>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        All processing is client-side. Your data never leaves the browser.
                    </p>
                </div>
            </div>
        </footer>
    );
}
