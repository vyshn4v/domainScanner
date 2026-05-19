import { useMemo } from "react";
import toast from "react-hot-toast";
import "./Profile.css";
import api from "../../lib/api";

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

  const handleSync = () => {
    if (user) {
      api
        .get(`/auth/validate`, {
          withCredentials: true,
        })
        .then((res) => {
          const updatedUser = res.data;
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
          toast.success("Profile data updated from SSO");
          //   window.location.reload();
        })
        .catch((err) => {
          toast.error(
            err instanceof Error
              ? err.message
              : "Failed to sync profile data from SSO",
          );
        });
      //   window.location.reload();
    } else {
      toast.error("No profile data available to sync.");
    }
  };

  const handleLogout = () => {
    if (user) {
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
            <p className="profile-eyebrow">Profile</p>
            <h1 className="profile-title">{displayName}</h1>
            <p className="profile-subtitle">
              {user?.email ?? "No email available"}
            </p>
          </div>
        </div>

        <div className="profile-details">
          <div className="profile-detail">
            <dt>First name</dt>
            <dd>{user?.firstName ?? "—"}</dd>
          </div>
          <div className="profile-detail">
            <dt>Last name</dt>
            <dd>{user?.lastName ?? "—"}</dd>
          </div>
          <div className="profile-detail profile-detail--full">
            <dt>Email</dt>
            <dd>{user?.email ?? "—"}</dd>
          </div>
        </div>

        <button className="btn-primary profile-sync-btn" onClick={handleSync}>
          Sync from SSO
        </button>
        <button className="btn-logout profile-sync-btn" onClick={handleLogout}>
          🚨 Logout
        </button>
      </div>
    </main>
  );
}
