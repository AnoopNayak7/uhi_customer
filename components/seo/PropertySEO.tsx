"use client";

interface PropertySEOProps {
  property: any;
}

export const PropertySEO = ({ property }: PropertySEOProps) => {
  if (!property) return null;

  // This component is now just a placeholder since we're using Next.js metadata
  // The actual SEO is handled by the generateMetadata function in the page.tsx
  return null;
};
