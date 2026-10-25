import test from "node:test";
import assert from "node:assert/strict";
import { mergeApprovalState, countApprovalStates } from "../src/lib/editorial/approval.ts";

test("mergeApprovalState preserva agendados e aplica decisões aos rascunhos", () => {
  const items = [
    { id: "scheduled", defaultStatus: "scheduled" },
    { id: "draft", defaultStatus: "pending" },
  ];
  const result = mergeApprovalState(items, { scheduled: "changes", draft: "approved" });
  assert.equal(result.scheduled, "scheduled");
  assert.equal(result.draft, "approved");
});

test("countApprovalStates conta somente os estados exibidos", () => {
  assert.deepEqual(countApprovalStates({ a: "pending", b: "approved", c: "scheduled", d: "changes" }), {
    pending: 1,
    approved: 1,
    scheduled: 1,
    changes: 1,
  });
});
