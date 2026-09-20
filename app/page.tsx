 "use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Sparkles, Stars, useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const HUMAN_IMAGE = "https://images.unsplash.com/photo-1619626539718-17ec5039c272?auto=format&fit=crop&w=1100&q=88";

function Halo() {
  const ring = useRef<THREE.Mesh>(null), core = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { const t=clock.getElapsedTime(); if(ring.current){ring.current.rotation.z=t*.035;ring.current.scale.setScalar(1+Math.sin(t*.55)*.025)} if(core.current){const s=1+Math.sin(t*.8)*.035;core.current.scale.set(s,s,1)} });
  return <group position={[0,.5,-3.2]}>
    <mesh ref={core}><circleGeometry args={[3.8,96]}/><meshBasicMaterial color="#dfe8ff" transparent opacity={.055} depthWrite={false}/></mesh>
    <mesh ref={ring} rotation={[.15,-.08,.15]}><torusGeometry args={[4.1,.018,16,160]}/><meshBasicMaterial color="#b7c9ff" transparent opacity={.34}/></mesh>
    <mesh rotation={[.15,-.08,.15]}><torusGeometry args={[4.45,.006,12,160]}/><meshBasicMaterial color="#f2eee2" transparent opacity={.2}/></mesh>
    <pointLight intensity={12} distance={18} color="#b9caff"/>
  </group>;
}

function Human() {
  const texture=useTexture(HUMAN_IMAGE); texture.colorSpace=THREE.SRGBColorSpace; texture.minFilter=THREE.LinearFilter;
  return <mesh position={[0,-.25,-.7]} scale={[4.9,4.9,4.9]}><planeGeometry args={[1,1]}/><meshBasicMaterial map={texture} transparent opacity={.92} depthWrite={false} toneMapped={false}/></mesh>;
}

function Ground() {
  return <group position={[0,-3.15,0]} rotation={[-Math.PI/2.25,0,0]}>
    <mesh><planeGeometry args={[24,24]}/><meshBasicMaterial color="#070a11" transparent opacity={.9}/></mesh>
    <mesh position={[0,0,.02]}><ringGeometry args={[2.1,7.5,96]}/><meshBasicMaterial color="#9eacd0" transparent opacity={.055}/></mesh>
  </group>;
}

function Geometry() {
  const a=useRef<THREE.Mesh>(null), b=useRef<THREE.Mesh>(null);
  useFrame(({clock})=>{const t=clock.getElapsedTime();if(a.current)a.current.rotation.y=t*.08;if(b.current)b.current.rotation.x=t*-.06});
  return <><mesh ref={a} position={[-4.5,1.2,-2.5]}><icosahedronGeometry args={[.75,1]}/><meshBasicMaterial wireframe color="#aab8d8" transparent opacity={.12}/></mesh><mesh ref={b} position={[4.1,-.1,-1.8]}><octahedronGeometry args={[.95,0]}/><meshBasicMaterial wireframe color="#d7cdb8" transparent opacity={.1}/></mesh></>;
}

function CameraRig({active}:{active:boolean}) {
  const {camera}=useThree(); const target=useMemo(()=>new THREE.Vector3(),[]);
  useFrame(({pointer,clock})=>{const t=clock.getElapsedTime(), depth=active?2.4:5.8; target.set(pointer.x*.65,pointer.y*.32,depth); camera.position.x=THREE.MathUtils.lerp(camera.position.x,target.x,.035); camera.position.y=THREE.MathUtils.lerp(camera.position.y,target.y,.035); camera.position.z=THREE.MathUtils.lerp(camera.position.z,target.z,active?.025:.02); camera.lookAt(0,-.15,-1.6+Math.sin(t*.2)*.08)});
  return null;
}

function Scene({active}:{active:boolean}) {
  return <Canvas dpr={[1,1.8]} camera={{position:[0,0,5.8],fov:42,near:.1,far:100}} gl={{antialias:true,alpha:true,powerPreference:"high-performance"}} style={{position:"absolute",inset:0}}>
    <color attach="background" args={["#02040a"]}/><fog attach="fog" args={["#02040a",5,18]}/><ambientLight intensity={.12}/>
    <Suspense fallback={null}><Halo/><Human/><Ground/><Geometry/><Float speed={.32} rotationIntensity={.08} floatIntensity={.16}><Sparkles count={active?240:150} scale={[15,9,9]} size={1.3} speed={.16} opacity={.5} color="#c7d2ee"/></Float><Stars radius={28} depth={18} count={active?1200:700} factor={1.3} saturation={0} fade speed={.08}/></Suspense>
    <CameraRig active={active}/>
  </Canvas>;
}

export default function Home() {
  const [active,setActive]=useState(false), [sound,setSound]=useState(false);
  return <main className={active?"world active":"world"}>
    <Scene active={active}/><div className="vignette" aria-hidden="true"/><div className="grain" aria-hidden="true"/>
    <header className="topbar"><button className="wordmark" onClick={()=>setActive(false)} aria-label="Return to the beginning">frezanz<span>·</span></button><div className="top-actions"><button onClick={()=>setSound(v=>!v)} className={sound?"is-on":""}>{sound?"SOUND ON":"SOUND OFF"}</button><button onClick={()=>setActive(v=>!v)}>{active?"RETURN":"EXPLORE"}</button></div></header>
    <section className="hero-copy" aria-label="Frezanz introduction"><p className="eyebrow">A QUIET DIGITAL SPACE</p><h1>Frezanz</h1><p className="subtitle">Between light, shadow and presence.</p></section>
    <div className="depth-type" aria-hidden="true">Frezanz</div>
    <button className="explore" onClick={()=>setActive(true)} aria-label="Explore the space"><span className="explore-ring"/><span>{active?"MOVE":"EXPLORE"}</span></button>
    <div className="coordinates" aria-hidden="true">LIGHT FIELD / 01<br/>DEPTH 03.7</div><div className="scroll-hint" aria-hidden="true"><span/>DRAG · LOOK AROUND</div>
  </main>;
}