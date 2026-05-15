import { Link } from "react-router";
import { useTheme } from "./theme";
import "./Navbar.css";

function parseNavbarUser() {
  const rawUser = sessionStorage.getItem("user");
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

function getNavbarDisplayName(
  user: { firstName?: string; lastName?: string; name?: string } | null,
) {
  if (!user) {
    return "Profile";
  }

  const first = user.firstName?.trim();
  const last = user.lastName?.trim();
  const fullName = [first, last].filter(Boolean).join(" ");
  return fullName || user.name?.trim() || "Profile";
}

function getNavbarInitials(
  user: { firstName?: string; lastName?: string; name?: string } | null,
) {
  if (!user) {
    return "P";
  }

  const first = user.firstName?.trim();
  const last = user.lastName?.trim();
  if (first && last) {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  }

  if (first) {
    return first.slice(0, 2).toUpperCase();
  }

  return user.name?.slice(0, 2).toUpperCase() || "P";
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const user = parseNavbarUser();
  const displayName = getNavbarDisplayName(user);
  const initials = getNavbarInitials(user);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            Domain Scanner
          </Link>
        </div>

        <div className="navbar-actions">
          {user && (
            <div className="navbar-nav">
              <Link to="/dashboard" className="navbar-link">
                Dashboard
              </Link>
            </div>
          )}
          <div className="theme-switcher">
            <button
              onClick={() => setTheme("light")}
              className={`theme-btn ${theme === "light" ? "theme-btn--active" : ""}`}
              title="Light mode"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`theme-btn ${theme === "dark" ? "theme-btn--active" : ""}`}
              title="Dark mode"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>

            <button
              onClick={() => setTheme("system")}
              className={`theme-btn ${theme === "system" ? "theme-btn--active" : ""}`}
              title="System preference"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </button>
          </div>
          {user && (
            <Link to="/profile" className="navbar-profile" title="Profile">
              <span className="navbar-profile-avatar">{initials}</span>
              <span className="navbar-profile-name">{displayName}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
