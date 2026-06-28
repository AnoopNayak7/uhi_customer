import type { PropertySeoRecord } from "@/lib/property-seo";
import { buildPropertyStructuredData } from "@/lib/property-seo";

interface PropertyStructuredDataProps {
  property: PropertySeoRecord;
  slug?: string;
}

export function PropertyStructuredData({
  property,
  slug,
}: PropertyStructuredDataProps) {
  const schemas = buildPropertyStructuredData(property, slug);

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
