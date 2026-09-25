/* ================================================
   VEDANT BHOSALE PORTFOLIO — main.js
   ================================================ */
"use strict";

/* util */
function lerp(a,b,t){return a+(b-a)*t;}
function h2r(hex,a){
  const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
  return "rgba("+r+","+g+","+b+","+a+")";
}

/* ─── HERO NEURAL CANVAS ─── */
class HeroNet {
  constructor(el){
    this.c=el; this.x=el.getContext("2d");
    this.nodes=[]; this.mx=-9e9; this.my=-9e9;
    this._r=this._r.bind(this);
    window.addEventListener("resize",this._r);
    window.addEventListener("mousemove",e=>{this.mx=e.clientX;this.my=e.clientY;});
    this._r(); this._loop();
  }
  _r(){
    this.c.width=window.innerWidth;
    this.c.height=window.innerHeight;
    this.nodes=[];
    const pal=["#6366f1","#8b5cf6","#06b6d4","#818cf8","#a5b4fc"];
    const n=Math.min(60,Math.max(20,Math.floor(this.c.width*this.c.height/16000)));
    for(let i=0;i<n;i++) this.nodes.push({
      x:Math.random()*this.c.width, y:Math.random()*this.c.height,
      vx:(Math.random()-.5)*.35, vy:(Math.random()-.5)*.35,
      r:Math.random()*2.5+1.5, col:pal[i%pal.length]
    });
  }
  _loop(){
    const ctx=this.x, W=this.c.width, H=this.c.height;
    ctx.clearRect(0,0,W,H);
    const MAX=140, SPD=.5;
    this.nodes.forEach(n=>{
      const dx=this.mx-n.x, dy=this.my-n.y, d=Math.hypot(dx,dy);
      if(d<200&&d>0){n.vx+=(dx/d)*.003; n.vy+=(dy/d)*.003;}
      const sp=Math.hypot(n.vx,n.vy);
      if(sp>SPD){n.vx=(n.vx/sp)*SPD; n.vy=(n.vy/sp)*SPD;}
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<=0||n.x>=W)n.vx*=-1;
      if(n.y<=0||n.y>=H)n.vy*=-1;
      n.x=Math.max(0,Math.min(W,n.x));
      n.y=Math.max(0,Math.min(H,n.y));
    });
    for(let i=0;i<this.nodes.length;i++) for(let j=i+1;j<this.nodes.length;j++){
      const a=this.nodes[i],b=this.nodes[j],d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<MAX){ctx.globalAlpha=(1-d/MAX)*.12; ctx.strokeStyle="#6366f1"; ctx.lineWidth=.8; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();}
    }
    ctx.globalAlpha=1;
    this.nodes.forEach(n=>{
      ctx.beginPath();
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*4);
      g.addColorStop(0,n.col+"50"); g.addColorStop(1,n.col+"00");
      ctx.fillStyle=g; ctx.arc(n.x,n.y,n.r*4,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.fillStyle=n.col+"99"; ctx.arc(n.x,n.y,n.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(()=>this._loop());
  }
}

/* ─── TYPEWRITER ─── */
class TypeWriter {
  constructor(el,strings,ts=78,ds=40,pause=2200){
    this.el=el; this.str=strings; this.ts=ts; this.ds=ds; this.pause=pause;
    this.i=0; this.p=0; this.del=false; this._tick();
  }
  _tick(){
    const s=this.str[this.i];
    if(!this.del){
      this.p++; this.el.textContent=s.slice(0,this.p);
      if(this.p>=s.length){this.del=true; setTimeout(()=>this._tick(),this.pause); return;}
      setTimeout(()=>this._tick(),this.ts);
    } else {
      this.p--; this.el.textContent=s.slice(0,this.p);
      if(this.p<=0){this.del=false; this.i=(this.i+1)%this.str.length; setTimeout(()=>this._tick(),380); return;}
      setTimeout(()=>this._tick(),this.ds);
    }
  }
}

/* ─── SKILLS NEURAL GRAPH ─── */
class SkillsGraph {
  constructor(el){
    this.c=el; this.x=el.getContext("2d");
    this.activeId=null; this.nodes=[]; this.t=0;
    this.baseH=460; this.H=460; this.targetH=460;
    this.CATS=[
      {id:"backend",label:"Backend",col:"#6366f1",ang:-90,
       skills:["Node.js","Express","FastAPI","PostgreSQL","MySQL","Prisma","JWT Auth","REST APIs"]},
      {id:"ai",label:"AI / ML",col:"#8b5cf6",ang:-18,
       skills:["OpenCV","YOLOv8","InsightFace","LangChain","FAISS","RAG","Scikit-learn","Hugging Face"]},
      {id:"frontend",label:"Frontend",col:"#06b6d4",ang:54,
       skills:["React.js","Next.js","JavaScript","HTML & CSS","Tailwind CSS"]},
      {id:"devops",label:"DevOps",col:"#10b981",ang:126,
       skills:["Docker","Redis","BullMQ","Git","GitHub","Linux","Render"]},
      {id:"xr",label:"XR / Tools",col:"#f59e0b",ang:198,
       skills:["Unity","Meta XR SDK","C#","Python","Java","VS Code"]}
    ];
    this._resize(); window.addEventListener("resize",()=>this._resize());
    el.addEventListener("click",e=>this._click(e));
    el.addEventListener("mousemove",e=>this._move(e));
    this._loop();
  }
  _resize(){
    const rect=this.c.parentElement.getBoundingClientRect();
    this.W=rect.width;
    this.c.width=this.W; this.c.height=this.H;
    this.c.style.width=this.W+"px"; this.c.style.height=this.H+"px";
    this.cx=this.W/2; this.cy=this.baseH/2;
    this.R=Math.min(this.cx*.62,this.cy*.62,165);
    this._build();
  }
  _build(){
    this.nodes=[{x:this.cx,y:this.cy,r:34,baseR:34,targetR:34,label:"VEDANT",isCenter:true,col:"#6366f1",pulse:0,alpha:1,targetAlpha:1}];
    this.CATS.forEach(cat=>{
      const rad=cat.ang*Math.PI/180;
      const bx=this.cx+this.R*Math.cos(rad);
      const by=this.cy+this.R*Math.sin(rad);
      this.nodes.push({
        x:bx, y:by, bx, by, tx:bx, ty:by,
        r:27, baseR:27, targetR:27, label:cat.label, cat, isCategory:true,
        col:cat.col, pulse:Math.random()*6.28, active:false, hovered:false, alpha:1, targetAlpha:1
      });
    });
  }
  _skills(){return this.nodes.filter(n=>n.isSkill);}
  _cats(){return this.nodes.filter(n=>n.isCategory);}
  _click(e){
    const {mx,my}=this._mp(e);
    for(const n of this._cats()){
      const hitR=Math.max(n.r+14,24);
      if(Math.hypot(mx-n.x,my-n.y)<hitR){this._toggle(n);return;}
    }
    this._clear();
  }
  _toggle(node){
    if(node.active){this._clear();return;}
    this._clear();
    node.active=true;
    this.activeId=node.cat.id;
    this._updateCatStates();
    this._spawn(node);
  }
  _clear(){
    this.nodes=this.nodes.filter(n=>!n.isSkill);
    this._cats().forEach(n=>{n.active=false;n.hovered=false;});
    this.activeId=null;
    this.targetH=this.baseH;
    this._updateCatStates();
  }
  _updateCatStates(){
    this._cats().forEach(n=>{
      if(!this.activeId){
        n.targetR=n.baseR;
        n.targetAlpha=1;
        n.tx=n.bx; n.ty=n.by;
      } else if(n.active){
        n.targetR=34;
        n.targetAlpha=1;
        const rad=n.cat.ang*Math.PI/180;
        n.tx=this.cx+(this.R+10)*Math.cos(rad);
        n.ty=this.cy+(this.R+10)*Math.sin(rad);
      } else {
        n.targetR=15;
        n.targetAlpha=0.35;
        const rad=n.cat.ang*Math.PI/180;
        n.tx=this.cx+(this.R*0.75)*Math.cos(rad);
        n.ty=this.cy+(this.R*0.75)*Math.sin(rad);
      }
    });
  }
  _spawn(catNode){
    const sk=catNode.cat.skills;
    const toC=Math.atan2(this.cy-catNode.y,this.cx-catNode.x);
    // Radiate skills OUTWARDS away from the central name node
    const away=toC+Math.PI;
    const spread=Math.PI*0.85;

    let minY=Infinity, maxY=-Infinity;

    sk.forEach((s,i)=>{
      const f=sk.length===1?0:(i/(sk.length-1))-.5;
      const ang=away+f*spread;
      const dist=(i%2===0)?95:155;
      let tx=catNode.tx+dist*Math.cos(ang);
      let ty=catNode.ty+dist*Math.sin(ang);

      tx=Math.max(70,Math.min(this.W-70,tx));

      if(ty < minY) minY = ty;
      if(ty > maxY) maxY = ty;

      this.nodes.push({
        x:catNode.x, y:catNode.y, tx, ty,
        label:s, isSkill:true, parent:catNode,
        col:catNode.col, a:0, pulse:Math.random()*6.28
      });
    });

    // Calculate dynamic box height expansion if skills extend beyond base container
    let reqTop = Math.max(0, 40 - minY);
    let reqBot = Math.max(0, maxY + 40 - this.baseH);
    let extraH = Math.max(reqTop, reqBot) * 1.6;
    this.targetH = Math.min(620, Math.max(this.baseH, this.baseH + extraH));
  }
  _move(e){
    const {mx,my}=this._mp(e); let hov=false;
    for(const n of this._cats()){
      const hitR=Math.max(n.r+10,20);
      n.hovered=Math.hypot(mx-n.x,my-n.y)<hitR;
      if(n.hovered) hov=true;
    }
    this.c.style.cursor=hov?"pointer":"default";
    const tip=document.getElementById("skill-tooltip");
    const hCat=this._cats().find(n=>n.hovered);
    if(hCat&&tip){
      tip.textContent=hCat.active?hCat.label+" skills (click to close)":"Click to explore "+hCat.label;
      tip.style.left=mx+"px"; tip.style.top=(my-18)+"px";
      tip.classList.remove("hidden");
    } else if(tip) tip.classList.add("hidden");
  }
  _mp(e){const r=this.c.getBoundingClientRect(); return{mx:e.clientX-r.left,my:e.clientY-r.top};}
  _loop(){
    // Smoothly animate canvas and box height
    if(Math.abs(this.H - this.targetH) > 0.5){
      this.H = lerp(this.H, this.targetH, 0.1);
      const roundedH = Math.round(this.H);
      this.c.height = roundedH;
      this.c.style.height = roundedH + "px";
      if(this.c.parentElement) this.c.parentElement.style.height = roundedH + "px";
    }

    this.x.clearRect(0,0,this.W,this.H); this.t+=.016;

    // Smooth category transitions
    this._cats().forEach(n=>{
      n.r=lerp(n.r,n.targetR,0.1);
      n.alpha=lerp(n.alpha,n.targetAlpha,0.1);
      n.x=lerp(n.x,n.tx,0.1);
      n.y=lerp(n.y,n.ty,0.1);
      n.pulse+=.018;
    });

    // Skill pills interpolation & repulsion
    const skills=this._skills();
    skills.forEach(n=>{
      n.x=lerp(n.x,n.tx,0.14);
      n.y=lerp(n.y,n.ty,0.14);
      n.a=Math.min(1,n.a+.06);
      n.pulse+=.02;
    });

    const padX=75, padY=30;
    for(let i=0;i<skills.length;i++){
      for(let j=i+1;j<skills.length;j++){
        const a=skills[i], b=skills[j];
        const dx=b.x-a.x, dy=b.y-a.y;
        const d=Math.hypot(dx,dy);
        const minDist=64;
        if(d<minDist && d>0){
          const overlap=(minDist-d)*0.5;
          const nx=dx/d, ny=dy/d;
          a.tx-=nx*overlap*0.2; a.ty-=ny*overlap*0.2;
          b.tx+=nx*overlap*0.2; b.ty+=ny*overlap*0.2;
        }
      }
    }

    // Clamp horizontally inside container
    skills.forEach(n=>{
      n.tx=Math.max(padX,Math.min(this.W-padX,n.tx));
      n.x=Math.max(padX,Math.min(this.W-padX,n.x));
      n.ty=Math.max(padY,Math.min(this.H-padY,n.ty));
      n.y=Math.max(padY,Math.min(this.H-padY,n.y));
    });

    if(this.nodes[0]) this.nodes[0].pulse+=.022;
    this._edges();
    this.nodes.forEach(n=>this._drawNode(n));
    requestAnimationFrame(()=>this._loop());
  }
  _edges(){
    const ctx=this.x, C=this.nodes[0];
    this._cats().forEach(cat=>{
      const baseAlpha=cat.alpha;
      const a=cat.active?.8:.25*baseAlpha;
      const pulse=a+Math.sin(this.t*1.8+cat.pulse)*.06;
      const g=ctx.createLinearGradient(C.x,C.y,cat.x,cat.y);
      g.addColorStop(0,h2r("#6366f1",pulse)); g.addColorStop(1,h2r(cat.col,pulse));
      ctx.beginPath(); ctx.strokeStyle=g; ctx.lineWidth=cat.active?2.8:1.2;
      if(!cat.active)ctx.setLineDash([5,8]); ctx.moveTo(C.x,C.y); ctx.lineTo(cat.x,cat.y); ctx.stroke(); ctx.setLineDash([]);
      if(cat.active){
        const p=(this.t*.45)%1;
        const px=lerp(C.x,cat.x,p),py=lerp(C.y,cat.y,p);
        ctx.beginPath(); ctx.fillStyle=h2r(cat.col,.9); ctx.arc(px,py,4,0,Math.PI*2); ctx.fill();
      }
    });
    this._skills().forEach(sk=>{
      ctx.globalAlpha=sk.a*.65; ctx.beginPath(); ctx.strokeStyle=sk.col; ctx.lineWidth=1.2; ctx.setLineDash([3,6]);
      ctx.moveTo(sk.parent.x,sk.parent.y); ctx.lineTo(sk.x,sk.y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha=1;
    });
  }
  _drawNode(n){
    const ctx=this.x;
    if(n.isSkill){ctx.globalAlpha=n.a; this._pill(n); ctx.globalAlpha=1; return;}
    ctx.globalAlpha=n.alpha||1;
    const pulse=Math.sin(n.pulse)*.08;
    const r=n.r*(1+pulse*(n.isCenter?.8:.4));
    if(n.active||n.hovered||n.isCenter){ctx.shadowColor=n.col; ctx.shadowBlur=n.isCenter?28:18;}
    ctx.beginPath();
    if(n.isCenter){
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,r);
      g.addColorStop(0,"#818cf8"); g.addColorStop(1,"#4f46e5"); ctx.fillStyle=g;
    } else if(n.active){
      const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,r);
      g.addColorStop(0,n.col); g.addColorStop(1,h2r(n.col,0.85)); ctx.fillStyle=g;
    } else {
      ctx.fillStyle="rgba(255,255,255,.9)";
    }
    ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.fill();
    if(!n.isCenter){ctx.strokeStyle=n.col; ctx.lineWidth=n.active?2.5:1.8; ctx.stroke();}
    if((n.hovered||n.active)&&!n.isCenter){
      ctx.beginPath(); ctx.strokeStyle=h2r(n.col,.25); ctx.lineWidth=8; ctx.arc(n.x,n.y,r+10,0,Math.PI*2); ctx.stroke();
    }
    ctx.shadowBlur=0;
    // Hide text if category node is tiny
    if(n.r>18||n.isCenter){
      ctx.font=(n.isCenter?"700 12px": (n.active?"700 12px":"600 11px"))+" Inter,sans-serif";
      ctx.fillStyle=(n.active||n.isCenter)?"white":n.col;
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText(n.label,n.x,n.y);
    }
    ctx.globalAlpha=1;
  }
  _pill(n){
    const ctx=this.x; ctx.font="600 11px Inter,sans-serif";
    const tw=ctx.measureText(n.label).width, pw=tw+20, ph=24;
    const px=n.x-pw/2, py=n.y-ph/2, rad=12;
    ctx.beginPath();
    ctx.fillStyle="rgba(255,255,255,0.92)";
    ctx.strokeStyle=h2r(n.col,.75); ctx.lineWidth=1.5;
    ctx.shadowColor=h2r(n.col,0.3); ctx.shadowBlur=8;
    ctx.moveTo(px+rad,py); ctx.lineTo(px+pw-rad,py); ctx.arcTo(px+pw,py,px+pw,py+rad,rad);
    ctx.lineTo(px+pw,py+ph-rad); ctx.arcTo(px+pw,py+ph,px+pw-rad,py+ph,rad);
    ctx.lineTo(px+rad,py+ph); ctx.arcTo(px,py+ph,px,py+ph-rad,rad);
    ctx.lineTo(px,py+rad); ctx.arcTo(px,py,px+rad,py,rad); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur=0;
    ctx.fillStyle="#0f172a"; ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText(n.label,n.x,n.y);
  }
}

/* ─── SCROLL REVEAL ─── */
function initReveal(){
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const d=parseInt(e.target.dataset.revealDelay||0);
      setTimeout(()=>e.target.classList.add("revealed"),d);
      obs.unobserve(e.target);
    });
  },{threshold:.1,rootMargin:"0px 0px -40px 0px"});
  document.querySelectorAll("[data-reveal]").forEach(el=>obs.observe(el));
}

/* ─── COUNTERS ─── */
function initCounters(){
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting)return;
      const el=e.target;
      const raw=el.textContent;
      const suffix=raw.includes("+")?"+":(raw.includes("-")?"-":"");
      const num=parseFloat(raw.replace(/[^\d.]/g,""));
      if(isNaN(num))return;
      const isF=String(num).includes("."), dec=isF?String(num).split(".")[1].length:0;
      const start=performance.now();
      function update(now){
        const p=Math.min((now-start)/1400,1);
        const ease=1-Math.pow(1-p,3);
        el.textContent=(isF?(ease*num).toFixed(dec):Math.floor(ease*num))+suffix;
        if(p<1)requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      obs.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll(".stat-num").forEach(el=>obs.observe(el));
}

/* ─── NAVBAR ─── */
function initNav(){
  const nav=document.getElementById("navbar");
  const ham=document.getElementById("hamburger");
  const links=document.getElementById("nav-links");
  window.addEventListener("scroll",()=>nav.classList.toggle("scrolled",window.scrollY>60));
  ham?.addEventListener("click",()=>{links.classList.toggle("open");ham.classList.toggle("active");});
  links?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{links.classList.remove("open");ham.classList.remove("active");}));
  document.getElementById("nav-hire-btn")?.addEventListener("click",()=>document.getElementById("contact").scrollIntoView({behavior:"smooth"}));
}

/* ─── PROGRESS BAR ─── */
function initProgress(){
  const bar=document.createElement("div");
  bar.id="progress-bar";
  document.body.prepend(bar);
  window.addEventListener("scroll",()=>{
    const total=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(window.scrollY/total*100)+"%";
  });
}

/* ─── CUSTOM CURSOR ─── */
function initCursor(){
  if(window.matchMedia("(pointer:coarse)").matches)return;
  const glow=document.createElement("div"); glow.className="cursor-glow";
  const dot=document.createElement("div"); dot.className="cursor-dot";
  document.body.append(glow,dot);
  let mx=0,my=0,gx=0,gy=0;
  document.addEventListener("mousemove",e=>{mx=e.clientX;my=e.clientY;dot.style.cssText="left:"+mx+"px;top:"+my+"px;";});
  document.querySelectorAll("a,button,.glass-card,#skills-canvas").forEach(el=>{
    el.addEventListener("mouseenter",()=>glow.classList.add("big"));
    el.addEventListener("mouseleave",()=>glow.classList.remove("big"));
  });
  function animG(){gx=lerp(gx,mx,.1);gy=lerp(gy,my,.1);glow.style.cssText="left:"+gx+"px;top:"+gy+"px;";requestAnimationFrame(animG);}
  animG();
}

/* ─── PROJECT TILT ─── */
function initTilt(){
  document.querySelectorAll(".proj-card").forEach(card=>{
    card.addEventListener("mousemove",e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform="perspective(900px) rotateY("+(x*7)+"deg) rotateX("+(-y*7)+"deg) translateY(-6px)";
      card.style.transition="none";
    });
    card.addEventListener("mouseleave",()=>{card.style.transform="";card.style.transition="all .4s cubic-bezier(0.4,0,0.2,1)";});
  });
}

/* ─── CONTACT FORM — SUPABASE ─── */
// SETUP:
// 1. Go to supabase.com and create a free project
// 2. Run in SQL editor:
//    CREATE TABLE contact_messages (
//      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
//      name TEXT NOT NULL, email TEXT NOT NULL,
//      subject TEXT, message TEXT NOT NULL,
//      created_at TIMESTAMPTZ DEFAULT NOW()
//    );
//    ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
//    CREATE POLICY "Allow anon insert" ON contact_messages FOR INSERT TO anon WITH CHECK (true);
// 3. Replace YOUR_SUPABASE_URL and YOUR_SUPABASE_ANON_KEY below

const SB_URL = "YOUR_SUPABASE_URL";
const SB_KEY = "YOUR_SUPABASE_ANON_KEY";

function initForm(){
  const form=document.getElementById("contact-form");
  const btn=document.getElementById("submit-btn");
  const ok=document.getElementById("form-success");
  const err=document.getElementById("form-error");
  if(!form)return;
  form.addEventListener("submit",async e=>{
    e.preventDefault();
    btn.disabled=true; btn.textContent="Sending...";
    ok.classList.add("hidden"); err.classList.add("hidden");
    const payload={
      name:document.getElementById("contact-name").value.trim(),
      email:document.getElementById("contact-email").value.trim(),
      subject:document.getElementById("contact-subject").value.trim(),
      message:document.getElementById("contact-message").value.trim()
    };
    try{
      if(SB_URL.startsWith("YOUR_")){await new Promise(r=>setTimeout(r,1200));}
      else{
        const res=await fetch(SB_URL+"/rest/v1/contact_messages",{
          method:"POST",
          headers:{"Content-Type":"application/json","apikey":SB_KEY,"Authorization":"Bearer "+SB_KEY,"Prefer":"return=minimal"},
          body:JSON.stringify(payload)
        });
        if(!res.ok)throw new Error("HTTP "+res.status);
      }
      ok.classList.remove("hidden"); form.reset();
    }catch{err.classList.remove("hidden");}
    finally{btn.disabled=false; btn.textContent="Send Message";}
  });
}

/* ─── BOOT ─── */
document.addEventListener("DOMContentLoaded",()=>{
  initProgress();
  initNav();
  initCursor();
  initReveal();
  initCounters();
  initTilt();
  initForm();

  /* Hero canvas */
  const hc=document.getElementById("neural-canvas");
  if(hc)new HeroNet(hc);

  /* Typewriter */
  const tw=document.getElementById("typewriter-text");
  if(tw)new TypeWriter(tw,["Backend Engineer","AI / Computer Vision Dev","Full-Stack Builder","VR Developer","RAG Pipeline Builder","SaaS Architect"]);

  /* Skills graph — lazy init */
  const skillSec=document.getElementById("skills");
  const sObs=new IntersectionObserver(([entry])=>{
    if(entry.isIntersecting){
      const sc=document.getElementById("skills-canvas");
      if(sc&&!sc._init){new SkillsGraph(sc); sc._init=true;}
      sObs.disconnect();
    }
  },{rootMargin:"200px"});
  if(skillSec)sObs.observe(skillSec);
});
