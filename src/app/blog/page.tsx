import { blog } from "@/lib/collection-routes";

export const metadata = blog.listMetadata;

export default function Page() {
  return <blog.ListPage />;
}
