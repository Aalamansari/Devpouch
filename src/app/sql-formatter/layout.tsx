import type { Metadata } from "next";

const SITE_URL = "https://www.devpouch.space";

export const metadata: Metadata = {
    title: "SQL Formatter Online — Free SQL Beautifier & Query Formatter",
    description:
        "Format and beautify SQL queries online for free. Supports MySQL, PostgreSQL, T-SQL, Oracle, SQLite, and more. Keyword casing and indentation options. 100% client-side.",
    keywords: [
        "sql formatter", "sql formatter online", "sql beautifier", "sql pretty print",
        "format sql online", "sql query formatter", "sql minifier",
        "mysql formatter", "postgresql formatter", "tsql formatter",
        "oracle sql formatter", "sqlite formatter", "free sql formatter",
        "online sql tool", "sql indent",
    ],
    alternates: {
        canonical: `${SITE_URL}/sql-formatter`,
    },
    openGraph: {
        title: "SQL Formatter Online — Free SQL Beautifier | Devpouch",
        description:
            "Format and beautify SQL queries with multi-dialect support instantly in your browser. Free and private.",
        url: `${SITE_URL}/sql-formatter`,
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "SQL Formatter Online | Devpouch",
        description:
            "Free online SQL formatter with MySQL, PostgreSQL, T-SQL, Oracle, and SQLite support.",
    },
};

export default function SqlFormatterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
