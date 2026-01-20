'use client';
import Link from "next/link";
import { Macondo } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useRouter } from "next/navigation";

const macondo = Macondo({
  variable: "--font-macondo",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const handleSignOut = async () => {
    await authClient.signOut();
    setOpen(false);
    router.push("/");
    router.refresh(); // ensure fresh data/render after sign-out
  };

  const isActive = (href: string) =>
    !!pathname && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <header className="border-bottom fixed-top">
      <nav className="navbar navbar-expand-md bg-copper" data-bs-theme="dark">
        <div className="container-fluid" style={{ paddingLeft: '2rem' }}>
          <Link className={`navbar-brand ${macondo.className}`} href="/" onClick={() => setOpen(false)}>Lydia & Steven</Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarSupportedContent"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen(!open)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className={`collapse navbar-collapse ${open ? "show" : ""}`} id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item">
                <Link className={`nav-link ${isActive("/ceremony") ? "active" : ""}`} href="/ceremony" onClick={() => setOpen(false)} aria-current={isActive("/ceremony") ? "page" : undefined}>Ceremony</Link>
                </li>
                <li className="nav-item">
                <Link className={`nav-link ${isActive("/reception") ? "active" : ""}`} href="/reception" onClick={() => setOpen(false)} aria-current={isActive("/reception") ? "page" : undefined}>Reception</Link>
                </li>
                <li className="nav-item">
                <Link className={`nav-link ${isActive("/lodging") ? "active" : ""}`} href="/lodging" onClick={() => setOpen(false)} aria-current={isActive("/lodging") ? "page" : undefined}>Lodging</Link>
                </li>
                <li className="nav-item">
                <Link className={`nav-link ${isActive("/transit") ? "active" : ""}`} href="/transit" onClick={() => setOpen(false)} aria-current={isActive("/transit") ? "page" : undefined}>Transit</Link>
                </li>
                <li className="nav-item">
                <Link className={`nav-link ${isActive("/thingstodo") ? "active" : ""}`} href="/thingstodo" onClick={() => setOpen(false)} aria-current={isActive("/thingstodo") ? "page" : undefined}>Things to Do</Link>
                </li>
                <li className="nav-item">
                <Link className={`nav-link ${isActive("/photos") ? "active" : ""}`} href="/photos" onClick={() => setOpen(false)} aria-current={isActive("/photos") ? "page" : undefined}>Photos</Link>
                </li>
                <li className="nav-item">
                <Link className={`nav-link ${isActive("/registry") ? "active" : ""}`} href="/registry" onClick={() => setOpen(false)} aria-current={isActive("/registry") ? "page" : undefined}>Registry</Link>
                </li>
                <li className="nav-item">
                <Link className={`nav-link ${isActive("/rsvp") ? "active" : ""}`} href="/rsvp" onClick={() => setOpen(false)} aria-current={isActive("/rsvp") ? "page" : undefined}>RSVP</Link>
                </li>
                <li className="nav-item">
                  {!isPending && session?.user && (
                    <button
                      onClick={handleSignOut}
                      className="btn btn-link nav-link text-start"
                    >
                      Sign Out
                    </button>
                  )}
                </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}