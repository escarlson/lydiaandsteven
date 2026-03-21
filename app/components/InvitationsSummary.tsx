'use client';

import { useState, useEffect } from 'react';

type RsvpSummary = {
  accepted: number;
  declined: number;
  pending: number;
  total: number;
};

// Component to display a high-level summary of invitations
export default function InvitationsSummary() {
  const [summary, setSummary] = useState<RsvpSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pre-computed counts from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rsvp/summary');

        if (!response.ok) {
          throw new Error('Failed to fetch RSVP summary');
        }

        const result: RsvpSummary = await response.json();
        setSummary(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching RSVP summary:', err as Error);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const acceptedPct = summary && summary.total ? (summary.accepted / summary.total) * 100 : 0;
  const declinedPct = summary && summary.total ? (summary.declined / summary.total) * 100 : 0;
  const pendingPct  = summary && summary.total ? (summary.pending  / summary.total) * 100 : 0;

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

      {!loading && !error && summary && (
        <div className="card">
          <div className="card-body">
            <h3 className="card-title mb-2">Guest RSVP Progress</h3>
            <p className="mb-3">Total Guests: <strong>{summary.total}</strong></p>

            <div className="progress" role="progressbar" style={{ height: "25px" }} aria-label="Guest RSVP progress" aria-valuenow={summary.total} aria-valuemin={0} aria-valuemax={summary.total || 100}>
              <div
                className="progress-bar bg-success"
                style={{ width: `${acceptedPct}%` }}
              >
                {summary.accepted > 0 ? summary.accepted : ''}
              </div>
              <div
                className="progress-bar bg-danger"
                style={{ width: `${declinedPct}%` }}
              >
                {summary.declined > 0 ? summary.declined : ''}
              </div>
              <div
                className="progress-bar bg-warning text-dark"
                style={{ width: `${pendingPct}%` }}
              >
                {summary.pending > 0 ? summary.pending : ''}
              </div>
            </div>

            <div className="d-flex gap-3 mt-3 flex-wrap small">
              <span><strong className="text-success">Accepted:</strong> {summary.accepted}</span>
              <span><strong className="text-danger">Declined:</strong> {summary.declined}</span>
              <span><strong className="text-warning-emphasis">Pending:</strong> {summary.pending}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
