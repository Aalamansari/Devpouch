/**
 * Renders JSON-LD structured data as a script tag.
 * Data is a build-time constant from source code, not user input — safe to serialize.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const serialized = JSON.stringify(data);
  return (
    <script
      type="application/ld+json"
      // Safe: data is a hardcoded build-time constant, never user input
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
