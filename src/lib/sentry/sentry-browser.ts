/**
 * @name captureApiException
 * @param exception
 * @param requestContext
 */
export async function captureApiException(
  exception: unknown,
  requestContext: Record<string, unknown>,
) {
  const { initializeNodeSentry } = await import(
    "@/lib/sentry/initialize-node-sentry"
  );

  const { captureException } = await import("@sentry/node");

  initializeNodeSentry();

  return captureException(exception, { extra: requestContext });
}
