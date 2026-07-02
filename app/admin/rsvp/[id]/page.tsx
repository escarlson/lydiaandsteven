"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

type GuestEntry = {
  guest_id?: string; // undefined = new (not yet saved)
  title: string;
  given_name: string;
  family_name: string;
  rsvp_status: "pending" | "accepted" | "declined";
  is_adult: boolean;
  meal: boolean;
  rehearsal_guest?: boolean;
  rehearsal_meal?: boolean;
};

export default function EditInvitation() {
  const { id: inviteId } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Invite-level fields
  const [householdName, setHouseholdName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [note, setNote] = useState("");
  const [rsvpDeadline, setRsvpDeadline] = useState("");
  const [creationDatetime, setCreationDatetime] = useState("");

  // Guests + soft-delete tracking
  const [guests, setGuests] = useState<GuestEntry[]>([]);
  const [deletedGuestIds, setDeletedGuestIds] = useState<string[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!sessionPending && !session?.user) {
      router.replace("/sign-in");
    }
  }, [sessionPending, session, router]);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastVisible) return;
    const t = window.setTimeout(() => setToastVisible(false), 3500);
    return () => window.clearTimeout(t);
  }, [toastVisible]);

  // Load invitation data
  const loadInvite = useCallback(async () => {
    if (!inviteId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/rsvp/${inviteId}`);
      const data = await res.json();
      if (data.error || !data.results?.length) {
        setNotFound(true);
        return;
      }
      const invite = data.results[0];
      setHouseholdName(invite.household_name ?? "");
      setPostalCode(invite.postal_code ?? "");
      setCountry(invite.country ?? "");
      setNote(invite.note ?? "");
      setRsvpDeadline(invite.rsvp_deadline ?? "");
      setCreationDatetime(invite.sent_at ?? "");
      setGuests(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        invite.guests.map((g: any) => ({
          guest_id: g.guest_id as string,
          title: (g.title as string) ?? "",
          given_name: g.given_name as string,
          family_name: g.family_name as string,
          rsvp_status: (g.rsvp_status as GuestEntry["rsvp_status"]) ?? "pending",
          is_adult: !!g.is_adult,
          meal: !!g.meal,
          rehearsal_guest: !!g.rehearsal_guest,
          rehearsal_meal: !!g.rehearsal_meal,
        }))
      );
      setDeletedGuestIds([]);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [inviteId]);

  useEffect(() => {
    if (!sessionPending && session?.user) {
      loadInvite();
    }
  }, [sessionPending, session, loadInvite]);

  const updateGuest = (index: number, patch: Partial<GuestEntry>) =>
    setGuests(prev => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));

  const addGuest = () =>
    setGuests(prev => [
      ...prev,
      {
        title: "",
        given_name: "",
        family_name: "",
        rsvp_status: "pending",
        is_adult: true,
        meal: false,
        rehearsal_guest: false,
        rehearsal_meal: false,
      },
    ]);

  const removeGuest = (index: number) => {
    const g = guests[index];
    if (g.guest_id) {
      setDeletedGuestIds(prev => [...prev, g.guest_id!]);
    }
    setGuests(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/rsvp/${inviteId}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d?.error ?? "Failed to delete invitation");
        setDeleting(false);
        setConfirmDelete(false);
        return;
      }
      router.replace("/admin/rsvp/report");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const handlePostalCodeChange = (val: string) => {
    setPostalCode(val);
    if (/^\d{5}$/.test(val)) setCountry("US");
    else if (/^[A-Z0-9]{2,4}\s?[A-Z0-9]{2,3}$/i.test(val)) setCountry("GB");
  };

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
    if (guests.some(g => (g.title ?? "").trim().length > 50)) {
      setError("Guest title must be 50 characters or fewer.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Update invitation-level fields
      const inviteRes = await fetch(`/api/rsvp/${inviteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          household_name: householdName,
          postal_code: postalCode || null,
          country: country || null,
          note: note || null,
          rsvp_deadline: rsvpDeadline || null,
        }),
      });
      if (!inviteRes.ok) {
        const d = await inviteRes.json().catch(() => ({}));
        setError(d?.error ?? "Failed to update invitation");
        setSubmitting(false);
        return;
      }

      // 2. Delete removed guests
      for (const guestId of deletedGuestIds) {
        const res = await fetch(`/api/rsvp/${inviteId}/guest/${guestId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setError(d?.error ?? "Failed to remove a guest");
          setSubmitting(false);
          return;
        }
      }

      // 3. Update existing guests
      for (const g of guests.filter(g => g.guest_id)) {
        const res = await fetch(`/api/rsvp/${inviteId}/guest/edit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guest_id: g.guest_id,
            given_name: g.given_name,
            family_name: g.family_name,
            title: g.title || null,
            is_adult: g.is_adult,
            meal: g.meal,
            rsvp_status: g.rsvp_status,
            rehearsal_guest: g.rehearsal_guest,
            rehearsal_meal: g.rehearsal_meal,
          }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setError(d?.error ?? `Failed to update guest ${g.given_name}`);
          setSubmitting(false);
          return;
        }
      }

      // 4. Add new guests
      for (const g of guests.filter(g => !g.guest_id)) {
        const res = await fetch(`/api/rsvp/${inviteId}/guest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            given_name: g.given_name,
            family_name: g.family_name,
            title: g.title || null,
            is_adult: g.is_adult,
            meal: g.meal,
            rehearsal_guest: g.rehearsal_guest,
            rehearsal_meal: g.rehearsal_meal,
          }),
        });
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setError(d?.error ?? `Failed to add guest ${g.given_name}`);
          setSubmitting(false);
          return;
        }
      }

      setToastVisible(true);
      // Re-fetch to get fresh guest_ids for any newly added guests
      await loadInvite();
      setSubmitting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setSubmitting(false);
    }
  };

  // ── Guards ──────────────────────────────────────────────────────────────

  if (sessionPending || (!sessionPending && !session?.user)) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status" aria-label="Loading invitation" />
      </div>
    );
  }

  if (notFound) {
    return (
      <>
        <h1>Invitation Not Found</h1>
        <p>
          No invitation was found with ID <code>{inviteId}</code>.
        </p>
        <Link href="/admin/rsvp/report" className="btn btn-outline-midnight">
          Back to Report
        </Link>
      </>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-1">
        <h1 className="mb-0">Edit Invitation</h1>
        <Link href={`/rsvp/${inviteId}`} className="btn btn-sm btn-outline-midnight">
          View RSVP
        </Link>
      </div>
      <p className="text-muted small mb-3">
        <span className="font-monospace">{inviteId}</span> &middot; Created at {creationDatetime.toString().replace("T", " ").substring(0, 16)}
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Success toast */}
      {toastVisible && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div
            className="toast show align-items-center text-white bg-success border-0"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="d-flex">
              <div className="toast-body">Invitation saved successfully.</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() => setToastVisible(false)}
              />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* ── Invitation fields ── */}
        <div className="row g-2 mb-3">
          <div className="col-md-6">
            <label className="form-label">Household Name</label>
            <input
              className="form-control form-control-midnight"
              value={householdName}
              onChange={e => setHouseholdName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Postal Code</label>
            <input
              className="form-control form-control-midnight"
              value={postalCode}
              onChange={e => handlePostalCodeChange(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">Country Code</label>
            <input
              className="form-control form-control-midnight"
              value={country}
              onChange={e => setCountry(e.target.value.toUpperCase())}
              placeholder="US, GB, etc."
              maxLength={2}
            />
          </div>
          <div className="col-md-2">
            <label className="form-label">RSVP Deadline</label>
            <input
              className="form-control form-control-midnight"
              type="date"
              value={rsvpDeadline}
              onChange={e => setRsvpDeadline(e.target.value)}
            />
          </div>
        </div>
        <div className="row g-2 mb-3">
          <div className="col-12">
            <label className="note">Note</label>
            <input
              className="form-control form-control-midnight"
                value={note}
                onChange={e => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* ── Guests ── */}
        <h2 className="h5 mt-4">Guests</h2>
        {guests.map((g, i) => (
          <div key={g.guest_id ?? `new-${i}`} className="card mb-3">
            <div className="card-body">
              <div className="row g-2 align-items-end">
                <div className="col-md-2">
                  <label className="form-label">Title</label>
                  <input
                    className="form-control form-control-midnight"
                    value={g.title}
                    onChange={e => updateGuest(i, { title: e.target.value })}
                    placeholder="e.g., Fr."
                    maxLength={50}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Given Name</label>
                  <input
                    className="form-control form-control-midnight"
                    value={g.given_name}
                    onChange={e => updateGuest(i, { given_name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Family Name</label>
                  <input
                    className="form-control form-control-midnight"
                    value={g.family_name}
                    onChange={e => updateGuest(i, { family_name: e.target.value })}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">RSVP Status</label>
                  <select
                    className="form-select form-select-midnight"
                    value={g.rsvp_status}
                    onChange={e =>
                      updateGuest(i, { rsvp_status: e.target.value as GuestEntry["rsvp_status"] })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
                <div className="col-md-1 text-end">
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => removeGuest(i)}
                    disabled={guests.length === 1}
                  >
                    Remove
                  </button>
                </div>
                <div className="col-sm-4 col-md-12">
                  <div className="form-check form-check-inline d-block d-md-inline-block mt-2">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id={`adult-${i}`}
                      checked={!!g.is_adult}
                      onChange={e => updateGuest(i, { is_adult: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor={`adult-${i}`}>
                      Adult
                    </label>
                  </div>
                  <div className="form-check form-check-inline d-block d-md-inline-block">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id={`meal-${i}`}
                      checked={!!g.meal}
                      onChange={e => updateGuest(i, { meal: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor={`meal-${i}`}>
                      Meal
                    </label>
                  </div>
                  <div className="form-check form-check-inline d-block d-md-inline-block">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id={`rehearsal-${i}`}
                      checked={!!g.rehearsal_guest}
                      onChange={e => updateGuest(i, { rehearsal_guest: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor={`rehearsal-${i}`}>
                      Rehearsal
                    </label>
                  </div>
                  <div className="form-check form-check-inline d-block d-md-inline-block">
                    <input
                      className="form-check-input form-check-input-midnight"
                      type="checkbox"
                      id={`rehearsal-meal-${i}`}
                      checked={!!g.rehearsal_meal}
                      onChange={e => updateGuest(i, { rehearsal_meal: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor={`rehearsal-meal-${i}`}>
                      Rehearsal Meal
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="mb-3">
          <button type="button" className="btn btn-outline-midnight me-2" onClick={addGuest}>
            Add Guest
          </button>
          <button type="submit" className="btn btn-midnight" disabled={submitting}>
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>

      <hr className="my-4" />
      <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
        <Link href="/admin/rsvp/report" className="btn btn-sm btn-outline-secondary">
          Back to Report
        </Link>
        {!confirmDelete ? (
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-auto"
            onClick={() => setConfirmDelete(true)}
          >
            Delete Invitation
          </button>
        ) : (
          <div className="ms-auto d-flex align-items-center gap-2">
            <span className="text-danger small fw-semibold">Do you renounce this invitation and all its guests, and all its might, all its pomp?</span>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Yes, delete"}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setConfirmDelete(false)}
              disabled={deleting}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </>
  );
}
