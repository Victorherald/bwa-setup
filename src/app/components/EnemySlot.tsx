'use client';


import React, { useState } from "react";
import {  Attack , Enemy} from "./EnemyAttacks";
import { useEffect } from "react";
import "../styling/style.css";

type EnemySlotProps = {
  enemy: Enemy;
  activeAttackIndex: number | null; // tells which attack should blink
};


export default function EnemySlot({ enemy, activeAttackIndex }: EnemySlotProps) {
 
  const [hovered, setHovered] = useState<number | null>(null);
  const [blinkingIndex, setBlinkingIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeAttackIndex !== null) {
      setBlinkingIndex(activeAttackIndex);

      // Stop blinking after ~3 flashes (~900ms)
      const timer = setTimeout(() => setBlinkingIndex(null), 900);
      return () => clearTimeout(timer);
    }
  }, [activeAttackIndex]);

  return (
    <div className="p-4 text-white rounded-lg w-full max-w-md enemy_effect_table">
      <div className="space-y-2">
        {enemy.attacks.map((attack: Attack, idx: number) => (
          <div
            key={idx}
            className={`p-3 rounded-lg bg-red-950 flex items-center w-64 h-12 cursor-pointer transition-all-ease overflow-hidden 
              ${blinkingIndex === idx ? "slow-pulse" : ""}`}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
        
            {/* Text slot (swaps on hover) */}
            <div className="flex-1 text-center px-2">
              {hovered === idx ? (
                <span className="text-sm leading-tight break-words text-yellow-200">
                  {attack.description}
                </span>
              ) : (
                
                // Show icon(s) + attack name normally
    <div className="flex items-center gap-2 w-full">
      {/* ailment squares */}
      <div className="flex gap-3">
        {attack.color.map((c, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-sm shrink-0"
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      {/* attack name */}
      <span className="flex-1 text-center text-red-800">{attack.name}</span>
    </div>

              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
