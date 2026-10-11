"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useGetTicketQuery } from "@/features/tickets/tickets-api";
import styles from "./page.module.scss";

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data,
    error,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetTicketQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const missing =
    error !== undefined &&
    "status" in error &&
    error.status === 404;

  const ticket = data?.data;

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/#tickets">
        ← Back to tickets
      </Link>

      <h1>Ticket details</h1>

      <p className={styles.notice}>
        Local portfolio demo with fictional records and temporary
        storage.
      </p>

      {isLoading && <p role="status">Loading ticket details…</p>}

      {isError && (
        <section className={styles.card} role="alert">
          <h2>
            {missing ? "Ticket not found" : "Unable to load ticket"}
          </h2>

          <p>
            {missing
              ? "This ticket does not exist in the current demo data. Temporary tickets may disappear after a server restart."
              : "We could not load this ticket. Please try again."}
          </p>

          <button
            className={styles.button}
            type="button"
            disabled={isFetching}
            onClick={() => void refetch()}
          >
            {isFetching ? "Retrying…" : "Retry"}
          </button>
        </section>
      )}

      {!isLoading && !isError && ticket && (
        <article
          className={styles.card}
          aria-labelledby="ticket-subject"
        >
          <p className={styles.ticketId}>{ticket.id}</p>
          <h2 id="ticket-subject">{ticket.subject}</h2>

          <dl className={styles.metadata}>
            <div>
              <dt>Status</dt>
              <dd>{ticket.status}</dd>
            </div>

            <div>
              <dt>Category</dt>
              <dd>{ticket.category}</dd>
            </div>

            <div>
              <dt>Priority</dt>
              <dd>{ticket.priority}</dd>
            </div>
          </dl>

          <section aria-labelledby="description-heading">
            <h3 id="description-heading">Description</h3>
            <p className={styles.description}>
              {ticket.description}
            </p>
          </section>

          <p role="status">
            {isFetching ? "Refreshing ticket details…" : ""}
          </p>
        </article>
      )}
    </main>
  );
}