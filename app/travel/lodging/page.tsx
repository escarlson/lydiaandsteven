'use client';

import Link from "next/link";
import dynamic from "next/dynamic";
import ErrorBoundary from "@/app/components/ErrorBoundary";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHotel} from "@fortawesome/free-solid-svg-icons";

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
          <h2>Recommended Lodging</h2>
          <p>We highly recommend that you book as early as possible! Santa Fe is a popular tourist town and hotels do fill up! You&apos;ll also get a better rate if you book early; prices will climb during the summer tourist season.</p>
          <div className="row">
            <div className="col-md-6">
              <h3 className="h4">Conventional Hotels & Motor Inns</h3>
                <ul>
                  
                  <li><Link href={"https://www.hotelglorietasantafe.com/"} target="_blank" rel="noopener noreferrer">Hotel Glorieta</Link></li>
                  <li><Link href={"https://www.bestwestern.com/en_US/book/hotel-rooms.32095.html?groupId=2P3HC9S8"} target="_blank" rel="noopener noreferrer">Best Western Plus Inn of Santa Fe</Link> <span className="badge text-bg-success ms-2">Group rate</span></li>
                  <li><Link href={"https://thepecostrailinn.com/"} target="_blank" rel="noopener noreferrer">Pecos Trail Inn</Link></li>
                  <li><Link href={"https://santafemotel.com/"} target="_blank" rel="noopener noreferrer">Santa Fe Motel & Inn</Link></li>
                </ul>
              <h3 className="h4">Bespoke & Hip But Reasonable</h3>
                <ul>
                  <li><Link href={"https://www.laspalomas.com/"} target="_blank" rel="noopener noreferrer">Las Palomas</Link></li>
                  <li><Link href={"https://elreycourt.com/"} target="_blank" rel="noopener noreferrer">El Rey Court</Link></li>
                  <li><Link href={"https://themysticsantafe.com/"} target="_blank" rel="noopener noreferrer">The Mystic</Link></li>
                </ul>
              <h3 className="h4">Adventurous Alternatives</h3>
                <ul>
                  <li><Link href={"https://www.hostelsantafe.org/"} target="_blank" rel="noopener noreferrer">Santa Fe International Hostel</Link></li>
                  <li><Link href={"https://santafetreehousecamp.org/"} target="_blank" rel="noopener noreferrer">Santa Fe Tree-House Camp</Link> (bring your own linens for some treehouses)</li>
                  <li><Link href={"https://www.hipcamp.com/en-US/land/new-mexico-the-enchanted-llama-ranch-wz6hm5y1"} target="_blank" rel="noopener noreferrer">The Enchanted Llama Ranch</Link> (bring your own RV/camper, unless you book the <Link href={"https://www.airbnb.com/rooms/5401743"} target="_blank" rel="noopener noreferrer">Enchanted Yurt</Link>)</li>
                  <li>There are many beautiful <Link href={'https://www.recreation.gov/search?q=santa%20fe%2C%20nm&radius=50&inventory_type=camping&sort=available'} target="_blank" rel="noopener noreferrer">campsites along the Pecos River and in the mountains</Link> surrounding Santa Fe.</li>
                  <li>Check out <Link href={"https://www.hipcamp.com/en-US"} target="_blank" rel="noopener noreferrer">HipCamp</Link> for other unique listings of places to park your camper or bus, or to pitch a tent.</li>
                </ul>
                <p>There are cool Airbnbs aplenty in Santa Fe, but just be aware that locals have a lot of hostility toward Airbnb because of Santa Fe&apos;s affordable housing crisis and lackluster short-term rental laws. So if you stay in an Airbnb, just like, don&apos;t tell anyone. </p>
            </div>
            <div className="col-md-6">
              <ErrorBoundary>
                <HotelsMapClient />
              </ErrorBoundary>
            </div>
          </div>
          <h2>Shared Lodging</h2>
          <p>Want to share a rental house with other friends of Lydia and Steven? Fill out this li&apos;l form and we&apos;ll connect you to others who are looking to do the same! If there is enough interest, we may even try to rent one big place to be a guest flophouse.</p>
          <Link href={"https://form.jotform.com/253634237497163"} target="_blank" rel="noopener noreferrer" className="btn btn-midnight mb-5"><FontAwesomeIcon icon={faHotel} className="me-2" />Shared Lodging Interest Form</Link>
        </div>
      </main>
    </div>
  );
}
