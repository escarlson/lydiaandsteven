"use client";

import { useEffect } from "react";

export default function ErrorLogger() {
  useEffect(() => {
    // Capture unhandled promise rejections (where Server Action errors often surface)
    const handleRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason;
      
      if (error?.message?.includes('Server Action')) {
        console.error('[ERROR LOGGER] Server Action Error Detected:', {
          message: error.message,
          stack: error.stack,
          currentUrl: window.location.href,
          timestamp: new Date().toISOString(),
        });
      }
    };

    // Capture regular errors
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Server Action')) {
        console.error('[ERROR LOGGER] Server Action Error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          currentUrl: window.location.href,
          timestamp: new Date().toISOString(),
        });
      }
    };

    window.addEventListener('unhandledrejection', handleRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  return null;
}
