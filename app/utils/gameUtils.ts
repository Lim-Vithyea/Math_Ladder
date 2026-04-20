/**
 * gameUtils.ts
 * Math question generator for Math Ladder Race game.
 */

export interface Question {
  text: string;   // e.g. "5 + 3 = ?"
  answer: number; // correct answer
}

/** Returns a random int between min and max inclusive */
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generates a kid-friendly math question */
export function generateQuestion(difficulty: 'easy' | 'medium' = 'easy'): Question {
  const ops = difficulty === 'easy' ? ['+', '-'] : ['+', '-', 'x'];
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
  } else {
    a = rand(1, 5);
    b = rand(1, 5);
    answer = a * b;
  }

  return { text: `${a} ${op} ${b} = ?`, answer };
}
