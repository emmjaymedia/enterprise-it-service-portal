"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import Icon from "@/components/workspace/icon";
import { isActive } from "./portal-ticket-utils";
import { articles } from "./portal-data";
import s from "./portal.module.scss";
export default function EmployeeHome() {
  const tickets = useAppSelector((state) => state.portal.tickets).filter((t) =>
    isActive(t.status),
  );
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      const q = new URLSearchParams(window.location.search).get("q");
      if (q) {
        setQuery(q);
        setSearched(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  const results = articles.filter((a) =>
    `${a.title} ${a.text}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <section className={s.hero}>
        <span className={s.tag}>
          ● ENTERPRISE SERVICE DESK · LONDON CLUSTER
        </span>
        <p>Welcome back, Amina</p>
        <h1>How can IT help you today?</h1>
        <form
          className={s.search}
          onSubmit={(e) => {
            e.preventDefault();
            setSearched(true);
          }}
        >
          <Icon name="search" />
          <input
            aria-label="Search for answers"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for answers, services, software, or ticket updates…"
          />
          <button className={s.primary}>Search →</button>
        </form>
        <div className={s.suggestions}>
          SUGGESTED:{" "}
          {[
            "VPN",
            "Outlook setup",
            "Laptop battery",
            "Wi-Fi",
            "Figma license",
          ].map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                setSearched(true);
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </section>
      <section id="service-status" className={s.status}>
        <strong>● All Corporate Systems Operational</strong>
        <span>SSO, VPN Gateways, Workday, Slack & Jira active</span>
        <small>Illustrative service status</small>
      </section>
      <div className={s.actions}>
        <Link href="/portal/tickets/new" className={s.actionPrimary}>
          <Icon name="settings" size={30} />
          <h2>Report an Issue</h2>
          <p>
            Something broken, lagging, or malfunctioning? File an incident
            ticket for immediate diagnostic triage.
          </p>
          <small>
            Get help from IT Support <b>Submit Ticket →</b>
          </small>
        </Link>
        <div>
          <Icon name="box" size={30} />
          <h2>Request a Service</h2>
          <p>
            Order equipment, request cloud licenses, provision database access,
            or schedule desk peripherals.
          </p>
          <small>Service catalog · Coming soon</small>
        </div>
        <a href="#guides">
          <Icon name="book" size={30} />
          <h2>Knowledge Base</h2>
          <p>
            Curated how-to guides, self-service configurations, security
            policies, and quick troubleshooting tips.
          </p>
          <small>
            Verified by IT Operations <b>Explore Articles →</b>
          </small>
        </a>
      </div>
      <div className={s.homeColumns}>
        <section id="my-tickets">
          <Link className={s.textLink} href="/portal/tickets">
            View all my tickets →
          </Link>
          <h2>
            My Open Tickets <span className={s.tag}>{tickets.length}</span>
          </h2>
          {tickets.map((t) => (
            <details className={s.ticket} key={t.id}>
              <summary>
                <span className={s.tag}>{t.id}</span>{" "}
                <span className={s.tag}>{t.status}</span>{" "}
                <span className={s.warm}>{t.priority}</span>
                <h3>{t.subject}</h3>
                <p>{t.description}</p>
                <span className={s.textLink}>View ticket update ↓</span>
              </summary>
              <div className={s.update}>
                {t.attachments?.length ? (
                  <p>
                    Attachment references:{" "}
                    {t.attachments.map((f) => f.name).join(", ")}
                  </p>
                ) : null}
                <Link
                  className={s.primary}
                  href={`/portal/tickets/${encodeURIComponent(t.id)}`}
                >
                  Open full ticket →
                </Link>
                <strong>IT Support · Public update</strong>
                <p>
                  {t.id === "INC-1042"
                    ? "We are investigating this issue. Please include your AnyConnect error code if you have one."
                    : "Your issue has been received. IT Support will review your report and contact you with next steps."}
                </p>
              </div>
            </details>
          ))}
        </section>
        <section>
          <h2>Assigned Device</h2>
          <div className={s.card}>
            <Icon name="box" size={30} />
            <h3>MacBook Pro 16″ M2 Max</h3>
            <p>macOS Sonoma 14.5 · 32GB RAM</p>
            <div className={s.device}>
              <span>
                Security Compliance
                <br />
                <b>✓ Pass (Jamf Pro)</b>
              </span>
              <span>
                Antivirus / EDR
                <br />
                <b>✓ Active (Falcon)</b>
              </span>
            </div>
            <p className={s.tag}>Next scheduled maintenance in 12 days</p>
          </div>
        </section>
      </div>
      <section id="guides">
        <h2>
          {searched
            ? `Search results for “${query}”`
            : "Recommended Solutions & Guides"}
        </h2>
        <p className={s.muted}>
          Frequently referenced self-help documentation curated for your role
        </p>
        <div className={s.guides}>
          {(searched ? results : articles).map((a) => (
            <details key={a.title} className={s.card}>
              <summary>
                <Icon name={a.icon} />
                <h3>{a.title}</h3>
                <p>{a.time} · Open guide ↓</p>
              </summary>
              <p>{a.text}</p>
              <Link href="/portal/tickets/new">
                Still need help? Report an issue →
              </Link>
            </details>
          ))}
        </div>
        {searched && !results.length && (
          <div className={s.card}>
            No matching guides. Try “VPN” or{" "}
            <Link href="/portal/tickets/new">report an issue</Link>.
          </div>
        )}
      </section>
      <section className={s.support}>
        <Icon name="team" size={32} />
        <div>
          <h2>Can’t find what you’re looking for?</h2>
          <p>Contact the 24/7 IT Help Desk for assistance.</p>
        </div>
        <strong>Call ext. 4357</strong>
      </section>
    </>
  );
}
