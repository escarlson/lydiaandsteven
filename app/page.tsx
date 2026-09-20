'use client';

import { Macondo, Caveat } from "next/font/google";
import dayjs from "dayjs";
import Sunset from "./lib/sunset";
import { useEffect, useState } from "react";
import Image from "next/image";
import littlePrince from "@/public/little_prince_sunset_cropped.jpg";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

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

type Setting = {
  setting_id: string;
  created_at: Date | null;
  updated_at: Date | null;
  name: string;
  value: string | null;
};

const DETAILS_SETTING_ID = "fd745772-b0bd-11f1-b1ee-3ec04bbcb2ea";

export default function Home() {
  const [sunsetsRemaining, setSunsetsRemaining] = useState<number | null>(null);
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    dayjs.locale("en");
    const now = dayjs();
    const weddingDate = dayjs("2026-09-20T15:00:00-06:00");
    
    // Fetch sunset asynchronously
    const fetchSunset = async () => {
      const sunsetTime = await Sunset();
      const remaining = weddingDate.diff(now, "day") + (sunsetTime > now ? 0 : 1);
      setSunsetsRemaining(remaining);
    };
    
    fetchSunset();
  }, []); // Runs once on mount

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const res = await fetch(`/api/setting/${DETAILS_SETTING_ID}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch setting: ${res.status}`);
        }

        const json = await res.json();
        const loadedSetting = json.setting as Setting | null;

        if (mounted) {
          setSettings(loadedSetting ? [loadedSetting] : []);
        }
      } catch (err) {
        console.error("Error loading setting:", err);
      } finally {
        if (mounted) {
          setLoadingSettings(false);
        }
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="d-flex align-items-center justify-content-center">
      <div className="container text-center mt-4">
        
        <div className="row">
          <div className="col">
          <h1 className={`${macondo.className} display-1`}>Lydia &amp; Steven</h1>
          <p className="display-6 mb-3"><span>September 20, 2026</span><span className="date-location-separator"> | </span><span className="date-location-place">Santa Fe, NM</span></p>
          </div>
        </div>
        <div className="row justify-content-center mb-auto mb-4 mt-4">
          <p>Welcome to our wedding website! Buckle up for way more information than you asked for.</p>
        </div>
        {loadingSettings ? (
          <p></p>
        ) : (
          <div className="row justify-content-center mb-auto mb-4 mt-4">
            <div className="col-auto mt-2 mt-sm-0">
              {/* width attribute reduces layout shifting during page load */}
              <Link href="/rsvp" className="btn btn-midnight btn-lg"><FontAwesomeIcon icon={faEnvelope} width={"1.25em"}/> RSVP</Link>
            </div>
            {settings[0]?.value === "1" && (
              <div className="col-auto mt-2 mt-sm-0">
                {/* width attribute reduces layout shifting during page load */}
                <Link href="/key-details" className="btn btn-outline-midnight btn-lg"><FontAwesomeIcon icon={faCircleInfo} width={"1.25em"}/> Key Details</Link>
              </div>
            )}
            {/* <div className="col-auto mt-2 mt-sm-0">
              <Link href="/registry" className="btn btn-outline-midnight btn-lg"><FontAwesomeIcon icon={faGift} /> Registry</Link>
            </div> */}
          </div>
        )}
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
                  src={littlePrince}
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