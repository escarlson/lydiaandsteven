import Link from "next/link";

type AdminBreadcrumbItem = {
  label: string;
  href?: string;
};

type AdminBreadcrumbsProps = {
  items: AdminBreadcrumbItem[];
};

export default function AdminBreadcrumbs({ items }: AdminBreadcrumbsProps) {
  return (
    <nav aria-label="Admin breadcrumb" className="admin-breadcrumb mb-4">
      <ol className="breadcrumb mb-0">
        {items.map((item, index) => {
          const href = item.href;
          const isCurrentPage = index === items.length - 1 || !href;

          return (
            <li
              key={`${item.label}-${index}`}
              className={`breadcrumb-item${isCurrentPage ? " active" : ""}`}
              aria-current={isCurrentPage ? "page" : undefined}
            >
              {isCurrentPage || !href ? item.label : <Link href={href}>{item.label}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}