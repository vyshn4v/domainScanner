import { Link } from "react-router";

type StatusMessageProps = {
  message: string;
  tone?: "info" | "error";
  showBackLink?: boolean;
};

export function StatusMessage({
  message,
  tone = "info",
  showBackLink = false,
}: StatusMessageProps) {
  return (
    <main className="dr-root">
      <section className="dr-main">
        <div
          className={`dr-fetch-status ${
            tone === "error" ? "dr-fetch-status--error" : ""
          }`}
          role={tone === "error" ? "alert" : "status"}
        >
          {message}
        </div>
        {showBackLink && (
          <Link className="dr-back-link" to="/">
            Search another domain
          </Link>
        )}
      </section>
    </main>
  );
}
