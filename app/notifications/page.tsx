import SharedShell from "@/features/shared/shared-shell";
import Notifications from "@/features/shared/notifications";
export default function Page() {
  return (
    <SharedShell>
      <Notifications />
    </SharedShell>
  );
}
