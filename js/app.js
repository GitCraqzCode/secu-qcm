/* =========================================================
   SECU3 Quiz — moteur de l'application
   ========================================================= */
'use strict';

/* ── Identifiants stables ──────────────────────────────── */
(function(){ const n={}; QUESTIONS.forEach(q=>{ n[q.c]=(n[q.c]||0); q.id=q.c+'-'+n[q.c]++; }); })();
BONUS.forEach((q,i)=>{ q.id='x-'+i; q.bonus=true; });
const QBY = {}; QUESTIONS.concat(BONUS).forEach(q=>QBY[q.id]=q);
const CH = {}; CHAPTERS.forEach(c=>CH[c.id]=c);

/* ── Constantes de jeu ─────────────────────────────────── */
const KEY = 'secu3_quiz_v1';
const BOXES = [10*60e3, 24*36e5, 3*24*36e5, 7*24*36e5, 16*24*36e5, 40*24*36e5];
const BADGES = [
  {id:'first',  em:'🌱', t:'Premier pas',      d:'1 question'},
  {id:'c100',   em:'💯', t:'Centurion',        d:'100 réponses'},
  {id:'c250',   em:'🚀', t:'Marathonien',      d:'250 réponses'},
  {id:'combo10',em:'🔥', t:'Série de 10',      d:'10 d’affilée'},
  {id:'combo25',em:'⚡', t:'Série de 25',      d:'25 d’affilée'},
  {id:'exam16', em:'🎖️', t:'Mention',          d:'16/20 à un examen'},
  {id:'perfect',em:'👑', t:'Sans faute',       d:'100 % à un examen'},
  {id:'rev50',  em:'🔁', t:'Réviseur',         d:'50 révisions'},
  {id:'days3',  em:'📅', t:'Assidu',           d:'3 jours de suite'},
  {id:'seenall',em:'🗺️', t:'Explorateur',      d:'Les 40 questions vues'},
  {id:'flash40',em:'🃏', t:'Par cœur',         d:'40 cartes retournées'},
  {id:'ctrl1',  em:'📝', t:'Le vrai contrôle', d:'Contrôle complet terminé'},
  {id:'ctrl36', em:'🥇', t:'36 / 40',          d:'au vrai contrôle'},
  {id:'ctrl40', em:'🏆', t:'40 / 40',          d:'au vrai contrôle'},
  {id:'m-c1',   em:'🔌', t:'Appareillage',     d:'Partie maîtrisée'},
  {id:'m-c2',   em:'🛡️', t:'Protection',       d:'Partie maîtrisée'},
  {id:'m-c3',   em:'🪪', t:'Habilitations',    d:'Partie maîtrisée'},
  {id:'m-c4',   em:'🔒', t:'Consignation',     d:'Partie maîtrisée'}
];

/* ── État persistant ───────────────────────────────────── */
let S = load();
function blank(){ return {xp:0, q:{}, badges:[], sessions:[], revCount:0, day:{last:null,streak:0}, snd:true, theme:'dark', plan:{}, flash:0, hideAns:false, exo:{}, goal:{set:false,date:'2026-10-16',target:32}, mast:{d:'',n:0}}; }
function load(){ try{ const o=JSON.parse(localStorage.getItem(KEY)); return o&&o.q? Object.assign(blank(),o) : blank(); }catch(e){ return blank(); } }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function qs(id){ return S.q[id] || (S.q[id]={seen:0,ok:0,ko:0,box:0,due:0,lastKo:false}); }

/* ── Maîtrise d'une question ─────────────────────────────
   -1 pas vue · 0 ratée · 1 juste une fois · 2 maîtrisée · 3 béton */
function lvl(q){ const r=S.q[q.id]; if(!r||!r.seen) return -1; if(r.lastKo) return 0; return Math.min(3,r.box); }
const isMast = q => lvl(q)>=2;
function mastCount(list){ return (list||QUESTIONS).filter(isMast).length; }
function blocQs(b){ return QUESTIONS.filter(q=>q.n>=b.from && q.n<=b.to); }
function blocDone(b){ const l=blocQs(b); return mastCount(l) >= Math.ceil(l.length*0.8); }
function daysLeft(){ if(!S.goal.date) return null; const d=Math.ceil((new Date(S.goal.date+'T12:00')-new Date(today()+'T12:00'))/864e5); return d; }
function todayMast(){ return S.mast.d===today()? S.mast.n : 0; }

/* ── Niveaux ───────────────────────────────────────────── */
const xpFor = L => 40*L*(L+1);                 // XP cumulé requis pour atteindre le niveau L+1
function levelOf(xp){ let L=1; while(xp >= xpFor(L)) L++; return L; }
function levelBounds(xp){ const L=levelOf(xp); return {L, lo: L>1? xpFor(L-1):0, hi: xpFor(L)}; }

/* ── Outils ────────────────────────────────────────────── */
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const shuffle = a => { a=a.slice(); for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0; [a[i],a[j]]=[a[j],a[i]];} return a; };
const esc = t => String(t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const pct = (a,b) => b? Math.round(a/b*100) : 0;
const el = (tag,cls,html) => { const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; };
const today = () => new Date().toISOString().slice(0,10);

/* ── Son ───────────────────────────────────────────────── */
let AC=null;
function tone(f,d,type='sine',vol=.09,t0=0){
  if(!S.snd) return;
  try{
    AC = AC || new (window.AudioContext||window.webkitAudioContext)();
    const o=AC.createOscillator(), g=AC.createGain(), t=AC.currentTime+t0;
    o.type=type; o.frequency.setValueAtTime(f,t);
    g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+.012);
    g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t+d+.02);
  }catch(e){}
}
const sndOk   = () => { tone(659,.13,'triangle',.08); tone(880,.18,'triangle',.07,.08); };
const sndKo   = () => { tone(190,.20,'sawtooth',.05); tone(140,.24,'sawtooth',.045,.09); };
const sndLvl  = () => [523,659,784,1047].forEach((f,i)=>tone(f,.22,'triangle',.08,i*.09));
const sndClick= () => tone(420,.05,'square',.03);

/* ── Confettis ─────────────────────────────────────────── */
function confetti(n=90){
  const cv=$('#cfx'), ctx=cv.getContext('2d');
  cv.width=innerWidth; cv.height=innerHeight; cv.style.display='block';
  const cols=['#5eead4','#818cf8','#f472b6','#fbbf24','#34d399','#fb7185'];
  const P=[...Array(n)].map(()=>({x:Math.random()*cv.width, y:-20-Math.random()*cv.height*.4,
    vx:(Math.random()-.5)*3.4, vy:2+Math.random()*4, s:5+Math.random()*7,
    c:cols[Math.random()*cols.length|0], r:Math.random()*6, vr:(Math.random()-.5)*.28}));
  let f=0;
  (function step(){
    ctx.clearRect(0,0,cv.width,cv.height);
    P.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=.055; p.r+=p.vr;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle=p.c;
      ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6); ctx.restore(); });
    if(++f<170) requestAnimationFrame(step);
    else { ctx.clearRect(0,0,cv.width,cv.height); cv.style.display='none'; }
  })();
}
let toastT;
function toast(msg){
  const t=$('#toast'); t.innerHTML=msg; t.classList.add('on');
  clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('on'),2600);
}

/* ── En-tête ───────────────────────────────────────────── */
function renderHeader(){
  const b=levelBounds(S.xp);
  $('#lvlN').textContent=b.L;
  $('#lvlTxt').textContent='Niv.';
  $('#xpFill').style.width = ((S.xp-b.lo)/(b.hi-b.lo)*100)+'%';
  $('#xpNow').textContent = S.xp+' XP';
  $('#xpNext').textContent = 'niveau '+(b.L+1)+' à '+b.hi+' XP';
  $('#streakN').textContent = S.day.streak;
  $('#soundBtn').textContent = S.snd? '🔊':'🔇';
  $('#themeBtn').textContent = S.theme==='dark'? '🌙':'☀️';
}
function addXP(n){
  const before=levelOf(S.xp); S.xp+=n;
  const after=levelOf(S.xp);
  if(after>before){ sndLvl(); confetti(120); toast('🎉 Niveau '+after+' atteint !'); }
  renderHeader();
}

/* ── Badges ────────────────────────────────────────────── */
function chapStats(cid){
  const list=QUESTIONS.filter(q=>q.c===cid);
  let seen=0, ok=0, tot=0;
  list.forEach(q=>{ const r=S.q[q.id]; if(r&&r.seen){ seen++; ok+=r.ok; tot+=r.ok+r.ko; } });
  return {n:list.length, seen, acc:pct(ok,tot), tot};
}
function checkBadges(ctx={}){
  const got=new Set(S.badges), add=[];
  const give=id=>{ if(!got.has(id)){ got.add(id); add.push(id); } };
  const answered=Object.values(S.q).reduce((s,r)=>s+r.ok+r.ko,0);
  if(answered>=1) give('first');
  if(answered>=100) give('c100');
  if(answered>=250) give('c250');
  if((ctx.combo||0)>=10) give('combo10');
  if((ctx.combo||0)>=25) give('combo25');
  if(ctx.examNote>=16) give('exam16');
  if(ctx.examPerfect) give('perfect');
  if((S.flash||0)>=40) give('flash40');
  if(ctx.ctrl!==undefined){ give('ctrl1'); if(ctx.ctrl>=36) give('ctrl36'); if(ctx.ctrl>=40) give('ctrl40'); }
  if(S.revCount>=50) give('rev50');
  if(S.day.streak>=3) give('days3');
  if(Object.values(S.q).filter(r=>r.seen).length>=QUESTIONS.length) give('seenall');
  CHAPTERS.forEach(c=>{ const st=chapStats(c.id); if(st.seen>=Math.ceil(st.n*.8) && st.acc>=80) give('m-'+c.id); });
  if(add.length){
    S.badges=[...got]; save();
    add.forEach((id,i)=>setTimeout(()=>{ const b=BADGES.find(x=>x.id===id);
      toast(b.em+' Badge débloqué — <b>'+b.t+'</b>'); confetti(70); sndLvl(); }, i*1500));
  }
}

/* ── Streak quotidienne ────────────────────────────────── */
function touchDay(){
  const t=today();
  if(S.day.last===t) return;
  const y=new Date(Date.now()-864e5).toISOString().slice(0,10);
  S.day.streak = (S.day.last===y)? S.day.streak+1 : 1;
  S.day.last=t; save(); renderHeader();
}

/* ── Navigation ────────────────────────────────────────── */
function show(v){
  $$('.view').forEach(s=>s.classList.toggle('on', s.id==='v-'+v));
  $$('nav button').forEach(b=>b.classList.toggle('on', b.dataset.view===v));
  window.scrollTo({top:0,behavior:'instant'});
}

/* ── Accueil ───────────────────────────────────────────── */
function dueQuestions(){
  const now=Date.now();
  return QUESTIONS.filter(q=>{ const r=S.q[q.id]; return r && r.seen && r.due<=now; });
}
function renderHome(){
  const M=mastCount(), N=QUESTIONS.length, C=2*Math.PI*52, p=M/N;
  const tgt=S.goal.target||32;
  $('#mRing').innerHTML=`<svg viewBox="0 0 120 120"><circle class="bgc" cx="60" cy="60" r="52"></circle>
     <circle cx="60" cy="60" r="52" stroke="url(#gr)" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p)}"></circle>
     <circle cx="60" cy="60" r="52" class="tgt" stroke-dasharray="2 ${C}" stroke-dashoffset="${-C*tgt/N}"></circle>
     <defs><linearGradient id="gr" x1="0" x2="1"><stop offset="0" stop-color="var(--acc)"/><stop offset="1" stop-color="var(--acc2)"/></linearGradient></defs></svg>
     <div><b>${M}</b><small>/ ${N} maîtrisées</small></div>`;
  const dl=daysLeft();
  $('#countdown').innerHTML = dl===null? '📅 Date du contrôle ?' : dl>1? `📅 Contrôle dans <b>${dl} jours</b>` : dl===1? '📅 Contrôle <b>demain</b> !' : dl===0? '📅 Contrôle <b>aujourd’hui</b> 💪' : '📅 Contrôle passé';
  const left=Math.max(0,tgt-M), tm=todayMast();
  let per = left+tm;
  if(dl && dl>0) per=Math.ceil((left+tm)/dl);
  $('#goalTxt').innerHTML = M>=tgt? `🎉 Objectif <b>${tgt}/40</b> atteint ! Vise plus haut ou attaque les bonus.`
     : `Objectif <b>${tgt}/40</b> · encore <b>${left}</b> question${left>1?'s':''} à maîtriser`;
  const daily=Math.max(1,Math.min(per, N));
  $('#todayTxt').textContent = M>=tgt? tm+' maîtrisée'+(tm>1?'s':'') : tm+' / '+daily+' maîtrisées';
  $('#todayFill').style.width = (M>=tgt?100:Math.min(100,pct(tm,daily)))+'%';
  const nx=nextAction(); $('#btnNext').innerHTML='▶ '+nx.l; $('#nextWhy').innerHTML=nx.why;

  // carte des 40
  const mp=$('#qmap'); mp.innerHTML='';
  QUESTIONS.forEach(q=>{ const b=el('button','qc l'+lvl(q), String(q.n)); b.title='Q'+q.n+(q.doute?' (réponse à vérifier)':'');
    if(q.doute) b.classList.add('dq2');
    b.onclick=()=>{ sndClick(); startSession('learn',[q.c],1,{pool:[q]}); }; mp.appendChild(b); });

  // blocs
  const bl=$('#blocList'); bl.innerHTML='';
  BLOCS.forEach((b,k)=>{
    const l=blocQs(b), m=mastCount(l), done=blocDone(b), seen=l.filter(q=>lvl(q)>=0).length;
    const d=el('div','bloc'+(done?' done':''));
    d.innerHTML=`<div class="bh"><span class="em">${done?'✅':b.ic}</span><span><b>${b.t} · Q${b.from} à Q${b.to}</b><small>${b.sub}</small></span></div>
      <div class="bbar"><i style="width:${pct(m,l.length)}%"></i></div>
      <div class="bst">${m}/${l.length} maîtrisées${seen<l.length?' · '+(l.length-seen)+' jamais vues':''}</div>
      <div class="bbtn"><button class="btn ghost sm" data-a="learn">📖 Apprendre</button><button class="btn ghost sm" data-a="flash">🃏 Cartes</button></div>`;
    d.querySelector('[data-a=learn]').onclick=()=>{ sndClick(); startBloc(b); };
    d.querySelector('[data-a=flash]').onclick=()=>{ sndClick(); startFlash(null,true,blocQs(b)); };
    bl.appendChild(d);
  });

  // exercices
  const xl=$('#exoList'); xl.innerHTML='';
  EXOS.forEach(x=>{
    const r=S.exo[x.id]||{best:-1}, n=x.steps.length;
    const d=el('div','bloc'+(r.best===n?' done':''));
    d.innerHTML=`<div class="bh"><span class="em">${r.best===n?'✅':x.ic}</span><span><b>${esc(x.t)}</b><small>${esc(x.sub)}</small></span></div>
      <div class="bbar"><i style="width:${pct(Math.max(0,r.best),n)}%"></i></div>
      <div class="bst">${r.best<0?'Pas encore fait':'Meilleur : '+r.best+' / '+n+' étapes justes du 1<sup>er</sup> coup'}</div>
      <div class="bbtn"><button class="btn ${x.partial?'ghost ':''}sm">${r.best<0?'▶ Commencer':'🔁 Refaire'}</button></div>`;
    d.querySelector('button').onclick=()=>{ sndClick(); startExo(x.id); };
    xl.appendChild(d);
  });

  // bonus
  $('#bonusN').textContent=BONUS.length;
  const bc=$('#bonusChaps'); bc.innerHTML='';
  CHAPTERS.forEach(c=>{ const n=BONUS.filter(q=>q.c===c.id).length;
    const b=el('button','chip',`${c.ic} ${esc(c.short)} (${n})`);
    b.onclick=()=>{ sndClick(); startSession('learn',[c.id],n,{pool:BONUS.filter(q=>q.c===c.id)}); };
    bc.appendChild(b); });

  // contrôle blanc : meilleur score
  const best=S.sessions.filter(x=>x.ctrl && x.total===N).reduce((m,x)=>Math.max(m,x.good),-1);
  $('#ctrlTag').textContent = best<0? '30 min comme le jour J' : 'Meilleur : '+best+' / '+N;

  const d=dueQuestions().length;
  $('#dueTag').textContent = d? (d+' question'+(d>1?'s':'')+' à revoir →') : 'Rien à réviser pour l’instant';

  const cl=$('#chapList'); cl.innerHTML='';
  CHAPTERS.forEach(c=>{
    const st=chapStats(c.id), pp=pct(st.seen,st.n), CC=2*Math.PI*19;
    const b=el('button','chap');
    b.innerHTML=`<div class="ring">
        <svg viewBox="0 0 46 46"><circle class="bgc" cx="23" cy="23" r="19"></circle>
        <circle cx="23" cy="23" r="19" stroke="${c.col}" stroke-dasharray="${CC}" stroke-dashoffset="${CC*(1-pp/100)}"></circle></svg>
        <em>${c.ic}</em></div>
      <div class="txt"><b>${c.n}. ${esc(c.t)}</b><small>${st.n} questions · ${st.seen} vues${st.tot?' · '+st.acc+'% de réussite':''}</small></div>
      <div class="pc" style="color:${c.col}">${pp}%</div>`;
    b.onclick=()=>{ sndClick(); openSetup('learn',[c.id]); };
    cl.appendChild(b);
  });

  $('#kBadge').textContent=S.badges.length+' / '+BADGES.length;
  const bdl=$('#badgeList'); bdl.innerHTML='';
  BADGES.forEach(b=>{
    const got=S.badges.includes(b.id);
    bdl.appendChild(el('div','badge'+(got?' got':''),
      `<span class="em">${b.em}</span><b>${esc(b.t)}</b><small>${esc(b.d)}</small>`));
  });
}

/* ── Que faire maintenant ? ────────────────────────────── */
function startBloc(b){
  const l=blocQs(b), fresh=l.every(q=>lvl(q)<0);
  startSession('learn', CHAPTERS.map(c=>c.id), l.length, {pool: fresh? l : shuffle(l), fixed:fresh});
}
function nextAction(){
  const pd=planCurrent();
  if(pd){ const st=pd.steps.find(x=>!planDone(x.id) && x.act.k!=='none');
    if(st) return {l:st.l.replace(/<[^>]+>/g,''), why:`📅 Planning ${pd.d===today()?'d’aujourd’hui':'du '+dayLabel(pd.d)} · étape ${pd.steps.indexOf(st)+1}/${pd.steps.filter(x=>x.act.k!=='none').length} · ${st.m} min`, go:()=>runStep(st)};
  }
  for(const b of BLOCS){
    if(blocDone(b)) continue;
    const l=blocQs(b), un=l.filter(q=>lvl(q)<0), ko=l.filter(q=>lvl(q)===0);
    if(un.length) return {l:`Apprendre le ${b.t.toLowerCase()} (Q${b.from} à Q${b.to})`, why:`${b.sub} · ${un.length} question${un.length>1?'s':''} jamais vue${un.length>1?'s':''}. Lis bien l’astuce après chaque réponse.`,
      go:()=>startBloc(b)};
    if(ko.length) return {l:`Corriger tes ${ko.length} erreur${ko.length>1?'s':''} du ${b.t.toLowerCase()}`, why:'Les questions ratées, tout de suite, tant que c’est frais.',
      go:()=>startSession('learn',CHAPTERS.map(c=>c.id),ko.length,{pool:shuffle(ko)})};
    return {l:`Cartes du ${b.t.toLowerCase()} (Q${b.from} à Q${b.to})`, why:`Encore ${Math.ceil(l.length*0.8)-mastCount(l)} à maîtriser pour valider le bloc : il faut avoir juste 2 fois.`,
      go:()=>startFlash(null,false,l)};
  }
  const due=poolReview();
  if(due.length) return {l:`Répétition espacée (${Math.min(20,due.length)} questions)`, why:'Les 4 blocs sont validés 🎉 On revoit ce qui commence à s’oublier.',
    go:()=>startSession('review',CHAPTERS.map(c=>c.id),Math.min(20,due.length),{pool:due})};
  const best=S.sessions.filter(x=>x.ctrl && x.total===QUESTIONS.length).reduce((m,x)=>Math.max(m,x.good),-1);
  if(best<(S.goal.target||32)) return {l:'Contrôle blanc en conditions réelles', why:'Les 40 questions en 30 min, comme le jour J. Vise '+(S.goal.target||32)+'/40.',
    go:()=>startControle()};
  return {l:'Aller plus loin : contrôle inédit', why:'Objectif atteint au contrôle blanc 💪 Entraîne-toi sur des questions nouvelles du même style.',
    go:()=>startBonusExam()};
}

/* ── Objectif ──────────────────────────────────────────── */
function openGoal(){
  $('#onbHi').textContent='Salut '+(typeof OWNER==='string'? OWNER:'')+' !';
  $('#onbDate').value=S.goal.date||EXAM_DATE;
  const tc=$('#onbTarget'); tc.innerHTML='';
  [[20,'20/40 · la moyenne'],[28,'28/40 · 14/20'],[32,'32/40 · 16/20'],[36,'36/40 · 18/20'],[40,'40/40 · parfait']].forEach(([v,l])=>{
    const b=el('button','chip'+(S.goal.target===v?' on':''),l);
    b.onclick=()=>{ S.goal.target=v; tc.querySelectorAll('.chip').forEach(x=>x.classList.remove('on')); b.classList.add('on'); sndClick(); };
    tc.appendChild(b); });
  $('#onb').classList.add('on');
}
$('#onbGo').onclick=()=>{ S.goal.date=$('#onbDate').value; S.goal.set=true; save(); $('#onb').classList.remove('on'); renderHome(); sndOk(); };
$('#onbLater').onclick=()=>{ S.goal.set=true; save(); $('#onb').classList.remove('on'); renderHome(); };
$('#goalEdit').onclick=()=>{ sndClick(); openGoal(); };
$('#btnNext').onclick=()=>{ sndClick(); nextAction().go(); };

/* ── Écran de configuration ────────────────────────────── */
let cfg = {mode:'exam', chaps:[], count:20, timer:true, diff:0, malus:1/3};
function openSetup(mode, chaps){
  cfg.mode=mode;
  cfg.chaps = chaps && chaps.length? chaps.slice() : CHAPTERS.map(c=>c.id);
  cfg.count = mode==='learn'? 15 : 20;
  cfg.timer = mode==='exam';
  cfg.diff  = 0;
  cfg.malus = 0;
  const M={learn:['🎓 Apprentissage','Correction et explication après chaque question.'],
           exam:['⏱️ Examen blanc','Chrono, note sur 20, correction à la fin.'],
           review:['🔁 Répétition espacée','Les questions que tu dois revoir en priorité.']}[mode];
  $('#setupTitle').textContent=M[0]; $('#setupSub').textContent=M[1];

  const cc=$('#setChaps'); cc.innerHTML='';
  const allBtn=el('button','chip'+(cfg.chaps.length===CHAPTERS.length?' on':''),'Tous');
  allBtn.onclick=()=>{ cfg.chaps = cfg.chaps.length===CHAPTERS.length? [] : CHAPTERS.map(c=>c.id); drawSetup(); };
  cc.appendChild(allBtn);
  CHAPTERS.forEach(c=>{
    const b=el('button','chip', c.ic+' '+c.n+'. '+c.short);
    b.dataset.c=c.id;
    b.onclick=()=>{ sndClick();
      const i=cfg.chaps.indexOf(c.id);
      if(i<0) cfg.chaps.push(c.id); else cfg.chaps.splice(i,1);
      drawSetup(); };
    cc.appendChild(b);
  });
  const nc=$('#setCount'); nc.innerHTML='';
  [10,20,'Tout'].forEach(n=>{
    const b=el('button','chip', n==='Tout'? 'Toutes':n+' questions'); b.dataset.n=n;
    b.onclick=()=>{ sndClick(); cfg.count = n==='Tout'? 9999 : n; drawSetup(); };
    nc.appendChild(b);
  });
  const tc=$('#setTimer'); tc.innerHTML='';
  [['Avec chrono',true],['Sans chrono',false]].forEach(([l,v])=>{
    const b=el('button','chip',l); b.dataset.t=v;
    b.onclick=()=>{ sndClick(); cfg.timer=v; drawSetup(); }; tc.appendChild(b);
  });
  const mc=$('#setMalus'); mc.innerHTML='';
  [['+1 / 0 (comme le contrôle)',0],['− ⅓ par erreur',1/3],['− ½ par erreur',0.5]].forEach(([l,v])=>{
    const b=el('button','chip',l); b.dataset.m=v;
    b.onclick=()=>{ sndClick(); cfg.malus=v; drawSetup(); }; mc.appendChild(b);
  });
  const dc=$('#setDiff'); dc.innerHTML='';
  [['Toutes',0],['⭐ Bases',1],['⭐⭐ Intermédiaire',2],['⭐⭐⭐ Difficile',3]].forEach(([l,v])=>{
    const b=el('button','chip',l); b.dataset.d=v;
    b.onclick=()=>{ sndClick(); cfg.diff=v; drawSetup(); }; dc.appendChild(b);
  });
  drawSetup(); show('setup');
}
function poolFor(){
  let p = QUESTIONS.filter(q=>cfg.chaps.includes(q.c));
  if(cfg.diff) p=p.filter(q=>q.d===cfg.diff);
  if(cfg.mode==='review'){
    const now=Date.now();
    const due=p.filter(q=>{const r=S.q[q.id];return r&&r.seen&&r.due<=now;});
    const bad=p.filter(q=>{const r=S.q[q.id];return r&&r.lastKo;});
    const un =p.filter(q=>!S.q[q.id]||!S.q[q.id].seen);
    const set=new Set(); const out=[];
    [...due,...bad,...un].forEach(q=>{ if(!set.has(q.id)){set.add(q.id);out.push(q);} });
    p=out;
  }
  return p;
}
function drawSetup(){
  $$('#setChaps .chip').forEach(b=>{
    if(b.dataset.c) b.classList.toggle('on', cfg.chaps.includes(b.dataset.c));
    else b.classList.toggle('on', cfg.chaps.length===CHAPTERS.length);
  });
  $$('#setCount .chip').forEach(b=>b.classList.toggle('on', (b.dataset.n==='Tout'?9999:+b.dataset.n)===cfg.count));
  $$('#setTimer .chip').forEach(b=>b.classList.toggle('on', (b.dataset.t==='true')===cfg.timer));
  $$('#setDiff .chip').forEach(b=>b.classList.toggle('on', +b.dataset.d===cfg.diff));
  $$('#setMalus .chip').forEach(b=>b.classList.toggle('on', Math.abs(+b.dataset.m-cfg.malus)<1e-6));
  const showX = cfg.mode==='exam'? '' : 'none';
  $('#setMalus').style.display=showX; $('#lblMalus').style.display=showX;
  $('#setTimer').parentNode.querySelectorAll('.lbl')[2].style.display = cfg.mode==='exam'?'':'none';
  $('#setTimer').style.display = cfg.mode==='exam'?'':'none';
  const n=poolFor().length;
  const use=Math.min(n,cfg.count);
  $('#setupInfo').innerHTML = n? (use+' question'+(use>1?'s':'')+' sélectionnée'+(use>1?'s':'')+
      (cfg.mode==='exam'&&cfg.timer? ' · '+Math.max(1,Math.round(use*45/60))+' min de chrono':'')) :
      '⚠️ Aucune question ne correspond à ces filtres.';
  $('#setupGo').disabled = n===0 || cfg.chaps.length===0;
}

/* ── Moteur de session ─────────────────────────────────── */
let SES=null;
function startSession(mode, chaps, count, opts={}){
  const old=cfg;
  cfg={mode, chaps:chaps||CHAPTERS.map(c=>c.id), count:count||20, timer:opts.timer!==false&&mode==='exam',
       diff:opts.diff||0, malus: opts.malus!==undefined? opts.malus : 0};
  let pool = opts.pool || poolFor();
  if(!pool.length){ toast('Aucune question disponible.'); cfg=old; return; }
  if(mode!=='review' && !opts.fixed) pool=shuffle(pool);
  pool=pool.slice(0, Math.min(cfg.count, pool.length));
  SES={mode, list:pool, i:0, answers:[], combo:0, maxCombo:0, xp:0, step:opts.step||null, fixed:!!opts.fixed, ctrl:!!opts.ctrl, rush:!!opts.rush,
       t0:Date.now(), limit: cfg.timer? (opts.limit||pool.length*45) : 0, tick:null};
  touchDay();
  if(SES.limit){ $('#qTimer').style.display=''; startTimer(); } else $('#qTimer').style.display='none';
  show('quiz'); renderQ();
}
function startTimer(){
  clearInterval(SES.tick);
  SES.tick=setInterval(()=>{
    const left=SES.limit-Math.floor((Date.now()-SES.t0)/1000);
    const m=Math.max(0,Math.floor(left/60)), s=Math.max(0,left%60);
    const T=$('#qTimer'); T.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
    T.classList.toggle('warn', left<=30);
    if(left<=0){ clearInterval(SES.tick); toast('⏰ Temps écoulé !'); finish(); }
  },250);
}

/* ── Rendu d'une question ──────────────────────────────── */
let CUR=null;
function renderQ(){
  const q=SES.list[SES.i];
  $('#progFill').style.width=(SES.i/SES.list.length*100)+'%';
  $('#qCount').textContent=(SES.i+1)+'/'+SES.list.length;
  const ch=CH[q.c];
  const card=$('#qCard'); card.innerHTML='';
  CUR={q, answered:false, sel:null, multi:new Set(), pairs:{}, active:null, order:null, map:null, place:{}, wact:null};

  card.appendChild(el('div','qmeta',
    `<span class="pill" style="color:${ch.col}">${ch.ic} ${ch.n}. ${esc(ch.short)}</span>
     <span class="pill${q.bonus?' bonus':''}">${qTag(q)}</span>
     <span class="pill d${q.d}">${'⭐'.repeat(q.d)}</span>
     <span class="pill">${({qcm:'Choix unique',multi:'Choix multiples',vf:'Vrai / Faux',match:'Associations',order:'Remise en ordre',label:'Placer les mots'})[q.t]}</span>`));
  card.appendChild(el('div','qtext', q.q));
  if(q.doute && SES.mode!=='exam') card.appendChild(el('div','doute','⚠️ Réponse non garantie (pas de corrigé officiel) : à vérifier avec le cours'));
  if(q.i && q.t!=='label'){
    const w=el('div','qimg sym',`<img src="assets/img/${q.i}" alt="Symbole du sujet">`);
    w.onclick=()=>openLB('assets/img/'+q.i);
    card.appendChild(w);
  }
  ({qcm:rQcm, vf:rVf, multi:rMulti, match:rMatch, order:rOrder, label:rLabel})[q.t](card,q);
  card.appendChild(el('div','btnrow',''));
  const row=card.querySelector('.btnrow');
  const bv=el('button','btn full','Valider'); bv.id='btnVal'; bv.disabled = q.t!=='order'; bv.onclick=()=>validate();
  row.appendChild(bv);
  if(q.t==='qcm'||q.t==='vf') bv.style.display='none';
  if(SES.mode==='exam' && cfg.malus>0){
    const bs=el('button','btn ghost','🤷 Je ne sais pas'); bs.id='btnSkip';
    bs.title='Aucun point, mais aucune pénalité';
    bs.onclick=()=>validate(true); row.appendChild(bs);
    bv.style.flex='2';
  }
}
function rQcm(card,q){
  const idx=SES.fixed? q.o.map((_,i)=>i) : shuffle(q.o.map((_,i)=>i)); CUR.map=idx;
  const box=el('div','opts');
  idx.forEach((oi,k)=>{
    const b=el('button','opt',`<span class="k">${k+1}</span><span>${q.o[oi]}</span>`);
    b.dataset.o=oi;
    b.onclick=()=>{ if(CUR.answered) return; CUR.sel=oi; sndClick();
      box.querySelectorAll('.opt').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel'); $('#btnVal').disabled=false;
      if(SES.mode!=='exam') validate(); else $('#btnVal').style.display='';
    };
    box.appendChild(b);
  });
  card.appendChild(box);
}
function rVf(card,q){
  CUR.map=[0,1];
  const box=el('div','opts');
  ['Vrai','Faux'].forEach((lab,oi)=>{
    const b=el('button','opt',`<span class="k">${oi+1}</span><span>${lab}</span>`);
    b.dataset.o=oi;
    b.onclick=()=>{ if(CUR.answered) return; CUR.sel=oi; sndClick();
      box.querySelectorAll('.opt').forEach(x=>x.classList.remove('sel'));
      b.classList.add('sel'); $('#btnVal').disabled=false;
      if(SES.mode!=='exam') validate(); else $('#btnVal').style.display='';
    };
    box.appendChild(b);
  });
  card.appendChild(box);
}
function rMulti(card,q){
  const idx=shuffle(q.o.map((_,i)=>i)); CUR.map=idx;
  card.appendChild(el('p','', '<small style="color:var(--txt3)">Plusieurs réponses possibles.</small>'));
  const box=el('div','opts');
  idx.forEach((oi,k)=>{
    const b=el('button','opt',`<span class="k">${k+1}</span><span>${q.o[oi]}</span>`);
    b.onclick=()=>{ if(CUR.answered) return; sndClick();
      if(CUR.multi.has(oi)){ CUR.multi.delete(oi); b.classList.remove('sel'); }
      else { CUR.multi.add(oi); b.classList.add('sel'); }
      $('#btnVal').disabled = CUR.multi.size===0;
    };
    box.appendChild(b);
  });
  card.appendChild(box);
}
function rMatch(card,q){
  const L=shuffle(q.p.map((_,i)=>i)), R=shuffle(q.p.map((_,i)=>i));
  CUR.L=L; CUR.R=R;
  card.appendChild(el('p','', '<small style="color:var(--txt3)">Touche un élément à gauche, puis son correspondant à droite.</small>'));
  const g=el('div','match');
  const cl=el('div','mcol','<h5>Éléments</h5>'), cr=el('div','mcol','<h5>Correspondances</h5>');
  L.forEach(i=>{ const b=el('button','mitem',`<span class="num"></span><span>${q.p[i][0]}</span>`);
    b.dataset.l=i; b.onclick=()=>pickL(i,b); cl.appendChild(b); });
  R.forEach(j=>{ const b=el('button','mitem',`<span class="num"></span><span>${q.p[j][1]}</span>`);
    b.dataset.r=j; b.onclick=()=>pickR(j,b); cr.appendChild(b); });
  g.appendChild(cl); g.appendChild(cr); card.appendChild(g);
}
function pickL(i,b){
  if(CUR.answered) return; sndClick();
  if(CUR.pairs[i]!==undefined){ delete CUR.pairs[i]; }
  CUR.active = CUR.active===i? null : i;
  drawMatch();
}
function pickR(j,b){
  if(CUR.answered) return;
  const owner=Object.keys(CUR.pairs).find(k=>CUR.pairs[k]===j);
  if(owner!==undefined) delete CUR.pairs[owner];
  if(CUR.active===null){ sndClick(); drawMatch(); return; }
  CUR.pairs[CUR.active]=j; CUR.active=null; sndClick(); drawMatch();
}
function drawMatch(){
  const q=CUR.q, order=Object.keys(CUR.pairs);
  const num={}; order.forEach((k,n)=>num[k]=n+1);
  $$('#qCard .mitem').forEach(b=>{
    b.classList.remove('active','paired'); b.querySelector('.num').textContent='';
    if(b.dataset.l!==undefined){
      const i=b.dataset.l;
      if(CUR.active!==null && +i===CUR.active) b.classList.add('active');
      if(CUR.pairs[i]!==undefined){ b.classList.add('paired'); b.querySelector('.num').textContent=num[i]; }
    } else {
      const j=+b.dataset.r, o=order.find(k=>CUR.pairs[k]===j);
      if(o!==undefined){ b.classList.add('paired'); b.querySelector('.num').textContent=num[o]; }
    }
  });
  $('#btnVal').disabled = Object.keys(CUR.pairs).length < q.p.length;
}
function rOrder(card,q){
  CUR.order = (SES.fixed && q.init)? q.init.slice() : shuffle(q.s.map((_,i)=>i));
  card.appendChild(el('p','', '<small style="color:var(--txt3)">Remets les étapes dans le bon ordre avec les flèches.</small>'));
  const box=el('div','order'); box.id='ordBox'; card.appendChild(box);
  drawOrder();
}
function drawOrder(){
  const q=CUR.q, box=$('#ordBox'); box.innerHTML='';
  CUR.order.forEach((oi,k)=>{
    const it=el('div','oitem',
      `<span class="num">${k+1}</span><span class="lbl">${q.s[oi]}</span>
       <span class="mv"><button data-u="${k}">▲</button><button data-d="${k}">▼</button></span>`);
    it.dataset.o=oi;
    box.appendChild(it);
  });
  box.querySelectorAll('[data-u]').forEach(b=>b.onclick=()=>{ const k=+b.dataset.u; if(k>0){ const a=CUR.order; [a[k-1],a[k]]=[a[k],a[k-1]]; sndClick(); drawOrder(); }});
  box.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{ const k=+b.dataset.d; const a=CUR.order; if(k<a.length-1){ [a[k+1],a[k]]=[a[k],a[k+1]]; sndClick(); drawOrder(); }});
}

function rLabel(card,q){
  card.appendChild(el('p','','<small style="color:var(--txt3)">Touche une étiquette, puis la pastille correspondante sur le schéma.</small>'));
  const box=el('div','lbimg');
  const D=(typeof LABELDIM!=='undefined' && LABELDIM[q.i]) || null;
  const inner=el('div','lbinner',
    `<img src="assets/img/${q.i}.jpg" alt="Schéma à annoter"${D?` width="${D[0]}" height="${D[1]}"`:''}>`);
  if(D) inner.style.aspectRatio = D[0]+' / '+D[1];
  q.sp.forEach((s,k)=>{
    const p=el('button','pin', String(k+1));
    p.style.left=s.x+'%'; p.style.top=s.y+'%'; p.dataset.p=k;
    p.onclick=()=>placePin(k);
    inner.appendChild(p);
  });
  box.appendChild(inner); card.appendChild(box);
  card.appendChild(el('div','lbhint','↔ fais glisser le schéma pour le parcourir'));
  const words=shuffle(q.sp.map(s=>s.a).concat(q.w||[]));
  CUR.words=words;
  const wb=el('div','words');
  words.forEach((w,wi)=>{
    const b=el('button','word', `<span class="pn" style="display:none"></span><span>${w}</span>`);
    b.dataset.w=wi; b.onclick=()=>pickWord(wi);
    wb.appendChild(b);
  });
  card.appendChild(wb);
}
function pickWord(wi){
  if(CUR.answered) return; sndClick();
  const placed=Object.keys(CUR.place).find(k=>CUR.place[k]===wi);
  if(placed!==undefined){ delete CUR.place[placed]; CUR.wact=null; }
  else CUR.wact = CUR.wact===wi? null : wi;
  drawLabel();
}
function placePin(k){
  if(CUR.answered) return; sndClick();
  if(CUR.place[k]!==undefined){ delete CUR.place[k]; drawLabel(); return; }
  if(CUR.wact===null) return;
  CUR.place[k]=CUR.wact; CUR.wact=null; drawLabel();
}
function drawLabel(){
  const q=CUR.q;
  $$('#qCard .pin').forEach(p=>{
    const k=+p.dataset.p, has=CUR.place[k]!==undefined;
    p.classList.toggle('filled', has);
    p.classList.toggle('target', !has && CUR.wact!==null);
  });
  $$('#qCard .word').forEach(b=>{
    const wi=+b.dataset.w, k=Object.keys(CUR.place).find(x=>CUR.place[x]===wi);
    b.classList.toggle('active', CUR.wact===wi);
    b.classList.toggle('placed', k!==undefined);
    const pn=b.querySelector('.pn');
    if(k!==undefined){ pn.style.display=''; pn.textContent=(+k)+1; } else pn.style.display='none';
  });
  $('#btnVal').disabled = Object.keys(CUR.place).length < q.sp.length;
}

/* ── Validation ────────────────────────────────────────── */
function isCorrect(){
  const q=CUR.q;
  if(q.t==='qcm'||q.t==='vf') return CUR.sel===q.a;
  if(q.t==='multi'){ const a=new Set(q.a); return a.size===CUR.multi.size && [...a].every(x=>CUR.multi.has(x)); }
  if(q.t==='match') return q.p.every((_,i)=>CUR.pairs[i]===i);
  if(q.t==='order') return CUR.order.every((oi,k)=>oi===k);
  if(q.t==='label') return q.sp.every((s,k)=>CUR.words[CUR.place[k]]===s.a);
  return false;
}
function validate(skipped){
  if(CUR.answered) return;
  const q=CUR.q, good = skipped? false : isCorrect();
  CUR.answered=true;

  const r=qs(q.id); const wasM=!q.bonus && isMast(q); r.seen++;
  if(good){ r.ok++; r.lastKo=false; r.box=Math.min(r.box+1,BOXES.length-1); }
  else    { r.ko++; r.lastKo=true;  r.box=0; }
  r.due=Date.now()+BOXES[r.box];
  bumpMast(q, wasM);
  if(SES.mode==='review') S.revCount++;

  if(good){ SES.combo++; SES.maxCombo=Math.max(SES.maxCombo,SES.combo); }
  else SES.combo=0;

  let gain=0;
  if(good){ gain = (SES.mode==='review'?7:10) + Math.min(SES.combo-1,5)*2; SES.xp+=gain; addXP(gain); }
  SES.answers.push({id:q.id, good, gain, skipped:!!skipped});

  // en examen : aucun retour visuel, on enchaîne directement
  if(SES.mode==='exam'){ sndClick(); save(); nextQ(); return; }

  // retour visuel
  const card=$('#qCard');
  if(q.t==='qcm'||q.t==='vf'){
    card.querySelectorAll('.opt').forEach(b=>{
      const oi=+b.dataset.o; b.disabled=true;
      if(oi===q.a) b.classList.add('good');
      else if(oi===CUR.sel){ b.classList.add('wrong','shake'); }
    });
  } else if(q.t==='multi'){
    const A=new Set(q.a);
    card.querySelectorAll('.opt').forEach((b,k)=>{
      const oi=CUR.map[k]; b.disabled=true;
      if(A.has(oi)) b.classList.add('good');
      else if(CUR.multi.has(oi)) b.classList.add('wrong');
    });
  } else if(q.t==='match'){
    card.querySelectorAll('.mitem').forEach(b=>{
      b.disabled=true;
      if(b.dataset.l!==undefined){
        const i=+b.dataset.l;
        b.classList.add(CUR.pairs[i]===i?'good':'wrong');
        if(CUR.pairs[i]!==i) b.querySelector('span:last-child').innerHTML += ' <small style="opacity:.75">→ '+q.p[i][1]+'</small>';
      }
    });
  } else if(q.t==='label'){
    const key=el('div','lbkey');
    q.sp.forEach((s,k)=>{
      const mine=CUR.words[CUR.place[k]], ok=mine===s.a;
      const p=card.querySelector('.pin[data-p="'+k+'"]');
      p.classList.remove('filled','target'); p.classList.add(ok?'good':'wrong');
      key.appendChild(el('div', ok?'ok2':'ko2',
        `<span class="pn">${k+1}</span><span>${ok?'':'<s style="opacity:.6">'+esc(mine)+'</s> → '}<b>${esc(s.a)}</b></span>`));
    });
    card.querySelector('.words').style.display='none';
    card.querySelector('.lbhint').after(key);
    card.querySelectorAll('.word').forEach(b=>b.disabled=true);
  } else if(q.t==='order'){
    card.querySelectorAll('.oitem').forEach((it,k)=>{
      const oi=+it.dataset.o;
      it.classList.add(oi===k?'good':'wrong');
      if(oi!==k) it.querySelector('.lbl').innerHTML += ' <small style="opacity:.75">(place n°'+(oi+1)+')</small>';
    });
  }

  if(good){ sndOk(); if(SES.combo>=3) showCombo(SES.combo); } else sndKo();

  // explication détaillée (apprentissage et révision)
  const btn=$('#btnVal');
  {
    const fb=el('div','fb '+(good?'ok':'ko'),
      `<div class="hd2">${good?'✅ Bonne réponse'+(gain?' <span style="opacity:.8;font-size:.8rem">+'+gain+' XP</span>':''):'❌ Raté'}</div>
       <div class="exp">${q.e}</div>${astuceHTML(q)}`);
    card.insertBefore(fb, btn.parentNode);
  }
  btn.style.display=''; btn.disabled=false;
  btn.textContent = (SES.i+1<SES.list.length)? 'Question suivante →' : 'Voir mon résultat →';
  btn.onclick=nextQ;
  btn.focus();
  save();
}
function bumpMast(q, wasM){
  if(q.bonus) return;
  const now=isMast(q);
  if(S.mast.d!==today()) S.mast={d:today(), n:0};
  if(now && !wasM){ S.mast.n++; if(!SES || SES.mode!=='exam') toast('🧠 Q'+q.n+' maîtrisée ! '+mastCount()+' / '+QUESTIONS.length); }
  else if(!now && wasM) S.mast.n=Math.max(0,S.mast.n-1);
}
function showCombo(n){
  const c=$('#combo');
  c.innerHTML = (n>=10?'🔥🔥 ':'🔥 ')+'Série de '+n+' !';
  c.classList.add('on'); setTimeout(()=>c.classList.remove('on'),1400);
}
function nextQ(){
  SES.i++;
  if(SES.i>=SES.list.length) finish(); else renderQ();
}

/* ── Résultats ─────────────────────────────────────────── */
function finish(){
  if(SES.tick) clearInterval(SES.tick);
  const done=SES.answers.length, good=SES.answers.filter(a=>a.good).length;
  const skipped=SES.answers.filter(a=>a.skipped).length;
  const faux=done-good-skipped;
  const malus=(SES.mode==='exam')? (cfg.malus||0) : 0;
  const p=pct(good,done||1);
  const brut=(SES.ctrl? SES.list.length : done)? (good/(SES.ctrl? SES.list.length : done)*20):0;
  const den=SES.ctrl? SES.list.length : done;
  const note=den? Math.max(0,(good-faux*malus)/den*20):0;
  S.sessions.unshift({d:Date.now(), mode:SES.mode, good, total:done, chaps:cfg.chaps.slice(), note:+note.toFixed(1)});
  if(SES.step){ S.plan[SES.step]=true; }
  if(SES.rush) S.rush=Math.max(S.rush||0, good);
  S.sessions=S.sessions.slice(0,40); save();
  const ctx={combo:SES.maxCombo, examNote: SES.mode==='exam'? note:0, examPerfect: SES.mode==='exam'&&done>=10&&good===done};
  if(SES.ctrl && done===QUESTIONS.length) ctx.ctrl=good;
  if(SES.ctrl) S.sessions[0].ctrl=true;
  checkBadges(ctx);

  const col = p>=80? 'var(--ok)' : p>=50? 'var(--warn)' : 'var(--bad)';
  const C=2*Math.PI*70;
  const verdicts = p>=90?['🏆','Excellent — tu maîtrises.']:p>=75?['🎯','Très bien, quelques détails à consolider.']
    :p>=50?['📈','Correct, mais il reste du travail sur les points ci-dessous.']:['💪','Il faut relire les fiches puis recommencer — c’est normal au début.'];
  $('#scoreCard').innerHTML=`
    <div class="scoreRing">
      <svg viewBox="0 0 160 160"><circle class="bgc" cx="80" cy="80" r="70"></circle>
      <circle cx="80" cy="80" r="70" stroke="${col}" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-p/100)}" style="transition:stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)"></circle></svg>
      <div><div class="val" style="color:${col}">${p}%</div><div class="sub">${good} / ${done}</div></div>
    </div>
    ${SES.rush? `<div class="note">⚡ ${good} bonne${good>1?'s':''} réponse${good>1?'s':''} en 5 min</div><div class="verdict" style="font-size:.84rem">Record : ${Math.max(good,S.rush||0)} · ${done} répondues</div>`:''}
    <div class="note"${SES.rush?' style="display:none"':''}>${verdicts[0]} ${SES.ctrl? `Score : ${good} / ${QUESTIONS.length} · `:''}Note : ${note.toFixed(1)} / 20</div>
    ${SES.ctrl && done<QUESTIONS.length? `<div class="verdict" style="font-size:.84rem">⏰ ${QUESTIONS.length-done} question${QUESTIONS.length-done>1?'s':''} sans réponse (temps écoulé) = 0 point</div>`:''}
    ${malus? `<div class="verdict" style="font-size:.84rem">${good} bonne${good>1?'s':''} · ${faux} fausse${faux>1?'s':''} · ${skipped} abstention${skipped>1?'s':''}
       — barème −${malus===0.5?'½':'⅓'} par erreur${Math.abs(brut-note)>0.05?` (sans pénalité : ${brut.toFixed(1)}/20)`:''}</div>`:''}
    <div class="verdict">${verdicts[1]}</div>
    <div class="gain">✨ +${SES.xp} XP${SES.maxCombo>=3? ' · 🔥 meilleure série : '+SES.maxCombo:''}</div>`;
  if(p>=80) setTimeout(()=>confetti(150),250);

  const rl=$('#revList'); rl.innerHTML='';
  SES.answers.forEach((a,k)=>{
    const q=QBY[a.id];
    const d=el('div','rev'+(a.good?'':' open'));
    d.innerHTML=`<div class="rh"><span class="ic">${a.good?'✅':(a.skipped?'⊘':'❌')}</span>
        <span><b>${q.bonus?'Bonus':'Q'+q.n}.</b> ${q.q}</span></div>
      <div class="rb">${goodAnswerHTML(q)}${q.doute?'<div class="doute">⚠️ Réponse non garantie : à vérifier avec le cours</div>':''}<div style="margin-top:9px">${q.e}</div>${astuceHTML(q)}</div>`;
    d.querySelector('.rh').onclick=()=>d.classList.toggle('open');
    rl.appendChild(d);
  });
  const wrong=SES.answers.filter(a=>!a.good);
  $('#resAgain').style.display = wrong.length? '' : 'none';
  $('#resAgain').onclick=()=>{ startSession(SES.mode==='exam'?'learn':SES.mode, cfg.chaps, wrong.length,
      {pool: wrong.map(a=>QBY[a.id])}); };
  show('result'); renderHome(); renderStats(); renderPlan();
}
function goodAnswerHTML(q){
  if(q.t==='qcm') return '<b style="color:var(--ok)">Réponse : </b>'+q.o[q.a];
  if(q.t==='vf')  return '<b style="color:var(--ok)">Réponse : </b>'+(q.a===0?'Vrai':'Faux');
  if(q.t==='multi') return '<b style="color:var(--ok)">Réponses : </b>'+q.a.map(i=>q.o[i]).join(' · ');
  if(q.t==='match') return '<b style="color:var(--ok)">Associations : </b><br>'+q.p.map(p=>'• '+p[0]+' → '+p[1]).join('<br>');
  if(q.t==='order') return '<b style="color:var(--ok)">Ordre correct : </b><br>'+q.s.map((s,i)=>(i+1)+'. '+s).join('<br>');
  if(q.t==='label') return '<b style="color:var(--ok)">Légendes : </b><br>'+q.sp.map((s,i)=>(i+1)+'. '+s.a).join('<br>');
  return '';
}

/* ── Fiches : mémo + antisèche + sujet original ────────── */
function astuceHTML(q){ const a=!q.bonus && ASTUCES[q.n]; return a? `<div class="astuce">💡 <b>Astuce :</b> ${a}</div>` : ''; }
function qTag(q){ return q.bonus? 'Bonus · même style' : 'Q'+q.n+' · page '+q.p; }
function answerText(q){
  if(q.t==='order') return q.s.map((x,i)=>(i+1)+'. '+x).join(' → ');
  return q.o[q.a];
}
function renderCourse(){
  const box=$('#courseList'); box.innerHTML='';
  const tg=el('div','anstoggle',`<label><input type="checkbox" id="hideAns"${S.hideAns?' checked':''}> Cacher les réponses de l’antisèche (touche une réponse pour la voir)</label>`);
  box.appendChild(tg);
  tg.querySelector('input').onchange=e=>{ S.hideAns=e.target.checked; save(); renderCourse(); };
  CHAPTERS.forEach(c=>{
    const secs=COURSE[c.id]||[];
    const a=el('div','acc');
    a.innerHTML=`<button class="ah"><span class="em">${c.ic}</span>
        <span><span style="display:block">${c.n}. ${esc(c.t)}</span>
        <small style="font-weight:400;color:var(--txt3);font-size:.74rem">${esc(c.sub)}</small></span>
        <span class="ar">›</span></button><div class="ab"></div>`;
    const body=a.querySelector('.ab');
    secs.forEach(s2=>{
      const f=el('div','fiche','<h4>'+esc(s2.t)+'</h4>');
      f.insertAdjacentHTML('beforeend', s2.h);
      body.appendChild(f);
    });
    const f=el('div','fiche','<h4>📋 Antisèche : les questions et leurs réponses</h4>');
    const ul=el('div','cheat'+(S.hideAns?' hide':''));
    QUESTIONS.filter(q=>q.c===c.id).forEach(q=>{
      const r=el('div','crow',`<span class="cn">Q${q.n}</span><span><span class="cq">${q.q}</span>
        <span class="ca">➜ ${answerText(q)}${q.doute?' <span class="dq" title="Réponse non garantie">⚠️ à vérifier</span>':''}</span></span>`);
      r.querySelector('.ca').onclick=e=>e.currentTarget.classList.toggle('show');
      ul.appendChild(r);
    });
    f.appendChild(ul); body.appendChild(f);
    const row=el('div','btnrow','');
    const go=el('button','btn','🎓 S’entraîner');
    go.onclick=()=>{ sndClick(); openSetup('learn',[c.id]); };
    const fl=el('button','btn ghost','🃏 Par cœur');
    fl.onclick=()=>{ sndClick(); startFlash([c.id]); };
    row.appendChild(fl); row.appendChild(go); body.appendChild(row);
    a.querySelector('.ah').onclick=()=>{ a.classList.toggle('open'); sndClick(); };
    box.appendChild(a);
  });
  // le sujet original
  const a=el('div','acc');
  a.innerHTML=`<button class="ah"><span class="em">📷</span>
      <span><span style="display:block">Le sujet original (photos)</span>
      <small style="font-weight:400;color:var(--txt3);font-size:.74rem">Les photos du 15/10/2025 · touche une page pour l’agrandir</small></span>
      <span class="ar">›</span></button><div class="ab"></div>`;
  const body=a.querySelector('.ab');
  body.appendChild(el('p','tip','La <b>page 4</b> (Q29 à Q36) n’a pas été photographiée. On la lit <b>par transparence, à l’envers</b>, au dos de la page 3 (image retournée et contrastée). L’énoncé de la <b>Q30</b> est caché par le texte de la page 3. Pour les exercices (SECU3a), seule la page 2 a été photographiée.'));
  const g=el('div','pages');
  [['sujet-p1.jpg','Page 1 · Q1–8'],['sujet-p2.jpg','Page 2 · Q9–19'],['sujet-p3.jpg','Page 3 · Q20–28'],
   ['sujet-p4-transparence.jpg','Page 4 · Q29–36 (transparence)'],['sujet-p5.jpg','Page 5 · Q37–40'],['sujet-exo-p2.jpg','SECU3a · exercices (page 2)']].forEach(([f,l])=>{
    const d=el('button','pg',`<img src="assets/img/${f}" alt="${l}" loading="lazy"><small>${l}</small>`);
    d.onclick=()=>openLB('assets/img/'+f); g.appendChild(d);
  });
  body.appendChild(g);
  a.querySelector('.ah').onclick=()=>{ a.classList.toggle('open'); sndClick(); };
  box.appendChild(a);
}

/* ── Mode « Par cœur » (cartes) ────────────────────────── */
let FL=null;
function startFlash(chaps, ordered, pool){
  let list=pool? pool.slice() : QUESTIONS.filter(q=>(chaps||CHAPTERS.map(c=>c.id)).includes(q.c));
  if(!ordered) list=shuffle(list);
  FL={list, i:0, know:0, dont:[]};
  touchDay(); show('flash'); renderFlash();
}
function renderFlash(){
  const q=FL.list[FL.i], ch=CH[q.c], card=$('#flCard');
  $('#flFill').style.width=(FL.i/FL.list.length*100)+'%';
  $('#flCount').textContent=(FL.i+1)+'/'+FL.list.length;
  card.className='card flash';
  card.innerHTML=`<div class="qmeta"><span class="pill" style="color:${ch.col}">${ch.ic} ${esc(ch.short)}</span><span class="pill${q.bonus?' bonus':''}">${qTag(q)}</span></div>
    <div class="qtext">${q.q}</div>
    ${q.i?`<div class="qimg sym"><img src="assets/img/${q.i}" alt=""></div>`:''}
    <ul class="flopts">${(q.t==='order'? q.init.map(k=>q.s[k]) : q.o).map(o=>'<li>'+o+'</li>').join('')}</ul>
    <div class="flhint">Réponds dans ta tête, puis retourne la carte.</div>
    <div class="flback">
      <div class="flans">➜ ${answerText(q)}</div>
      ${q.doute?'<div class="doute">⚠️ Réponse non garantie : à vérifier avec le cours</div>':''}
      <div class="exp">${q.e}</div>${astuceHTML(q)}
    </div>
    <div class="btnrow flreveal"><button class="btn full" id="flShow">👀 Voir la réponse</button></div>
    <div class="btnrow fljudge"><button class="btn ghost" id="flKo">✗ Je ne savais pas</button><button class="btn" id="flOk">✓ Je savais</button></div>`;
  $('#flShow').onclick=flReveal;
  $('#flOk').onclick=()=>flJudge(true);
  $('#flKo').onclick=()=>flJudge(false);
}
function flReveal(){ const c=$('#flCard'); if(c.classList.contains('rev')) return; c.classList.add('rev'); sndClick();
  S.flash=(S.flash||0)+1; save(); checkBadges(); }
function flJudge(ok){
  const q=FL.list[FL.i], r=qs(q.id), wasM=!q.bonus && isMast(q);
  r.seen++;
  if(ok){ r.ok++; r.lastKo=false; r.box=Math.min(r.box+1,BOXES.length-1); FL.know++; addXP(4); sndOk(); }
  else  { r.ko++; r.lastKo=true;  r.box=0; FL.dont.push(q); sndKo(); }
  r.due=Date.now()+BOXES[r.box]; bumpMast(q, wasM); save();
  FL.i++;
  if(FL.i<FL.list.length) return renderFlash();
  const card=$('#flCard'); card.className='card score';
  const p=pct(FL.know,FL.list.length);
  card.innerHTML=`<div class="note">🃏 ${FL.know} / ${FL.list.length} sues par cœur (${p}%)</div>
    <div class="verdict">${FL.dont.length? 'Il en reste '+FL.dont.length+' à revoir : relance-les tout de suite, c’est là que ça rentre.' : 'Toutes sues ! Passe à la 🎯 révision ciblée en conditions réelles.'}</div>
    <div class="btnrow">${FL.dont.length?'<button class="btn" id="flAgain">🔁 Revoir les '+FL.dont.length+' ratées</button>':''}<button class="btn ghost" id="flHome">🏠 Accueil</button></div>`;
  $('#flFill').style.width='100%';
  if(p>=90) confetti(120);
  if($('#flAgain')) $('#flAgain').onclick=()=>{ FL={list:shuffle(FL.dont), i:0, know:0, dont:[]}; renderFlash(); };
  $('#flHome').onclick=()=>{ show('home'); renderHome(); };
  renderHome(); renderStats();
}

/* ── Exercice guidé ────────────────────────────────────── */
let EX=null;
const EQSVG=`<svg class="eqsvg" viewBox="0 0 320 150" role="img" aria-label="Schéma équivalent : V, Rd, RA et RB en série">
 <g fill="none" stroke="currentColor" stroke-width="2.2"><path d="M30 40 V110"/><circle cx="30" cy="75" r="16"/>
 <path d="M30 40 H80"/><rect x="80" y="30" width="50" height="20"/><path d="M130 40 H290 V60"/><rect x="280" y="60" width="20" height="50"/>
 <path d="M290 110 V125 H190"/><rect x="140" y="115" width="50" height="20"/><path d="M140 125 H30 V110"/></g>
 <g fill="currentColor" font-size="13" font-family="inherit"><text x="22" y="80">V</text><text x="92" y="24">R<tspan font-size="9" dy="3">d</tspan></text>
 <text x="304" y="90">R<tspan font-size="9" dy="3">A</tspan></text><text x="152" y="108">R<tspan font-size="9" dy="3">B</tspan></text>
 <text x="40" y="34" font-size="11">phase</text><text x="200" y="34" font-size="11">masse</text><text x="200" y="145" font-size="11">terre → neutre</text>
 <text x="250" y="100" font-size="12">U<tspan font-size="8" dy="3">c</tspan></text></g>
 <path d="M155 34 l10 6 -10 6" fill="none" stroke="var(--acc)" stroke-width="2"/><text x="148" y="60" font-size="11" fill="var(--acc)">I<tspan font-size="8" dy="3">d</tspan></text></svg>`;
function startExo(id){
  const x=EXOS.find(e=>e.id===id);
  EX={x, i:0, first:0, tries:0};
  touchDay(); show('exo');
  $('#exHead').innerHTML=`<div class="qmeta"><span class="pill">🧮 SECU3a</span><span class="pill">${x.partial?'⚠️ énoncé incomplet':'énoncé complet'}</span></div>
    <h2 class="exh">${esc(x.t)}</h2>
    <details class="exen" ${x.partial?'open':''}><summary>📄 Lire l’énoncé${x.img?' et le schéma':''}</summary>${x.enonce}
    ${x.img?`<div class="qimg exim"><img src="assets/img/${x.img}" alt="Schéma de l’exercice"></div>`:''}</details>
    ${x.img?`<div class="qimg exim small"><img src="assets/img/${x.img}" alt="Schéma de l’exercice"></div>`:''}
    ${x.data?`<div class="exdata">📌 ${x.data}</div>`:''}`;
  $$('#exHead .qimg').forEach(w=>w.onclick=()=>openLB('assets/img/'+x.img));
  $('#exSteps').innerHTML=''; renderExStep();
}
function renderExStep(){
  const x=EX.x, st=x.steps[EX.i], n=x.steps.length;
  $('#exFill').style.width=(EX.i/n*100)+'%'; $('#exCount').textContent=(EX.i+1)+'/'+n;
  EX.tries=0;
  const c=el('div','card exstep');
  c.innerHTML=`<div class="qtext">${st.q}</div>${st.table?TABLE41A:''}
    ${st.t==='num'? `<div class="numrow"><input type="text" inputmode="decimal" class="numin" placeholder="ta réponse"><span class="unit">${st.u}</span></div>`
      : `<div class="opts">${st.o.map((o,k)=>`<button class="opt" data-k="${k}"><span class="k">${k+1}</span><span>${o}</span></button>`).join('')}</div>`}
    <div class="exfb"></div>
    <div class="btnrow"><button class="btn ghost exhint">💡 Indice</button><button class="btn exok"${st.t==='num'?'':' style="display:none"'}>Vérifier</button></div>`;
  $('#exSteps').appendChild(c);
  const fb=c.querySelector('.exfb');
  c.querySelector('.exhint').onclick=()=>{ sndClick(); EX.tries=Math.max(EX.tries,1); fb.innerHTML=`<div class="astuce">💡 ${st.h}</div>`; };
  const done=(ok)=>{
    if(c.dataset.done) return;
    if(!ok && EX.tries<1){ EX.tries++; sndKo(); fb.innerHTML=`<div class="fb ko"><div class="hd2">❌ Pas encore, réessaie</div><div class="exp">💡 ${st.h}</div></div>`;
      c.querySelectorAll('.opt.wrong').forEach(b=>b.disabled=true); return; }
    c.dataset.done=1; if(ok && EX.tries===0) EX.first++;
    ok? sndOk() : sndKo(); if(ok) addXP(EX.tries===0?12:6);
    c.querySelectorAll('.opt').forEach(b=>{ b.disabled=true; if(+b.dataset.k===st.a) b.classList.add('good'); });
    const inp=c.querySelector('.numin'); if(inp) inp.disabled=true;
    fb.innerHTML=`<div class="fb ${ok?'ok':'ko'}"><div class="hd2">${ok?'✅ Juste':'❌ Voici la correction'}</div><div class="exp">${st.e}</div>
      ${st.svg?EQSVG:''}${st.doute?'<div class="doute">⚠️ À vérifier : énoncé incomplet</div>':''}
      <div class="rep">✍️ <b>À écrire sur ta copie :</b> ${st.rep}</div></div>`;
    const row=c.querySelector('.btnrow'); row.innerHTML='';
    const nx=el('button','btn full', EX.i+1<x.steps.length? 'Étape suivante →' : 'Voir mon résultat →');
    nx.onclick=()=>{ sndClick(); EX.i++; if(EX.i<x.steps.length){ renderExStep(); setTimeout(()=>$$('#exSteps .exstep').pop().scrollIntoView({behavior:'smooth',block:'start'}),50); } else finishExo(); };
    row.appendChild(nx); nx.focus();
  };
  if(st.t==='num'){
    const inp=c.querySelector('.numin');
    const check=()=>{ const v=parseFloat(inp.value.replace(',','.').replace(/[^0-9.\-]/g,'')); if(isNaN(v)){ toast('Écris un nombre 🙂'); return; }
      done(Math.abs(v-st.v)<=st.tol); };
    c.querySelector('.exok').onclick=check;
    inp.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); check(); } });
    setTimeout(()=>inp.focus(),50);
  } else c.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ if(c.dataset.done) return; const ok=+b.dataset.k===st.a; if(!ok) b.classList.add('wrong','shake'); done(ok); });
}
function finishExo(){
  const x=EX.x, n=x.steps.length, r=S.exo[x.id]||{best:-1};
  r.best=Math.max(r.best,EX.first); S.exo[x.id]=r; save();
  if(EX.step){ S.plan[EX.step]=true; save(); }
  $('#exFill').style.width='100%';
  const c=el('div','card score');
  c.innerHTML=`<div class="note">${EX.first===n?'🏆':'📈'} ${EX.first} / ${n} étapes justes du premier coup</div>
    <div class="verdict">${EX.first===n?'Parfait. Refais-le dans 2 jours pour que ça tienne.':'Refais-le demain : le but est de tout trouver sans indice.'}</div>
    <div class="exsum"><b>Ce que tu écris sur ta copie :</b><ol>${x.steps.map(s=>'<li>'+s.rep+'</li>').join('')}</ol></div>
    <div class="btnrow"><button class="btn ghost" id="exAgain">🔁 Refaire</button><button class="btn" id="exHome">🏠 Accueil</button></div>`;
  $('#exSteps').appendChild(c); c.scrollIntoView({behavior:'smooth',block:'start'});
  if(EX.first===n) confetti(120);
  c.querySelector('#exAgain').onclick=()=>startExo(x.id);
  c.querySelector('#exHome').onclick=()=>{ show('home'); renderHome(); };
  renderHome();
}

/* ── Le vrai contrôle : 40 questions dans l’ordre, 30 min, +1/0 ── */
function startControle(step, random){
  startSession('exam', CHAPTERS.map(c=>c.id), QUESTIONS.length,
    {pool: random? shuffle(QUESTIONS) : QUESTIONS.slice(), fixed:!random, ctrl:true, timer:true, limit:30*60, malus:0, step});
}
function startBonusExam(){
  startSession('exam', CHAPTERS.map(c=>c.id), 20, {pool:shuffle(BONUS).slice(0,20), timer:true, limit:15*60, malus:0});
}

/* ── Planning daté jusqu'au contrôle (vendredi 16 octobre) ──
   Progressif en semaine, à fond le week-end, consolidation ensuite. */
const EXAM_DATE='2026-10-16';
const B=k=>BLOCS[k];
const PLAN = [
 {d:'2026-10-07', t:"On démarre : bloc 1", ic:'🌱', steps:[
   {id:'p07a', m:12, l:"📖 Apprendre le bloc 1 (Q1 à Q10) avec les astuces", act:{k:'bloc', b:0}},
   {id:'p07b', m:8,  l:"🃏 Cartes du bloc 1",                               act:{k:'flashb', b:[0]}} ]},
 {d:'2026-10-08', t:"Bloc 2", ic:'🛡️', steps:[
   {id:'p08a', m:5,  l:"🃏 Cartes du bloc 1 (rappel rapide)",               act:{k:'flashb', b:[0]}},
   {id:'p08b', m:12, l:"📖 Apprendre le bloc 2 (Q11 à Q19)",                act:{k:'bloc', b:1}},
   {id:'p08c', m:8,  l:"🃏 Cartes du bloc 2",                               act:{k:'flashb', b:[1]}} ]},
 {d:'2026-10-09', t:"Bloc 3 : les habilitations", ic:'🪪', steps:[
   {id:'p09a', m:6,  l:"🔁 Répétition espacée (ce qui commence à s’oublier)", act:{k:'review', n:15}},
   {id:'p09b', m:5,  l:"📘 Lire la fiche « Habilitations » (B0, BS, BR, BC…)", act:{k:'course', c:['c3']}},
   {id:'p09c', m:14, l:"📖 Apprendre le bloc 3 (Q20 à Q32)",                act:{k:'bloc', b:2}} ]},
 {d:'2026-10-10', t:"WEEK-END À FOND (1) : tout le QCM + l’exercice", ic:'🔥', steps:[
   {id:'p10a', m:10, l:"🃏 Cartes des blocs 1 et 2",                        act:{k:'flashb', b:[0,1]}},
   {id:'p10b', m:10, l:"🃏 Cartes du bloc 3",                               act:{k:'flashb', b:[2]}},
   {id:'p10c', m:12, l:"📖 Apprendre le bloc 4 (Q33 à Q40)",                act:{k:'bloc', b:3}},
   {id:'p10d', m:8,  l:"🃏 Cartes du bloc 4",                               act:{k:'flashb', b:[3]}},
   {id:'p10e', m:20, l:"🧮 Exercice 2 (défaut d’isolement TT), avec les indices", act:{k:'exo', e:'e2'}},
   {id:'p10f', m:15, l:"🔀 Les 40 en aléatoire (avec correction)",           act:{k:'random'}},
   {id:'p10g', m:30, l:"📝 1<sup>er</sup> contrôle blanc, dans l’ordre (30 min)", act:{k:'ctrl'}},
   {id:'p10h', m:8,  l:"❌ Refaire mes erreurs",                            act:{k:'err'}} ]},
 {d:'2026-10-11', t:"WEEK-END À FOND (2) : viser l’objectif", ic:'🔥', steps:[
   {id:'p11a', m:10, l:"🔁 Répétition espacée",                             act:{k:'review', n:25}},
   {id:'p11b', m:15, l:"🧮 Exercice 2 : le refaire en utilisant le moins d’indices possible", act:{k:'exo', e:'e2'}},
   {id:'p11c', m:30, l:"🎲 Contrôle blanc en aléatoire (30 min)",           act:{k:'ctrlR'}},
   {id:'p11d', m:10, l:"❌ Refaire mes erreurs du contrôle",                act:{k:'err'}},
   {id:'p11e', m:15, l:"🚀 Bonus : habilitations et consignation (même style)", act:{k:'bonus', c:['c3','c4']}},
   {id:'p11f', m:5,  l:"🧩 Exercice 1 (double défaut, énoncé incomplet)",    act:{k:'exo', e:'e1'}} ]},
 {d:'2026-10-12', t:"Entretien", ic:'🔧', steps:[
   {id:'p12a', m:10, l:"🔁 Répétition espacée",                             act:{k:'review', n:20}},
   {id:'p12b', m:5,  l:"⚡ Défi 5 minutes",                                  act:{k:'rush'}},
   {id:'p12c', m:5,  l:"❌ Refaire mes erreurs",                            act:{k:'err'}} ]},
 {d:'2026-10-13', t:"Contrôle blanc + exercice", ic:'📝', steps:[
   {id:'p13a', m:30, l:"🎲 Contrôle blanc en aléatoire (30 min)",           act:{k:'ctrlR'}},
   {id:'p13b', m:10, l:"🧮 Exercice 2 sans indice, comme le jour J",        act:{k:'exo', e:'e2'}},
   {id:'p13c', m:8,  l:"❌ Refaire mes erreurs",                            act:{k:'err'}} ]},
 {d:'2026-10-14', t:"Dernier gros entraînement", ic:'🎯', steps:[
   {id:'p14a', m:30, l:"📝 Dernier contrôle blanc dans l’ordre : vise ton objectif", act:{k:'ctrl'}},
   {id:'p14b', m:8,  l:"❌ Refaire mes erreurs",                            act:{k:'err'}},
   {id:'p14c', m:15, l:"🚀 Contrôle inédit (20 questions nouvelles)",        act:{k:'bonusExam'}} ]},
 {d:'2026-10-15', t:"La veille : léger, tout est déjà fait 😌", ic:'🌙', steps:[
   {id:'p15a', m:10, l:"🔁 Répétition espacée, rien de nouveau",            act:{k:'review', n:15}},
   {id:'p15b', m:5,  l:"📘 Relire l’antisèche avec les astuces",            act:{k:'course', c:['c1','c2','c3','c4']}},
   {id:'p15c', m:1,  l:"Et c’est tout : soirée tranquille, dodo tôt 😴",   act:{k:'none'}} ]},
 {d:'2026-10-16', t:"JOUR J 💪", ic:'🏁', steps:[
   {id:'p16a', m:5,  l:"(Facultatif) 5 min sur l’antisèche le matin, pas plus", act:{k:'course', c:['c1','c2','c3','c4']}},
   {id:'p16b', m:1,  l:"Au QCM : réponds à TOUT, aucune case vide (pas de points négatifs)", act:{k:'none'}},
   {id:'p16c', m:1,  l:"À l’exercice : écris les formules avant les calculs, avec les unités", act:{k:'none'}} ]}
];
function planSteps(){ return PLAN.flatMap(d=>d.steps); }
function planDone(id){ return !!S.plan[id]; }
function dayLabel(d){ return new Date(d+'T12:00').toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'}); }
function planToday(){ const t=today(); return PLAN.find(d=>d.d===t) || null; }
function planCurrent(){ // jour du planning à travailler : aujourd'hui, ou le 1er jour passé pas fini
  const t=today(); const late=PLAN.find(d=>d.d<t && d.steps.some(s=>!planDone(s.id) && s.act.k!=='none'));
  return late || planToday();
}
function runStep(st){
  sndClick();
  const a=st.act, mark=()=>{ S.plan[st.id]=true; save(); renderPlan(); };
  if(a.k==='none'){ mark(); toast('💪 Bonne chance !'); return; }
  if(a.k==='exo'){ startExo(a.e); EX.step=st.id; return; }
  if(a.k==='course'){
    mark(); show('course');
    $$('#courseList .acc').forEach((el2,i)=>el2.classList.toggle('open', i<CHAPTERS.length && a.c.includes(CHAPTERS[i].id)));
    const first=$$('#courseList .acc')[CHAPTERS.findIndex(c=>c.id===a.c[0])];
    if(first) setTimeout(()=>first.scrollIntoView({behavior:'smooth',block:'start'}),60);
    return;
  }
  if(a.k==='flashb'){ mark(); startFlash(null, !!a.ordered, a.b.flatMap(k=>blocQs(B(k)))); return; }
  if(a.k==='bloc'){ const l=blocQs(B(a.b)), fresh=l.every(q=>lvl(q)<0);
    startSession('learn', CHAPTERS.map(c=>c.id), l.length, {pool: fresh? l : shuffle(l), fixed:fresh, step:st.id}); return; }
  if(a.k==='random'){ startSession('learn', CHAPTERS.map(c=>c.id), QUESTIONS.length, {pool:shuffle(QUESTIONS), step:st.id}); return; }
  if(a.k==='ctrl'){ startControle(st.id); return; }
  if(a.k==='ctrlR'){ startControle(st.id, true); return; }
  if(a.k==='rush'){ startSession('exam', CHAPTERS.map(c=>c.id), QUESTIONS.length, {pool:shuffle(QUESTIONS), timer:true, limit:300, malus:0, rush:true, step:st.id}); return; }
  if(a.k==='bonus'){ const pool=BONUS.filter(q=>a.c.includes(q.c)); startSession('learn', a.c, pool.length, {pool:shuffle(pool), step:st.id}); return; }
  if(a.k==='bonusExam'){ startSession('exam', CHAPTERS.map(c=>c.id), 20, {pool:shuffle(BONUS).slice(0,20), timer:true, limit:15*60, malus:0, step:st.id}); return; }
  if(a.k==='err'){
    const pool=QUESTIONS.filter(q=>{const r=S.q[q.id];return r&&r.lastKo;});
    if(!pool.length){ toast('Aucune erreur en attente 🎉'); mark(); return; }
    startSession('learn', CHAPTERS.map(c=>c.id), pool.length, {pool:shuffle(pool), step:st.id}); return;
  }
  if(a.k==='review'){
    const pool=poolReview();
    if(!pool.length){ toast('Rien à réviser pour l’instant — étape suivante 🙂'); mark(); return; }
    startSession('review', CHAPTERS.map(c=>c.id), Math.min(a.n,pool.length), {pool, step:st.id});
    return;
  }
}
function renderPlan(){
  const box=$('#planList'); if(!box) return;
  const all=planSteps().filter(s=>s.act.k!=='none'), done=all.filter(s=>planDone(s.id)).length;
  $('#planPct').textContent=pct(done,all.length)+' %';
  const t=today(), dl=Math.ceil((new Date(EXAM_DATE+'T12:00')-new Date(t+'T12:00'))/864e5);
  $('#planDay').textContent = dl>1? 'J-'+dl : dl===1? 'Demain !' : dl===0? 'Jour J' : 'Terminé';
  box.innerHTML='';
  const cur=planCurrent();
  PLAN.forEach(d=>{
    const st2=d.steps.filter(s=>s.act.k!=='none');
    const nd=st2.filter(s=>planDone(s.id)).length, p=pct(nd,st2.length||1);
    const mins=d.steps.reduce((s,x)=>s+x.m,0);
    const isT=d.d===t, past=d.d<t, wk=/WEEK-END/.test(d.t);
    const acc=el('div','acc pday'+(cur===d?' open':'')+(isT?' today':'')+(wk?' wk':'')+(past&&p===100?' ok':''));
    acc.innerHTML=`<button class="ah"><span class="em">${p===100&&st2.length?'✅':d.ic}</span>
      <span><span style="display:block">${dayLabel(d.d)}${isT?' <span class="tday">aujourd’hui</span>':''}${past&&p<100?' <span class="late">en retard</span>':''}</span>
      <small style="font-weight:400;color:var(--txt3);font-size:.74rem">${esc(d.t)} · ${mins} min · ${nd}/${st2.length}</small></span>
      <span style="margin-left:auto;display:flex;align-items:center;gap:9px">
        <span style="font-family:var(--fm);font-size:.8rem;font-weight:800;color:${p===100?'var(--ok)':'var(--txt3)'}">${p}%</span>
        <span class="ar">›</span></span></button><div class="ab"></div>`;
    const body=acc.querySelector('.ab');
    d.steps.forEach(st=>{
      const ok=planDone(st.id);
      const row=el('div','pstep');
      row.innerHTML=`<button class="pchk${ok?' on':''}" title="Marquer fait">${ok?'✓':''}</button>
        <span class="ptxt"><b>${st.l}</b><small>${st.m} min</small></span>
        ${st.act.k==='none'?'':`<button class="pgo">${ok?'Refaire':'Go'} →</button>`}`;
      row.querySelector('.pchk').onclick=()=>{ S.plan[st.id]=!ok; save(); renderPlan(); renderHome(); sndClick(); };
      if(row.querySelector('.pgo')) row.querySelector('.pgo').onclick=()=>runStep(st);
      body.appendChild(row);
    });
    acc.querySelector('.ah').onclick=()=>{ acc.classList.toggle('open'); sndClick(); };
    box.appendChild(acc);
  });
  const note=el('div','tip');
  note.innerHTML='<b>En retard d’un jour ?</b> Pas grave : fais les étapes en retard d’abord, le bouton ▶ Continuer de l’accueil te les propose dans l’ordre. Le gros du travail se fait le week-end 🔥, la veille on ne fait presque rien.';
  note.style.marginTop='14px';
  box.appendChild(note);
}

/* ── Statistiques ──────────────────────────────────────── */
function renderStats(){
  const bars=$('#statBars'); bars.innerHTML='';
  CHAPTERS.forEach(c=>{
    const st=chapStats(c.id);
    const b=el('div','bar',
      `<div class="lb"><span>${c.ic} ${c.n}. ${esc(c.short)}</span>
        <b style="color:${c.col}">${st.tot? st.acc+'%':'—'} <span style="color:var(--txt3);font-weight:400">(${st.seen}/${st.n})</span></b></div>
       <div class="tr"><i style="width:${st.tot?st.acc:0}%;background:${c.col}"></i></div>`);
    bars.appendChild(b);
  });

  const weak=QUESTIONS.map(q=>({q, r:S.q[q.id]}))
    .filter(x=>x.r && x.r.ko>0)
    .sort((a,b)=>(b.r.ko-b.r.ok)-(a.r.ko-a.r.ok) || b.r.ko-a.r.ko)
    .slice(0,12);
  const wl=$('#weakList');
  if(!weak.length){ wl.innerHTML='<div class="empty">Aucune erreur enregistrée pour l’instant. Lance une session pour voir apparaître tes points faibles ici.</div>'; }
  else{
    wl.innerHTML='';
    weak.forEach(x=>{
      const d=el('div','weak',
        `<span class="n">${x.r.ko}✗</span><span><b style="color:${CH[x.q.c].col}">${CH[x.q.c].n}.</b> ${x.q.q}</span>`);
      d.style.cursor='pointer';
      d.onclick=()=>startSession('learn',[x.q.c],1,{pool:[x.q]});
      wl.appendChild(d);
    });
    const go=el('button','btn full','🎯 Rejouer ces '+weak.length+' questions');
    go.style.marginTop='14px';
    go.onclick=()=>startSession('learn', CHAPTERS.map(c=>c.id), weak.length, {pool:weak.map(x=>x.q)});
    wl.appendChild(go);
  }

  const hl=$('#histList');
  if(!S.sessions.length){ hl.innerHTML='<div class="empty">Aucune session terminée pour l’instant.</div>'; }
  else{
    hl.innerHTML='';
    S.sessions.slice(0,12).forEach(s=>{
      const p=pct(s.good,s.total), col=p>=80?'var(--ok)':p>=50?'var(--warn)':'var(--bad)';
      const nm=s.ctrl? '🎯 Contrôle an dernier' : ({learn:'🎓 Apprentissage',exam:'⏱️ Examen',review:'🔁 Révision'}[s.mode]||s.mode);
      hl.appendChild(el('div','weak',
        `<span class="n" style="color:${col};border-color:${col};background:transparent">${p}%</span>
         <span>${nm} — ${s.good}/${s.ctrl? QUESTIONS.length : s.total} · <span style="color:var(--txt3)">${new Date(s.d).toLocaleDateString('fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}</span></span>`));
    });
  }
}

/* ── Lightbox ──────────────────────────────────────────── */
function openLB(src){ const lb=$('#lightbox'); lb.querySelector('img').src=src; lb.classList.add('on'); }
$('#lightbox').onclick=()=>$('#lightbox').classList.remove('on');

/* ── Événements ────────────────────────────────────────── */
$$('nav button').forEach(b=>b.onclick=()=>{ sndClick(); show(b.dataset.view);
  if(b.dataset.view==='stats') renderStats(); if(b.dataset.view==='home') renderHome(); if(b.dataset.view==='plan') renderPlan(); });
$$('.mode,.cbtn[data-mode]').forEach(b=>b.onclick=()=>{ sndClick();
  const m=b.dataset.mode;
  if(m==='ctrl'){ startControle(); return; }
  if(m==='flash'){ startFlash(null); return; }
  if(m==='review'){
    const pool=poolReview();
    if(!pool.length){ toast('Rien à réviser : réponds d’abord à quelques questions 🙂'); return; }
    startSession('review', CHAPTERS.map(c=>c.id), Math.min(20,pool.length), {pool});
  } else openSetup(m);
});
function poolReview(){
  const now=Date.now();
  const due=QUESTIONS.filter(q=>{const r=S.q[q.id];return r&&r.seen&&r.due<=now;});
  const bad=QUESTIONS.filter(q=>{const r=S.q[q.id];return r&&r.lastKo;});
  const set=new Set(); const out=[];
  [...due,...bad].forEach(q=>{ if(!set.has(q.id)){set.add(q.id);out.push(q);} });
  return out;
}
$('#btnAll').onclick=()=>{ sndClick(); startSession('learn', CHAPTERS.map(c=>c.id), QUESTIONS.length); };
$('#btnOrder').onclick=()=>{ sndClick(); startSession('learn', CHAPTERS.map(c=>c.id), QUESTIONS.length, {pool:QUESTIONS.slice(), fixed:true}); };
$('#btnRandom').onclick=()=>{ sndClick(); startSession('learn', CHAPTERS.map(c=>c.id), QUESTIONS.length, {pool:shuffle(QUESTIONS)}); };
$('#btnCtrlRandom').onclick=()=>{ sndClick(); startControle(null,true); };
$('#btnRush').onclick=()=>{ sndClick(); startSession('exam', CHAPTERS.map(c=>c.id), QUESTIONS.length, {pool:shuffle(QUESTIONS), timer:true, limit:300, malus:0, rush:true}); };
$('#btnBonusAll').onclick=()=>{ sndClick(); startSession('learn', CHAPTERS.map(c=>c.id), BONUS.length, {pool:shuffle(BONUS)}); };
$('#btnBonusExam').onclick=()=>{ sndClick(); startBonusExam(); };
$('#btnFlashOrder').onclick=()=>{ sndClick(); startFlash(null,true); };
$('#exQuit').onclick=()=>{ sndClick(); show('home'); renderHome(); };
$('#flQuit').onclick=()=>{ sndClick(); show('home'); renderHome(); renderStats(); };
$('#btnErr').onclick=()=>{ sndClick();
  const pool=QUESTIONS.filter(q=>{const r=S.q[q.id];return r&&r.lastKo;});
  if(!pool.length){ toast('Aucune erreur en attente — bien joué ! 🎉'); return; }
  startSession('learn', CHAPTERS.map(c=>c.id), Math.min(25,pool.length), {pool:shuffle(pool)});
};
$('#setupBack').onclick=()=>{ sndClick(); show('home'); };
$('#setupGo').onclick=()=>{ sndClick(); startSession(cfg.mode, cfg.chaps, cfg.count, {timer:cfg.timer, diff:cfg.diff, malus:cfg.malus}); };
$('#quitBtn').onclick=()=>{
  if(SES && SES.answers.length && !confirm('Quitter la session en cours ? Tes XP sont déjà enregistrés.')) return;
  if(SES && SES.tick) clearInterval(SES.tick);
  SES=null; save(); show('home'); renderHome(); renderStats();
};
$('#resHome').onclick=()=>{ sndClick(); show('home'); renderHome(); };
$('#themeBtn').onclick=()=>{ S.theme = S.theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=S.theme; save(); renderHeader(); sndClick(); };
$('#soundBtn').onclick=()=>{ S.snd=!S.snd; save(); renderHeader(); if(S.snd) sndOk(); };
$('#btnReset').onclick=()=>{ if(confirm('Effacer toute ta progression (XP, badges, historique) ?')){
  localStorage.removeItem(KEY); S=blank(); document.documentElement.dataset.theme=S.theme;
  renderHeader(); renderHome(); renderStats(); toast('Progression réinitialisée.'); } };

document.addEventListener('keydown', e=>{
  if($('#v-flash').classList.contains('on') && FL && FL.i<FL.list.length){
    const c=$('#flCard');
    if(e.key===' '||e.key==='Enter'){ e.preventDefault(); if(!c.classList.contains('rev')) flReveal(); else flJudge(true); }
    else if(c.classList.contains('rev') && (e.key==='ArrowLeft'||e.key==='0')) flJudge(false);
    else if(c.classList.contains('rev') && e.key==='ArrowRight') flJudge(true);
    return;
  }
  if(!$('#v-quiz').classList.contains('on')) return;
  if(e.key==='Enter'){ const b=$('#btnVal'); if(b && !b.disabled && b.style.display!=='none'){ e.preventDefault(); b.click(); } return; }
  const n=parseInt(e.key,10);
  if(n>=1 && n<=9 && !CUR.answered){
    const opts=$$('#qCard .opt');
    if(opts[n-1]) { opts[n-1].click(); e.preventDefault(); }
  }
});

/* ── Démarrage ─────────────────────────────────────────── */
document.documentElement.dataset.theme = S.theme;
if(typeof OWNER==='string' && OWNER){
  const g=$('#greet'); if(g) g.innerHTML='👋 Salut '+esc(OWNER)+' — ta révision SECU3';
  if(typeof ACCENT==='object'){ const r=document.documentElement.style; r.setProperty('--acc',ACCENT[0]); r.setProperty('--acc2',ACCENT[1]); }
  document.title='Quiz SECU3 — '+OWNER;
}
// remise à zéro de la série quotidienne si un jour a été sauté
(function(){ if(S.day.last){ const y=new Date(Date.now()-864e5).toISOString().slice(0,10);
  if(S.day.last!==today() && S.day.last!==y) S.day.streak=0; } })();
renderHeader(); renderHome(); renderCourse(); renderStats(); renderPlan();
if(!S.goal.set) setTimeout(openGoal,400);
console.log('SECU3 Quiz — '+QUESTIONS.length+' questions chargées.');
