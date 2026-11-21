import "server-only";

export function apiError(
  message: string,
  status: number,
  code = "request_error",
  retryAfter?: number,
) {
  return Response.json(
    { error: { code, message } },
    {
      status,
      headers: retryAfter ? { "retry-after": String(retryAfter) } : undefined,
    },
  );
}
export async function parseJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
