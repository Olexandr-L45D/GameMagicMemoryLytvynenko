import { useState } from "react";
import css from "./GameSettingPage.module.css";
// import TicTacToeGame from "../../components/TicTacToeGame/TicTacToeGame";
// import GameSettingsModal from "../../components/GameSettingsModal/GameSettingsModal";
import GameStatusLoading from "../../components/GameStatusLoading/GameStatusLoading";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import Loader from "../../components/Loader/Loader";
import SettingsDifficulty from "../../components/SettingsDifficulty/SettingsDifficulty";
import MagicMemoryGame from "../../components/MagicMemoryGame/MagicMemoryGame";

const GameSettingPage = () => {
  const [settings, setSettings] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showStatusLoading, setShowStatusLoading] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const [showGlobalLoader, setShowGlobalLoader] = useState(false);

  const handleStart = data => {
    setShowModal(false);
    setShowGlobalLoader(true); // глобальний Loader
    setShowLoading(true); // Показати перший лоадер

    setTimeout(() => {
      setShowGlobalLoader(false);
      setShowLoading(false); // Сховати перший лоадер

      // Показати GameStatusLoading після короткої паузи (щоб не мерехтіло)
      setTimeout(() => {
        setShowStatusLoading(true);

        // Дати гравцеві побачити статус і потім старт гри
        setTimeout(() => {
          setShowStatusLoading(true);
          setSettings(data);
          setStartGame(true);
        }, 1000); // Пауза перед стартом гри
      }, 1000); // Невелика затримка між лоадерами
    }, 1000); // Показ першого лоадера 1с
  };

  return (
    <section className={css.container}>
      {showLoading && <LoadingScreen />}
      {showStatusLoading && <GameStatusLoading />}

      {showModal && (
        <SettingsDifficulty
          onClose={() => setShowModal(false)}
          onStart={handleStart}
        />
      )}

      {showGlobalLoader && <Loader />}
      {/* MagicMemoryGame компонент самої гри в карти */}
      {startGame && settings && <MagicMemoryGame />}
    </section>
  );
};

export default GameSettingPage;
