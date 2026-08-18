/**
 * Renders a JSON-LD block. `<` is escaped to < so a stray character in any string
 * cannot break out of the script element.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
