"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { inviteSearch } from "../lib/rsvp-client";

export default function SubmitButton() {
  const router = useRouter();
  const [toasts, setToasts] = useState<{ id: number; message: string; variant?: string }[]>([]);

  const addToast = (message: string, variant = "danger") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((t) => [...t, { id, message, variant }]);
    // auto-remove after 5s
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  };

  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="position-fixed top-0 mt-5 end-0 p-3"
        style={{ zIndex: 1080, maxWidth: "calc(100vw - 1.5rem)" }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast align-items-center text-bg-${t.variant} border-0 show mb-2`}
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            style={{ maxWidth: "100%" }}
          >
            <div className="d-flex">
              <div className="toast-body">{t.message}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                aria-label="Close"
                onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))}
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="btn btn-copper"
        onClick={async (e) => {
          e.preventDefault();
          const firstName = (document.getElementById('floatingFirstName') as HTMLInputElement).value;
          const lastName = (document.getElementById('floatingLastName') as HTMLInputElement).value;
          const postalCode = (document.getElementById('floatingPostalCode') as HTMLInputElement).value;

          try {
            const result = await inviteSearch(firstName, lastName, postalCode);

            console.log("Search result:", result); // Debug log

            // Check if results array exists and has items
            if (result && result.results && result.results.length > 0) {
              const inviteId = result.results[0].invite_id;
              router.push(`/rsvp/${inviteId}`);
            } else if (result && result.error) {
              // Handle API error responses via toast
              addToast(result.error, "danger");
            } else {
              addToast("No invitation found. Please check your information.", "warning");
            }
          } catch (error) {
            console.error("Error searching for invitation:", error);
            addToast("An error occurred. Please try again.", "danger");
          }
        }}
      >
        Find Invitation
      </button>
    </>
  );
}