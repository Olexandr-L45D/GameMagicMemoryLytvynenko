//This is Delyvery Card by game GameMagicMemory (vebs/devase/app)
//0) START Game - App (Router, Routers)
//1) HomePage = Start Game page end have Button by start to game
//2) SettingDifficulty = вибираємо складність (від 1 до 5), зберігаємо вибір у state або через react-router параметр.
//3) Pagecard (import: SettingDifficulty, GameSettingsModal, GameStatusLoading,
// LoadingScreen, Loader, MagicMemoryGame) = приймає складність, генерує набір карток (залежно від кількості пар).
//4)MagicMemoryGame (this have import: StarkHeroEffect, WinModalFirst, WinModal; and Hero: CardBack, PigeonGirl, GirlMavka)
//MagicMemoryGame = Оснона логіка гри . Має поле гри, перевірка на збіг карток, аудіо супрвід, анімації - смайлик то що. Блокування кліків під час перевірки.
//MagicMemoryGame = Лічильник знайдених пар.
//5) WinModalFirst - have effekt by confetty and finnaly sound
//6) WinModal this have effekt by confetty and finnaly sound, and title = Congratulatist and button = Play again
// Вітання при завершенні гри (з згенерованим конфеті).
//
