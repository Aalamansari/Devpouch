// YAML validation and conversion using js-yaml
// All processing is client-side

import yaml from "js-yaml";

export interface YamlError {
    message: string;
    line?: number;
    column?: number;
}

export interface YamlResult {
    success: boolean;
    output: string;
    error?: YamlError;
    warnings?: string[];
}

export function validateYaml(input: string): YamlResult {
    const warnings = detectPitfalls(input);
    try {
        yaml.load(input);
        return {
            success: true,
            output: "✓ Valid YAML",
            warnings: warnings.length > 0 ? warnings : undefined,
        };
    } catch (e: unknown) {
        const yamlError = e as yaml.YAMLException;
        return {
            success: false,
            output: "",
            error: {
                message: yamlError.message || "Invalid YAML",
                line: yamlError.mark?.line !== undefined ? yamlError.mark.line + 1 : undefined,
                column: yamlError.mark?.column !== undefined ? yamlError.mark.column + 1 : undefined,
            },
            warnings: warnings.length > 0 ? warnings : undefined,
        };
    }
}

export function yamlToJson(input: string, indent: number = 2): YamlResult {
    try {
        const parsed = yaml.load(input);
        return {
            success: true,
            output: JSON.stringify(parsed, null, indent),
        };
    } catch (e: unknown) {
        const yamlError = e as yaml.YAMLException;
        return {
            success: false,
            output: input,
            error: {
                message: yamlError.message || "Failed to convert YAML to JSON",
                line: yamlError.mark?.line !== undefined ? yamlError.mark.line + 1 : undefined,
                column: yamlError.mark?.column !== undefined ? yamlError.mark.column + 1 : undefined,
            },
        };
    }
}

export function jsonToYaml(input: string): YamlResult {
    try {
        const parsed = JSON.parse(input);
        const output = yaml.dump(parsed, {
            indent: 2,
            lineWidth: 120,
            noRefs: true,
            sortKeys: false,
        });
        return { success: true, output };
    } catch (e: unknown) {
        const errorMsg = e instanceof Error ? e.message : "Failed to convert JSON to YAML";
        return {
            success: false,
            output: input,
            error: { message: errorMsg },
        };
    }
}

function detectPitfalls(input: string): string[] {
    const warnings: string[] = [];
    const lines = input.split("\n");

    lines.forEach((line, i) => {
        // Check for tab characters
        if (line.includes("\t")) {
            warnings.push(`Line ${i + 1}: Tab character detected. YAML requires spaces for indentation.`);
        }

        // Check for Norway problem (unquoted yes/no/on/off)
        const trimmed = line.replace(/#.*$/, "").trim();
        const match = trimmed.match(/:\s+(yes|no|on|off|true|false)\s*$/i);
        if (match) {
            const val = match[1];
            if (["yes", "no", "on", "off"].includes(val.toLowerCase())) {
                warnings.push(
                    `Line ${i + 1}: Unquoted '${val}' will be interpreted as a boolean. Consider quoting it.`
                );
            }
        }
    });

    return warnings;
}
