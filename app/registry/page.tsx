import Link from "next/link";

export default function Registry() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Registry</h1>
          <p>We have a universal registry at Joy, and a separate registry at Etsy.</p>
          <div className="row row-cols-auto">
            <div className="col mb-3">
              <Link href="https://withjoy.com/lydia-and-steven-sep-26/registry" target="_blank" rel="noopener noreferrer" className="d-block btn btn-copper">Joy Registry</Link>
            </div>
            <div className="col mb-3">
              <Link href="https://www.etsy.com/registry/MTY3MDEwMDcxfDEyNTM1NDcz" target="_blank" rel="noopener noreferrer" className="d-block btn btn-copper">Etsy Registry</Link>
            </div>
          </div>
          <h2>Gift Cards</h2>
          <p>We would love gift cards from:</p>
          <ul>
            <li>Grocery stores (Trader Joe&apos;s, Smith&apos;s, Sprouts, Albertsons)</li>
            <li>Home goods stores (Target, World Market)</li>
            <li>General (Amazon, Home Depot)</li>
          </ul>
          <h2>Secondhand Items</h2>
          <p>We are looking for the following used items, if you have old stuff you would like to find a new home for:</p>
          <ul>
            <li>Bookshelves of any kind</li>
            <li>Plant stands of any kind</li>
            <li>Queen-size bedframe</li>
            <li>Two dining room chairs</li>
            <li>Dresser</li>
          </ul>
          <p>Please contact us if you might have one of these items to offer, so we can coordinate pickup.</p>
        </div>
      </main>
    </div>
  );
}