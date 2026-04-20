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

  // ── Winner modal ────────────────────────────────
  wins: string;               // appended after team name, e.g. "Fox Team Wins!"
  winnerSub: string;
  playAgain: string;
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
  btnBack: '⌫ Back',
  btnGo: '✓ Go!',

  musicOn: '🔊 Music On',
  musicOff: '🔇 Music Off',

  wins: 'Wins!',
  winnerSub: 'Amazing math skills! You climbed all the way up! 🎉',
  playAgain: '🔄 Play Again!',
};

const km: Translations = {
  title: '🧮 ការប្រណាំងជណ្តើរគណិតវិទ្យា! 🏆',
  subtitle: 'ឆ្លើយសំណួរឱ្យបានត្រឹមត្រូវ ដើម្បីឡើងជណ្តើរ! ក្រុមណាឡើងដល់កំពូលដំបូង ក្រុមនោះឈ្នះ! 🌟',
  hint: '🦊 ក្រុមក្រហមប្រើម៉ាស៊ីនគណនាខាងឆ្វេង  |  🐧 ក្រុមខៀវប្រើម៉ាស៊ីនគណនាខាងស្ដាំ',

  foxTeam: 'ក្រុមកញ្ច្រោង',
  penguinTeam: 'ក្រុមភេនឃ្វីន',

  stepProgress: (s, t) => `⭐ ជំហាន ${s} / ${t}`,
  solveIt: 'ដោះស្រាយមើល! 🤔',
  placeholder: '_ _ _',
  feedbackCorrect: '✅ ត្រឹមត្រូវ! +1 ជំហាន!',
  feedbackWrong: '❌ ខុស! ព្យាយាមម្ដងទៀត!',
  btnBack: '⌫ ថយ',
  btnGo: '✓ ទៅ!',

  musicOn: '🔊 បើកសំឡេង',
  musicOff: '🔇 បិទសំឡេង',

  wins: 'ឈ្នះ!',
  winnerSub: 'ជំនាញគណិតវិទ្យាល្អណាស់! អ្នកឡើងដល់កំពូលហើយ! 🎉',
  playAgain: '🔄 លេងម្ដងទៀត!',
};

export const TRANSLATIONS: Record<Lang, Translations> = { en, km };
