/**
 * gameUtils.ts
 * Math question generator for Math Ladder Race game.
 */

export interface Question {
  text: string;   // e.g. "5 + 3 = ?"
  answer: number; // correct answer
  choices?: number[]; // optional choices for multiple choice mode
}

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';

/** Returns a random int between min and max inclusive */
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Generates a kid-friendly math question */
export function generateQuestion(
  difficulty: Difficulty = 'easy', 
  isMultipleChoice: boolean = false,
  type: QuestionType = 'mixed'
): Question {
  let ops: string[] = [];
  
  if (type === 'mixed') {
    ops = difficulty === 'hard' ? ['x', '÷']
      : difficulty === 'medium' ? ['-', 'x']
        : ['+', '-'];
  } else {
    const mapping: Record<string, string> = {
      addition: '+',
      subtraction: '-',
      multiplication: 'x',
      division: '÷'
    };
    ops = [mapping[type]];
  }

  const op = ops[Math.floor(Math.random() * ops.length)];

  let a: number, b: number, answer: number;

  if (op === '+') {
    a = difficulty === 'hard' ? rand(10, 50) : rand(1, 20);
    b = difficulty === 'hard' ? rand(10, 50) : rand(1, 20);
    answer = a + b;
  } else if (op === '-') {
    a = difficulty === 'hard' ? rand(20, 100) : rand(5, 20);
    b = rand(1, a - 1);
    answer = a - b;
  } else if (op === 'x') {
    a = difficulty === 'hard' ? rand(2, 12) : rand(1, 10);
    b = difficulty === 'hard' ? rand(2, 12) : rand(1, 10);
    answer = a * b;
  } else {
    // Division: ensure clean entire division
    answer = difficulty === 'hard' ? rand(2, 12) : rand(1, 10);
    b = difficulty === 'hard' ? rand(2, 12) : rand(1, 10);
    a = answer * b;
  }

  const question: Question = { text: `${a} ${op} ${b} = ?`, answer };

  if (isMultipleChoice) {
    const choices = new Set<number>();
    choices.add(answer);
    while (choices.size < 4) {
      const offset = rand(-5, 5);
      const alt = answer + offset;
      if (alt >= 0 && alt !== answer) {
        choices.add(alt);
      } else if (alt < 0) {
        choices.add(answer + rand(1, 10));
      }
    }
    question.choices = Array.from(choices).sort(() => Math.random() - 0.5);
  }

  return question;
}
