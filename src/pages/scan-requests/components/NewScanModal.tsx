import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import type { ScanRequest, Severity } from "../types";

const SCAN_TYPES = [
  "Vulnerability",
  "Network",
  "Compliance",
  "Malware",
  "SAST",
  "Container",
  "Pentest",
  "OWASP",
];

type NewScanModalProps = {
  onClose: () => void;
  onSubmit: (scan: ScanRequest) => void;
};

export function NewScanModal({ onClose, onSubmit }: NewScanModalProps) {
  const [target, setTarget] = useState("");
  const [type, setType] = useState("Vulnerability");
  const [severity, setSeverity] = useState<Severity>("medium");
  const [error, setError] = useState("");

  const submit = () => {
    if (!target.trim()) {
      setError("Target domain or IP is required");
      return;
    }

    onSubmit({
      id: `SCN-${1050 + Math.floor(Math.random() * 900)}`,
      domain: target.trim(),
      requestedFor: target.trim(),
      severity,
      status: "queued",
      type,
      scanType: type,
    });
    onClose();
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
          <button className="sr-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sr-modal__body">
          <div className="sr-field">
            <label className="sr-label">
              Target <span className="sr-required">*</span>
            </label>
            <input
              className={`sr-input${error ? " sr-input--error" : ""}`}
              placeholder="e.g. example.com or 10.0.0.1"
              value={target}
              onChange={(e) => {
                setTarget(e.target.value);
                setError("");
              }}
            />
            {error && <span className="sr-error-msg">{error}</span>}
          </div>

          <div className="sr-field-row">
            <div className="sr-field">
              <label className="sr-label">Scan Type</label>
              <select
                className="sr-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {SCAN_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="sr-field">
              <label className="sr-label">Priority</label>
              <select
                className="sr-input"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity)}
              >
                {(["critical", "high", "medium", "low"] as Severity[]).map(
                  (option) => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="sr-modal__footer">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={submit}>
            Submit Request →
          </Button>
        </div>
      </div>
    </div>
  );
}
