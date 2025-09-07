// utils/applyeffects.ts
import { Attack } from "../components/EnemyAttacks";

// Status effect type
export type Status = {
  type: "poison" | "burn" | "freeze" | "stun" | "petrify";
  duration: number;
  damagePerTurn: number;
  color: string;
};

// Config for ailments
const statusConfig: Record<string, Omit<Status, "duration">> = {
  poison:  { type: "poison",   damagePerTurn: 2, color: "purple"    },
  burn:    { type: "burn",     damagePerTurn: 3, color: "orange"    },
  freeze:  { type: "freeze",   damagePerTurn: 0, color: "lightblue" },
  stun:    { type: "stun",     damagePerTurn: 0, color: "yellow"    },
  petrify: { type: "petrify",  damagePerTurn: 0, color: "gray"      },
};

// Create statuses from an attack (for DOT / debuffs)
export function createStatusesFromAttack(attack: Attack): Status[] {
  if (!attack.ailment) return [];

  return attack.ailment
    .filter((a: string) => a in statusConfig)
    .map((a: string) => ({
      ...statusConfig[a],
      duration: 3, // default duration
    }));
}

// Apply one-time direct damage (normal hit)
export function applyDirectDamage(
  attack: Attack,
  applyDamage: (amount: number) => void
) {
  const damage = attack.damage ?? 5; // fallback if damage not set
  applyDamage(damage);
}

// Process ongoing statuses each turn (DOT, etc.)
export function processStatuses(
  statuses: Status[],
  applyDamage: (amount: number) => void
): Status[] {
  return statuses
    .map((s) => {
      if (s.damagePerTurn > 0) {
        applyDamage(s.damagePerTurn); // apply DOT
      }
      return { ...s, duration: s.duration - 1 };
    })
    .filter((s) => s.duration > 0); // remove expired
}
