import ServicePage, { serviceMetadata } from "@/lib/service-page";

const SLUG = "estate-cleanouts";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
