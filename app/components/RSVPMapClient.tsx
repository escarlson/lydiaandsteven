"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import ErrorBoundary from './ErrorBoundary';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

type PostalCodeStats = {
  postal_code: string;
  total_invites: number;
  pending_guests: number;
  accepted_guests: number;
  declined_guests: number;
  total_guests: number;
  latitude: number;
  longitude: number;
};

type PostalCodeLocation = PostalCodeStats;

export default function RSVPMapClient() {
  const [postalCodes, setPostalCodes] = useState<PostalCodeLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAcceptedOnly, setShowAcceptedOnly] = useState(false);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  useEffect(() => {
    // Import Leaflet for icon configuration
    import('leaflet').then((leaflet) => {
      
      // Fix for default marker icons in Next.js
      const DefaultIcon = leaflet.default.Icon.Default.prototype as unknown as {
        _getIconUrl?: string;
      };
      delete DefaultIcon._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
      
      setIsLeafletReady(true);
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/rsvp/postal-codes');
        if (!res.ok) throw new Error('Failed to fetch postal codes');
        
        const data = await res.json();
        const rawLocations = Array.isArray(data?.postalCodes) ? data.postalCodes : [];

        const locations = rawLocations
          .map((location: PostalCodeLocation) => {
            const latitude = Number(location.latitude);
            const longitude = Number(location.longitude);
            const total_invites = Number(location.total_invites);
            const pending_guests = Number(location.pending_guests);
            const accepted_guests = Number(location.accepted_guests);
            const declined_guests = Number(location.declined_guests);
            const total_guests = Number(location.total_guests);

            return {
              ...location,
              latitude,
              longitude,
              total_invites,
              pending_guests,
              accepted_guests,
              declined_guests,
              total_guests,
            };
          })
          .filter((location: PostalCodeLocation) =>
            Number.isFinite(location.latitude) && Number.isFinite(location.longitude)
          );

        setPostalCodes(locations);
      } catch (err) {
        console.error('Error fetching postal codes:', err);
        setError('Failed to load postal code data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading map data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (!isLeafletReady || postalCodes.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No postal code data available to display.
      </div>
    );
  }

  // Calculate center point (average of all coordinates)
  const centerLat = postalCodes.reduce((sum, loc) => sum + loc.latitude, 0) / postalCodes.length;
  const centerLon = postalCodes.reduce((sum, loc) => sum + loc.longitude, 0) / postalCodes.length;

  return (
    <div>
      <div className="mb-3">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="showAcceptedOnly"
            checked={showAcceptedOnly}
            onChange={(e) => setShowAcceptedOnly(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="showAcceptedOnly">
            Show only confirmed guests
          </label>
        </div>
      </div>

      <div style={{ height: '600px', width: '100%' }}>
        <ErrorBoundary>
          <MapContainer
            center={[centerLat, centerLon]}
            zoom={4}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {postalCodes.map((location) => {
              const guestCount = showAcceptedOnly 
                ? location.accepted_guests : location.total_guests;
              
              // Skip if no guests match the filter
              if (guestCount === 0) return null;

              return (
                <Marker
                  key={location.postal_code}
                  position={[location.latitude, location.longitude]}
                >
                  <Popup>
                    <div>
                      <strong>Postal Code: {location.postal_code}</strong>
                      <br />
                      Total Invites: {location.total_invites}
                      <br />
                      <br />
                      <strong>Guests:</strong>
                      <br />
                      Accepted: {location.accepted_guests}
                      <br />
                      Pending: {location.pending_guests}
                      <br />
                      Declined: {location.declined_guests}
                      <br />
                      Total: {location.total_guests}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </ErrorBoundary>
      </div>
    </div>
  );
}
