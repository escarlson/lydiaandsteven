import { fetchInviteById } from "../../lib/rsvp-server";

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
// Function to handle form submission and send RSVP details to the server
/* async function handleRSVPFormSubmit(event) {
  event.preventDefault();
  const invitationId = event.target.invitationId.value;
  const rsvpDetails = {
    // Collect RSVP details from the form fields
  };
  const response = await fetch(`/api/rsvp/${invitationId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rsvpDetails),
  });
  if (response.ok) {
    // Handle successful RSVP submission
  } else {
    // Handle RSVP submission error
  }
 */
  return (
  <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
    <div className="container text-center">
      <div className="row">
        <div className="col">
          <h1>Invitation found!</h1>
          <h2>{inviteDetails?.household_name} <span className="badge text-bg-primary">{( inviteDetails?.guests?.length ? inviteDetails.guests.length : "")} {(inviteDetails?.guests?.length === 1 ? "Guest" : "Guests")}</span></h2>
          <h3>Guests:</h3>
          <ul className="list-unstyled">
            {inviteDetails?.guests.map((guest) => (
              <li key={guest.guest_id}>
                {guest.given_name} {guest.family_name}
              </li>
            ))}
          </ul>
          <p><strong>Please RSVP by July 12th.</strong></p>
        </div>
      </div>
    </div>
  </main>
);
}
