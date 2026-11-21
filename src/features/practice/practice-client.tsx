"use client";

import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { Icon } from "@/components/icons/icon";
import { AnnotatedMessage } from "@/features/report/annotated-message";
import { practiceDeck, practiceReport, type PracticeCard } from "./deck";

type Answer = { card: PracticeCard; correct: boolean; missed: string[] };
export function PracticeClient() {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const card = practiceDeck[index];
  const report = card ? practiceReport(card) : null;
  function answer(label: "scam" | "legitimate") {
    if (!card || answered) return;
    const correct = card.label === label;
    const missed = card.label === "scam" && label === "legitimate" ? [...new Set(report?.signals.map((signal) => signal.tactic) ?? [])] : [];
    setAnswers((current) => [...current, { card, correct, missed }]);
    setAnswered(true);
  }
  function next() {
    if (!answered) return;
    setAnswered(false);
    x.set(0);
    setIndex((current) => current + 1);
  }
  function restart() {
    setIndex(0);
    setAnswers([]);
    setAnswered(false);
    x.set(0);
  }
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") answer("scam");
      if (event.key === "ArrowRight") answer("legitimate");
      if (event.key === "Enter") next();
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  });
  if (!card || !report) {
    const missed = answers.flatMap((answer) => answer.missed);
    const counts = missed.reduce<Record<string, number>>((result, tactic) => ({ ...result, [tactic]: (result[tactic] ?? 0) + 1 }), {});
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return <main><PageHero title="Practice spotting scams"><p>Round complete. Review your score and the tactics that appeared most often in missed scam cards.</p></PageHero><section className="practice-end glass-strong panel-40 container"><strong className="practice-score data">{answers.filter((answer) => answer.correct).length}/{practiceDeck.length}</strong><h2>Your result</h2><p>You answered {answers.filter((answer) => answer.correct).length} of {practiceDeck.length} cards correctly.</p><h3>Tactics missed most</h3>{sorted.length ? <ol>{sorted.map(([tactic, count]) => <li key={tactic}>{tactic}: {count} cards</li>)}</ol> : <p>No scam tactics were missed in this round.</p>}<button className="button" onClick={restart}>Start another round</button></section></main>;
  }
  return <main>
    <PageHero title="Practice spotting scams"><p>Card {index + 1} of {practiceDeck.length}. Use the buttons, drag the card, or press Left for fraudulent and Right for legitimate. Press Enter for the next card.</p></PageHero>
    <section className="practice-layout container">
      <div className="practice-card-wrap">
        <AnimatePresence mode="wait" initial={false}>
          <motion.article className="practice-card glass-strong" key={`${card.id}-${answered}`} style={{ x, rotate }} drag="x" dragConstraints={{ left: 0, right: 0 }} onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 100) answer(info.offset.x > 0 ? "scam" : "legitimate"); }} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -80 }}>
            <span className="data">Example {index + 1}</span><p>{card.text}</p><span className="small muted">This is a fictional example with a reserved domain where relevant.</span>
          </motion.article>
        </AnimatePresence>
        <div className="practice-actions"><button className="button" onClick={() => answer("scam")} disabled={answered}><Icon name="hook" size={20} />Looks fraudulent</button><button className="button button--ghost" onClick={() => answer("legitimate")} disabled={answered}><Icon name="check" size={20} />Looks legitimate</button></div>
      </div>
      <aside className="practice-reveal" aria-live="polite">
        {answered ? <><h2>{card.label === "scam" ? "Fraudulent example" : "Legitimate example"}</h2><p>Your answer was {answers.at(-1)?.correct ? "correct" : "incorrect"}. The evidence comes from the same annotation component as the report.</p><AnnotatedMessage report={report} /><button className="button" onClick={next}>{index === practiceDeck.length - 1 ? "See result" : "Next card"}<Icon name="arrow-up-right" size={20} /></button></> : <div className="practice-empty glass-tint panel-28"><Icon name="loupe" size={42} /><h2>Evidence appears here</h2><p>Choose an answer to see the exact warning signs, or why no clear signs were found.</p></div>}
      </aside>
    </section>
  </main>;
}
