"use client";
import Link from "next/link";
import { useState } from "react";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container nav">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">∑</span>
          <span>WASSCE <b>MATHS ACADEMY</b></span>
        </Link>
        <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <Link href="/courses" onClick={() => setOpen(false)}>Courses</Link>
          <Link href="/practice" onClick={() => setOpen(false)}>Practice</Link>
          <Link href="/dashboard" onClick={() => setOpen(false)}>My learning</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
          <Link className="nav-cta" href="/dashboard" onClick={() => setOpen(false)}>Start learning</Link>
        </nav>
      </div>
    </header>
  );
}
