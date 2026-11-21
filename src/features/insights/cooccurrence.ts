import { patterns } from "@/lib/data/patterns";

export type TacticEdge = { source: string; target: string; count: number };
export const tacticCounts = patterns.reduce<Record<string, number>>((counts, pattern) => {
  for (const tactic of pattern.tactics) counts[tactic] = (counts[tactic] ?? 0) + 1;
  return counts;
}, {});
export const tacticNodes = Object.entries(tacticCounts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }));
export const tacticEdges: TacticEdge[] = [];
const included = new Set(tacticNodes.map((node) => node.name));
for (const pattern of patterns) {
  const tactics = pattern.tactics.filter((tactic) => included.has(tactic));
  for (let left = 0; left < tactics.length; left += 1) {
    for (let right = left + 1; right < tactics.length; right += 1) {
      const source = tactics[left];
      const target = tactics[right];
      if (!source || !target) continue;
      const existing = tacticEdges.find((edge) => (edge.source === source && edge.target === target) || (edge.source === target && edge.target === source));
      if (existing) existing.count += 1;
      else tacticEdges.push({ source, target, count: 1 });
    }
  }
}
