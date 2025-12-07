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
    <main
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', paddingBottom: '200px' }} // reserve space for fixed image
    >
      <div className="container text-center">
        <div className="row">
            <div className="col">
            <h1 className={`${macondo.className} display-1`}>Lydia &amp; Steven</h1>
            <p className="display-6 mb-3">September 20, 2026</p>

            {sunsetsRemaining !== null && (
              <p id="sunsetCounter" className="display-6 mb-0">
              <span id="numSunsets">{sunsetsRemaining}</span> more {sunsetsRemaining === 1 ? 'sunset' : 'sunsets'}
              </p>
            )}

            <Image
              src="/little_prince_sunset_cropped.jpg"
              alt="The Little Prince watching a sunset"
              width={1200}
              height={800}
              className="d-block z-10"
              style={{
                position: 'fixed',
                bottom: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                maxWidth: '100%',
                maxHeight: '700px',
                width: 'auto',
                height: 'auto',
              }}
            />
            </div>
        </div>
      </div>
    </main>
  );
}
