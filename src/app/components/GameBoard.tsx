"use client";

import { useState, useEffect } from "react";
import LetterTile from "./LetterTile";
import EnemySlot from "./EnemySlot";
import { enemies, Enemy } from "./EnemyAttacks";
import { Status, processStatuses, createStatusesFromAttack } from "../utils/ApplyEffects";
import Heart from "../components/Hearts";
import { Slot } from './PlayerSlot';

const PLAYER_MAX_HEALTH = 25;

export default function GameBoard() {
  const [enemyIndex, setEnemyIndex] = useState(0);
  const enemy = enemies[enemyIndex];
  const [playerHealth, setPlayerHealth] = useState(PLAYER_MAX_HEALTH);
  const [enemyHealth, setEnemyHealth] = useState(enemy.maxHealth);

  const [playerStatuses, setPlayerStatuses] = useState<Status[]>([]);
  const [enemyStatuses, setEnemyStatuses] = useState<Status[]>([]);

  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [enemyAttacking, setEnemyAttacking] = useState(false);

  const [enemyAttackIndex, setEnemyAttackIndex] = useState<number | null>(null);

  const [prevPlayerHealth, setPrevPlayerHealth] = useState(playerHealth);
const [prevEnemyHealth, setPrevEnemyHealth] = useState(enemyHealth);

// Then, after every damage:

// Update prevHealth after each render
useEffect(() => {
  setPrevPlayerHealth(playerHealth);
}, [playerHealth]);

useEffect(() => {
  setPrevEnemyHealth(enemyHealth);
}, [enemyHealth]);

  // Handles enemy HP change and spawns next enemy automatically
  const handleEnemyHealthChange = (updater: (hp: number) => number) => {
    setEnemyHealth(prev => {
      const newHp = updater(prev);
      if (newHp <= 0) {
        const nextIndex = enemyIndex + 1;
        if (nextIndex < enemies.length) {
          setEnemyIndex(nextIndex);
          return enemies[nextIndex].maxHealth;
        } else {
          console.log("🎉 All enemies defeated!");
          return 0;
        }
      }
      return newHp;
    });
  };

  // Enemy retaliation
  const handleEnemyRetaliate = () => {
    setTimeout(() => {
      if (playerHealth <= 0) return;

      const attackIndex = Math.floor(Math.random() * enemy.attacks.length);
      const attack = enemy.attacks[attackIndex];
      const damage = 5;
      const heartDamage = damage / 4;

      setPlayerHealth(h => Math.max(0, h - heartDamage));

      // Apply statuses
      const newStatuses = createStatusesFromAttack(attack);
      setPlayerStatuses(prev => [...prev, ...newStatuses]);

      setEnemyStatuses(prev =>
        processStatuses(prev, dmg => handleEnemyHealthChange(hp => Math.max(0, hp - dmg)))
      );

      setEnemyAttackIndex(attackIndex);
      setEnemyAttacking(true);

      setTimeout(() => {
        setEnemyAttackIndex(null);
        setEnemyAttacking(false);
      }, 1000);
    }, 500);
  };

  const renderHearts = (health: number, maxHealth: number, side: "player" | "enemy", prevHealth?: number) => {
  const totalHearts = Math.ceil(maxHealth / 4);

  const fullHearts = Math.floor(health / 4);
  const remainder = health % 4;

  const prevFullHearts = prevHealth !== undefined ? Math.floor(prevHealth / 4) : fullHearts;
  const prevRemainder = prevHealth !== undefined ? prevHealth % 4 : remainder;

  const hearts = [];

  for (let i = 0; i < totalHearts; i++) {
    let fraction = 0;
    if (i < fullHearts) fraction = 4;
    else if (i === fullHearts && remainder > 0) fraction = remainder;

    // Decide if this heart got damaged
    let damaged = false;
    if (prevHealth !== undefined) {
      if (i < prevFullHearts && i >= fullHearts) damaged = true;
      if (i === fullHearts && remainder < prevRemainder) damaged = true;
    }

    hearts.push(<Heart key={i} fraction={fraction} damaged={damaged} />);
  }

  // Split rows
  const mainHearts = hearts.slice(0, 10);
  const extraHearts = hearts.slice(10, 20);
  const extraHearts2 = hearts.slice(20);

  const mainRowClass = side === "player" ? "flex gap-1" : "flex flex-row-reverse gap-1";
  const extraRowClass = side === "player" ? "flex flex-row-reverse gap-1 justify-end scale-y-50 opacity-80" : "flex gap-1 justify-start scale-y-50 opacity-80";

  return (
    <div className="flex flex-col gap-1">
      <div className={mainRowClass}>{mainHearts}</div>
      {extraHearts.length > 0 && <div className={extraRowClass}>{extraHearts.map((h, i) => <div key={`extra-${i}`}>{h}</div>)}</div>}
      {extraHearts2.length > 0 && <div className={extraRowClass}>{extraHearts2.map((h, i) => <div key={`extra2-${i}`}>{h}</div>)}</div>}
    </div>
  );
};



  return (
    <div id="everything">
      <div id="blackout">
        <div id="messageboard">
          <img id="current_speaker" alt="" />
          <p id="speaker_message"></p>
        </div>
      </div>

      <div className="battle-chapter">
          <div id="chapter_text">Chapter 1: The Beginning</div>
          <div id="enemy_level">
          Enemy {enemyIndex + 1} of {enemies.length}
        </div>
        </div>

      <div id="battlefield">
        <div className="separate_layer">
          <div className="name_tag" id="player_name">Lex</div>
          <div className="name_tag" id="enemy_name">{enemy.name}</div>
        </div>

       

        <div className="separate_layer">
        <div className="health_bar" id="enemy_health">
  {renderHearts(enemyHealth, enemy.maxHealth, "enemy", prevEnemyHealth)}
</div>

<div className="health_bar" id="player_health">
  {renderHearts(playerHealth, PLAYER_MAX_HEALTH, "player", prevPlayerHealth)}
</div>
        </div>


        
        

        <img id="player_img"  style={{
            width: "120px",
            transition: "transform 0.3s",
            transform: playerAttacking ? "translateX(30px)" : "translateX(0)",
          }}
          onTransitionEnd={() => setPlayerAttacking(false)} src="/img/lex.png" alt="Player" />

        <table id="selected_grid">
          <tbody>
           
          </tbody>
        </table>

        <div id="enemy_display">
          <div className="speechbubble" id="enemy_speechbubble"></div>
          <div id="overkill_box">
            <a id="overkill_msg">Liquidated!</a>
            <div id="overkill_prize">+</div>
          </div>
          <img id="enemy_img"    style={{
            width: "120px",
            transition: "transform 0.3s",
            transform: enemyAttacking ? "translateX(-30px)" : "translateX(0)",
          }}
          onTransitionEnd={() => setEnemyAttacking(false)} alt="Enemy" />
        </div>

        <div className="separate_layer" id="effect_table">
          {/* Player status icons */}
          <div id="player_effect_table" className="absolute bottom-2 left-2 flex flex-row gap-2">  
            {playerStatuses.map((s, i) => (
    <div
      key={i}
      className="w-8 h-8 flex items-center justify-center rounded-sm text-xs font-bold text-white relative"
      style={{ backgroundColor: s.color }}
    >
      {s.duration}
    </div>
  ))}
          </div>
          <div id="help_text"></div>
          <div id="enemy_effect_table"> 
             {/* Enemy status icons */}
           <div className="absolute bottom-2 right-2 flex flex-row gap-2">
  {enemyStatuses.map((s, i) => (
    <div
      key={i}
      className="absolute bottom-0 right-0 text-[10px] text-white font-bold leading-none"
      style={{ backgroundColor: s.color }}
    >
      {s.duration}
    </div>
  ))}
</div>

           
          </div>
        </div>
      </div>

      <table id="lower_stage">
        <tbody>
          <tr>
            <td className="lower_section">
               <Slot/>
            </td>
            <td className="lower_section" id="lower_center">
              <div id="block_grid">
                <p id="block_grid_text"></p>
              </div>
             
                
                    <LetterTile  playerHealth={playerHealth}
  setPlayerHealth={setPlayerHealth}
  enemyHealth={enemyHealth}
  setEnemyHealth={handleEnemyHealthChange}
  playerStatuses={playerStatuses}
  setPlayerStatuses={setPlayerStatuses}    // ✅ Pass this
  enemyStatuses={enemyStatuses}
  setEnemyStatuses={setEnemyStatuses}      // ✅ Pass this
  onPlayerAttack={() => {
    setPlayerAttacking(true);
    handleEnemyRetaliate();
  }}
        />
               
             
            </td>
            <td className="lower_section">
              <EnemySlot enemy={enemy} activeAttackIndex={enemyAttackIndex}/>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}