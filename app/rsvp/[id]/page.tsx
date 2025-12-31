import { fetchInviteById } from "../../lib/rsvp-server";
import GuestRSVPClient from "../../components/GuestRSVPClient";

type Guest = {
  guest_id: string;
  given_name: string;
  family_name: string;
  rsvp_status: string | null;
  is_adult: boolean;
  seat_requested: boolean;
  created_at: Date;
  updated_at: Date;
};

type InviteDetails = {
  invite_id: string;
  household_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  sent_at: Date | null;
  guests: Guest[];
};

export default async function RSVP({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: inviteId } = await params
  const inviteDetails: InviteDetails | null = await fetchInviteById(inviteId);
  console.log(`Invite details for ID ${inviteId}:`, inviteDetails);

  return (
  <main className="d-flex align-items-center" style={{ minHeight: '100vh' }}>
    <div className="container text-center">
      <div className="row">
        <div className="col">
          <h1>You&apos;re invited!</h1>
          <p><strong>Please RSVP by July 12th.</strong></p>
          <h2>{inviteDetails?.household_name}</h2>
          <p>{( inviteDetails?.guests?.length ? inviteDetails.guests.length : "")} {(inviteDetails?.guests?.length === 1 ? "Guest" : "Guests")}</p>
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-8 col-lg-6">
          {/* Client-side interactive RSVP list */}
          <GuestRSVPClient inviteId={inviteDetails?.invite_id ?? ''} initialGuests={inviteDetails?.guests ?? []} />
        </div>
      </div>
    </div>
  </main>
);
}
