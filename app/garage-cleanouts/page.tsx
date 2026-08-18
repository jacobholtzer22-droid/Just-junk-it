import ServicePage, { serviceMetadata } from "@/lib/service-page";

const SLUG = "garage-cleanouts";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
