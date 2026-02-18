"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

type Language = "json" | "xml";

interface CodeViewerProps {
    content: string;
    language: Language;
    error?: boolean;
}

// Token types for syntax highlighting
type TokenType =
    | "key"
    | "string"
    | "number"
    | "boolean"
    | "null"
    | "bracket"
    | "punctuation"
    | "tag"
    | "attr-name"
    | "attr-value"
    | "text"
    | "declaration"
    | "comment";

interface Token {
    type: TokenType;
    value: string;
}

interface Line {
    tokens: Token[];
    indent: number;
    // For collapsing: if this line starts a block, blockEnd is the line index of the closing line
    blockEnd?: number;
    // The bracket/tag char that opens a block
    blockOpen?: string;
}

// Color mapping for token types (uses CSS classes for theme support)
const tokenClasses: Record<TokenType, string> = {
    key: "text-[var(--syntax-key)]",
    string: "text-[var(--syntax-string)]",
    number: "text-[var(--syntax-number)]",
    boolean: "text-[var(--syntax-boolean)]",
    null: "text-[var(--syntax-null)]",
    bracket: "cursor-pointer hover:opacity-80",
    punctuation: "text-[var(--syntax-punctuation)]",
    tag: "text-[var(--syntax-tag)]",
    "attr-name": "text-[var(--syntax-attr-name)]",
    "attr-value": "text-[var(--syntax-attr-value)]",
    text: "",
    declaration: "text-[var(--syntax-comment)]",
    comment: "text-[var(--syntax-comment)]",
};

// ---- JSON Tokenizer ----
function tokenizeJsonLine(line: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < line.length) {
        // Whitespace
        if (/\s/.test(line[i])) {
            let ws = "";
            while (i < line.length && /\s/.test(line[i])) ws += line[i++];
            tokens.push({ type: "text", value: ws });
            continue;
        }

        // Brackets
        if ("{[}]".includes(line[i])) {
            tokens.push({ type: "bracket", value: line[i] });
            i++;
            continue;
        }

        // String (key or value)
        if (line[i] === '"') {
            let str = '"';
            i++;
            while (i < line.length && line[i] !== '"') {
                if (line[i] === '\\') {
                    str += line[i++];
                    if (i < line.length) str += line[i++];
                } else {
                    str += line[i++];
                }
            }
            if (i < line.length) str += line[i++]; // closing quote

            // Determine if this is a key (followed by colon) or a string value
            let restIdx = i;
            while (restIdx < line.length && /\s/.test(line[restIdx])) restIdx++;
            const isKey = restIdx < line.length && line[restIdx] === ":";
            tokens.push({ type: isKey ? "key" : "string", value: str });
            continue;
        }

        // Colon
        if (line[i] === ":") {
            tokens.push({ type: "punctuation", value: ":" });
            i++;
            // Consume optional space after colon
            if (i < line.length && line[i] === " ") {
                tokens.push({ type: "text", value: " " });
                i++;
            }
            continue;
        }

        // Comma
        if (line[i] === ",") {
            tokens.push({ type: "punctuation", value: "," });
            i++;
            continue;
        }

        // Number
        if (/[-\d]/.test(line[i])) {
            let num = "";
            while (i < line.length && /[-\d.eE+]/.test(line[i])) num += line[i++];
            tokens.push({ type: "number", value: num });
            continue;
        }

        // Boolean / null
        const rest = line.slice(i);
        if (rest.startsWith("true")) {
            tokens.push({ type: "boolean", value: "true" });
            i += 4;
            continue;
        }
        if (rest.startsWith("false")) {
            tokens.push({ type: "boolean", value: "false" });
            i += 5;
            continue;
        }
        if (rest.startsWith("null")) {
            tokens.push({ type: "null", value: "null" });
            i += 4;
            continue;
        }

        // Fallback
        tokens.push({ type: "text", value: line[i] });
        i++;
    }

    return tokens;
}

// ---- XML Tokenizer ----
function tokenizeXmlLine(line: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < line.length) {
        // XML declaration or processing instruction
        if (line[i] === "<" && i + 1 < line.length && line[i + 1] === "?") {
            let decl = "";
            while (i < line.length && !(decl.endsWith("?>"))) decl += line[i++];
            tokens.push({ type: "declaration", value: decl });
            continue;
        }

        // Comment
        if (line.slice(i, i + 4) === "<!--") {
            let comment = "";
            while (i < line.length && !comment.endsWith("-->")) comment += line[i++];
            tokens.push({ type: "comment", value: comment });
            continue;
        }

        // Tag (opening, closing, or self-closing)
        if (line[i] === "<") {
            // Opening bracket
            tokens.push({ type: "bracket", value: "<" });
            i++;

            // Slash for closing tag
            if (i < line.length && line[i] === "/") {
                tokens.push({ type: "bracket", value: "/" });
                i++;
            }

            // Tag name
            let tagName = "";
            while (i < line.length && /[a-zA-Z0-9_:\-.]/.test(line[i])) tagName += line[i++];
            if (tagName) tokens.push({ type: "tag", value: tagName });

            // Attributes and closing
            while (i < line.length && line[i] !== ">") {
                // Whitespace
                if (/\s/.test(line[i])) {
                    let ws = "";
                    while (i < line.length && /\s/.test(line[i])) ws += line[i++];
                    tokens.push({ type: "text", value: ws });
                    continue;
                }

                // Self-closing slash
                if (line[i] === "/" && i + 1 < line.length && line[i + 1] === ">") {
                    tokens.push({ type: "bracket", value: "/>" });
                    i += 2;
                    break;
                }

                // Attribute name
                if (/[a-zA-Z_]/.test(line[i])) {
                    let attr = "";
                    while (i < line.length && /[a-zA-Z0-9_:\-.]/.test(line[i])) attr += line[i++];
                    tokens.push({ type: "attr-name", value: attr });
                    continue;
                }

                // Equals sign
                if (line[i] === "=") {
                    tokens.push({ type: "punctuation", value: "=" });
                    i++;
                    continue;
                }

                // Attribute value
                if (line[i] === '"' || line[i] === "'") {
                    const quote = line[i];
                    let val = quote;
                    i++;
                    while (i < line.length && line[i] !== quote) val += line[i++];
                    if (i < line.length) val += line[i++]; // closing quote
                    tokens.push({ type: "attr-value", value: val });
                    continue;
                }

                tokens.push({ type: "text", value: line[i] });
                i++;
            }

            // Closing bracket
            if (i < line.length && line[i] === ">") {
                tokens.push({ type: "bracket", value: ">" });
                i++;
            }
            continue;
        }

        // Text content between tags
        let text = "";
        while (i < line.length && line[i] !== "<") text += line[i++];
        if (text) tokens.push({ type: "string", value: text });
    }

    return tokens;
}

// ---- Block matching for collapsing ----
function findJsonBlocks(lines: string[]): Map<number, number> {
    const blocks = new Map<number, number>();
    const stack: { char: string; line: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const ch of line) {
            if (ch === "{" || ch === "[") {
                stack.push({ char: ch, line: i });
            } else if (ch === "}" || ch === "]") {
                const open = stack.pop();
                if (open && open.line !== i) {
                    // Multi-line block
                    blocks.set(open.line, i);
                }
            }
        }
    }
    return blocks;
}

function findXmlBlocks(lines: string[]): Map<number, number> {
    const blocks = new Map<number, number>();
    const stack: { tag: string; line: number }[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Opening tags (not self-closing, not closing)
        const openMatch = line.match(/^<([a-zA-Z][a-zA-Z0-9_:\-.]*)/);
        if (openMatch && !line.includes("/>") && !line.startsWith("</") && !line.startsWith("<?") && !line.startsWith("<!--")) {
            // Check if this line also has the closing tag for the same element
            const tagName = openMatch[1];
            if (!line.includes(`</${tagName}>`)) {
                stack.push({ tag: tagName, line: i });
            }
        }

        // Closing tags
        const closeMatch = line.match(/^<\/([a-zA-Z][a-zA-Z0-9_:\-.]*)\s*>/);
        if (closeMatch) {
            const tagName = closeMatch[1];
            // Find the matching opening tag on the stack
            for (let j = stack.length - 1; j >= 0; j--) {
                if (stack[j].tag === tagName) {
                    const open = stack.splice(j, 1)[0];
                    if (open.line !== i) {
                        blocks.set(open.line, i);
                    }
                    break;
                }
            }
        }
    }
    return blocks;
}

// ---- Bracket matching ----
function findMatchingBracket(lines: string[], lineIdx: number, charIdx: number): { line: number; char: number } | null {
    const line = lines[lineIdx];
    if (!line) return null;
    const ch = line[charIdx];
    if (!ch) return null;

    const pairs: Record<string, string> = { "{": "}", "[": "]", "(": ")", "}": "{", "]": "[", ")": "(" };
    const match = pairs[ch];
    if (!match) return null;

    const isOpening = "{[(".includes(ch);
    let depth = 0;

    if (isOpening) {
        // Search forward
        for (let li = lineIdx; li < lines.length; li++) {
            const startCi = li === lineIdx ? charIdx : 0;
            for (let ci = startCi; ci < lines[li].length; ci++) {
                if (lines[li][ci] === ch) depth++;
                if (lines[li][ci] === match) {
                    depth--;
                    if (depth === 0) return { line: li, char: ci };
                }
            }
        }
    } else {
        // Search backward
        for (let li = lineIdx; li >= 0; li--) {
            const startCi = li === lineIdx ? charIdx : lines[li].length - 1;
            for (let ci = startCi; ci >= 0; ci--) {
                if (lines[li][ci] === ch) depth++;
                if (lines[li][ci] === match) {
                    depth--;
                    if (depth === 0) return { line: li, char: ci };
                }
            }
        }
    }

    return null;
}

// ---- Collapsed placeholder ----
function getCollapsedPreview(lines: string[], start: number, end: number, language: Language): string {
    if (language === "json") {
        const line = lines[start].trimEnd();
        const openChar = line.includes("{") ? "{" : "[";
        const closeChar = openChar === "{" ? "}" : "]";
        const itemCount = end - start - 1;
        return `${openChar} ... ${closeChar}  // ${itemCount} lines`;
    } else {
        const match = lines[start].trim().match(/^<([a-zA-Z][a-zA-Z0-9_:\-.]*)/);
        const tagName = match ? match[1] : "element";
        const lineCount = end - start - 1;
        return `<${tagName}> ... </${tagName}>  <!-- ${lineCount} lines -->`;
    }
}

export function CodeViewer({ content, language, error }: CodeViewerProps) {
    const [collapsedBlocks, setCollapsedBlocks] = useState<Set<number>>(new Set());
    const [highlightedBracket, setHighlightedBracket] = useState<{
        open: { line: number; char: number };
        close: { line: number; char: number };
    } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const rawLines = useMemo(() => content.split("\n"), [content]);

    const blocks = useMemo(() => {
        if (language === "json") return findJsonBlocks(rawLines);
        return findXmlBlocks(rawLines);
    }, [rawLines, language]);

    const tokenizedLines = useMemo(() => {
        const tokenize = language === "json" ? tokenizeJsonLine : tokenizeXmlLine;
        return rawLines.map((line) => tokenize(line));
    }, [rawLines, language]);

    // Reset state when content changes
    useEffect(() => {
        setCollapsedBlocks(new Set());
        setHighlightedBracket(null);
    }, [content]);

    const toggleCollapse = useCallback((lineIdx: number) => {
        setCollapsedBlocks((prev) => {
            const next = new Set(prev);
            if (next.has(lineIdx)) next.delete(lineIdx);
            else next.add(lineIdx);
            return next;
        });
    }, []);

    const handleBracketClick = useCallback((lineIdx: number, charIdx: number) => {
        const match = findMatchingBracket(rawLines, lineIdx, charIdx);
        if (match) {
            setHighlightedBracket({
                open: { line: lineIdx, char: charIdx },
                close: { line: match.line, char: match.char },
            });
        }
    }, [rawLines]);

    // Clear bracket highlight when clicking elsewhere
    const handleContainerClick = useCallback((e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.dataset.bracketLine) {
            setHighlightedBracket(null);
        }
    }, []);

    // Build visible lines accounting for collapsed blocks
    const visibleLines = useMemo(() => {
        const result: { lineIdx: number; collapsed?: boolean }[] = [];
        let i = 0;
        while (i < rawLines.length) {
            if (collapsedBlocks.has(i) && blocks.has(i)) {
                result.push({ lineIdx: i, collapsed: true });
                i = blocks.get(i)! + 1;
            } else {
                result.push({ lineIdx: i });
                i++;
            }
        }
        return result;
    }, [rawLines, collapsedBlocks, blocks]);

    const isBracketHighlighted = useCallback((lineIdx: number, charIdx: number) => {
        if (!highlightedBracket) return false;
        return (
            (highlightedBracket.open.line === lineIdx && highlightedBracket.open.char === charIdx) ||
            (highlightedBracket.close.line === lineIdx && highlightedBracket.close.char === charIdx)
        );
    }, [highlightedBracket]);

    if (!content) {
        return (
            <div className="flex-1 w-full bg-[var(--editor-bg)] p-4 font-mono text-sm text-muted-foreground/50">
                Formatted output will appear here...
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className={`flex-1 w-full overflow-auto bg-[var(--editor-bg)] font-mono text-sm leading-relaxed ${error ? "text-destructive" : ""}`}
            onClick={handleContainerClick}
        >
            <div className="p-4">
                {visibleLines.map(({ lineIdx, collapsed }) => {
                    const hasBlock = blocks.has(lineIdx);
                    const isCollapsed = collapsed;
                    const lineNum = lineIdx + 1;

                    return (
                        <div key={`${lineIdx}-${isCollapsed}`} className="flex items-start group/line min-h-[1.625rem]">
                            {/* Line number */}
                            <span className="inline-block w-10 shrink-0 text-right pr-4 text-muted-foreground/40 select-none text-xs leading-relaxed">
                                {lineNum}
                            </span>

                            {/* Collapse toggle */}
                            <span className="inline-flex w-5 shrink-0 items-center justify-center select-none">
                                {hasBlock ? (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCollapse(lineIdx);
                                        }}
                                        className="flex items-center justify-center w-4 h-4 rounded hover:bg-muted text-muted-foreground/60 hover:text-foreground transition-colors"
                                        aria-label={isCollapsed ? "Expand" : "Collapse"}
                                    >
                                        {isCollapsed ?
                                            <ChevronRight className="h-3 w-3" /> :
                                            <ChevronDown className="h-3 w-3" />
                                        }
                                    </button>
                                ) : null}
                            </span>

                            {/* Line content */}
                            <span className="flex-1 whitespace-pre">
                                {isCollapsed ? (
                                    <CollapsedLine
                                        preview={getCollapsedPreview(rawLines, lineIdx, blocks.get(lineIdx)!, language)}
                                        language={language}
                                        leadingWhitespace={rawLines[lineIdx].match(/^(\s*)/)?.[1] || ""}
                                    />
                                ) : (
                                    <TokenizedLine
                                        tokens={tokenizedLines[lineIdx]}
                                        lineIdx={lineIdx}
                                        rawLine={rawLines[lineIdx]}
                                        onBracketClick={handleBracketClick}
                                        isBracketHighlighted={isBracketHighlighted}
                                    />
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Render a single collapsed line
function CollapsedLine({ preview, language, leadingWhitespace }: { preview: string; language: Language; leadingWhitespace: string }) {
    return (
        <span className="text-muted-foreground/70 italic">
            {leadingWhitespace}{preview}
        </span>
    );
}

// Render tokens for a single line with bracket click handling
function TokenizedLine({
    tokens,
    lineIdx,
    rawLine,
    onBracketClick,
    isBracketHighlighted,
}: {
    tokens: Token[];
    lineIdx: number;
    rawLine: string;
    onBracketClick: (lineIdx: number, charIdx: number) => void;
    isBracketHighlighted: (lineIdx: number, charIdx: number) => boolean;
}) {
    // Track character index in the original raw line to map brackets
    let charOffset = 0;

    return (
        <>
            {tokens.map((token, ti) => {
                const startChar = charOffset;
                charOffset += token.value.length;

                if (token.type === "bracket" && "{[}]()".includes(token.value) && token.value.length === 1) {
                    const highlighted = isBracketHighlighted(lineIdx, startChar);
                    return (
                        <span
                            key={ti}
                            data-bracket-line={lineIdx}
                            data-bracket-char={startChar}
                            onClick={(e) => {
                                e.stopPropagation();
                                onBracketClick(lineIdx, startChar);
                            }}
                            className={`cursor-pointer font-bold ${highlighted ? "bracket-highlight" : ""}`}
                            style={
                                highlighted
                                    ? {
                                          backgroundColor: "var(--syntax-bracket-match-bg)",
                                          color: "var(--syntax-bracket-match)",
                                          outline: "2px solid var(--syntax-bracket-match)",
                                          outlineOffset: "0px",
                                          borderRadius: "3px",
                                          padding: "1px 3px",
                                      }
                                    : {
                                          color: "var(--syntax-punctuation)",
                                      }
                            }
                        >
                            {token.value}
                        </span>
                    );
                }

                return (
                    <span key={ti} className={tokenClasses[token.type]}>
                        {token.value}
                    </span>
                );
            })}
        </>
    );
}
