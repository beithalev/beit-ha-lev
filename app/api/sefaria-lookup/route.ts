import { NextRequest, NextResponse } from "next/server";

const PREFIX_STRIP = /^(talmud|gemara|mishnah|mishna|masechet|masechta|tractate)\s+/i;

function cleanQuery(input: string) {
  return input.trim().replace(PREFIX_STRIP, "");
}

function toSefariaRef(input: string) {
  return cleanQuery(input).replace(/:/g, ".").replace(/\s+/g, ".");
}

async function fetchText(ref: string) {
  if (!ref) return null;
  try {
    const res = await fetch(`https://www.sefaria.org/api/texts/${encodeURIComponent(ref)}?context=0`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    return data;
  } catch {
    return null;
  }
}

async function resolveTopicRef(query: string) {
  try {
    const res = await fetch(`https://www.sefaria.org/api/name/${encodeURIComponent(query)}`);
    if (!res.ok) return null;
    const data = await res.json();
    const objs = Array.isArray(data.completion_objects) ? data.completion_objects : [];
    const topic = objs.find((o: any) => o.type === "Topic" && o.key);
    if (!topic) return null;

    const topicRes = await fetch(`https://www.sefaria.org/api/v2/topics/${encodeURIComponent(topic.key)}`);
    if (!topicRes.ok) return null;
    const topicData = await topicRes.json();
    return topicData?.ref?.url ?? null;
  } catch {
    return null;
  }
}

async function runTextSearch(query: string) {
  try {
    const res = await fetch("https://www.sefaria.org/api/search-wrapper", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query,
        type: "text",
        field: "naive_lemmatizer",
        size: 15,
        sort_fields: ["pagesheetrank"],
        sort_method: "score",
      }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const hits = data?.hits?.hits ?? [];
    const seen = new Set<string>();
    const results: { ref: string; snippet: string }[] = [];
    for (const hit of hits) {
      const id = String(hit._id ?? "");
      const ref = id.replace(/\s*\([^)]*\)\s*$/, "").trim();
      if (!ref || seen.has(ref)) continue;
      seen.add(ref);

      const highlight = hit.highlight ?? {};
      const snippetArr = highlight.naive_lemmatizer || highlight.exact || [];
      const snippet = Array.isArray(snippetArr) ? snippetArr[0] : "";

      results.push({ ref, snippet: String(snippet || "").replace(/<[^>]+>/g, "") });
    }
    return results;
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const { query } = await req.json();
  if (typeof query !== "string" || !query.trim()) {
    return NextResponse.json({ result: null, searchResults: [] });
  }

  const cleaned = cleanQuery(query);

  let result = await fetchText(toSefariaRef(query));

  if (!result) {
    const topicRef = await resolveTopicRef(cleaned);
    if (topicRef) result = await fetchText(topicRef);
  }

  const searchResults = await runTextSearch(cleaned);

  return NextResponse.json({ result, searchResults });
}
