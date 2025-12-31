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
          <ul className="list-unstyled">
            {inviteDetails?.guests.map((guest) => (
              <li key={guest.guest_id} className="mb-3">
                <div className="row align-items-center">
                  <div className="col-8 col-sm-9 text-start">
                    {guest.given_name} {guest.family_name}
                    <span className={`badge ms-2 ${
                      guest.rsvp_status === 'accepted' ? 'text-bg-success' :
                      guest.rsvp_status === 'declined' ? 'text-bg-danger' :
                      'text-bg-secondary'
                    }`}>
                      {guest.rsvp_status === 'accepted' ? 'Accepted' : guest.rsvp_status === 'declined' ? 'Declined' : 'Pending'}
                    </span>
                  </div>
                  <div className="col-4 col-sm-3 text-end">
                    <form method="post" action={`/api/rsvp/${inviteDetails?.invite_id}`} className="d-inline">
                      <input type="hidden" name="guest_id" value={guest.guest_id} />
                      <button type="submit" name="rsvp_status" value="accepted" className="btn btn-sm btn-success me-2" disabled={guest.rsvp_status === 'accepted'}>
                        Yes
                      </button>
                      <button type="submit" name="rsvp_status" value="declined" className="btn btn-sm btn-danger" disabled={guest.rsvp_status === 'declined'}>
                        No
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </main>
);
}
