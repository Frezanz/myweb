"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Orb({ active }: { active: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.x = t * 0.12;
    ref.current.rotation.y = t * 0.18;
    const s = 1 + Math.sin(t * 1.7) * 0.035 + (active ? 0.07 : 0);
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.25, 4]} />
      <meshPhysicalMaterial color="#d9d5cc" roughness={0.14} metalness={0.7} transmission={0.35} thickness={1.8} clearcoat={1} clearcoatRoughness={0.08} />
    </mesh>
  );
}

function Scene({ active }: { active: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.6], fov: 38 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.2} />
      <pointLight position={[3, 2, 4]} intensity={18} distance={8} />
      <pointLight position={[-3, -1, 2]} intensity={8} distance={7} />
      <Orb active={active} />
    </Canvas>
  );
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState<"calm" | "alive">("calm");
  const [time, setTime] = useState("");
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 20 });
  const sy = useSpring(my, { stiffness: 90, damping: 20 });
  const glowX = useTransform(sx, [-1, 1], ["35%", "65%"]);
  const glowY = useTransform(sy, [-1, 1], ["35%", "65%"]);

  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const pointer = (x: number, y: number) => {
    mx.set((x / window.innerWidth) * 2 - 1);
    my.set((y / window.innerHeight) * 2 - 1);
  };

  return (
    <main onPointerMove={(e) => pointer(e.clientX, e.clientY)} className={mode === "alive" ? "page alive" : "page"}>
      <motion.div className="ambient" style={{ left: glowX, top: glowY }} />
      <header className="topbar">
        <button className="wordmark" onClick={() => setRevealed((v) => !v)} aria-label="Toggle detail">
          <span className="dot" /> N / C
        </button>
        <div className="topmeta"><span>STUDIO / 01</span><span>{time}</span></div>
        <button className="menuBtn" onClick={() => setMenu(true)} aria-label="Open menu"><i /><i /></button>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2 }} className="eyebrow">A QUIET INTERFACE FOR A LOUD FUTURE</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .8 }}>
            <span>Move</span><em>through</em><span>the</span><strong>unknown.</strong>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .8 }} className="intro">
            An experimental digital space built around movement, atmosphere and discovery.
          </motion.p>
          <div className="actions">
            <button className="primary" onClick={() => setMode(mode === "calm" ? "alive" : "calm")}>
              <span>{mode === "calm" ? "Enter the field" : "Return to stillness"}</span><b>↗</b>
            </button>
            <button className="textBtn" onClick={() => setRevealed((v) => !v)}>{revealed ? "Less detail" : "Reveal detail"} <span>+</span></button>
          </div>
        </div>
        <motion.div className="orbWrap" animate={{ scale: mode === "alive" ? 1.08 : 1, rotate: mode === "alive" ? 2 : 0 }} transition={{ type:"spring", stiffness:70, damping:16 }}>
          <Scene active={mode === "alive"} />
          <div className="orbit orbitA" /><div className="orbit orbitB" />
          <div className="orbLabel"><span>01</span><span>LIVE OBJECT</span></div>
        </motion.div>
      </section>

      <AnimatePresence>
        {revealed && (
          <motion.section className="reveal" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div><small>01 / MATERIAL</small><p>Soft geometry, restrained contrast and motion with physical weight.</p></div>
            <div><small>02 / RESPONSE</small><p>The interface follows you — pointer, touch, time and state.</p></div>
            <div><small>03 / INTENT</small><p>Nothing is ornamental by accident. Every movement has a job.</p></div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="lower">
        <div className="index">01—03</div>
        <div className="statement">Digital space can feel <span>physical.</span></div>
        <div className="scrollHint"><span /> SCROLL TO EXPLORE</div>
      </section>

      <footer><span>NOCTURNE / 2026</span><span>DESIGNED TO BE TOUCHED</span></footer>

      <AnimatePresence>
        {menu && (
          <motion.div className="menuOverlay" initial={{ clipPath:"circle(0% at 92% 7%)" }} animate={{ clipPath:"circle(150% at 92% 7%)" }} exit={{ clipPath:"circle(0% at 92% 7%)" }}>
            <button className="close" onClick={() => setMenu(false)}>×</button>
            <div className="menuInner">
              <small>N / C — INDEX</small>
              <button onClick={() => setMenu(false)}>The field <span>01</span></button>
              <button onClick={() => { setMode("alive"); setMenu(false); }}>The object <span>02</span></button>
              <button onClick={() => { setRevealed(true); setMenu(false); }}>The details <span>03</span></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}