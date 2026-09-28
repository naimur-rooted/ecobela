import { NextResponse } from "next/server";
import type { ZodError } from "zod";

/** Consistent JSON envelope for every API route. */
export type ApiError = {
  ok: false;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export function jsonOk<T extends object>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, ...data }, init);
}

export function jsonError(message: string, status = 400, fieldErrors?: Record<string, string[]>) {
  return NextResponse.json<ApiError>({ ok: false, message, ...(fieldErrors ? { fieldErrors } : {}) }, { status });
}

export function zodFieldErrors(error: ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join(".") : "_form";
    result[key] = [...(result[key] ?? []), issue.message];
  }
  return result;
}

export function zodResponse(error: ZodError) {
  const fieldErrors = zodFieldErrors(error);
  const firstMessage = Object.values(fieldErrors)[0]?.[0] ?? "Please check the highlighted fields.";
  return jsonError(firstMessage, 422, fieldErrors);
}

export function handleRouteError(error: unknown, context: string) {
  console.error(`[api:${context}]`, error);
  const message = error instanceof Error ? error.message : "Unexpected server error";
  return jsonError(message, 500);
}
