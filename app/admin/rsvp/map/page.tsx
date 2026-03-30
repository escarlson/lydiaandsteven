import RSVPMapClient from "@/app/components/RSVPMapClient";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function RSVPMapPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  
  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="py-2">
      <div className="row mb-4">
        <div className="col">
          <h1>RSVP Map</h1>
          <p className="text-muted">
            View the geographic distribution of invitations and responses by postal code.
          </p>
        </div>
      </div>
      
      <div className="row">
        <div className="col">
          <RSVPMapClient />
        </div>
      </div>
    </div>
  );
}
