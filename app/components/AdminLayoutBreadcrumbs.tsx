"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import AdminBreadcrumbs from "@/app/components/AdminBreadcrumbs";

const segmentLabelMap: Record<string, string> = {
  create: "Create Invitations",
  report: "Invitations Report",
  map: "RSVP Map",
};

const formatSegmentLabel = (segment: string) =>
  segment
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function AdminLayoutBreadcrumbs() {
  const segments = useSelectedLayoutSegments();

  if (segments.length === 0) {
    return <AdminBreadcrumbs items={[{ label: "Admin Dashboard" }]} />;
  }

  if (segments[0] === "rsvp") {
    const currentSegment = segments[1];

    if (!currentSegment) {
      return <AdminBreadcrumbs items={[{ label: "Admin Dashboard" }]} />;
    }

    if (!["create", "report", "map"].includes(currentSegment)) {
      return (
        <AdminBreadcrumbs
          items={[
            { label: "Admin Dashboard", href: "/admin" },
            { label: "Invitations Report", href: "/admin/rsvp/report" },
            { label: "Edit Invitation" },
          ]}
        />
      );
    }

    return (
      <AdminBreadcrumbs
        items={[
          { label: "Admin Dashboard", href: "/admin" },
          { label: segmentLabelMap[currentSegment] },
        ]}
      />
    );
  }

  return (
    <AdminBreadcrumbs
      items={[
        { label: "Admin Dashboard", href: "/admin" },
        { label: formatSegmentLabel(segments[segments.length - 1]) },
      ]}
    />
  );
}