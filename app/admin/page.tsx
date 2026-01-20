"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";

// Force dynamic rendering so this page never serves cached HTML
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Admin() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (!session?.user) {
    // Redirecting; render nothing to avoid flashing protected content
    return null;
  }

  const userName = session.user.name;

  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Admin</h1>
          <p className={userName === "Lydia O'Reilly" ? "h4" : "d-none"}>Hi, Lydia! 😘</p>
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