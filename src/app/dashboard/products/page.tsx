import { redirect } from "next/navigation";

/** Product management UI lives on `/dashboard`; keep this route valid for sidebar/links. */
export default function DashboardProductsPage() {
  redirect("/dashboard");
}
