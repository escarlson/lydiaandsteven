'use client';

import { Macondo, Caveat } from "next/font/google";
import dayjs from "dayjs";
import Sunset from "./lib/sunset";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const macondo = Macondo({
  variable: "--font-macondo",
  subsets: ["latin"],
  weight: ["400"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400"],
});

dayjs.locale("en");

export default function Home() {
  const [sunsetsRemaining, setSunsetsRemaining] = useState<number | null>(null);

  useEffect(() => {
    dayjs.locale("en");
    const now = dayjs().format();
    const weddingDate = dayjs("2026-09-20T15:00:00-06:00");
    
    // Fetch sunset asynchronously
    const fetchSunset = async () => {
      const sunsetTime = await Sunset();
      const remaining = weddingDate.diff(now, "day") + (sunsetTime > now ? 0 : 1);
      setSunsetsRemaining(remaining);
    };
    
    fetchSunset();
  }, []); // Runs once on mount

  return (
    <main className="d-flex align-items-center justify-content-center">
      <div className="container text-center mt-4">
        
        <div className="row">
          <div className="col">
          <h1 className={`${macondo.className} display-1`}>Lydia &amp; Steven</h1>
          <p className="display-6 mb-3">September 20, 2026 | Santa Fe, NM</p>
          {/* <p className="display-6 mb-3">Santa Fe, NM</p> */}
          </div>
        </div>
        <div className="row justify-content-center mb-auto mb-4 mt-4">
          <p>Welcome to our wedding website! Buckle up for way more information than you asked for.</p>
        </div>
        <div className="row justify-content-center mb-auto mb-4 mt-4">
          <div className="col-md-8 col-lg-6">
            <Link href="/rsvp" className="btn btn-midnight btn-lg">RSVP</Link>
          </div>
        </div>
        <div className="row justify-content-center mt-4">
          <p id="sunsetCounter" className={`${caveat.className} mb-0 mt-4`} style={{fontSize: '2rem'}}>
            {sunsetsRemaining === null ? (
              <span className="text-muted">Calculating sunsets…</span>
            ) : (
              <>
                <span id="numSunsets">{sunsetsRemaining}</span> more{" "}
                {sunsetsRemaining === 1 ? "sunset" : "sunsets"}
              </>
            )}
          </p>
          <div className="col-md-8 col-lg-6">
            <div>
              <figure className="figure">       
                <Image
                  src="/little_prince_sunset_cropped.jpg"
                  alt=""
                  aria-labelledby="littlePrinceCaption"
                  width={1200}
                  height={800}
                  className="figure-img img-fluid z-10"
                  loading="eager"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '50%',
                    width: 'auto',
                    height: 'auto',
                  }}
                />
                <figcaption className="figure-caption" id="littlePrinceCaption">
                The Little Prince observes the sunset from Asteroid B-612. Antoine de Saint-Exupéry, 1943.
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
