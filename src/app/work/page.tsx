import { work } from "@/lib/collection-routes";

export const metadata = work.listMetadata;

export default function Page() {
  return <work.ListPage />;
}
