import InvitationsSummary from "@/app/components/InvitationsSummary";
import InvitationsTable from "../../../components/InvitationsTable";
import ErrorBoundary from "@/app/components/ErrorBoundary";

export default function InvitationsReport() {
  return (
    <>
      <h1>Invitations and Guests</h1>
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