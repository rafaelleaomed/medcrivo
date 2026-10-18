import Anthropic from "@anthropic-ai/sdk";

/** Modelo padrão quando ANTHROPIC_MODEL não está definido. */
export const DEFAULT_CLAUDE_MODEL = "claude-opus-5-5";

export function getClaudeModel(): string {
  return process.env.ANTHROPIC_MODEL?.trim() || DEFAULT_CLAUDE_MODEL;
}

export function isClaudeConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

let client: Anthropic | null = null;

/** Cliente único; credenciais e ANTHROPIC_BASE_URL (proxy) vêm do ambiente. */
export function getClaudeClient(): Anthropic {
  client ??= new Anthropic({ maxRetries: 2, timeout: 120_000 });
  return client;
}
