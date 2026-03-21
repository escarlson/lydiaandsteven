"use client";

import { useRef } from 'react';
import GuestRSVPClient, { GuestRSVPClientHandle } from "../../components/GuestRSVPClient";
import RSVPNavClient from "../../components/RSVPNavClient";
import ErrorBoundary from "@/app/components/ErrorBoundary";

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

export default function RSVPPageClient({ inviteDetails }: { inviteDetails: InviteDetails | null }) {
  const guestRSVPRef = useRef<GuestRSVPClientHandle>(null);

  const handleAddChild = () => {
    if (guestRSVPRef.current) {
      guestRSVPRef.current.addChild();
    }
  };

  return (
    <>
      <div className="row">
        <div className="col">
          <h1>You&apos;re invited!</h1>
          <p><strong>Please RSVP by May 31st.</strong></p>
          <ErrorBoundary>
            <h2>{inviteDetails?.household_name}</h2>
            <p>Party of {inviteDetails?.guests?.length}</p>
          </ErrorBoundary>
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-8 col-lg-6">
          {/* Client-side interactive RSVP list */}
          <ErrorBoundary>
            <GuestRSVPClient 
              ref={guestRSVPRef}
              inviteId={inviteDetails?.invite_id ?? ''} 
              initialGuests={inviteDetails?.guests ?? []} 
            />
          </ErrorBoundary>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col justify-content-evenly d-flex gap-3">
          <ErrorBoundary>
            <RSVPNavClient 
              inviteId={inviteDetails?.invite_id ?? ''} 
              onAddChild={handleAddChild}
            />
          </ErrorBoundary>
        </div>
      </div>
    </>
  );
}
