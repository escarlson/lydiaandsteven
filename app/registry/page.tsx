export default function Registry() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Registry</h1>
          <p>We have a universal registry at Joy, and a separate registry at Etsy.</p>
          <div className="row row-cols-auto">
            <div className="col mb-3">
              <div className="btn btn-copper mb-3">Joy Registry</div>
            </div>
            <div className="col mb-3">
              <div className="btn btn-copper mb-3">Etsy Registry</div>
            </div>
          </div>
          <h2>Gift Cards</h2>
          <p>We would love gift cards from:</p>
          <ul>
            <li>Grocery stores (Trader Joe&apos;s, Smith&apos;s, Sprouts, Albertsons)</li>
            <li>Home goods stores (Target, World Market)</li>
            <li>General (Amazon, Home Depot)</li>
          </ul>
          <h2>Second-hand Items</h2>
          <p>We are looking for the following used items, if you have old stuff you would like to find a new home for:</p>
          <ul>
            <li>Bookshelves of any kind</li>
            <li>Plant stands of any kind</li>
            <li>Queen-size bedframe</li>
            <li>Two dining room chairs</li>
            <li>Dresser</li>
          </ul>
        </div>
      </main>
    </div>
  );
}