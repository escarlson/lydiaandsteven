import { Macondo } from "next/font/google";
import dayjs from "dayjs";
import Sunset from "./lib/sunset";

const macondo = Macondo({
  variable: "--font-macondo",
  subsets: ["latin"],
  weight: ["400"],
});

dayjs.locale("en");
const now = dayjs().format();
const weddingDate = dayjs("2026-09-20T15:00:00-06:00");
const sunsetTime = await Sunset();
// add a sunset if the sun hasn't set yet today
const sunsetsRemaining = weddingDate.diff(now, "day") + (sunsetTime > now ? 0 : 1);

export default function Home() {
  return (
    <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <h1 className={`${macondo.className} display-1`}>Lydia & Steven</h1>
            <p className="display-6">
              Coming Fall 2026
            </p>
            <p id="sunsetCounter" className="display-6">
              <span id="numSunsets">{`${sunsetsRemaining}`}</span> more {`${sunsetsRemaining === 1 ? 'sunset' : 'sunsets'}`}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
