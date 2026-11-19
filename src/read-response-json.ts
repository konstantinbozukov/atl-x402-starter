/** Parse seller JSON without throwing on HTML error pages. */
export async function readResponseJson(res: Response): Promise<{
  parsed: unknown | null;
  diagnostic: string | null;
}> {
  const text = await res.text();
  const trimmed = text.trimStart();
  const contentType = res.headers.get("content-type") ?? "";

  if (
    !contentType.toLowerCase().includes("json") &&
    (trimmed.startsWith("<") || trimmed.toLowerCase().startsWith("<!doctype"))
  ) {
    return {
      parsed: null,
      diagnostic: `HTTP ${res.status}: expected JSON, received HTML (content-type: ${contentType || "none"})`,
    };
  }

  if (!trimmed) {
    return {
      parsed: null,
      diagnostic: `HTTP ${res.status}: empty response body`,
    };
  }

  try {
    return { parsed: JSON.parse(text) as unknown, diagnostic: null };
  } catch {
    return {
      parsed: null,
      diagnostic: `HTTP ${res.status}: invalid JSON (first 120 chars): ${text.slice(0, 120)}`,
    };
  }
}