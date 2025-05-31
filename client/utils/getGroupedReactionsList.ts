import { Reaction } from "@/types";

export const getGroupedReactions = (reactions: Reaction[]) => {
    const map = new Map();
    reactions.forEach(({ emoji }) => {
      if (!map.has(emoji)) {
        map.set(emoji, 1);
      } else {
        map.set(emoji, map.get(emoji) + 1);
      }
    });
    return Array.from(map.entries()).map(([emoji, count]) => ({ emoji, count }));
  };