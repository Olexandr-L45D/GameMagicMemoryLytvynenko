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
      toast.info(
        "Hello! For convenience, rotate the screen horizontally and customize the game for yourself"
      );
      navigate("/mainpagegame");
    }, 2000);
  };

  return (
    <section className={css.container}>
      <ToastContainer
        position="top-right"
        autoClose={4000} // 4 seconds
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

// import { GiCardPick } from "react-icons/gi"; // тематична іконка під гру на Память
/* Іконка fore HEAD*/

/* <div style={{ display: "flex", alignItems: "center", padding: "10px" }}>
        <GiCardPick
          style={{ marginRight: "8px", fontSize: "2rem", color: "#ff9800" }}
        />
        <h1 style={{ margin: 0, fontSize: "1.8rem" }}>Memory Game</h1>
      </div> */
