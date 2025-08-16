import { useNavigate } from "react-router-dom";
import css from "./HomePage.module.css";
import startSound from "/src/assets/audio/successMixkit.mp3.wav";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoaderBaground from "../../components/LoaderBaground/LoaderBaground";
import playIcon from "/src/assets/emages/btnStart.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGameStart = () => {
    const audio = new Audio(startSound);
    audio.play().catch(e => console.warn("Autoplay blocked:", e));
    setLoading(true);
    setTimeout(() => {
      toast.success("Сustomize the game for yourself");
      navigate("/gamestart");
    }, 2000); // плавний перехід після 2с
  };

  return (
    <section className={css.container}>
      <ToastContainer
        position="top-right"
        autoClose={5000} // 5 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {loading ? (
        <LoaderBaground />
      ) : (
        <div className={css.sectionBlok}>
          <h1 className={css.title}>Magic Memory</h1>
          <button
            onClick={handleGameStart}
            className={css.buttonStart}
            type="button"
          >
            <img src={playIcon} alt="" className={css.arrow} />
          </button>
        </div>
      )}
    </section>
  );
}
