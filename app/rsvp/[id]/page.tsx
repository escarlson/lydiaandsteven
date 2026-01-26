import { fetchInviteById } from "../../lib/rsvp-server";
import GuestRSVPClient from "../../components/GuestRSVPClient";
import RSVPNavClient from "../../components/RSVPNavClient";
import ErrorBoundary from "@/app/components/ErrorBoundary";

type Guest = {
  guest_id: string;
  title?: string | null;
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
        <>
          <div className="row">
            <div className="col">
              <h1>You&apos;re invited!</h1>
              <p><strong>Please RSVP by May 31st.</strong></p>
              <ErrorBoundary>
                <h2>{inviteDetails?.household_name}</h2>
                <p>{( inviteDetails?.guests?.length ? inviteDetails.guests.length : "")} {(inviteDetails?.guests?.length === 1 ? "Guest" : "Guests")}</p>
              </ErrorBoundary>
            </div>
          </div>
          <div className="row justify-content-center mt-4">
            <div className="col-md-8 col-lg-6">
              {/* Client-side interactive RSVP list */}
              <ErrorBoundary>
                <GuestRSVPClient inviteId={inviteDetails?.invite_id ?? ''} initialGuests={inviteDetails?.guests ?? []} />
              </ErrorBoundary>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col justify-content-evenly d-flex gap-3">
              <ErrorBoundary>
                <RSVPNavClient inviteId={inviteDetails?.invite_id ?? ''} />
              </ErrorBoundary>
            </div>
          </div>
        </>
      )}
    </div>
  </main>
);
}
