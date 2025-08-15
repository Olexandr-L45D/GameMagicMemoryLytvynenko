import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import StarkHeroEffect from "../StarkHeroEffect/StarkHeroEffect";

export default function MagicMemoryGame() {
  const [searchParams] = useSearchParams();
  const pairsCount = Number(searchParams.get("pairs")) || 3;

  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [matches, setMatches] = useState(0);
  const [showSmile, setShowSmile] = useState(false);

  const moveSoundX = useRef(null);
  const moveSoundO = useRef(null);
  const clickSoundRef = useRef(null);
  const startAudioRef = useRef(null);
  const winAudioRef = useRef(null);

  useEffect(() => {
    moveSoundX.current = new Audio("/src/assets/audio/sunTuIX.mp3.wav");
    moveSoundO.current = new Audio("/src/assets/audio/sunTuNull.mp3.wav");
    clickSoundRef.current = new Audio("/src/assets/audio/allclicks.mp3.wav");
    startAudioRef.current = new Audio("/src/assets/audio/clikcs.mp3.wav");
    winAudioRef.current = new Audio(
      "/src/assets/audio/mixkitFinnaliViner.mp3.wav"
    );
  }, []);

  // Стартовий звук при першій взаємодії
  useEffect(() => {
    const handleUserInteraction = () => {
      startAudioRef.current
        ?.play()
        .catch(e => console.warn("Autoplay blocked:", e));
      window.removeEventListener("click", handleUserInteraction);
    };
    window.addEventListener("click", handleUserInteraction);
    return () => window.removeEventListener("click", handleUserInteraction);
  }, []);

  // Генерація колоди
  useEffect(() => {
    const images = Array.from(
      { length: pairsCount },
      (_, i) => `/cards/${i + 1}.png`
    );
    const shuffled = [...images, ...images]
      .map(img => ({ id: Math.random(), image: img, matched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(shuffled);
  }, [pairsCount]);

  const handleChoice = card => {
    if (!disabled && card !== firstChoice) {
      clickSoundRef.current?.play(); // звук кліку
      firstChoice ? setSecondChoice(card) : setFirstChoice(card);
    }
  };

  // Перевірка на збіг
  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);
      if (firstChoice.image === secondChoice.image) {
        moveSoundX.current?.play(); // звук збігу
        setCards(prev =>
          prev.map(c =>
            c.image === firstChoice.image ? { ...c, matched: true } : c
          )
        );
        setMatches(prev => prev + 1);
        resetTurn();
      } else {
        moveSoundO.current?.play(); // звук промаху
        setTimeout(resetTurn, 800);
      }
    }
  }, [firstChoice, secondChoice]);

  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setDisabled(false);
  };

  // Перемога
  useEffect(() => {
    if (matches === pairsCount) {
      setTimeout(() => {
        winAudioRef.current?.play();
        setShowSmile(true);
      }, 500);
    }
  }, [matches, pairsCount]);

  return (
    <div className="game-board">
      {cards.map(card => (
        <div
          key={card.id}
          className={`card ${
            card === firstChoice || card === secondChoice || card.matched
              ? "flipped"
              : ""
          }`}
          onClick={() => handleChoice(card)}
        >
          <img src={card.image} alt="card" />
        </div>
      ))}

      {showSmile && (
        <StarkHeroEffect
          onRestart={() => {
            setShowSmile(false);
            setMatches(0);
          }}
        />
      )}
    </div>
  );
}
