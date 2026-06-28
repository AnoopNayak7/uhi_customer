import type { Metadata } from "next";
import {
  buildPropertyMetadata,
  fetchPropertyForSeo,
} from "@/lib/property-seo";
import { PropertyStructuredData } from "@/components/seo/PropertyStructuredData";

export const revalidate = 3600;

type LayoutProps = {
  children: React.ReactNode;
  params: { id: string };
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const property = await fetchPropertyForSeo(params.id);
  return buildPropertyMetadata(property, params.id);
}

export default async function PropertyDetailLayout({
  children,
  params,
}: LayoutProps) {
  const property = await fetchPropertyForSeo(params.id);

  return (
    <>
      {property ? (
        <PropertyStructuredData property={property} slug={params.id} />
      ) : null}
      {children}
    </>
  );
}
