"use client";

import { useEffect, useState } from "react";

const features = [
  { n: "01", title: "Atmosphere", copy: "A visual system built around depth, light and motion instead of a wall of components." },
  { n: "02", title: "Movement", copy: "Every interaction has a response — hover, touch, scroll, focus, and the little things between." },
  { n: "03", title: "Presence", copy: "A silhouette anchors the experience: human, quiet, cinematic, and intentionally ambiguous." },
];

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [spot, setSpot] = useState({ x: 50, y: 35 });
  const [active, setActive] = useState(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      setSpot({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <main style={{ "--mx": spot.x + "%", "--my": spot.y + "%" } as React.CSSProperties}>
      <div className="grain" aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />

      <nav className="nav">
        <a className="brand" href="#top" aria-label="Aperture home"><span>●</span> APERTURE</a>
        <div className="nav-links">
          <a href="#story">Story</a>
          <a href="#details">Details</a>
          <a href="#contact">Contact</a>
        </div>
        <button className="menu-button" onClick={() => setMenu(!menu)} aria-expanded={menu}>
          <span>{menu ? "Close" : "Menu"}</span><i />
        </button>
      </nav>

      {menu && (
        <div className="mobile-menu">
          <a href="#story" onClick={() => setMenu(false)}>Story <span>01</span></a>
          <a href="#details" onClick={() => setMenu(false)}>Details <span>02</span></a>
          <a href="#contact" onClick={() => setMenu(false)}>Contact <span>03</span></a>
        </div>
      )}

      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> DIGITAL / HUMAN / MOTION</p>
          <h1>Make<br /><em>presence</em><br />visible.</h1>
          <p className="hero-sub">A cinematic playground for ideas, interfaces and the space between stillness and motion.</p>
          <a className="magnetic" href="#story"><span>Enter the experience</span><b>↗</b></a>
        </div>

        <div className="figure-wrap" aria-label="Abstract human silhouette">
          <div className="halo" />
          <svg className="figure" viewBox="0 0 300 650" role="img" aria-label="Person in a standing pose">
            <defs>
              <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f5f2eb" />
                <stop offset=".48" stopColor="#aaa69f" />
                <stop offset="1" stopColor="#292824" />
              </linearGradient>
              <filter id="soft"><feGaussianBlur stdDeviation="7" /></filter>
            </defs>
            <ellipse cx="155" cy="622" rx="76" ry="10" fill="#000" opacity=".5" filter="url(#soft)" />
            <circle cx="150" cy="91" r="39" fill="url(#body)" />
            <path d="M121 131 C102 153 99 207 112 264 L124 340 L111 466 L91 601 L128 601 L153 473 L164 370 L184 474 L194 601 L230 601 L207 338 L216 251 C221 201 202 150 178 132 Z" fill="url(#body)" />
            <path d="M119 150 C89 174 62 224 42 291 L62 300 L111 236 L137 184 Z" fill="url(#body)" />
            <path d="M208 153 C232 190 246 231 259 284 L241 293 L202 232 L183 183 Z" fill="url(#body)" />
            <path d="M111 455 L84 592 L103 608 L135 474 Z" fill="#171716" />
            <path d="M185 455 L193 600 L218 609 L207 468 Z" fill="#171716" />
          </svg>
          <div className="figure-label"><span>FIG. 01</span><span>HUMAN / 01</span></div>
        </div>

        <div className="scroll-cue"><span>Scroll to explore</span><i /></div>
        <div className="hero-index">01 <span>/</span> 04</div>
      </section>

      <section id="story" className="manifesto">
        <div className="section-tag">01 — THE IDEA</div>
        <div>
          <p className="big-copy">Good interfaces don&apos;t ask for attention. <em>They earn it.</em></p>
          <p className="body-copy">A deliberate mix of typography, depth, responsive motion and tactile controls creates a site that feels less like a page and more like a place.</p>
        </div>
      </section>

      <section id="details" className="details">
        <div className="section-tag">02 — THE SYSTEM</div>
        <div className="feature-grid">
          {features.map((item, i) => (
            <button className={`feature-card ${active === i ? "selected" : ""}`} key={item.n} onClick={() => setActive(i)}>
              <span>{item.n}</span>
              <h2>{item.title}</h2>
              <p>{item.copy}</p>
              <b>↗</b>
            </button>
          ))}
        </div>
      </section>

      <section className="marquee" aria-hidden="true">
        <div>LIGHT / SHADOW / MOTION / HUMAN / LIGHT / SHADOW / MOTION / HUMAN / </div>
      </section>

      <section className="closing" id="contact">
        <div className="section-tag">03 — KEEP GOING</div>
        <h2>There&apos;s more<br /><em>to see.</em></h2>
        <a className="magnetic light" href="#top"><span>Back to the beginning</span><b>↑</b></a>
        <footer><span>APERTURE © 2026</span><span>BUILT FOR THE WEB</span><span>04 / 04</span></footer>
      </section>
    </main>
  );
}
