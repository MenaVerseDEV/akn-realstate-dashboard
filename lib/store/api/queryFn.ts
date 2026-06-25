export async function wrapQueryFn<T>(promise: Promise<T>) {
  try {
    return { data: await promise };
  } catch (error) {
    return {
      error: {
        status: "CUSTOM_ERROR" as const,
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
