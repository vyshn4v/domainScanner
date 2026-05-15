import { isRouteErrorResponse, useRouteError } from "react-router";
import "./error.css";

function ErrorShell({
  code,
  title,
  subtitle,
  detail,
  stack,
}: {
  code: string;
  title: string;
  subtitle?: string;
  detail?: string;
  stack?: string;
}) {
  return (
    <div className="err-root">
      <div className="err-card">
        <p className="err-eyebrow">Error · {code}</p>
        <h1 className="err-title">{title}</h1>
        {subtitle && <p className="err-subtitle">{subtitle}</p>}
        {detail && (
          <div className="err-detail">
            <p>{detail}</p>
          </div>
        )}
        {stack && (
          <div className="err-stack-wrap">
            <p className="err-stack-label">Stack trace</p>
            <pre className="err-stack">{stack}</pre>
          </div>
        )}
        <div className="err-actions">
          <button
            className="err-btn-primary"
            onClick={() => window.location.reload()}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
            </svg>
            Reload page
          </button>
          <button
            className="err-btn-ghost"
            onClick={() => window.history.back()}
          >
            ← Go back
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_TITLES: Record<number, { title: string; subtitle: string }> = {
  404: {
    title: "Page not found",
    subtitle: "The page you're looking for doesn't exist or has been moved.",
  },
  403: {
    title: "Access denied",
    subtitle: "You don't have permission to view this page.",
  },
  401: {
    title: "Unauthorized",
    subtitle: "You need to be signed in to access this page.",
  },
  500: {
    title: "Server error",
    subtitle: "Something went wrong on our end. Please try again.",
  },
};

export default function RootErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const meta = STATUS_TITLES[error.status];
    return (
      <ErrorShell
        code={String(error.status)}
        title={meta?.title ?? error.statusText}
        subtitle={meta?.subtitle ?? "An unexpected error occurred."}
        detail={error.data ? String(error.data) : undefined}
      />
    );
  }

  if (error instanceof Error) {
    return (
      <ErrorShell
        code="Runtime Error"
        title="Something went wrong"
        subtitle="An unexpected error occurred. You can reload the page or go back."
        detail={error.message}
        stack={error.stack}
      />
    );
  }

  return (
    <ErrorShell
      code="Unknown"
      title="An unknown error occurred"
      subtitle="We're not sure what happened. Try reloading the page."
    />
  );
}
