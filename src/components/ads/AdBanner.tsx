"use client";

interface AdBannerProps {
    slot?: string;
    format?: "horizontal" | "rectangle" | "vertical";
    className?: string;
}

export function AdBanner({ slot, format = "horizontal", className = "" }: AdBannerProps) {
    const isProduction = process.env.NODE_ENV === "production";

    // In development, show a placeholder
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

    // In production, render actual Google AdSense
    return (
        <div className={`ad-container ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || ""}
                data-ad-slot={slot || ""}
                data-ad-format={format === "horizontal" ? "horizontal" : format === "rectangle" ? "rectangle" : "vertical"}
                data-full-width-responsive="true"
            />
        </div>
    );
}
