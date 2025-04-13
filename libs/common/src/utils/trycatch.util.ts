export async function tryCatch<T>(
  fn: () => T | Promise<T>,
): Promise<{ data: T | null; error: any }> {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
