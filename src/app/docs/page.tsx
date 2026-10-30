import { docs } from "@/lib/collection-routes";

export const metadata = docs.listMetadata;

export default function Page() {
  return <docs.ListPage />;
}
