"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon, { type IconName } from "./icon";
import styles from "./workspace-shell.module.scss";

const modules: { label: string; icon: IconName }[] = [
  { label: "Major Incidents", icon: "alert" },
  { label: "Service Requests", icon: "ticket" },
  { label: "Approvals", icon: "check" },
  { label: "Problems", icon: "alert" },
  { label: "Changes", icon: "calendar" },
  { label: "Assets & CMDB", icon: "box" },
  { label: "Knowledge Base", icon: "book" },
  { label: "Reports", icon: "chart" },
];
export default function WorkspaceShell({
  children,
  search,
  onSearch,
}: {
  children: ReactNode;
  search: string;
  onSearch: (value: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const inTickets = pathname.startsWith("/workspace/tickets");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);
  const [notifications, setNotifications] = useState(false);
  return (
    <div className={styles.shell}>
      <a href="#main-content" className={styles.skip}>
        Skip to main content
      </a>
      <aside
        id="workspace-navigation"
        className={`${styles.sidebar} ${menuOpen ? styles.expanded : ""}`}
      >
        <Link href="/" className={styles.brand}>
          <span className={styles.brandMark}>
            <Icon name="box" size={24} />
          </span>
          <span>
            ServiceDesk<small>WORKSPACE</small>
          </span>
        </Link>
        <nav aria-label="Workspace" className={styles.navigation}>
          <p>CORE</p>
          <Link
            href="/"
            aria-current={!inTickets ? "page" : undefined}
            className={!inTickets ? styles.active : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="grid" />
            Overview
          </Link>
          <Link
            href="/workspace/tickets"
            onClick={() => setMenuOpen(false)}
            aria-current={inTickets ? "page" : undefined}
            className={inTickets ? styles.active : undefined}
          >
            <Icon name="ticket" />
            Tickets<span className={styles.live}>Demo</span>
          </Link>
          {modules.map((item, i) => (
            <div key={item.label}>
              {i === 3 ? <p>OPERATIONS</p> : null}
              <button
                type="button"
                disabled
                title="Planned screen"
                className={styles.planned}
              >
                <Icon name={item.icon} />
                {item.label}
                <span>Planned</span>
              </button>
            </div>
          ))}
          <a href="/workspace#team-capacity" onClick={() => setMenuOpen(false)}>
            <Icon name="team" />
            Team Workload
          </a>
        </nav>
        <div className={styles.bottom}>
          <span>
            <Icon name="settings" />
            Admin console <small>Planned</small>
          </span>
          <p>
            <span className={styles.dot} />
            Frontend preview · Mock data
          </p>
        </div>
      </aside>
      <div className={styles.workspace}>
        <header className={styles.header}>
          <button
            ref={menuButton}
            className={styles.menu}
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="workspace-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "close" : "menu"} />
          </button>
          <label className={styles.search}>
            <Icon name="search" />
            <span className={styles.srOnly}>Search workspace tickets</span>
            <input
              type="search"
              placeholder="Search tickets by ID, subject or requester…"
              value={search}
              onKeyDown={(event) => {
                if (event.key === "Enter")
                  router.push(
                    `/workspace/tickets?q=${encodeURIComponent(search)}`,
                  );
              }}
              onChange={(e) => onSearch(e.target.value)}
            />
            <kbd>Search</kbd>
          </label>
          <span className={styles.systemStatus}>
            <span className={styles.dot} />
            Demo workspace
          </span>
          <Link href="/tickets#create-ticket" className={styles.create}>
            <Icon name="plus" size={18} />
            <span>New ticket</span>
          </Link>
          <div className={styles.notificationWrap}>
            <button
              type="button"
              className={styles.notification}
              aria-label="Notifications"
              aria-expanded={notifications}
              onClick={() => setNotifications(!notifications)}
            >
              <Icon name="bell" />
              <span>1</span>
            </button>
            {notifications ? (
              <div className={styles.popover}>
                <strong>Demo notifications</strong>
                <p>
                  INC-1044 · Payroll service has breached its resolution SLA.
                </p>
                <a
                  href="/workspace#incident"
                  onClick={() => setNotifications(false)}
                >
                  View incident alert →
                </a>
              </div>
            ) : null}
          </div>
          <div className={styles.profile}>
            <span className={styles.avatar}>DC</span>
            <span>
              Daniel Cole<small>Support specialist · Demo</small>
            </span>
          </div>
        </header>
        <main id="main-content" className={styles.main} tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
