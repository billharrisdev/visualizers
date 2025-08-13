import Link from "next/link";

export default function Page() {
  return (
    <section className="py-8 container max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Audio Credits</h1>
      <p className="text-muted-foreground mb-4">
        Audio samples used in this site are Creative Commons licensed.
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          &quot;George Street Shuffle&quot; — Kevin MacLeod — <a className="text-primary underline" href="https://incompetech.com/music/royalty-free/index.html?collection=019" target="_blank" rel="noreferrer">source</a> — CC BY 4.0
        </li>
        <li>
          &quot;Industrial Music Box&quot; — Kevin MacLeod — <a className="text-primary underline" href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1100812" target="_blank" rel="noreferrer">source</a> — CC BY 4.0
        </li>
        <li>
          &quot;Metalmania&quot; — Kevin MacLeod — <a className="text-primary underline" href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1200036" target="_blank" rel="noreferrer">source</a> — CC BY 4.0
        </li>
        <li>
          &quot;Take the Lead&quot; — Kevin MacLeod — <a className="text-primary underline" href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1300024" target="_blank" rel="noreferrer">source</a> — CC BY 4.0
        </li>
      </ul>
      <p className="text-sm text-muted-foreground mt-6">
        Attribution example: &quot;[Track Name]&quot; by Kevin MacLeod (https://incompetech.com/) is licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
      </p>
      <p className="mt-6">
        <Link href="/audio/eq" className="text-primary underline">Back to Audio EQ Visualizer</Link>
      </p>
    </section>
  );
}
