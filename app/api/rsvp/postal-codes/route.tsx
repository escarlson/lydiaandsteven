import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import pool from "@/app/lib/db";
import type { RowDataPacket } from "mysql2/promise";

type PostalCodeStats = {
  postal_code: string;
  country: string;
  total_invites: number;
  pending_guests: number;
  accepted_guests: number;
  declined_guests: number;
  total_guests: number;
  latitude?: number;
  longitude?: number;
};

type GeocodedPostalCode = RowDataPacket & {
  postal_code: string;
  latitude: number;
  longitude: number;
};

type StatsRow = RowDataPacket & {
  postal_code: string;
  country?: string | null;
  total_invites: number;
  pending_guests: number;
  accepted_guests: number;
  declined_guests: number;
  total_guests: number;
};

type NominatimResult = {
  lat: string;
  lon: string;
  address?: {
    country_code?: string;
  };
};

async function geocodePostalCode(
  postalCode: string,
  countryCode?: string
): Promise<{ lat: number; lon: number; countryCode?: string } | null> {
  try {
    const params = new URLSearchParams({
      postalcode: postalCode,
      format: 'json',
      limit: '1',
      addressdetails: '1'
    });
    
    // Add country code filter if provided
    if (countryCode && countryCode.length === 2) {
      params.append('countrycodes', countryCode.toLowerCase());
    }
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          'User-Agent': 'Wedding RSVP Map'
        }
      }
    );
    
    if (response.ok) {
      const data = (await response.json()) as NominatimResult[];
      if (Array.isArray(data) && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          countryCode: data[0]?.address?.country_code?.toString()?.toUpperCase()
        };
      }
    }
  } catch (error) {
    console.error(`Failed to geocode ${postalCode}:`, error);
  }
  return null;
}

export async function GET(request: Request) {
  // Require authentication for admin operations
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get postal code statistics with country codes
    const [statsResult] = await pool.query<StatsRow[]>(
      `SELECT 
         i.postal_code,
         i.country,
         COUNT(DISTINCT i.invite_id) as total_invites,
         SUM(CASE WHEN g.rsvp_status = 'pending' THEN 1 ELSE 0 END) as pending_guests,
         SUM(CASE WHEN g.rsvp_status = 'accepted' THEN 1 ELSE 0 END) as accepted_guests,
         SUM(CASE WHEN g.rsvp_status = 'declined' THEN 1 ELSE 0 END) as declined_guests,
         COUNT(g.guest_id) as total_guests
       FROM invites i
       LEFT JOIN guests g ON i.invite_id = g.invite_id
       WHERE i.postal_code IS NOT NULL AND i.postal_code != ''
       GROUP BY i.postal_code, i.country
       ORDER BY i.postal_code`
    );

    const stats: PostalCodeStats[] = (statsResult as StatsRow[]).map((row) => ({
      postal_code: row.postal_code,
      country: row.country ?? "US",
      total_invites: Number(row.total_invites ?? 0),
      pending_guests: Number(row.pending_guests ?? 0),
      accepted_guests: Number(row.accepted_guests ?? 0),
      declined_guests: Number(row.declined_guests ?? 0),
      total_guests: Number(row.total_guests ?? 0),
    }));
    
    if (stats.length === 0) {
      return NextResponse.json({ postalCodes: [] }, { status: 200 });
    }

    // Get cached geocoding data
    const postalCodeList = stats.map(s => s.postal_code);
    const [geocodedResult] = await pool.query<GeocodedPostalCode[]>(
      `SELECT postal_code, latitude, longitude 
       FROM postal_code_geocoding 
       WHERE postal_code IN (?)`,
      [postalCodeList]
    );

    const geocodedMap = new Map(
      geocodedResult.map(g => [g.postal_code, { lat: g.latitude, lon: g.longitude }])
    );

    // Find postal codes that need geocoding
    const needsGeocoding = stats.filter(s => !geocodedMap.has(s.postal_code));

    for (const stat of needsGeocoding) {
      const coords = await geocodePostalCode(stat.postal_code, stat.country);
      if (coords) {
        // Cache in database
        try {
          await pool.query(
            `INSERT INTO postal_code_geocoding (postal_code, latitude, longitude, country_code)
             VALUES (?, ?, ?, ?)`,
            [stat.postal_code, coords.lat, coords.lon, coords.countryCode ?? stat.country ?? 'US']
          );
          geocodedMap.set(stat.postal_code, { lat: coords.lat, lon: coords.lon });
        } catch (err) {
          console.error(`Failed to cache geocoding for ${stat.postal_code}:`, err);
        }
      }
      
      // Rate limit: wait 1 second between requests
      if (needsGeocoding.indexOf(stat) < needsGeocoding.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Combine stats with geocoding data
    const postalCodes = stats
      .map(stat => {
        const coords = geocodedMap.get(stat.postal_code);
        if (coords) {
          return {
            ...stat,
            latitude: coords.lat,
            longitude: coords.lon
          };
        }
        return null;
      })
      .filter(
        (code): code is PostalCodeStats & { latitude: number; longitude: number } =>
          code !== null
      );

    return NextResponse.json({ postalCodes }, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
