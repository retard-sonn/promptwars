import "server-only";

export function assertReportOwner(userId: string, rowUserId: string | null) {
  if (!rowUserId || rowUserId !== userId) throw new Error("forbidden");
}
