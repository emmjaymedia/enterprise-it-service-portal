"use client";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectStatusFilter,
  statusFilterChanged,
  type TicketStatusFilter,
} from "./ticket-filters-slice";
import styles from "@/app/page.module.scss";

type TicketStatus = Exclude<TicketStatusFilter, "All">;

type Ticket = {
  id: string;
  subject: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: TicketStatus;
};

const filters: TicketStatusFilter[] = [
  "All",
  "Open",
  "In progress",
  "Resolved",
];

const statusClasses: Record<TicketStatus, string> = {
  Open: styles.open,
  "In progress": styles.inProgress,
  Resolved: styles.resolved,
};

export default function TicketTable({
  tickets,
}: {
  tickets: Ticket[];
}) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatusFilter);

  const visibleTickets = tickets.filter(
    (ticket) => status === "All" || ticket.status === status,
  );

  return (
    <>
      <div className={styles.ticketFilters}>
        <label htmlFor="ticket-status-filter">Filter by status</label>

        <select
          id="ticket-status-filter"
          value={status}
          onChange={(event) => {
            const selected = filters.find(
              (filter) => filter === event.target.value,
            );

            if (selected) {
              dispatch(statusFilterChanged(selected));
            }
          }}
        >
          {filters.map((filter) => (
            <option key={filter} value={filter}>
              {filter}
            </option>
          ))}
        </select>

        <p role="status">
          Showing {visibleTickets.length} of {tickets.length} tickets
        </p>
      </div>

      <div
        className={styles.tableScroll}
        role="region"
        aria-label="Recent tickets table"
        tabIndex={0}
      >
        <table className={styles.table}>
          <caption className={styles.srOnly}>
            Fictional support tickets filtered by status: {status}
          </caption>

          <thead>
            <tr>
              <th scope="col">Ticket</th>
              <th scope="col">Subject</th>
              <th scope="col">Category</th>
              <th scope="col">Priority</th>
              <th scope="col">Status</th>
            </tr>
          </thead>

          <tbody>
            {visibleTickets.map((ticket) => (
              <tr key={ticket.id}>
                <th scope="row">{ticket.id}</th>
                <td>{ticket.subject}</td>
                <td>{ticket.category}</td>
                <td>{ticket.priority}</td>
                <td>
                  <span
                    className={`${styles.status} ${statusClasses[ticket.status]}`}
                  >
                    {ticket.status}
                  </span>
                </td>
              </tr>
            ))}

            {visibleTickets.length === 0 && (
              <tr>
                <td colSpan={5}>No tickets match this status.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}