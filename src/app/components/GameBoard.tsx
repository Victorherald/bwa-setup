"use client"

import { useState } from "react";
import "../styling/style.css";
import LetterTile from "./LetterTile";
import { Slot } from "./PlayerSlot";
import EnemySlot from "./EnemySlot";
import { enemies, Attack } from "./EnemyAttacks";
import { createStatusesFromAttack, processStatuses, Status } from "../utils/ApplyEffects";
import { createBuff } from "../utils/Buffs";


type StatusEffect = {
  type: string;           // "poison", "burn", etc.
  duration: number;       // how many turns left
  damagePerTurn?: number; // damage tick each turn
  color: string;          // icon color (use your ailment colors)
};

const PLAYER_MAX_HEALTH = 25;



export default function GameBoard() {

  const enemy = enemies[2];
  const [playerHealth, setPlayerHealth] = useState(PLAYER_MAX_HEALTH);
  
     const [playerAttacking, setPlayerAttacking] = useState(false);
  const [enemyAttacking, setEnemyAttacking] = useState(false);
 const [enemyHealth, setEnemyHealth] = useState(enemy.maxHealth);
  const [enemyAttackIndex, setEnemyAttackIndex] = useState<number | null>(null);
const [isEnemyAttacking, setIsEnemyAttacking] = useState(false);
// For Lex (player) and the enemy
const [playerStatuses, setPlayerStatuses] = useState<Status[]>([]);
const [enemyStatuses, setEnemyStatuses] = useState<Status[]>([]);

function handleStartOfPlayerTurn() {
  setPlayerStatuses((prev) =>
    processStatuses(prev, (damage) =>
      setPlayerHealth((h) => Math.max(0, h - damage))
    )
  );
}





// Enemy retaliates
function handleEnemyRetaliate() {
  setTimeout(() => {
   
    const randomIndex = Math.floor(Math.random() * enemy.attacks.length);
    const attack = enemy.attacks[randomIndex];
    
    // Enemy deals base damage
    const damage = 5; 
    setPlayerHealth((h) => Math.max(0, h - damage));

    // Apply any ailment from that attack
    const newStatuses = createStatusesFromAttack(attack);
    setPlayerStatuses((prev) => [...prev, ...newStatuses]);

     // ✅ Count down Enemy’s statuses AFTER their attack
    setEnemyStatuses((prev) =>
      processStatuses(prev, (damage) =>
        setEnemyHealth((hp) => Math.max(0, hp - damage))
      )
    );

    // Trigger blink
    setEnemyAttackIndex(randomIndex);
    setEnemyAttacking(true);

    setTimeout(() => {
      setEnemyAttackIndex(null);
      setEnemyAttacking(false);
    }, 1000);
  }, 500);
}







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
           <div id="enemy_level">Enemy {0} of {0}</div>
        </div>

      <div id="battlefield">
        <div className="separate_layer">
          <div className="name_tag" id="player_name">Lex</div>
          <div className="name_tag" id="enemy_name">{enemy.name}</div>
        </div>

       

        <div className="separate_layer">
          <div className="health_bar" id="player_health">{playerHealth}</div>
          <div className="health_bar" id="enemy_health">{enemyHealth}</div>
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
        setEnemyHealth={setEnemyHealth}
        onPlayerAttack={() => {
                  setPlayerAttacking(true);
                  handleEnemyRetaliate(); // 👈 Enemy responds
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