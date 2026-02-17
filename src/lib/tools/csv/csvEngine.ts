// CSV/JSON bidirectional conversion using PapaParse
// All processing is client-side

import Papa from "papaparse";

export interface CsvError {
    message: string;
    row?: number;
}

export interface CsvResult {
    success: boolean;
    output: string;
    error?: CsvError;
    preview?: Array<Record<string, string>>;
    rowCount?: number;
    columnCount?: number;
}

export interface CsvToJsonOptions {
    delimiter?: string;
    hasHeader?: boolean;
    outputFormat?: "objects" | "arrays";
    indent?: number;
}

export interface JsonToCsvOptions {
    delimiter?: string;
    includeHeader?: boolean;
}

export function csvToJson(input: string, options: CsvToJsonOptions = {}): CsvResult {
    const {
        delimiter = ",",
        hasHeader = true,
        outputFormat = "objects",
        indent = 2,
    } = options;

    try {
        const result = Papa.parse(input, {
            delimiter: delimiter === "auto" ? undefined : delimiter,
            header: hasHeader && outputFormat === "objects",
            skipEmptyLines: true,
            dynamicTyping: true,
        });

        if (result.errors.length > 0) {
            const firstError = result.errors[0];
            return {
                success: false,
                output: input,
                error: {
                    message: firstError.message,
                    row: firstError.row,
                },
            };
        }

        const output = JSON.stringify(result.data, null, indent);
        const preview = hasHeader && outputFormat === "objects"
            ? (result.data as Array<Record<string, string>>).slice(0, 10)
            : undefined;

        return {
            success: true,
            output,
            preview,
            rowCount: result.data.length,
            columnCount: hasHeader && result.meta.fields ? result.meta.fields.length : (Array.isArray(result.data[0]) ? (result.data[0] as unknown[]).length : 0),
        };
    } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : "Failed to parse CSV";
        return {
            success: false,
            output: input,
            error: { message: errorMsg },
        };
    }
}

export function jsonToCsv(input: string, options: JsonToCsvOptions = {}): CsvResult {
    const { delimiter = ",", includeHeader = true } = options;

    try {
        const parsed = JSON.parse(input);

        if (!Array.isArray(parsed)) {
            return {
                success: false,
                output: input,
                error: { message: "Input must be a JSON array" },
            };
        }

        const output = Papa.unparse(parsed, {
            delimiter,
            header: includeHeader,
        });

        return {
            success: true,
            output,
            rowCount: parsed.length,
        };
    } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : "Failed to convert JSON to CSV";
        return {
            success: false,
            output: input,
            error: { message: errorMsg },
        };
    }
}
