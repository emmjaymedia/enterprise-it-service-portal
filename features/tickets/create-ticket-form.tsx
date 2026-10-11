"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/store/hooks";
import { statusFilterChanged } from "./ticket-filters-slice";
import { useCreateTicketMutation } from "./tickets-api";
import {
  createTicketSchema,
  ticketCategories,
  ticketPriorities,
  type CreateTicketInput,
} from "./ticket-schema";
import styles from "./create-ticket-form.module.scss";

const defaultValues: CreateTicketInput = {
  subject: "",
  description: "",
  category: "Software",
  priority: "Medium",
};

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    if ("data" in error) {
      const data = error.data;

      if (
        typeof data === "object" &&
        data !== null &&
        "error" in data
      ) {
        const details = data.error;

        if (
          typeof details === "object" &&
          details !== null &&
          "message" in details &&
          typeof details.message === "string"
        ) {
          return details.message;
        }
      }
    }

    if ("status" in error && error.status === "CUSTOM_ERROR") {
      return "The server returned an unexpected response. Check the list before submitting again.";
    }
  }

  return "We could not confirm submission. Check the ticket list before trying again.";
}

export default function CreateTicketForm() {
  const dispatch = useAppDispatch();
  const [createTicket, { isLoading }] = useCreateTicketMutation();
  const submitting = useRef(false);
  const [feedback, setFeedback] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
    defaultValues,
  });

  const busy = isLoading || isSubmitting;

  async function onSubmit(values: CreateTicketInput) {
    if (submitting.current) return;

    submitting.current = true;
    setFeedback(null);

    try {
      const result = await createTicket(values).unwrap();

      // Make the newly created Open ticket visible in the table.
      dispatch(statusFilterChanged("All"));
      reset(defaultValues);

      setFeedback({
        kind: "success",
        message: `Ticket ${result.data.id} was created. The ticket list is refreshing.`,
      });
    } catch (error: unknown) {
      setFeedback({
        kind: "error",
        message: getErrorMessage(error),
      });
    } finally {
      submitting.current = false;
    }
  }

  return (
    <section
      id="create-ticket"
      className={styles.section}
      aria-labelledby="create-ticket-heading"
    >
      <h2 id="create-ticket-heading">Create a support ticket</h2>
      <p>Describe the issue so the support team can investigate.</p>

      <form
        className={styles.form}
        noValidate
        aria-busy={busy}
        onSubmit={(event) => {
  void handleSubmit(onSubmit, () => setFeedback(null))(event);
}}
      >
        <fieldset disabled={busy} className={styles.fields}>
          <legend className={styles.legend}>Ticket information</legend>

          <div className={styles.field}>
            <label htmlFor="ticket-subject">Subject</label>
            <input
              id="ticket-subject"
              maxLength={120}
              required
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={
                errors.subject ? "ticket-subject-error" : undefined
              }
              {...register("subject")}
            />
            {errors.subject && (
              <p id="ticket-subject-error" className={styles.error}>
                {errors.subject.message}
              </p>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="ticket-description">Description</label>
            <textarea
              id="ticket-description"
              rows={5}
              maxLength={2000}
              required
              aria-invalid={Boolean(errors.description)}
              aria-describedby={
                errors.description
                  ? "ticket-description-hint ticket-description-error"
                  : "ticket-description-hint"
              }
              {...register("description")}
            />
            <p id="ticket-description-hint">
              Use 20–2,000 characters. Include what happened and what
              you expected.
            </p>
            {errors.description && (
              <p id="ticket-description-error" className={styles.error}>
                {errors.description.message}
              </p>
            )}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="ticket-category">Category</label>
              <select
                id="ticket-category"
                aria-invalid={Boolean(errors.category)}
                aria-describedby={
                  errors.category ? "ticket-category-error" : undefined
                }
                {...register("category")}
              >
                {ticketCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p id="ticket-category-error" className={styles.error}>
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="ticket-priority">Priority</label>
              <select
                id="ticket-priority"
                aria-invalid={Boolean(errors.priority)}
                aria-describedby={
                  errors.priority ? "ticket-priority-error" : undefined
                }
                {...register("priority")}
              >
                {ticketPriorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <p id="ticket-priority-error" className={styles.error}>
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          <button className={styles.submit} type="submit">
            {busy ? "Submitting…" : "Submit ticket"}
          </button>
        </fieldset>

        <div role="status" aria-atomic="true">
          {feedback?.kind === "success" && <p>{feedback.message}</p>}
        </div>

        <div role="alert" aria-atomic="true">
          {feedback?.kind === "error" && (
            <p className={styles.error}>{feedback.message}</p>
          )}
        </div>
      </form>
    </section>
  );
}