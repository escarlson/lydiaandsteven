"use client";

import { useCallback, useRef, useState } from 'react';
import GuestRSVPClient, { GuestRSVPClientHandle } from "../../components/GuestRSVPClient";
import RSVPNavClient from "../../components/RSVPNavClient";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNoteSticky } from '@fortawesome/free-regular-svg-icons';

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
  note: string | null;
  sent_at: Date | null;
  guests: Guest[];
  rsvp_deadline: Date | null;
};

export default function RSVPPageClient({ inviteDetails }: { inviteDetails: InviteDetails | null }) {
  const guestRSVPRef = useRef<GuestRSVPClientHandle>(null);
  const [partyCount, setPartyCount] = useState<number>(inviteDetails?.guests?.length ?? 0);

  const handleAddChild = () => {
    if (guestRSVPRef.current) {
      guestRSVPRef.current.addChild();
    }
  };

  const handleGuestsChange = useCallback((guests: { guest_id: string }[]) => {
    setPartyCount(guests.length);
  }, []);

  return (
    <>
      <div className="row justify-content-center">
        <div className="col col-auto">
          <h1>You&apos;re invited!</h1>
          <p><strong>Please RSVP by {inviteDetails?.rsvp_deadline?.toLocaleDateString() ?? 'the deadline'}.</strong></p>
          <ErrorBoundary>
            <h2>{inviteDetails?.household_name}</h2>
            <p>Party of {partyCount}</p>
          </ErrorBoundary>
          <ErrorBoundary>
            {inviteDetails?.note ? (
              <div className='card'>
                <h3 className='card-header text-start h5'>
                  {/* width attribute reduce layout shifting during page load */}
                  <FontAwesomeIcon icon={faNoteSticky} width={"1.25em"}></FontAwesomeIcon>Note
                </h3>
                <div className='card-body'>
                  {inviteDetails.note}
                </div>
              </div>
              
            ) : null}
          </ErrorBoundary>
        </div>
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col col-auto">
          {/* Client-side interactive RSVP list */}
          <ErrorBoundary>
            <GuestRSVPClient 
              ref={guestRSVPRef}
              inviteId={inviteDetails?.invite_id ?? ''} 
              initialGuests={inviteDetails?.guests ?? []} 
              onGuestsChange={handleGuestsChange}
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
