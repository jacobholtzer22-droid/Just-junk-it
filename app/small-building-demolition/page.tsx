import ServicePage, { serviceMetadata } from "@/lib/service-page";

const SLUG = "small-building-demolition";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
