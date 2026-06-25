import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  try {
    const session = await auth();
    redirect(session?.user ? "/clients" : "/login");
  } catch {
    redirect("/login");
  }
}
