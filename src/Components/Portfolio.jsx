import { useState, useEffect, useRef } from "react";
import { EXP, PROJECTS, SKILLS, ROLES, SOCIALS, STATS } from "../data";
import pdf from './Pdf/Resume.pdf';
import {
  Sun, Moon, Menu, X, MapPin, Briefcase, Zap, Mail,
  Github, Linkedin, ExternalLink, ArrowRight, Download,
  Monitor, Cpu, Layers, Server, Database, GitBranch, Code2, ChevronDown
} from "lucide-react";

/* ─── THEMES ─────────────────────────────────────────────── */
const LIGHT = {
  bg:       "#ffffff",
  bg2:      "#fafaff",
  bg3:      "#f0f4ff",
  card:     "#ffffff",
  border:   "rgba(37,99,235,0.12)",
  primary:  "#2563eb",
  grad:     "linear-gradient(135deg,#2563eb 0%,#60a5fa 50%,#93c5fd 100%)",
  gradSoft: "linear-gradient(135deg,rgba(37,99,235,0.08) 0%,rgba(96,165,250,0.08) 100%)",
  text:     "#0f0a1e",
  textMd:   "#3d3557",
  textSoft: "#6b6583",
  shadow:   "0 4px 24px rgba(37,99,235,0.10)",
  shadowMd: "0 8px 40px rgba(37,99,235,0.16)",
  shadowLg: "0 20px 60px rgba(37,99,235,0.18)",
  navBg:    "rgba(255,255,255,0.95)",
  dot:      "rgba(37,99,235,0.12)",
};
const DARK = {
  bg:       "#080d1a",
  bg2:      "#0c1220",
  bg3:      "#111827",
  card:     "#0f172a",
  border:   "rgba(96,165,250,0.14)",
  primary:  "#60a5fa",
  grad:     "linear-gradient(135deg,#3b82f6 0%,#60a5fa 50%,#93c5fd 100%)",
  gradSoft: "linear-gradient(135deg,rgba(59,130,246,0.14) 0%,rgba(96,165,250,0.14) 100%)",
  text:     "#f0f4ff",
  textMd:   "#c7d4f0",
  textSoft: "#7e95bb",
  shadow:   "0 4px 24px rgba(0,0,0,0.45)",
  shadowMd: "0 8px 40px rgba(0,0,0,0.55)",
  shadowLg: "0 20px 60px rgba(0,0,0,0.65)",
  navBg:    "rgba(8,13,26,0.95)",
  dot:      "rgba(96,165,250,0.14)",
};

const NAV_LINKS = ["Home","About","Experience","Skills","Projects","Contact"];
const DISPLAY   = "'Bricolage Grotesque','DM Sans',sans-serif";
const SANS      = "'DM Sans',sans-serif";
const MONO      = "'DM Mono','JetBrains Mono',monospace";

/* ─── GRAD TEXT ──────────────────────────────────────────── */
/* Light: real CSS gradient clip. Dark: solid primary colour  */
/* This avoids the Chrome dark-mode highlight/box bug        */
function G({ c, dark, children }) {
  if (dark) {
    return <span style={{ color: c.primary }}>{children}</span>;
  }
  return (
    <span style={{
      backgroundImage: c.grad,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    }}>{children}</span>
  );
}

/* ─── SKILL ICON ─────────────────────────────────────────── */
function SkIcon({ cat }) {
  const p = { size:17, strokeWidth:1.8 };
  if (cat==="Frontend")     return <Monitor   {...p}/>;
  if (cat==="Architecture") return <Layers    {...p}/>;
  if (cat==="State")        return <Cpu       {...p}/>;
  if (cat==="Backend")      return <Server    {...p}/>;
  if (cat==="Database")     return <Database  {...p}/>;
  if (cat==="DevOps")       return <GitBranch {...p}/>;
  return <Code2 {...p}/>;
}

/* ─── HOOKS ──────────────────────────────────────────────── */
function useTyping(arr, spd=72) {
  const [txt,setTxt]=useState(""); const [idx,setIdx]=useState(0);
  const [ch,setCh]=useState(0);   const [del,setDel]=useState(false);
  const [pause,setPause]=useState(false);
  useEffect(()=>{
    if(pause) return;
    const cur=arr[idx%arr.length]; let t;
    if(!del){
      setTxt(cur.slice(0,ch));
      if(ch<cur.length) t=setTimeout(()=>setCh(x=>x+1),spd);
      else{ setPause(true); setTimeout(()=>{ setPause(false); setDel(true); },2200); }
    } else {
      setTxt(cur.slice(0,ch));
      if(ch>0) t=setTimeout(()=>setCh(x=>x-1),spd/2);
      else{ setDel(false); setIdx(x=>x+1); }
    }
    return()=>clearTimeout(t);
  },[ch,del,idx,arr,spd,pause]);
  return txt;
}

function useReveal(thresh=0.12) {
  const ref=useRef(null); const [vis,setVis]=useState(false);
  useEffect(()=>{
    const ob=new IntersectionObserver(([e])=>{ if(e.isIntersecting) setVis(true); },{ threshold:thresh });
    if(ref.current) ob.observe(ref.current);
    return()=>ob.disconnect();
  },[thresh]);
  return [ref,vis];
}

function useCount(target, trigger) {
  const [n,setN]=useState(0);
  useEffect(()=>{
    if(!trigger) return; let s=0;
    const step=()=>{ s+=16; const p=Math.min(s/1400,1); const ease=1-Math.pow(1-p,3);
      setN(Math.round(ease*target)); if(p<1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  },[trigger,target]);
  return n;
}

function useIsMobile() {
  const [mob,setMob]=useState(typeof window!=="undefined"?window.innerWidth<=768:false);
  useEffect(()=>{
    const fn=()=>setMob(window.innerWidth<=768);
    window.addEventListener("resize",fn); return()=>window.removeEventListener("resize",fn);
  },[]);
  return mob;
}

/* ─── SMALL COMPONENTS ───────────────────────────────────── */
function Reveal({ children, delay=0, y=36 }) {
  const [ref,vis]=useReveal();
  return (
    <div ref={ref} style={{
      opacity: vis?1:0,
      transform: vis?"none":`translateY(${y}px)`,
      transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

function Chip({ children, c }) {
  return (
    <span style={{
      display:"inline-block", padding:"4px 12px", borderRadius:"100px",
      fontSize:"11px", fontFamily:MONO, fontWeight:600,
      background:c.gradSoft, color:c.primary, border:`1px solid ${c.border}`,
      whiteSpace:"nowrap",
    }}>{children}</span>
  );
}

function StatCard({ n, s, l, trigger, c }) {
  const val = useCount(n, trigger);
  return (
    <div style={{ textAlign:"center", minWidth:70 }}>
      <div style={{ fontFamily:DISPLAY, fontSize:"clamp(28px,6vw,52px)",
        fontWeight:900, letterSpacing:"-2px", lineHeight:1, color:c.primary }}>
        {val}{s}
      </div>
      <div style={{ fontFamily:MONO, fontSize:"10px", color:c.textSoft,
        letterSpacing:"1.5px", textTransform:"uppercase", marginTop:6 }}>{l}</div>
    </div>
  );
}

function Logo({ size=44, onClick }) {
  return (
    <svg onClick={onClick} width={size} height={size} viewBox="0 0 44 44"
      style={{ cursor:"pointer", flexShrink:0, display:"block" }} aria-label="SP logo">
      <defs>
        <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#2563eb"/>
          <stop offset="60%"  stopColor="#60a5fa"/>
          <stop offset="100%" stopColor="#93c5fd"/>
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="13" fill="url(#lg)"/>
      <text x="22" y="31" textAnchor="middle"
        fontFamily={DISPLAY} fontWeight="900" fontSize="26" fill="#fff">S</text>
      <circle cx="34" cy="10" r="4" fill="rgba(255,255,255,0.28)"/>
    </svg>
  );
}

/* ─── MAIN ───────────────────────────────────────────────── */
export default function Portfolio() {
  const [dark,setDark]         = useState(false);
  const [active,setActive]     = useState("Home");
  const [scrolled,setScrolled] = useState(false);
  const [cat,setCat]           = useState("All");
  const [loaded,setLoaded]     = useState(false);
  const [menuOpen,setMenuOpen] = useState(false);
  const [statsRef,statsVis]    = useReveal();
  const typed = useTyping(ROLES);
  const isMob = useIsMobile();
  const c     = dark ? DARK : LIGHT;

  useEffect(()=>{
    document.body.style.background = c.bg;
    document.body.style.color      = c.text;
  },[dark]);

  useEffect(()=>{ setTimeout(()=>setLoaded(true),80); },[]);

  useEffect(()=>{
    const fn=()=>{
      setScrolled(window.scrollY>50);
      for(const id of NAV_LINKS){
        const el=document.getElementById(id);
        if(el){ const{top,bottom}=el.getBoundingClientRect();
          if(top<=130&&bottom>=130){ setActive(id); break; } }
      }
    };
    window.addEventListener("scroll",fn); return()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{
    if(menuOpen){ const fn=()=>setMenuOpen(false);
      window.addEventListener("scroll",fn,{once:true}); }
  },[menuOpen]);

  const cats  = ["All",...new Set(SKILLS.map(s=>s.cat))];
  const visSk = cat==="All" ? SKILLS : SKILLS.filter(s=>s.cat===cat);
  const SEC   = isMob ? "72px 20px" : "120px 40px";

  const SL  = { fontFamily:MONO, fontSize:"11px", fontWeight:700, letterSpacing:"3px",
    textTransform:"uppercase", color:c.primary, marginBottom:"12px", display:"block" };
  const SH  = { fontFamily:DISPLAY, fontSize:"clamp(30px,5.5vw,60px)", fontWeight:900,
    letterSpacing:"-2px", lineHeight:1.05, color:c.text, marginBottom:"16px" };
  const SDV = { width:48, height:3, borderRadius:2, background:c.grad, marginBottom:"48px" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800;12..96,900&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{overflow-x:hidden;font-family:${SANS};transition:background .3s,color .3s}
        ::selection{background:rgba(37,99,235,.2)}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(96,165,250,.4);border-radius:2px}
        @keyframes blink  {0%,100%{opacity:1}50%{opacity:0}}
        @keyframes float  {0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes pulse  {0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.2);opacity:1}}
        @keyframes fadeIn {from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
        @keyframes slideIn{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}
        .he1{animation:slideIn .8s cubic-bezier(.16,1,.3,1) .05s both}
        .he2{animation:slideIn .8s cubic-bezier(.16,1,.3,1) .18s both}
        .he3{animation:slideIn .8s cubic-bezier(.16,1,.3,1) .32s both}
        .he4{animation:slideIn .8s cubic-bezier(.16,1,.3,1) .46s both}
        .he5{animation:slideIn .8s cubic-bezier(.16,1,.3,1) .60s both}
        .nav-a{transition:all .22s}
        .btn-p{transition:all .28s}.btn-p:hover{opacity:.88;transform:translateY(-2px)}
        .btn-s{transition:all .28s}.btn-s:hover{transform:translateY(-2px)}
        .exp-c{transition:transform .3s,box-shadow .3s}.exp-c:hover{transform:translateY(-4px)}
        .sk-c {transition:transform .3s,box-shadow .3s}.sk-c:hover {transform:translateY(-6px)}
        .proj-c{transition:transform .35s,box-shadow .35s}.proj-c:hover{transform:translateY(-8px)}
        .soc-a{transition:transform .25s,background .25s}.soc-a:hover{transform:translateX(5px)}
        .cat-b{transition:all .2s}
        .ham-btn{background:none;border:none;cursor:pointer;padding:8px;border-radius:10px;
          display:flex;align-items:center;justify-content:center;transition:background .2s}
        .about-grid  {display:grid;gap:48px}
        .contact-grid{display:grid;gap:48px}
        .proj-grid   {display:grid;gap:18px}
        .sk-grid     {display:grid;gap:14px}
        .stats-row   {display:flex;flex-wrap:wrap;justify-content:center}
        @media(min-width:769px){
          .about-grid  {grid-template-columns:1.1fr .9fr}
          .contact-grid{grid-template-columns:1fr 1fr}
          .proj-grid   {grid-template-columns:repeat(auto-fill,minmax(310px,1fr))}
          .sk-grid     {grid-template-columns:repeat(auto-fill,minmax(195px,1fr))}
          .stats-row   {gap:64px!important}
        }
        @media(max-width:768px){
          .about-grid,.contact-grid,.proj-grid{grid-template-columns:1fr!important}
          .sk-grid   {grid-template-columns:repeat(2,1fr)!important}
          .stats-row {gap:20px!important}
          .hero-btns {flex-direction:column!important;align-items:stretch!important}
          .hero-btns a{text-align:center!important;justify-content:center!important}
          .exp-header{flex-direction:column!important}
          .exp-badges{flex-direction:row!important;flex-wrap:wrap!important;align-items:flex-start!important}
        }
        @media(max-width:400px){.sk-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:200,
        padding: isMob?(scrolled?"12px 20px":"18px 20px"):(scrolled?"14px 52px":"22px 52px"),
        background: scrolled||menuOpen ? c.navBg : "transparent",
        backdropFilter: scrolled||menuOpen ? "blur(20px)" : "none",
        borderBottom: scrolled||menuOpen ? `1px solid ${c.border}` : "none",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        transition:"all .35s cubic-bezier(.16,1,.3,1)",
        boxShadow: scrolled ? c.shadow : "none",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}
          onClick={()=>window.scrollTo(0,0)}>
          <Logo/>
          <span style={{ fontFamily:DISPLAY, fontSize:isMob?"16px":"18px",
            fontWeight:900, letterSpacing:"-0.5px", color:c.primary }}>
            Sushil Patil
          </span>
        </div>

        {!isMob && (
          <div style={{ display:"flex", gap:"2px" }}>
            {NAV_LINKS.map(l=>(
              <a key={l} href={`#${l}`} className="nav-a" style={{
                padding:"8px 15px", borderRadius:"10px", textDecoration:"none",
                fontFamily:SANS, fontSize:"14px", fontWeight:500,
                color: active===l ? c.primary : c.textSoft,
                background: active===l ? c.gradSoft : "transparent",
                border: active===l ? `1px solid ${c.border}` : "1px solid transparent",
              }}>{l}</a>
            ))}
          </div>
        )}

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button onClick={()=>setDark(d=>!d)} aria-label="Toggle theme" style={{
            display:"flex", alignItems:"center", gap:6,
            padding:"7px 13px", borderRadius:"100px",
            background:c.bg3, border:`1px solid ${c.border}`,
            cursor:"pointer", color:c.textMd,
            fontFamily:SANS, fontSize:"13px", fontWeight:600, transition:"all .3s",
          }}>
            {dark ? <Sun size={14} strokeWidth={2} color={c.primary}/>
                  : <Moon size={14} strokeWidth={2} color={c.primary}/>}
            <span>{dark?"Light":"Dark"}</span>
          </button>

          {isMob ? (
            <button className="ham-btn" onClick={()=>setMenuOpen(o=>!o)} aria-label="Toggle menu">
              {menuOpen ? <X size={22} strokeWidth={2} color={c.primary}/>
                        : <Menu size={22} strokeWidth={2} color={c.text}/>}
            </button>
          ) : (
            <a href="mailto:sushilpatil562@gmail.com" className="btn-p" style={{
              padding:"10px 22px", borderRadius:"11px", fontFamily:SANS,
              fontWeight:700, fontSize:"14px", background:c.grad, color:"#fff",
              textDecoration:"none", display:"inline-flex", alignItems:"center", gap:6,
              boxShadow:"0 8px 24px rgba(37,99,235,0.28)",
            }}><Mail size={14} strokeWidth={2.2}/>Hire Me</a>
          )}
        </div>
      </nav>

      {/* ── MOBILE MENU ── */}
      {isMob && menuOpen && (
        <div style={{
          position:"fixed", top:60, left:0, right:0, zIndex:190,
          background:c.navBg, backdropFilter:"blur(20px)",
          borderBottom:`1px solid ${c.border}`, padding:"12px 16px 20px",
          animation:"fadeIn .22s cubic-bezier(.16,1,.3,1)", boxShadow:c.shadowMd,
        }}>
          {NAV_LINKS.map(l=>(
            <a key={l} href={`#${l}`} onClick={()=>setMenuOpen(false)} style={{
              display:"block", padding:"12px 14px", borderRadius:"10px",
              fontFamily:SANS, fontSize:"16px", fontWeight:600, textDecoration:"none",
              color: active===l ? c.primary : c.text,
              background: active===l ? c.gradSoft : "transparent",
              marginBottom:"2px", transition:"all .2s",
            }}>{l}</a>
          ))}
          <div style={{ borderTop:`1px solid ${c.border}`, paddingTop:"12px", marginTop:"10px",
            display:"flex", gap:"8px", flexDirection:"column" }}>
            <a href="mailto:sushilpatil562@gmail.com" style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              padding:"13px", borderRadius:"12px", background:c.grad, color:"#fff",
              textDecoration:"none", fontFamily:SANS, fontWeight:700, fontSize:"15px",
              boxShadow:"0 8px 20px rgba(37,99,235,0.25)",
            }}><Mail size={16} strokeWidth={2}/>Hire Me</a>
            <a href={pdf} download="Resume.pdf" style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              padding:"13px", borderRadius:"12px", background:"transparent",
              color:c.primary, textDecoration:"none",
              fontFamily:SANS, fontWeight:700, fontSize:"15px", border:`2px solid ${c.border}`,
            }}><Download size={16} strokeWidth={2}/>Download Resume</a>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="Home" style={{
        minHeight:"100vh", display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:isMob?"100px 20px 72px":"120px 40px 80px",
        position:"relative", overflow:"hidden", background:c.bg, transition:"background .3s",
      }}>
        <div style={{ position:"absolute", width:isMob?360:800, height:isMob?360:800,
          borderRadius:"50%", top:"-15%", left:"-10%", pointerEvents:"none",
          background:`radial-gradient(circle,${c.dot} 0%,transparent 65%)` }}/>
        <div style={{ position:"absolute", width:isMob?260:600, height:isMob?260:600,
          borderRadius:"50%", bottom:"-10%", right:"-5%", pointerEvents:"none",
          background:`radial-gradient(circle,${c.dot} 0%,transparent 65%)` }}/>
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", opacity:dark?.35:.45,
          backgroundImage:`radial-gradient(circle,${c.dot} 1px,transparent 1px)`,
          backgroundSize:"32px 32px" }}/>

        {loaded && (
          <div style={{ position:"relative", zIndex:2, textAlign:"center",
            maxWidth:"820px", width:"100%" }}>

            <div className="he1" style={{ display:"inline-flex", alignItems:"center", gap:8,
              padding:"7px 18px", borderRadius:"100px", background:c.bg3,
              border:`1px solid ${c.border}`, marginBottom:"24px",
              fontFamily:MONO, fontSize:"11px", fontWeight:700, letterSpacing:"2px", color:c.primary }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:c.grad,
                animation:"pulse 2s ease-in-out infinite", display:"inline-block", flexShrink:0 }}/>
              Available for Opportunities
            </div>

            <h1 className="he2" style={{ fontFamily:DISPLAY,
              fontSize:"clamp(46px,11vw,112px)", fontWeight:900,
              letterSpacing:"-3px", lineHeight:.9, color:c.text, marginBottom:"18px" }}>
              Sushil<br/><G c={c} dark={dark}>Patil</G>
            </h1>

            <div className="he3" style={{ fontSize:"clamp(15px,3.5vw,28px)", fontWeight:700,
              minHeight:"38px", marginBottom:"22px", fontFamily:DISPLAY, color:c.textMd }}>
              <G c={c} dark={dark}>{typed}</G>
              <span style={{ display:"inline-block", width:2, height:"1em",
                background:c.primary, marginLeft:4, verticalAlign:"middle",
                animation:"blink 1s step-end infinite", borderRadius:2 }}/>
            </div>

            <p className="he4" style={{ fontFamily:SANS, fontSize:isMob?"15px":"18px",
              color:c.textSoft, lineHeight:1.85,
              maxWidth:"520px", margin:"0 auto 36px", padding:"0 4px" }}>
              Engineering large-scale enterprise apps with the MERN stack. Expert in
              microfrontend architecture, system design & high-performance web solutions.
            </p>

            <div className="he5 hero-btns" style={{ display:"flex", gap:"10px",
              flexWrap:"wrap", justifyContent:"center" }}>
              <a href="#Projects" className="btn-p" style={{
                padding:isMob?"13px 22px":"16px 34px", borderRadius:"13px",
                fontFamily:SANS, fontWeight:700, fontSize:"15px",
                background:c.grad, color:"#fff", textDecoration:"none",
                display:"inline-flex", alignItems:"center", gap:7,
                boxShadow:"0 12px 36px rgba(37,99,235,0.30)",
              }}>View Projects<ArrowRight size={16} strokeWidth={2.2}/></a>

              <a href="#Contact" className="btn-s" style={{
                padding:isMob?"13px 22px":"16px 34px", borderRadius:"13px",
                fontFamily:SANS, fontWeight:700, fontSize:"15px",
                background:c.gradSoft, color:c.primary, border:`1.5px solid ${c.border}`,
                textDecoration:"none", display:"inline-flex", alignItems:"center", gap:7,
              }}><Mail size={16} strokeWidth={2}/>Let's Connect</a>

              <a href={pdf} download="Resume.pdf" className="btn-s" style={{
                padding:isMob?"13px 22px":"16px 34px", borderRadius:"13px",
                fontFamily:SANS, fontWeight:700, fontSize:"15px",
                background:c.gradSoft, color:c.primary, border:`1.5px solid ${c.border}`,
                textDecoration:"none", display:"inline-flex", alignItems:"center", gap:7,
              }}><Download size={16} strokeWidth={2}/>Resume</a>
            </div>
          </div>
        )}

        <div ref={statsRef} className="stats-row" style={{
          marginTop:isMob?"52px":"96px", position:"relative", zIndex:2, width:"100%" }}>
          {STATS.map(st=><StatCard key={st.l} {...st} trigger={statsVis} c={c}/>)}
        </div>

        {!isMob && (
          <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)",
            display:"flex", flexDirection:"column", alignItems:"center", gap:6, opacity:.4, zIndex:2 }}>
            <span style={{ fontFamily:MONO, fontSize:"9px", letterSpacing:"3px",
              color:c.primary, textTransform:"uppercase" }}>scroll</span>
            <ChevronDown size={18} color={c.primary}
              style={{ animation:"float 2s ease-in-out infinite" }}/>
          </div>
        )}
      </section>

      {/* ── ABOUT ── */}
      <section id="About" style={{ background:c.bg2, padding:SEC,
        borderTop:`1px solid ${c.border}`, transition:"background .3s" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Reveal>
            <span style={SL}>Who I Am</span>
            <h2 style={SH}>About <G c={c} dark={dark}>Me</G></h2>
            <div style={SDV}/>
          </Reveal>
          <div className="about-grid">
            <Reveal delay={80}>
              {["I'm a Fullstack Developer with 2+ years of experience building large-scale enterprise applications. My core stack is MERN, and I specialise in scalable microfrontend architectures.",
                "Deep expertise in Next.js, NestJS, React Query, Redux, system design, and databases including MongoDB & MySQL.",
                "I care about clean architecture, developer experience, and shipping products that perform flawlessly at scale.",
              ].map((p,i)=>(
                <p key={i} style={{ fontFamily:SANS, fontSize:isMob?"15px":"17px",
                  color:c.textSoft, lineHeight:1.9, marginBottom:"20px",
                  paddingLeft:i===0?"18px":"0",
                  borderLeft:i===0?`3px solid ${c.primary}`:"none" }}>{p}</p>
              ))}
            </Reveal>
            <Reveal delay={200}>
              <div style={{ background:c.card, borderRadius:"20px",
                padding:isMob?"24px":"40px", border:`1px solid ${c.border}`,
                boxShadow:c.shadowMd, display:"flex", flexDirection:"column", gap:"18px",
                transition:"background .3s" }}>
                <div style={{ height:3, borderRadius:2, background:c.grad, marginBottom:2 }}/>
                {[
                  ["Location","Pune, India",           <MapPin    size={17} strokeWidth={1.8} color={c.primary}/>],
                  ["Role",    "Fullstack Developer",    <Briefcase size={17} strokeWidth={1.8} color={c.primary}/>],
                  ["Stack",   "MERN + Next.js + NestJS",<Zap      size={17} strokeWidth={1.8} color={c.primary}/>],
                  ["Email",   "sushilpatil562@gmail.com",<Mail    size={17} strokeWidth={1.8} color={c.primary}/>],
                  ["Status",  "Open to Opportunities",
                    <span style={{ width:10, height:10, borderRadius:"50%", background:"#22c55e",
                      display:"inline-block", animation:"pulse 2s ease-in-out infinite" }}/>],
                ].map(([lb,vl,ic])=>(
                  <div key={lb} style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                    <div style={{ width:40, height:40, borderRadius:"11px", flexShrink:0,
                      background:c.gradSoft, border:`1px solid ${c.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>{ic}</div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontFamily:MONO, fontSize:"10px", color:c.textSoft,
                        letterSpacing:"2px", textTransform:"uppercase" }}>{lb}</div>
                      <div style={{ fontFamily:SANS, fontSize:"14px", color:c.text,
                        fontWeight:600, marginTop:"2px",
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{vl}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="Experience" style={{ padding:SEC, background:c.bg,
        borderTop:`1px solid ${c.border}`, transition:"background .3s" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Reveal>
            <span style={SL}>Career Path</span>
            <h2 style={SH}>Work <G c={c} dark={dark}>Experience</G></h2>
            <div style={SDV}/>
          </Reveal>
          {EXP.map((e,i)=>(
            <Reveal key={e.id} delay={i*120}>
              <div className="exp-c" style={{ background:c.card, borderRadius:"18px",
                padding:isMob?"22px":"36px 40px", marginBottom:"16px",
                border:`1px solid ${c.border}`, boxShadow:c.shadow,
                transition:"background .3s" }}>
                <div className="exp-header" style={{ display:"flex",
                  justifyContent:"space-between", alignItems:"flex-start", gap:"12px" }}>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontFamily:DISPLAY, fontSize:isMob?"17px":"22px",
                      fontWeight:800, color:c.text, marginBottom:"5px" }}>{e.role}</div>
                    <div style={{ fontFamily:SANS, fontSize:"15px", fontWeight:600,
                      color:c.primary }}>{e.org}</div>
                    <div style={{ fontFamily:MONO, fontSize:"12px", color:c.textSoft,
                      marginTop:"5px", display:"flex", alignItems:"center", gap:5 }}>
                      <MapPin size={11} strokeWidth={2} color={c.textSoft}/>{e.loc}
                    </div>
                  </div>
                  <div className="exp-badges" style={{ display:"flex", flexDirection:"column",
                    alignItems:"flex-end", gap:"6px", flexShrink:0 }}>
                    <span style={{ padding:"5px 13px", borderRadius:"100px", fontFamily:MONO,
                      fontSize:"11px", fontWeight:700, background:c.gradSoft,
                      color:c.primary, border:`1px solid ${c.border}`, whiteSpace:"nowrap" }}>
                      {e.type}
                    </span>
                  </div>
                </div>
                <p style={{ fontFamily:SANS, fontSize:isMob?"14px":"15px", color:c.textSoft,
                  lineHeight:1.85, margin:"14px 0" }}>{e.desc}</p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                  {e.tech.map(t=><Chip key={t} c={c}>{t}</Chip>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="Skills" style={{ background:c.bg2, padding:SEC,
        borderTop:`1px solid ${c.border}`, transition:"background .3s" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Reveal>
            <span style={SL}>Tech Stack</span>
            <h2 style={SH}>Skills & <G c={c} dark={dark}>Expertise</G></h2>
            <div style={SDV}/>
          </Reveal>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"28px" }}>
            {cats.map(ct=>(
              <button key={ct} className="cat-b" onClick={()=>setCat(ct)} style={{
                padding:"7px 16px", borderRadius:"100px", fontFamily:MONO, fontSize:"11px",
                fontWeight:700, cursor:"pointer", outline:"none", letterSpacing:".5px",
                background: cat===ct ? c.gradSoft : c.card,
                color: cat===ct ? c.primary : c.textSoft,
                border: cat===ct ? `1px solid ${c.primary}50` : `1px solid ${c.border}`,
              }}>{ct}</button>
            ))}
          </div>
          <div className="sk-grid">
            {visSk.map((sk,i)=>(
              <Reveal key={sk.name} delay={i*28}>
                <div className="sk-c" style={{ background:c.card, borderRadius:"16px",
                  padding:"20px", border:`1px solid ${c.border}`, boxShadow:c.shadow,
                  transition:"background .3s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"center", marginBottom:"12px" }}>
                    <div style={{ width:40, height:40, borderRadius:"11px", background:c.gradSoft,
                      border:`1px solid ${c.border}`, display:"flex", alignItems:"center",
                      justifyContent:"center", color:c.primary }}>
                      <SkIcon cat={sk.cat}/>
                    </div>
                    <span style={{ fontFamily:MONO, fontSize:"18px", fontWeight:900,
                      color:c.primary }}>{sk.pct}</span>
                  </div>
                  <div style={{ fontFamily:SANS, fontSize:"13px", fontWeight:700,
                    color:c.text, marginBottom:"10px" }}>{sk.name}</div>
                  <div style={{ width:"100%", height:4, background:c.bg3, borderRadius:2 }}>
                    <div style={{ height:"100%", borderRadius:2, width:`${sk.pct}%`,
                      background:c.grad }}/>
                  </div>
                  <div style={{ fontFamily:MONO, fontSize:"9px", color:c.textSoft,
                    marginTop:"8px", letterSpacing:"2px", textTransform:"uppercase" }}>{sk.cat}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="Projects" style={{ background:c.bg, padding:SEC,
        borderTop:`1px solid ${c.border}`, transition:"background .3s" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Reveal>
            <span style={SL}>Selected Work</span>
            <h2 style={SH}>Featured <G c={c} dark={dark}>Projects</G></h2>
            <div style={SDV}/>
          </Reveal>
          <div className="proj-grid">
            {PROJECTS.map((p,i)=>(
              <Reveal key={p.key} delay={i*55}>
                <div className="proj-c" style={{ background:c.card, borderRadius:"18px",
                  padding:isMob?"22px":"30px", display:"flex", flexDirection:"column",
                  gap:"14px", height:"100%", border:`1px solid ${c.border}`,
                  boxShadow:c.shadow, transition:"background .3s" }}>
                  <div style={{ display:"flex", alignItems:"center" }}>
                    <div style={{ padding:"5px 13px", borderRadius:"9px", background:c.gradSoft,
                      border:`1px solid ${c.border}`, fontFamily:MONO, fontSize:"12px",
                      fontWeight:800, color:c.primary, flexShrink:0 }}>{p.num}</div>
                    <div style={{ height:2, flex:1, marginLeft:"12px",
                      background:`linear-gradient(90deg,${c.primary}40,transparent)`,
                      borderRadius:1 }}/>
                  </div>
                  <div style={{ fontFamily:DISPLAY, fontSize:isMob?"16px":"19px",
                    fontWeight:800, color:c.text }}>{p.title}</div>
                  <p style={{ fontFamily:SANS, fontSize:"13px", color:c.textSoft,
                    lineHeight:1.8, flex:1 }}>{p.desc}</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
                    {p.tech.map(t=><Chip key={t} c={c}>{t}</Chip>)}
                  </div>
                  <div style={{ display:"flex", gap:"8px", paddingTop:"12px",
                    borderTop:`1px solid ${c.border}` }}>
                    {p.live&&(
                      <a href={p.live} target="_blank" rel="noreferrer" style={{
                        padding:"9px 18px", borderRadius:"9px", fontFamily:SANS, fontSize:"13px",
                        fontWeight:700, background:c.grad, color:"#fff", textDecoration:"none",
                        display:"inline-flex", alignItems:"center", gap:6,
                        boxShadow:"0 6px 18px rgba(37,99,235,.22)",
                      }}><ExternalLink size={13} strokeWidth={2.2}/>Live</a>
                    )}
                    <a href={p.src} target="_blank" rel="noreferrer" style={{
                      padding:"9px 18px", borderRadius:"9px", fontFamily:SANS, fontSize:"13px",
                      fontWeight:700, background:c.gradSoft, color:c.primary,
                      border:`1px solid ${c.border}`, textDecoration:"none",
                      display:"inline-flex", alignItems:"center", gap:6,
                    }}><Github size={13} strokeWidth={2}/>Source</a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="Contact" style={{ background:c.bg2, padding:SEC,
        borderTop:`1px solid ${c.border}`, transition:"background .3s" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <Reveal>
            <span style={SL}>Get In Touch</span>
            <h2 style={SH}>Let's <G c={c} dark={dark}>Connect</G></h2>
            <div style={SDV}/>
          </Reveal>
          <div className="contact-grid">
            <Reveal delay={80}>
              <p style={{ fontFamily:SANS, fontSize:isMob?"15px":"17px",
                color:c.textSoft, lineHeight:1.9, marginBottom:"28px" }}>
                Open to fullstack roles, freelance projects, and exciting collaborations.
                If you have something interesting in mind — let's build it together.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                {SOCIALS.map(s=>(
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    className="soc-a" style={{ display:"flex", alignItems:"center",
                      gap:"14px", padding:"15px 18px", borderRadius:"13px",
                      background:c.card, border:`1px solid ${c.border}`,
                      color:c.text, textDecoration:"none", boxShadow:c.shadow,
                      transition:"background .3s" }}>
                    <div style={{ width:40, height:40, borderRadius:"11px",
                      background:c.gradSoft, border:`1px solid ${c.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      color:c.primary, flexShrink:0 }}>
                      {s.label==="LinkedIn" ? <Linkedin size={18} strokeWidth={1.8}/> :
                       s.label==="GitHub"   ? <Github   size={18} strokeWidth={1.8}/> :
                                              <Mail     size={18} strokeWidth={1.8}/>}
                    </div>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontFamily:SANS, fontSize:"14px", fontWeight:700,
                        color:c.text }}>{s.label}</div>
                      <div style={{ fontFamily:MONO, fontSize:"11px", color:c.textSoft,
                        marginTop:"2px", overflow:"hidden", textOverflow:"ellipsis",
                        whiteSpace:"nowrap" }}>{s.sub}</div>
                    </div>
                    <ArrowRight size={16} strokeWidth={2} color={c.primary}
                      style={{ marginLeft:"auto", flexShrink:0 }}/>
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div style={{ background:c.card, borderRadius:"20px",
                padding:isMob?"32px 24px":"48px 40px", textAlign:"center",
                border:`1px solid ${c.border}`, boxShadow:c.shadowLg,
                position:"relative", overflow:"hidden", transition:"background .3s" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:3,
                  background:c.grad, borderRadius:"20px 20px 0 0" }}/>
                <div style={{ fontSize:isMob?"52px":"68px", marginBottom:"18px",
                  display:"inline-block", animation:"float 4.5s ease-in-out infinite" }}>
                  👨‍💻
                </div>
                <p style={{ fontFamily:MONO, fontSize:"10px", color:c.textSoft,
                  marginBottom:"12px", letterSpacing:"2.5px", textTransform:"uppercase" }}>
                  drop me a line
                </p>
                <a href="mailto:sushilpatil562@gmail.com" style={{
                  fontFamily:DISPLAY, fontSize:isMob?"14px":"17px", fontWeight:800,
                  display:"block", marginBottom:"22px",
                  color:c.primary, textDecoration:"none", wordBreak:"break-all",
                }}>sushilpatil562@gmail.com</a>
                <div style={{ display:"inline-flex", alignItems:"center", gap:8,
                  padding:"8px 16px", borderRadius:"100px", background:c.bg3,
                  border:`1px solid ${c.border}`, fontFamily:MONO, fontSize:"11px", color:c.primary }}>
                  <span style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e",
                    animation:"pulse 2s ease-in-out infinite", flexShrink:0 }}/>
                  Usually responds within 24h
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${c.border}`,
        padding:isMob?"28px 20px":"40px 40px",
        textAlign:"center", background:c.bg, transition:"background .3s" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
          gap:10, marginBottom:12 }}>
          <Logo size={36} onClick={()=>window.scrollTo(0,0)}/>
          <div style={{ fontFamily:DISPLAY, fontSize:"20px", fontWeight:900,
            letterSpacing:"-0.5px", color:c.primary }}>Sushil Patil</div>
        </div>
        <p style={{ fontFamily:MONO, fontSize:"11px", color:c.textSoft,
          letterSpacing:"1.5px", marginBottom:"6px", textTransform:"uppercase" }}>
          Fullstack Developer · MERN Specialist · Pune, India
        </p>
        <p style={{ fontFamily:MONO, fontSize:"10px", color:c.border }}>
          © 2025 Sushil Patil — Designed & built with care
        </p>
      </footer>
    </>
  );
}