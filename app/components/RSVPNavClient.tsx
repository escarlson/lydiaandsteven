"use client";

import { useRouter } from "next/navigation";

type NavButton = "back" | "submit" | "lodging" | "registry" | "addChild";

type Props = {
  inviteId: string;
  buttons?: NavButton[];
  onAddChild?: () => void;
};

export default function RSVPNavClient({
  inviteId,
  buttons,
  onAddChild,
}: Props) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = () => {
    if (!inviteId) return;
    router.push(`/rsvp/${inviteId}/confirm`);
  };

  const handleLodging = () => {
    router.push("/travel/lodging");
  };

  const handleRegistry = () => {
    router.push("/registry");
  };

  const handleAddChild = () => {
    if (onAddChild) {
      onAddChild();
    }
  }; 

  const finalButtons: NavButton[] =
    buttons ?? (["back", "addChild", "submit"]);

  return (
    <>
      {finalButtons.includes("back") && (
        <button
          type="button"
          className="btn btn-outline-midnight"
          onClick={handleBack}
        >
          Back
        </button>
      )}

      {finalButtons.includes("addChild") && (
        <button
          type="button"
          className="btn btn-outline-midnight"
          onClick={handleAddChild}
          disabled={!inviteId || !onAddChild}
        >
          Add Child
        </button>
      )}

      {finalButtons.includes("submit") && (
        <button
          type="button"
          className="btn btn-midnight"
          onClick={handleSubmit}
          disabled={!inviteId}
        >
          Submit
        </button>
      )}

      {finalButtons.includes("lodging") && (
        <button
          type="button"
          className="btn btn-midnight"
          onClick={handleLodging}
        >
          Find Lodging
        </button>
      )}

      {finalButtons.includes("registry") && (
        <button
          type="button"
          className="btn btn-midnight"
          onClick={handleRegistry}
        >
          View Registry
        </button>
      )}
    </>
  );
}
