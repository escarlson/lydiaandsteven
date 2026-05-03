import { fetchInviteById } from "../../lib/rsvp-server";
import RSVPPageClient from "./RSVPPageClient";

type Guest = {
  guest_id: string;
  title?: string | null;
  given_name: string;
  family_name: string;
  rsvp_status: string | null;
  is_adult: boolean;
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
  rsvp_deadline: Date | null;
};

export default async function RSVP({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: inviteId } = await params;
  
  let inviteDetails: InviteDetails | null = null;
  let error: string | null = null;

  try {
    inviteDetails = await fetchInviteById(inviteId);
    console.log(`Invite details for ID ${inviteId}:`, inviteDetails);
  } catch (err) {
    console.error(`Error fetching invite ${inviteId}:`, err);
    error = 'Failed to load invitation details';
  }

  return (
  <main className="d-flex align-items-center" style={{ minHeight: '100vh' }}>
    <div className="container text-center">
      {error ? (
        <div className="alert alert-danger">
          <p>{error}</p>
        </div>
      ) : (
        <RSVPPageClient inviteDetails={inviteDetails} />
      )}
    </div>
  </main>
);
}
