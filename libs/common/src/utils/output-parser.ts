export function outputParser(response: string): any {
  const cleaned = response
    .replace(/```json\n?/, '')
    .replace(/\n?```/, '')
    .trim();

  return JSON.parse(cleaned);
}
