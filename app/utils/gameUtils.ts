/**
 * gameUtils.ts
 * Math question generator for Math Ladder Race game.
 */

export interface Question {
  text: string;   // e.g. "5 + 3 = ?"
  answer: number; // correct answer
}

export type Difficulty = 'easy' | 'medium' | 'hard';

/** Returns a random int between min and max inclusive */
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generates a kid-friendly math question */
export function generateQuestion(difficulty: Difficulty = 'easy'): Question {
  const ops = difficulty === 'hard' ? ['+', '-', 'x', '÷']
            : difficulty === 'medium' ? ['+', '-', 'x']
            : ['+', '-'];
  
  const op = ops[Math.floor(Math.random() * ops.length)];

  let a: number, b: number, answer: number;

  if (op === '+') {
    a = rand(1, 9);
    b = rand(1, 9);
    answer = a + b;
  } else if (op === '-') {
    a = rand(3, 12);
    b = rand(1, a - 1); // always positive result
    answer = a - b;
  } else if (op === 'x') {
    a = rand(1, 10);
    b = rand(1, 10);
    answer = a * b;
  } else {
    // Division: ensure clean entire division
    answer = rand(1, 10);
    b = rand(1, 10);
    a = answer * b;
  }

  return { text: `${a} ${op} ${b} = ?`, answer };
}
