import Link from "next/link";
import Image from "next/image";

export default function Transit() {
  return (
    <div>
      <main>
        <div className="container mt-5">
          <h1>Getting to Santa Fe</h1>
          <div className="row mb-4">
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <figure className="figure">
                  <Image
                    src="/santa_fe_aerial.jpg" 
                    alt="Aerial shot of Santa Fe by Fred Harvey, early 20th Century"
                    className="card-img-top figure-img img-fluid"
                    width={1600}
                    height={2400}
                    style={{ height: "310px"}}
                  />
                  <figcaption className="figure-caption ps-2">Aerial shot of Santa Fe by Fred Harvey, early 20th Century.</figcaption>
                </figure>
                
                <div className="card-body">
                  <h2 className="card-title">Plane</h2>
                  <p className="card-text">Santa Fe is served by one international airport and one regional airport.</p>
                  <ul className="card-text">
                    <li><strong>Santa Fe Regional Airport (SAF)</strong>: The Santa Fe Regional Airport is located about 20 minutes away from the church. This airport has routes connecting Santa Fe to Denver, Dallas, Phoenix, and Los Angeles.</li>
                    <li><strong>Albuquerque International Sunport (ABQ)</strong>: The Albuquerque International Sunport is a roughly one hour drive from Santa Fe and offers a wider range of flight options. If you are foregoing a rental car, you can use the Rail Runner Express between Albuquerque and Santa Fe, with some bus rides on each end.</li>
                  </ul>
                  {/* <Link href="#" className="btn btn-primary">Go somewhere</Link> */}
                </div>
              </div>  
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card">
              <Image 
                src="/lamy_station.jpg"
                alt="Lamy Amtrak Station"
                className="card-img-top"
                width={2048}
                height={1536}
                style={{ width: "100%", height: "auto"}} 
              />
                <div className="card-body">
                  <h2 className="card-title">Train</h2>
                  <p className="card-text">Amtrak&apos;s Southwest Chief line stops in Lamy, NM, about 18 miles from Santa Fe. There is a shuttle to take you from the Lamy station to Santa Fe. This may be an option for our guests who live in Wichita, Kansas City, or Chicago. Coach, roomette, and bedroom tickets are available.</p>
                  {/* <Link href="#" className="btn btn-primary">Go somewhere</Link> */}
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-4">
              <div className="card">
              <figure className="figure">
                  <Image
                    src="/i-25_santa_fe.jpg" 
                    alt="Santa Fe Mountains with snow at sunset from I-25"
                    className="card-img-top figure-img img-fluid"
                    width={1280}
                    height={786}
                    style={{ height: "310px"}}
                  />
                  <figcaption className="figure-caption ps-2">Santa Fe Mountains with snow at sunset from I-25.<br />CC-BY-SA 4.0 Dick Lyon.</figcaption>
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Automobile</h2>
                  <p className="card-text">Santa Fe is accessible via Interstate 25 and U.S. Route 84/285.</p>
                  {/* <Link href="#" className="btn btn-primary">Go somewhere</Link> */}
                </div>
              </div>
            </div>
          </div>
          
          <h1>Getting Around Santa Fe</h1>
          <div className="row mb-4">
            <div className="col col-md-6">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title">Rental Car</h2>
                  <p className="card-text">
                    Purveyors of rental cars are available at both airports and in central Santa Fe. In addition, <Link href='https://www.toyotaofsantafe.com/service/rent-a-toyota/' target="_blank">Toyota of Santa Fe</Link> rents vehicles to the public.
                  </p>
                </div>
              </div>
            </div>
            <div className="col col-md-6">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title">Rideshare</h2>
                  <p className="card-text">Both Uber and Lyft operate in Santa Fe.</p>
                </div>
              </div>
            </div>
          </div>          
        </div>
      </main>
    </div>
  );
}