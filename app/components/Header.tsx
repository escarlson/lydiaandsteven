'use client';
import Link from "next/link";
import { Macondo } from "next/font/google";
import { usePathname } from "next/navigation";
import { useState } from "react";
import '../globals.css';

const macondo = Macondo({
  variable: "--font-macondo",
  subsets: ["latin"],
  weight: ["400"],
});

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    !!pathname && (pathname === href || pathname.startsWith(href + "/"));

  return (
    <header className="bg-light border-bottom fixed-top">
      <nav className="navbar navbar-expand-sm navbar-light"> {/* navbar-expand-sm will need to be changed as we add more items */}
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
                <Link className={`nav-link ${isActive("/ceremony") ? "active" : ""}`} href="/ceremony" onClick={() => setOpen(false)}>Ceremony</Link>
              </li>
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/reception") ? "active" : ""}`} href="/reception" onClick={() => setOpen(false)}>Reception</Link>
              </li>
              {/* <li className="nav-item">... lodging ...</li> */}
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/transit") ? "active" : ""}`} href="/transit" onClick={() => setOpen(false)}>Transit</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}