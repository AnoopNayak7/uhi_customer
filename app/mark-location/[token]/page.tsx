import { MarkLocationPageClient } from "./MarkLocationPageClient";

export const dynamic = "force-dynamic";

export default function MarkLocationPage({
  params,
}: {
  params: { token: string };
}) {
  return <MarkLocationPageClient token={params.token} />;
}
