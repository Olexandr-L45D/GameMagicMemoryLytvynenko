import css from "./SettingsDifficulty.module.css";
import { useNavigate } from "react-router-dom";
import startSound from "/src/assets/audio/startGame.mp3.wav";

const levels = [
  { id: 1, pairs: 3, cardsCount: 4, label: "Very Easy" },
  { id: 2, pairs: 4, cardsCount: 6, label: "Easy" },
  { id: 3, pairs: 6, cardsCount: 8, label: "Normal" },
  { id: 4, pairs: 8, cardsCount: 10, label: "Hard" },
  { id: 5, pairs: 10, cardsCount: 12, label: "Very Hard" },
];

export default function SettingsDifficulty() {
  const navigate = useNavigate();

  const handleSelect = pairs => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    navigate(`/game?pairs=${pairs}`);
  };

  return (
    <section className={css.modalSection}>
      <div className={css.modalOverlay}>
        <section className={css.settingsContainer}>
          <h2 className={css.settingsTitle}>CHOOSE LEVEL</h2>
          {/* <div className={css.cardsBdr}> */}
          <div className={css.levelsGrid}>
            {levels.map(lvl => (
              <div
                key={lvl.id}
                className={css.levelCard}
                onClick={() => handleSelect(lvl.pairs)}
              >
                <div className={css.levelTop}>
                  <span className={css.levelNumber}>{lvl.cardsCount}</span>
                  <div className={css.levelIcon}></div>
                </div>
                <div className={css.levelBottom}>{lvl.label}</div>
              </div>
            ))}
          </div>
          {/* </div> */}
        </section>
      </div>
    </section>
  );
}

// onClick = { handleStart };
