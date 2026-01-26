import Image from "next/image";
import Link from "next/link";

export default function Reception() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Reception</h1>
          <p className="mb-2">The reception will be held at:</p>
            <address>
            <p className="mb-1"><strong>Tumbleroot Brewery &amp; Distillery</strong></p>
            <p className="mb-1">(aka Agua Fria Taproom aka Tumbleroot Alegría)</p>
            <p className="mb-1">2791 Agua Fria Street</p>
            <p className="mb-0">Santa Fe, NM 87507</p>
            </address>
          <p>Bring your dancin&apos; shoes!</p>
          <h2>Food</h2>
          <p>Supper with vegetarian and gluten-free options will be served. We&apos;re sorry, but we cannot accommodate all food restrictions. If you have very specific food restrictions, please sneak in your own food. We won&apos;t tell.</p>
          <h2>Drink</h2>
          <p>There will be two open bars (one inside, one outside). Available drinks will include house-brewed beer, wine, draft cocktails, and margaritas, as well as non-alcoholic options. Bring your ID.</p>
          <p>Please note that Santa Fe is at an elevation of 7000ft (higher than Denver)! If you are used to drinking at sea level, the alcohol you drink at altitude will have a stronger effect on you. Please designate a driver beforehand or download a ride app like Lyft or Uber, and drink plenty of water.</p>
          <h2>Parking</h2>
          <p>Parking is behind the brewery, with street entrance to the parking lot off of Agua Fria St. <strong>Once you park, enter the venue through the back patio.</strong> The front side of the building (facing the street) is not an entrance! From the back parking lot, you will see the actual entrance:</p>
          <div className="row">
            <div className="col-md-12 col-lg-6 mb-3">
              <figure className="figure">
              <Image
                src="/tumbleroot_entrance.jpg"
                alt="Entrance to Tumbleroot Brewery & Distillery"
                className="figure-img img-fluid rounded"
                width={1600}
                height={1200}
              />
              </figure>
            </div>
            <p>You will enter the venue through a gate (behind the food truck) that looks like this:</p>
            <div className="row">
              <div className="col-md-12 col-lg-6 mb-3">
                <figure className="figure">
                <Image
                  src="/tumbleroot_gate.png"
                  alt="Gate to Tumbleroot Brewery & Distillery"
                  className="figure-img img-fluid rounded"
                  width={782}
                  height={588}
                />
                </figure>
              </div>
            </div>
            <p>If you need ramp access to the reception venue, please let us know in advance so that we can arrange ramp entry.</p>
            <h2>Potential Schedule</h2>
            <ol className="list-group ms-2 mb-4">
              <li className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">Cocktails and Supper</h5>
                  <div className="text-body">4:30-6:00pm</div>
                </div>
                <p className="mb-1">Enjoy drinks from the bar and join the feast! There is no assigned seating; sit at long community tables inside or picnic tables on the patio and get to know other guests from the myriad social worlds we have been blessed to be part of. Don&apos;t forget to leave us a voice message in our audio guest book: an antique phone that Steven (master tinkerer) turned into a recording device.</p>
              </li>
              <li className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Contra Dance with Live Music by <Link href={"https://sites.google.com/view/the-turquoise-tuners/home"} target="_blank">The Turquoise Tuners</Link></h5>
                  <div className="text-body">6-7pm</div>
                </div>
                <p className="mb-1">Contra dancing is a form of communal folk dance with roots in Appalachia. Traditionally danced to live fiddle music, it is a way for young and old to dance together and connect. It is similar to square dancing, but like, way cooler. A caller will walk you through the steps and each segment of the dance, so get out of your comfort zone and join the dance! No one is judging you, we promise.</p>
              </li>
              <li className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Cake and Champagne Toasts</h5>
                  <div className="text-body">7:30-8:15pm</div>
                </div>
                <p className="mb-1">After the toasts from our families, we will open the floor to anyone who would like to make a toast. We would love to hear from folks that make up the many different, beloved, community spheres of our Lydia-Steven Venn Diagram. We just ask that each toast be kept to under 2 or 3 minutes.</p>
              </li>
              <li className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Hafli & Greek Dancing</h5>
                  <div className="text-body">8:30-9pm</div>
                </div>
                <p className="mb-1">Lydia is a convert to the Antiochian Orthodox Christian Church (of Syrian/Arab tradition), and Steven is a convert to the Greek Orthodox Christian Church. As such, expect a bit of Arab dabke dancing and Greek line dancing! Everyone is invited to participate, even if this isn&apos;t your cultural background. Share our joy!</p>
              </li>
              <li className="list-group-item">
                <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">DJ Dance Party</h5>
                  <div className="text-body">9-10pm</div>
                </div>
                <p className="mb-1">We will end the night with a traditional Millennial dance party.</p>
              </li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}