import { categories, categoryIds, questions, type Question } from "./questions";

export const TARGET_STREAK = 5;

export function shuffle<T>(items: T[], random = Math.random): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

export function createRound(random = Math.random): Question[] {
  const selected = categoryIds.map((category) => {
    const pool = questions.filter((question) => question.category === category);
    if (pool.length === 0) {
      throw new Error(`題庫類別「${categories[category].name}」沒有可用題目。`);
    }
    return pool[Math.floor(random() * pool.length)];
  });

  return shuffle(selected, random);
}

export function validateQuestionBank(): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();

  questions.forEach((question) => {
    if (ids.has(question.id)) problems.push(`題號 ${question.id} 重複。`);
    ids.add(question.id);
    if (!question.prompt.trim()) problems.push(`題號 ${question.id} 沒有題目文字。`);
  });

  categoryIds.forEach((category) => {
    const count = questions.filter((question) => question.category === category).length;
    if (count === 0) problems.push(`類別「${categories[category].name}」沒有題目。`);
  });

  return problems;
}
