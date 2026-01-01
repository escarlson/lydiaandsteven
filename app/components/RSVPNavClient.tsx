"use client";

import { useRouter } from "next/navigation";

type NavButton = "back" | "finish" | "lodging" | "registry";

type Props = {
  inviteId: string;
  buttons?: NavButton[];
};

export default function RSVPNavClient({
  inviteId,
  buttons,
}: Props) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleFinish = () => {
    if (!inviteId) return;
    router.push(`/rsvp/${inviteId}/confirm`);
  };

  const handleLodging = () => {
    router.push("/lodging");
  };

  const handleRegistry = () => {
    router.push("/registry");
  }; 

  const finalButtons: NavButton[] =
    buttons ?? (["back", "finish"]);

  return (
    <>
      {finalButtons.includes("back") && (
        <button
          type="button"
          className="btn btn-copper-outline"
          onClick={handleBack}
        >
          Back
        </button>
      )}

      {finalButtons.includes("finish") && (
        <button
          type="button"
          className="btn btn-copper"
          onClick={handleFinish}
          disabled={!inviteId}
        >
          Finish
        </button>
      )}

      {finalButtons.includes("lodging") && (
        <button
          type="button"
          className="btn btn-copper"
          onClick={handleLodging}
        >
          Find Lodging
        </button>
      )}

      {finalButtons.includes("registry") && (
        <button
          type="button"
          className="btn btn-copper"
          onClick={handleRegistry}
        >
          View Registry
        </button>
      )}
    </>
  );
}
