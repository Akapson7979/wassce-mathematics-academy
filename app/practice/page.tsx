"use client";
import { useState } from "react";
import Link from "next/link";

const questions = [
  {q:"Solve: 3x − 4 = 11.", options:["3","5","7","15"], answer:1, explain:"Add 4 to both sides: 3x = 15. Divide both sides by 3, so x = 5."},
  {q:"What is 25% of 240?", options:["40","50","60","80"], answer:2, explain:"25% is one quarter. 240 ÷ 4 = 60."},
  {q:"Simplify: 4a + 3a − 2a.", options:["5a","7a","9a","a"], answer:0, explain:"Collect like terms: (4 + 3 − 2)a = 5a."},
  {q:"Find the mean of 4, 6, 8 and 10.", options:["6","7","8","9"], answer:1, explain:"Add the values: 4 + 6 + 8 + 10 = 28. Divide by 4: mean = 7."},
  {q:"A triangle has angles 50° and 60°. Find the third angle.", options:["60°","70°","80°","90°"], answer:1, explain:"Angles in a triangle add up to 180°. 180° − 50° − 60° = 70°."}
];

export default function PracticePage() {
  const [index,setIndex] = useState(0);
  const [selected,setSelected] = useState<number|null>(null);
  const [score,setScore] = useState(0);
  const [finished,setFinished] = useState(false);
  const current = questions[index];
  function next() {
    if (selected === current.answer) setScore(s=>s+1);
    if (index === questions.length-1) setFinished(true);
    else { setIndex(i=>i+1); setSelected(null); }
  }
  function restart() {setIndex(0);setSelected(null);setScore(0);setFinished(false);}
  return <section className="page-section container practice-page">
    <div className="page-intro"><div className="eyebrow dark-eyebrow">CHECK YOUR UNDERSTANDING</div><h1>Quick Maths <em>practice.</em></h1><p>Five starter questions covering common Core Mathematics skills. Select an answer to see the explanation.</p></div>
    <div className="quiz-shell">
      {!finished ? <>
        <div className="quiz-top"><span>STARTER QUIZ · CORE MATHEMATICS</span><b>{index+1} / {questions.length}</b></div>
        <div className="progress-track"><div style={{width:`${((index+1)/questions.length)*100}%`}} /></div>
        <div className="quiz-question"><span>QUESTION {String(index+1).padStart(2,"0")}</span><h2>{current.q}</h2></div>
        <div className="answer-list">{current.options.map((option,i)=><button key={i} onClick={()=>selected===null&&setSelected(i)} className={"answer-option "+(selected===i?"chosen ":"")+(selected!==null&&i===current.answer?" correct":"")+(selected===i&&selected!==current.answer?" incorrect":"")}><span>{String.fromCharCode(65+i)}</span>{option}{selected!==null&&i===current.answer?<b>✓</b>:null}</button>)}</div>
        {selected!==null&&<div className="explanation"><b>{selected===current.answer?"Correct! Well done.":"Not quite. Let's learn from it."}</b><p>{current.explain}</p></div>}
        <div className="quiz-actions"><span>{selected===null?"Choose one answer to continue.":"Review the explanation, then continue."}</span><button className="button button-dark" disabled={selected===null} onClick={next}>{index===questions.length-1?"See my result":"Next question →"}</button></div>
      </>:<div className="quiz-result"><div className="result-icon">✓</div><div className="eyebrow dark-eyebrow">QUIZ COMPLETED</div><h2>You scored <em>{score} / {questions.length}</em></h2><p>{score>=4?"Excellent work. Keep practising to maintain your confidence.":score>=2?"Good effort. Review the explanations and try again.":"Keep going. Every question is a chance to improve."}</p><button className="button button-dark" onClick={restart}>Try again</button><Link href="/courses" className="text-link">Explore lessons →</Link></div>}
    </div>
    <p className="small-note">This is a sample practice quiz for the website prototype, not an official WAEC examination.</p>
  </section>;
}
