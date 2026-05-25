import { useTheme } from "../../../core/hooks/useTheme";
import "./Banned.css";

export default function Banned() {
  const { theme } = useTheme();

  return (
    <main className={`banned-root ${theme}`}>
      <div className="banned-container">
        <div className="banned-icon-wrapper">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <line x1="9" y1="9" x2="15" y2="15" />
            <line x1="15" y1="9" x2="9" y2="15" />
          </svg>
        </div>
        <h1 className="banned-title">Access Revoked</h1>
        <p className="banned-description">
          Your account has been suspended or restricted by an administrator. You
          no longer have the required permissions to access this application.
        </p>
        <div className="banned-actions">
          <a href={import.meta.env.VITE_SSO_URL} className="banned-btn">
            Return to SSO Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}
