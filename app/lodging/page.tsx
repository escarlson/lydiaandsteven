import Link from "next/link";

export default function Lodging() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Lodging</h1>
          <p>We are working on hotel blocks and other lodging options for our guests. Stay tuned!</p>
          <p>Want to share a rental house with other friends of Lydia and Steven? Fill out this li&apos;l form and we&apos;ll connect you to others who are looking to do the same! If there is enough interest, we may even try to rent one big place to be a guest flophouse.</p>
          <Link href="https://form.jotform.com/253634237497163" target="_blank" rel="noopener noreferrer" className="btn btn-copper mb-5">Shared Lodging Interest Form</Link>
        </div>
      </main>
    </div>
  );
}