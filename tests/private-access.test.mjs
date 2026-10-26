import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import {
  authorizedUserId,
  parseAllowedEmails,
} from "../src/lib/access.ts";
import { privateEditorialImages, resolveEditorialAssetPath } from "../src/lib/editorial/assets.ts";

test("parseAllowedEmails normaliza e remove duplicados", () => {
  assert.deepEqual(
    parseAllowedEmails(" Rafael@Example.com,rafael@example.com ; outro@example.com "),
    ["rafael@example.com", "outro@example.com"],
  );
});

test("authorizedUserId aceita apenas conta explicitamente permitida", () => {
  const claims = { sub: "user-123", email: "Rafael@Example.com" };
  assert.equal(authorizedUserId(claims, "rafael@example.com"), "user-123");
});

test("authorizedUserId bloqueia conta não permitida ou configuração ausente", () => {
  const claims = { sub: "user-123", email: "intruso@example.com" };
  assert.equal(authorizedUserId(claims, "rafael@example.com"), null);
  assert.equal(authorizedUserId(claims, ""), null);
  assert.equal(
    authorizedUserId({ sub: "user-123", user_metadata: { email: "rafael@example.com" } }, "rafael@example.com"),
    null,
  );
});

test("resolveEditorialAssetPath aceita somente imagens editoriais seguras", () => {
  const root = "/srv/app/assets/posts";
  assert.equal(
    resolveEditorialAssetPath(root, ["c1-carousel", "slide-01.jpg"]),
    path.join(root, "c1-carousel", "slide-01.jpg"),
  );
  assert.equal(resolveEditorialAssetPath(root, ["..", "segredo.jpg"]), null);
  assert.equal(resolveEditorialAssetPath(root, ["c1-carousel", "manifest.json"]), null);
  assert.equal(resolveEditorialAssetPath(root, ["c1-carousel", "pasta", "slide-01.jpg"]), null);
});

test("privateEditorialImages reescreve somente projeto e arquivos válidos", () => {
  assert.deepEqual(
    privateEditorialImages("c1-carousel", ["https://example.com/posts/c1-carousel/slide-01.jpg", "manifest.json"]),
    ["/api/editorial/assets/c1-carousel/slide-01.jpg"],
  );
  assert.deepEqual(privateEditorialImages("../../etc", ["https://example.com/slide-01.jpg"]), []);
});
