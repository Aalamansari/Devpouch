import { create } from "zustand";

interface ToolState {
    input: string;
    output: string;
    error: string | null;
    processingTime: number | null;
}

type ToolId = "json" | "xml" | "yaml" | "csv" | "sql";

interface AppState {
    // UI state
    theme: "light" | "dark" | "system";
    setTheme: (theme: "light" | "dark" | "system") => void;

    // Per-tool state persistence
    toolStates: Record<ToolId, ToolState>;
    setToolInput: (tool: ToolId, input: string) => void;
    setToolOutput: (tool: ToolId, output: string, error?: string | null, processingTime?: number | null) => void;
    clearTool: (tool: ToolId) => void;
}

const defaultToolState = (input: string): ToolState => ({
    input,
    output: "",
    error: null,
    processingTime: null,
});

// Sample data for each tool — shown on first visit
const SAMPLE_JSON = `{
  "name": "Devpouch",
  "version": "1.0.0",
  "description": "Developer data formatting tools",
  "tools": ["JSON", "XML", "YAML", "CSV", "SQL"],
  "features": {
    "clientSide": true,
    "darkMode": true,
    "responsive": true
  }
}`;

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project>
  <name>Devpouch</name>
  <version>1.0.0</version>
  <description>Developer data formatting tools</description>
  <tools>
    <tool id="1">JSON Formatter</tool>
    <tool id="2">XML Formatter</tool>
    <tool id="3">YAML Validator</tool>
  </tools>
</project>`;

const SAMPLE_YAML = `name: Devpouch
version: "1.0.0"
description: Developer data formatting tools

tools:
  - name: JSON Formatter
    category: formatting
  - name: XML Formatter
    category: formatting
  - name: YAML Validator
    category: validation

config:
  clientSide: true
  darkMode: true
  responsive: true`;

const SAMPLE_CSV = `name,role,department,salary
Alice Johnson,Developer,Engineering,95000
Bob Smith,Designer,Design,85000
Carol Williams,Manager,Engineering,120000
David Brown,Analyst,Data,90000
Eve Davis,DevOps,Infrastructure,105000`;

const SAMPLE_SQL = `SELECT u.id, u.name, u.email, o.order_id, o.total_amount, o.created_at FROM users u INNER JOIN orders o ON u.id = o.user_id LEFT JOIN payments p ON o.order_id = p.order_id WHERE u.status = 'active' AND o.created_at >= '2024-01-01' AND o.total_amount > 100 GROUP BY u.id, u.name, u.email, o.order_id, o.total_amount, o.created_at HAVING COUNT(o.order_id) > 5 ORDER BY o.total_amount DESC LIMIT 50;`;

export const useAppStore = create<AppState>((set) => ({
    theme: "system",
    setTheme: (theme) => set({ theme }),

    toolStates: {
        json: defaultToolState(SAMPLE_JSON),
        xml: defaultToolState(SAMPLE_XML),
        yaml: defaultToolState(SAMPLE_YAML),
        csv: defaultToolState(SAMPLE_CSV),
        sql: defaultToolState(SAMPLE_SQL),
    },

    setToolInput: (tool, input) =>
        set((state) => ({
            toolStates: {
                ...state.toolStates,
                [tool]: { ...state.toolStates[tool], input },
            },
        })),

    setToolOutput: (tool, output, error = null, processingTime = null) =>
        set((state) => ({
            toolStates: {
                ...state.toolStates,
                [tool]: { ...state.toolStates[tool], output, error, processingTime },
            },
        })),

    clearTool: (tool) =>
        set((state) => ({
            toolStates: {
                ...state.toolStates,
                [tool]: { input: "", output: "", error: null, processingTime: null },
            },
        })),
}));

export type { ToolId, ToolState };
