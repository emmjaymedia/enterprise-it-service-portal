"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  startChallenge,
  setContext,
  startReset,
  completeReset,
  failChallenge,
  renewChallenge,
  verifySession,
  setSession,
  type Context,
} from "./shared-slice";
import AccessShell from "./access-shell";
import s from "./shared.module.scss";
const pause = () => new Promise((r) => setTimeout(r, 400));
export function SignIn() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const session = useAppSelector((state) => state.shared.session);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const currentContext = useAppSelector((state) => state.shared.context);
  const [context, chooseContext] = useState<Context>(currentContext);
  const [scenario, setScenario] = useState("Success");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  async function signIn(sso = false) {
    if (lock.current) return;
    if (!sso && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !password)) {
      setError("Enter a valid email address and a demo password.");
      setPassword("");
      return;
    }
    lock.current = true;
    setBusy(true);
    setError("");
    await pause();
    setPassword("");
    if (scenario !== "Success") {
      setError(
        scenario === "SSO unavailable"
          ? "Organization sign-in is unavailable. Try again later or contact IT Support."
          : scenario === "Rate limited"
            ? "Too many attempts. Try again later or contact IT Support."
            : "Unable to sign in. Check your details or contact IT Support.",
      );
      setBusy(false);
      lock.current = false;
      return;
    }
    dispatch(setContext(context));
    dispatch(
      startChallenge({
        email: sso ? "demo@company.example" : email,
        expires: Date.now() + 120000,
      }),
    );
    router.push("/verify");
  }
  return (
    <AccessShell>
      <div className={s.loginGrid}>
        <section className={s.identityPanel}>
          <span className={s.badge}>SINGLE ENTRY GATEWAY</span>
          <h1>Precision Triage & Incident Governance</h1>
          <p>
            One place to get help, track requests and keep your work moving.
          </p>
          <div className={s.identityTiles}>
            <div>
              Employee self-service<small>Report and track issues</small>
            </div>
            <div>
              Support workspace<small>Manage your team’s work</small>
            </div>
          </div>
          <aside className={s.info}>
            Frontend preview only. Use a fictional email and any demo password.
            This flow does not authenticate an account.
          </aside>
        </section>
        <section className={s.card}>
          <h1>Welcome back to ServiceDesk IT Portal</h1>
          <p>
            Continue with organization sign-in or try the local-account preview.
          </p>
          {session === "expired" && (
            <p className={s.warning}>
              Your demo session expired. Reauthenticate to continue; client-side
              drafts remain available during navigation.
            </p>
          )}
          {error && (
            <p className={s.error} role="alert">
              {error}
            </p>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void signIn();
            }}
          >
            <fieldset disabled={busy}>
              <label>
                Preview experience
                <select
                  value={context}
                  onChange={(e) => chooseContext(e.target.value as Context)}
                >
                  <option value="employee">Employee · Amina Yusuf</option>
                  <option value="agent">Support · Daniel Cole</option>
                </select>
              </label>
              <button
                type="button"
                className={s.sso}
                onClick={() => void signIn(true)}
              >
                Continue with Company SSO →
              </button>
              <p className={s.divider}>
                OR SIGN IN WITH LOCAL DEMO CREDENTIALS
              </p>
              <label>
                Work Email Address
                <input
                  type="email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@company.example"
                />
              </label>
              <label>
                Password
                <div className={s.password}>
                  <input
                    type={visible ? "text" : "password"}
                    autoComplete="off"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    aria-label={visible ? "Hide password" : "Show password"}
                    onClick={() => setVisible(!visible)}
                  >
                    {visible ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
              <Link className={s.textLink} href="/password/reset">
                Forgot password?
              </Link>
              <button className={s.primary}>
                {busy ? "Continuing…" : "Sign In →"}
              </button>
              <label className={s.demoControl}>
                Demo outcome
                <select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                >
                  {[
                    "Success",
                    "Invalid credentials",
                    "Disabled account",
                    "SSO unavailable",
                    "Rate limited",
                  ].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </fieldset>
          </form>
          <details className={s.info}>
            <summary>Privacy in this preview</summary>
            <p>
              No password is persisted, logged or sent. Directory identity and
              access checks need a backend integration.
            </p>
          </details>
        </section>
      </div>
    </AccessShell>
  );
}
export function PasswordReset() {
  const dispatch = useAppDispatch();
  const reset = useAppSelector((state) => state.shared);
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const lock = useRef(false);
  async function submit() {
    if (lock.current) return;
    setError("");
    if (step === "request") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Enter a valid email address.");
        return;
      }
    } else {
      if (!reset.resetActive || reset.resetUsed || token !== "DEMO-RESET") {
        setError(
          "This reset link is invalid, expired or already used. Request another link.",
        );
        setPassword("");
        setConfirm("");
        return;
      }
      if (
        password.length < 12 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password)
      ) {
        setError(
          "Use at least 12 characters, including upper/lowercase letters and a number.",
        );
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
    }
    lock.current = true;
    setBusy(true);
    await pause();
    if (step === "request") {
      dispatch(startReset());
      setNotice(
        "If an eligible local account exists, reset instructions would be sent. No email is sent in this preview.",
      );
    } else {
      dispatch(completeReset());
      setPassword("");
      setConfirm("");
      setNotice(
        "Demo password reset complete. No account credentials were changed.",
      );
    }
    setBusy(false);
    lock.current = false;
  }
  return (
    <AccessShell>
      <section className={s.narrow}>
        <div className={s.segment}>
          <button
            onClick={() => {
              setStep("request");
              setError("");
            }}
          >
            1 · Request Reset
          </button>
          <button
            onClick={() => {
              setStep("reset");
              setError("");
              setNotice("");
            }}
          >
            2 · Token & New Password
          </button>
        </div>
        <div className={`${s.card} ${s.topBorder}`}>
          <span className={s.badge}>ACCOUNT RECOVERY</span>
          <h1>Reset your IT password</h1>
          <div className={s.info}>
            <strong>Single Sign-On (SSO) note</strong>
            <p>
              For an organization-managed account, contact your identity
              provider or IT Help Desk. This form previews local-account
              recovery only.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <fieldset disabled={busy}>
              {step === "request" ? (
                <label>
                  Corporate Email Address
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </label>
              ) : (
                <>
                  <p className={s.hint}>
                    Request a reset first, then use the mock token DEMO-RESET.
                    No actual token is issued.
                  </p>
                  <label>
                    Reset Token
                    <input
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </label>
                  <label>
                    New Password
                    <div className={s.password}>
                      <input
                        type={visible ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                      >
                        {visible ? "Hide" : "Show"}
                      </button>
                    </div>
                  </label>
                  <p className={s.hint}>
                    At least 12 characters, upper/lowercase letters and a
                    number.
                  </p>
                  <label>
                    Confirm Password
                    <input
                      type={visible ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      autoComplete="off"
                    />
                  </label>
                </>
              )}
              {error && (
                <p role="alert" className={s.error}>
                  {error}
                </p>
              )}
              {notice && (
                <p role="status" className={s.success}>
                  {notice}
                </p>
              )}
              <button className={s.primary}>
                {busy
                  ? "Please wait…"
                  : step === "request"
                    ? "Send Password Reset Link →"
                    : "Save New Password"}
              </button>
            </fieldset>
          </form>
          <Link className={s.back} href="/login">
            ← Back to Sign In
          </Link>
        </div>
      </section>
    </AccessShell>
  );
}
export function Verify() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const state = useAppSelector((state) => state.shared);
  const [code, setCode] = useState("");
  const [method, setMethod] = useState("Authenticator");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [expired, setExpired] = useState(false);
  const lock = useRef(false);
  useEffect(() => {
    if (!state.challengeExpires) return;
    const timer = setTimeout(
      () => setExpired(true),
      Math.max(0, state.challengeExpires - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [state.challengeExpires]);
  async function verify() {
    if (lock.current) return;
    setError("");
    if (
      state.session !== "challenge" ||
      expired ||
      Date.now() >= state.challengeExpires
    ) {
      setError("Challenge expired or unavailable. Start again from sign-in.");
      return;
    }
    if (state.challengeAttempts >= 3) {
      setError("Retry limit reached. Start again from sign-in.");
      return;
    }
    lock.current = true;
    setBusy(true);
    await pause();
    if (code !== (method === "Authenticator" ? "123456" : "DEMO-RECOVERY")) {
      dispatch(failChallenge());
      setCode("");
      setError(
        "Invalid code. Try again. Three failed attempts end this demo challenge.",
      );
      setBusy(false);
      lock.current = false;
      return;
    }
    if (Date.now() >= state.challengeExpires) {
      setExpired(true);
      setError("Challenge expired. Request a new challenge.");
      setBusy(false);
      lock.current = false;
      return;
    }
    dispatch(verifySession());
    setCode("");
    router.push(state.context === "agent" ? "/workspace" : "/portal");
  }
  return (
    <AccessShell>
      <section className={`${s.challenge} ${s.card} ${s.topBorder}`}>
        <span className={s.badge}>IDENTITY & ACCESS CHECK · STEP 2 OF 2</span>
        <h1>Two-Factor Authentication</h1>
        <p>Verify the demo challenge to complete the sign-in preview.</p>
        {state.session !== "challenge" ? (
          <div className={s.warning}>
            <p>No active challenge. Sign in first to start one.</p>
            <Link href="/login">Return to Sign In →</Link>
          </div>
        ) : (
          <div className={s.twoColumns}>
            <section>
              <div className={s.info}>
                <strong>
                  {method === "Authenticator"
                    ? "Mobile Authenticator"
                    : "Recovery Code"}
                </strong>
                <p>Challenge for {state.challengeEmail}</p>
                <p>
                  Demo only: use{" "}
                  {method === "Authenticator" ? "123456" : "DEMO-RECOVERY"}. No
                  push, SMS or hardware request is sent.
                </p>
                <span className={s.badge}>
                  {expired ? "Expired" : "Challenge valid for up to 2 minutes"}{" "}
                  · {state.challengeAttempts}/3 attempts
                </span>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void verify();
                }}
              >
                <label>
                  {method === "Authenticator"
                    ? "6-digit authenticator code"
                    : "Recovery code"}
                  <input
                    autoComplete="off"
                    inputMode={method === "Authenticator" ? "numeric" : "text"}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    disabled={busy}
                    required
                    maxLength={method === "Authenticator" ? 6 : 20}
                  />
                </label>
                {error && (
                  <p role="alert" className={s.error}>
                    {error}
                  </p>
                )}
                {notice && (
                  <p role="status" className={s.success}>
                    {notice}
                  </p>
                )}
                <button
                  className={s.primary}
                  disabled={busy || expired || state.challengeAttempts >= 3}
                >
                  {busy ? "Verifying…" : "Verify Identity"}
                </button>
              </form>
              <button
                disabled={busy || state.challengeAttempts >= 3}
                onClick={() => {
                  dispatch(renewChallenge(Date.now() + 120000));
                  setExpired(false);
                  setCode("");
                  setNotice("New demo challenge ready. No message was sent.");
                }}
              >
                Resend Challenge
              </button>
            </section>
            <aside>
              <h2>Alternative verification</h2>
              <button
                disabled={busy}
                onClick={() => {
                  setMethod(
                    method === "Authenticator" ? "Recovery" : "Authenticator",
                  );
                  setCode("");
                  setError("");
                }}
              >
                {method === "Authenticator"
                  ? "Use a recovery code"
                  : "Use authenticator code"}
              </button>
              <div className={s.info}>
                <h3>Lost access to your device?</h3>
                <p>
                  Contact IT Help Desk at ext. 4357. Recovery needs identity
                  verification in the real service.
                </p>
              </div>
              <button
                disabled={busy}
                onClick={() => {
                  dispatch(setSession("signed-out"));
                  router.push("/login");
                }}
              >
                Cancel and Sign Out
              </button>
            </aside>
          </div>
        )}
      </section>
    </AccessShell>
  );
}
