"use client";

import { useEffect, useRef, useState } from 'react';

type Guest = {
  guest_id: string;
  given_name: string;
  family_name: string;
  rsvp_status: string | null;
  is_adult?: boolean;
  seat_requested?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
};

export default function GuestRSVPClient({ inviteId, initialGuests, readOnly = false }: { inviteId: string; initialGuests: Guest[]; readOnly?: boolean }) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [loadingGuest, setLoadingGuest] = useState<string | null>(null);

  // toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastVariant, setToastVariant] = useState<'success' | 'danger'>('success');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  // Always fetch latest data when component mounts or inviteId changes so
  // the UI reflects server state (fixes stale data when navigating Back).
  useEffect(() => {
    let mounted = true;
    if (!inviteId) return;

    const fetchLatest = async () => {
      try {
        const res = await fetch(`/api/rsvp/${inviteId}`, { cache: 'no-store' });
        if (!res.ok) {
          console.error('Failed to fetch invite data:', res.status);
          return;
        }
        const body = await res.json().catch(() => null);
        // API returns { results: [invite] } for the route; accept either shape.
        const invite = Array.isArray(body?.results) ? body.results[0] : body;
        const latestGuests = invite?.guests ?? [];
        if (mounted) setGuests(latestGuests);
      } catch (err) {
        console.error('Error fetching RSVP data:', err);
      }
    };

    fetchLatest();
    return () => {
      mounted = false;
    };
  }, [inviteId]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const showToast = (message: string, variant: 'success' | 'danger' = 'success', duration = 3500) => {
    setToastMessage(message);
    setToastVariant(variant);
    setToastVisible(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToastVisible(false), duration);
  };

  const handleRSVP = async (guestId: string, status: 'accepted' | 'declined') => {
    setLoadingGuest(guestId);

    try {
      const res = await fetch(`/api/rsvp/${inviteId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest_id: guestId, rsvp_status: status }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg = body?.error || `Request failed: ${res.status}`;
        showToast(msg, 'danger');
        return;
      }

      // update local state so UI updates without reload
      setGuests(prev => prev.map(g => g.guest_id === guestId ? { ...g, rsvp_status: status } : g));
      const guest = guests.find(g => g.guest_id === guestId);
      showToast(`RSVP for ${guest?.given_name} updated to ${status === 'accepted' ? 'Yes' : 'No'}`, 'success');
    } catch (e: Error | unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred';
      showToast(message, 'danger');
    } finally {
      setLoadingGuest(null);
    }
  };

  return (
    <div>
      {/* Toast container (positioned bottom-right) */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
        {toastVisible && toastMessage && (
          <div className={`toast align-items-center text-bg-${toastVariant} border-0 show`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="d-flex">
              <div className="toast-body">{toastMessage}</div>
              <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => setToastVisible(false)}></button>
            </div>
          </div>
        )}
      </div>

      {/* Header row */}
      <div className="row fw-bold mb-2" role="row">
        <div role="columnheader" className={readOnly ? "col-12 text-start" : "col-8 col-sm-9 text-start"}>Guest name</div>
        {!readOnly && <div role="columnheader" className="col-4 col-sm-3 text-end">Response</div>}
      </div>

      <ul className="list-unstyled" role="list" aria-label="Guest RSVP list">
        {guests.map(guest => (
          <li key={guest.guest_id} className="mb-3" role="listitem">
            <div className="row align-items-center">
              <div className={readOnly ? "col-12 text-start" : "col-8 col-sm-9 text-start"}>
                {guest.given_name} {guest.family_name}
                <span id={`status-${guest.guest_id}`} aria-live="polite" aria-atomic="true" className={`badge ms-2 ${
                      guest.rsvp_status === 'accepted' ? 'text-bg-success' :
                      guest.rsvp_status === 'declined' ? 'text-bg-danger' :
                      'text-bg-secondary'
                    }`}>
                  {guest.rsvp_status === 'accepted' ? 'Accepted' : guest.rsvp_status === 'declined' ? 'Declined' : 'Pending'}
                </span>
              </div>

              {!readOnly && (
                <div className="col-4 col-sm-3 text-end">
                  <button
                    onClick={() => handleRSVP(guest.guest_id, 'accepted')}
                    className="btn btn-sm btn-success me-2"
                    disabled={guest.rsvp_status === 'accepted' || loadingGuest === guest.guest_id || readOnly}
                    aria-label={`Accept RSVP for ${guest.given_name} ${guest.family_name}`}
                    aria-describedby={`status-${guest.guest_id}`}
                  >
                    {loadingGuest === guest.guest_id ? '...' : 'Yes'}
                  </button>
                  <button
                    onClick={() => handleRSVP(guest.guest_id, 'declined')}
                    className="btn btn-sm btn-danger"
                    disabled={guest.rsvp_status === 'declined' || loadingGuest === guest.guest_id || readOnly}
                    aria-label={`Decline RSVP for ${guest.given_name} ${guest.family_name}`}
                    aria-describedby={`status-${guest.guest_id}`}
                  >
                    {loadingGuest === guest.guest_id ? '...' : 'No'}
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
