import { fetchInviteById } from "@/app/lib/rsvp-server";
import GuestRSVPClient from "@/app/components/GuestRSVPClient";
import RSVPNavClient from "@/app/components/RSVPNavClient";

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

  return (
  <main className="d-flex align-items-center" style={{ minHeight: '100vh' }}>
    <div className="container text-center">
      <div className="row">
        <div className="col">
          <h1>Response Confirmed</h1>
          <h2>{inviteDetails?.household_name}</h2>
          <p>{( inviteDetails?.guests?.length ? inviteDetails.guests.length : "")} {(inviteDetails?.guests?.length === 1 ? "Guest" : "Guests")}</p>
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-8 col-lg-6">
          {/* Client-side interactive RSVP list */}
          <GuestRSVPClient inviteId={inviteDetails?.invite_id ?? ''} initialGuests={inviteDetails?.guests ?? []} readOnly={true}/>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col justify-content-evenly d-flex gap-3">
          <RSVPNavClient inviteId={inviteDetails?.invite_id ?? ''} showFinish={false}/>
        </div>
      </div>
    </div>
  </main>
);
}
