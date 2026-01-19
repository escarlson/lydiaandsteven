"use client";

import { useEffect } from "react";

function BootstrapClient() {
  useEffect(() => {
    import("bootstrap");
  }, []);

  return null;
}

export default BootstrapClient;