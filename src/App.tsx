import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { gameConfig } from "./config";
import { createRound, TARGET_STREAK, validateQuestionBank } from "./game";
import { CategoryIcon, PlaneIcon, TaiwanMark } from "./icons";
import { categories, type Question } from "./questions";

type Phase = "ready" | "countdown" | "playing" | "success";
type Result = "idle" | "correct" | "wrong";
type SoundName = "countdown" | "correct" | "wrong" | "success";

const SOUND_FILES: Record<SoundName, { src: string; volume: number }> = {
  countdown: { src: "./sounds/countdown.mp3", volume: 0.64 },
  correct: { src: "./sounds/correct.mp3", volume: 0.68 },
  wrong: { src: "./sounds/wrong.mp3", volume: 0.62 },
  success: { src: "./sounds/game_win.mp3", volume: 0.72 },
};
const SOUND_PREFERENCE_KEY = "final-call-sound-enabled";

function useGameSounds() {
  const soundsRef = useRef<Partial<Record<SoundName, HTMLAudioElement>>>({});

  useEffect(() => {
    const sounds = {} as Record<SoundName, HTMLAudioElement>;

    (Object.keys(SOUND_FILES) as SoundName[]).forEach((name) => {
      const { src, volume } = SOUND_FILES[name];
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = volume;
      sounds[name] = audio;
    });

    soundsRef.current = sounds;

    return () => {
      Object.values(sounds).forEach((audio) => {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
      });
      soundsRef.current = {};
    };
  }, []);

  const playSound = useCallback((name: SoundName) => {
    const audio = soundsRef.current[name];
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }, []);

  const stopSounds = useCallback(() => {
    Object.values(soundsRef.current).forEach((audio) => audio?.pause());
  }, []);

  return { playSound, stopSounds };
}

export type State = {
  phase: Phase;
  countdown: number;
  round: Question[];
  questionIndex: number;
  streak: number;
  selectedAnswer: boolean | null;
  result: Result;
  showResetDialog: boolean;
};

export type Action =
  | { type: "PREPARE"; round: Question[] }
  | { type: "COUNTDOWN_TICK" }
  | { type: "ANSWER"; answer: boolean }
  | { type: "NEXT_QUESTION" }
  | { type: "RESTART_ROUND"; round: Question[] }
  | { type: "SHOW_SUCCESS" }
  | { type: "NEXT_PLAYER"; round: Question[] }
  | { type: "RESET" }
  | { type: "OPEN_RESET" }
  | { type: "CLOSE_RESET" };

export const initialState: State = {
  phase: "ready",
  countdown: gameConfig.countdownSeconds,
  round: [],
  questionIndex: 0,
  streak: 0,
  selectedAnswer: null,
  result: "idle",
  showResetDialog: false,
};

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "PREPARE":
    case "NEXT_PLAYER":
      return {
        ...initialState,
        phase: gameConfig.countdownSeconds > 0 ? "countdown" : "playing",
        round: action.round,
      };
    case "COUNTDOWN_TICK":
      if (state.phase !== "countdown") return state;
      if (state.countdown <= 1) {
        return { ...state, phase: "playing", countdown: 0 };
      }
      return { ...state, countdown: state.countdown - 1 };
    case "ANSWER": {
      const question = state.round[state.questionIndex];
      if (state.phase !== "playing" || !question || state.result !== "idle") {
        return state;
      }
      const correct = action.answer === question.mustDeclare;
      return {
        ...state,
        selectedAnswer: action.answer,
        result: correct ? "correct" : "wrong",
        streak: correct ? state.streak + 1 : 0,
      };
    }
    case "NEXT_QUESTION":
      if (state.result !== "correct" || state.questionIndex >= TARGET_STREAK - 1) {
        return state;
      }
      return {
        ...state,
        questionIndex: state.questionIndex + 1,
        selectedAnswer: null,
        result: "idle",
      };
    case "RESTART_ROUND":
      if (state.result !== "wrong") return state;
      return {
        ...state,
        round: action.round,
        questionIndex: 0,
        streak: 0,
        selectedAnswer: null,
        result: "idle",
      };
    case "SHOW_SUCCESS":
      if (state.result !== "correct" || state.streak !== TARGET_STREAK) return state;
      return { ...state, phase: "success" };
    case "OPEN_RESET":
      return { ...state, showResetDialog: true };
    case "CLOSE_RESET":
      return { ...state, showResetDialog: false };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

function AppHeader({
  onReset,
  canReset,
  onRestart,
  canRestart,
  soundEnabled,
  onToggleSound,
}: {
  onReset: () => void;
  canReset: boolean;
  onRestart: () => void;
  canRestart: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}) {
  return (
    <header className="app-header">
      <div className="stage-mark">
        <span className="stage-mark__number">3</span>
        <span><b>FINAL CALL</b><small>入境申報快問快答</small></span>
      </div>
      <div className="arrival-route" aria-label="抵達臺灣">
        <span>ARRIVALS</span><i /><strong>TPE</strong>
      </div>
      <div className="header-controls">
        <button
          className={`sound-toggle ${soundEnabled ? "" : "is-muted"}`}
          type="button"
          aria-label={soundEnabled ? "關閉音效" : "開啟音效"}
          aria-pressed={soundEnabled}
          onClick={onToggleSound}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 10v4h4l5 4V6l-5 4H4Z" />
            {soundEnabled ? (
              <path d="M16 9.5a4 4 0 0 1 0 5m2.7-7.7a8 8 0 0 1 0 10.4" />
            ) : (
              <path d="m16 10 5 5m0-5-5 5" />
            )}
          </svg>
          <span>{soundEnabled ? "音效開" : "音效關"}</span>
        </button>
        {canRestart ? (
          <button className="success-restart" type="button" onClick={onRestart}>重新開始</button>
        ) : canReset ? (
          <button className="staff-reset" type="button" onClick={onReset}>結束本次挑戰</button>
        ) : null}
      </div>
    </header>
  );
}

function BriefingCard() {
  const ordered = Object.values(categories);
  return (
    <div className="briefing-card" aria-label="五大申報門檻">
      <div className="briefing-card__title">
        <span>入境前快速確認</span>
      </div>
      <div className="threshold-list">
        {ordered.map((category) => (
          <div className="threshold-item" key={category.id}>
            <CategoryIcon category={category.id} />
            <span>{category.shortName}</span>
            <strong>{category.checkpoint}</strong>
          </div>
        ))}
      </div>
      <p>同類加總・剛好等於門檻不算超過・任一類超標即須申報</p>
    </div>
  );
}

function ReadyScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="ready-screen screen">
      <div className="hero-copy">
        <h1>你能順利<br /><em>入境臺灣</em>嗎？</h1>
        <p>判斷旅客攜帶的物品是否須申報，連續答對五題才能通關。</p>
        <button className="start-button" onClick={onStart}>
          <span>開始入境挑戰</span>
          <PlaneIcon />
        </button>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="taiwan-orbit"><TaiwanMark /><span>TAIWAN</span></div>
        <div className="passport-stamp">ENTRY<br /><b>READY</b><small>TPE 2026</small></div>
        <div className="flight-line"><PlaneIcon /></div>
      </div>
      <BriefingCard />
    </section>
  );
}

function CountdownScreen({ value }: { value: number }) {
  return (
    <section className="countdown-screen screen" aria-live="assertive">
      <span className="countdown-label">入境查驗即將開始</span>
      <strong key={value}>{value || "GO"}</strong>
      <div className="countdown-line"><PlaneIcon /></div>
    </section>
  );
}

function ProgressTrack({ round, completed }: { round: Question[]; completed: number }) {
  return (
    <div className="progress-track" aria-label={`已連續答對 ${completed}／5 題`}>
      {round.map((question, index) => {
        const category = categories[question.category];
        const stateClass = index < completed ? "is-complete" : index === completed ? "is-current" : "";
        return (
          <div className={`checkpoint ${stateClass}`} key={`${question.id}-${index}`}>
            <span className="checkpoint__stamp">
              {index < completed ? "✓" : index + 1}
            </span>
            <small>{category.shortName}</small>
          </div>
        );
      })}
    </div>
  );
}

function Feedback({ result }: { result: Result }) {
  if (result !== "correct") return null;
  return (
    <div className="feedback feedback--correct" role="status" aria-live="assertive">
      <span className="feedback__mark">✓</span>
      <div>
        <strong>答對！</strong>
        <p>下一題即將出現</p>
      </div>
    </div>
  );
}

function RoundResetAlert() {
  return (
    <div className="round-reset-alert" role="status" aria-live="assertive">
      <span className="round-reset-alert__mark">×</span>
      <div className="round-reset-alert__copy">
        <span>本輪挑戰結束</span>
        <strong>答錯，進度歸零</strong>
      </div>
      <div className="round-reset-alert__progress">
        <small>目前進度</small>
        <b>0／5</b>
      </div>
      <span className="round-reset-alert__next">正在重新抽題</span>
    </div>
  );
}

function QuestionScreen({
  state,
  onAnswer,
  onNext,
  onRestart,
}: {
  state: State;
  onAnswer: (answer: boolean) => void;
  onNext: () => void;
  onRestart: () => void;
}) {
  const question = state.round[state.questionIndex];
  const answered = state.result !== "idle";
  const isLastCorrect = state.result === "correct" && state.streak === TARGET_STREAK;

  return (
    <section className="question-screen screen">
      {state.result === "wrong" ? (
        <RoundResetAlert />
      ) : (
        <div className="quiz-status">
          <div className="streak-copy">
            <span>CONTINUOUS CLEAR</span>
            <strong>已連續答對 <b>{state.streak}</b>／{TARGET_STREAK} 題</strong>
          </div>
          <ProgressTrack round={state.round} completed={state.streak} />
        </div>
      )}

      <article className="declaration-card">
        <div className="declaration-card__meta">
          <span>ARRIVAL DECLARATION · QUESTION {String(state.questionIndex + 1).padStart(2, "0")}</span>
        </div>
        {gameConfig.showCategory && (
          <div className={`category-pill category-pill--${question.category}`}>
            <CategoryIcon category={question.category} />
            <span>{categories[question.category].name}</span>
          </div>
        )}
        <div className="question-content">
          <h1>{question.prompt}</h1>

          <div className="channel-choice" aria-label="請選擇是否須申報">
            {([true, false] as const).map((answer) => {
              const correct = answered && question.mustDeclare === answer;
              const wrong = answered && !correct;
              return (
                <button
                  key={String(answer)}
                  className={`choice-button ${correct ? "is-correct" : ""} ${wrong ? "is-wrong" : ""}`}
                  disabled={answered}
                  onClick={() => onAnswer(answer)}
                >
                  <span className="choice-button__sign">{answer ? "申" : "免"}</span>
                  <span><strong>{answer ? "須申報" : "不需申報"}</strong></span>
                  {correct && <b className="choice-result">✓ 正確</b>}
                  {wrong && <b className="choice-result">× 錯誤</b>}
                </button>
              );
            })}
          </div>

          <Feedback result={state.result} />

          {gameConfig.flowMode === "guided" && answered && !isLastCorrect && (
            <button className="guided-next" onClick={state.result === "correct" ? onNext : onRestart}>
              {state.result === "correct" ? "下一題" : "重新開始"}<span>→</span>
            </button>
          )}
        </div>
      </article>
    </section>
  );
}

function SuccessScreen() {
  return (
    <section className="success-screen screen">
      <div className="success-route" aria-hidden="true"><PlaneIcon /><span /></div>
      <div className="clearance-stamp">
        <TaiwanMark />
        <span>ENTRY</span>
        <strong>CLEARED</strong>
        <small>TAIWAN・TPE</small>
      </div>
      <div className="success-copy">
        <span>五項入境查驗完成</span>
        <h1>挑戰成功<br />請交棒！</h1>
        <div className="five-clears" aria-label="五題全部答對">
          {Object.values(categories).map((category) => (
            <i key={category.id}><CategoryIcon category={category.id} />✓</i>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResetDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="dialog-backdrop">
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="reset-title">
        <span className="dialog__symbol">!</span>
        <h2 id="reset-title">結束本次挑戰？</h2>
        <p>目前的答題進度會清除，並回到下一位參賽者的準備畫面。</p>
        <div className="dialog__actions">
          <button className="dialog-cancel" onClick={onCancel} autoFocus>繼續挑戰</button>
          <button className="dialog-confirm" onClick={onConfirm}>結束挑戰</button>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const bankProblems = useMemo(() => validateQuestionBank(), []);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return window.localStorage.getItem(SOUND_PREFERENCE_KEY) !== "false";
    } catch {
      return true;
    }
  });
  const { playSound, stopSounds } = useGameSounds();

  const toggleSound = useCallback(() => {
    const nextValue = !soundEnabled;
    setSoundEnabled(nextValue);
    if (!nextValue) stopSounds();
    try {
      window.localStorage.setItem(SOUND_PREFERENCE_KEY, String(nextValue));
    } catch {
      // Sound controls should remain usable when browser storage is unavailable.
    }
  }, [soundEnabled, stopSounds]);

  const startRound = useCallback((type: "PREPARE" | "NEXT_PLAYER") => {
    if (soundEnabled) playSound("countdown");
    dispatch({ type, round: createRound() });
  }, [playSound, soundEnabled]);

  const answerQuestion = useCallback((answer: boolean) => {
    const question = state.round[state.questionIndex];
    const completesChallenge = state.phase === "playing"
      && state.result === "idle"
      && question?.mustDeclare === answer
      && state.streak === TARGET_STREAK - 1;

    // iPad Safari needs this audio to start inside the actual answer tap.
    if (soundEnabled && completesChallenge) playSound("success");
    dispatch({ type: "ANSWER", answer });
  }, [playSound, soundEnabled, state.phase, state.questionIndex, state.result, state.round, state.streak]);

  useEffect(() => {
    if (state.phase !== "countdown") return;
    const timer = window.setTimeout(() => dispatch({ type: "COUNTDOWN_TICK" }), 1000);
    return () => window.clearTimeout(timer);
  }, [state.phase, state.countdown]);

  useEffect(() => {
    if (gameConfig.flowMode !== "race" || state.phase !== "playing") return;
    if (state.result === "correct") {
      const finalAnswer = state.streak === TARGET_STREAK;
      const delay = finalAnswer ? gameConfig.successFeedbackMs : gameConfig.correctFeedbackMs;
      const timer = window.setTimeout(
        () => dispatch({ type: finalAnswer ? "SHOW_SUCCESS" : "NEXT_QUESTION" }),
        delay,
      );
      return () => window.clearTimeout(timer);
    }
    if (state.result === "wrong") {
      const timer = window.setTimeout(
        () => dispatch({ type: "RESTART_ROUND", round: createRound() }),
        gameConfig.wrongFeedbackMs,
      );
      return () => window.clearTimeout(timer);
    }
  }, [state.phase, state.result, state.streak]);

  useEffect(() => {
    if (!soundEnabled || state.phase !== "playing" || state.result === "idle") return;
    if (state.result === "correct" && state.streak === TARGET_STREAK) return;
    playSound(state.result);
  }, [playSound, soundEnabled, state.phase, state.result, state.streak]);

  if (bankProblems.length > 0) {
    return (
      <main className="fatal-error">
        <h1>題庫無法載入</h1>
        <ul>{bankProblems.map((problem) => <li key={problem}>{problem}</li>)}</ul>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <div className="hall-grid" aria-hidden="true" />
      <div className="app-window">
        <AppHeader
          canReset={state.phase === "playing" || state.phase === "countdown"}
          canRestart={state.phase === "success"}
          onReset={() => dispatch({ type: "OPEN_RESET" })}
          onRestart={() => startRound("NEXT_PLAYER")}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
        {state.phase === "ready" && <ReadyScreen onStart={() => startRound("PREPARE")} />}
        {state.phase === "countdown" && <CountdownScreen value={state.countdown} />}
        {state.phase === "playing" && (
          <QuestionScreen
            state={state}
            onAnswer={answerQuestion}
            onNext={() => dispatch({ type: "NEXT_QUESTION" })}
            onRestart={() => dispatch({ type: "RESTART_ROUND", round: createRound() })}
          />
        )}
        {state.phase === "success" && <SuccessScreen />}
        <footer className="app-footer">
          <span>RUNWAY GO! 2026 桃機活力嘉年華</span>
        </footer>
      </div>
      {state.showResetDialog && (
        <ResetDialog
          onCancel={() => dispatch({ type: "CLOSE_RESET" })}
          onConfirm={() => dispatch({ type: "RESET" })}
        />
      )}
    </main>
  );
}
