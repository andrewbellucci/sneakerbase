import * as Sentry from "@sentry/node";
import { env } from "../utils/env";

Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});

export {
  Sentry
}
