import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChampagneGlasses,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";
import GetDirections from "../components/GetDirections";

export default function FastFacts() {
  return (
    <div>
      <main>
        <div className="container">
          <h1>Fast Facts</h1>

          <div className="card">
            <div className="card-header card-header-copper">
              <ul className="nav nav-tabs card-header-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link nav-link-midnight active"
                    id="ceremony-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#ceremony-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="ceremony-tab-pane"
                    aria-selected="true"
                  >
                    <FontAwesomeIcon className="button-icon me-2" icon={faCrown} />
                    Ceremony
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link nav-link-midnight"
                    id="reception-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#reception-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="reception-tab-pane"
                    aria-selected="false"
                  >
                    <FontAwesomeIcon
                      className="button-icon me-2"
                      icon={faChampagneGlasses}
                    />
                    Reception
                  </button>
                </li>
              </ul>
            </div>

            <div className="card-body tab-content">
              <div
                className="tab-pane fade show active"
                id="ceremony-tab-pane"
                role="tabpanel"
                aria-labelledby="ceremony-tab"
              >
                <ul className="card-text mb-0">
                  <li>
                    <strong>Where:</strong>
                    <address>
                      <p className="mb-1">Holy Trinity Orthodox Church</p>
                      <p className="mb-1">231 E Cordova Rd</p>
                      <p className="mb-0">Santa Fe, NM 87505</p>
                    </address>
                    <GetDirections
                      googleURL="https://maps.app.goo.gl/qMDi1nsk7xquH31g8"
                      wazeURL="https://ul.waze.com/ul?place=ChIJh3oDw1hQGIcRdUOEsAlTFAo&ll=35.67021380%2C-105.93938780&navigate=yes"
                    />
                  </li>
                  <li>
                    <strong>When:</strong> 3pm but get there early
                  </li>
                  <li>
                    <strong>Dress:</strong> LYDIA PUT SOMETHING HERE
                  </li>
                  <li>
                    <strong>Parking:</strong> Tight. Please carpool and check the {" "}
                    <Link href="/ceremony#parking">parking map</Link>.
                  </li>
                  <li>
                    <strong>Kids:</strong> Yes
                  </li>
                </ul>
              </div>

              <div
                className="tab-pane fade"
                id="reception-tab-pane"
                role="tabpanel"
                aria-labelledby="reception-tab"
              >
                <ul className="card-text mb-0">
                  <li>
                    <strong>Where:</strong>
                    <address>
                      <p className="mb-1">Tumbleroot Brewery &amp; Distillery</p>
                      <p className="mb-1">(aka Agua Fria Taproom aka Tumbleroot Alegría)</p>
                      <p className="mb-1">2791 Agua Fria Street</p>
                      <p className="mb-0">Santa Fe, NM 87507</p>
                    </address>
                    <GetDirections
                      googleURL="https://maps.app.goo.gl/rkc1ByBkbD82ng1V7"
                      wazeURL="https://ul.waze.com/ul?venue_id=166461797.1664683503.20577513&overview=yes"
                    />
                  </li>
                  <li>
                    <strong>When:</strong> 4:30pm
                  </li>
                  <li>
                    <strong>Parking:</strong> Plenty
                  </li>
                  <li>
                    <strong>Kids:</strong> Yes. Drinks for kids 21+.
                  </li>
                  <li>
                    <strong>Food:</strong> BBQ with vegetarian option
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}