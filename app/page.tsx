'use client';

import { Macondo } from "next/font/google";
import dayjs from "dayjs";
import Sunset from "./lib/sunset";
import { useEffect, useState } from "react";
import Image from "next/image";

const macondo = Macondo({
  variable: "--font-macondo",
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
    <main className="d-flex align-items-center justify-content-center pt-5">
      <div className="container text-center mt-5">
        
        <div className="row">
          <div className="col">
          <h1 className={`${macondo.className} display-1`}>Lydia &amp; Steven</h1>
          <p className="display-6 mb-3">September 20, 2026</p>
          <p className="display-6 mb-3">Santa Fe, NM</p>
          </div>
        </div>
        <div className="row justify-content-center mb-auto mb-4 mt-4">
          <div className="col-md-auto">
            <div className="alert alert-midnight" role="alert">Welcome to our wedding website! Buckle up for way more information than you asked for.</div>
          </div>
        </div>
        <div className="row justify-content-center mb-4">
          <p id="sunsetCounter" className="display-6 mb-0">
            {sunsetsRemaining === null ? (
              <span className="text-muted">Calculating sunsets…</span>
            ) : (
              <>
                <span id="numSunsets">{sunsetsRemaining}</span> more{" "}
                {sunsetsRemaining === 1 ? "sunset" : "sunsets"}
              </>
            )}
          </p>
          </div>
        <div className="row justify-content-center mt-4">
          <div className="col-md-8 col-lg-6">
            <div>
              <figure className="figure">       
                <Image
                  src="/little_prince_sunset_cropped.jpg"
                  alt="The Little Prince observes the sunset from Asteroid B-612"
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
                <figcaption className="figure-caption">
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
