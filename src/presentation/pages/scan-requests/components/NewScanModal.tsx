import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import type { ScanRequest } from "../types";
import { SCAN_MODES_BY_TYPE, DEFAULT_SCAN_MODE } from "../../../../core/constants/scanOptionsConfig";
import { ScanHttpService } from "../../../../infrastructure/http/scanHttpService";

const scanService = new ScanHttpService();

const SCAN_TYPES = [
  "Vulnerability Scan",
  "Web Audit",
];

type NewScanModalProps = {
  onClose: () => void;
  onSubmit: (scan: ScanRequest) => void;
};

export function NewScanModal({ onClose, onSubmit }: NewScanModalProps) {
  const [target, setTarget] = useState("");
  const [type, setType] = useState("Vulnerability Scan");
  const [scanMode, setScanMode] = useState(DEFAULT_SCAN_MODE);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;
  const hasInput = target.length > 0;
  const isValidDomain = target === "localhost" || domainRegex.test(target);
  const showInvalidDomainError = hasInput && !isValidDomain;

  const modes = SCAN_MODES_BY_TYPE[type] || [];

  const submit = async () => {
    let clean = target.trim().toLowerCase();
    if (clean.startsWith("http://")) clean = clean.substring(7);
    if (clean.startsWith("https://")) clean = clean.substring(8);
    clean = clean.split("/")[0];

    if (!hasInput) { setError("Target domain is required"); return; }
    if (!isValidDomain) { setError("Please enter a valid domain name"); return; }

    setLoading(true);
    setError("");

    try {
      await scanService.rescan({
        domain: clean,
        scanType: type,
        scanMode,
      });

      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const timestamp = `${pad(now.getMonth() + 1)}${now.getFullYear()}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

      onSubmit({
        id: 0,
        scanId: `SCN-${timestamp}${Math.floor(1000 + Math.random() * 9000)}`,
        domain: clean,
        requestedFor: clean,
        severity: "none",
        status: "queued",
        type,
        scanType: type,
      });
      onClose();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to schedule scan";
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 429) {
        setError("LIMIT_EXCEEDED");
      } else {
        setError(apiMessage || message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="sr-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sr-modal">
        <div className="sr-modal__header">
          <div>
            <p className="sr-eyebrow">New Request</p>
            <h2 className="sr-modal__title">Schedule a Scan</h2>
          </div>
          <button className="sr-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="sr-modal__body">
          {error === "LIMIT_EXCEEDED" && (
            <div className="sr-info-banner" style={{ background: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.2)", marginBottom: "1.5rem" }} role="alert">
              <div className="sr-info-banner__icon" style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.1)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="sr-info-banner__body">
                <span className="sr-info-banner__label" style={{ color: "#ef4444" }}>Daily Limit Exceeded</span>
                <p className="sr-info-banner__text">
                  You have reached your maximum allowed scans for today. Please check your active plan or try again tomorrow.
                </p>
              </div>
            </div>
          )}

          {/* TARGET */}
          <div className="sr-field">
            <label className="sr-label">
              Target <span className="sr-required">*</span>
            </label>
            <input
              className={`sr-input${error && error !== "LIMIT_EXCEEDED" ? " sr-input--error" : ""}`}
              placeholder="e.g. example.com"
              value={target}
              onChange={(e) => {
                let val = e.target.value.toLowerCase();
                if (val.startsWith("http://")) val = val.substring(7);
                if (val.startsWith("https://")) val = val.substring(8);
                if (val.includes("/")) val = val.split("/")[0];
                setTarget(val);
                if (error === "Target domain is required" || error === "Please enter a valid domain name") {
                  setError("");
                }
              }}
            />
            {showInvalidDomainError ? (
              <span className="sr-error-msg">Please enter a valid domain name</span>
            ) : error && error !== "LIMIT_EXCEEDED" ? (
              <span className="sr-error-msg">{error}</span>
            ) : (
              <span className="sr-info-text" style={{ fontSize: "0.8rem", color: "var(--text-secondary, #888)", marginTop: "6px", display: "block" }}>
                Enter a valid domain name. We will automatically remove http:// and paths.
              </span>
            )}
          </div>

          {/* SCAN TYPE */}
          <div className="sr-field">
            <label className="sr-label">Scan Type</label>
            <select
              className="sr-input"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setScanMode(DEFAULT_SCAN_MODE);
              }}
            >
              {SCAN_TYPES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>

          {/* SCAN MODE */}
          {modes.length > 0 && (
            <div className="sr-field">
              <label className="sr-label">Scan Mode</label>
              <div className="sr-mode-grid">
                {modes.map((mode) => (
                  <label
                    key={mode.value}
                    className={`sr-mode-card${scanMode === mode.value ? " sr-mode-card--active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="scanMode"
                      value={mode.value}
                      checked={scanMode === mode.value}
                      onChange={() => setScanMode(mode.value)}
                      style={{ display: "none" }}
                    />
                    <div className="sr-mode-card__header">
                      <span className="sr-mode-card__label">{mode.label}</span>
                      {mode.badge && (
                        <span className={`sr-mode-badge${mode.badge === "Slow" ? " sr-mode-badge--slow" : " sr-mode-badge--default"}`}>
                          {mode.badge}
                        </span>
                      )}
                    </div>
                    <p className="sr-mode-card__desc">{mode.description}</p>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sr-modal__footer">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={submit} disabled={loading || !hasInput || showInvalidDomainError}>
            {loading ? "Submitting..." : "Submit Request →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
