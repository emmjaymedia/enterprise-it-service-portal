"use client";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSession } from "./shared-slice";
import s from "./shared.module.scss";
export default function SharedNavigation({
  context,
}: {
  context: "employee" | "agent";
}) {
  const path = usePathname();
  const router = useRouter();
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        router.push("/search");
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [router]);
  const dispatch = useAppDispatch();
  const count = useAppSelector(
    (state) =>
      state.shared.notices.filter((n) => n.context === context && !n.read)
        .length,
  );
  return (
    <nav className={s.sharedNav} aria-label="Shared navigation">
      <Link
        aria-current={path === "/search" ? "page" : undefined}
        href="/search"
      >
        Search
      </Link>
      <Link
        aria-current={path === "/notifications" ? "page" : undefined}
        href="/notifications"
      >
        Notifications <span className={s.count}>{count}</span>
      </Link>
      <Link
        aria-current={path === "/profile" ? "page" : undefined}
        href="/profile"
      >
        Profile & Preferences
      </Link>
      <Link href="/login" onClick={() => dispatch(setSession("signed-out"))}>
        Sign out
      </Link>
    </nav>
  );
}
