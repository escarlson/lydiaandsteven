import InvitationsTable from "../../../components/InvitationsTable";

export default function InvitationsReport() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Invitations and Guests</h1>
          <InvitationsTable />
        </div>
      </main>
    </div>
  );
}