import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <AdminSidebar />
      <div className="ms-64 flex min-h-screen min-w-0 flex-col">
        <AdminTopbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
