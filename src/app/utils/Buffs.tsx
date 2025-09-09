export type BuffType = "heal" | "powerUp";

export type Buff = {
  type: BuffType;
  duration?: number;       // only for buffs with turns (like powerUp)
  amount: number;          // heal amount or power multiplier
  color: string;           // icon color
};

export function createBuff(type: BuffType, amount: number, duration?: number): Buff {
  return { type, amount, duration, color: type === "heal" ? "#FF69B4" : "#4CAF50" };
}

// Tick buffs per turn
export function processBuffs(
  buffs: Buff[],
  applyEffect: (buff: Buff) => void
): Buff[] {
  const remainingBuffs: Buff[] = [];

  for (const buff of buffs) {
    applyEffect(buff);

    // Only decrease duration if it exists
    if (buff.duration !== undefined) {
      buff.duration -= 1;
      if (buff.duration > 0) remainingBuffs.push(buff);
    } else {
      // one-time buffs like heal are consumed immediately
    }
  }

  return remainingBuffs;
}
