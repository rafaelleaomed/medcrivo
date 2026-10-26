type Claims = Record<string, unknown> | null | undefined;

function normalizedEmail(value: unknown): string | null {
  return typeof value === "string" && value.includes("@") ? value.trim().toLowerCase() : null;
}

export function parseAllowedEmails(raw = ""): string[] {
  return [...new Set(raw.split(/[;,]/).map(normalizedEmail).filter((email): email is string => Boolean(email)))];
}

export function claimEmail(claims: Claims): string | null {
  if (!claims) return null;
  return normalizedEmail(claims.email);
}

export function authorizedUserId(claims: Claims, rawAllowlist = process.env.MEDCRIVO_ALLOWED_EMAILS ?? ""): string | null {
  const userId = typeof claims?.sub === "string" ? claims.sub : null;
  const email = claimEmail(claims);
  if (!userId || !email) return null;
  return parseAllowedEmails(rawAllowlist).includes(email) ? userId : null;
}
