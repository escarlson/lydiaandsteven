'use client';
import Link from "next/link";
import { Macondo } from "next/font/google";
import { usePathname } from "next/navigation";
import '../globals.css';

const macondo = Macondo({
  variable: "--font-macondo",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Header() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    !!pathname && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <header className="bg-light border-bottom">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid" style={{ paddingLeft: '2rem', paddingRight: '25%' }}>
          <Link className={`navbar-brand ${macondo.className}`} href="/">Lydia & Steven</Link>
          <Link className={`nav-link ${isActive("/ceremony") ? "active" : ""}`} href="/ceremony">Ceremony</Link>
          {/* <Link className={`nav-link ${isActive("/reception") ? "active" : ""}`} href="/reception">Reception</Link> */}
          {/* <Link className={`nav-link ${isActive("/lodging") ? "active" : ""}`} href="/lodging">Lodging</Link> */}
          <Link className={`nav-link ${isActive("/transit") ? "active" : ""}`} href="/transit">Transit</Link>
          {/* <Link className={`nav-link ${isActive("/rsvp") ? "active" : ""}`} href="/rsvp">RSVP</Link> */}
          {/* <Link className={`nav-link ${isActive("/photos") ? "active" : ""}`} href="/photos">Photos</Link> */}
        </div>
      </nav>
    </header>
  );
}