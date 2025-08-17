import { Link } from "react-router-dom";
import css from "./SettingsDifficulty.module.css";
import startSound from "/src/assets/audio/startGame.mp3.wav";

const levels = [
  { id: 1, pairs: 2, cardsCount: 4, label: "Very Easy" },
  { id: 2, pairs: 3, cardsCount: 6, label: "Easy" },
  { id: 3, pairs: 4, cardsCount: 8, label: "Normal" },
  { id: 4, pairs: 5, cardsCount: 10, label: "Hard" },
  { id: 5, pairs: 6, cardsCount: 12, label: "Very Hard" },
];

const SettingsDifficulty = ({ onClose, onStart }) => {
  // Локальна функція запуску: звук + виклик пропсу onStart
  const handleStart = lvl => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    // передаємо налаштування батьківському компоненту
    if (onStart) onStart(lvl);
    // закриваємо модалку
    if (onClose) onClose();
  };

  return (
    <section className={css.modalSection}>
      <div className={css.modalOverlay}>
        <section className={css.settingsContainer}>
          <h2 className={css.settingsTitle}>CHOOSE LEVEL</h2>

          <ul className={css.levelsGrid}>
            {levels.map(lvl => (
              <li key={lvl.id} className={css.levelCar}>
                <Link
                  to={`/game?pairs=${lvl.pairs}`}
                  className={css.levelCard}
                  onClick={e => {
                    e.preventDefault(); // не даємо <Link> одразу перейти
                    handleStart(lvl); // передаємо рівень у handleStart
                  }}
                >
                  <div className={css.levelTop}>
                    <span className={css.levelNumber}>{lvl.cardsCount}</span>
                    <div className={css.levelIcon}></div>
                  </div>
                  <div className={css.levelBottom}>{lvl.label}</div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
};

export default SettingsDifficulty;
