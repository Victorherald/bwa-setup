import  { useState } from "react";
import EnemySlot from "./EnemySlot";
import { processStatuses } from "../utils/ApplyEffects"; 
import { Status } from "../utils/ApplyEffects";


const GRID_SIZE = 16;


function getRandomLetters(size: number) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length: size }, () =>
    alphabet[Math.floor(Math.random() * alphabet.length)]
  );
}

type LetterTileProps = {
playerHealth: number;
  setPlayerHealth: React.Dispatch<React.SetStateAction<number>>;
  enemyHealth: number;
  setEnemyHealth: React.Dispatch<React.SetStateAction<number>>;
  playerStatuses: Status[];
  setPlayerStatuses: React.Dispatch<React.SetStateAction<Status[]>>;
  enemyStatuses: Status[];
  setEnemyStatuses: React.Dispatch<React.SetStateAction<Status[]>>;
  onPlayerAttack?: () => void;
};

export default function LetterTile({ 
  setPlayerHealth,
  setEnemyHealth,
  onPlayerAttack,
  playerStatuses,
  setPlayerStatuses,
  enemyStatuses,
  setEnemyStatuses,

}: LetterTileProps) {
  const [letters, setLetters] = useState<string[]>(() => getRandomLetters(GRID_SIZE));
  const [selected, setSelected] = useState<number[]>([]);

  // Handle letter click: move to middle if not already selected
  const handleTileClick = (idx: number) => {
    if (!selected.includes(idx)) {
      setSelected([...selected, idx]);
    }
  };

  
  function tickEnemyStatuses() {
  setEnemyStatuses(prev =>
    processStatuses(prev, dmg => setEnemyHealth(h => Math.max(0, h - dmg)))
  );
}

  

    // Scramble: all tiles become new random letters, selection cleared
  const handleScramble = () => {
    setLetters(getRandomLetters(GRID_SIZE));
    setSelected([]);
     
    setTimeout(() => {
      setPlayerHealth((h) => Math.max(0, h - Math.floor(Math.random() * 5 + 3)));
    
    }, 500);
  };

  // Selected word
  const selectedWord = selected.map(i => letters[i]).join("");
  const canAttack = selectedWord.length >= 3;

 
  const handleAttack = () => {
  if (!canAttack) return;

  // Deal damage to enemy
  setEnemyHealth(h => Math.max(0, h - selectedWord.length * 2));

  // ✅ Tick enemy statuses after Lex attacks
  tickEnemyStatuses();

  // ✅ Countdown statuses for both sides AFTER Lex attacks
  setPlayerStatuses(prev =>
    processStatuses(prev, dmg => setPlayerHealth(h => Math.max(0, h - dmg)))
  );
  setEnemyStatuses(prev =>
    processStatuses(prev, dmg => setEnemyHealth(h => Math.max(0, h - dmg)))
  );

  // Reset letters
  const newLetters = [...letters];
  selected.forEach(idx => (newLetters[idx] = getRandomLetters(1)[0]));
  setLetters(newLetters);
  setSelected([]);

  // Trigger enemy retaliation
  onPlayerAttack?.();
};


  return (
    <div style={{ width: "100%", position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Selected word area - absolutely positioned above the grid */}
      <div
        style={{
          position: "absolute",
          top: "-11.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          minHeight: "4.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
        }}
      >
        {selected.map((i, idx) => (
          <div key={idx} className="grid_selected" style={{ width: "3.5rem", height: "3.5rem", fontSize: "2rem", margin: "0.08rem" }}>
            {letters[i]}
          </div>
        ))}
      </div>
      {/* Grid */}
      <div
        id="letter_grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gap: "0.04rem",
          width: "150%",
          maxWidth: "240px",
          margin: "5.6rem auto -6rem auto", // push grid down to make space for selected word
          position: "relative",
          zIndex: 1,
          bottom: '6rem'
        }}
      >
        {letters.map((letter, idx) => (
          <div
            key={idx}
            className={selected.includes(idx) ? "grid_selected" : "grid"}
            onClick={() => handleTileClick(idx)}
            style={{
              width: "3.5rem",
              height: "3.5rem",
              fontSize: "2rem",
              margin: "0.05rem",
              cursor: selected.includes(idx) ? "not-allowed" : "pointer",
              opacity: selected.includes(idx) ? 0.5 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {letter}
          </div>
        ))}
      </div>
      <div id="buttons" style={{   display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: "400px",
    marginTop: "1rem",}}>
       {/* Scramble button */}
      <button
        id="scramble"
        onClick={handleScramble}
        style={{
         background: "#f44336",
            color: "#fff",
            padding: "0.5rem 1.2rem",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            flex: "1",
        }}
      >
        Scramble
      </button>
      {/* Attack button */}
      <button
        id="submit_word"
        disabled={!canAttack}
        onClick={handleAttack}
        style={{
          marginTop: "0.5rem",
          flex: "1",
        }}
      >ATTACK!
      </button>
      <button 
      style={{
         background: "#01471cff",
            color: "#fff",
            padding: "0.5rem 1.2rem",
            border: "none",
            borderRadius: "0.5rem",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
            flex: "1",
        }}
      >Menu</button>
       </div>
    </div>
  );
}