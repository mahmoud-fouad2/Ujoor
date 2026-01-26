import * as Sentry from "@sentry/nextjs";

type LogMeta = Record<string, unknown>;

function toError(value: unknown): Error | null {
  if (value instanceof Error) return value;
  return null;
}

export const logger = {
  info(message: string, meta?: LogMeta) {
    if (meta) console.info(message, meta);
    else console.info(message);
  },
  warn(message: string, meta?: LogMeta) {
    if (meta) console.warn(message, meta);
    else console.warn(message);
  },
  error(message: string, meta?: LogMeta, err?: unknown) {
    if (meta) console.error(message, meta, err);
    else console.error(message, err);

    const error = toError(err) ?? (meta ? toError((meta as any).error) : null);
    if (error) {
      Sentry.captureException(error);
    }
  },
};
