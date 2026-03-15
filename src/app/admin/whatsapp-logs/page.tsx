import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { MessageCircle, CheckCircle, XCircle, Send } from "lucide-react";

export default async function WhatsAppLogsPage() {
  await requireAdmin();

  const logs = await prisma.whatsappLog.findMany({
    include: {
      order: { select: { orderNumber: true } },
    },
    orderBy: { sentAt: "desc" },
    take: 200,
  });

  const sentCount = logs.filter((l) => l.status === "SENT").length;
  const failedCount = logs.filter((l) => l.status === "FAILED").length;
  const deliveredCount = logs.filter((l) => l.status === "DELIVERED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50">
            <MessageCircle className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-secondary">WhatsApp Logs</h1>
            <p className="text-sm text-muted-foreground">
              All WhatsApp messages sent via Interakt
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
          <Send className="h-5 w-5 text-blue-500" />
          <div>
            <p className="text-xl font-bold text-secondary">{sentCount}</p>
            <p className="text-xs text-muted-foreground">Sent</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <div>
            <p className="text-xl font-bold text-secondary">{deliveredCount}</p>
            <p className="text-xs text-muted-foreground">Delivered</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-500" />
          <div>
            <p className="text-xl font-bold text-secondary">{failedCount}</p>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
        </div>
      </div>

      {/* Logs table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-secondary">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Template</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Order</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-secondary">Sent At</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-secondary">{log.phone}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                      {log.templateName}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {log.order?.orderNumber || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${
                        log.status === "DELIVERED"
                          ? "bg-green-50 text-green-700"
                          : log.status === "FAILED"
                          ? "bg-red-50 text-red-700"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {log.status === "DELIVERED" && <CheckCircle className="h-3 w-3" />}
                      {log.status === "FAILED" && <XCircle className="h-3 w-3" />}
                      {log.status === "SENT" && <Send className="h-3 w-3" />}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(log.sentAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No WhatsApp messages sent yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
