'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Hotel markers use the standard blue Leaflet pin
const defaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Ceremony/reception markers use a bolder red and slightly larger size
const venueIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [1, -40],
  shadowSize: [41, 41],
});

// Different marker for hip alternatives
const bespokeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [1, -40],
  shadowSize: [41, 41],
});

// Different marker for adventurous alternatives
const alternativeIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [1, -40],
  shadowSize: [41, 41],
});

L.Marker.prototype.setIcon(defaultIcon);

interface Hotel {
  name: string;
  lat: number;
  lng: number;
  url: string;
  description?: string;
}

interface Bespoke {
  name: string;
  lat: number;
  lng: number;
  url: string;
  description?: string;
}

interface Alternative {
  name: string;
  lat: number;
  lng: number;
  url: string;
  description?: string;
}

interface Venue {
  name: string;
  lat: number;
  lng: number;
  url?: string;
  description: string;
}

const hotels: Hotel[] = [
  {
    name: 'Hotel Glorieta',
    lat: 35.69898801534288,
    lng: -105.95405038344455,
    url: 'https://www.hotelglorietasantafe.com/',
    description: 'A more secluded hotel with a view of the Sangre de Cristo mountains'
  },
  {
    name: 'Pecos Trail Inn',
    lat: 35.64805015560645,
    lng: -105.93373593263036,
    url: 'https://thepecostrailinn.com/',
    description: 'A remodeled motor court with Southwestern flair'
  },
  {
    name: 'Santa Fe Motel & Inn',
    lat: 35.68263688051911,
    lng: -105.94513543824881,
    url: 'https://santafemotel.com/',
    description: 'A small and affordable option close to the plaza. EV charging available on site.'
  },
  {
    name: 'Best Western Plus Inn of Santa Fe',
    lat: 35.64456462134519,
    lng: -106.00723673465295,
    url: 'https://www.bestwestern.com/en_US/book/hotel-rooms.32095.html?groupId=2P3HC9S8',
    description: 'A 3.5 star hotel with unusually good reviews. Use our group code 2P3HC9S8 for a discounted rate.'
  }
];

const venues: Venue[] = [
  {
    name: 'Holy Trinity Orthodox Church (Ceremony)',
    lat: 35.6769,
    lng: -105.9393,
    url: 'https://www.holytrinitysantafe.org/',
    description: '231 E Cordova Rd, Santa Fe, NM 87505'
  },
  {
    name: 'Tumbleroot Brewery & Distillery (Reception)',
    lat: 35.6645,
    lng: -106.0103,
    url: 'https://tumblerootbreweryanddistillery.com/',
    description: '2791 Agua Fria St, Santa Fe, NM 87507'
  }
];

const bespoke: Bespoke[] = [
  {
    name: 'The Mystic',
    lat: 35.656720780883695,
    lng: -105.98765681680555,
    url: 'https://themysticsantafe.com/'
  },
  {
    name: 'Las Palomas',
    lat: 35.68909638657713,
    lng: -105.94578063919384,
    url: 'https://www.laspalomas.com/',
  },
  { name: 'El Rey Court',
    lat: 35.66421311537713,
    lng: -105.97357554361085,
    url: 'http://www.elreycourt.com/',
    description: 'A classic motor court with polished Southwestern style'
  }
];

const alternatives: Alternative[] = [
  {
    name: 'Santa Fe International Hostel',
    lat: 35.6699762546861,
    lng: -105.96504070860665,
    url: 'https://www.hostelsantafe.org/',
    description: 'A more affordable option for solo travelers'
  },
  {
    name: 'Santa Fe Tree-House Camp',
    lat: 35.590139508223274,
    lng: -105.84387090081567,
    url: 'https://santafetreehousecamp.org/',
    description: 'Unique treehouse cabins offering off-grid adventures. Check the details for the type of accommodation you\'re booking to know what you\'re getting into.'
  },
  {
    name: 'The Enchanted Llama Ranch',
    lat: 35.6616846336601,
    lng: -106.027047063487,
    url: 'https://www.hipcamp.com/en-US/land/new-mexico-the-enchanted-llama-ranch-wz6hm5y1',
    description: 'RV/trailer campsite with llamas!'
  },
  {
    name: 'Enchanted Yurt',
    lat: 35.661338104736245,
    lng: -106.02723531693823,
    url: 'https://glampinghub.com/unitedstatesofamerica/southwest/newmexico/santafe/vacation-rental-desert-santa-fe-new-mexico/',
    description: 'Spacious yurt on the Enchanted Llama Ranch'
  }
];

export default function HotelsMap() {
  const center: [number, number] = [35.6707, -105.9748];

  return (
    <div className="mt-4 mb-5" style={{ position: 'relative', zIndex: 1 }}>
      <MapContainer center={center} zoom={11} style={{ height: '400px', width: '100%', borderRadius: '8px' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {venues.map((venue) => (
          <Marker key={venue.name} position={[venue.lat, venue.lng]} icon={venueIcon}>
            <Popup>
              {venue.url ? (
                <a href={venue.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold' }}>
                  {venue.name}
                </a>
              ) : (
                <span style={{ fontWeight: 'bold' }}>{venue.name}</span>
              )}
              <p style={{ margin: '8px 0 0 0' }}>{venue.description}</p>
            </Popup>
          </Marker>
        ))}
        {hotels.map((hotel) => (
          <Marker key={hotel.name} position={[hotel.lat, hotel.lng]}>
            <Popup>
              <a href={hotel.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold' }}>
                {hotel.name}
              </a>
              {hotel.description && <p style={{ margin: '8px 0 0 0' }}>{hotel.description}</p>}
            </Popup>
          </Marker>
        ))}
        {bespoke.map((place) => (
          <Marker key={place.name} position={[place.lat, place.lng]} icon={bespokeIcon}>
            <Popup>
              <a href={place.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold' }}>
                {place.name}
              </a>
              {place.description && <p style={{ margin: '8px 0 0 0' }}>{place.description}</p>}
            </Popup>
          </Marker>
        ))}
        {alternatives.map((alt) => (
          <Marker key={alt.name} position={[alt.lat, alt.lng]} icon={alternativeIcon}>
            <Popup>
              <a href={alt.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold' }}>
                {alt.name}
              </a>
              {alt.description && <p style={{ margin: '8px 0 0 0' }}>{alt.description}</p>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
