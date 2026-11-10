import Link from "next/link";

const courses = [
  {n:"01", title:"Number & Numeration", level:"FOUNDATION", desc:"Build confidence with integers, fractions, decimals, percentages, ratios, rates and standard form.", lessons:"8 lesson units", icon:"＋", tags:["Fractions","Percentages","Ratio"]},
  {n:"02", title:"Algebra", level:"CORE TOPIC", desc:"Learn to simplify expressions, solve linear equations, work with formulae and understand sequences.", lessons:"10 lesson units", icon:"x²", tags:["Expressions","Equations","Sequences"]},
  {n:"03", title:"Geometry & Measurement", level:"CORE TOPIC", desc:"Explore angles, polygons, circles, perimeter, area, surface area and volume.", lessons:"9 lesson units", icon:"△", tags:["Angles","Area","Volume"]},
  {n:"04", title:"Trigonometry", level:"CORE TOPIC", desc:"Understand right-angled triangles, trigonometric ratios, bearings and real-life applications.", lessons:"6 lesson units", icon:"∠", tags:["Sine","Cosine","Bearings"]},
  {n:"05", title:"Statistics & Probability", level:"CORE TOPIC", desc:"Interpret data, calculate averages, read charts and solve probability questions.", lessons:"7 lesson units", icon:"▥", tags:["Mean","Charts","Probability"]},
  {n:"06", title:"Graphs & Functions", level:"CORE TOPIC", desc:"Work with coordinates, tables of values, linear graphs and relationships.", lessons:"7 lesson units", icon:"⌁", tags:["Coordinates","Graphs","Functions"]},
];

export default function CoursesPage() {
  return <section className="page-section container">
    <div className="page-intro"><div className="eyebrow dark-eyebrow">THE LEARNING LIBRARY</div><h1>Explore your <em>Maths course.</em></h1><p>A guided Core Mathematics learning path, organised into manageable topic areas. Each topic will include lessons, worked examples and practice.</p></div>
    <div className="course-banner"><div><span>START HERE</span><h2>WASSCE Core Mathematics</h2><p>Build your foundation and work through the key topic areas.</p></div><div className="banner-symbol">∑</div></div>
    <div className="course-grid">{courses.map(c=><article className="course-card" key={c.n}><div className="course-card-top"><span className="course-icon">{c.icon}</span><span className="course-level">{c.level}</span></div><span className="topic-number">{c.n}</span><h2>{c.title}</h2><p>{c.desc}</p><div className="tag-row">{c.tags.map(t=><span key={t}>{t}</span>)}</div><div className="course-card-bottom"><span>▤ &nbsp;{c.lessons}</span><Link href="/lesson">Preview lesson ↗</Link></div></article>)}</div>
    <div className="notice"><b>Course note:</b> This is the starter curriculum structure. We will add and verify the full lesson content against the current WAEC syllabus before publishing the complete course.</div>
  </section>;
}
