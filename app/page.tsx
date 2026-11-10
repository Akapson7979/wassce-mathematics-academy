import Link from "next/link";

const topics = [
  ["01", "Number & numeration", "Fractions, percentages, ratios and number operations"],
  ["02", "Algebra", "Expressions, equations, inequalities and sequences"],
  ["03", "Geometry & measurement", "Angles, shapes, area, volume and constructions"],
  ["04", "Trigonometry", "Sine, cosine, tangent and applications"],
  ["05", "Statistics & probability", "Data, averages, charts and chance"],
  ["06", "Graphs & functions", "Coordinates, straight-line graphs and relations"],
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> YOUR WASSCE MATHEMATICS CLASSROOM</div>
            <h1>Mathematics made <em>simple.</em><br />WASSCE made achievable.</h1>
            <p className="hero-lead">Understand every topic, practise with confidence and prepare smarter for your WASSCE Core Mathematics examination.</p>
            <div className="hero-actions">
              <Link className="button button-gold" href="/courses">Explore courses <span>→</span></Link>
              <Link className="button button-ghost" href="/practice">Try a free quiz</Link>
            </div>
            <div className="hero-proof"><div className="proof-avatars"><i>✓</i><i>∑</i><i>π</i></div><span>Clear explanations. Guided practice. Better confidence.</span></div>
          </div>
          <div className="hero-visual">
            <div className="visual-glow" />
            <div className="math-card">
              <div className="math-card-top"><span>LESSON 01 · ALGEBRA</span><span className="live-dot">● IN PRACTICE</span></div>
              <div className="equation-label">SOLVE FOR x</div>
              <div className="equation">2x + 5 = 17</div>
              <div className="working">
                <div><span>Step 1</span><b>2x = 17 − 5</b></div>
                <div><span>Step 2</span><b>2x = 12</b></div>
                <div><span>Step 3</span><b>x = 12 ÷ 2</b></div>
              </div>
              <div className="answer"><span>YOUR ANSWER</span><strong>x = 6</strong><b>✓</b></div>
            </div>
            <div className="floating-note note-one"><span>✦</span> Learn step by step</div>
            <div className="floating-note note-two"><b>15 min</b><span>focused practice</span></div>
            <div className="hero-orbit orbit-a" /><div className="hero-orbit orbit-b" />
          </div>
        </div>
      </section>

      <section className="stats-strip">
        <div className="container stats-grid">
          <div><strong>6+</strong><span>Core topic areas</span></div>
          <div><strong>Step-by-step</strong><span>Worked examples</span></div>
          <div><strong>Self-paced</strong><span>Learn on your schedule</span></div>
          <div><strong>WASSCE-focused</strong><span>Exam preparation</span></div>
        </div>
      </section>

      <section className="section container">
        <div className="section-heading">
          <div><div className="eyebrow dark-eyebrow">YOUR LEARNING PATH</div><h2>Build your confidence,<br /><em>one topic at a time.</em></h2></div>
          <p>Start with the foundations, follow clear explanations and test what you have learned with practice questions.</p>
        </div>
        <div className="topic-grid">
          {topics.map(([n, title, desc]) => <Link href="/courses" className="topic-card" key={n}>
            <span className="topic-number">{n}</span><div><h3>{title}</h3><p>{desc}</p></div><span className="topic-arrow">↗</span>
          </Link>)}
        </div>
        <div className="center-action"><Link className="button button-dark" href="/courses">View all learning topics <span>→</span></Link></div>
      </section>

      <section className="practice-band">
        <div className="container practice-band-inner">
          <div><div className="eyebrow">PRACTISE AS YOU LEARN</div><h2>Don't just watch.<br /><em>Work it out.</em></h2><p>Check your understanding with short quizzes and see explanations for the answers.</p><Link className="button button-gold" href="/practice">Take a free practice quiz →</Link></div>
          <div className="quiz-preview"><div className="quiz-preview-head"><span>QUICK CHALLENGE</span><span>01 / 05</span></div><p>If 3x − 4 = 11, what is the value of x?</p><div className="quiz-option">A&nbsp;&nbsp; 3</div><div className="quiz-option selected">B&nbsp;&nbsp; 5 <b>✓</b></div><div className="quiz-option">C&nbsp;&nbsp; 7</div><div className="quiz-option">D&nbsp;&nbsp; 15</div><small>Choose your answer in the practice area.</small></div>
        </div>
      </section>

      <section className="section container final-cta">
        <div className="eyebrow dark-eyebrow">YOUR NEXT STEP STARTS HERE</div><h2>Ready to make Maths<br /><em>your strong subject?</em></h2><p>Explore the free starter lessons and begin building a stronger foundation today.</p><Link className="button button-dark" href="/dashboard">Start learning free →</Link>
      </section>
    </>
  );
}
