import { Macondo } from "next/font/google";

const macondo = Macondo({
  variable: "--font-macondo",
  subsets: ["latin"],
  weight: ["400"],
});


export default function Home() {
  return (
    <main className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="container text-center">
        <div className="row">
          <div className="col">
            <h1 className={`${macondo.className} display-1`}>Lydia & Steven</h1>
            <p>
              Coming Summer 2026
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
