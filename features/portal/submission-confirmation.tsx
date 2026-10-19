"use client";
import Link from "next/link";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { responseTarget, resolutionTarget } from "./portal-ticket-utils";
import s from "./portal.module.scss";
export default function SubmissionConfirmation({ id }: { id: string }) {
  const ticket = useAppSelector((state) =>
    state.portal.tickets.find((t) => t.id === id),
  );
  const [copied, setCopied] = useState("");
  if (!ticket)
    return (
      <section className={s.confirmation}>
        <h1>We can’t confirm this ticket here</h1>
        <p>
          This frontend demo resets ticket records on reload. A missing receipt
          does not mean a submission failed. Check My Tickets before reporting
          the same issue again.
        </p>
        <p>No email notifications are sent by this demo.</p>
        <Link className={s.primary} href="/portal/tickets">
          Check My Tickets →
        </Link>
      </section>
    );
  return (
    <>
      <div className={s.breadcrumb}>
        <Link href="/portal">← Portal Home</Link> /{" "}
        <Link href="/portal/tickets">Tickets</Link> / Confirmation
      </div>
      <section className={s.receipt}>
        <div className={s.receiptIntro}>
          <span className={s.successIcon}>✓</span>
          <span className={s.tag}>ISSUE RECEIVED · FRONTEND DEMO</span>
          <h1>Issue Submitted Successfully!</h1>
          <p>
            Your issue is ready for IT Support to review. Keep your ticket
            number for reference.
          </p>
          <div className={s.reference}>
            <div>
              <small>INCIDENT REFERENCE</small>
              <strong>{ticket.id}</strong>
            </div>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(ticket.id);
                  setCopied("Ticket number copied.");
                } catch {
                  setCopied(
                    "Copy unavailable. Select and copy the ticket number above.",
                  );
                }
              }}
            >
              Copy Ticket ID
            </button>
          </div>
          <p role="status" className={s.hint}>
            {copied}
          </p>
        </div>
        <div className={s.card}>
          <small>REPORTED SUBJECT</small>
          <h3>{ticket.subject}</h3>
          <span className={s.tag}>{ticket.category}</span>
        </div>
        <div className={s.receiptGrid}>
          {[
            [
              "SUBMISSION TIME",
              new Date(ticket.createdAt).toLocaleString("en-GB", {
                timeZone: "UTC",
              }) + " UTC",
            ],
            ["ROUTING POOL", "IT Support · Pending triage"],
            ["CALCULATED PRIORITY", ticket.priority],
            [
              "RESPONSE EXPECTATION",
              `Within ${responseTarget(ticket.priority)}`,
            ],
            [
              "RESOLUTION TARGET",
              `Within ${resolutionTarget(ticket.priority)}`,
            ],
            ["REQUESTER", "Amina Yusuf (You)"],
          ].map(([label, value]) => (
            <div className={s.info} key={label}>
              <small>{label}</small>
              <h3>{value}</h3>
            </div>
          ))}
        </div>
        <section className={s.info}>
          <h2>What Happens Next?</h2>
          <ol className={s.nextSteps}>
            <li>
              <strong>Receipt & dispatch</strong>
              <p>
                Your demo record is available in My Tickets until page reload.
              </p>
            </li>
            <li>
              <strong>Agent triage</strong>
              <p>
                IT Support reviews your description and confirms the priority.
              </p>
            </li>
            <li>
              <strong>Status updates</strong>
              <p>
                Check My Tickets for public updates. This demo does not send
                email.
              </p>
            </li>
          </ol>
        </section>
        <p className={s.hint}>
          Targets are illustrative business-calendar targets, not live
          deadlines. An email delay in the real service would not mean your
          issue failed to submit.
        </p>
        <div className={s.receiptActions}>
          <Link
            className={s.primary}
            href={`/portal/tickets/${encodeURIComponent(ticket.id)}`}
          >
            View Ticket Details
          </Link>
          <Link href="/portal/tickets">Go to My Tickets</Link>
          <Link href="/portal/tickets/new">＋ Report Another Issue</Link>
        </div>
        <div className={s.info}>
          <strong>Need immediate help?</strong>
          <p>For urgent workplace blockers, call IT Support at ext. 4357.</p>
        </div>
      </section>
      <section className={s.support}>
        <div>
          <h2>Self-help troubleshooting</h2>
          <Link className={s.textLink} href="/portal#guides">
            Explore knowledge guides →
          </Link>
        </div>
        <Link className={s.textLink} href="/portal#service-status">
          Check service status →
        </Link>
      </section>
    </>
  );
}
