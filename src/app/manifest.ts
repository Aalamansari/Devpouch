import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Devpouch — Developer Formatting Tools",
        short_name: "Devpouch",
        description:
            "Free online developer tools to format, validate, and convert JSON, XML, YAML, CSV, and SQL.",
        start_url: "/",
        display: "standalone",
        background_color: "#0b0f1a",
        theme_color: "#6366f1",
        categories: ["developer", "productivity", "utilities"],
    };
}
