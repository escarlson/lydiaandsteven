import Image from "next/image";

export default function Photos() {
  return (
    <div>
      <main>
        <div className="container">
          <h1>Photos</h1>         
            <p>Can&apos;t we just put some pictures of penguins or something? <small className="text-body-secondary">- Lydia</small></p>
          <div className="row">
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src="/piggyback.jpg"
                alt="Piggyback ride"
                width={3072}
                height={4080}
                className="img-fluid rounded"
                loading="eager"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAAGzSCLGAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAADZJREFUCNcBKwDU/wDCydAApqmsAWliWwgD/wC+xswDGQ0AAYeIivDy9gH88wQB8+AUBgQLEQyapBGBsiXECAAAAABJRU5ErkJggg=="
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src="/hands.jpg"
                alt="Hands"
                width={3072}
                height={4080}
                className="img-fluid rounded"
                loading="eager"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAAGzSCLGAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAADZJREFUCNcBKwDU/wB1ZVYAnYx/AY9pYfgPAACoinkC+vn5Aa6PfgwFBQD//gTFz8gAAgTm7fZ3QxLRNpxw3gAAAABJRU5ErkJggg=="
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src="/salida.jpg"
                alt="Steven and Lydia in Salida with mountains in the background"
                width={3072}
                height={4080}
                className="img-fluid rounded"
                loading="eager"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAAGzSCLGAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAADZJREFUCNcBKwDU/wCXt+0AbXJQA6WgkiEhLgCXsdUDPhwPAYqQlvvy6OfhxQMWERYD+fTm7gaIwxNb4+YhsgAAAABJRU5ErkJggg=="
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src="/tintype1.webp"
                alt="Tintype portrait of Lydia and Steven"
                width={1603}
                height={2000}
                className="img-fluid rounded"
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADwAQCdASoGAAcAABgAJ6QCdAD0pi8hUIAA/gvupG/rW2zt85O+e8Zn+2Qs4FCq07FlzP+pOn/9Mbqqb/mIu8oHBt7MGJmNRxBTv/Y6vf6ZB/uu3g2zc9s3hFwAAA=="
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src="/tintype2.webp"
                alt="Another tintype portrait of Lydia and Steven"
                width={1608}
                height={1990}
                className="img-fluid rounded"
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAABQAgCdASoGAAcAABgAJ5wCdAXBL/ji3y1bzAAA/sYH8WZez/wHVc/2Nz/9jSs//o2/s5inVci//m3Rv5C85/taV0B7k5195OcX/wf3z6VApLJerUAXG/f9+X/xks+nal7ymRuDcBlfQAAA"
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src="/PXL_20250316_192623590.RAW-01.COVER.webp"
                alt="Lydia and Steven on Steven's first visit"
                width={2736}
                height={3648}
                className="img-fluid rounded"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQIBAQEBAQIBAQECAgICAgICAgIDAwQDAwMDAwICAwQDAwQEBAQEAgMFBQQEBQQEBAT/2wBDAQEBAQEBAQIBAQIEAwIDBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAT/wAARCAAEAAMDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACP/EABoQAAMBAQEBAAAAAAAAAAAAAAECAwUEESH/xAAVAQEBAAAAAAAAAAAAAAAAAAAFB//EAB4RAQEAAQUAAwAAAAAAAAAAAAECAwAEBxEhBRJR/9oADAMBAAIRAxEAPwA052wm3yJpdmPkJe9KTKcc78fPNZVeM1VEqB8SaAsfWYgszMxZjYfiucuR52GO73hVX3kWpF7yU5EPyZaSJPJgmTwNJ7vh3j7cZ/s7EkkmAmqDrHJAvvtJI1T7VLSquv/Z"
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src="/sitting_in_arch.jpg"
                alt="Lydia and Steven sitting under an arch"
                width={2736}
                height={3648}
                className="img-fluid rounded"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAYAAAAICAIAAAEioyn5AAABcWlDQ1BJQ0MgcHJvZmlsZQAAKJF1kc0rRFEYxn93hphBEtmwuAuFQpopH4XFUBcb8lFmZHFd85X5uN250qz9A8pGtoiFkuU0amZpqchKLFlTSujo3FHXR57N+fW8z3s673vAMwlQBaQztjWnhdSlcEStecCLDz/DoBs5ky9pMzMaf/RygyLPq15ZLxodx4e+tuLKwOvpQeNe4W/+h+rWojkDlFogYJiWDcoIENm0Tcm7QMvqusMnkq2lcASUsuR4ha+dTIUfnczC3Dgo74BqJPQ18LQDPavf/Pg3Tqc2jK/3yEnqo5nFeaAVaGeCJDlMUujkUZklKIP/9Iw5PeNkMcljkSROAhuVLgy6UQnQT4AgKhpZssRJEUVligwGffJC+Qe/d+t6rlxv6x5GS0KIc9ebLsHZIPgLrtc1BE11cFEwdUt3LC/gicXg6QgawtB8Cf7lXCwYqExXH4LqOyGeO6FmBz62hXjbF+LjALy3UM58Ampiaz4iV/N2AAAACXBIWXMAAC4jAAAuIwF4pT92AAAAqklEQVQI1wGfAGD/AGhdTABjV0IBUVA8Oy4uAGdaRwIQGB8BrLSN9vUHzri3AwP6C83G0/wACAFfVEIIBgP09vkBs7mZCAwHrZanAwoFEcnQ9Q4C7wTv7O0BA/Tj+vwBsbiT7+YE8P0ECPja08rS9vf6Ax4VCtnf3BkR+gsWDP7x+vv9/AT1+x4KB/iuocEMGiEZEQLs7PEE+PXyCAwPLTs/AwIBBQMEHSU2/vVFP/67EYkAAAAASUVORK5CYII="
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src="/beach.jpg"
                alt="Lydia and Steven on the beach"
                width={3648}
                height={2736}
                className="img-fluid rounded"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQIBAQEBAQIBAQECAgICAgICAgIDAwQDAwMDAwICAwQDAwQEBAQEAgMFBQQEBQQEBAT/2wBDAQEBAQEBAQIBAQIEAwIDBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAT/wAARCAAFAAYDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACP/EABoQAAIDAQEAAAAAAAAAAAAAAAIDAQQFBwb/xAAVAQEBAAAAAAAAAAAAAAAAAAAEBv/EAB8RAQACAwABBQAAAAAAAAAAAAECEQQFEgAVIUJxsf/aAAwDAQACEQMRAD8Ab3F+6dYr3i1c73/rKLr2LaqaaR2TKq5itV1kDQsYGFhE3bAwBQw4XCVwyFpUsKnC9X20HY7LOnO1CKRlyLfz6PaqsiP54na4un1yazAw4QDlZCisY8tpS9XdK0/fn//Z"
              />
            </div>
            <div className="col-xs-1 col-md-1 col-lg-1 mb-3 d-flex ms-auto justify-content-end align-items-end">
              <Image
                src="/King_penguin_–_Zürich_Zoo_03.jpg"
                alt="King penguin at Zürich Zoo. CC-BY-SA albinfo"
                width={851}
                height={1280}
                className="img-fluid rounded"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}