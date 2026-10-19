"use client";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import s from "./shared.module.scss";
export default function SessionBanner() {
  const session = useAppSelector((state) => state.shared.session);
  if (session !== "expired" && session !== "signed-out") return null;
  return (
    <div className={s.sessionBanner} role="status">
      {session === "expired"
        ? "Your demo session has expired."
        : "You are signed out of the access preview."}{" "}
      Existing screens remain available as mock previews.{" "}
      <Link href="/login">Sign in again</Link>. Unsent text drafts are retained
      during client navigation.
    </div>
  );
}
