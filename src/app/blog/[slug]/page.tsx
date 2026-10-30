import { blog } from "@/lib/collection-routes";

export const generateStaticParams = blog.generateStaticParams;
export const generateMetadata = blog.generateMetadata;
export default blog.EntryRoute;
