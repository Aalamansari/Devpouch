// XML formatting and validation using fast-xml-parser
// All processing is client-side

import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

export interface XmlError {
    message: string;
    line?: number;
    column?: number;
}

export interface XmlResult {
    success: boolean;
    output: string;
    error?: XmlError;
}

const parserOptions = {
    ignoreAttributes: false,
    preserveOrder: true,
    trimValues: false,
    cdataPropName: "__cdata",
    commentPropName: "__comment",
    parseAttributeValue: false,
    parseTagValue: false,
};

export function formatXml(input: string, indent: number = 2): XmlResult {
    // First validate
    const validation = XMLValidator.validate(input);
    if (validation !== true) {
        return {
            success: false,
            output: input,
            error: {
                message: validation.err?.msg || "Invalid XML",
                line: validation.err?.line,
                column: validation.err?.col,
            },
        };
    }

    try {
        const parser = new XMLParser(parserOptions);
        const parsed = parser.parse(input);
        const builder = new XMLBuilder({
            ...parserOptions,
            format: true,
            indentBy: " ".repeat(indent),
            suppressEmptyNode: false,
        });
        const raw = builder.build(parsed);
        // fast-xml-parser with preserveOrder inserts spurious blank lines; strip them all
        const output = raw
            .split("\n")
            .filter((line: string) => line.trim() !== "")
            .join("\n")
            .trim();
        return { success: true, output };
    } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : "Failed to format XML";
        return {
            success: false,
            output: input,
            error: { message: errorMsg },
        };
    }
}

export function validateXml(input: string): XmlResult {
    const result = XMLValidator.validate(input);
    if (result === true) {
        return { success: true, output: "✓ Valid XML" };
    }
    return {
        success: false,
        output: "",
        error: {
            message: result.err?.msg || "Invalid XML",
            line: result.err?.line,
            column: result.err?.col,
        },
    };
}

export function xmlToJson(input: string, indent: number = 2): XmlResult {
    try {
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            parseTagValue: true,
            trimValues: true,
        });
        const parsed = parser.parse(input);
        return {
            success: true,
            output: JSON.stringify(parsed, null, indent),
        };
    } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : "Failed to convert XML to JSON";
        return {
            success: false,
            output: input,
            error: { message: errorMsg },
        };
    }
}
