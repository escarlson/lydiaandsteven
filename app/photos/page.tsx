"use client";

import Image, { type StaticImageData } from "next/image";
import type { Modal as BootstrapModal } from "bootstrap";
import {
  type FormEvent,
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  id?: string;
  src: StaticImageData | string;
  alt: string;
  sizes: string;
  width?: number;
  height?: number;
};

type ApprovedPhoto = {
  id: string;
  width: number;
  height: number;
  url: string;
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
  const [uploadedPhotos, setUploadedPhotos] = useState<ApprovedPhoto[]>([]);
  const [loadingUploadedPhotos, setLoadingUploadedPhotos] = useState(true);
  const [uploadedPhotosError, setUploadedPhotosError] = useState<string | null>(
    null,
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalInstanceRef = useRef<BootstrapModal | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const uploadedGalleryPhotos: Photo[] = uploadedPhotos.map((photo) => ({
    id: photo.id,
    src: photo.url,
    alt: "Wedding photo shared by a guest",
    sizes: photoGridSizes,
    width: photo.width,
    height: photo.height,
  }));
  const staticGalleryPhotos: Photo[] = photos;
  const galleryPhotos: Photo[] = [...uploadedGalleryPhotos, ...staticGalleryPhotos];
  const isOpen = selectedIndex !== null;
  const selectedPhoto =
    selectedIndex === null ? null : galleryPhotos[selectedIndex];

  const loadUploadedPhotos = useCallback(async () => {
    const response = await fetch("/api/photos", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Approved guest photos could not be loaded.");
    }
    const result = (await response.json()) as ApprovedPhoto[];
    setUploadedPhotos(Array.isArray(result) ? result : []);
    setUploadedPhotosError(null);
  }, []);

  useEffect(() => {
    let active = true;
    void loadUploadedPhotos()
      .catch((error: unknown) => {
        if (active) {
          setUploadedPhotosError(
            error instanceof Error
              ? error.message
              : "Approved guest photos could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (active) setLoadingUploadedPhotos(false);
      });

    return () => {
      active = false;
    };
  }, [loadUploadedPhotos]);

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
          current === null
            ? null
            : Math.min(galleryPhotos.length - 1, current + 1),
        );
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [galleryPhotos.length, isOpen]);

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
      current === null
        ? null
        : Math.min(galleryPhotos.length - 1, current + 1),
    );

  const submitPhoto = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadError(null);
    setUploadMessage(null);

    const form = event.currentTarget;
    const file = new FormData(form).get("photo");
    if (!(file instanceof File) || file.size === 0) {
      setUploadError("Choose a photo to upload.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setUploadError("The photo must be no larger than 20 MB.");
      return;
    }

    setUploading(true);
    try {
      const response = await fetch("/api/photos", {
        method: "POST",
        body: new FormData(form),
      });
      const responseBody = await response.text();
      let result: { error?: string; message?: string } = {};
      try {
        result = JSON.parse(responseBody) as {
          error?: string;
          message?: string;
        };
      } catch {
        if (response.status === 413) {
          throw new Error(
            "The server rejected this upload as too large. The server upload limit needs to be at least 22 MB.",
          );
        }
        throw new Error(
          "The server returned an unexpected response. Please try again later.",
        );
      }
      if (!response.ok) {
        throw new Error(
          result.error ??
            (response.status === 413
              ? "The upload is too large. Photos must be no larger than 20 MB."
              : "The photo could not be uploaded."),
        );
      }

      setUploadMessage(
        result.message ?? "Thanks! Your photo was submitted for approval.",
      );
      form.reset();
    } catch (error) {
      setUploadError(
        error instanceof Error
          ? error.message
          : "The photo could not be uploaded.",
      );
    } finally {
      setUploading(false);
    }
  };

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
        <section className="mb-4" aria-labelledby="guest-photo-upload-title">
          <h2 className="h4" id="guest-photo-upload-title">
            Share a wedding photo
          </h2>
          <p>Upload a photo from the wedding, and we might feature it below.</p>
          <form onSubmit={submitPhoto}>
            <div className="row g-2 align-items-end">
              <div className="col-12 col-sm-8 col-md-6">
                <label className="form-label" htmlFor="guest-photo">
                  Choose a photo (JPEG, PNG, WebP, or HEIC; up to 20 MB)
                </label>
                <input
                  className="form-control"
                  id="guest-photo"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic,.heic"
                  required
                  disabled={uploading}
                />
              </div>
              <div className="col-auto">
                <button
                  className="btn btn-copper"
                  type="submit"
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Submit photo"}
                </button>
              </div>
            </div>
          </form>
          {uploadError && (
            <p className="alert alert-danger mt-3" role="alert">
              {uploadError}
            </p>
          )}
          {uploadMessage && (
            <p className="alert alert-success mt-3" role="status">
              {uploadMessage}
            </p>
          )}
        </section>
        <section className="mb-5" aria-labelledby="uploaded-photos-heading">
          <h2 className="h4" id="uploaded-photos-heading">
            Wedding photos
          </h2>
          {uploadedPhotosError && (
            <p className="alert alert-warning" role="alert">
              {uploadedPhotosError}
            </p>
          )}
          {loadingUploadedPhotos ? (
            <p>Loading guest photos...</p>
          ) : uploadedGalleryPhotos.length === 0 ? (
            <p className="text-body-secondary mb-0">
              No guest photos have been approved yet.
            </p>
          ) : (
            <div className="photo-masonry">
              {uploadedGalleryPhotos.map((photo, index) => (
                <div
                  className="photo-masonry-item"
                  key={photo.id ?? photo.alt}
                >
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
                      width={
                        photo.width ??
                        (typeof photo.src === "string"
                          ? undefined
                          : photo.src.width)
                      }
                      height={
                        photo.height ??
                        (typeof photo.src === "string"
                          ? undefined
                          : photo.src.height)
                      }
                      className="img-fluid rounded"
                      loading={index < 3 ? "eager" : "lazy"}
                      placeholder={
                        typeof photo.src !== "string" && photo.src.blurDataURL
                          ? "blur"
                          : "empty"
                      }
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section aria-labelledby="static-photos-heading">
          <h2 className="h4" id="static-photos-heading">
            More photos
          </h2>
          <p>
          Can&apos;t we just put some pictures of penguins or something?{" "}
          <small className="text-body-secondary">- Lydia</small>
          </p>
          <div className="photo-masonry">
            {staticGalleryPhotos.map((photo, index) => (
              <div
                className="photo-masonry-item"
                key={photo.id ?? photo.alt}
              >
                <button
                  type="button"
                  className="btn p-0 border-0 w-100"
                  onClick={() => openPhoto(uploadedGalleryPhotos.length + index)}
                  aria-label={`View photo: ${photo.alt}`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    sizes={photo.sizes}
                    width={
                      photo.width ??
                      (typeof photo.src === "string" ? undefined : photo.src.width)
                    }
                    height={
                      photo.height ??
                      (typeof photo.src === "string"
                        ? undefined
                        : photo.src.height)
                    }
                    className="img-fluid rounded"
                    loading={index < 3 ? "eager" : "lazy"}
                    placeholder={
                      typeof photo.src !== "string" && photo.src.blurDataURL
                        ? "blur"
                        : "empty"
                    }
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
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
                    width={
                      selectedPhoto.width ??
                      (typeof selectedPhoto.src === "string"
                        ? undefined
                        : selectedPhoto.src.width)
                    }
                    height={
                      selectedPhoto.height ??
                      (typeof selectedPhoto.src === "string"
                        ? undefined
                        : selectedPhoto.src.height)
                    }
                    className="img-fluid rounded photo-viewer-image"
                    loading="eager"
                    placeholder={
                      typeof selectedPhoto.src !== "string" &&
                      selectedPhoto.src.blurDataURL
                        ? "blur"
                        : "empty"
                    }
                  />
                  <button
                    type="button"
                    className="btn btn-outline-light photo-viewer-control photo-viewer-control-next"
                    onClick={showNextPhoto}
                    disabled={selectedIndex === galleryPhotos.length - 1}
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
                    ({selectedIndex + 1} of {galleryPhotos.length})
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
