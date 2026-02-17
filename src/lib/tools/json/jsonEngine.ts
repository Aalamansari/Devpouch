// JSON formatting, validation, and utility functions
// All processing is client-side

export interface JsonError {
    message: string;
    line?: number;
    column?: number;
}

export interface JsonResult {
    success: boolean;
    output: string;
    error?: JsonError;
    stats?: {
        keys: number;
        depth: number;
        size: number;
    };
}

export function formatJson(input: string, indent: number = 2): JsonResult {
    try {
        const parsed = JSON.parse(input);
        const output = JSON.stringify(parsed, null, indent);
        return {
            success: true,
            output,
            stats: getJsonStats(parsed),
        };
    } catch (e) {
        return {
            success: false,
            output: input,
            error: parseJsonError(e as SyntaxError, input),
        };
    }
}

export function minifyJson(input: string): JsonResult {
    try {
        const parsed = JSON.parse(input);
        const output = JSON.stringify(parsed);
        return { success: true, output };
    } catch (e) {
        return {
            success: false,
            output: input,
            error: parseJsonError(e as SyntaxError, input),
        };
    }
}

export function validateJson(input: string): JsonResult {
    try {
        JSON.parse(input);
        return { success: true, output: "✓ Valid JSON" };
    } catch (e) {
        return {
            success: false,
            output: "",
            error: parseJsonError(e as SyntaxError, input),
        };
    }
}

function parseJsonError(e: SyntaxError, input: string): JsonError {
    const match = e.message.match(/position (\d+)/);
    if (match) {
        const pos = parseInt(match[1], 10);
        const lines = input.substring(0, pos).split("\n");
        return {
            message: e.message,
            line: lines.length,
            column: lines[lines.length - 1].length + 1,
        };
    }
    return { message: e.message };
}

function getJsonStats(obj: unknown, depth = 0): { keys: number; depth: number; size: number } {
    if (obj === null || typeof obj !== "object") {
        return { keys: 0, depth, size: 0 };
    }
    const entries = Array.isArray(obj) ? obj : Object.values(obj);
    let totalKeys = Array.isArray(obj) ? obj.length : Object.keys(obj).length;
    let maxDepth = depth;
    for (const val of entries) {
        if (val && typeof val === "object") {
            const childStats = getJsonStats(val, depth + 1);
            totalKeys += childStats.keys;
            maxDepth = Math.max(maxDepth, childStats.depth);
        }
    }
    return { keys: totalKeys, depth: maxDepth, size: JSON.stringify(obj).length };
}

export interface TreeNode {
    key: string;
    value: unknown;
    type: "object" | "array" | "string" | "number" | "boolean" | "null";
    path: string;
    children?: TreeNode[];
}

export function buildJsonTree(input: string): TreeNode | null {
    try {
        const parsed = JSON.parse(input);
        return buildNode("root", parsed, "$");
    } catch {
        return null;
    }
}

function buildNode(key: string, value: unknown, path: string): TreeNode {
    if (value === null) {
        return { key, value, type: "null", path };
    }
    if (Array.isArray(value)) {
        return {
            key,
            value,
            type: "array",
            path,
            children: value.map((item, i) => buildNode(`[${i}]`, item, `${path}[${i}]`)),
        };
    }
    if (typeof value === "object") {
        return {
            key,
            value,
            type: "object",
            path,
            children: Object.entries(value as Record<string, unknown>).map(([k, v]) =>
                buildNode(k, v, `${path}.${k}`)
            ),
        };
    }
    return {
        key,
        value,
        type: typeof value as "string" | "number" | "boolean",
        path,
    };
}
