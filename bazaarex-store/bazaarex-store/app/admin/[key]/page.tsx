import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { isAdminAuthed, isAdminConfigured, safeEqual } from "@/lib/admin-auth";
import { isSupabaseConfigured, listProductsFresh } from "@/lib/catalog";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Store admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;

  // A wrong key looks exactly like any other missing page.
  if (!isAdminConfigured() || !safeEqual(key, process.env.ADMIN_PATH ?? "")) notFound();

  if (!(await isAdminAuthed())) return <AdminLogin adminKey={key} />;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const configured = isSupabaseConfigured() && Boolean(supabaseAnonKey);

  let products: Product[] = [];
  let setupError: string | null = null;
  if (configured) {
    try {
      products = await listProductsFresh();
    } catch (error) {
      setupError = error instanceof Error ? error.message : "Could not read the products table.";
    }
  }

  return (
    <AdminDashboard
      initialProducts={products}
      configured={configured}
      setupError={setupError}
      supabaseUrl={supabaseUrl}
      supabaseAnonKey={supabaseAnonKey}
    />
  );
}
