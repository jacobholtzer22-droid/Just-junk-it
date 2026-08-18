import ServicePage, { serviceMetadata } from "@/lib/service-page";

const SLUG = "appliance-removal";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
