import ServicePage, { serviceMetadata } from "@/lib/service-page";

const SLUG = "hot-tub-and-shed-removal";

export const metadata = serviceMetadata(SLUG);

export default function Page() {
  return <ServicePage slug={SLUG} />;
}
