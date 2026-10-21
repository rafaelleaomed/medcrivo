import type { PlannerItem, Store } from "@/lib/store/types";

/**
 * Mantém o status do post coerente com o planner:
 * agendar → "scheduled"; marcar como publicado → "published"; remover o agendamento → volta a "draft".
 * Falha aqui não derruba a operação do planner (só registra no log).
 */
export async function syncPostStatus(store: Store, item: Pick<PlannerItem, "postId" | "status">, removed = false) {
  if (!item.postId) return;
  try {
    const post = await store.getPost(item.postId);
    if (!post) return;
    let next = post.status;
    if (removed) next = post.status === "scheduled" ? "draft" : post.status;
    else if (item.status === "published") next = "published";
    else if (post.status !== "published") next = "scheduled";
    if (next !== post.status) await store.updatePostStatus(post.id, next);
  } catch (err) {
    console.warn("Status do post não sincronizado:", err);
  }
}
