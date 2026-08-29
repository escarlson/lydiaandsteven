import Image from "next/image";
import HTExterior from "@/public/ht_exterior_new.jpg"
import WhereToStand from "@/public/where_to_stand.webp"
import WeddingParking from "@/public/WeddingParking.png"
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChair, faCrown, faCalendarPlus } from "@fortawesome/free-solid-svg-icons";
import GetDirections from "../components/GetDirections";

export default function Ceremony() {
  return (
    <div>
      <main>
        <div className="container">
          <h1>Ceremony</h1>
          <div className="row">
            <div className="col-xs-12 col-md-6">
              <p>The wedding will take place at:</p>
              <address>
                <p className="mb-1"><strong>Holy Trinity Orthodox Church</strong></p>
                <p className="mb-1">231 E Cordova Rd</p>
                <p className="mb-0">Santa Fe, NM 87505</p>
              </address>
              <GetDirections googleURL = "https://maps.app.goo.gl/qMDi1nsk7xquH31g8" wazeURL = "https://ul.waze.com/ul?place=ChIJh3oDw1hQGIcRdUOEsAlTFAo&ll=35.67021380%2C-105.93938780&navigate=yes"/>
            </div>
            <div className="col-xs-12 col-md-6">
              <figure className="figure">
                <Image
                  src={HTExterior}
                  placeholder="blur"
                  alt="Holy Trinity Orthodox Church exterior"
                  className="figure-img img-fluid rounded"
                  width={4000}
                  height={2673}
                />
              </figure>
            </div>
          </div>
          <h2>Time</h2>
          <p><strong>The wedding will begin at 3:00pm sharp. Please arrive early.</strong> The choir will begin singing around 2:45pm.</p>
          <div className="mb-4">
            <div className="dropdown">
              <button
                className="btn btn-outline-midnight btn-sm dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FontAwesomeIcon icon={faCalendarPlus} className="button-icon me-2" />
                Add to Calendar
              </button>
              <ul className="dropdown-menu dropdown-menu-midnight">
                <li>
                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Lydia+and+Steven+Carlson+Wedding+Ceremony&dates=20260920T150000/20260920T160000&ctz=America%2FDenver&location=Holy+Trinity+Orthodox+Church,+231+E+Cordova+Rd,+Santa+Fe,+NM+87505&details=https%3A%2F%2Flydiaandsteven.wedding"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dropdown-item"
                  >
                    Google Calendar
                  </a>
                </li>
                <li>
                  <a
                    href="https://outlook.live.com/calendar/0/deeplink/compose?subject=Lydia+and+Steven+Carlson+Wedding+Ceremony&location=Holy+Trinity+Orthodox+Church,+231+E+Cordova+Rd,+Santa+Fe,+NM+87505&startdt=2026-09-20T15:00:00-06:00&enddt=2026-09-20T16:00:00-06:00&ctz=America%2FDenver&body=https%3A%2F%2Flydiaandsteven.wedding"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dropdown-item"
                  >
                    Outlook Calendar
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <h2>Seating</h2>
          <p>It is traditional to stand during Orthodox services, and many Orthodox churches (including Holy Trinity) have an open floor plan with no rows of seats! <strong>Seating is extremely limited and will be strictly reserved for those in need of this accommodation.</strong> If you know that you or someone in your party will need a seat, please fill out this short form so that we can be sure to have a chair reserved for you:</p>
          <a href="https://form.jotform.com/253634634923057" target="_blank" rel="noopener noreferrer" className="btn btn-midnight mb-3 inline-link"><FontAwesomeIcon icon={faChair} className="button-icon" />Ceremony Seating Accommodation Form</a>
          <p>For everyone else, the wedding will be standing room only. Plan on packing in close to the front of the church and around the couple. Please move in from the doors so that other guests can enter. Additional standing room can be found in the balcony (up the hallway stairs and through the door to your left).</p>
          <p>Guests are welcome to sit on the floor before the service begins and during the homily. This is normal.</p>
          <p>The wedding ceremony is about 45 minutes to an hour long.</p>
          <div className="row">
            <div className="col-md-12 col-lg-6">
              <figure className="figure">
                <Image
                  src={WhereToStand}
                  placeholder="blur"
                  alt="Annotated image showing where to stand in the church"
                  className="img-fluid figure-img my-4 rounded"
                  width={1600}
                  height={1200}
                />
                <figcaption className="figure-caption" style={{ fontSize: "1em" }}>Come close! Move forward and in! Don&apos;t amass in the back!</figcaption>
              </figure>
            </div>
          </div>
          <h2>Parking</h2>
          <div className="row">
            <div className="col-md-12 col-lg-4">
              <p>Parking will be tight! Please consider carpooling. Some parking near the church will be reserved for the wedding party and family. A couple of wheelchair accessible parking spots will be available near the church.</p>
              <p>Please park in the green spaces. Do not obstruct the path of traffic indicated by the yellow arrows or the emergency vehicle access areas marked in red.</p>
              <p>Hot Tips:</p>
              <ul>
                <li>Arrive early if you would like to park near the church</li>
                <li>Park at Trader Joe&apos;s down the road and carpool from there</li>
                <li>Use Seville Rd or Madrid Rd to drive one block north of the church, and park on Barcelona St (parallel to Cordova Rd)</li>
              </ul>
              
            </div>
            <div className="col-md-12 col-lg-8">
              <figure className="figure">
                <Image
                  src={WeddingParking}
                  alt="Map showing parking options near the church"
                  className="img-fluid figure-img rounded"
                  loading="lazy"
                  width={1022}
                  height={462}
                />
              </figure>
              <h3>Key</h3>
              <div className="col-6 col-sm-6 col-md-6 col-lg-4 d-inline-flex">
                <div className="rectangle-green rounded me-2"></div>Good
              </div>
              <div className="col-6 col-sm-6 col-md-6 col-lg-4 d-inline-flex">
                <div className="rectangle-red rounded me-2"></div>No
              </div>
              <div className="col-6 col-sm-6 col-md-6 col-lg-4 d-inline-flex">
                <div className="rectangle-blue rounded me-2"></div>Handicap space
              </div>             
              <div className="col-6 col-sm-6 col-md-6 col-lg-4 d-inline-flex align-items-center">
                <div className="rectangle-brown rounded me-2"></div>Fence
              </div>
              <div className="col-10 col-sm-10 col-md-8 col-lg-8 d-inline-flex">
                <div>
                  <Image src="/right-arrow-yellow.svg" alt="Right arrow" width={50} height={25} />
                </div>
                <div className="ms-2">
                </div>Ideal flow of traffic; do not obstruct
              </div>
              <div className="col-10 col-sm-10 col-md-8 col-lg-10 d-inline-flex align-items-center">
                <div className="me-2">
                  <Image src="/up-arrow-purple.svg" alt="Up arrow" width={25} height={50} />
                </div>Church entrance (double doors under arch)
              </div>
              
            </div>
          </div>
          <h2>Dress</h2>
          <p>Please dress respectfully. Silliness will ensue at the reception, but not at the ceremony. 😀</p>
          <p>We recommend comfortable shoes or removing your shoes. Both are acceptable in an Orthodox church (the bride and groom will be barefoot). If you choose to remove your shoes, please leave your shoes by the entrance.</p>
          <h2>Kids</h2>
          <p>Kiddos are an important part of the community and are considered active participants in Orthodox services! We welcome them at the ceremony. However, if your child is having a meltdown or just needs a break, there is a nursery/kids room where you can take them that is just outside the back doors of the narthex, immediately to the left.</p>
          <h2>What&apos;s Happening</h2>
          <p>First time at an Orthodox wedding? Never fear! We wrote this guide so you can better understand what&apos;s going on during the ceremony.</p>
          <Link href="/ceremony/guide" className="btn btn-midnight mb-4 inline-link"><FontAwesomeIcon icon={faCrown} className="button-icon" />Guide to the Orthodox Wedding Ceremony</Link>
          <p>Please limit your phone photography within reason. If you would like to take photos of the dome and wall paintings by our world-renowned Russian-Georgian iconographers, please do so after the ceremony has finished.</p>
          <h2>FAQ</h2>
          <div className="accordion accordion-midnight mb-5" id="faqAccordion">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                  Why have I never heard of the Orthodox Church? Is this a cult?
                </button>
              </h2>
              <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  No. Eastern Orthodox Christianity is an ancient faith that has existed since the time of the Apostles and continues today on every continent, with particularly large populations in the Middle East (Syria, Lebanon, Palestine), Eastern Mediterranean (Greece, Macedonia, Turkey), North and Eastern Africa (Egypt, Ethiopia, Eritrea), and Eastern Europe (Ukraine, Georgia, Russia). Orthodox Christianity is relatively new to the United States, growing over time through the Orthodox diaspora and converts.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  I read online that women must cover their hair in an Orthodox church. Do I need to wear a head scarf?
                </button>
              </h2>
              <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  No. Both covered and uncovered hair are acceptable. It is up to the individual whether she chooses to wear a head scarf.
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  The priests and deacons keep walking towards me and I keep having to shuffle out of the way. Am I in the wrong spot or in the way?
                </button>
              </h2>
              <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  No. In an Orthodox church, people are not fixed to their spots, and there is a fluidity of movement as different parts of the service are enacted in different parts of the space. It is normal for priests, deacons, and parishioners to move around as necessary. Pack in close, crowd around the bride and groom, and move out of their direct path when needed. The only place that guests cannot stand is in the altar behind the iconostasis (icon screen).
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  Why aren&apos;t the bride and bridegroom saying anything?
                </button>
              </h2>
              <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                <div className="accordion-body">
                  <p>There are no vows in the Orthodox wedding ceremony; rather, the wedding is understood as a holy mystery in which God makes two into one. The bride and groom are active participants in this mystery, but the prayers, readings, and actions that take place are a set ritual unchanged from ancient times. The bride and groom enter of their own free will as mutual participants in this mystical sacrament.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}