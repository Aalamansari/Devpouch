// SQL formatting using sql-formatter
// All processing is client-side

import { format as sqlFormat } from "sql-formatter";
import type { SqlLanguage, KeywordCase, IndentStyle } from "sql-formatter";

export interface SqlError {
    message: string;
}

export interface SqlResult {
    success: boolean;
    output: string;
    error?: SqlError;
}

export interface SqlFormatOptions {
    dialect?: SqlLanguage;
    indent?: number;
    keywordCase?: KeywordCase;
    useTabs?: boolean;
}

const dialectMap: Record<string, SqlLanguage> = {
    mysql: "mysql",
    postgresql: "postgresql",
    tsql: "transactsql",
    oracle: "plsql",
    sqlite: "sqlite",
    db2: "db2",
    standard: "sql",
};

export function formatSql(input: string, options: SqlFormatOptions = {}): SqlResult {
    const {
        dialect = "sql" as SqlLanguage,
        indent = 2,
        keywordCase = "upper" as KeywordCase,
        useTabs = false,
    } = options;

    try {
        const output = sqlFormat(input, {
            language: dialectMap[dialect] || dialect,
            tabWidth: indent,
            useTabs,
            keywordCase,
            linesBetweenQueries: 2,
        });
        return { success: true, output };
    } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : "Failed to format SQL";
        return {
            success: false,
            output: input,
            error: { message: errorMsg },
        };
    }
}

export function minifySql(input: string): SqlResult {
    try {
        // Remove comments, collapse whitespace
        const output = input
            .replace(/--.*$/gm, "") // Remove single-line comments
            .replace(/\/\*[\s\S]*?\*\//g, "") // Remove multi-line comments
            .replace(/\s+/g, " ") // Collapse whitespace
            .trim();
        return { success: true, output };
    } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : "Failed to minify SQL";
        return {
            success: false,
            output: input,
            error: { message: errorMsg },
        };
    }
}

export const SQL_DIALECTS = [
    { value: "sql", label: "Standard SQL" },
    { value: "mysql", label: "MySQL" },
    { value: "postgresql", label: "PostgreSQL" },
    { value: "tsql", label: "SQL Server (T-SQL)" },
    { value: "oracle", label: "Oracle (PL/SQL)" },
    { value: "sqlite", label: "SQLite" },
    { value: "db2", label: "DB2" },
];

export const KEYWORD_CASES: { value: KeywordCase; label: string }[] = [
    { value: "upper", label: "UPPERCASE" },
    { value: "lower", label: "lowercase" },
    { value: "preserve", label: "Preserve" },
];
