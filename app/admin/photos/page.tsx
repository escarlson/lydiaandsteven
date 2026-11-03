"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";

type ModerationPhoto = {
  id: string;
  width: number;
  height: number;
  size_bytes: number;
  status: "pending" | "rejected";
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  url: string;
};

export default function AdminPhotosPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [photos, setPhotos] = useState<ModerationPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyPhotoId, setBusyPhotoId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session?.user) return;

    let active = true;
    const loadPhotos = async () => {
      try {
        const response = await fetch("/api/photos/moderation", {
          credentials: "include",
          cache: "no-store",
        });
        const result = (await response.json()) as {
          error?: string;
          photos?: ModerationPhoto[];
        };
        if (!response.ok) {
          throw new Error(result.error ?? "Could not load photos for review.");
        }
        if (active) setPhotos(Array.isArray(result.photos) ? result.photos : []);
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Could not load photos.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadPhotos();
    return () => {
      active = false;
    };
  }, [session]);

  const reviewPhoto = async (
    photo: ModerationPhoto,
    status: "approved" | "rejected",
  ) => {
    setBusyPhotoId(photo.id);
    setActionError(null);
    try {
      const response = await fetch(`/api/photos/${photo.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error ?? "Could not update this photo.");
      }

      if (status === "approved") {
        setPhotos((current) => current.filter((item) => item.id !== photo.id));
      } else {
        setPhotos((current) =>
          current.map((item) =>
            item.id === photo.id
              ? { ...item, status: "rejected", reviewed_at: new Date().toISOString() }
              : item,
          ),
        );
      }
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : "Could not update this photo.",
      );
    } finally {
      setBusyPhotoId(null);
    }
  };

  if (isPending || !session?.user) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border" role="status" aria-label="Loading" />
      </div>
    );
  }

  const pendingPhotos = photos.filter((photo) => photo.status === "pending");
  const rejectedPhotos = photos.filter((photo) => photo.status === "rejected");

  return (
    <>
      <h1>Photo review</h1>
      <p>Approve guest photos to add them to the public gallery.</p>
      {actionError && <div className="alert alert-danger">{actionError}</div>}
      {loadError && <div className="alert alert-danger">{loadError}</div>}

      {loading ? (
        <p>Loading photos...</p>
      ) : (
        <>
          <h2>Pending approval ({pendingPhotos.length})</h2>
          {pendingPhotos.length === 0 ? (
            <p>No photos are waiting for approval.</p>
          ) : (
            <div className="row g-3 mb-4">
              {pendingPhotos.map((photo) => (
                <div className="col-12 col-sm-6 col-lg-4" key={photo.id}>
                  <article className="card h-100">
                    <Image
                      src={photo.url}
                      alt="Photo submitted for approval"
                      width={photo.width}
                      height={photo.height}
                      unoptimized
                      className="card-img-top"
                      style={{ width: "100%", height: "auto" }}
                    />
                    <div className="card-body">
                      <p className="card-text small">
                        Submitted {new Date(photo.created_at).toLocaleString()} ·{" "}
                        {(photo.size_bytes / (1024 * 1024)).toFixed(1)} MB
                      </p>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-success"
                          disabled={busyPhotoId === photo.id}
                          onClick={() => void reviewPhoto(photo, "approved")}
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          disabled={busyPhotoId === photo.id}
                          onClick={() => void reviewPhoto(photo, "rejected")}
                        >
                          Reject
                        </button>
                        {busyPhotoId === photo.id && (
                          <span className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Saving review</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          <h2>Rejected photos ({rejectedPhotos.length})</h2>
          {rejectedPhotos.length === 0 ? (
            <p>No rejected photos.</p>
          ) : (
            <div className="row g-3">
              {rejectedPhotos.map((photo) => (
                <div className="col-12 col-sm-6 col-lg-4" key={photo.id}>
                  <article className="card h-100">
                    <Image
                      src={photo.url}
                      alt="Rejected photo submission"
                      width={photo.width}
                      height={photo.height}
                      unoptimized
                      className="card-img-top"
                      style={{ width: "100%", height: "auto" }}
                    />
                    <div className="card-body">
                      <p className="card-text small">
                        Rejected{" "}
                        {photo.reviewed_at
                          ? new Date(photo.reviewed_at).toLocaleString()
                          : ""}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
