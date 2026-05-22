import { useRef, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import { useTheme } from "../../../core/hooks/useTheme";
import "./Navbar.css";
import { useAuth } from "../../../core/hooks/useAuth";
import api from "../../../core/api/axiosInstance";
import { ConfirmDialog } from "../ui/ConfirmDialog";

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
  const { user, setUser } = useAuth();
  const displayName = getNavbarDisplayName(user);
  const initials = getNavbarInitials(user);
  const profileMenuRef = useRef<HTMLDetailsElement>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const closeProfileMenu = () => {
    if (profileMenuRef.current) {
      profileMenuRef.current.open = false;
    }
  };

  const requestLogout = () => {
    closeProfileMenu();
    setShowLogoutConfirm(true);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    api
      .post(`/auth/logout`, {
        withCredentials: true,
      })
      .then(() => {
        sessionStorage.removeItem("user");
        setUser(null);
        window.location.href = "/login";
      })
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Failed to logout");
      });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="navbar-logo">
            Domain Scanner
          </Link>
        </div>

        <div className="navbar-actions">
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
          {user ? (
            <details className="navbar-profile-menu" ref={profileMenuRef}>
              <summary className="navbar-profile" title="Profile menu">
                <span className="navbar-profile-avatar">{initials}</span>
                <span className="navbar-profile-name">{displayName}</span>
              </summary>
              <div className="navbar-profile-dropdown">
                <Link
                  to="/profile"
                  className="navbar-menu-item"
                  onClick={closeProfileMenu}
                >
                  Profile
                </Link>
                <Link
                  to="/"
                  className="navbar-menu-item"
                  onClick={closeProfileMenu}
                >
                  Scan Requests
                </Link>
                <Link
                  to="/scan/search"
                  className="navbar-menu-item"
                  onClick={closeProfileMenu}
                >
                  Domain Scanner
                </Link>
                <Link
                  to="/?new=1"
                  className="navbar-menu-item"
                  onClick={closeProfileMenu}
                >
                  Port Assessment
                </Link>
                <button
                  type="button"
                  className="navbar-menu-item navbar-menu-item--danger"
                  onClick={requestLogout}
                >
                  Logout
                </button>
              </div>
            </details>
          ) : (
            <Link to="/profile" className="navbar-profile" title="Profile">
              <span className="navbar-profile-avatar">L</span>
              <span className="navbar-profile-name">Login</span>
            </Link>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        tone="danger"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </nav>
  );
}
