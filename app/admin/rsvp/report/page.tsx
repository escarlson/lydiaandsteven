import InvitationsSummary from "@/app/components/InvitationsSummary";
import InvitationsTable from "../../../components/InvitationsTable";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import Link from "next/link";

export default function InvitationsReport() {
  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-1">
        <h1 className="mb-0">Invitations and Guests</h1>
        <Link href="/admin/rsvp/create" className="btn btn-sm btn-outline-midnight">
          Create Invitation
        </Link>
      </div>
      <h2>Summary</h2>
      <ErrorBoundary>
        <InvitationsSummary />
      </ErrorBoundary>
      <h2 className="mt-3">Details</h2>
      <ErrorBoundary>
        <InvitationsTable />
      </ErrorBoundary>
    </>
  );
}