"use client";

import { useRouter } from "next/navigation";

type Props = {
  inviteId: string;
  showFinish?: boolean;
};

export default function RSVPNavClient({ inviteId, showFinish = true }: Props) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleFinish = () => {
    if (!inviteId) return;
    router.push(`/rsvp/${inviteId}/confirm`);
  };

  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={handleBack}>
        Back
      </button>
      {showFinish && (
        <button
          type="button"
          className="btn btn-copper"
          onClick={handleFinish}
          disabled={!inviteId}
        >
          Finish
        </button>
      )}
    </>
  );
}
