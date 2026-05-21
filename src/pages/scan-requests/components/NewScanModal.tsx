import { useState } from "react";
import { Button } from "../../../components/ui/Button";
import type { ScanRequest } from "../types";
import { SCAN_OPTIONS_BY_TYPE } from "./scanOptionsConfig";
import api from "../../../lib/api";

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
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [error, setError] = useState("");

  const toggleOption = (flag: string) => {
    setSelectedOptions((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag],
    );
  };

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!target.trim()) {
      setError("Target domain or IP is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const apiType = type === "Web Audit" ? "web" : "port";
      await api.post(`/scan/${apiType}/${encodeURIComponent(target.trim())}`, {
        domain: target.trim(),
        scanOptions: selectedOptions,
      });

      onSubmit({
        id: `SCN-${1050 + Math.floor(Math.random() * 900)}`,
        domain: target.trim(),
        requestedFor: target.trim(),
        severity: "none",
        status: "queued",
        type,
        scanType: type,
        scanOptions: selectedOptions.length > 0 ? selectedOptions : undefined,
      });
      onClose();
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to schedule scan";
      const apiMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(apiMessage || message);
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

          <div className="sr-field">
            <label className="sr-label">Scan Type</label>
            <select
              className="sr-input"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setSelectedOptions([]);
              }}
            >
              {SCAN_TYPES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="sr-field">
            <label className="sr-label">Scan Options</label>
            <div className="sr-opt-grid">
              {(SCAN_OPTIONS_BY_TYPE[type] || []).map((opt) => (
                <label key={opt.flag} className="sr-opt-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(opt.flag)}
                    onChange={() => toggleOption(opt.flag)}
                  />
                  <span className="sr-opt-flag">{opt.flag}</span>
                  <span className="sr-opt-desc">{opt.description}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="sr-modal__footer">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={submit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Request →"}
          </Button>
        </div>
      </div>
    </div>
  );
}
