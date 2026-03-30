import AdminLayoutBreadcrumbs from "@/app/components/AdminLayoutBreadcrumbs";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="pt-5">
      <div className="container mt-5">
        <AdminLayoutBreadcrumbs />
        {children}
      </div>
    </main>
  );
}