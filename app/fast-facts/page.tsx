import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareParking,
  faChampagneGlasses,
  faChild,
  faClock,
  faCrown,
  faLocationDot,
  faShirt,
  faUtensils,
} from "@fortawesome/free-solid-svg-icons";
import GetDirections from "../components/GetDirections";

export default function FastFacts() {
  return (
    <div>
      <main>
        <div className="container">
          <h1>Fast Facts</h1>

          <div className="card">
            <div className="card-header">
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
                <div className="row g-3">
                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="d-flex flex-column align-items-center text-center h-100 p-2">
                      <div className="mb-2 text-dark">
                        <FontAwesomeIcon className="button-icon-lg" icon={faLocationDot} />
                      </div>
                      <div className="fw-bold mb-2 text-dark">Where</div>
                      <div className="text-dark small lh-base">
                        <address className="mb-2">
                          <p className="mb-1">Holy Trinity Orthodox Church</p>
                          <p className="mb-1">231 E Cordova Rd</p>
                          <p className="mb-0">Santa Fe, NM 87505</p>
                        </address>
                        <GetDirections
                          googleURL="https://maps.app.goo.gl/qMDi1nsk7xquH31g8"
                          wazeURL="https://ul.waze.com/ul?place=ChIJh3oDw1hQGIcRdUOEsAlTFAo&ll=35.67021380%2C-105.93938780&navigate=yes"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="d-flex flex-column align-items-center text-center h-100 p-2">
                      <div className="mb-2 text-dark">
                        <FontAwesomeIcon className="button-icon-lg" icon={faClock} />
                      </div>
                      <div className="fw-bold mb-2 text-dark">When</div>
                      <div className="text-dark small lh-base">3pm, but get there early</div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="d-flex flex-column align-items-center text-center h-100 p-2">
                      <div className="mb-2 text-dark">
                        <FontAwesomeIcon className="button-icon-lg" icon={faShirt} />
                      </div>
                      <div className="fw-bold mb-2 text-dark">Dress</div>
                      <div className="text-dark small lh-base">LYDIA PUT SOMETHING HERE</div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="d-flex flex-column align-items-center text-center h-100 p-2">
                      <div className="mb-2 text-dark">
                        <FontAwesomeIcon className="button-icon-lg" icon={faSquareParking} />
                      </div>
                      <div className="fw-bold mb-2 text-dark">Parking</div>
                      <div className="text-dark small lh-base">
                        Tight. Please carpool and check the {" "}
                        <Link href="/ceremony#parking">parking map</Link>.
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="d-flex flex-column align-items-center text-center h-100 p-2">
                      <div className="mb-2 text-dark">
                        <FontAwesomeIcon className="button-icon-lg" icon={faChild} />
                      </div>
                      <div className="fw-bold mb-2 text-dark">Kids</div>
                      <div className="text-dark small lh-base">Yes</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="tab-pane fade"
                id="reception-tab-pane"
                role="tabpanel"
                aria-labelledby="reception-tab"
              >
                <div className="row g-3">
                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="d-flex flex-column align-items-center text-center h-100 p-2">
                      <div className="mb-2 text-dark">
                        <FontAwesomeIcon className="button-icon-lg" icon={faLocationDot} />
                      </div>
                      <div className="fw-bold mb-2 text-dark">Where</div>
                      <div className="text-dark small lh-base">
                        <address className="mb-2">
                          <p className="mb-1">Tumbleroot Brewery &amp; Distillery</p>
                          <p className="mb-1">2791 Agua Fria Street</p>
                          <p className="mb-0">Santa Fe, NM 87507</p>
                        </address>
                        <GetDirections
                          googleURL="https://maps.app.goo.gl/rkc1ByBkbD82ng1V7"
                          wazeURL="https://ul.waze.com/ul?venue_id=166461797.1664683503.20577513&overview=yes"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="d-flex flex-column align-items-center text-center h-100 p-2">
                      <div className="mb-2 text-dark">
                        <FontAwesomeIcon className="button-icon-lg" icon={faClock} />
                      </div>
                      <div className="fw-bold mb-2 text-dark">When</div>
                      <div className="text-dark small lh-base">4:30pm</div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="d-flex flex-column align-items-center text-center h-100 p-2">
                      <div className="mb-2 text-dark">
                        <FontAwesomeIcon className="button-icon-lg" icon={faSquareParking} />
                      </div>
                      <div className="fw-bold mb-2 text-dark">Parking</div>
                      <div className="text-dark small lh-base">Plenty of parking in back.</div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="d-flex flex-column align-items-center text-center h-100 p-2">
                      <div className="mb-2 text-dark">
                        <FontAwesomeIcon className="button-icon-lg" icon={faChild} />
                      </div>
                      <div className="fw-bold mb-2 text-dark">Kids</div>
                      <div className="text-dark small lh-base">Yes. Drinks for kids 21+.</div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="d-flex flex-column align-items-center text-center h-100 p-2">
                      <div className="mb-2 text-dark">
                        <FontAwesomeIcon className="button-icon-lg" icon={faUtensils} />
                      </div>
                      <div className="fw-bold mb-2 text-dark">Food</div>
                      <div className="text-dark small lh-base">BBQ with vegetarian option</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}