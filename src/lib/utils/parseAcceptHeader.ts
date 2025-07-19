// example en,de-DE;q=0.9,de;q=0.8,en-DE;q=0.7,en-US;q=0.6
export function parseAcceptHeader(rawHeader: string): string[] {
  const langs = rawHeader.split(',')
  return langs.map((l: string) => l.split(';')[0]).filter((l: string) => l.includes('-'))
}
