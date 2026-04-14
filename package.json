import { useState, useEffect } from "react";
import {
  signInWithPopup, signOut, onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword
} from "firebase/auth";
import {
  doc, getDoc, setDoc, collection,
  onSnapshot, addDoc, updateDoc, deleteDoc, query, where
} from "firebase/firestore";
import { auth, googleProvider, db } from "./firebase";

/* ─────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────── */
const CATEGORIES = [
  { name: "Rent/Mortgage", icon: "🏠" },
  { name: "Groceries", icon: "🛒" },
  { name: "Utilities", icon: "⚡" },
  { name: "Transport", icon: "🚗" },
  { name: "Eating Out", icon: "🍽️" },
  { name: "Subscriptions", icon: "📱" },
  { name: "AI Subscriptions", icon: "🤖" },
  { name: "Shopping", icon: "🛍️" },
  { name: "Health", icon: "💊" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Cash Savings", icon: "🏦" },
  { name: "Cash ISA", icon: "💵" },
  { name: "Investment ISA", icon: "📈" },
  { name: "Pension", icon: "🏛️" },
  { name: "Crypto", icon: "₿" },
  { name: "Credit Card", icon: "💳" },
  { name: "Loans", icon: "🏦" },
  { name: "Home Insurance", icon: "🏡" },
  { name: "Car Insurance", icon: "🚘" },
  { name: "Life Insurance", icon: "❤️" },
  { name: "Health Insurance", icon: "🩺" },
  { name: "Pet Insurance", icon: "🐾" },
  { name: "Holiday Fund", icon: "✈️" },
  { name: "Pets", icon: "🐾" },
  { name: "Other", icon: "📌" },
];

const TABS = ["shared", "you", "partner", "summary"];

const THEMES = {
  gold:     { accent: "#D4A843", accentDim: "rgba(212,168,67,0.10)",  accentGlow: "rgba(212,168,67,0.25)",  label: "Gold",     emoji: "🟡" },
  blue:     { accent: "#5B9ED4", accentDim: "rgba(91,158,212,0.10)",  accentGlow: "rgba(91,158,212,0.25)",  label: "Blue",     emoji: "🔵" },
  green:    { accent: "#7BC4A5", accentDim: "rgba(123,196,165,0.10)", accentGlow: "rgba(123,196,165,0.25)", label: "Green",    emoji: "🟢" },
  red:      { accent: "#D45B5B", accentDim: "rgba(212,91,91,0.10)",   accentGlow: "rgba(212,91,91,0.25)",   label: "Red",      emoji: "🔴" },
  purple:   { accent: "#B98FD4", accentDim: "rgba(185,143,212,0.10)", accentGlow: "rgba(185,143,212,0.25)", label: "Purple",   emoji: "🟣" },
};

const BASE_C = {
  bg: "#0E0E0E", surface: "#181816", card: "#1F1F1C",
  border: "#2C2C28", text: "#EDE9DF", textSoft: "#9B978D",
  sage: "#7BC4A5", sageDim: "rgba(123,196,165,0.10)",
  lavender: "#B98FD4", lavenderDim: "rgba(185,143,212,0.10)",
  danger: "#D45B5B",
};

const CAT_COLORS = [
  "#D4A843","#7BC4A5","#B98FD4","#D45B5B","#5B9ED4",
  "#D4845B","#5BD4A0","#D45B9E","#A0D45B","#5B5BD4",
  "#D4C25B","#5BD4D4","#D48FA0","#8FD4D4","#C4D45B",
];

const display = "'Cormorant Garamond', serif";
const body    = "'Outfit', sans-serif";

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }
function fmt(n) { return "£" + Math.abs(n).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

/* ─────────────────────────────────────────
   SHARED UI PRIMITIVES
───────────────────────────────────────── */
function Overlay({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position:"fixed",inset:0,zIndex:200,
      background:"rgba(0,0,0,0.65)",backdropFilter:"blur(10px)",
      display:"flex",alignItems:"flex-end",justifyContent:"center",
      animation:"overlayIn .25s ease",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:BASE_C.surface,width:"100%",maxWidth:480,
        borderRadius:"28px 28px 0 0",padding:"28px 24px 36px",
        borderTop:`1px solid ${BASE_C.border}`,
        maxHeight:"88vh",overflowY:"auto",
        animation:"sheetUp .3s ease",
      }}>{children}</div>
    </div>
  );
}

function Label({ children }) {
  return <div style={{color:BASE_C.textSoft,fontSize:12,fontFamily:body,marginBottom:6,letterSpacing:0.5}}>{children}</div>;
}

function Input({ prefix, style, accent, ...props }) {
  const ac = accent || THEMES.gold.accent;
  return (
    <div style={{position:"relative",marginBottom:14}}>
      {prefix && <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:BASE_C.textSoft,fontSize:15,fontFamily:body}}>{prefix}</span>}
      <input {...props} style={{
        width:"100%",background:BASE_C.card,border:`1px solid ${BASE_C.border}`,
        borderRadius:14,padding:prefix?"12px 14px 12px 30px":"12px 14px",
        color:BASE_C.text,fontSize:15,fontFamily:body,
        outline:"none",boxSizing:"border-box",transition:"border-color .2s",...style,
      }}
        onFocus={e=>e.target.style.borderColor=ac}
        onBlur={e=>e.target.style.borderColor=BASE_C.border}
      />
    </div>
  );
}

function Btn({ children, color, style, ...props }) {
  return (
    <button {...props} style={{
      background:color,color:BASE_C.bg,border:"none",
      borderRadius:14,padding:"14px 20px",
      fontSize:15,fontFamily:body,fontWeight:600,
      cursor:"pointer",transition:"opacity .2s",...style,
    }}>{children}</button>
  );
}

function FadeIn({ children, delay=0, style={} }) {
  const [vis,setVis] = useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVis(true),delay);return()=>clearTimeout(t);},[delay]);
  return (
    <div style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(12px)",transition:"opacity .35s ease, transform .35s ease",...style}}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────
   SVG CHARTS
───────────────────────────────────────── */
function DonutChart({ segments, size=160, thickness=28, label, sublabel }) {
  const [hovered,setHovered] = useState(null);
  const r=(size-thickness)/2, cx=size/2, cy=size/2, circ=2*Math.PI*r;
  const total=segments.reduce((s,seg)=>s+seg.value,0);
  if(total===0) return null;
  let offset=0;
  const slices=segments.map((seg,i)=>{
    const pct=seg.value/total, dash=pct*circ, gap=circ-dash;
    const s={...seg,dash,gap,offset:offset*circ,index:i};
    offset+=pct; return s;
  });
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
        {slices.map((s,i)=>(
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={hovered===i?s.color:s.color+"CC"}
            strokeWidth={hovered===i?thickness+4:thickness}
            strokeDasharray={`${s.dash} ${s.gap}`}
            strokeDashoffset={-s.offset}
            style={{cursor:"pointer",transition:"stroke-width .2s, stroke .2s"}}
            onMouseEnter={()=>setHovered(i)} onMouseLeave={()=>setHovered(null)}
          />
        ))}
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
        {hovered!==null?(
          <>
            <div style={{color:segments[hovered].color,fontSize:13,fontFamily:body,fontWeight:600}}>{segments[hovered].label}</div>
            <div style={{color:BASE_C.text,fontSize:16,fontFamily:display,fontWeight:700}}>{fmt(segments[hovered].value)}</div>
            <div style={{color:BASE_C.textSoft,fontSize:11,fontFamily:body}}>{Math.round((segments[hovered].value/total)*100)}%</div>
          </>
        ):(
          <>
            <div style={{color:BASE_C.textSoft,fontSize:10,fontFamily:body,textTransform:"uppercase",letterSpacing:0.5}}>{sublabel}</div>
            <div style={{color:BASE_C.text,fontSize:18,fontFamily:display,fontWeight:700}}>{label}</div>
          </>
        )}
      </div>
    </div>
  );
}

function PieChart({ segments, size=160, onSelect, selected }) {
  const cx=size/2, cy=size/2, r=size/2-8;
  const total=segments.reduce((s,seg)=>s+seg.value,0);
  if(total===0) return null;
  function polarToXY(angle,radius){
    return{x:cx+radius*Math.cos(angle-Math.PI/2),y:cy+radius*Math.sin(angle-Math.PI/2)};
  }
  let startAngle=0;
  const slices=segments.map((seg,i)=>{
    const angle=(seg.value/total)*2*Math.PI, endAngle=startAngle+angle;
    const largeArc=angle>Math.PI?1:0;
    const start=polarToXY(startAngle,r), end=polarToXY(endAngle,r);
    const midAngle=startAngle+angle/2;
    const s={...seg,startAngle,endAngle,largeArc,start,end,midAngle,index:i};
    startAngle=endAngle; return s;
  });
  return (
    <svg width={size} height={size}>
      {slices.map((s,i)=>{
        const isSelected=selected===s.label, scale=isSelected?1.06:1;
        return (
          <g key={i} onClick={()=>onSelect(isSelected?null:s.label)} style={{cursor:"pointer"}}
            transform={`translate(${cx},${cy}) scale(${scale}) translate(${-cx},${-cy})`}>
            <path
              d={`M ${cx} ${cy} L ${s.start.x} ${s.start.y} A ${r} ${r} 0 ${s.largeArc} 1 ${s.end.x} ${s.end.y} Z`}
              fill={isSelected?s.color:s.color+"BB"} stroke={BASE_C.bg} strokeWidth={2}
              style={{transition:"transform .2s, fill .2s"}}
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────
   AUTH / LANDING PAGE
───────────────────────────────────────── */
function AuthPage({ onAuth }) {
  const [mode, setMode]       = useState("login"); // login | signup
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true); setError("");
    try { await signInWithPopup(auth, googleProvider); }
    catch(e){ setError("Google sign-in failed. Please try again."); }
    setLoading(false);
  }

  async function handleEmail() {
    setLoading(true); setError("");
    try {
      if(mode==="signup") await createUserWithEmailAndPassword(auth,email,password);
      else await signInWithEmailAndPassword(auth,email,password);
    } catch(e) {
      if(e.code==="auth/email-already-in-use") setError("An account with this email already exists.");
      else if(e.code==="auth/user-not-found"||e.code==="auth/wrong-password") setError("Incorrect email or password.");
      else if(e.code==="auth/weak-password") setError("Password must be at least 6 characters.");
      else if(e.code==="auth/invalid-email") setError("Please enter a valid email address.");
      else setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight:"100vh",background:BASE_C.bg,display:"flex",
      flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"24px",fontFamily:body,
    }}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <h1 style={{fontFamily:display,fontSize:42,fontWeight:700,color:BASE_C.text,letterSpacing:-1}}>
            Home<span style={{color:THEMES.gold.accent}}>Budget</span>
          </h1>
          <p style={{color:BASE_C.textSoft,fontSize:14,marginTop:8}}>Track your household committed spend</p>
        </div>

        <div style={{background:BASE_C.card,borderRadius:24,padding:28,border:`1px solid ${BASE_C.border}`}}>
          {/* Google sign-in */}
          <button onClick={handleGoogle} disabled={loading} style={{
            width:"100%",background:BASE_C.surface,border:`1px solid ${BASE_C.border}`,
            borderRadius:14,padding:"13px 20px",color:BASE_C.text,
            fontSize:15,fontFamily:body,fontWeight:500,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",gap:10,
            marginBottom:20,transition:"border-color .2s",
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
            <div style={{flex:1,height:1,background:BASE_C.border}}/>
            <span style={{color:BASE_C.textSoft,fontSize:12}}>or</span>
            <div style={{flex:1,height:1,background:BASE_C.border}}/>
          </div>

          <Label>Email</Label>
          <Input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com" accent={THEMES.gold.accent}/>
          <Label>Password</Label>
          <Input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="••••••••" accent={THEMES.gold.accent}/>

          {error && <div style={{color:BASE_C.danger,fontSize:13,marginBottom:12,fontFamily:body}}>{error}</div>}

          <Btn color={THEMES.gold.accent} onClick={handleEmail} style={{width:"100%",marginBottom:14}} disabled={loading}>
            {loading ? "Please wait…" : mode==="login" ? "Sign In" : "Create Account"}
          </Btn>

          <div style={{textAlign:"center",color:BASE_C.textSoft,fontSize:13}}>
            {mode==="login"?(
              <>No account? <span onClick={()=>{setMode("signup");setError("");}} style={{color:THEMES.gold.accent,cursor:"pointer"}}>Sign up</span></>
            ):(
              <>Have an account? <span onClick={()=>{setMode("login");setError("");}} style={{color:THEMES.gold.accent,cursor:"pointer"}}>Sign in</span></>
            )}
          </div>
        </div>

        <p style={{color:BASE_C.textSoft,fontSize:11,textAlign:"center",marginTop:20,lineHeight:1.6}}>
          Your data is private and only accessible to members of your household.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SETTINGS MODAL
───────────────────────────────────────── */
function SettingsModal({ settings, onSave, onClose, onSignOut, themeKey, onThemeChange }) {
  const [s,setS] = useState({...settings});
  const [tk,setTk] = useState(themeKey);
  const accent = THEMES[tk].accent;

  return (
    <Overlay onClose={onClose}>
      <div style={{marginBottom:24}}>
        <h2 style={{fontFamily:display,fontSize:24,color:BASE_C.text,margin:0}}>Settings</h2>
        <p style={{color:BASE_C.textSoft,fontSize:13,margin:"6px 0 0"}}>Names, income & preferences</p>
      </div>

      <Label>Your Name</Label>
      <Input value={s.nameYou} onChange={e=>setS({...s,nameYou:e.target.value})} placeholder="e.g. Andy" accent={accent}/>
      <Label>Partner's Name</Label>
      <Input value={s.namePartner} onChange={e=>setS({...s,namePartner:e.target.value})} placeholder="e.g. Sarah" accent={accent}/>
      <Label>Your Monthly Income (after tax)</Label>
      <Input type="number" value={s.incomeYou} onChange={e=>setS({...s,incomeYou:e.target.value})} placeholder="0.00" prefix="£" accent={accent}/>
      <Label>Partner's Monthly Income (after tax)</Label>
      <Input type="number" value={s.incomePartner} onChange={e=>setS({...s,incomePartner:e.target.value})} placeholder="0.00" prefix="£" accent={accent}/>

      <Label>Default Shared Split (Your %)</Label>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
        <input type="range" min={0} max={100} value={s.defaultSplit}
          onChange={e=>setS({...s,defaultSplit:parseInt(e.target.value)})}
          style={{flex:1,accentColor:accent}}/>
        <span style={{color:BASE_C.text,fontFamily:body,fontSize:14,minWidth:72,textAlign:"right"}}>
          {s.defaultSplit}% / {100-s.defaultSplit}%
        </span>
      </div>

      <Label>Colour Theme</Label>
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {Object.entries(THEMES).map(([key,theme])=>(
          <button key={key} onClick={()=>setTk(key)} style={{
            flex:1,padding:"10px 4px",borderRadius:12,cursor:"pointer",
            background:tk===key?theme.accentDim:BASE_C.card,
            border:tk===key?`2px solid ${theme.accent}`:`1px solid ${BASE_C.border}`,
            display:"flex",flexDirection:"column",alignItems:"center",gap:4,
          }}>
            <div style={{width:18,height:18,borderRadius:"50%",background:theme.accent}}/>
            <span style={{color:tk===key?theme.accent:BASE_C.textSoft,fontSize:10,fontFamily:body}}>{theme.label}</span>
          </button>
        ))}
      </div>

      <Btn color={accent} onClick={()=>{onSave(s);onThemeChange(tk);onClose();}} style={{width:"100%",marginBottom:10}}>
        Save Settings
      </Btn>
      <button onClick={onSignOut} style={{
        width:"100%",background:"none",border:`1px solid ${BASE_C.border}`,
        borderRadius:14,padding:"12px",color:BASE_C.textSoft,
        fontSize:14,fontFamily:body,cursor:"pointer",
      }}>Sign Out</button>
    </Overlay>
  );
}

/* ─────────────────────────────────────────
   ADD / EDIT EXPENSE MODAL
───────────────────────────────────────── */
function ExpenseModal({ tab, settings, onSave, onClose, existing, accent }) {
  const isEdit = !!existing;
  const [desc,setDesc]         = useState(existing?.desc??"");
  const [amount,setAmount]     = useState(existing?.amount?.toString()??"");
  const [amountMode,setAmountMode] = useState("£"); // "£" or "%"
  const [cat,setCat]           = useState(existing?.category??"Other");
  const [paidBy,setPaidBy]     = useState(existing?.paidBy??"you");
  const [youAmt,setYouAmt]     = useState("");
  const [partnerAmt,setPartnerAmt] = useState("");

  const nameYou     = settings.nameYou    || "You";
  const namePartner = settings.namePartner || "Partner";
  const incYou      = parseFloat(settings.incomeYou)     || 0;
  const incPartner  = parseFloat(settings.incomePartner) || 0;
  const combinedIncome = incYou + incPartner;

  // Resolve actual £ amount from input
  const totalVal = amountMode === "£"
    ? (parseFloat(amount) || 0)
    : (combinedIncome > 0 ? (parseFloat(amount) || 0) / 100 * combinedIncome : 0);

  const youVal     = parseFloat(youAmt)     || 0;
  const partnerVal = parseFloat(partnerAmt) || 0;
  const splitPctYou     = totalVal>0 ? Math.round((youVal/totalVal)*100)     : 0;
  const splitPctPartner = totalVal>0 ? Math.round((partnerVal/totalVal)*100) : 0;

  useEffect(()=>{
    const val = parseFloat(existing?.amount)||0;
    if(tab==="shared"&&val>0){
      const pct=existing?existing.splitYou/100:settings.defaultSplit/100;
      setYouAmt((val*pct).toFixed(2));
      setPartnerAmt((val*(1-pct)).toFixed(2));
    }
  },[]);

  useEffect(()=>{
    if(tab==="shared"&&totalVal>0&&!isEdit){
      const defPct=settings.defaultSplit/100;
      setYouAmt((totalVal*defPct).toFixed(2));
      setPartnerAmt((totalVal*(1-defPct)).toFixed(2));
    }
  },[amount,amountMode]);

  function handleYouAmtChange(val){
    setYouAmt(val);
    const v=parseFloat(val)||0;
    if(totalVal>0) setPartnerAmt(Math.max(0,totalVal-v).toFixed(2));
  }
  function handlePartnerAmtChange(val){
    setPartnerAmt(val);
    const v=parseFloat(val)||0;
    if(totalVal>0) setYouAmt(Math.max(0,totalVal-v).toFixed(2));
  }

  function submit(){
    if(!desc.trim()||totalVal<=0) return;
    const finalSplitYou=tab==="shared"
      ?(totalVal>0?Math.round((youVal/totalVal)*100):50)
      :(tab==="you"?100:0);
    onSave({
      id:existing?.id??uid(),
      desc:desc.trim(),amount:totalVal,category:cat,tab,
      splitYou:finalSplitYou,paidBy:tab==="shared"?paidBy:tab,
      date:existing?.date??new Date().toISOString(),
    });
    onClose();
  }

  return (
    <Overlay onClose={onClose}>
      <div style={{marginBottom:20}}>
        <h2 style={{fontFamily:display,fontSize:24,color:BASE_C.text,margin:0}}>
          {isEdit?"Edit":"Add"} Expense
        </h2>
      </div>

      <Label>Description</Label>
      <Input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="e.g. Netflix" autoFocus accent={accent}/>

      <Label>Amount</Label>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {/* Mode toggle — only shown for shared tab */}
        {tab==="shared"&&(
          <div style={{display:"flex",background:BASE_C.card,borderRadius:12,border:`1px solid ${BASE_C.border}`,overflow:"hidden",flexShrink:0}}>
            {["£","%"].map(m=>(
              <button key={m} onClick={()=>setAmountMode(m)} style={{
                padding:"0 16px",height:"100%",border:"none",cursor:"pointer",
                background:amountMode===m?accent:BASE_C.card,
                color:amountMode===m?BASE_C.bg:BASE_C.textSoft,
                fontSize:14,fontFamily:body,fontWeight:600,transition:"all .2s",
              }}>{m}</button>
            ))}
          </div>
        )}
        <div style={{position:"relative",flex:1}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:BASE_C.textSoft,fontSize:15,fontFamily:body}}>
            {amountMode==="£"?"£":"%"}
          </span>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)}
            placeholder={amountMode==="%"?"e.g. 10":"0.00"}
            style={{
              width:"100%",background:BASE_C.card,border:`1px solid ${BASE_C.border}`,
              borderRadius:14,padding:"12px 14px 12px 30px",
              color:BASE_C.text,fontSize:15,fontFamily:body,
              outline:"none",boxSizing:"border-box",
            }}
            onFocus={e=>e.target.style.borderColor=accent}
            onBlur={e=>e.target.style.borderColor=BASE_C.border}
          />
        </div>
      </div>

      {/* Show resolved £ amount when in % mode */}
      {tab==="shared"&&amountMode==="%"&&totalVal>0&&(
        <div style={{color:BASE_C.textSoft,fontSize:13,fontFamily:body,marginTop:-8,marginBottom:14}}>
          = {fmt(totalVal)} of {fmt(combinedIncome)} combined income
        </div>
      )}

      <Label>Category</Label>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
        {CATEGORIES.map(c=>(
          <button key={c.name} onClick={()=>setCat(c.name)} style={{
            background:cat===c.name?accent:BASE_C.card,
            color:cat===c.name?BASE_C.bg:BASE_C.textSoft,
            border:"none",borderRadius:20,padding:"6px 12px",
            fontSize:12,fontFamily:body,cursor:"pointer",transition:"all .2s",
          }}>{c.icon} {c.name}</button>
        ))}
      </div>

      {tab==="shared"&&(
        <>
          <Label>Split</Label>
          <div style={{background:BASE_C.card,borderRadius:16,padding:16,marginBottom:16,border:`1px solid ${BASE_C.border}`}}>
            {[{name:nameYou,amt:youAmt,color:BASE_C.sage,pct:splitPctYou,onChange:handleYouAmtChange},
              {name:namePartner,amt:partnerAmt,color:BASE_C.lavender,pct:splitPctPartner,onChange:handlePartnerAmtChange}
            ].map((row,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:i===0?10:0}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:row.color,flexShrink:0}}/>
                <span style={{color:BASE_C.textSoft,fontSize:13,fontFamily:body,minWidth:60}}>{row.name}</span>
                <div style={{position:"relative",flex:1}}>
                  <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:BASE_C.textSoft,fontSize:14}}>£</span>
                  <input type="number" value={row.amt} onChange={e=>row.onChange(e.target.value)} style={{
                    width:"100%",background:BASE_C.surface,border:`1px solid ${BASE_C.border}`,
                    borderRadius:10,padding:"10px 10px 10px 26px",
                    color:row.color,fontSize:15,fontFamily:body,fontWeight:600,
                    outline:"none",boxSizing:"border-box",
                  }}/>
                </div>
                <span style={{color:row.color,fontSize:13,fontFamily:body,fontWeight:600,minWidth:40,textAlign:"right"}}>{row.pct}%</span>
              </div>
            ))}
            {totalVal>0&&(
              <div style={{display:"flex",height:4,borderRadius:2,overflow:"hidden",marginTop:12,background:BASE_C.bg}}>
                <div style={{width:`${splitPctYou}%`,background:BASE_C.sage,transition:"width .3s ease"}}/>
                <div style={{width:`${splitPctPartner}%`,background:BASE_C.lavender,transition:"width .3s ease"}}/>
              </div>
            )}
          </div>

          <Label>Paid By</Label>
          <div style={{display:"flex",gap:8,marginBottom:16}}>
            {["you","partner"].map(p=>(
              <button key={p} onClick={()=>setPaidBy(p)} style={{
                flex:1,background:paidBy===p?accent:BASE_C.card,
                color:paidBy===p?BASE_C.bg:BASE_C.textSoft,
                border:"none",borderRadius:12,padding:"10px 0",
                fontSize:13,fontFamily:body,cursor:"pointer",
                fontWeight:paidBy===p?600:400,
              }}>{p==="you"?nameYou:namePartner}</button>
            ))}
          </div>
        </>
      )}

      <div style={{display:"flex",gap:8,marginTop:4}}>
        {isEdit&&(
          <Btn color={BASE_C.danger} style={{flex:"0 0 auto",padding:"14px 18px"}}
            onClick={()=>{onSave(null);onClose();}}>Delete</Btn>
        )}
        <Btn color={accent} onClick={submit} style={{flex:1}}>
          {isEdit?"Save Changes":"Add Expense"}
        </Btn>
      </div>
    </Overlay>
  );
}

/* ─────────────────────────────────────────
   EXPENSE CARD
───────────────────────────────────────── */
function ExpenseCard({ exp, settings, onEdit, accent }) {
  const catObj    = CATEGORIES.find(c=>c.name===exp.category)||CATEGORIES[CATEGORIES.length-1];
  const nameYou   = settings.nameYou    || "You";
  const namePartner = settings.namePartner || "Partner";
  const youPortion    = exp.amount*(exp.splitYou/100);
  const partnerPortion = exp.amount*((100-exp.splitYou)/100);
  const d = new Date(exp.date);
  const dateStr = d.toLocaleDateString("en-GB",{day:"numeric",month:"short"});

  const tabColor = exp.tab==="you" ? BASE_C.sage : exp.tab==="partner" ? BASE_C.lavender : accent;
  const tabDim   = exp.tab==="you" ? BASE_C.sageDim : exp.tab==="partner" ? BASE_C.lavenderDim : `${accent}18`;

  let incPct=null;
  if(exp.tab==="you"){
    const inc=parseFloat(settings.incomeYou)||0;
    if(inc>0) incPct=((exp.amount/inc)*100).toFixed(1);
  } else if(exp.tab==="partner"){
    const inc=parseFloat(settings.incomePartner)||0;
    if(inc>0) incPct=((exp.amount/inc)*100).toFixed(1);
  }

  return (
    <div onClick={onEdit} style={{
      background:BASE_C.card,borderRadius:16,padding:"14px 16px",
      marginBottom:8,borderLeft:`3px solid ${tabColor}`,
      cursor:"pointer",transition:"background .15s",
    }}
      onMouseEnter={e=>e.currentTarget.style.background="#272724"}
      onMouseLeave={e=>e.currentTarget.style.background=BASE_C.card}
    >
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:40,height:40,borderRadius:12,background:tabDim,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
          {catObj.icon}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{color:BASE_C.text,fontSize:14,fontFamily:body,fontWeight:500,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{exp.desc}</div>
          <div style={{color:BASE_C.textSoft,fontSize:11,fontFamily:body,marginTop:2}}>{catObj.name} · {dateStr}</div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{color:BASE_C.text,fontSize:16,fontFamily:body,fontWeight:600}}>{fmt(exp.amount)}</div>
          {incPct!==null&&(
            <div style={{color:tabColor,fontSize:11,fontFamily:body,marginTop:1}}>{incPct}% of income</div>
          )}
        </div>
        <div style={{color:BASE_C.textSoft,fontSize:11,opacity:0.4,paddingLeft:4}}>✎</div>
      </div>

      {exp.tab==="shared"&&(
        <div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${BASE_C.border}`,display:"flex",gap:12}}>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:BASE_C.sage}}/>
            <span style={{color:BASE_C.textSoft,fontSize:11,fontFamily:body}}>{nameYou}</span>
            <span style={{color:BASE_C.sage,fontSize:13,fontFamily:body,fontWeight:600,marginLeft:"auto"}}>{fmt(youPortion)}</span>
            <span style={{color:BASE_C.textSoft,fontSize:10,fontFamily:body}}>{exp.splitYou}%</span>
          </div>
          <div style={{width:1,background:BASE_C.border}}/>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:BASE_C.lavender}}/>
            <span style={{color:BASE_C.textSoft,fontSize:11,fontFamily:body}}>{namePartner}</span>
            <span style={{color:BASE_C.lavender,fontSize:13,fontFamily:body,fontWeight:600,marginLeft:"auto"}}>{fmt(partnerPortion)}</span>
            <span style={{color:BASE_C.textSoft,fontSize:10,fontFamily:body}}>{100-exp.splitYou}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   SUMMARY TAB
───────────────────────────────────────── */
function SummaryTab({ expenses, settings, accent }) {
  const [selectedCat,setSelectedCat] = useState(null);
  const nameYou     = settings.nameYou    || "You";
  const namePartner = settings.namePartner || "Partner";
  const incYou      = parseFloat(settings.incomeYou)     || 0;
  const incPartner  = parseFloat(settings.incomePartner) || 0;
  const totalHouseholdIncome = incYou+incPartner;

  let spentYou=0,spentPartner=0,totalShared=0,sharedYouPortion=0,sharedPartnerPortion=0;
  expenses.forEach(e=>{
    if(e.tab==="you") spentYou+=e.amount;
    else if(e.tab==="partner") spentPartner+=e.amount;
    else if(e.tab==="shared"){
      totalShared+=e.amount;
      sharedYouPortion+=e.amount*(e.splitYou/100);
      sharedPartnerPortion+=e.amount*((100-e.splitYou)/100);
    }
  });

  const totalYouOwes    = spentYou+sharedYouPortion;
  const totalPartnerOwes = spentPartner+sharedPartnerPortion;
  const totalHousehold  = totalYouOwes+totalPartnerOwes;
  const remainYou       = incYou-totalYouOwes;
  const remainPartner   = incPartner-totalPartnerOwes;
  const remainHousehold = totalHouseholdIncome-totalHousehold;

  const byCat={};
  expenses.forEach(e=>{
    if(!byCat[e.category]) byCat[e.category]={shared:0,personal:0,total:0};
    if(e.tab==="shared") byCat[e.category].shared+=e.amount;
    else byCat[e.category].personal+=e.amount;
    byCat[e.category].total+=e.amount;
  });
  const catEntries=Object.entries(byCat).sort((a,b)=>b[1].total-a[1].total);

  const donutSegments=[
    {label:nameYou,value:totalYouOwes,color:BASE_C.sage},
    {label:namePartner,value:totalPartnerOwes,color:BASE_C.lavender},
  ].filter(s=>s.value>0);

  const pieSegments=catEntries.map(([name,vals],i)=>({
    label:name, value:vals.total, color:CAT_COLORS[i%CAT_COLORS.length],
  }));

  const filteredCatEntries=selectedCat?catEntries.filter(([n])=>n===selectedCat):catEntries;

  return (
    <div style={{padding:"0 4px"}}>
      <FadeIn>
        <div style={{background:`linear-gradient(135deg, ${BASE_C.card} 0%, ${BASE_C.surface} 100%)`,borderRadius:20,padding:24,marginBottom:12,border:`1px solid ${BASE_C.border}`}}>
          <div style={{color:BASE_C.textSoft,fontSize:11,fontFamily:body,letterSpacing:1,textTransform:"uppercase",marginBottom:8}}>Household Total Spend</div>
          <div style={{color:BASE_C.text,fontSize:36,fontFamily:display,fontWeight:700}}>{fmt(totalHousehold)}</div>
          <div style={{color:remainHousehold>=0?BASE_C.sage:BASE_C.danger,fontSize:14,fontFamily:body,marginTop:4}}>
            {remainHousehold>=0?fmt(remainHousehold)+" remaining":fmt(remainHousehold)+" over budget"}
          </div>
          {totalHouseholdIncome>0&&(
            <div style={{marginTop:14,height:6,borderRadius:3,background:BASE_C.bg,overflow:"hidden"}}>
              <div style={{height:"100%",borderRadius:3,width:`${Math.min((totalHousehold/totalHouseholdIncome)*100,100)}%`,background:totalHousehold>totalHouseholdIncome?BASE_C.danger:`linear-gradient(90deg, ${accent}, ${BASE_C.sage})`,transition:"width .6s ease"}}/>
            </div>
          )}
        </div>
      </FadeIn>

      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {[{name:nameYou,total:totalYouOwes,remain:remainYou,color:BASE_C.sage},{name:namePartner,total:totalPartnerOwes,remain:remainPartner,color:BASE_C.lavender}].map((p,i)=>(
          <FadeIn key={i} delay={80+i*60} style={{flex:1}}>
            <div style={{background:BASE_C.card,borderRadius:16,padding:"18px 16px",borderTop:`3px solid ${p.color}`}}>
              <div style={{color:BASE_C.textSoft,fontSize:11,fontFamily:body}}>{p.name}</div>
              <div style={{color:BASE_C.text,fontSize:22,fontFamily:display,fontWeight:700,margin:"4px 0"}}>{fmt(p.total)}</div>
              <div style={{color:p.remain>=0?BASE_C.sage:BASE_C.danger,fontSize:12,fontFamily:body}}>{p.remain>=0?fmt(p.remain)+" left":fmt(p.remain)+" over"}</div>
            </div>
          </FadeIn>
        ))}
      </div>

      {expenses.length>0&&(
        <FadeIn delay={180}>
          <div style={{background:BASE_C.card,borderRadius:16,padding:"20px 16px",marginBottom:12,border:`1px solid ${BASE_C.border}`}}>
            <div style={{color:BASE_C.textSoft,fontSize:11,fontFamily:body,letterSpacing:1,textTransform:"uppercase",marginBottom:16}}>Spend Breakdown</div>
            <div style={{display:"flex",gap:12,alignItems:"center",justifyContent:"space-around"}}>
              {donutSegments.length>0&&(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                  <DonutChart segments={donutSegments} size={148} thickness={26} label={fmt(totalHousehold)} sublabel="Total"/>
                  <div style={{display:"flex",gap:12}}>
                    {donutSegments.map((s,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:4}}>
                        <div style={{width:6,height:6,borderRadius:"50%",background:s.color}}/>
                        <span style={{color:BASE_C.textSoft,fontSize:10,fontFamily:body}}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {pieSegments.length>0&&(
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
                  <PieChart segments={pieSegments} size={148} onSelect={setSelectedCat} selected={selectedCat}/>
                  <div style={{color:BASE_C.textSoft,fontSize:10,fontFamily:body,textAlign:"center"}}>
                    {selectedCat
                      ?<span style={{color:accent}}>Showing: {selectedCat} · <span onClick={()=>setSelectedCat(null)} style={{cursor:"pointer",textDecoration:"underline"}}>clear</span></span>
                      :"Tap a slice to filter"}
                  </div>
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      )}

      <FadeIn delay={240}>
        <div style={{background:BASE_C.card,borderRadius:16,padding:"18px 16px",marginBottom:12}}>
          <div style={{color:BASE_C.textSoft,fontSize:11,fontFamily:body,letterSpacing:1,textTransform:"uppercase",marginBottom:14}}>Shared vs Personal</div>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {[{label:"Shared",val:totalShared,color:accent},{label:"Personal",val:spentYou+spentPartner,color:BASE_C.sage}].map((row,i)=>(
              <div key={i} style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:row.color}}/>
                  <span style={{color:BASE_C.textSoft,fontSize:12,fontFamily:body}}>{row.label}</span>
                </div>
                <div style={{color:BASE_C.text,fontSize:20,fontFamily:display,fontWeight:700}}>{fmt(row.val)}</div>
              </div>
            ))}
          </div>
          {(totalShared+spentYou+spentPartner)>0&&(
            <div style={{display:"flex",height:6,borderRadius:3,overflow:"hidden",background:BASE_C.bg}}>
              <div style={{width:`${(totalShared/(totalShared+spentYou+spentPartner))*100}%`,background:accent,transition:"width .5s ease"}}/>
              <div style={{width:`${(spentYou/(totalShared+spentYou+spentPartner))*100}%`,background:BASE_C.sage,transition:"width .5s ease"}}/>
              <div style={{width:`${(spentPartner/(totalShared+spentYou+spentPartner))*100}%`,background:BASE_C.lavender,transition:"width .5s ease"}}/>
            </div>
          )}
        </div>
      </FadeIn>

      {catEntries.length>0&&(
        <FadeIn delay={300}>
          <div style={{background:BASE_C.card,borderRadius:16,padding:"18px 16px",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div style={{color:BASE_C.textSoft,fontSize:11,fontFamily:body,letterSpacing:1,textTransform:"uppercase"}}>By Category</div>
              {selectedCat&&(
                <button onClick={()=>setSelectedCat(null)} style={{background:`${accent}18`,border:"none",borderRadius:8,padding:"3px 10px",color:accent,fontSize:11,fontFamily:body,cursor:"pointer"}}>
                  Clear filter ✕
                </button>
              )}
            </div>
            {filteredCatEntries.map(([name,vals])=>{
              const catObj=CATEGORIES.find(c=>c.name===name)||CATEGORIES[CATEGORIES.length-1];
              const total=vals.total, maxTotal=catEntries[0][1].total;
              const colorIdx=catEntries.findIndex(([n])=>n===name);
              const sliceColor=CAT_COLORS[colorIdx%CAT_COLORS.length];
              return (
                <div key={name} style={{marginBottom:12,opacity:selectedCat&&selectedCat!==name?0.35:1,transition:"opacity .2s"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{color:BASE_C.text,fontSize:13,fontFamily:body}}>{catObj.icon} {name}</span>
                    <span style={{color:BASE_C.text,fontSize:13,fontFamily:body,fontWeight:600}}>{fmt(total)}</span>
                  </div>
                  <div style={{height:4,borderRadius:2,background:BASE_C.bg,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:2,width:`${(total/maxTotal)*100}%`,background:sliceColor,transition:"width .5s ease"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function App() {
  const [user,setUser]         = useState(undefined); // undefined = loading
  const [tab,setTab]           = useState("shared");
  const [expenses,setExpenses] = useState([]);
  const [settings,setSettings] = useState({nameYou:"",namePartner:"",incomeYou:"",incomePartner:"",defaultSplit:50});
  const [themeKey,setThemeKey] = useState("gold");
  const [showAdd,setShowAdd]   = useState(false);
  const [showSettings,setShowSettings] = useState(false);
  const [editingExp,setEditingExp]     = useState(null);

  const accent    = THEMES[themeKey].accent;
  const accentDim = THEMES[themeKey].accentDim;
  const accentGlow= THEMES[themeKey].accentGlow;

  // Auth listener
  useEffect(()=>{
    const unsub=onAuthStateChanged(auth,u=>setUser(u||null));
    return unsub;
  },[]);

  // Load settings + theme from Firestore
  useEffect(()=>{
    if(!user) return;
    const ref=doc(db,"households",user.uid);
    getDoc(ref).then(snap=>{
      if(snap.exists()){
        const d=snap.data();
        if(d.settings) setSettings(d.settings);
        if(d.themeKey)  setThemeKey(d.themeKey);
      }
    });
  },[user]);

  // Listen to expenses in real time
  useEffect(()=>{
    if(!user) return;
    const q=query(collection(db,"expenses"),where("uid","==",user.uid));
    const unsub=onSnapshot(q,snap=>{
      const exps=snap.docs.map(d=>({id:d.id,...d.data()}));
      exps.sort((a,b)=>new Date(b.date)-new Date(a.date));
      setExpenses(exps);
    });
    return unsub;
  },[user]);

  async function saveExpense(exp){
    if(!user) return;
    if(exp===null){
      // Delete
      if(editingExp?.id) await deleteDoc(doc(db,"expenses",editingExp.id));
    } else if(editingExp){
      // Update
      const {id,...rest}=exp;
      await updateDoc(doc(db,"expenses",id),{...rest,uid:user.uid});
    } else {
      // Add
      await addDoc(collection(db,"expenses"),{...exp,uid:user.uid});
    }
  }

  async function saveSettings(s){
    setSettings(s);
    if(!user) return;
    await setDoc(doc(db,"households",user.uid),{settings:s,themeKey},{merge:true});
  }

  async function handleThemeChange(tk){
    setThemeKey(tk);
    if(!user) return;
    await setDoc(doc(db,"households",user.uid),{themeKey:tk},{merge:true});
  }

  async function handleSignOut(){
    await signOut(auth);
    setExpenses([]);
    setSettings({nameYou:"",namePartner:"",incomeYou:"",incomePartner:"",defaultSplit:50});
    setThemeKey("gold");
  }

  // Loading state
  if(user===undefined){
    return (
      <div style={{minHeight:"100vh",background:BASE_C.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{color:BASE_C.textSoft,fontFamily:body,fontSize:14}}>Loading…</div>
      </div>
    );
  }

  // Not signed in
  if(user===null) return <AuthPage onAuth={setUser}/>;

  const tabMeta={
    shared:{label:"Shared",icon:"⇄",color:accent,   dim:accentDim},
    you:   {label:"You",   icon:"◉",color:BASE_C.sage,   dim:BASE_C.sageDim},
    partner:{label:"Partner",icon:"◎",color:BASE_C.lavender,dim:BASE_C.lavenderDim},
    summary:{label:"Summary",icon:"∑",color:accent,  dim:accentDim},
  };

  const nameYou     = settings.nameYou    || "You";
  const namePartner = settings.namePartner || "Partner";
  const labels={shared:"Shared",you:nameYou,partner:namePartner,summary:"Summary"};
  const tabExpenses=expenses.filter(e=>e.tab===tab);

  return (
    <>
      <style>{`
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        @keyframes sheetUp { from{transform:translateY(40px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes fabPulse { 0%,100%{box-shadow:0 4px 20px ${accentGlow}} 50%{box-shadow:0 4px 30px ${accentGlow}, 0 0 40px ${accentDim}} }
        input[type=range]{height:4px}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
        input[type=number]{-moz-appearance:textfield}
      `}</style>

      <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",fontFamily:body,color:BASE_C.text,background:BASE_C.bg,paddingBottom:100}}>

        {/* Header */}
        <div style={{padding:"20px 20px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <h1 style={{fontFamily:display,fontSize:28,fontWeight:700,color:BASE_C.text,letterSpacing:-0.5}}>
              Home<span style={{color:accent}}>Budget</span>
            </h1>
            <p style={{color:BASE_C.textSoft,fontSize:12,fontFamily:body,marginTop:2}}>{nameYou} & {namePartner}</p>
          </div>
          <button onClick={()=>setShowSettings(true)} style={{background:BASE_C.card,border:`1px solid ${BASE_C.border}`,borderRadius:12,width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:18,color:BASE_C.textSoft}}>⚙</button>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:4,padding:"0 20px 16px",overflowX:"auto"}}>
          {TABS.map(t=>{
            const active=tab===t, meta=tabMeta[t];
            return (
              <button key={t} onClick={()=>setTab(t)} style={{
                flex:1,padding:"10px 4px",
                background:active?meta.dim:"transparent",
                border:active?`1px solid ${meta.color}33`:"1px solid transparent",
                borderRadius:14,cursor:"pointer",transition:"all .25s ease",
                display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              }}>
                <span style={{fontSize:16}}>{meta.icon}</span>
                <span style={{fontSize:11,fontFamily:body,color:active?meta.color:BASE_C.textSoft,fontWeight:active?600:400,whiteSpace:"nowrap"}}>{labels[t]}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{padding:"0 16px"}}>
          {tab==="summary"?(
            <SummaryTab expenses={expenses} settings={settings} accent={accent}/>
          ):(
            <>
              <FadeIn key={tab+"-total"}>
                <div style={{background:BASE_C.card,borderRadius:16,padding:"18px 20px",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center",borderLeft:`3px solid ${tabMeta[tab].color}`}}>
                  <div>
                    <div style={{color:BASE_C.textSoft,fontSize:11,letterSpacing:0.5,textTransform:"uppercase"}}>{labels[tab]} Expenses</div>
                    <div style={{color:BASE_C.text,fontSize:28,fontFamily:display,fontWeight:700,marginTop:2}}>
                      {fmt(tabExpenses.reduce((s,e)=>s+e.amount,0))}
                    </div>
                  </div>
                  <div style={{color:BASE_C.textSoft,fontSize:12,background:tabMeta[tab].dim,borderRadius:10,padding:"6px 12px"}}>
                    {tabExpenses.length} item{tabExpenses.length!==1?"s":""}
                  </div>
                </div>
              </FadeIn>

              {tabExpenses.length===0?(
                <FadeIn>
                  <div style={{textAlign:"center",padding:"48px 20px",color:BASE_C.textSoft,fontSize:14}}>
                    <div style={{fontSize:36,marginBottom:12,opacity:0.4}}>{tabMeta[tab].icon}</div>
                    No {labels[tab].toLowerCase()} expenses yet.<br/>Tap + to add one.
                  </div>
                </FadeIn>
              ):(
                tabExpenses.map((exp,i)=>(
                  <FadeIn key={exp.id} delay={i*40}>
                    <ExpenseCard exp={exp} settings={settings} accent={accent} onEdit={()=>setEditingExp(exp)}/>
                  </FadeIn>
                ))
              )}
            </>
          )}
        </div>

        {/* FAB */}
        {tab!=="summary"&&(
          <button onClick={()=>setShowAdd(true)} style={{
            position:"fixed",bottom:28,right:"calc(50% - 28px)",
            width:56,height:56,borderRadius:"50%",
            background:`linear-gradient(135deg, ${accent}, ${accent}CC)`,
            color:BASE_C.bg,fontSize:28,fontWeight:300,
            border:"none",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            animation:"fabPulse 3s ease infinite",zIndex:50,
          }}>+</button>
        )}

        {/* Modals */}
        {showSettings&&(
          <SettingsModal
            settings={settings} onSave={saveSettings}
            onClose={()=>setShowSettings(false)}
            onSignOut={handleSignOut}
            themeKey={themeKey} onThemeChange={handleThemeChange}
          />
        )}
        {showAdd&&(
          <ExpenseModal
            tab={tab} settings={settings} accent={accent}
            onSave={saveExpense} onClose={()=>setShowAdd(false)} existing={null}
          />
        )}
        {editingExp&&(
          <ExpenseModal
            tab={editingExp.tab} settings={settings} accent={accent}
            onSave={saveExpense} onClose={()=>setEditingExp(null)} existing={editingExp}
          />
        )}
      </div>
    </>
  );
}
