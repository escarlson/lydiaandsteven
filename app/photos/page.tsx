import Image from "next/image";
import piggyback from "@/public/piggyback.jpg";
import hands from "@/public/hands.jpg";
import salida from "@/public/salida.jpg";
import tintype1 from "@/public/tintype1.webp";
import tintype2 from "@/public/tintype2.webp";
import firstVisit from "@/public/PXL_20250316_192623590.RAW-01.COVER.webp";
import sittingInArch from "@/public/sitting_in_arch.jpg";
import beach from "@/public/beach.jpg";
import penguin from "@/public/King_penguin_–_Zürich_Zoo_03.jpg";

const photoGridSizes = "(min-width: 992px) 33vw, (min-width: 768px) 50vw, 100vw";
const penguinSizes = "(min-width: 768px) 8.33vw, 100vw";

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
                src={piggyback}
                alt="Piggyback ride"
                sizes={photoGridSizes}
                className="img-fluid rounded"
                loading="eager"
                placeholder="blur"
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src={hands}
                alt="Hands"
                sizes={photoGridSizes}
                className="img-fluid rounded"
                loading="eager"
                placeholder="blur"
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src={salida}
                alt="Steven and Lydia in Salida with mountains in the background"
                sizes={photoGridSizes}
                className="img-fluid rounded"
                loading="eager"
                placeholder="blur"
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src={tintype1}
                alt="Tintype portrait of Lydia and Steven"
                sizes={photoGridSizes}
                className="img-fluid rounded"
                placeholder="blur"
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src={tintype2}
                alt="Another tintype portrait of Lydia and Steven"
                sizes={photoGridSizes}
                className="img-fluid rounded"
                placeholder="blur"
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src={firstVisit}
                alt="Lydia and Steven on Steven's first visit"
                sizes={photoGridSizes}
                className="img-fluid rounded"
                placeholder="blur"
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src={sittingInArch}
                alt="Lydia and Steven sitting under an arch"
                sizes={photoGridSizes}
                className="img-fluid rounded"
                loading="lazy"
                placeholder="blur"
              />
            </div>
            <div className="col-xs-12 col-md-6 col-lg-4 mb-3">
              <Image
                src={beach}
                alt="Lydia and Steven on the beach"
                sizes={photoGridSizes}
                className="img-fluid rounded"
                loading="lazy"
                placeholder="blur"
              />
            </div>
            <div className="col-xs-1 col-md-1 col-lg-1 mb-3 d-flex ms-auto justify-content-end align-items-end">
              <Image
                src={penguin}
                alt="King penguin at Zürich Zoo. CC-BY-SA albinfo"
                sizes={penguinSizes}
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