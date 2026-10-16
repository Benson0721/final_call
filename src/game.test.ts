import { describe, expect, it } from "vitest";
import { categoryIds, questions } from "./questions";
import { createRound, validateQuestionBank } from "./game";
import { initialState, reducer, type State } from "./App";

describe("question bank", () => {
  it("contains 100 valid questions", () => {
    expect(questions).toHaveLength(100);
    expect(validateQuestionBank()).toEqual([]);
  });

  it("contains 20 questions in every category", () => {
    categoryIds.forEach((category) => {
      expect(questions.filter((question) => question.category === category)).toHaveLength(20);
    });
  });

  it("keeps the declaration answers from the source material", () => {
    expect(questions.find((question) => question.id === "002")?.mustDeclare).toBe(false);
    expect(questions.find((question) => question.id === "003")?.mustDeclare).toBe(true);
    expect(questions.find((question) => question.id === "022")?.mustDeclare).toBe(false);
    expect(questions.find((question) => question.id === "023")?.mustDeclare).toBe(true);
    expect(questions.find((question) => question.id === "100")?.mustDeclare).toBe(false);
  });
});

describe("round creation", () => {
  it("draws exactly one question from each category", () => {
    const round = createRound(() => 0.25);
    expect(round).toHaveLength(5);
    expect(new Set(round.map((question) => question.category))).toEqual(new Set(categoryIds));
    expect(new Set(round.map((question) => question.id)).size).toBe(5);
  });
});

describe("challenge flow", () => {
  it("reaches success only after five consecutive correct answers", () => {
    const round = createRound(() => 0.25);
    let state = reducer(initialState, { type: "PREPARE", round });
    state = reducer(state, { type: "COUNTDOWN_TICK" });
    state = reducer(state, { type: "COUNTDOWN_TICK" });
    state = reducer(state, { type: "COUNTDOWN_TICK" });

    round.forEach((question, index) => {
      state = reducer(state, { type: "ANSWER", answer: question.mustDeclare });
      expect(state.streak).toBe(index + 1);
      if (index < round.length - 1) state = reducer(state, { type: "NEXT_QUESTION" });
    });

    state = reducer(state, { type: "SHOW_SUCCESS" });
    expect(state.phase).toBe("success");
  });

  it("resets the streak and creates a fresh round after a wrong answer", () => {
    const round = createRound(() => 0.25);
    let state: State = { ...initialState, phase: "playing", round, streak: 3 };
    state = reducer(state, { type: "ANSWER", answer: !round[0].mustDeclare });
    expect(state.result).toBe("wrong");
    expect(state.streak).toBe(0);

    const nextRound = createRound(() => 0.75);
    state = reducer(state, { type: "RESTART_ROUND", round: nextRound });
    expect(state.questionIndex).toBe(0);
    expect(state.result).toBe("idle");
    expect(state.round).toBe(nextRound);
  });

  it("starts the next participant at the three-second countdown", () => {
    const nextRound = createRound(() => 0.5);
    const successState: State = {
      ...initialState,
      phase: "success",
      round: createRound(() => 0.25),
      streak: 5,
    };

    const state = reducer(successState, { type: "NEXT_PLAYER", round: nextRound });
    expect(state.phase).toBe("countdown");
    expect(state.countdown).toBe(3);
    expect(state.streak).toBe(0);
    expect(state.round).toBe(nextRound);
  });
});
