import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import "./Profile.css";
import api from "../../../core/api/axiosInstance";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { PlanSelection } from "./components/PlanSelection";

type SsoUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  name?: string;
  pictureUrl?: string;
};

function parseSessionUser(): SsoUser | null {
  const sessionUser = sessionStorage.getItem("user");
  if (!sessionUser) {
    return null;
  }

  try {
    return JSON.parse(sessionUser) as SsoUser;
  } catch {
    return null;
  }
}

function getDisplayName(user: SsoUser | null) {
  if (!user) {
    return "Profile";
  }

  const first = user.firstName?.trim();
  const last = user.lastName?.trim();
  if (first || last) {
    return [first, last].filter(Boolean).join(" ");
  }

  return user.name?.trim() || "Profile";
}

function getInitials(user: SsoUser | null) {
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

  if (last) {
    return last.slice(0, 2).toUpperCase();
  }

  return user.name?.slice(0, 2).toUpperCase() || "P";
}

export default function Profile() {
  const user = useMemo(() => parseSessionUser(), []);
  const displayName = getDisplayName(user);
  const initials = getInitials(user);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<"account" | "plans">("account");

  const handleLogout = () => {
    if (user) {
      setShowLogoutConfirm(false);
      api
        .post(`/auth/logout`, {
          withCredentials: true,
        })
        .then(() => {
          sessionStorage.removeItem("user");
          window.location.href = "/login";
        })
        .catch((err) => {
          toast.error(err instanceof Error ? err.message : "Failed to logout");
        });
    }
  };

  return (
    <main className="profile-root">
      <div className="profile-tabs-container">
        <button
          className={`profile-tab ${activeTab === "account" ? "profile-tab--active" : ""}`}
          onClick={() => setActiveTab("account")}
        >
          Account Details
        </button>
        <button
          className={`profile-tab ${activeTab === "plans" ? "profile-tab--active" : ""}`}
          onClick={() => setActiveTab("plans")}
        >
          Plan & Billing
        </button>
      </div>

      {activeTab === "account" && (
        <div className="profile-panel">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.pictureUrl ? (
              <img src={user.pictureUrl} alt="Profile" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <p className="profile-eyebrow">Account</p>
            <h1 className="profile-title">{displayName}</h1>
            <p className="profile-subtitle">
              {user?.email ?? "No email available"}
            </p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <dt>First name</dt>
            <dd>{user?.firstName || "-"}</dd>
          </div>
          <div className="profile-detail">
            <dt>Last name</dt>
            <dd>{user?.lastName || "-"}</dd>
          </div>
          <div className="profile-detail profile-detail--full">
            <dt>Email</dt>
            <dd>{user?.email || "-"}</dd>
          </div>
        </div>

        <div className="profile-actions">
          <button
            className="profile-btn profile-btn--danger"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <svg
              className="profile-btn-icon"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Logout
          </button>
        </div>
        </div>
      )}

      {activeTab === "plans" && <PlanSelection />}

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmLabel="Logout"
        tone="danger"
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
      />
    </main>
  );
}
