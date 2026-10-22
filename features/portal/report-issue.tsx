"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addIssue, saveDraft, type IssueDraft } from "./portal-slice";
import { articles } from "./portal-data";
import s from "./portal.module.scss";
type Attachment = { name: string; size: number };
export default function ReportIssue() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const stored = useAppSelector((state) => state.portal.draft);
  const [draft, setDraft] = useState(stored);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [review, setReview] = useState(false);
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState("");
  const [fail, setFail] = useState(false);
  const [dirty, setDirty] = useState(false);
  const submitting = useRef(false);
  const reviewRef = useRef<HTMLDivElement>(null);
  const matrix: Record<string, Record<string, string>> = {
    "Just me": {
      "Completely blocked": "P3 Medium",
      "Degraded work": "P4 Low",
      "Tolerable delay": "P4 Low",
    },
    "My department / team": {
      "Completely blocked": "P2 High",
      "Degraded work": "P3 Medium",
      "Tolerable delay": "P4 Low",
    },
    "Organization-wide": {
      "Completely blocked": "P1 Critical",
      "Degraded work": "P2 High",
      "Tolerable delay": "P3 Medium",
    },
  };
  const priority = matrix[draft.impact]?.[draft.urgency] ?? "P4 Low";
  const response = priority.startsWith("P1")
    ? "15 minutes"
    : priority.startsWith("P2")
      ? "1 business hour"
      : priority.startsWith("P3")
        ? "4 business hours"
        : "8 business hours";
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = sessionStorage.getItem("portal-issue-draft");
        if (raw) {
          const saved: unknown = JSON.parse(raw);
          if (
            saved &&
            typeof saved === "object" &&
            Object.keys(stored).every(
              (key) =>
                typeof (saved as Record<string, unknown>)[key] === "string",
            )
          ) {
            setDraft(saved as IssueDraft);
            setMessage(
              "Session draft restored. Reattach any files before submitting.",
            );
          }
        }
      } catch {
        setMessage(
          "Session storage unavailable. You can still save a draft for this visit.",
        );
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!dirty) return;
    const timer = setTimeout(() => {
      dispatch(saveDraft(draft));
      try {
        sessionStorage.setItem("portal-issue-draft", JSON.stringify(draft));
        setMessage(
          "Draft auto-saved for this session. File contents are not saved.",
        );
      } catch {
        setMessage(
          "Draft saved for this visit. Session storage is unavailable.",
        );
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [draft, dirty, dispatch]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty && !created) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, created]);
  useEffect(() => {
    if (review) reviewRef.current?.focus();
  }, [review]);
  function update(key: keyof IssueDraft, value: string) {
    setDraft((d) => ({ ...d, [key]: value }));
    setDirty(true);
    setErrors((e) => ({ ...e, [key]: "" }));
  }
  function attach(incoming: FileList | null) {
    if (!incoming) return;
    const valid: Attachment[] = [];
    const rejected: string[] = [];
    for (const f of Array.from(incoming)) {
      if (
        !/\.(png|jpe?g|pdf)$/i.test(f.name) ||
        !["image/png", "image/jpeg", "application/pdf"].includes(f.type) ||
        f.size > 20 * 1024 * 1024 ||
        f.size === 0
      )
        rejected.push(f.name);
      else valid.push({ name: f.name, size: f.size });
    }
    if (files.length + valid.length > 5) {
      setErrors((e) => ({ ...e, files: "Choose up to 5 files." }));
      return;
    }
    setFiles((old) => [...old, ...valid]);
    setErrors((e) => ({
      ...e,
      files: rejected.length
        ? `Could not attach: ${rejected.join(", ")}. Use nonempty PNG, JPG or PDF files up to 20 MB each.`
        : "",
    }));
    setDirty(true);
  }
  function validate() {
    const next: Record<string, string> = {};
    if (draft.subject.trim().length < 5)
      next.subject = "Enter a subject of at least 5 characters.";
    if (!draft.category) next.category = "Choose a category.";
    if (!draft.service) next.service = "Choose an affected service.";
    if (draft.description.trim().length < 20)
      next.description = "Describe the issue in at least 20 characters.";
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() =>
        document.getElementById(Object.keys(next)[0])?.focus(),
      );
      return false;
    }
    return true;
  }
  async function submit() {
    if (submitting.current) return;
    submitting.current = true;
    setBusy(true);
    setMessage("Submitting your issue…");
    await new Promise((resolve) => setTimeout(resolve, 600));
    if (fail) {
      setMessage(
        "Submission failed in demo mode. Your input and attachments are preserved. Turn off simulated failure and retry.",
      );
      setBusy(false);
      submitting.current = false;
      return;
    }
    const id = `INC-${Date.now().toString().slice(-8)}`;
    dispatch(
      addIssue({
        id,
        subject: draft.subject.trim(),
        description: draft.description.trim(),
        priority,
        status: "Open",
        attachments: files,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        service: draft.service,
        category: draft.category,
        asset: draft.asset,
      }),
    );
    try {
      sessionStorage.removeItem("portal-issue-draft");
    } catch {}
    setDirty(false);
    setCreated(id);
    router.push(`/portal/tickets/confirmation/${id}`);
    setBusy(false);
  }
  const error = (key: string) =>
    errors[key] && (
      <span id={`${key}-error`} className={s.error}>
        {errors[key]}
      </span>
    );
  return (
    <>
      <div className={s.breadcrumb}>
        <Link
          href="/portal"
          onClick={(e) => {
            if (
              dirty &&
              !window.confirm(
                "Leave this form? Your session draft is saved, but you will need to reattach files.",
              )
            )
              e.preventDefault();
          }}
        >
          ← Help Center
        </Link>{" "}
        / Tickets / Report an Issue
      </div>
      <div className={s.pageTitle}>
        <div>
          <span className={s.eyebrow}>NEW SUPPORT REQUEST</span>
          <h1>Report an IT Issue</h1>
          <p>
            Tell us what’s broken so our team can triage and resolve it
            promptly. We’ll guide you through quick diagnostics first.
          </p>
        </div>
        <span className={s.tag}>
          REQUESTER
          <br />
          Amina Yusuf (You)
        </span>
      </div>
      <div className={s.formColumns}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (validate()) setReview(true);
          }}
          noValidate
        >
          <fieldset disabled={busy || review} className={s.formFields}>
            <section className={s.card}>
              <h2>
                <span className={s.step}>1</span> Issue Overview{" "}
                <small>* Required fields</small>
              </h2>
              <label htmlFor="subject">
                What is the problem in one sentence? *
              </label>
              <input
                id="subject"
                maxLength={100}
                value={draft.subject}
                onChange={(e) => update("subject", e.target.value)}
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? "subject-error" : undefined}
                placeholder="e.g. Unable to connect to company VPN"
              />
              {error("subject")}
              <p className={s.hint}>
                Be concise so IT can route your issue. {draft.subject.length}
                /100
              </p>
              <div className={s.twoFields}>
                <div>
                  <label htmlFor="category">Category *</label>
                  <select
                    id="category"
                    value={draft.category}
                    onChange={(e) => update("category", e.target.value)}
                    aria-invalid={!!errors.category}
                    aria-describedby={
                      errors.category ? "category-error" : undefined
                    }
                  >
                    <option value="">Choose a category</option>
                    {[
                      "Network / Remote Access",
                      "Hardware",
                      "Software",
                      "Account / Access",
                      "Other",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                  {error("category")}
                </div>
                <div>
                  <label htmlFor="service">Affected Service or System *</label>
                  <select
                    id="service"
                    value={draft.service}
                    onChange={(e) => update("service", e.target.value)}
                    aria-invalid={!!errors.service}
                    aria-describedby={
                      errors.service ? "service-error" : undefined
                    }
                  >
                    <option value="">Choose a service</option>
                    {[
                      "Corporate VPN (GlobalProtect / AnyConnect)",
                      "Email / Outlook",
                      "Workday",
                      "Laptop / Desktop",
                      "Other / Not sure",
                    ].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                  {error("service")}
                </div>
              </div>
              <label htmlFor="asset">
                Which device are you experiencing this on?
              </label>
              <select
                id="asset"
                value={draft.asset}
                onChange={(e) => update("asset", e.target.value)}
              >
                <option value="">Not device-specific / Not sure</option>
                <option>ASSET-MBP-9812 — MacBook Pro (Assigned to you)</option>
              </select>
              {draft.service.includes("VPN") && (
                <p className={s.info}>
                  ● Demo VPN gateways are operational. If colleagues are
                  affected, tell us below.
                </p>
              )}
            </section>
            <section className={s.card}>
              <h2>
                <span className={s.step}>2</span> Impact & Urgency Assessment
              </h2>
              <p className={s.hint}>
                Answer in your own words. We calculate priority and response
                targets automatically.
              </p>
              {(
                [
                  {
                    key: "impact",
                    title: "Who is affected by this issue?",
                    options: [
                      "Just me",
                      "My department / team",
                      "Organization-wide",
                    ],
                    hints: [
                      "Only my individual station or account is blocked.",
                      "Colleagues in my unit are reporting identical issues.",
                      "Critical system down or major customer impact.",
                    ],
                  },
                  {
                    key: "urgency",
                    title: "How urgently do you need a resolution?",
                    options: [
                      "Completely blocked",
                      "Degraded work",
                      "Tolerable delay",
                    ],
                    hints: [
                      "Immediate deadline, zero workaround available.",
                      "Limited workaround, but critical tasks delayed.",
                      "Minor inconvenience or scheduling inquiry.",
                    ],
                  },
                ] as const
              ).map((group) => (
                <fieldset className={s.choices} key={group.key}>
                  <legend>{group.title} *</legend>
                  <div>
                    {group.options.map((option, i) => (
                      <label key={option}>
                        <input
                          type="radio"
                          name={group.key}
                          value={option}
                          checked={draft[group.key] === option}
                          onChange={() => update(group.key, option)}
                        />
                        <strong>{option}</strong>
                        <small>{group.hints[i]}</small>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
              <div className={s.info} aria-live="polite">
                <strong>Calculated Priority: {priority}</strong>
                <p>
                  Based on {draft.impact.toLowerCase()} impact and{" "}
                  {draft.urgency.toLowerCase()}. Illustrative first response
                  target: {response}. IT may reassess after review.
                </p>
              </div>
            </section>
            <section className={s.card}>
              <h2>
                <span className={s.step}>3</span> Description & Diagnostics
              </h2>
              <label htmlFor="description">
                What happened, and what have you tried? *
              </label>
              <textarea
                id="description"
                rows={7}
                maxLength={5000}
                value={draft.description}
                onChange={(e) => update("description", e.target.value)}
                placeholder="Include error messages, when it started, and any troubleshooting steps."
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "description-error" : undefined
                }
              />
              {error("description")}
              <p className={s.hint}>
                Plain text · {draft.description.length}/5000
              </p>
              <label htmlFor="attachments">
                Attachments (Screenshots or Logs)
              </label>
              <div
                className={s.drop}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  attach(e.dataTransfer.files);
                }}
              >
                <p>Drag and drop files here, or browse from your computer</p>
                <input
                  id="attachments"
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={(e) => {
                    attach(e.target.files);
                    e.target.value = "";
                  }}
                />
                <small>
                  PNG, JPG, PDF · Up to 20 MB each · Maximum 5 files
                </small>
              </div>
              {error("files")}
              {files.map((f, i) => (
                <div className={s.file} key={`${f.name}-${i}`}>
                  <span>
                    {f.name} ({(f.size / 1024 / 1024).toFixed(2)} MB)
                    <small>
                      Ready · Demo retains filename only; no upload or security
                      scan
                    </small>
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${f.name}`}
                    onClick={() =>
                      setFiles((old) => old.filter((_, idx) => idx !== i))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
            </section>
            <div className={s.formFooter}>
              <small>Visible to you and IT Support.</small>
              <button
                type="button"
                onClick={() => {
                  dispatch(saveDraft(draft));
                  try {
                    sessionStorage.setItem(
                      "portal-issue-draft",
                      JSON.stringify(draft),
                    );
                    setMessage(
                      "Draft saved for this session. Reattach files when you return.",
                    );
                  } catch {
                    setMessage("Draft saved for this visit only.");
                  }
                }}
              >
                Save Draft
              </button>
              <button className={s.primary}>Review Issue →</button>
            </div>
          </fieldset>
          <p role="status" className={s.hint}>
            {message}
          </p>
          {review && (
            <div className={s.card} ref={reviewRef} tabIndex={-1}>
              <h2>Review your issue</h2>
              <h3>{draft.subject}</h3>
              <p>
                {draft.category} · {draft.service}
              </p>
              <p>
                {priority} · {response} first response target
              </p>
              <p className={s.reviewText}>{draft.description}</p>
              <p>
                {files.length} attachment filename(s) will be recorded in this
                demo.
              </p>
              <label className={s.failure}>
                <input
                  type="checkbox"
                  checked={fail}
                  disabled={busy}
                  onChange={(e) => setFail(e.target.checked)}
                />{" "}
                Simulate a failed submission (demo)
              </label>
              <div className={s.reviewActions}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    setReview(false);
                    submitting.current = false;
                  }}
                >
                  Back to edit
                </button>
                <button
                  type="button"
                  className={s.primary}
                  disabled={busy}
                  onClick={submit}
                >
                  {busy ? "Submitting…" : "Submit Issue →"}
                </button>
              </div>
            </div>
          )}
        </form>
        <aside className={s.aside}>
          <section className={s.card}>
            <h2>✧ Suggested Solutions</h2>
            <p>
              Review these quick fixes before submitting. You might be able to
              get back to work immediately.
            </p>
            {articles
              .filter((a) =>
                draft.category === "Hardware"
                  ? a.title.includes("battery")
                  : draft.category === "Account / Access"
                    ? a.title.includes("MFA")
                    : a.title.includes("VPN"),
              )
              .map((a) => (
                <details className={s.info} key={a.title}>
                  <summary>
                    <small>KNOWLEDGE ARTICLE</small>
                    <h3>{a.title}</h3>
                    <span className={s.textLink}>Read quick guide ↓</span>
                  </summary>
                  <p>{a.text}</p>
                  <Link href="/portal/knowledge">
                    Issue fixed? Return to Help Center →
                  </Link>
                </details>
              ))}
          </section>
          <section className={s.card}>
            <h2>What happens next?</h2>
            <ol>
              <li>
                <strong>Routing to IT Support</strong>
                <p>
                  Your category and affected service help us find the right
                  team.
                </p>
              </li>
              <li>
                <strong>Triage by an engineer</strong>
                <p>Support reviews your report and confirms its priority.</p>
              </li>
              <li>
                <strong>Status updates</strong>
                <p>
                  Follow your issue from My Tickets. This demo does not send
                  email.
                </p>
              </li>
            </ol>
          </section>
          <section className={s.info}>
            <strong>Critical client demo blocked?</strong>
            <p>
              For urgent help, ring the IT Support desk at <b>ext. 4357</b>.
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}
