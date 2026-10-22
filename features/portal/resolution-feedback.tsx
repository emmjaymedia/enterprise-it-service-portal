"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { submitResolutionFeedback } from "./portal-slice";
import {
  feedbackDemoNow,
  feedbackEligibility,
  feedbackWindowMs,
} from "./feedback-policy";
import s from "./resolution-feedback.module.scss";
const ratingLabels = [
  "Very dissatisfied",
  "Dissatisfied",
  "Neutral",
  "Satisfied",
  "Excellent",
];
const criteriaNames = ["Timeliness", "Expertise", "Communication"];
export default function ResolutionFeedback({ id }: { id: string }) {
  const cycle = useAppSelector(
    (state) =>
      state.portal.tickets.find((t) => t.id === id)?.resolutionCycle ?? 0,
  );
  return <FeedbackForm key={`${id}:${cycle}`} id={id} />;
}
function FeedbackForm({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const ticket = useAppSelector((state) =>
    state.portal.tickets.find((t) => t.id === id),
  );
  const existing = ticket?.feedback?.find(
    (f) => f.cycle === ticket.resolutionCycle,
  );
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [criteria, setCriteria] = useState<Record<string, string>>(
    existing?.criteria ?? {},
  );
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [fail, setFail] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expired, setExpired] = useState(false);
  const lock = useRef(false);
  // Stable preview date keeps historical fixtures reviewable. Newly resolved cycles start at their actual timestamp.
  const baseline = Math.max(
    feedbackDemoNow,
    Date.parse(ticket?.resolvedAt ?? "") || 0,
  );
  const clock = expired ? baseline + feedbackWindowMs + 1 : baseline;
  const eligibility = ticket
    ? feedbackEligibility(ticket, clock)
    : "Ticket unavailable in your current demo session.";
  async function submit() {
    if (lock.current || !ticket || eligibility || (existing && !editing))
      return;
    if (rating < 1 || rating > 5) {
      setError("Select a rating from 1 to 5.");
      return;
    }
    lock.current = true;
    setBusy(true);
    setError("");
    await new Promise((resolve) => setTimeout(resolve, 350));
    if (fail) {
      setError(
        "Feedback could not be saved in this demo. Your answers are preserved. Turn off simulated failure and retry.",
      );
      setBusy(false);
      lock.current = false;
      return;
    }
    dispatch(
      submitResolutionFeedback({
        id,
        cycle: ticket.resolutionCycle!,
        rating,
        comment,
        criteria,
        at: new Date(clock).toISOString(),
        edit: editing,
      }),
    );
    setEditing(false);
    setSubmitted(true);
    setBusy(false);
    lock.current = false;
  }
  return (
    <div className={s.page}>
      <nav aria-label="Breadcrumb">
        <Link href="/portal">Portal Home</Link> ›{" "}
        <Link href="/portal/tickets">My Tickets</Link> ›{" "}
        <Link href={`/portal/tickets/${id}`}>{id}</Link> › Provide Feedback
      </nav>
      <section className={s.survey}>
        <header>
          <span className={s.symbol}>☆</span>
          <small>RESOLUTION SURVEY · AMINA YUSUF</small>
          <h1>How was your support experience?</h1>
          <p>Share your rating to help us improve IT workplace support.</p>
        </header>
        {ticket && (
          <section className={s.summary}>
            <div>
              <span>
                {id} · {ticket.status} · Cycle {ticket.resolutionCycle ?? "—"}
              </span>
              <h2>{ticket.subject}</h2>
              <p>
                {ticket.owner ?? "IT Support"} · {ticket.team ?? "Service Desk"}
              </p>
            </div>
            <small>
              {ticket.resolvedAt
                ? `Resolved ${new Date(ticket.resolvedAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC`
                : "No resolution recorded"}
            </small>
          </section>
        )}
        {eligibility ? (
          <section className={s.notice}>
            <h2>
              {!ticket
                ? "Ticket unavailable"
                : eligibility.includes("expired")
                  ? "Feedback window expired"
                  : "Feedback unavailable"}
            </h2>
            <p>{eligibility}</p>
            {existing && (
              <p>
                Saved response: {existing.rating}/5 ·{" "}
                {existing.comment || "No comment"}
              </p>
            )}
          </section>
        ) : existing && !editing ? (
          <section className={s.notice} role="status">
            <h2>
              {submitted
                ? "Thank you for your feedback"
                : "You already rated this resolution"}
            </h2>
            <p>
              Your response: {existing.rating}/5 —{" "}
              {ratingLabels[existing.rating - 1]}
            </p>
            {existing.comment && (
              <p className={s.comment}>{existing.comment}</p>
            )}
            <p>One response is stored for this resolution cycle.</p>
            <button
              onClick={() => {
                setRating(existing.rating);
                setComment(existing.comment);
                setCriteria(existing.criteria);
                setEditing(true);
                setSubmitted(false);
              }}
            >
              Edit Feedback
            </button>
          </section>
        ) : (
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <fieldset disabled={busy} className={s.rating}>
              <legend>1. Overall Service Quality *</legend>
              <p>
                Rate the support provided from initial diagnosis to final
                resolution.
              </p>
              <div className={s.stars}>
                {ratingLabels.map((label, index) => (
                  <label key={label}>
                    <input
                      type="radio"
                      name="rating"
                      value={index + 1}
                      checked={rating === index + 1}
                      onChange={() => setRating(index + 1)}
                      aria-label={`${index + 1} — ${label}`}
                    />
                    <span aria-hidden="true" data-filled={rating >= index + 1}>
                      ★
                    </span>
                  </label>
                ))}
              </div>
              <strong>
                {rating
                  ? `${rating} — ${ratingLabels[rating - 1]}`
                  : "Choose a rating"}
              </strong>
            </fieldset>
            <h2>2. Detailed Evaluation (Optional)</h2>
            <div className={s.criteria}>
              {criteriaNames.map((name) => (
                <label key={name}>
                  {name}
                  <select
                    disabled={busy}
                    value={criteria[name] ?? ""}
                    onChange={(e) =>
                      setCriteria((old) => ({ ...old, [name]: e.target.value }))
                    }
                  >
                    <option value="">Not rated</option>
                    {[
                      "Very satisfied",
                      "Satisfied",
                      "Neutral",
                      "Dissatisfied",
                    ].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <label className={s.commentLabel}>
              3. Additional Comments (Optional)
              <textarea
                rows={5}
                maxLength={500}
                disabled={busy}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What went well, or what could we improve?"
              />
            </label>
            <small>
              {comment.length}/500 · Do not include passwords or confidential
              information.
            </small>
            <p className={s.notice}>
              One response per resolution cycle. You can edit within five
              calendar days of resolution. Reopening makes this cycle’s survey
              unavailable.
            </p>
            <label className={s.check}>
              <input
                type="checkbox"
                checked={fail}
                disabled={busy}
                onChange={(e) => setFail(e.target.checked)}
              />
              Simulate failed submission (demo)
            </label>
            {error && (
              <p role="alert" className={s.error}>
                {error}
              </p>
            )}
            <div className={s.actions}>
              <button className={s.primary} disabled={busy}>
                {busy
                  ? "Saving…"
                  : editing
                    ? "Save Feedback Changes"
                    : "Submit Feedback"}
              </button>
              {editing && (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setEditing(false)}
                >
                  Cancel Editing
                </button>
              )}
              <Link href="/portal/tickets">Skip & Return to Tickets</Link>
            </div>
          </form>
        )}
        <div className={s.actions}>
          <Link href={`/portal/tickets/${id}`}>
            {ticket?.status === "Resolved"
              ? "Issue not solved? Return to ticket to reopen →"
              : "Return to Ticket →"}
          </Link>
        </div>
        {ticket && !eligibility && (
          <details>
            <summary>Demo feedback window</summary>
            <p>
              Preview date: {new Date(baseline).toISOString()} · Five-day edit
              window.
            </p>
            <button disabled={busy} onClick={() => setExpired(true)}>
              Preview expired window
            </button>
          </details>
        )}
      </section>
      <p className={s.caption}>
        Frontend demo · Feedback resets on reload · No survey delivery or
        reporting integration
      </p>
    </div>
  );
}
