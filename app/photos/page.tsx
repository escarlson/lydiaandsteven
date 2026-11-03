"use client";

import Image, { type StaticImageData } from "next/image";
import type { Modal as BootstrapModal } from "bootstrap";
import { type TouchEvent, useEffect, useRef, useState } from "react";
import piggyback from "@/public/piggyback.jpg";
import hands from "@/public/hands.jpg";
import salida from "@/public/salida.jpg";
import tintype1 from "@/public/tintype1.webp";
import tintype2 from "@/public/tintype2.webp";
import firstVisit from "@/public/PXL_20250316_192623590.RAW-01.COVER.webp";
import sittingInArch from "@/public/sitting_in_arch.jpg";
import waterside from "@/public/waterside-smol.jpg";
import penguin from "@/public/King_penguin_–_Zürich_Zoo_03.jpg";

const photoGridSizes =
  "(min-width: 1400px) 312px, (min-width: 1200px) 261px, (min-width: 992px) 293px, (min-width: 768px) 213px, (min-width: 576px) 262px, calc(50vw - 32px)";

type Photo = {
  src: StaticImageData;
  alt: string;
  sizes: string;
};

const photos: Photo[] = [
  {
    src: piggyback,
    alt: "Piggyback ride",
    sizes: photoGridSizes,
  },
  {
    src: hands,
    alt: "Hands",
    sizes: photoGridSizes,
  },
  {
    src: salida,
    alt: "Steven and Lydia in Salida with mountains in the background",
    sizes: photoGridSizes,
  },
  {
    src: tintype1,
    alt: "Tintype portrait of Lydia and Steven",
    sizes: photoGridSizes,
  },
  {
    src: tintype2,
    alt: "Another tintype portrait of Lydia and Steven",
    sizes: photoGridSizes,
  },
  {
    src: firstVisit,
    alt: "Lydia and Steven on Steven's first visit",
    sizes: photoGridSizes,
  },
  {
    src: sittingInArch,
    alt: "Lydia and Steven sitting under an arch",
    sizes: photoGridSizes,
  },
  {
    src: waterside,
    alt: "Lydia and Steven on the water's edge",
    sizes: photoGridSizes,
  },
  {
    src: penguin,
    alt: "King penguin at Zürich Zoo. CC-BY-SA albinfo",
    sizes: photoGridSizes,
  },
];

export default function Photos() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalInstanceRef = useRef<BootstrapModal | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isOpen = selectedIndex !== null;
  const selectedPhoto = selectedIndex === null ? null : photos[selectedIndex];

  useEffect(() => {
    let disposed = false;
    let element: HTMLDivElement | null = null;
    let modal: BootstrapModal | null = null;

    const initializeModal = async () => {
      const { Modal } = await import("bootstrap");
      element = modalRef.current;
      if (!element || disposed) return;

      modal = Modal.getOrCreateInstance(element);
      modalInstanceRef.current = modal;
      element.addEventListener("hidden.bs.modal", handleHidden);
    };

    const handleHidden = () => setSelectedIndex(null);
    void initializeModal();

    return () => {
      disposed = true;
      element?.removeEventListener("hidden.bs.modal", handleHidden);
      modal?.dispose();
      modalInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) =>
          current === null ? null : Math.max(0, current - 1),
        );
      } else if (event.key === "ArrowRight") {
        setSelectedIndex((current) =>
          current === null ? null : Math.min(photos.length - 1, current + 1),
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const openPhoto = async (index: number) => {
    setSelectedIndex(index);
    const { Modal } = await import("bootstrap");
    const element = modalRef.current;
    if (!element) return;
    modalInstanceRef.current = Modal.getOrCreateInstance(element);
    modalInstanceRef.current?.show();
  };

  const showPreviousPhoto = () =>
    setSelectedIndex((current) =>
      current === null ? null : Math.max(0, current - 1),
    );

  const showNextPhoto = () =>
    setSelectedIndex((current) =>
      current === null ? null : Math.min(photos.length - 1, current + 1),
    );

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (touch) {
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    const touch = event.changedTouches[0];
    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    if (deltaX > 0) {
      showPreviousPhoto();
    } else {
      showNextPhoto();
    }
  };

  return (
    <main>
      <div className="container">
        <h1>Photos</h1>
        <p>
          Can&apos;t we just put some pictures of penguins or something?{" "}
          <small className="text-body-secondary">- Lydia</small>
        </p>
        <div className="photo-masonry">
          {photos.map((photo, index) => (
            <div className="photo-masonry-item" key={photo.alt}>
              <button
                type="button"
                className="btn p-0 border-0 w-100"
                onClick={() => openPhoto(index)}
                aria-label={`View photo: ${photo.alt}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  sizes={photo.sizes}
                  className="img-fluid rounded"
                  loading={index < 3 ? "eager" : "lazy"}
                  placeholder={photo.src.blurDataURL ? "blur" : "empty"}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div
        className="modal fade"
        ref={modalRef}
        tabIndex={-1}
        aria-labelledby="photo-library-modal-title"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down modal-xl">
          <div className="modal-content bg-dark text-white photo-viewer-content">
            <div className="modal-header border-0">
              <h2
                className="visually-hidden"
                id="photo-library-modal-title"
              >
                Photo viewer
              </h2>
              <button
                type="button"
                className="btn-close btn-close-white ms-auto"
                data-bs-dismiss="modal"
                aria-label="Close photo viewer"
              />
            </div>
            {selectedPhoto && selectedIndex !== null && (
              <div className="modal-body d-flex flex-column align-items-center justify-content-center gap-3 pt-0 photo-viewer-body">
                <div
                  className="photo-viewer-stage"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchCancel={() => {
                    touchStartRef.current = null;
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-outline-light photo-viewer-control photo-viewer-control-previous"
                    onClick={showPreviousPhoto}
                    disabled={selectedIndex === 0}
                    aria-label="Previous photo"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  <Image
                    src={selectedPhoto.src}
                    alt={selectedPhoto.alt}
                    sizes="(min-width: 1200px) 80vw, 100vw"
                    className="img-fluid rounded photo-viewer-image"
                    loading="eager"
                    placeholder={
                      selectedPhoto.src.blurDataURL ? "blur" : "empty"
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-outline-light photo-viewer-control photo-viewer-control-next"
                    onClick={showNextPhoto}
                    disabled={selectedIndex === photos.length - 1}
                    aria-label="Next photo"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
                <p className="mb-0 text-center photo-viewer-count">
                  {/* {selectedPhoto.alt}{" "} */}
                  <span className="text-body-secondary">
                    ({selectedIndex + 1} of {photos.length})
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
