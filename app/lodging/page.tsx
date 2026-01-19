'use client';

import Link from "next/link";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/app/components/ErrorBoundary";

const HotelsMapClient = dynamic(() => import("@/app/components/HotelsMapClient"), {
  ssr: false,
  loading: () => <div style={{ height: '400px', width: '100%', background: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>
});

export default function Lodging() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Lodging</h1>
          <p>It turns out hotel blocks in Santa Fe are not as easy to come by as we supposed. In lieu, here are some recommended hotels.</p>
          <h2>Recommended Lodging</h2>
          <div className="row">
            <div className="col-md-6">
              <h3 className="h4">Typical Hotels</h3>
                <ul>
                <li><Link href={"https://thepecostrailinn.com/"} target="_blank" rel="noopener noreferrer">Pecos Trail Inn</Link></li>
                <li><Link href={"https://santafemotel.com/"} target="_blank" rel="noopener noreferrer">Santa Fe Motel & Inn</Link></li>
                <li><Link href={"https://www.bestwestern.com/en_US/book/hotels-in-santa-fe/best-western-plus-inn-of-santa-fe/propertyCode.32095.html"} target="_blank" rel="noopener noreferrer">Best Western Plus Inn of Santa Fe</Link></li>
                </ul>
                <h3 className="h4">Hip Alternatives</h3> 
                <ul>
                <li><Link href={"https://www.hostelsantafe.org/"} target="_blank" rel="noopener noreferrer">Santa Fe International Hostel</Link></li>
                <li><Link href={"https://santafetreehousecamp.org/"} target="_blank" rel="noopener noreferrer">Santa Fe Tree-House Camp</Link></li>
                <li><Link href={"https://www.laspalomas.com/"} target="_blank" rel="noopener noreferrer">Las Palomas</Link></li>
                <li><Link href={"https://hotelglorieta.com/"} target="_blank" rel="noopener noreferrer">Hotel Glorieta</Link></li>
                <li><Link href={"https://themysticsantafe.com/"} target="_blank" rel="noopener noreferrer">The Mystic</Link></li>
                <li><Link href={"http://www.elreycourt.com/"} target="_blank" rel="noopener noreferrer">El Rey Court</Link></li>
                </ul>
            </div>
            <div className="col-md-6">
              <ErrorBoundary>
                <HotelsMapClient />
              </ErrorBoundary>
            </div>
          </div>
          <h2>Shared Lodging</h2>
          <p>Want to share a rental house with other friends of Lydia and Steven? Fill out this li&apos;l form and we&apos;ll connect you to others who are looking to do the same! If there is enough interest, we may even try to rent one big place to be a guest flophouse.</p>
          <Link href={"https://form.jotform.com/253634237497163"} target="_blank" rel="noopener noreferrer" className="btn btn-copper mb-5">Shared Lodging Interest Form</Link>
        </div>
      </main>
    </div>
  );
}