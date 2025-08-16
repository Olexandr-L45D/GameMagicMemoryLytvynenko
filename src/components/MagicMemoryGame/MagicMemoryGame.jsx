import { useEffect, useState, useRef } from "react";
import css from "./MagicMemoryGame.module.css";
import { WinModal } from "../WinModal/WinModal";
import { WinModalFirst } from "../WinModalFirst/WinModalFirst";
import StarkHeroEffect from "../StarkHeroEffect/StarkHeroEffect";
import winSound from "/src/assets/audio/finalliVin.mp3.wav";
import CardBack from "/src/assets/game/Card.png";
import PigeonGirl from "/src/assets/game/PigeonGirl.png";
import GirlMavka from "/src/assets/game/GirlMavka.png";

const cardImages = [
  PigeonGirl,
  GirlMavka,
  PigeonGirl,
  GirlMavka,
  PigeonGirl,
  GirlMavka,
  PigeonGirl,
  GirlMavka,
  PigeonGirl,
  GirlMavka,
  PigeonGirl,
  GirlMavka,
];

const MagicMemoryGame = ({ settings }) => {
  const [cards, setCards] = useState([]);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null); // зберігаємо другу карту
  const [disabled, setDisabled] = useState(false);

  const [showSmile, setShowSmile] = useState(false); // смайлик над парою
  const [matchedPair, setMatchedPair] = useState([]); // id пари для смайлика

  const [showLoadingFirst, setshowLoadingFirst] = useState(false);
  const [showLoadingSecond, setshowLoadingSecond] = useState(false);

  const clickSoundRef = useRef(null);
  const winAudioRef = useRef(null);

  // Ініціалізація карт при завантаженні
  useEffect(() => {
    clickSoundRef.current = new Audio("/src/assets/audio/allclicks.mp3.wav");
    winAudioRef.current = new Audio(winSound);

    const deck = cardImages
      .map(img => ({ id: Math.random(), img, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
  }, []);

  // Обробка кліку на карту
  const handleClick = card => {
    if (disabled || card.flipped || card.matched) return;

    if (clickSoundRef.current) {
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    }

    // Перевертаємо картку
    const newCards = cards.map(c =>
      c.id === card.id ? { ...c, flipped: true } : c
    );
    setCards(newCards);

    // Вибір першої/другої карти
    if (!firstChoice) {
      setFirstChoice(card);
    } else {
      setSecondChoice(card); // тимчасово зберігаємо другу
      setDisabled(true);

      if (firstChoice.img === card.img) {
        // ✅ Знайшли пару
        setMatchedPair([firstChoice.id, card.id]); // зберігаємо для смайлика
        setShowSmile(true);

        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstChoice.id || c.id === card.id
                ? { ...c, matched: true } // тільки обрана пара!
                : c
            )
          );
          setShowSmile(false);
          setMatchedPair([]);
          resetTurn();
        }, 1500); // пауза перед зникненням + смайлик
      } else {
        // ❌ Не співпала пара
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === firstChoice.id || c.id === card.id
                ? { ...c, flipped: false }
                : c
            )
          );
          resetTurn();
        }, 1000);
      }
    }
  };

  // Скидання вибору
  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null); // використовується для коректного скидання
    setDisabled(false);
  };

  // Перевірка перемоги
  useEffect(() => {
    if (cards.length && cards.every(c => c.matched)) {
      setShowSmile(true);
      if (winAudioRef.current) {
        winAudioRef.current.currentTime = 0;
        winAudioRef.current.play().catch(() => {});
      }
      setTimeout(() => {
        setshowLoadingFirst(true);
        setTimeout(() => {
          setShowSmile(false);
          setshowLoadingFirst(false);
          setshowLoadingSecond(true);
        }, 2500);
      }, 2500);
    }
  }, [cards]);
  useEffect(() => {
    if (secondChoice) {
      console.log("Second choice updated:", secondChoice);
    }
  }, [secondChoice]);

  const theme = settings?.theme || "default";
  const themeClass = `game_container theme_${theme}`;

  return (
    <section className={css.gameWrapper}>
      <main className={css.containerGame}>
        <section className={css.wrapper}>
          <section className={themeClass}>
            <section className={css.gridWrapper}>
              <div className={css.grid}>
                {cards.map(card => (
                  <button
                    key={card.id}
                    className={`${css.cell} ${css["cell--" + theme]} ${
                      card.matched ? css.hidden : ""
                    }`}
                    onClick={() => handleClick(card)}
                    aria-label="Card"
                  >
                    {/* показуємо смайлик над конкретною парою */}
                    {showSmile && matchedPair.includes(card.id) && (
                      <StarkHeroEffect />
                    )}

                    {card.flipped || card.matched ? (
                      <img src={card.img} className={css["icon-img"]} />
                    ) : (
                      <img src={CardBack} className={css["icon-img"]} />
                    )}
                  </button>
                ))}
              </div>
            </section>
            {showLoadingFirst && <WinModalFirst />}
            {showLoadingSecond && <WinModal />}
          </section>
        </section>
      </main>
    </section>
  );
};

export default MagicMemoryGame;
