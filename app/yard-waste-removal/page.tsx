import ServicePage, { serviceMetadata } from "@/lib/service-page";

const SLUG = "yard-waste-removal";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
