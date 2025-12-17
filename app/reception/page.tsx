import Image from "next/image";

export default function Reception() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Reception</h1>
          <p className="mb-2">The reception will be held at</p>
            <address>
            <p className="mb-1"><strong>Tumbleroot Brewery &amp; Distillery</strong></p>
            <p className="mb-1">(Agua Fria Taproom)</p>
            <p className="mb-1">2791 Agua Fria Street</p>
            <p className="mb-0">Santa Fe, NM 87507</p>
            </address>
          <h2>Food</h2>
          <p>A family-style supper with vegetarian and gluten-free options will be served. We&apos;re sorry, but we cannot accommodate all food restrictions. If you have very specific food restrictions, please sneak in your own food. We won&apos;t tell.</p>
          <h2>Drinks</h2>
          <p>There will be two open bars (one inside, one outside). Available drinks will include house-brewed beer, wine, draft cocktails, and margaritas, as well as non-alcoholic options. Bring your ID.</p>
          <p>Please note that Santa Fe is at an elevation of 7000ft (higher than Denver)! If you are used to drinking at sea level, the alcohol you drink at altitude will have a stronger effect on you. Please designate a driver beforehand or download a ride app like Lyft or Uber, and drink plenty of water.</p>
          <h2>Parking</h2>
          <p>Parking is behind the brewery, with street entrance to the parking lot off of Agua Fria St. <strong>Once you park, enter the venue through the back patio.</strong> The front side of the building (facing the street) is not an entrance! From the back parking lot, you will see the actual entrance:</p>
            <figure className="figure">
            <Image
              src="/tumbleroot_entrance.jpg"
              alt="Entrance to Tumbleroot Brewery & Distillery"
              className="figure-img img-fluid rounded"
              width={1600}
              height={1200}
            />
            </figure>
            <p>You will enter the venue through a gate (behind the food truck) that looks like this:</p>
            <figure className="figure">
            <Image
              src="/tumbleroot_gate.png"
              alt="Gate to Tumbleroot Brewery & Distillery"
              className="figure-img img-fluid rounded"
              width={782}
              height={588}
            />
            </figure>
          <p>If you need ramp access to the reception venue, please let us know in advance so that we can arrange ramp entry.</p>
        </div>
      </main>
    </div>
  );
}