import Image from "next/image";
import HTExterior from "@/public/ht_exterior_new.jpg"
import WhereToStand from "@/public/where_to_stand.webp"
import WeddingParking from "@/public/WeddingParking.png"
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChampagneGlasses, faCrown, faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import GetDirections from "../components/GetDirections";

export default function FastFacts() {
  return (
    <div>
      <main>
        <div className="container">
          <h1>Fast Facts</h1>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="card pb-2">
                <div className="card-body">
                <h2 className="card-title"><FontAwesomeIcon className="button-icon me-2" icon={faCrown}></FontAwesomeIcon>Ceremony</h2>
                <ul className="card-text">
                <li><strong>Where:</strong><address>
                                <p className="mb-1">Holy Trinity Orthodox Church</p>
                                <p className="mb-1">231 E Cordova Rd</p>
                                <p className="mb-0">Santa Fe, NM 87505</p>
                              </address>
                              <GetDirections googleURL = "https://maps.app.goo.gl/qMDi1nsk7xquH31g8" wazeURL = "https://ul.waze.com/ul?place=ChIJh3oDw1hQGIcRdUOEsAlTFAo&ll=35.67021380%2C-105.93938780&navigate=yes"/></li>
                <li><strong>When:</strong> 3pm but get there early</li>
                <li><strong>Dress:</strong> LYDIA PUT SOMETHING HERE</li>
                <li><strong>Parking:</strong> tight. please carpool and check <Link href={"/ceremony#parking"}>parking map</Link>.</li>
                <li><strong>Kids:</strong> yes</li>
               </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card pb-2">
                <div className="card-body">
                <h2 className="card-title"><FontAwesomeIcon className="button-icon me-2" icon={faChampagneGlasses}></FontAwesomeIcon>Reception</h2>
                <ul className="card-text">
                <li><strong>Where:</strong><address>
                                <p className="mb-1">Tumbleroot Brewery &amp; Distillery</p>
                                <p className="mb-1">(aka Agua Fria Taproom aka Tumbleroot Alegría)</p>
                                <p className="mb-1">2791 Agua Fria Street</p>
                                <p className="mb-0">Santa Fe, NM 87507</p>
                                </address>
                                <GetDirections googleURL="https://maps.app.goo.gl/rkc1ByBkbD82ng1V7" wazeURL="https://ul.waze.com/ul?venue_id=166461797.1664683503.20577513&overview=yes" /></li>
                <li><strong>When:</strong> 4:30pm</li>
                <li><strong>Parking:</strong> plenty</li>
                <li><strong>Kids:</strong> yes. drinks for kids 21+.</li>
                <li><strong>Food:</strong> BBQ with vegetarian option</li>
               </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}