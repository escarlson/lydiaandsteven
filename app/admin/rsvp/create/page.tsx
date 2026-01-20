"use client";

import Link from "next/link";
// removed useRouter; no automatic navigation after create
import { useEffect, useState } from "react";

type NewGuest = {
  given_name: string;
  family_name: string;
  rsvp_status?: "pending" | "accepted" | "declined";
  is_adult?: boolean;
  seat_requested?: boolean;
};

export default function CreateInvitations() {
  const [householdName, setHouseholdName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [guests, setGuests] = useState<NewGuest[]>([
    { given_name: "", family_name: "", rsvp_status: "pending", is_adult: true, seat_requested: false },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInviteId, setSuccessInviteId] = useState<string | null>(null);

  // toast state for success notification
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!toastVisible) return;
    const t = window.setTimeout(() => setToastVisible(false), 3500);
    return () => window.clearTimeout(t);
  }, [toastVisible]);

  const updateGuest = (index: number, patch: Partial<NewGuest>) =>
    setGuests(prev => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));

  const addGuest = () =>
    setGuests(prev => [...prev, { given_name: "", family_name: "", rsvp_status: "pending", is_adult: true, seat_requested: false }]);

  const removeGuest = (index: number) =>
    setGuests(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!householdName.trim()) {
      setError("Household name is required.");
      return;
    }
    if (!guests.length || guests.some(g => !g.given_name.trim() || !g.family_name.trim())) {
      setError("Each guest requires a given name and family name.");
      return;
    }

    setSubmitting(true);
    try {
      const body = {
        household_name: householdName,
        postal_code: postalCode || null,
        guests: guests.map(g => ({
          given_name: g.given_name,
          family_name: g.family_name,
          rsvp_status: g.rsvp_status ?? "pending",
          is_adult: g.is_adult ?? true,
          seat_requested: g.seat_requested ?? false,
        })),
      };

      const res = await fetch("/api/rsvp/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Failed to create invitation");
        setSubmitting(false);
        return;
      }

      // created; server returns invite with invite_id per API changes
      const inviteId = data?.invite?.invite_id ?? data?.invite_id ?? null;
      setSuccessInviteId(inviteId);
      setSubmitting(false);

      // show a success toast
      setToastMessage(inviteId ? `Invitation created — ${inviteId}` : "Invitation created");
      setToastVisible(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Create Invitations</h1>
          <p>Create invitations and their related guests.</p>

          {error && <div className="alert alert-danger">{error}</div>}
          {/* Keep a persistent success link (optional) */}
          {successInviteId && (
            <div className="mb-3">
              <Link href={`/rsvp/${successInviteId}`} className="btn btn-sm btn-outline-copper">View Created Invitation</Link>
            </div>
          )}

          {/* Success toast (positioned bottom-right) */}
          {toastVisible && (
            <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
              <div className="toast show align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                  <div className="toast-body">
                    {toastMessage}
                    {successInviteId && (
                      <> — <Link href={`/rsvp/${successInviteId}`} className="text-white text-decoration-underline">View</Link></>
                    )}
                  </div>
                  <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => setToastVisible(false)}></button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            <div className="row g-2 mb-3">
              <div className="col-md-10">
              <label className="form-label">Household Name</label>
              <input className="form-control" value={householdName} onChange={e => setHouseholdName(e.target.value)} required />
            </div>
              <div className="col-md-2">
                <label className="form-label">Postal Code</label>
                <input className="form-control" value={postalCode} onChange={e => setPostalCode(e.target.value)} />
              </div>
            </div>

            <h2 className="h5 mt-4">Guests</h2>
            {guests.map((g, i) => (
              <div key={i} className="card mb-3">
                <div className="card-body">
                  <div className="row g-2 align-items-end">
                    <div className="col-md-4">
                      <label className="form-label">Given Name</label>
                      <input className="form-control" value={g.given_name} onChange={e => updateGuest(i, { given_name: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Family Name</label>
                      <input className="form-control" value={g.family_name} onChange={e => updateGuest(i, { family_name: e.target.value })} required />
                    </div>
                    <div className="col-md-2">
                      <label className="form-label">RSVP Status</label>
                      <select className="form-select" value={g.rsvp_status} onChange={e => updateGuest(i, { rsvp_status: e.target.value as NewGuest["rsvp_status"] })}>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                      </select>
                    </div>
                    <div className="col-md-1">
                      <div className="form-check mt-2">
                        <input className="form-check-input" type="checkbox" id={`adult-${i}`} checked={!!g.is_adult} onChange={e => updateGuest(i, { is_adult: e.target.checked })} />
                        <label className="form-check-label small" htmlFor={`adult-${i}`}>Adult</label>
                      </div>
                    </div>
                    <div className="col-md-1 text-end">
                      <button type="button" className="btn btn-sm btn-danger" onClick={() => removeGuest(i)} disabled={guests.length === 1}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mb-3">
              <button type="button" className="btn btn-outline-copper me-2" onClick={addGuest}>Add Guest</button>
              <button type="submit" className="btn btn-copper" disabled={submitting}>
                {submitting ? "Creating…" : "Create Invitation"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}