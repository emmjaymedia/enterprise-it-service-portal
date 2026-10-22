"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Icon from "./icon";
import SharedNavigation from "@/features/shared/shared-navigation";
import SessionBanner from "@/features/shared/session-banner";
import { useAppDispatch } from "@/store/hooks";
import { setContext } from "@/features/shared/shared-slice";
import styles from "./workspace-shell.module.scss";

import {
  workspaceMenu,
  adminMenu,
  moduleNavigation,
} from "@/features/screens/navigation";

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
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setContext("agent"));
  }, [dispatch]);
  const pathname = usePathname();
  const inOverview = pathname === "/" || pathname === "/workspace";
  const inTickets =
    pathname.startsWith("/workspace/tickets") ||
    pathname === "/workspace/views";
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
          {pathname.startsWith("/admin") ? (
            <>
              <Link href="/workspace" onClick={() => setMenuOpen(false)}>
                <Icon name="chevron" size={16} />
                Back to Workspace
              </Link>
              <p>ADMINISTRATION</p>
              {adminMenu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={pathname === item.href ? styles.active : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <Icon name="settings" size={16} />
                  {item.label}
                </Link>
              ))}
            </>
          ) : (
            <>
              <p>CORE</p>
              <Link
                href="/"
                aria-current={inOverview ? "page" : undefined}
                className={inOverview ? styles.active : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <Icon name="grid" />
                Overview
              </Link>
              <Link
                href="/workspace/tickets"
                aria-current={inTickets ? "page" : undefined}
                className={inTickets ? styles.active : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <Icon name="ticket" />
                Tickets<span className={styles.live}>Demo</span>
              </Link>
              {workspaceMenu.map((item, i) => {
                const active =
                  pathname.startsWith(item.href) ||
                  (item.label === "Assets & CMDB" &&
                    pathname.startsWith("/workspace/cmdb"));
                return (
                  <div key={item.label}>
                    {i === 3 ? <p>OPERATIONS</p> : null}
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={active ? styles.active : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      <Icon name={item.icon} />
                      {item.label}
                    </Link>
                  </div>
                );
              })}
              <Link
                href="/workspace/team"
                aria-current={
                  pathname === "/workspace/team" ? "page" : undefined
                }
                className={
                  pathname === "/workspace/team" ? styles.active : undefined
                }
                onClick={() => setMenuOpen(false)}
              >
                <Icon name="team" />
                Team Workload
              </Link>
              {(() => {
                const key = pathname.startsWith("/workspace/cmdb")
                  ? "assets"
                  : pathname.startsWith("/workspace/views")
                    ? "tickets"
                    : pathname.split("/")[2];
                const links = moduleNavigation[key];
                return links ? (
                  <>
                    <p>IN THIS MODULE</p>
                    {links.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMenuOpen(false)}
                      >
                        <Icon name="chevron" size={14} />
                        {item.label}
                      </Link>
                    ))}
                  </>
                ) : null;
              })()}
            </>
          )}
        </nav>
        <div className={styles.bottom}>
          <Link
            href="/admin"
            className={
              pathname.startsWith("/admin") ? styles.active : undefined
            }
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="settings" />
            Admin Console
          </Link>
          <Link
            href="/screens"
            aria-current={pathname === "/screens" ? "page" : undefined}
            className={pathname === "/screens" ? styles.active : undefined}
            onClick={() => setMenuOpen(false)}
          >
            <Icon name="grid" size={16} />
            All Screens
          </Link>
          <Link href="/portal" onClick={() => setMenuOpen(false)}>
            <Icon name="team" size={16} />
            Employee Portal
          </Link>
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
          <Link href="/workspace/tickets/new" className={styles.create}>
            <Icon name="plus" size={18} />
            <span>New ticket</span>
          </Link>
          <div className={styles.profile}>
            <span className={styles.avatar}>DC</span>
            <span>
              Daniel Cole<small>Support specialist · Demo</small>
            </span>
          </div>
        </header>
        <SharedNavigation context="agent" />
        <SessionBanner />
        <main id="main-content" className={styles.main} tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
}
