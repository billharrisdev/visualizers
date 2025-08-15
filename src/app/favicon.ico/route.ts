// Deprecated favicon.ico route intentionally disabled.
// Leaving as minimal handler to satisfy Next.js file presence until fully removed.
export const dynamic = "force-static";
export function GET() {
  return new Response(null, { status: 410 }); // Gone
}
