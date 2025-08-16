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

// import { useEffect, useState, useRef } from "react";
// import css from "./MagicMemoryGame.module.css";
// import { WinModal } from "../WinModal/WinModal";
// import { WinModalFirst } from "../WinModalFirst/WinModalFirst";
// import StarkHeroEffect from "../StarkHeroEffect/StarkHeroEffect";
// import winSound from "/src/assets/audio/finalliVin.mp3.wav";
// import CardBack from "/src/assets/game/Card.png";
// import PigeonGirl from "/src/assets/game/PigeonGirl.png";
// import GirlMavka from "/src/assets/game/GirlMavka.png";

// const cardImages = [
//   PigeonGirl,
//   GirlMavka,
//   PigeonGirl,
//   GirlMavka,
//   PigeonGirl,
//   GirlMavka,
//   PigeonGirl,
//   GirlMavka,
//   PigeonGirl,
//   GirlMavka,
//   PigeonGirl,
//   GirlMavka,
// ];

// const MagicMemoryGame = ({ settings }) => {
//   const [cards, setCards] = useState([]);
//   const [firstChoice, setFirstChoice] = useState(null);
//   const [secondChoice, setSecondChoice] = useState(null);
//   const [disabled, setDisabled] = useState(false);
//   const [showSmile, setShowSmile] = useState(false);
//   const [showLoadingFirst, setshowLoadingFirst] = useState(false);
//   const [showLoadingSecond, setshowLoadingSecond] = useState(false);

//   const clickSoundRef = useRef(null);
//   const winAudioRef = useRef(null);

//   useEffect(() => {
//     clickSoundRef.current = new Audio("/src/assets/audio/allclicks.mp3.wav");
//     winAudioRef.current = new Audio(winSound);
//     // Створення колоди та тасування
//     const deck = cardImages
//       .map(img => ({ id: Math.random(), img, flipped: false, matched: false }))
//       .sort(() => Math.random() - 0.5);
//     setCards(deck);
//   }, []);

//   const handleClick = card => {
//     if (disabled || card.flipped || card.matched) return;

//     if (clickSoundRef.current) {
//       clickSoundRef.current.currentTime = 0;
//       clickSoundRef.current.play().catch(() => {});
//     }

//     const newCards = cards.map(c =>
//       c.id === card.id ? { ...c, flipped: true } : c
//     );
//     setCards(newCards);

//     if (!firstChoice) {
//       setFirstChoice(card);
//     } else {
//       setSecondChoice(card);
//       setDisabled(true);

//       if (firstChoice.img === card.img) {
//         // знайдена пара

//         setCards(prev =>
//           prev.map(c => (c.img === card.img ? { ...c, matched: true } : c))
//         );
//         resetTurn();
//       } else {
//         // не співпала

//         setTimeout(() => {
//           setCards(prev =>
//             prev.map(c =>
//               c.id === firstChoice.id || c.id === card.id
//                 ? { ...c, flipped: false }
//                 : c
//             )
//           );
//           resetTurn();
//         }, 1000);
//       }
//     }
//   };

//   const resetTurn = () => {
//     setFirstChoice(null);
//     setSecondChoice(null);
//     setDisabled(false);
//   };

//   // Перевірка на перемогу
//   useEffect(() => {
//     if (cards.length && cards.every(c => c.matched)) {
//       setShowSmile(true);
//       if (winAudioRef.current) {
//         winAudioRef.current.currentTime = 0;
//         winAudioRef.current.play().catch(() => {});
//       }
//       // Показати GameStatusLoading після короткої паузи (щоб не мерехтіло)
//       setTimeout(() => {
//         setshowLoadingFirst(true);
//         // Дати гравцеві побачити статус і потім старт гри
//         setTimeout(() => {
//           setShowSmile(false);
//           setshowLoadingFirst(false);
//           setshowLoadingSecond(true);
//         }, 2500); // Пауза перед першим лоадером/пейдж з конфеті
//       }, 2500); // Невелика затримка між лоадерами
//     }
//   }, [cards]);

//   const theme = settings?.theme || "default";
//   const themeClass = `game_container theme_${theme}`;

//   return (
//     <section className={css.gameWrapper}>
//       <main className={css.containerGame}>
//         <section className={css.wrapper}>
//           <section className={themeClass}>
//             <section className={css.gridWrapper}>
//               <div className={css.grid}>
//                 {showSmile && <StarkHeroEffect />}
//                 {cards.map(card => (
//                   <button
//                     key={card.id}
//                     className={`${css.cell} ${css["cell--" + theme]} ${
//                       card.matched ? css.hidden : ""
//                     }`}
//                     onClick={() => handleClick(card)}
//                     aria-label="Card"
//                     // disabled={disabled} // щоб не спамили кліки під час порівняння
//                   >
//                     {card.flipped || card.matched ? (
//                       <img src={card.img} className={css["icon-img"]} />
//                     ) : (
//                       <img src={CardBack} className={css["icon-img"]} />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </section>
//             {/* {showSmile && <StarkHeroEffect />} */}
//             {showLoadingFirst && <WinModalFirst />}
//             {showLoadingSecond && <WinModal />}
//           </section>
//         </section>
//       </main>
//     </section>
//   );
// };

// export default MagicMemoryGame;

//  <section className={`${css.gameWrapper} ${slideDown ? css.slideDown : ""}`}></section>

// import { useEffect, useState, useRef } from "react";
// import { FcBusinesswoman } from "react-icons/fc";
// import { FcBusinessman } from "react-icons/fc";
// import { FcPortraitMode } from "react-icons/fc";
// import css from "./MagicMemoryGame.module.css";
// import { WinModal } from "../WinModal/WinModal";
// import { useNavigate } from "react-router-dom";
// import winSound from "/src/assets/audio/finalliVin.mp3.wav";
// import StarkHeroEffect from "../StarkHeroEffect/StarkHeroEffect";
// import endDrowSound from "/src/assets/audio/endDrowGame.mp3.wav";
// import { WinModalFirst } from "../WinModalFirst/WinModalFirst";
// // import restartSound from "/src/assets/audio/mixKids.mp3.wav"; можливо додам десь в кінці гри
// import CardGame from "/src/assets/game/Card.png";
// import CardBack from "/src/assets/game/Card.png";
// import PigeonGirl from "/src/assets/game/PigeonGirl.png";
// import GirlMavka from "/src/assets/game/GirlMavka.png";

// const iconComponents = {
//   rose: {
//     x: CardGame,
//     o: PigeonGirl,
//   },
//   princes: {
//     x: CardGame,
//     o: GirlMavka,
//   },
//   boy: {
//     x: FcPortraitMode,
//     o: FcBusinesswoman,
//   },
//   man: {
//     x: FcBusinessman,
//     o: FcBusinesswoman,
//   },
// };

// const MagicMemoryGame = ({ settings, onEvent }) => {
//   const [board, setBoard] = useState(Array(12).fill(null));
//   const [current, setCurrent] = useState("X");
//   const [winner, setWinner] = useState(null);
//   const navigate = useNavigate();
//   const [showLoadingFirst, setshowLoadingFirst] = useState(false);
//   const [winningCells, setWinningCells] = useState([]);
//   const moveSoundX = useRef(null);
//   const moveSoundO = useRef(null);
//   const clickSoundRef = useRef(null);
//   const startAudioRef = useRef(null);
//   const winAudioRef = useRef(null);
//   const [showSmile, setShowSmile] = useState(false);
//   const [isVisible, setIsWinning] = useState(false);
//   const [slideDown, setSlideDown] = useState(false);
//   // Музичні ефекти на useEffect() та useRef();
//   useEffect(() => {
//     moveSoundX.current = new Audio("/src/assets/audio/sunTuIX.mp3.wav");
//     moveSoundO.current = new Audio("/src/assets/audio/sunTuNull.mp3.wav");
//     clickSoundRef.current = new Audio("/src/assets/audio/allclicks.mp3.wav");
//     startAudioRef.current = new Audio("/src/assets/audio/clikcs.mp3.wav");
//     winAudioRef.current = new Audio(
//       "/src/assets/audio/mixkitFinnaliViner.mp3.wav"
//     );
//   }, []);

//   // Відтворення стартового звуку після першого кліку на сторінці (HomePage)
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
//   //Основна анімація та звук при зміні current
//   // масив з 12 клітин гри з індексами
//   const lines = [
//     [0, 6],
//     [0, 7],
//     [0, 8],
//     [0, 9],
//     [0, 10],
//     [0, 11],
//     [1, 6],
//     [1, 7],
//     [1, 8],
//     [1, 9],
//     [1, 10],
//     [1, 11],
//     [2, 6],
//     [2, 7],
//     [2, 8],
//     [2, 9],
//     [2, 10],
//     [2, 11],
//     [3, 6],
//     [3, 7],
//     [3, 8],
//     [3, 9],
//     [3, 10],
//     [3, 11],
//     [3, 9],
//     [4, 6],
//     [4, 7],
//     [4, 8],
//     [4, 9],
//     [4, 10],
//     [4, 11],
//     [5, 6],
//     [5, 7],
//     [5, 8],
//     [5, 9],
//     [5, 10],
//     [5, 11],
//   ];
//   //  функція перевірки переможця (виграв Х чи 0)
//   const checkWin = b => {
//     for (let [a, b1, c] of lines) {
//       if (b[a] && b[a] === b[b1] && b[a] === b[c])
//         return { player: b[a], line: [a, b1, c] };
//     }
//     return b.every(Boolean) ? { player: "Draw", line: [] } : null;
//   };
//   //Основна ФУНКЦІЯ- const handleClick = логіка та анімаціїї+звуки в ході Всієї гри при кліках на клітини поля гр
//   const handleClick = i => {
//     if (board[i] || winner || isVisible) return;
//     // Створюємо копію ігрового поля
//     const next = [...board];
//     next[i] = current;
//     const result = checkWin(next);
//     setBoard(next);
//     // Відтворення звуку кліку
//     if (clickSoundRef.current) {
//       clickSoundRef.current.currentTime = 0;
//       clickSoundRef.current.play().catch(() => {});
//     }
//     if (!result) {
//       // Змінюємо хід на "O"
//       setCurrent("O");
//       // Через 1.5 сekond комп'ютер робить випадковий хід
//       setTimeout(() => {
//         if (winner) return;
//         const free = next
//           .map((v, idx) => (v ? null : idx))
//           .filter(idx => idx !== null);
//         if (free.length === 0) return;
//         const j = free[Math.floor(Math.random() * free.length)];
//         const afterO = [...next];
//         afterO[j] = "O";
//         setBoard(afterO);
//         // Звук кліку для комп'ютера
//         if (clickSoundRef.current) {
//           clickSoundRef.current.currentTime = 0;
//           clickSoundRef.current.play().catch(() => {});
//         }
//         const res2 = checkWin(afterO);
//         if (!res2) {
//           // Ніхто не переміг — повертаємо хід гравцю X
//           setCurrent("X");
//         } else if (res2.player === "O") {
//           // Комп'ютер виграв
//           const a = new Audio(endDrowSound);
//           a.play().catch(() => {});
//           setTimeout(() => {
//             navigate("/result", {
//               state: { winner: "O", player1: "You", player2: "PLAYER 2" },
//             });
//           }, 1500);
//         } else if (res2.player === "Draw") {
//           // Нічия
//           const a = new Audio(endDrowSound);
//           a.play().catch(() => {});
//           setTimeout(() => {
//             navigate("/result", {
//               state: { winner: "Draw", player1: "You", player2: "PLAYER 2" },
//             });
//           }, 1500);
//         }
//       }, 1500);
//     } else {
//       // Для надійності
//       setCurrent("X");
//     }
//     //  Логіка обробки перемоги
//     if (result) {
//       const player = result.player;
//       if (player === "X") {
//         setShowSmile(true);
//         setIsWinning(true);
//         setWinningCells(result.line || []);
//         // Затримка анімації зсуву поля гри вниз при виграші
//         setTimeout(() => setSlideDown(true), 3000);
//         // Затримка анімації показу першої сторінки з конфеті при виграші
//         requestAnimationFrame(() =>
//           setTimeout(() => {
//             setSlideDown(false);
//             setshowLoadingFirst(true);
//           }, 4000)
//         );
//         if (winAudioRef.current) {
//           winAudioRef.current.currentTime = 0;
//           winAudioRef.current.play().catch(() => {});
//         } else {
//           const a = new Audio(winSound);
//           a.play().catch(() => {});
//         }
//         setTimeout(() => {
//           setIsWinning(false);
//           setWinningCells([]);
//           setShowSmile(false);
//           setshowLoadingFirst(false);
//           setWinner("X");
//         }, 7000);
//       } else if (player === "O") {
//         const a = new Audio(endDrowSound);
//         a.play().catch(() => {});
//         setTimeout(() => {
//           navigate("/result", {
//             state: { winner: "O", player1: "You", player2: "PLAYER 2" },
//           });
//         }, 1500);
//       } else if (player === "Draw") {
//         const a = new Audio(endDrowSound);
//         a.play().catch(() => {});
//         setTimeout(() => {
//           navigate("/result", {
//             state: { winner: "Draw", player1: "You", player2: "PLAYER 2" },
//           });
//         }, 1500);
//       }
//     }
//   };
//   // кінець ОСНОВНОЇ функції const handleClick
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       // setAnimateIntro(false);
//     }, 1500);
//     return () => clearTimeout(timer);
//   }, []);

//   const reset = () => {
//     setBoard(Array(9).fill(null));
//     setCurrent("X");
//     setWinner(null);
//     onEvent?.({ type: "reset" });
//   };

//   const handleRestartGame = () => {
//     reset();
//   };

//   const theme = settings?.theme || "default";
//   const themeClass = `game_container theme_${theme}`;

//   const getIconComponent = symbol => {
//     const icon = iconComponents[theme]?.[symbol.toLowerCase()];
//     if (!icon) return symbol;
//     if (typeof icon === "function") {
//       const Icon = icon;
//       return <Icon size={100} />;
//     }
//     return <img src={icon} alt={symbol} style={{ width: 100, height: 100 }} />;
//   };

//   return (
//     <section className={`${css.gameWrapper} ${slideDown ? css.slideDown : ""}`}>
//       <main className={css.containerGame}>
//         <section className={css.wrapper}>
//           {/* start section by Game */}
//           <section className={themeClass}>
//             <section className={css.gridWrapper}>
//               <div className={css.gridOverlay}></div>
//               <div className={css.grid}>
//                 {board.map((cell, i) => (
//                   <button
//                     key={i}
//                     className={`${css.cell} ${css["cell--" + theme]} ${
//                       winningCells.includes(i)
//                         ? isVisible || winner === "X"
//                           ? css.visible + " " + css.winner
//                           : css.hidden
//                         : ""
//                     }`}
//                     onClick={() => handleClick(i)}
//                     aria-label={`Cell ${i + 1}`}
//                   >
//                     {/* Якщо в клітинці вже є зображення героя → показуємо її, інакше бек */}
//                     {cell ? (
//                       getIconComponent(cell)
//                     ) : (
//                       <img src={CardBack} alt="Card back" />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </section>
//             {winner === "X" && <WinModal onRestart={handleRestartGame} />}
//             {showLoadingFirst && <WinModalFirst onRestart={() => {}} />}
//           </section>
//           {/* end section by Game */}
//           {showSmile && <StarkHeroEffect onRestart={() => {}} />}
//         </section>
//       </main>
//     </section>
//   );
// };

// export default MagicMemoryGame;

// (протилежний гравець підсвічується сяйвом та підстрибує)
// useEffect(() => {
//   let timer;
//   if (current === "O") {
//     // setIsAnimating(true); // <-- блокуємо кліки поки триває
//     // setShowHeroEffectRight(true);
//     // setAnimateLeft(true);
//     // setAnimateRight(false);
//     if (moveSoundX.current) {
//       moveSoundX.current.currentTime = 0;
//       moveSoundX.current.play().catch(() => {});
//     }
//     // timer = setTimeout(() => setAnimateLeft(false), 2000);
//   } else if (current === "X") {
//     // setIsAnimating(true); // <-- блокуємо кліки поки триває
//     // setShowHeroEffect(true);
//     // setAnimateRight(true);
//     // setAnimateLeft(false);
//     if (moveSoundO.current) {
//       moveSoundO.current.currentTime = 0;
//       moveSoundO.current.play().catch(() => {});
//     }
//     // timer = setTimeout(() => setAnimateRight(false), 2000);
//   }
//   return () => clearTimeout(timer);
// }, [current]);

// useEffect(() => {
//   const timer = setTimeout(() => {
//     setShowButton(true); //  показуємо через 3 секунди
//   }, 3000);
//   return () => clearTimeout(timer); // очищення таймера
// }, []);

// three, four, five, six
// const imageComponents = {
//   girlBlue: {
//     back: CardGame,
//     face: PigeonGirl,
//   },
//   girlMavka: {
//     back: CardGame,
//     face: GirlMavka,
//   },
//   girlTree: {
//     back: CardGame,
//     face: PigeonGirl,
//   },
//   girlFour: {
//     back: CardGame,
//     face: GirlMavka,
//   },

//   girlFive: {
//     back: CardGame,
//     face: PigeonGirl,
//   },
//   girlSix: {
//     back: CardGame,
//     face: GirlMavka,
//   },
// };

// <html>
//   <head>
//   <body>
//     <header>
//       <nav>
//         <ul>
//           <li>
//           <li>
//         </ul>
//       </nav>
//     </header>

//     <main>
//       <section>
//         <article>
//           <h1>
//           <p>
//           <figure>
//             <img>
//             <figcaption>
//           </figure>
//           <ul>
//             <li>
//             <li>
//           </ul>
//         </article>
//       </section>

//       <section>
//         <h2>
//         <article>
//           <h3>
//           <p>
//         </article>
//       </section>

//       <aside>
//         <nav>
//           <ul>
//             <li>
//             <li>
//           </ul>
//         </nav>
//       </aside>
//     </main>

//     <footer>
//       <nav>
//         <ul>
//           <li>
//           <li>
//         </ul>
//       </nav>
//     </footer>
//   </body>
// </html>

// header – шапка сайту (логотип, меню).
// nav – меню навігації.
// main – основний вміст.
// section – розділ сторінки.
// article – самостійний блок контенту.
// aside – бічна колонка (реклама, додаткові блоки).
// footer – підвал сайту.
// ul/li – списки (меню, пункти).
// figure/figcaption – для зображень з підписом.
