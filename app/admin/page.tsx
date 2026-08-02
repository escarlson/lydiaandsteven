"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/app/lib/auth-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMap, faPlus, faList } from "@fortawesome/free-solid-svg-icons";
import ErrorBoundary from "../components/ErrorBoundary";

type Setting = {
  setting_id: string;
  created_at: Date | null;
  updated_at: Date | null;
  name: string;
  value: string | null;
};

const isBooleanValue = (value: string | null) => value === "0" || value === "1";

// Force dynamic rendering so this page never serves cached HTML
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function Admin() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loadingSettings, setLoadingSettings] = useState(true);
  // Tracks which setting_ids currently have an in-flight save
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  // Tracks per-setting error messages
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    let mounted = true;
    async function loadSettings() {
      try {
        const res = await fetch("/api/setting/all", { credentials: "include" });
        if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`);
        const json = await res.json();
        const loadedSettings = Array.isArray(json.settings)
          ? (json.settings as Setting[])
          : [];
        if (mounted) {
          setSettings(loadedSettings);
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        if (mounted) {
          setLoadingSettings(false);
        }
      }
    }
    loadSettings();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/sign-in");
    }
  }, [isPending, session, router]);

  async function updateSetting(settingId: string, newValue: string) {
    const previous = settings.find((s) => s.setting_id === settingId)?.value ?? null;

    // Optimistically update the UI
    setSettings((prev) =>
      prev.map((s) => (s.setting_id === settingId ? { ...s, value: newValue } : s))
    );
    setErrors((prev) => ({ ...prev, [settingId]: null }));
    setSavingIds((prev) => ({ ...prev, [settingId]: true }));

    try {
      const res = await fetch(`/api/setting/${settingId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: newValue }),
      });
      if (!res.ok) throw new Error(`Failed to update setting: ${res.status}`);
    } catch (err) {
      console.error("Error updating setting:", err);
      // Revert on failure
      setSettings((prev) =>
        prev.map((s) => (s.setting_id === settingId ? { ...s, value: previous } : s))
      );
      setErrors((prev) => ({
        ...prev,
        [settingId]: "Failed to save. Please try again.",
      }));
    } finally {
      setSavingIds((prev) => ({ ...prev, [settingId]: false }));
    }
  }

  function handleToggle(settingId: string, currentValue: string | null) {
    const newValue = currentValue === "1" ? "0" : "1";
    updateSetting(settingId, newValue);
  }

  function handleTextChange(settingId: string, newValue: string) {
    // Update local text immediately so typing feels responsive
    setSettings((prev) =>
      prev.map((s) => (s.setting_id === settingId ? { ...s, value: newValue } : s))
    );
  }

  function handleTextBlur(settingId: string, newValue: string) {
    updateSetting(settingId, newValue);
  }

  if (isPending) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status" aria-label="Loading" />
      </div>
    );
  }

  if (!session?.user) {
    // Redirecting; render nothing to avoid flashing protected content
    return null;
  }

  const userName = session.user.name;

  return (
    <>
      <h1>Admin</h1>
      <p className={userName === "Lydia O'Reilly" ? "h4" : "d-none"}>Hi, Lydia! 😘</p>
      <p>Welcome to the admin panel. Here you can manage various aspects of the wedding website.</p>
      <ul className="list-unstyled">
        <li><Link href="/admin/rsvp/create" className="btn btn-copper mb-2"><FontAwesomeIcon icon={faPlus} /> Create Invitations</Link></li>
        <li><Link href="/admin/rsvp/report" className="btn btn-copper mb-2"><FontAwesomeIcon icon={faList} /> View Invitations</Link></li>
        <li><Link href="/admin/rsvp/map" className="btn btn-copper mb-2"><FontAwesomeIcon icon={faMap} /> View RSVP Map</Link></li>
      </ul>
      <h2>Settings</h2>
      <ErrorBoundary>
        <div className="row">
          <div className="col-auto">
            {loadingSettings ? (
              <p>Loading settings...</p>
            ) : settings.length === 0 ? (
              <p>No settings found.</p>
            ) : (
              <>
                {settings.map((setting) => {
                  const isSaving = !!savingIds[setting.setting_id];
                  const error = errors[setting.setting_id];
                  const value = setting.value;

                  const isNumberMode =
                    setting.setting_id === 'd007ab55-8e10-11f1-b1ee-3ec04bbcb2ea';

                  return (
                    <div key={setting.setting_id} className="mb-3">
                      {isNumberMode ? (
                        <div>
                          <label
                            className="form-label d-block mb-1"
                            htmlFor={`setting-${setting.setting_id}`}
                          >
                            {setting.name}
                            {isSaving && (
                              <span
                                className="spinner-border spinner-border-sm ms-2"
                                role="status"
                                aria-label="Saving"
                              />
                            )}
                          </label>

                          <input
                            type="number"
                            className="form-control"
                            id={`setting-${setting.setting_id}`}
                            value={value ?? ""}
                            disabled={isSaving}
                            onChange={(e) => handleTextChange(setting.setting_id, e.target.value)}
                            onBlur={(e) => handleTextBlur(setting.setting_id, e.target.value)}
                          />
                        </div>
                      ) : isBooleanValue(value) ? (
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            id={`setting-${setting.setting_id}`}
                            checked={value === "1"}
                            disabled={isSaving}
                            onChange={() => handleToggle(setting.setting_id, value)}
                          />

                          <label
                            className="form-check-label"
                            htmlFor={`setting-${setting.setting_id}`}
                          >
                            {setting.name}
                            {isSaving && (
                              <span
                                className="spinner-border spinner-border-sm ms-2"
                                role="status"
                                aria-label="Saving"
                              />
                            )}
                          </label>
                        </div>
                      ) : (
                        <div>
                          <label
                            className="form-label d-block mb-1"
                            htmlFor={`setting-${setting.setting_id}`}
                          >
                            {setting.name}
                            {isSaving && (
                              <span
                                className="spinner-border spinner-border-sm ms-2"
                                role="status"
                                aria-label="Saving"
                              />
                            )}
                          </label>

                          <input
                            type="text"
                            className="form-control"
                            id={`setting-${setting.setting_id}`}
                            value={value ?? ""}
                            disabled={isSaving}
                            onChange={(e) => handleTextChange(setting.setting_id, e.target.value)}
                            onBlur={(e) => handleTextBlur(setting.setting_id, e.target.value)}
                          />
                        </div>
                      )}

                      {error && <div className="text-danger small mt-1">{error}</div>}
                    </div>
                  );
                })}

              </>
            )}
          </div>
        </div>
      </ErrorBoundary>
    </>
  );
}