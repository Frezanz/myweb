"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const move = (e: PointerEvent) => {
      setTilt({
        x: ((e.clientX / window.innerWidth) - 0.5) * 10,
        y: ((e.clientY / window.innerHeight) - 0.5) * -8,
      });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <main style={{ "--tx": `${tilt.x}deg`, "--ty": `${tilt.y}deg` } as React.CSSProperties}>
      <div className="stars" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <nav className="nav">
        <a className="mark" href="#home" aria-label="Home">✦</a>
        <div className="nav-name">FREZANZ</div>
        <div className="nav-links">
          <a href="#essence">Essence</a>
          <a href="#layers">Layers</a>
          <a href="#enter">Enter</a>
        </div>
        <button className="menu" onClick={() => setMenu(!menu)} aria-expanded={menu}>
          {menu ? "CLOSE" : "MENU"} <span>↗</span>
        </button>
      </nav>

      {menu && (
        <div className="mobile-menu">
          <a href="#essence" onClick={() => setMenu(false)}>Essence <span>01</span></a>
          <a href="#layers" onClick={() => setMenu(false)}>Layers <span>02</span></a>
          <a href="#enter" onClick={() => setMenu(false)}>Enter <span>03</span></a>
        </div>
      )}

      <section className="hero" id="home">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="ring ring-one" />
        <div className="ring ring-two" />
        <div className="ring ring-three" />

        <div className="hero-copy">
          <div className="tiny">AN INTERFACE BETWEEN LIGHT &amp; SHADOW</div>
          <h1 className="script">Frezanz</h1>
          <h2>BEYOND<br /><span>THE VISIBLE.</span></h2>
          <p>Step into a quiet digital space where a human presence meets depth, light and motion.</p>
          <a className="enter" href="#essence"><span>Enter the space</span><b>↓</b></a>
        </div>

        <div className="human-scene">
          <div className="aura" />
          <div className="human-image" role="img" aria-label="Human silhouette standing in a contemplative pose" />
          <div className="floor">
            <div className="floor-grid" />
          </div>
          <div className="depth-label">HUMAN PRESENCE<br /><span>DEPTH 01.01</span></div>
        </div>

        <div className="coordinates">13° 02′ 07″ N<br />93° 57′ 31″ E</div>
        <div className="scroll">SCROLL <i /></div>
      </section>

      <section className="essence" id="essence">
        <div className="section-label">01 / ESSENCE</div>
        <div className="essence-copy">
          <p className="statement">There is a space between <em>who we are</em> and what the world can see.</p>
          <p className="muted">This experience is built around that space — a living composition of human form, atmosphere and dimensional light.</p>
        </div>
      </section>

      <section className="layers" id="layers">
        <div className="section-label">02 / LAYERS</div>
        <div className="layer-stage">
          <div className="layer-card back"><span>03</span><strong>SPACE</strong><small>What surrounds us</small></div>
          <div className="layer-card middle"><span>02</span><strong>LIGHT</strong><small>What reveals us</small></div>
          <div className="layer-card front"><span>01</span><strong>HUMAN</strong><small>What remains</small></div>
        </div>
      </section>

      <section className="enter-section" id="enter">
        <div className="section-label">03 / BEYOND</div>
        <h2 className="script">Frezanz</h2>
        <p>Look closer.</p>
        <a className="circle-link" href="#home" aria-label="Return to top">↗</a>
        <footer><span>FREZANZ © 2026</span><span>A DIGITAL MEDITATION</span><span>04 / 04</span></footer>
      </section>
    </main>
  );
}
