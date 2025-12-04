// Example Usage

// type Command = {
//   title: string;
//   subtitle?: string;
// };

// const commands: Command[] = [
//   { title: "Open Settings" },
//   { title: "Open System Preferences" },
//   { title: "Spotify", subtitle: "Play some music" },
//   { title: "Shutdown" },
// ];

// const query = "sp";

// const matches = fuzzySearch(query, commands, (c) => c.title, { minScore: 1 });

// for (const m of matches) {
//   console.log(m.item.title, m.score, m.positions);
// }

export type FuzzyMatch = {
  score: number;
  positions: number[]; // indices of matched chars in target
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Thank ChatGPT for this
export function fuzzyMatch(pattern: string, target: string): FuzzyMatch | null {
  if (!pattern) {
    return { score: 0, positions: [] };
  }
  if (!target) {
    return null;
  }

  const p = pattern.toLowerCase();
  const t = target.toLowerCase();

  let ti = 0;
  let pi = 0;

  let score = 0;
  const positions: number[] = [];

  let lastMatchIndex = -1;

  while (pi < p.length && ti < t.length) {
    if (p[pi] === t[ti]) {
      positions.push(ti);

      const isStart = ti === 0;
      const prevChar = t[ti - 1];
      const isWordBoundary =
        isStart ||
        prevChar === " " ||
        prevChar === "-" ||
        prevChar === "_" ||
        prevChar === "/";

      // Base match reward
      let s = 1;

      // Bonus for word/segment boundary (start of word, path segment, etc.)
      if (isWordBoundary) {
        s += 3;
      }

      // Bonus for consecutive matches
      if (lastMatchIndex === ti - 1) {
        s += 2;
      }

      score += s;
      lastMatchIndex = ti;

      pi += 1;
      ti += 1;
    } else {
      ti += 1;
    }
  }

  // Did not match all chars in pattern
  if (pi !== p.length) {
    return null;
  }

  // Penalize large gaps between matched characters
  if (positions.length > 1) {
    let gapPenalty = 0;
    for (let i = 1; i < positions.length; i++) {
      const gap = positions[i] - positions[i - 1] - 1;
      if (gap > 0) {
        gapPenalty += gap * 0.1;
      }
    }
    score -= gapPenalty;
  }

  // Slight length penalty so very long strings with sparse matches rank lower
  score -= (target.length - positions.length) * 0.01;

  return { score, positions };
}

export type FuzzyResult<T = string> = {
  item: T;
  score: number;
  positions: number[];
};

export type FuzzySearchOptions = {
  minScore?: number; // filter by minimum score
};

export function fuzzySearch<T>(
  query: string,
  items: T[],
  getText: (item: T) => string,
  options: FuzzySearchOptions = {}
): FuzzyResult<T>[] {
  const { minScore = Number.NEGATIVE_INFINITY } = options;

  const results: FuzzyResult<T>[] = [];

  for (const item of items) {
    const text = getText(item);
    const match = fuzzyMatch(query, text);
    if (!match) {
      continue;
    }
    if (match.score < minScore) {
      continue;
    }

    results.push({
      item,
      score: match.score,
      positions: match.positions,
    });
  }

  // Higher score first; for ties, shorter text first
  results.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    const ta = getText(a.item).length;
    const tb = getText(b.item).length;
    return ta - tb;
  });

  return results;
}
