export const APPROVAL_STATUSES = ["pending", "approved", "changes", "scheduled"] as const;
export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export type ApprovalDefaults = { id: string; defaultStatus: ApprovalStatus };
export type ApprovalState = Record<string, ApprovalStatus>;

/** Itens já agendados são somente leitura: uma mudança visual nunca cancela uma publicação externa. */
export function mergeApprovalState(items: ApprovalDefaults[], saved: ApprovalState = {}): ApprovalState {
  return Object.fromEntries(
    items.map((item) => [
      item.id,
      item.defaultStatus === "scheduled" ? "scheduled" : saved[item.id] ?? item.defaultStatus,
    ]),
  );
}

export function countApprovalStates(state: ApprovalState): Record<ApprovalStatus, number> {
  const counts: Record<ApprovalStatus, number> = { pending: 0, approved: 0, changes: 0, scheduled: 0 };
  for (const status of Object.values(state)) counts[status] += 1;
  return counts;
}
