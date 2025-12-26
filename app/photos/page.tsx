import Image from "next/image";

export default function Photos() {
  return (
    <div>
      <main className="pt-5">
        <div className="container mt-5">
          <h1>Photos</h1>
          <figure>
            <blockquote className="blockquote">
              <p>Can&apos;t we just put some pictures of penguins or something?</p>
            </blockquote>
            <figcaption className="blockquote-footer">
              Lydia
            </figcaption>
          </figure>
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
          </div>
        </div>
      </main>
    </div>
  );
}