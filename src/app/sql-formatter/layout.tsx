import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "SQL Formatter",
    description:
        "Format and beautify SQL queries with multi-dialect support (MySQL, PostgreSQL, T-SQL, Oracle, SQLite). Client-side processing.",
};

export default function SqlFormatterLayout({ children }: { children: React.ReactNode }) {
    return children;
}
