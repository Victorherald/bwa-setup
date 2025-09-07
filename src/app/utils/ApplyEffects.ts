// utils/status.ts
import { Attack } from "../components/EnemyAttacks";

export type Status = {
  type: "poison" | "burn" | "freeze" | "stun" | "petrify";
  duration: number;
  damagePerTurn: number;
  color: string;
};

// Map ailments to their effects
const statusConfig: Record<string, Omit<Status, "duration">> = {
  poison: { type: "poison", damagePerTurn: 2, color: "purple" },
  burn: { type: "burn", damagePerTurn: 3, color: "orange" },
  freeze: { type: "freeze", damagePerTurn: 0, color: "lightblue" },
  stun: { type: "stun", damagePerTurn: 0, color: "yellow" },
  petrify: { type: "petrify", damagePerTurn: 0, color: "gray" },
};

// Create statuses from an attack’s ailments
export function createStatusesFromAttack(attack: Attack): Status[] {
  if (!attack.ailment) return [];
  return attack.ailment.map((a) => ({
    ...statusConfig[a],
    duration: 3, // default, can be varied per ailment later
  }));
}

// Process statuses each turn: apply DOT, reduce duration, remove expired
export function processStatuses(
  statuses: Status[],
  applyDamage: (amount: number) => void
): Status[] {
  return statuses
    .map((s) => {
      if (s.damagePerTurn > 0) {
        applyDamage(s.damagePerTurn);
      }
      return { ...s, duration: s.duration - 1 };
    })
    .filter((s) => s.duration > 0); // remove expired
}
