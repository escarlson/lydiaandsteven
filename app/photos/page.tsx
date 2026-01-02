import Image from "next/image";

export default function Photos() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
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
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAECAIAAAGzSCLGAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAADZJREFUCNcBKwDU/wB1ZVYAnYx/AY9pYfgPAACoinkC+vn5Aa6PfgwFBQD//gTFz8gAAgTm7fZ3QxLRNpxw3gAAAABJRU5ErkJggg=="
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src="/salida.jpg"
                alt="In Salida with mountains in the background"
                width={3072}
                height={4080}
                className="img-fluid rounded"
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