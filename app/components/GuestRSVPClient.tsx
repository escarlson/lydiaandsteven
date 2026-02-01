"use client";

import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

type Guest = {
  guest_id: string;
  title?: string | null;
  given_name: string;
  family_name: string;
  rsvp_status: string | null;
  is_adult?: boolean;
  seat_requested?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
};

export type GuestRSVPClientHandle = {
  addChild: () => void;
};

const GuestRSVPClient = forwardRef<GuestRSVPClientHandle, { inviteId: string; initialGuests: Guest[]; readOnly?: boolean }>(
  ({ inviteId, initialGuests, readOnly = false }, ref) => {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [loadingGuest, setLoadingGuest] = useState<string | null>(null);
  const [editingGuest, setEditingGuest] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editGivenName, setEditGivenName] = useState('');
  const [editFamilyName, setEditFamilyName] = useState('');

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

  const startEditingGuest = (guest: Guest) => {
    setEditingGuest(guest.guest_id);
    setEditTitle(guest.title ?? '');
    setEditGivenName(guest.given_name);
    setEditFamilyName(guest.family_name);
  };

  const cancelEditingGuest = () => {
    // If canceling a temporary guest with no name fields filled, remove it
    if (editingGuest?.startsWith('temp-') && !editGivenName.trim() && !editFamilyName.trim()) {
      setGuests(prev => prev.filter(g => g.guest_id !== editingGuest));
    }
    
    setEditingGuest(null);
    setEditTitle('');
    setEditGivenName('');
    setEditFamilyName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent, guestId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveGuestName(guestId);
    }
  };

  const saveGuestName = async (guestId: string) => {
    if (!editGivenName.trim() || !editFamilyName.trim()) {
      showToast('Both first and last name are required', 'danger');
      return;
    }

    if (editTitle.trim().length > 50) {
      showToast('Title must be 50 characters or fewer', 'danger');
      return;
    }

    setLoadingGuest(guestId);

    try {
      // Check if this is a new guest (temp ID starts with 'temp-')
      const isNewGuest = guestId.startsWith('temp-');
      
      if (isNewGuest) {
        // Create new guest via API
        const res = await fetch(`/api/rsvp/${inviteId}/guest`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            title: editTitle.trim() || null, 
            given_name: editGivenName.trim(), 
            family_name: editFamilyName.trim(),
            is_adult: false // Default for children
          }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const msg = body?.error || `Request failed: ${res.status}`;
          showToast(msg, 'danger');
          return;
        }

        const data = await res.json();
        const newGuest = data.guest;
        
        // Replace temp guest with real guest from server
        setGuests(prev => prev.map(g => 
          g.guest_id === guestId 
            ? { 
                ...newGuest, 
                created_at: new Date(), 
                updated_at: new Date() 
              } 
            : g
        ));
        showToast('Child added successfully', 'success');
      } else {
        // Update existing guest via API
        const res = await fetch(`/api/rsvp/${inviteId}/guest/${guestId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: editTitle.trim() || null, given_name: editGivenName.trim(), family_name: editFamilyName.trim() }),
        });

        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const msg = body?.error || `Request failed: ${res.status}`;
          showToast(msg, 'danger');
          return;
        }

        // update local state
        setGuests(prev => prev.map(g => 
          g.guest_id === guestId 
            ? { ...g, title: editTitle.trim() || null, given_name: editGivenName.trim(), family_name: editFamilyName.trim() } 
            : g
        ));
        showToast('Guest name updated successfully', 'success');
      }
      
      setEditingGuest(null);
      setEditTitle('');
      setEditGivenName('');
      setEditFamilyName('');
    } catch (e: Error | unknown) {
      const message = e instanceof Error ? e.message : 'An error occurred';
      showToast(message, 'danger');
    } finally {
      setLoadingGuest(null);
    }
  };

  const addChild = () => {
    // Create a temporary guest with edit mode enabled
    const tempGuestId = `temp-${Date.now()}`;
    const newGuest: Guest = {
      guest_id: tempGuestId,
      title: null,
      given_name: '',
      family_name: '',
      rsvp_status: 'pending',
      is_adult: false,
      seat_requested: false,
    };
    
    setGuests(prev => [...prev, newGuest]);
    startEditingGuest(newGuest);
  };

  // Expose addChild method to parent components via ref
  useImperativeHandle(ref, () => ({
    addChild,
  }));

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
            {editingGuest === guest.guest_id ? (
              // Edit mode
              <div className="row align-items-center">
                <div className={readOnly ? "col-12" : "col-8 col-sm-9"}>
                  <div>
                    <div className="d-flex gap-2 flex-wrap align-items-center mb-2">
                      {!guest.guest_id.startsWith('temp-') && (
                        <input
                          type="text"
                          className="form-control form-control-midnight form-control-sm"
                          style={{ maxWidth: '4em' }}
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(e, guest.guest_id)}
                          placeholder="Title"
                          aria-label="Edit title"
                        />
                      )}
                      <input
                        type="text"
                        className="form-control form-control-midnight form-control-sm"
                        style={{ maxWidth: '150px' }}
                        value={editGivenName}
                        onChange={(e) => setEditGivenName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, guest.guest_id)}
                        placeholder="First name"
                        aria-label="Edit first name"
                      />
                      <input
                        type="text"
                        className="form-control form-control-midnight form-control-sm"
                        style={{ maxWidth: '150px' }}
                        value={editFamilyName}
                        onChange={(e) => setEditFamilyName(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, guest.guest_id)}
                        placeholder="Last name"
                        aria-label="Edit last name"
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => saveGuestName(guest.guest_id)}
                        className="btn btn-sm btn-midnight"
                        disabled={loadingGuest === guest.guest_id}
                        aria-label="Save changes"
                      >
                        {loadingGuest === guest.guest_id ? '...' : 'Save'}
                      </button>
                      <button
                        onClick={cancelEditingGuest}
                        className="btn btn-sm btn-outline-midnight"
                        disabled={loadingGuest === guest.guest_id}
                        aria-label="Cancel editing"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
                {!readOnly && <div className="col-4 col-sm-3"></div>}
              </div>
            ) : (
              // View mode
              <div className="row align-items-center">
                <div className={readOnly ? "col-12 text-start" : "col-8 col-sm-9 text-start"}>
                  {guest.title ? `${guest.title} ` : ''}{guest.given_name} {guest.family_name}
                  {!readOnly && (
                    <button
                      onClick={() => startEditingGuest(guest)}
                      className="badge bg-secondary border-0 ms-2"
                      style={{ cursor: 'pointer' }}
                      aria-label={`Edit name for ${guest.given_name} ${guest.family_name}`}
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                  )}
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
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});

GuestRSVPClient.displayName = 'GuestRSVPClient';

export default GuestRSVPClient;