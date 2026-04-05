import AdminLayoutBreadcrumbs from "@/app/components/AdminLayoutBreadcrumbs";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div className="container">
        <AdminLayoutBreadcrumbs />
        {children}
      </div>
    </main>
  );
}