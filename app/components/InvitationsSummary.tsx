'use client';

import { useState, useMemo, useEffect } from 'react';

type Guest = {
  guest_id: string;
  title?: string | null;
  given_name: string;
  family_name: string;
  rsvp_status: string | null;
  is_adult?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
};

type Invitation = {
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

type InvitationsResponse = {
  success?: boolean;
  count?: number;
  invitations?: Invitation[];
  error?: string;
};

// Component to display a high-level summary of invitations
export default function InvitationsSummary() {
  const [data, setData] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const guestSummary = useMemo(() => {
    let accepted = 0;
    let declined = 0;
    let pending = 0;

    const invitations: Invitation[] = Array.isArray(data) ? data : [];

    for (const invitation of invitations) {
      const guests: Guest[] = Array.isArray(invitation.guests) ? invitation.guests : [];

      for (const guest of guests) {
        if (guest.rsvp_status === 'accepted') {
          accepted += 1;
        } else if (guest.rsvp_status === 'declined') {
          declined += 1;
        } else {
          pending += 1;
        }
      }
    }

    const total = accepted + declined + pending;

    return {
      accepted,
      declined,
      pending,
      total,
      acceptedPct: total ? (accepted / total) * 100 : 0,
      declinedPct: total ? (declined / total) * 100 : 0,
      pendingPct: total ? (pending / total) * 100 : 0,
    };
  }, [data]);
  
  // Fetch data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rsvp/all');
        
        if (!response.ok) {
          throw new Error('Failed to fetch invitations');
        }

        const result: Invitation[] | InvitationsResponse = await response.json();

        const invitations = Array.isArray(result)
          ? result
          : Array.isArray(result.invitations)
            ? result.invitations
            : null;

        if (!invitations) {
          throw new Error('Unexpected invitations response format');
        }

        setData(invitations);
        setError(null);
      } catch (err) {
        console.error('Error fetching invitations:', err as Error);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  


  return (
    <div className="container mt-4">
      
      {/* Loading state */}
      {loading && (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="alert alert-danger" role="alert">
          Error loading invitations: {error}
        </div>
      )}

      {!loading && !error && (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-2">Guest RSVP Progress</h3>
            <p className="mb-3">Total Guests: <strong>{guestSummary.total}</strong></p>

            <div className="progress" role="progressbar" style={{ height: "25px" }} aria-label="Guest RSVP progress" aria-valuenow={guestSummary.total} aria-valuemin={0} aria-valuemax={guestSummary.total || 100}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${guestSummary.acceptedPct}%` }}
              >
                {guestSummary.accepted > 0 ? guestSummary.accepted : ''}
              </div>
              <div
                className="progress-bar bg-danger"
                style={{ width: `${guestSummary.declinedPct}%` }}
              >
                {guestSummary.declined > 0 ? guestSummary.declined : ''}
              </div>
              <div
                className="progress-bar bg-warning text-dark"
                style={{ width: `${guestSummary.pendingPct}%` }}
              >
                {guestSummary.pending > 0 ? guestSummary.pending : ''}
              </div>
            </div>

            <div className="d-flex gap-3 mt-3 flex-wrap small">
              <span><strong className="text-success">Accepted:</strong> {guestSummary.accepted}</span>
              <span><strong className="text-danger">Declined:</strong> {guestSummary.declined}</span>
              <span><strong className="text-warning-emphasis">Pending:</strong> {guestSummary.pending}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
