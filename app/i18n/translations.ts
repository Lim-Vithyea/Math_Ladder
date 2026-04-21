/**
 * translations.ts
 * All UI text for English (en) and Khmer (km).
 * To add a new language: copy one block, add the key, translate each string.
 */

export type Lang = 'en' | 'km';

export interface Translations {
  // ── Header ─────────────────────────────────────
  title: string;
  subtitle: string;
  hint: string;

  // ── Team names ─────────────────────────────────
  foxTeam: string;
  penguinTeam: string;

  // ── Calculator panel ────────────────────────────
  stepProgress: (score: number, total: number) => string;
  solveIt: string;
  placeholder: string;
  feedbackCorrect: string;
  feedbackWrong: string;
  btnBack: string;
  btnGo: string;

  // ── Music ───────────────────────────────────────
  musicOn: string;
  musicOff: string;

  // ── Difficulty Settings ─────────────────────────
  diffEasy: string;
  diffMedium: string;
  diffHard: string;

  // ── Winner modal ────────────────────────────────
  wins: string;               // appended after team name, e.g. "Fox Team Wins!"
  winnerSub: string;
  playAgain: string;

  // ── Sidebar & Settings ──────────────────────────
  settings: string;
  gameMode: string;
  modeCalculator: string;
  modeChoices: string;
  resetGame: string;

  // ── Exercise Types ──────────────────────────────
  exerciseType: string;
  typeAddition: string;
  typeSubtraction: string;
  typeMultiplication: string;
  typeDivision: string;
  typeMixed: string;

  // ── Menu ────────────────────────────────────────
  menuTitle: string;
  menuSubtitle: string;
  ladderGame: string;
  ladderDesc: string;
  speedGame: string;
  speedDesc: string;
  tugGame: string;
  tugDesc: string;
  backToMenu: string;

  // ── Speed Challenge ──────────────────────────────
  start: string;
  timeLeft: string;
  score: string;
  timesUp: string;
  finalScore: string;

  // ── Tug of War ───────────────────────────────────
  tugSubtitle: string;
  tugHint: string;
}

const en: Translations = {
  title: 'Math Ladder Race!',
  subtitle: 'Answer the math question correctly to climb up the ladder! First team to the top wins! 🌟',
  hint: '🦊 Red team uses the left calculator  |  🐧 Blue team uses the right calculator',

  foxTeam: 'Fox Team',
  penguinTeam: 'Penguin Team',

  stepProgress: (s, t) => `⭐ Step ${s} / ${t}`,
  solveIt: 'Solve it! 🤔',
  placeholder: '_ _ _',
  feedbackCorrect: '✅ Correct! +1 Step!',
  feedbackWrong: '❌ Wrong! Try again!',
  btnBack: '⌫ Delete',
  btnGo: '✓ Go!',

  musicOn: '🔊 Music On',
  musicOff: '🔇 Music Off',

  diffEasy: 'Easy',
  diffMedium: 'Medium',
  diffHard: 'Hard',
  wins: 'Wins!',
  winnerSub: 'Amazing math skills! You climbed all the way up! 🎉',
  playAgain: '🔄 Play Again!',

  settings: 'Settings ⚙️',
  gameMode: 'Game Mode',
  modeCalculator: 'Calculator 🔢',
  modeChoices: 'Multiple Choice ✅',
  resetGame: 'Reset Game 🔄',

  exerciseType: 'Exercise Type',
  typeAddition: 'Addition (+)',
  typeSubtraction: 'Subtraction (-)',
  typeMultiplication: 'Multiplication (x)',
  typeDivision: 'Division (÷)',
  typeMixed: 'Mixed All (✨)',

  menuTitle: 'Choose Your Math Adventure! 🚀',
  menuSubtitle: 'Pick a game and start practicing your math skills!',
  ladderGame: 'Ladder Race 🪜',
  ladderDesc: 'Race to the top of the ladder! First to 10 points wins!',
  speedGame: 'Speed Challenge',
  speedDesc: 'How many can you solve in 60 seconds? Go for a high score!',
  tugGame: 'Tug of War 🪢',
  tugDesc: 'Pull the rope to your side! First team to pull the marker across their line wins!',
  backToMenu: '🏠 Back to Menu',

  start: 'Start Game! 🏁',
  timeLeft: 'Time Left',
  score: 'Score',
  timesUp: "Time's Up! ⌛",
  finalScore: 'Final Score',

  tugSubtitle: 'Answer math questions to pull the rope! Win by pulling the marker to your side! 🪢',
  tugHint: '🦊 Red team pulls left  |  🐧 Blue team pulls right',
};

const km: Translations = {
  title: 'ការប្រណាំងជណ្តើរគណិតវិទ្យា',
  subtitle: 'ឆ្លើយសំណួរឱ្យបានត្រឹមត្រូវ ដើម្បីឡើងជណ្តើរ! ក្រុមណាឡើងដល់កំពូលដំបូង ក្រុមនោះឈ្នះ! 🌟',
  hint: '🦊 ក្រុមក្រហមប្រើម៉ាស៊ីនគណនាខាងឆ្វេង  |  🐧 ក្រុមខៀវប្រើម៉ាស៊ីនគណនាខាងស្ដាំ',

  foxTeam: 'ក្រុមកញ្ច្រោង',
  penguinTeam: 'ក្រុមភេនឃ្វីន',

  stepProgress: (s, t) => `⭐ ជំហាន ${s} / ${t}`,
  solveIt: 'ដោះស្រាយមើល! 🤔',
  placeholder: '_ _ _',
  feedbackCorrect: '✅ ត្រឹមត្រូវ! +1 ជំហាន!',
  feedbackWrong: '❌ ខុស! ព្យាយាមម្ដងទៀត!',
  btnBack: '⌫ លុប',
  btnGo: '✓ ទៅ!',

  musicOn: '🔊 បើកសំឡេង',
  musicOff: '🔇 បិទសំឡេង',

  diffEasy: ' ងាយស្រួល',
  diffMedium: ' មធ្យម',
  diffHard: ' ពិបាក',

  wins: 'ឈ្នះ!',
  winnerSub: 'ជំនាញគណិតវិទ្យាល្អណាស់! អ្នកឡើងដល់កំពូលហើយ! 🎉',
  playAgain: '🔄 លេងម្ដងទៀត!',

  settings: 'ការកំណត់ ⚙️',
  gameMode: 'របៀបលេង',
  modeCalculator: 'ម៉ាស៊ីនគិតលេខ 🔢',
  modeChoices: 'ជ្រើសរើសចម្លើយ ✅',
  resetGame: 'លេងឡើងវិញ 🔄',

  exerciseType: 'ប្រភេទលំហាត់',
  typeAddition: 'លំហាត់បូក (+)',
  typeSubtraction: 'លំហាត់ដក (-)',
  typeMultiplication: 'លំហាត់គុណ (x)',
  typeDivision: 'លំហាត់ចែក (÷)',
  typeMixed: 'លំហាត់ចម្រុះ (✨)',

  menuTitle: 'ជ្រើសរើសការផ្សងព្រេងគណិតវិទ្យារបស់អ្នក! 🚀',
  menuSubtitle: 'ជ្រើសរើសហ្គេមមួយ ហើយចាប់ផ្តើមហ្វឹកហាត់ជំនាញគណិតវិទ្យារបស់អ្នក!',
  ladderGame: 'ការប្រណាំងជណ្តើរ 🪜',
  ladderDesc: 'ប្រណាំងទៅកាន់កំពូលជណ្តើរ! អ្នកដល់លេខ ១០ មុនគេឈ្នះ!',
  speedGame: 'ការប្រកួតល្បឿន ⏱️',
  speedDesc: 'តើអ្នកអាចដោះស្រាយបានប៉ុន្មានក្នុងរយៈពេល ៦០ វិនាទី? រកពិន្ទុឱ្យបានច្រើន!',
  tugGame: 'ទាញព្រ័ត្រ 🪢',
  tugDesc: 'ទាញព្រ័ត្រមកខាងអ្នក! ក្រុមដំបូងដែលទាញសញ្ញាសម្គាល់មកដល់ខ្សែបន្ទាត់របស់ពួកគេគឺឈ្នះ!',
  backToMenu: '🏠 ត្រឡប់ទៅម៉ឺនុយវិញ',

  start: 'ចាប់ផ្តើមហ្គេម! 🏁',
  timeLeft: 'ពេលវេលានៅសល់',
  score: 'ពិន្ទុ',
  timesUp: "អស់ម៉ោងហើយ! ⌛",
  finalScore: 'ពិន្ទុចុងក្រោយ',

  tugSubtitle: 'ឆ្លើយសំណួរគណិតវិទ្យាដើម្បីទាញព្រ័ត្រ! ឈ្នះដោយទាញសញ្ញាសម្គាល់មកខាងអ្នក! 🪢',
  tugHint: '🦊 ក្រុមក្រហមទាញទៅឆ្វេង  |  🐧 ក្រុមខៀវទាញទៅស្ដាំ',
};

export const TRANSLATIONS: Record<Lang, Translations> = { en, km };
