import Link from "next/link";
import TicketTable from "@/features/tickets/ticket-table";
import styles from "./page.module.scss";

type TicketStatus = "Open" | "In progress" | "Resolved";

type Ticket = {
  id: string;
  subject: string;
  category: string;
  priority: "High" | "Medium" | "Low";
  status: TicketStatus;
};

const tickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Unable to connect to office Wi-Fi",
    category: "Network",
    priority: "High",
    status: "Open",
  },
  {
    id: "TKT-002",
    subject: "Microsoft Teams microphone issue",
    category: "Software",
    priority: "Medium",
    status: "In progress",
  },
  {
    id: "TKT-003",
    subject: "Laptop running slowly",
    category: "Hardware",
    priority: "Medium",
    status: "Open",
  },
  {
    id: "TKT-004",
    subject: "Email setup assistance",
    category: "Account",
    priority: "Low",
    status: "Resolved",
  },
];

const assets = [
  { name: "Dell Latitude 5440", type: "Laptop", available: 3 },
  { name: "Dell UltraSharp 24", type: "Monitor", available: 5 },
  { name: "Logitech MK270", type: "Keyboard & mouse", available: 8 },
];



function SummaryCard({
  label,
  value,
  description,
}: {
  label: string;
  value: number;
  description: string;
}) {
  return (
    <article className={styles.card}>
      <p className={styles.cardLabel}>{label}</p>
      <p className={styles.cardValue}>{value}</p>
      <p className={styles.cardDescription}>{description}</p>
    </article>
  );
}

export default function Home() {
  const openTickets = tickets.filter(
    (ticket) => ticket.status === "Open",
  ).length;

  const inProgress = tickets.filter(
    (ticket) => ticket.status === "In progress",
  ).length;

  const resolved = tickets.filter(
    (ticket) => ticket.status === "Resolved",
  ).length;

  const availableAssets = assets.reduce(
    (total, asset) => total + asset.available,
    0,
  );

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>

      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/" aria-label="ServiceDesk home">
  <span className={styles.brandMark} aria-hidden="true">
    S
  </span>
  <span>
    ServiceDesk
    <small>IT Service & Asset Portal</small>
  </span>
</Link>

        <p className={styles.navLabel}>WORKSPACE</p>

        <nav className={styles.navigation} aria-label="Workspace">
          <a href="#overview">Overview</a>
          <a href="#tickets">Recent tickets</a>
          <a href="#assets">Available assets</a>
        </nav>

        <div className={styles.sidebarNote}>
          <strong>Portfolio workspace</strong>
          <p>Explore IT support and equipment management.</p>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.header}>
          <span>Workspace / Overview</span>
          <span className={styles.demoBadge}>Sample data</span>
        </header>

        <main id="main-content" className={styles.main} tabIndex={-1}>
          <section id="overview" aria-labelledby="overview-heading">
            <div className={styles.intro}>
              <div>
                <p className={styles.eyebrow}>YOUR IT WORKSPACE</p>
                <h1 id="overview-heading">Service overview</h1>
                <p className={styles.subtitle}>
                  Track support tickets and explore available equipment.
                </p>
              </div>

              <a className={styles.primaryLink} href="#tickets">
                View tickets
              </a>
            </div>

            <p className={styles.notice}>
              This dashboard displays fictional sample records. Ticket
              submission, approvals, and sign-in will be added in later
              milestones.
            </p>

            <div className={styles.stats}>
              <SummaryCard
                label="Open tickets"
                value={openTickets}
                description="Awaiting support"
              />
              <SummaryCard
                label="In progress"
                value={inProgress}
                description="Being investigated"
              />
              <SummaryCard
                label="Resolved tickets"
                value={resolved}
                description="Support completed"
              />
              <SummaryCard
                label="Available assets"
                value={availableAssets}
                description="Across the sample catalogue"
              />
            </div>
          </section>
          <section
            id="tickets"
            className={styles.panel}
            aria-labelledby="tickets-heading"
          >
            <div className={styles.panelHeading}>
              <div>
                <h2 id="tickets-heading">Recent tickets</h2>
                <p>A snapshot of the sample support queue.</p>
              </div>

              <span className={styles.count}>
                {tickets.length} tickets
              </span>
            </div>

            <TicketTable tickets={tickets} />
          </section>

          <section
            id="assets"
            className={styles.panel}
            aria-labelledby="assets-heading"
          >
            <div className={styles.panelHeading}>
              <div>
                <h2 id="assets-heading">Available equipment</h2>
                <p>Sample inventory for future asset requests.</p>
              </div>
            </div>

            <ul className={styles.assetGrid}>
              {assets.map((asset) => (
                <li key={asset.name} className={styles.assetCard}>
                  <p className={styles.assetType}>{asset.type}</p>
                  <h3>{asset.name}</h3>
                  <p>{asset.available} available</p>
                </li>
              ))}
            </ul>
          </section>

          <footer className={styles.footer}>
            Enterprise IT Service & Asset Portal · Portfolio project
          </footer>
        </main>
      </div>
    </div>
  );
}