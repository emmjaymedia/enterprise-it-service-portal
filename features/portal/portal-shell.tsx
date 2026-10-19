"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setContext, rememberSearch } from "@/features/shared/shared-slice";
import SharedNavigation from "@/features/shared/shared-navigation";
import SessionBanner from "@/features/shared/session-banner";
import Icon from "@/components/workspace/icon";
import s from "./portal.module.scss";
export default function PortalShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setContext("employee"));
  }, [dispatch]);
  return (
    <div className={s.portal}>
      <a className={s.skip} href="#portal-main">
        Skip to content
      </a>
      <header className={s.header}>
        <Link href="/portal" className={s.brand}>
          <span className={s.logo}>
            <Icon name="team" />
          </span>
          <span>
            ServiceDesk<small>Help Center</small>
          </span>
        </Link>
        <span className={s.tag}>Employee Portal</span>
        <form
          action="/search"
          className={s.headerSearch}
          onSubmit={(event) => {
            event.preventDefault();
            const query = new FormData(event.currentTarget).get("q");
            dispatch(
              rememberSearch({
                context: "employee",
                query: String(query ?? ""),
              }),
            );
            router.push(`/search?q=${encodeURIComponent(String(query ?? ""))}`);
          }}
        >
          <Icon name="search" size={16} />
          <input
            name="q"
            aria-label="Search help"
            placeholder="Search for help, articles, services, or tickets…"
          />
        </form>
        <span className={s.profile}>
          Amina Yusuf<small>Sales Lead · Demo employee</small>
        </span>
        <span className={s.avatar}>AY</span>
      </header>
      <SharedNavigation context="employee" />
      <SessionBanner />
      <nav className={s.nav} aria-label="Employee navigation">
        <Link
          aria-current={path === "/portal" ? "page" : undefined}
          href="/portal"
        >
          Home
        </Link>
        <Link
          aria-current={path.includes("/tickets") ? "page" : undefined}
          href="/portal/tickets"
        >
          My Tickets
        </Link>
        <span title="Planned screen">
          Service Catalog <small>Coming soon</small>
        </span>
        <Link href="/portal#guides">Knowledge Base</Link>
        <Link href="/portal#service-status">Service Status</Link>
      </nav>
      <main id="portal-main" className={s.main}>
        {children}
      </main>
      <footer className={s.footer}>
        <span>
          © 2026 ServiceDesk Inc. · Enterprise ITSM Employee Self-Service
        </span>
        <span>IT Support Hotline: ext. 4357 · Frontend demo</span>
      </footer>
    </div>
  );
}
