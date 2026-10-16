export type FlowMode = "race" | "guided";

export const gameConfig = {
  flowMode: "race" as FlowMode,
  countdownSeconds: 3,
  correctFeedbackMs: 650,
  wrongFeedbackMs: 1400,
  successFeedbackMs: 700,
  showCategory: true,
  showTimer: false,
  appVersion: "1.0.0",
  questionBankVersion: "2026.10.16-v1",
};
