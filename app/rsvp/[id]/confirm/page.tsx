import { fetchInviteById } from "@/app/lib/rsvp-server";
import GuestRSVPClient from "@/app/components/GuestRSVPClient";
import Link from "next/link";

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
};

export default async function RSVP({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: inviteId } = await params
  const inviteDetails: InviteDetails | null = await fetchInviteById(inviteId);

  return (
  <main className="d-flex align-items-start" style={{ minHeight: "100vh" }}>
    <div className="container mt-4">
      <div className="row text-center">
        <div className="col">
          <h1>🎉 Response Confirmed</h1>
          <h2>{inviteDetails?.household_name}</h2>
          <p>{( inviteDetails?.guests?.length ? inviteDetails.guests.length : "")} {(inviteDetails?.guests?.length === 1 ? "Guest" : "Guests")}</p>
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-12 col-md-auto">
          {/* Client-side interactive RSVP list */}
          <GuestRSVPClient inviteId={inviteDetails?.invite_id ?? ''} initialGuests={inviteDetails?.guests ?? []} readOnly={true}/>
        </div>
      </div>
      <h1 className="text-center mt-4">What&apos;s Next?</h1>
      <div className="row mt-4">
        <div className="col-md-6 col-lg-3 mx-auto mb-2">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Ceremony</h2>
              <p>Please note that the ceremony is standing room only! Seating is extremely limited and strictly reserved for those in need of this accommodation. For more info and to tell us your accessibility needs, click below.</p>
              <Link href="/ceremony" className="btn btn-midnight">Ceremony Info</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mx-auto mb-2">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Reception</h2>
              <p>The reception will be at Tumbleroot Brewery & Distillery. Get all the deets below!</p>
              <Link href="/reception" className="btn btn-midnight">Reception Info</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mx-auto mb-2">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Lodging</h2>
              <p>We&apos;ve put together some discounted hotel blocks, a short guide to recommended hotels, and a way to connect you to other guests who may be interested in sharing Airbnbs.</p>
              <Link href="/travel/lodging" className="btn btn-midnight">Lodging Info</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-3 mx-auto mb-2">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Registry</h2>
              <p>Gifts are not expected, but here are some ideas! Click below for links to our registries, as well as info about needed secondhand items.</p>
              <Link href="/registry" className="btn btn-midnight">Registry</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);
}
