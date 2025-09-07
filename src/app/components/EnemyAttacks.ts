export type StatusEffectType =
  | "poison"
  | "burn"
  | "cut"
  | "freeze"
  | "stun"
  | "petrify"
  | "powerUp"
  | "powerDown";



// enemyAttacks.ts
export type Attack = {
  name: string;
  ailment: string[] | string;
  color: string[];
  description: string;
  damage: number;
};

export type Enemy = {
  id: string;
  name: string;
  attacks: Attack[];
  statuses?: ActiveStatus[];
  maxHealth: number;
  ai?: {                   // optional, how AI chooses attacks
    strategy: "random" | "weighted";
    weights?: number[];    // if weighted, corresponds to attacks[]
  };
};


export type ActiveStatus = {
  type: StatusEffectType;
  duration: number;
  damagePerTurn?: number;
};

export const enemies: Enemy[] = [
  {
    id: "enemy1",
    name: "Baddi-boi",
    maxHealth: 40,
    attacks: [
      {
        name: "Hammer Bludgeoning",
        ailment: ["normal"],
        color: ["gray"],
        description: "Damages Lex.",
        damage: 5,
      },
      {
        name: "Call of the North",
        ailment: ["freeze"],
        color: ["blue"],
        description: "Freezes and damages Lex",
        damage: 8,
      },
      {
        name: "Reversed Liberation",
        ailment: ["heal", "powerup", "weaken"],
        color: ["red", "green", "orange"],
        description: "Heals and strengthens the enemy, weakens Lex",
        damage: 0,
      },
    ],
  },
  {
    id: "enemy2",
    name: "Frostling",
    maxHealth: 50,
    attacks: [
      {
        name: "Hostile Wind",
        ailment: ["freeze"], 
        color: ["blue"],
        description: "Freezes and damages Lex.",
        damage: 7,
      },
      {
        name: "Stunning Strike",
        ailment: ["stun"],
        color: ["yellow"],
        description: "Stuns Lex",
        damage: 0,
      },
    ],
  },
  {
    id: "enemy3",
    name: "Spy",
    maxHealth: 50,
    attacks: [
      {
        name: "Knife Juggler",
        ailment: ["damage"], 
        color: ["white"],
        description: "Damages Lex.",
        damage: 10,
      },
      {
        name: "Flaming Orbs",
        ailment: ["stun", "burn"],
        color: ["yellow", "orange"],
        description: "Stuns, burns and damages Lex",
        damage: 12,
      },
      {
        name: "Renewal",
        ailment: ["heal", "powerup"],
        color: ["red", "green"],
        description: "Heals and strengthens the enemy",
        damage: 0,
      },
    ],
  },
];
export default enemies;