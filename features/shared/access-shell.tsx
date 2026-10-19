import Link from "next/link";
import s from "./shared.module.scss";
export default function AccessShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={s.access}>
      <header className={s.accessHeader}>
        <Link href="/login" className={s.brand}>
          <span>▤</span>
          <div>
            ServiceDesk Core<small>AUTH & TRIAGE GATEWAY</small>
          </div>
        </Link>
        <span className={s.badge}>● FRONTEND DEMO</span>
      </header>
      <main className={s.accessMain}>{children}</main>
      <footer className={s.accessFooter}>
        <span>
          ServiceDesk · Simulated access flows · No credentials are sent or
          stored
        </span>
        <Link href="/system-states">System states</Link>
        <Link href="/portal">Employee portal</Link>
        <span>IT Help Desk: ext. 4357</span>
      </footer>
    </div>
  );
}
