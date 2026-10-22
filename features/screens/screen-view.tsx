"use client";
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import Icon from "@/components/workspace/icon";
import type { ScreenLink, ScreenSection, ScreenSpec } from "./screen-types";
import s from "./screens.module.scss";

export default function ScreenView({
  spec,
  initialTab,
}: {
  spec: ScreenSpec;
  initialTab?: string;
}) {
  const [tab, setTab] = useState(
    spec.tabs?.includes(initialTab ?? "")
      ? initialTab!
      : (spec.tabs?.[0] ?? ""),
  );
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [localEdits, setLocalEdits] = useState(false);
  function showPreview(label: string, button: HTMLButtonElement) {
    setPreview(label);
    opener.current = button;
    dialog.current?.showModal();
  }
  function action(item: ScreenLink) {
    return item.href ? (
      <Link
        key={item.label}
        className={item.primary ? s.primary : s.button}
        href={item.href}
      >
        {item.label}
        <Icon name="chevron" size={14} />
      </Link>
    ) : (
      <button
        type="button"
        key={item.label}
        className={item.primary ? s.primary : s.button}
        onClick={(e) => showPreview(item.label, e.currentTarget)}
      >
        {item.label}
      </button>
    );
  }
  const visible = spec.sections.filter(
    (section) => !section.tab || section.tab === tab,
  );
  return (
    <div className={s.screen}>
      <nav className={s.breadcrumb} aria-label="Breadcrumb">
        <Link
          href={
            spec.area === "portal"
              ? "/portal"
              : spec.area === "admin"
                ? "/admin"
                : "/workspace"
          }
        >
          {spec.area === "portal"
            ? "Help Center"
            : spec.area === "admin"
              ? "Administration"
              : "Workspace"}
        </Link>
        <span>/</span>
        {spec.parent && (
          <>
            <Link href={spec.parent.href}>{spec.parent.label}</Link>
            <span>/</span>
          </>
        )}
        <span>{spec.title}</span>
      </nav>
      <header className={`${s.heading} ${spec.darkHero ? s.darkHero : ""}`}>
        <div>
          <span className={s.eyebrow}>{spec.eyebrow}</span>
          <h1>{spec.title}</h1>
          <p>{spec.description}</p>
        </div>
        <div className={s.actions}>{spec.actions?.map(action)}</div>
      </header>
      <div className={s.previewBar}>
        <span className={s.previewDot} />
        Design preview · Sample content{" "}
        <span className={s.previewExplanation}>
          New actions are for layout review; existing ticket workflows remain
          available.
        </span>
      </div>
      {spec.notice && <aside className={s.notice}>{spec.notice}</aside>}
      {spec.metrics && (
        <div className={s.metrics}>
          {spec.metrics.map((metric) => (
            <section
              key={metric.label}
              className={`${s.metric} ${metric.tone ? s[metric.tone] : ""}`}
            >
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.note}</small>
              <span className={s.metricSpark} aria-hidden="true">
                ▁ ▂ ▄ ▃ ▅ ▄ ▆
              </span>
            </section>
          ))}
        </div>
      )}
      {spec.tabs && (
        <div
          className={s.tabs}
          role="tablist"
          aria-label={`${spec.title} sections`}
        >
          {spec.tabs.map((name, index) => (
            <button
              key={name}
              type="button"
              role="tab"
              id={`${spec.id}-tab-${index}`}
              aria-controls={`${spec.id}-panel`}
              aria-selected={tab === name}
              tabIndex={tab === name ? 0 : -1}
              onClick={() => {
                setTab(name);
                setQuery("");
              }}
              onKeyDown={(e) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key))
                  return;
                e.preventDefault();
                const next =
                  e.key === "Home"
                    ? 0
                    : e.key === "End"
                      ? spec.tabs!.length - 1
                      : (index +
                          (e.key === "ArrowRight"
                            ? 1
                            : spec.tabs!.length - 1)) %
                        spec.tabs!.length;
                setTab(spec.tabs![next]);
                setQuery("");
                document.getElementById(`${spec.id}-tab-${next}`)?.focus();
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      <div className={s.layout}>
        <div
          className={s.content}
          id={`${spec.id}-panel`}
          role={spec.tabs ? "tabpanel" : undefined}
          aria-labelledby={
            spec.tabs ? `${spec.id}-tab-${spec.tabs.indexOf(tab)}` : undefined
          }
        >
          {visible.some(
            (block) => block.kind === "table" || block.kind === "cards",
          ) && (
            <div className={s.toolbar}>
              <label>
                <Icon name="search" size={18} />
                <input
                  type="search"
                  aria-label="Search page content"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search this view…"
                />
              </label>
              <span>{tab || "Overview"}</span>
            </div>
          )}
          {visible.map((section, index) => (
            <Section
              key={`${section.title}-${index}`}
              section={section}
              query={query}
              action={action}
              onEdit={() => setLocalEdits(true)}
            />
          ))}
          {localEdits && (
            <p className={s.draftNote} role="status">
              Local preview changes · Nothing has been submitted or saved.
            </p>
          )}
        </div>
        {spec.aside && (
          <aside className={s.aside} aria-label="Page context">
            {spec.aside.map((section, index) => (
              <Section
                key={`${section.title}-${index}`}
                section={section}
                query=""
                action={action}
                onEdit={() => setLocalEdits(true)}
              />
            ))}
          </aside>
        )}
      </div>
      <dialog
        ref={dialog}
        className={s.actionDialog}
        aria-labelledby="preview-action-title"
        onClose={() => opener.current?.focus()}
      >
        <span className={s.eyebrow}>DESIGN PREVIEW</span>
        <h2 id="preview-action-title">{preview}</h2>
        <p>
          This action’s screen is available for review. Its workflow will be
          connected in the feature implementation stage.
        </p>
        <button
          type="button"
          className={s.primary}
          autoFocus
          onClick={() => dialog.current?.close()}
        >
          Back to Page
        </button>
      </dialog>
    </div>
  );
}
function Section({
  section: b,
  query,
  action,
  onEdit,
}: {
  section: ScreenSection;
  query: string;
  action: (link: ScreenLink) => React.ReactNode;
  onEdit: () => void;
}) {
  const normalized = query.trim().toLowerCase();
  const filteredRows = b.rows?.filter((row) =>
    row.cells.join(" ").toLowerCase().includes(normalized),
  );
  const filteredCards = b.cards?.filter((card) =>
    `${card.title} ${card.text} ${card.badge ?? ""}`
      .toLowerCase()
      .includes(normalized),
  );
  return (
    <section className={`${s.section} ${b.tone ? s[b.tone] : ""}`}>
      <div className={s.sectionHeading}>
        <h2>{b.title}</h2>
        {b.caption && <small>{b.caption}</small>}
      </div>
      {(b.kind === "table" || b.kind === "matrix") && (
        <>
          <div
            className={s.tableScroll}
            tabIndex={0}
            role="region"
            aria-label={`${b.title} table`}
          >
            <table>
              <thead>
                <tr>
                  {b.columns?.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows?.map((row, index) => (
                  <tr
                    key={index}
                    className={row.tone ? s[row.tone] : undefined}
                  >
                    {row.cells.map((value, i) => (
                      <td key={i}>
                        {i === 0 && row.href ? (
                          <Link href={row.href}>
                            {value}
                            <Icon name="chevron" size={12} />
                          </Link>
                        ) : (
                          <span className={badgeClass(value)}>{value}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!filteredRows?.length && (
            <p className={s.empty}>No records match this view.</p>
          )}
          <div className={s.tableFooter}>
            <small>{filteredRows?.length ?? 0} records · Sample data</small>
            <span>Page 1 of 1</span>
          </div>
        </>
      )}
      {b.kind === "cards" && (
        <>
          <div className={s.cardGrid}>
            {filteredCards?.map((card) => (
              <article className={s.card} key={card.title}>
                <div className={s.cardTop}>
                  <span className={s.icon}>
                    <Icon name={card.icon ?? "grid"} size={23} />
                  </span>
                  {card.badge && (
                    <span className={badgeClass(card.badge) || s.badge}>
                      {card.badge}
                    </span>
                  )}
                </div>
                {card.value && (
                  <strong className={s.cardValue}>{card.value}</strong>
                )}
                <h3>
                  {card.href ? (
                    <Link href={card.href}>{card.title}</Link>
                  ) : (
                    card.title
                  )}
                </h3>
                <p>{card.text}</p>
                {card.meta && <small>{card.meta}</small>}
                {card.href && (
                  <Link className={s.cardLink} href={card.href}>
                    View Details <Icon name="chevron" size={14} />
                  </Link>
                )}
              </article>
            ))}
          </div>
          {!filteredCards?.length && (
            <p className={s.empty}>No content matches your search.</p>
          )}
        </>
      )}
      {b.kind === "fields" && (
        <div className={s.fields} onChange={onEdit}>
          {b.fields?.map((field) => (
            <label
              className={field.span ? s.fullField : undefined}
              key={field.label}
            >
              {field.label}
              {field.type === "textarea" ? (
                <textarea rows={5} defaultValue={field.value} />
              ) : field.type === "select" ? (
                <select defaultValue={field.value ?? field.options?.[0]}>
                  {field.options?.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              ) : field.type === "checkbox" ? (
                <input
                  type="checkbox"
                  defaultChecked={field.value === "true"}
                />
              ) : (
                <input
                  type={field.type === "password" ? "password" : "text"}
                  defaultValue={field.value}
                  placeholder={field.value ? undefined : field.label}
                />
              )}
              {field.hint && <small>{field.hint}</small>}
            </label>
          ))}
        </div>
      )}
      {b.kind === "timeline" && (
        <ol className={s.timeline}>
          {b.items?.map((item, index) => (
            <li key={index}>
              <span className={s.timelineDot} />
              <div>
                <strong>
                  {item.href ? (
                    <Link href={item.href}>{item.title}</Link>
                  ) : (
                    item.title
                  )}
                </strong>
                {item.text && <p>{item.text}</p>}
                {item.meta && <small>{item.meta}</small>}
              </div>
            </li>
          ))}
        </ol>
      )}
      {b.kind === "checklist" && (
        <ul className={s.checklist}>
          {b.items?.map((item, index) => (
            <li key={index}>
              <span
                className={item.done ? s.completed : s.pending}
                aria-label={item.done ? "Completed" : "Pending"}
              >
                {item.done ? "✓" : "○"}
              </span>
              <div>
                <strong>
                  {item.href ? (
                    <Link href={item.href}>{item.title}</Link>
                  ) : (
                    item.title
                  )}
                </strong>
                {item.text && <p>{item.text}</p>}
                {item.meta && <small>{item.meta}</small>}
              </div>
            </li>
          ))}
        </ul>
      )}
      {b.kind === "workflow" && (
        <ol className={s.workflow}>
          {b.items?.map((item, index) => (
            <li key={index}>
              <span>{index + 1}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {b.kind === "text" && (
        <div className={s.prose}>
          {b.paragraphs?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}
      {b.kind === "code" && (
        <pre className={s.code}>{b.paragraphs?.join("\n")}</pre>
      )}
      {b.kind === "chart" && (
        <div
          className={s.chart}
          role="img"
          aria-label={`${b.title}. ${b.bars?.map((bar) => `${bar.label}: ${bar.value}${bar.secondary ? `, comparison ${bar.secondary}` : ""}`).join("; ")}`}
        >
          {b.bars?.map((bar) => (
            <div className={s.chartColumn} key={bar.label}>
              <span>{bar.value}</span>
              <div className={s.barPair}>
                <i
                  style={
                    {
                      "--bar-height": `${(bar.value / Math.max(...b.bars!.map((v) => Math.max(v.value, v.secondary ?? 0)))) * 130 + 10}px`,
                    } as CSSProperties
                  }
                />
                {bar.secondary !== undefined && (
                  <i
                    className={s.secondaryBar}
                    style={
                      {
                        "--bar-height": `${(bar.secondary / Math.max(...b.bars!.map((v) => Math.max(v.value, v.secondary ?? 0)))) * 130 + 10}px`,
                      } as CSSProperties
                    }
                  />
                )}
              </div>
              <small>{bar.label}</small>
            </div>
          ))}
        </div>
      )}
      {b.kind === "calendar" && (
        <div
          className={`${s.calendar} ${b.tab === "Month" ? s.calendarMonth : ""}`}
        >
          {calendarDays(b.tab === "Month").map((day, index) => (
            <div className={s.calendarDay} key={index}>
              <strong>{day.label}</strong>
              <span className={s.calendarDate}>{day.date}</span>
              {b.items
                ?.filter(
                  (_, i) =>
                    day.current &&
                    day.date ===
                      (b.tab === "Month" ? [26, 22, 24][i] : [22, 24, 25][i]),
                )
                .map((item) => (
                  <div
                    className={`${s.calendarEvent} ${item.tone ? s[item.tone] : ""}`}
                    key={item.title}
                  >
                    {item.href ? (
                      <Link href={item.href}>{item.title}</Link>
                    ) : (
                      <strong>{item.title}</strong>
                    )}
                    <small>{item.text}</small>
                  </div>
                ))}
              {b.tab !== "Month" && ![22, 24, 25].includes(day.date) && (
                <small className={s.freeWindow}>No scheduled changes</small>
              )}
            </div>
          ))}
        </div>
      )}
      {b.kind === "topology" && (
        <div className={s.topology}>
          {b.items?.map((item, index) => (
            <div
              key={index}
              className={`${s.topologyNode} ${index === 0 ? s.rootNode : ""} ${item.tone ? s[item.tone] : ""}`}
            >
              <Icon name={index === 0 ? "grid" : "box"} size={26} />
              <strong>
                {item.href ? (
                  <Link href={item.href}>{item.title}</Link>
                ) : (
                  item.title
                )}
              </strong>
              <small>{item.text}</small>
              {index > 0 && (
                <span className={s.dependencyLabel}>Depends on</span>
              )}
            </div>
          ))}
        </div>
      )}
      {b.kind === "tokens" && (
        <div className={s.tokens}>
          {[
            "#003FB3",
            "#2457D6",
            "#E1E8FF",
            "#F9F9FF",
            "#121B2E",
            "#434654",
            "#BA1A1A",
            "#832F00",
          ].map((color) => (
            <div key={color}>
              <span style={{ background: color }} />
              <code>{color}</code>
            </div>
          ))}
        </div>
      )}
      {b.links && <div className={s.actions}>{b.links.map(action)}</div>}
    </section>
  );
}
function badgeClass(value: string) {
  if (/^(p1|critical|breached|failed|degraded|high$)/i.test(value))
    return `${s.badge} ${s.dangerBadge}`;
  if (
    /^(pending|awaiting|in review|scheduled|reserved|medium$|needs|warning)/i.test(
      value,
    )
  )
    return `${s.badge} ${s.warningBadge}`;
  if (
    /^(active$|approved|completed|compliant|operational|healthy|published|valid$|successful|connected|ready)/i.test(
      value,
    )
  )
    return `${s.badge} ${s.successBadge}`;
  return "";
}

function calendarDays(month: boolean) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return Array.from({ length: month ? 35 : 7 }, (_, index) => {
    const date = month
      ? index < 3
        ? index + 28
        : index > 33
          ? 1
          : index - 2
      : index + 19;
    return {
      date,
      label: `${days[index % 7]} ${date}${month && (index < 3 || index > 33) ? (index < 3 ? " Sep" : " Nov") : ""}`,
      current: !month || (index >= 3 && index <= 33),
    };
  });
}
