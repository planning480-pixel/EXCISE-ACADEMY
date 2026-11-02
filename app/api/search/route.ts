import { NextResponse } from "next/server";
import { buildSearchDocs, type SearchDoc } from "@/content";
import { GLOSSARY } from "@/content/glossary";
import { searchDocs } from "@/lib/search";
import { faqSearchDocs } from "@/lib/faq";

let staticDocs: SearchDoc[] | null = null;
function getStaticDocs() {
  if (!staticDocs) {
    staticDocs = [
      ...buildSearchDocs(),
      ...GLOSSARY.map((t) => ({
        id: `g-${t.term}`,
        kind: "glossary" as const,
        roomSlug: t.slug,
        title: t.en ? `${t.term} (${t.en})` : t.term,
        text: t.def,
      })),
    ];
  }
  return staticDocs;
}

export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q")?.slice(0, 200) ?? "";
  const limit = Number(new URL(req.url).searchParams.get("limit") ?? 8);
  const hits = searchDocs([...getStaticDocs(), ...faqSearchDocs()], q, Math.min(limit, 12));
  return NextResponse.json({ hits });
}
