import css from "./MagicMG.module.css";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import StarkHeroEffect from "../StarkHeroEffect/StarkHeroEffect";

import CardGame from "/src/assets/game/Card.png";
import PigeonGirl from "/src/assets/game/PigeonGirl.png";
import GirlMavka from "/src/assets/game/GirlMavka.png";
// three, four, five, six
const imageComponents = {
  girlBlue: {
    back: CardGame,
    face: PigeonGirl,
  },
  girlMavka: {
    back: CardGame,
    face: GirlMavka,
  },
  girlTree: {
    back: CardGame,
    face: PigeonGirl,
  },
  girlFour: {
    back: CardGame,
    face: GirlMavka,
  },

  girlFive: {
    back: CardGame,
    face: PigeonGirl,
  },
  girlSix: {
    back: CardGame,
    face: GirlMavka,
  },
};

export default function MagicMemoryGame() {
  const [searchParams] = useSearchParams();
  const pairsCount = Number(searchParams.get("pairs")) || 2; // скільки пар

  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [matches, setMatches] = useState(0);
  const [showSmile, setShowSmile] = useState(false);

  const clickSoundRef = useRef(null);
  const winAudioRef = useRef(null);

  useEffect(() => {
    clickSoundRef.current = new Audio("/src/assets/audio/allclicks.mp3.wav");
    winAudioRef.current = new Audio(
      "/src/assets/audio/mixkitFinnaliViner.mp3.wav"
    );
  }, []);

  // Створення колоди з наших героїв
  useEffect(() => {
    const heroKeys = Object.keys(imageComponents).slice(0, pairsCount); // обмежуємо кількість пар
    const newDeck = heroKeys
      .flatMap(key => [
        { id: Math.random(), key, matched: false },
        { id: Math.random(), key, matched: false },
      ])
      .sort(() => Math.random() - 0.5);

    setCards(newDeck);
    setMatches(0);
    setFirstChoice(null);
    setSecondChoice(null);
    setShowSmile(false);
  }, [pairsCount]);

  const handleChoice = card => {
    if (disabled || card === firstChoice || card.matched) return;
    clickSoundRef.current?.play().catch(() => {});
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  };

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.key === secondChoice.key) {
        // якщо збіг
        setCards(prev =>
          prev.map(c =>
            c.key === firstChoice.key ? { ...c, matched: true } : c
          )
        );
        setMatches(m => m + 1);
        resetTurn();
      } else {
        setTimeout(resetTurn, 800);
      }
    }
  }, [firstChoice, secondChoice]);

  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  useEffect(() => {
    if (matches === pairsCount && pairsCount > 0) {
      setShowSmile(true);
      winAudioRef.current?.play().catch(() => {});
    }
  }, [matches, pairsCount]);

  return (
    <div className={css.gameBoard}>
      {cards.map(card => {
        const flipped =
          card === firstChoice || card === secondChoice || card.matched;
        const imgSrc = flipped
          ? imageComponents[card.key].face
          : imageComponents[card.key].back;
        return (
          <div
            key={card.id}
            className={`card ${flipped ? "flipped" : ""}`}
            onClick={() => handleChoice(card)}
          >
            <div className={css.cardInner}>
              <div className={css.cardFront}>
                <img src={imgSrc} alt={card.key} />
                {/* <img src={imageComponents[card.key].back} alt="back" /> */}
              </div>
              <div className={css.cardBack}>
                <img src={imgSrc} alt={card.key} />
                {/* <img src={imageComponents[card.key].face} alt={card.key} /> */}
              </div>
            </div>
          </div>
        );
      })}

      {showSmile && (
        <StarkHeroEffect
          onRestart={() => {
            // можна navigate('/settings') або перезапустити гру
          }}
        />
      )}
    </div>
  );
}

// Logics:
// При створенні колоди використовується imageComponents — кожна пара має back та face.
// При рендері картки ми перевіряємо, чи вона відкрита (flipped) → тоді показуємо face, інакше back.
// Замість /cards тепер карти генеруються прямо з об’єкта героїв.
// pairsCount контролює, скільки пар з imageComponents потрапляє в гру.

// import { useEffect, useState, useRef } from "react";
// import { useSearchParams } from "react-router-dom";
// import StarkHeroEffect from "../StarkHeroEffect/StarkHeroEffect";

// export default function MagicMemoryGame() {
//   const [searchParams] = useSearchParams();
//   const pairsCount = Number(searchParams.get("pairs")) || 3;

//   const [cards, setCards] = useState([]);
//   const [firstChoice, setFirstChoice] = useState(null);
//   const [secondChoice, setSecondChoice] = useState(null);
//   const [disabled, setDisabled] = useState(false);
//   const [matches, setMatches] = useState(0);
//   const [showSmile, setShowSmile] = useState(false);

//   const moveSoundX = useRef(null);
//   const moveSoundO = useRef(null);
//   const clickSoundRef = useRef(null);
//   const startAudioRef = useRef(null);
//   const winAudioRef = useRef(null);

//   useEffect(() => {
//     moveSoundX.current = new Audio("/src/assets/audio/sunTuIX.mp3.wav");
//     moveSoundO.current = new Audio("/src/assets/audio/sunTuNull.mp3.wav");
//     clickSoundRef.current = new Audio("/src/assets/audio/allclicks.mp3.wav");
//     startAudioRef.current = new Audio("/src/assets/audio/clikcs.mp3.wav");
//     winAudioRef.current = new Audio(
//       "/src/assets/audio/mixkitFinnaliViner.mp3.wav"
//     );
//   }, []);

//   // Стартовий звук при першій взаємодії
//   useEffect(() => {
//     const handleUserInteraction = () => {
//       startAudioRef.current
//         ?.play()
//         .catch(e => console.warn("Autoplay blocked:", e));
//       window.removeEventListener("click", handleUserInteraction);
//     };
//     window.addEventListener("click", handleUserInteraction);
//     return () => window.removeEventListener("click", handleUserInteraction);
//   }, []);

//   // Генерація колоди
//   useEffect(() => {
//     const images = Array.from(
//       { length: pairsCount },
//       (_, i) => `/cards/${i + 1}.png`
//     );
//     const shuffled = [...images, ...images]
//       .map(img => ({ id: Math.random(), image: img, matched: false }))
//       .sort(() => Math.random() - 0.5);
//     setCards(shuffled);
//   }, [pairsCount]);

//   const handleChoice = card => {
//     if (!disabled && card !== firstChoice) {
//       clickSoundRef.current?.play(); // звук кліку
//       firstChoice ? setSecondChoice(card) : setFirstChoice(card);
//     }
//   };

//   // Перевірка на збіг
//   useEffect(() => {
//     if (firstChoice && secondChoice) {
//       setDisabled(true);
//       if (firstChoice.image === secondChoice.image) {
//         moveSoundX.current?.play(); // звук збігу
//         setCards(prev =>
//           prev.map(c =>
//             c.image === firstChoice.image ? { ...c, matched: true } : c
//           )
//         );
//         setMatches(prev => prev + 1);
//         resetTurn();
//       } else {
//         moveSoundO.current?.play(); // звук промаху
//         setTimeout(resetTurn, 800);
//       }
//     }
//   }, [firstChoice, secondChoice]);

//   const resetTurn = () => {
//     setFirstChoice(null);
//     setSecondChoice(null);
//     setDisabled(false);
//   };

//   // Перемога
//   useEffect(() => {
//     if (matches === pairsCount) {
//       setTimeout(() => {
//         winAudioRef.current?.play();
//         setShowSmile(true);
//       }, 500);
//     }
//   }, [matches, pairsCount]);

//   return (
//     <div className="game-board">
//       {cards.map(card => (
//         <div
//           key={card.id}
//           className={`card ${
//             card === firstChoice || card === secondChoice || card.matched
//               ? "flipped"
//               : ""
//           }`}
//           onClick={() => handleChoice(card)}
//         >
//           <img src={card.image} alt="card" />
//         </div>
//       ))}

//       {showSmile && (
//         <StarkHeroEffect
//           onRestart={() => {
//             setShowSmile(false);
//             setMatches(0);
//           }}
//         />
//       )}
//     </div>
//   );
// }
