import { RollTableEntry } from "../../../state/CardState";

export function GetRollTableEntriesFromMarkdown(
  markdownString: string
): RollTableEntry[] {
  const entries = markdownString
    .split("\n")
    .map((line) => {
      //Parse this format, from a markdown table: |range|content|
      const lineMatches = line.match(/\|([^|]+)\|([^|]+)\|/);

      if (lineMatches === null || lineMatches[2] === null) {
        return null;
      }

      return {
        weight: GetWeight(lineMatches[1]),
        content: lineMatches[2],
      };
    })
    .filter((entry): entry is RollTableEntry => entry != null);

  return entries;
}

function GetWeight(diceRange: string) {
  const rangeMatches = diceRange.match(/(\d+)(\s*-\s*(\d+))?/);
  if (rangeMatches === null) {
    return 1;
  }

  if (rangeMatches[3] === undefined) {
    return 1;
  }

  try {
    const rangeFloor = parseInt(rangeMatches[1]);
    const rangeCeiling = parseInt(rangeMatches[3]);
    return rangeCeiling - rangeFloor + 1;
  } catch (_) {
    return 1;
  }
}

export function GetRollTableEntriesFromCommaSeparatedList(
  inputString: string
): RollTableEntry[] {
  const entries = inputString.split(",").map((entry) => {
    return {
      weight: 1,
      content: entry,
    };
  });

  return entries;
}
