import Link from "next/link";

export default function Admin() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Admin</h1>
          <p>Welcome to the admin panel. Here you can manage various aspects of the wedding website.</p>
          <ul className="list-unstyled">
            <li><Link href="/admin/rsvp/create" className="btn btn-copper mb-2">Create Invitations</Link></li>
        {/* <li><Link href="/admin/rsvp/list" className="btn btn-copper mb-2">Manage Invitations</Link></li>
            <li><Link href="/admin/guests" className="btn btn-copper mb-2">Manage Guests</Link></li> */}
          </ul>
        </div>
      </main>
    </div>
  );
}