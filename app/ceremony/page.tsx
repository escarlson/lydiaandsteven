import Image from "next/image";
import Link from "next/link";

export default function Ceremony() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Ceremony</h1>
          <p>The wedding will take place at:</p>
          <div className="row">
            <div className="col-md-12 col-lg-12">
              <address>
                <p className="mb-1"><strong>Holy Trinity Orthodox Church</strong></p>
                <p className="mb-1">231 E Cordova Rd</p>
                <p className="mb-0">Santa Fe, NM 87505</p>
              </address>
            </div>
            <div className="col-md-12 col-lg-6">
              <figure className="figure">
                <Image
                  src="/ht_exterior.webp"
                  placeholder="blur"
                  blurDataURL="data:image/octet-stream;base64,UklGRkgDAABXRUJQVlA4WAoAAAAgAAAABwAAAwAASUNDUKACAAAAAAKgbGNtcwRAAABtbnRyUkdCIFhZWiAH6QAMABgAFQAQAAthY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWxjbXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA1kZXNjAAABIAAAAEBjcHJ0AAABYAAAADZ3dHB0AAABmAAAABRjaGFkAAABrAAAACxyWFlaAAAB2AAAABRiWFlaAAAB7AAAABRnWFlaAAACAAAAABRyVFJDAAACFAAAACBnVFJDAAACFAAAACBiVFJDAAACFAAAACBjaHJtAAACNAAAACRkbW5kAAACWAAAACRkbWRkAAACfAAAACRtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACQAAAAcAEcASQBNAFAAIABiAHUAaQBsAHQALQBpAG4AIABzAFIARwBCbWx1YwAAAAAAAAABAAAADGVuVVMAAAAaAAAAHABQAHUAYgBsAGkAYwAgAEQAbwBtAGEAaQBuAABYWVogAAAAAAAA9tYAAQAAAADTLXNmMzIAAAAAAAEMQgAABd7///MlAAAHkwAA/ZD///uh///9ogAAA9wAAMBuWFlaIAAAAAAAAG+gAAA49QAAA5BYWVogAAAAAAAAJJ8AAA+EAAC2xFhZWiAAAAAAAABilwAAt4cAABjZcGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltjaHJtAAAAAAADAAAAAKPXAABUfAAATM0AAJmaAAAmZwAAD1xtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAEcASQBNAFBtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJWUDggggAAALACAJ0BKggABAAAAAAljAJ0TIB/ABRB5sbFfjpUAAD+/rZ24vK//G//Vz+Q0/zQf2Ct9XDuf//7V+xf/4b3rNVeHGYSHFnzMALTuQ/0Nz8+X40v+tP09f/obfTF/1kv/+jvwN2LfJ+PT/Ii37Pw5/xoasb/4ZRXb/xf//jUm76WAAA="
                  alt="Holy Trinity Orthodox Church exterior"
                  className="figure-img img-fluid rounded"
                  width={4080}
                  height={2260}
                />
              </figure>
            </div>
          </div>
          
          <h2>Time</h2>
          <p>The wedding will begin at 3:00pm sharp. Please arrive early.</p>
          <h2>Seating</h2>
          <p>It is traditional to stand during Orthodox services, and many Orthodox churches (including Holy Trinity) have an open floor plan with no rows of seats! <strong>Seating is extremely limited and will be strictly reserved for those in need of this accommodation.</strong> If you know that you or someone in your party will need a seat, please fill out this short form so that we can be sure to have a chair reserved for you:</p>
          <a href="https://form.jotform.com/253634634923057" target="_blank" rel="noopener noreferrer" className="btn btn-copper mb-3">Ceremony Seating Accommodation Form</a>
          <p>For everyone else, the wedding will be standing room only. Plan on packing in close to the front of the church and around the couple. Please move in from the doors so that other guests can enter. Additional standing room can be found in the balcony (up the hallway stairs and through the door to your left).</p> 
          <p>The wedding ceremony is about 45 minutes to an hour long.</p>
          <h2>Parking</h2>
          <p>Parking will be tight! Please consider carpooling. Some parking near the church will be reserved for the wedding party and family. A couple of wheelchair accessible parking spots will be available near the church.</p>
          <p>Parking map coming soon!</p>
          <h2>Dress</h2>
          <p>Please dress respectfully. Silliness will ensue at the reception, but not at the ceremony. 😀</p>
          <p>We recommend comfortable shoes or removing your shoes. Both are acceptable in an Orthodox church (the bride and groom will be barefoot). If you choose to remove your shoes, please leave your shoes by the entrance.</p>
          <h2>Kids</h2>
          <p>Kiddos are an important part of the community and are considered active participants in Orthodox services! We welcome them at the ceremony. However, if your child is having a meltdown or just needs a break, there is a nursery/kids room where you can take them that is just outside the back doors of the narthex, immediately to the left.</p>
          <h2>What&apos;s Happening</h2>
          <p>First time at an Orthodox wedding? Never fear! We put together this guide so you can better understand what&apos;s going on during the ceremony.</p>
          <Link href="/ceremony/guide" className="btn btn-copper mb-2">Guide to the Orthodox Wedding Ceremony</Link>
          <h2>FAQ</h2>
          <div className="accordion accordion-copper mb-5" id="faqAccordion">
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
                  <p>There are no vows in the Orthodox wedding ceremony; rather, the wedding is understood as a mystical sacrament and holy mystery in which God makes two into one. The bride and groom are active participants in this mystery, but the prayers, readings, and actions that take place are a set ritual unchanged from ancient times. The bride and groom enter of their own free will as mutual participants in this mystical sacrament.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}