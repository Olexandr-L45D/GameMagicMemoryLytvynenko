# React + Vite

# MagicMemory

MagicMemory is a memory card-matching game built with **React + Vite**.  
The application features configurable difficulty, smooth animations, and
engaging sound effects.

## 🕹️ Game Flow (Roadmap)

0. **Start the Application**  
   The app initializes with routing and navigation setup.

1. **Home Page**  
   Landing page with a **Start Game** button.

2. **Choose Difficulty**  
   Player selects a difficulty level (1–5).  
   The choice is stored in the application state or passed via `react-router`
   parameters.

3. **Game Board Generation**

   - A set of cards is generated dynamically based on the selected difficulty.
   - Components used: `SettingDifficulty`, `GameStatusLoading`, `LoadingScreen`,
     `Loader`, `MagicMemoryGame`.

4. **MagicMemoryGame (Core Game Logic)**

   - Displays the game grid with cards.
   - Handles card-flip logic, pair matching, click blocking while checking
     pairs.
   - Includes sound effects, hero animations (`CardBack`, `PigeonGirl`,
     `GirlMavka`), and smiley reactions.
   - Tracks and updates the number of matched pairs.

5. **WinModalFirst**

   - Initial win modal with confetti animation and victory sound.

6. **WinModal (Final Win Screen)**
   - Enhanced confetti & sound effects.
   - Displays **“Congratulations!”** title and a **Play Again** button.
   - The button redirects to the start of the game for a new round.

---

## ✨ Features

- Difficulty levels from beginner to expert.
- Animated heroes and visual effects.
- Audio feedback for interactions and winning.
- Smooth transitions and state management.
- Replay option with instant restart.

---

## Build to Android Studio

- in the file name: gradle.properties added keys:
- android.useAndroidX=true RELEASE_STORE_FILE=keystore/- my-release-key.jks
- RELEASE_STORE_PASSWORD= -
- RELEASE_KEY_ALIAS=my-key-alias
- RELEASE_KEY_PASSWORD=

---
