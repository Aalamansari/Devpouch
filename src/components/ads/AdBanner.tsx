"use client";

import { useEffect } from "react";

interface AdBannerProps {
    className?: string;
}

export function AdBanner({ className = "" }: AdBannerProps) {
    const isProduction = process.env.NODE_ENV === "production";

    useEffect(() => {
        if (!isProduction) return;
        try {
            (
                (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle =
                    (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || []
            ).push({});
        } catch {
            // ignore duplicate push errors
        }
    }, [isProduction]);

    if (!isProduction) {
        return (
            <div className={`ad-container ${className}`}>
                <div className="flex flex-col items-center gap-1 py-4 text-muted-foreground">
                    <span className="text-[10px] font-medium uppercase tracking-widest opacity-50">
                        Advertisement
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className={`ad-container ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-6847588376023576"
                data-ad-slot="4229592148"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
