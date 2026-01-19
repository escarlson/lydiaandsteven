"use client";

import { useRouter } from "next/navigation";

type NavButton = "back" | "homepage" | "lodging" | "registry";

type Props = {
  buttons?: NavButton[];
};

export default function RSVPNextStepsClient({
  buttons = ["back", "lodging", "registry"],
}: Props) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleHomepage = () => {
    router.push("/");
  }

  const handleLodging = () => {
    router.push("/lodging");
  };

  const handleRegistry = () => {
    router.push("/registry");
  }; 

  const finalButtons: NavButton[] = buttons;

  return (
    <>
      <div className="d-grid gap-2">
        {finalButtons.includes("back") && (
          <button
            type="button"
            className="btn btn-copper-outline"
            onClick={handleBack}
          >
            Back
          </button>
        )}
        
        {finalButtons.includes("homepage") && (
          <button
            type="button"
            className="btn btn-copper"
            onClick={handleHomepage}
          >
            Go to Homepage
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
      </div>
    </>
  );
}
