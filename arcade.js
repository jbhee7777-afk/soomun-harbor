/* ===== 섬 도전 놀이 (섬마다 3가지 · 모두 30가지) =====
   index.html 의 본 스크립트보다 먼저 읽혀요. 그래서 여기 맨 위에서는 S · CH 같은 본게임 값을 쓰지 않고,
   함수 안에서만 (불릴 때) 써요. 놀이 30가지는 arcade-games.js 가 arcDefine() 으로 등록해요.

   놀이 한 가지 = {id, ch(구역 id), name, from(원조 게임), icon, how:[설명 줄], init(G) → {update(dt), draw(ctx), down/move/up(x,y), tap(x,y), swipe(dir), key(k)}}
   G (놀이에 건네는 도구): 360×540 논리 좌표 캔버스 · lv(1~10 단계) · d(0~1 난이도: 학년 + 단계) · emo/text/rr 그리기 · burst/pop 효과
     · setHud(a,b,c) · score · win(별 1~3) · lose(까닭) · btns(캔버스 단추)
   저장: S.arc[놀이 id] = {s:[단계별 별 10칸], best:최고 점수, plays}
   보상: 단계를 깨면 그 섬의 ⭐ (처음 깨거나 별이 늘면 늘어난 만큼, 다시 깨도 최소 1개) · 메달(동 5단계 · 은 10단계 · 금 별 30개) 보너스 ⭐ */
const AW=360, AH=540, ARC_N=10;
const ARC_GAMES=[], ARC_DEF={};
function arcDefine(g){const i=ARC_GAMES.findIndex(x=>x.id===g.id);if(i>=0)ARC_GAMES[i]=g;else ARC_GAMES.push(g);ARC_DEF[g.id]=g} /* 같은 id 를 다시 정의하면 바꿔 끼워요 */
const ARC_MEDAL=[{e:'🥉',n:'동메달',t:'5단계 깨기',bonus:2},{e:'🥈',n:'은메달',t:'10단계 모두 깨기',bonus:3},{e:'🥇',n:'금메달',t:'별 30개 모두 모으기',bonus:5}];
const ARC_RANK=[[0,'새내기 탐정'],[15,'꼬마 탐정'],[45,'똑똑 탐정'],[100,'솜씨 탐정'],[200,'명탐정'],[400,'전설의 탐정'],[700,'항구의 영웅']];
const EMOF='"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';

function arcGamesOf(ci){const id=CH[ci].id;if(typeof ISLE_SET!=='undefined'&&ISLE_SET[id])return ISLE_SET[id].map(x=>ARC_DEF[x]).filter(Boolean);return ARC_GAMES.filter(g=>g.ch===id)}
function arcRec(id){if(!S.arc||typeof S.arc!=='object')S.arc={};let r=S.arc[id];
  if(!r||!Array.isArray(r.s))r=S.arc[id]={s:Array(ARC_N).fill(0),best:0,plays:0};while(r.s.length<ARC_N)r.s.push(0);return r}
function arcStars(id){return arcRec(id).s.reduce((a,b)=>a+b,0)}
function arcCleared(id){return arcRec(id).s.filter(x=>x>0).length}
function arcMedal(id){const n=arcCleared(id),s=arcStars(id);return s>=30?2:n>=10?1:n>=5?0:-1}
function arcTotal(){return ARC_GAMES.reduce((a,g)=>a+arcStars(g.id),0)}
function arcMedals(){return ARC_GAMES.reduce((a,g)=>a+(arcMedal(g.id)+1),0)}
function arcRank(t){let r=ARC_RANK[0],nx=null;for(const x of ARC_RANK){if(t>=x[0])r=x;else if(!nx)nx=x}return {r,nx}}
/* 난이도 0~1: 학년마다 +0.05, 단계마다 +0.075 (1학년 1단계 0 · 6학년 10단계 0.93) */
function arcDiff(lv){const g=curGrade()||3;return Math.max(0,Math.min(1,.02+.98*Math.pow((lv-1)/9,1.1)+(g-3)*.035))}
function arcUnlocked(id,lv){return lv===1||arcRec(id).s[lv-2]>0}

/* ---------- 화면 모양 ---------- */
(function(){const st=document.createElement('style');st.textContent=`
#arc{display:flex;flex-direction:column;gap:8px;padding:10px 12px 14px;height:100%;box-sizing:border-box;overflow:hidden;color:#FFF3D6;font-family:var(--disp);
  background:radial-gradient(ellipse at 50% 0%,color-mix(in srgb,var(--tint,#3C6FD1) 55%,#1B1230) 0%,#1B1230 62%,#0E0A1A 100%)}
#arc .topbar{flex:none}
.arcT{display:flex;flex-direction:column;line-height:1.05;min-width:0}
.arcT small{font-size:13px;color:#FFE9A8}.arcT b{font-weight:400;font-size:20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#arcBody{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;gap:8px;overflow:auto}
.arcsel{width:min(760px,100%);display:grid;gap:12px;padding-bottom:12px}
.archead{display:flex;gap:14px;align-items:center;padding:14px;border-radius:20px;background:linear-gradient(180deg,#FBF0D4,#ECD5A4);color:#2A1A0E;border:4px solid #6B3D1F;box-shadow:0 0 0 3px #D9A441,0 10px 20px rgba(0,0,0,.4)}
.arcspr{width:1em;height:1em;object-fit:contain;vertical-align:middle}.arcico .arcspr{width:70px;height:70px}
.arcico{flex:none;width:84px;height:84px;border-radius:20px;display:grid;place-items:center;font-size:56px;font-family:${EMOF};background:radial-gradient(circle at 40% 35%,#fff,var(--tintL,#eee));border:3px solid #6B3D1F}
.arcinfo{min-width:0}.arcinfo h2{margin:0;font-size:28px;color:#4A240E}
.arcfrom{display:inline-block;font-size:14px;background:#4E2C14;color:#FFE27A;border-radius:99px;padding:2px 10px;margin:2px 0 6px}
.arcinfo p{margin:2px 0;font-size:16px;color:#5A3A1E;line-height:1.4}
.arcmeta{display:flex;flex-wrap:wrap;gap:8px}
.arcchip{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:14px;background:linear-gradient(#3B2A1C,#24170E);border:3px solid #8A5B1C;font-size:17px}
.arcchip .m{font-family:${EMOF};font-size:22px}.arcchip.dim{opacity:.55}
.arcgrid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;width:100%;max-width:480px;margin:0 auto}
.arclv{position:relative;aspect-ratio:1/.86;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;font-size:26px;
  background:linear-gradient(180deg,#C98F55,#8A552B);border:3px solid #4E2C14;box-shadow:inset 0 2px 0 rgba(255,255,255,.25),0 5px 0 #3A1F0C;color:#FFF8E6;text-shadow:0 2px 0 #3A1F0C}
.arclv small{font-size:12px;opacity:.9}.arclv .st{font-family:${EMOF};font-size:13px;letter-spacing:-1px}
.arclv.lock{background:linear-gradient(180deg,#5A4A5C,#3A2E3C);color:#A898A8;cursor:not-allowed}
.arclv.next{background:linear-gradient(180deg,#FFCF5A,#E08A1A);animation:hxhot 1.2s ease-in-out infinite alternate}
.arclv.done3{background:linear-gradient(180deg,#7FD69A,#2F9E5B)}
.arcsel .row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
.arcplay{width:100%;flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;gap:6px}
.archud{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;width:100%}
.archud .arcchip{font-size:18px;padding:4px 12px;min-width:70px;justify-content:center}
.arcstage{flex:1;min-height:0;width:100%;position:relative;overflow:hidden}
#arcCv{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:block;border-radius:18px;border:4px solid #6B3D1F;box-shadow:0 0 0 3px #D9A441,0 12px 24px rgba(0,0,0,.5);touch-action:none;background:#120C1E;cursor:pointer}
.arcdiff{display:inline-flex;gap:2px;vertical-align:middle}.arcdiff i{width:9px;height:14px;border-radius:3px;background:#5A4A5C}.arcdiff i.on{background:linear-gradient(#FFE27A,#E08A1A)}
.arcres .big{font-family:${EMOF};font-size:60px;line-height:1}
.arcres .gain{display:inline-flex;align-items:center;gap:6px;font-size:22px;background:#4E2C14;color:#FFE27A;border-radius:99px;padding:4px 16px;margin:6px 0}
.arcres .medal{margin:8px auto;padding:8px 14px;border-radius:16px;background:linear-gradient(90deg,#FFF3B0,#FFD24A);border:3px solid #8A5410;color:#4A240E;font-size:20px;animation:qpop .7s}
.arcres .nextgoal{font-size:16px;color:#6B4A2E;margin-top:6px}
.arcboard{display:grid;gap:10px}
.arcisle{border-radius:16px;padding:10px;background:rgba(0,0,0,.08);border:2px solid #C9A877}
.arcisle h3{margin:0 0 6px;font-size:18px;color:#4A240E}
.arcisle .gs{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.arcg{display:flex;flex-direction:column;align-items:center;padding:6px;border-radius:12px;background:#FFF8E6;border:2px solid #E0C090;font-size:13px;color:#4A240E;text-align:center}
.arcg .e{font-family:${EMOF};font-size:28px}.arcg .m{font-family:${EMOF};font-size:16px;min-height:20px}
/* 허브: 별 → 단서 → 진실 목표 막대 */
.hxgoal{pointer-events:auto;display:flex;align-items:center;gap:8px;margin-top:6px;padding:6px 10px;border-radius:16px;background:linear-gradient(90deg,rgba(40,18,6,.92),rgba(70,36,12,.88));border:2px solid #D9A441;box-shadow:0 4px 12px rgba(0,0,0,.5);font-size:16px;color:#FFF3D6;cursor:pointer;max-width:min(560px,92vw)}
.hxgoal .gbar{position:relative;flex:1;min-width:90px;height:18px;border-radius:99px;background:#2A1A38;border:2px solid #FFD24A;overflow:hidden}
.hxgoal .gbar i{position:absolute;inset:0 auto 0 0;background:linear-gradient(180deg,#FFE27A,#E0A020);transition:width .5s}
.hxgoal .gbar span{position:absolute;inset:0;display:grid;place-items:center;font-size:13px;color:#3A1F0C;text-shadow:0 1px 0 rgba(255,255,255,.6)}
.hxgoal .gcl{display:flex;gap:2px}.hxgoal .gcl b{width:22px;height:22px;border-radius:6px;display:grid;place-items:center;font-size:13px;font-weight:400;background:#3A2A4C;border:2px solid #8A5B1C;color:#8A7A9A}
.hxgoal .gcl b.on{background:linear-gradient(#FFE27A,#E0A020);color:#3A1F0C;border-color:#FFF3B0}
.hxgoal .gcl b.nx{border-color:#FFE27A;color:#FFE27A;animation:hxhot 1s ease-in-out infinite alternate}
.hxgoal.ready{border-color:#FFE27A;box-shadow:0 0 22px #FFCF5A}
.hxgoal .gt{white-space:nowrap}
.clueban{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:60;pointer-events:none;text-align:center;padding:16px 26px;border-radius:22px;
  background:linear-gradient(180deg,#FBF0D4,#ECD5A4);color:#2A1A0E;border:4px solid #6B3D1F;box-shadow:0 0 0 3px #D9A441,0 0 60px rgba(255,210,74,.8);animation:clueb 3.4s ease forwards;font-family:var(--disp)}
.clueban .e{font-family:${EMOF};font-size:54px;display:block;line-height:1.1}.clueban b{font-weight:400;font-size:26px;color:#A3303C;display:block}.clueban small{font-size:17px;color:#5A3A1E}
@keyframes clueb{0%{opacity:0;transform:translate(-50%,-30px) scale(.6)}12%{opacity:1;transform:translate(-50%,0) scale(1.05)}18%{transform:translate(-50%,0) scale(1)}85%{opacity:1}100%{opacity:0;transform:translate(-50%,-20px)}}
.flowmap{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:6px;margin:10px 0}
.flowmap div{position:relative;padding:10px 6px;border-radius:14px;background:#FFF8E6;border:2px solid #E0C090;text-align:center;font-size:14px;color:#4A240E}
.flowmap .e{display:block;font-family:${EMOF};font-size:30px}.flowmap b{display:block;font-weight:400;font-size:16px}
.flowmap div.on{background:linear-gradient(180deg,#FFF3B0,#FFD24A);border-color:#8A5410}
.cvseal{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:10px 0}
.cvseal span{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;font-size:26px;font-family:${EMOF};background:#3A2A4C;filter:grayscale(1);opacity:.45;border:2px solid #8A5B1C}
.cvseal span.on{filter:none;opacity:1;background:linear-gradient(#FFF3B0,#FFD24A)}
.cvrules{text-align:left;margin:8px auto;max-width:440px;padding-left:20px;font-size:17px;line-height:1.6;color:#4A240E}
.fstats{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0}.fstats div{background:#FFF8E6;border:2px solid #E0C090;border-radius:12px;padding:6px}
.fstats b{display:block;font-weight:400;font-size:22px;color:#A3303C}.fstats small{font-size:13px;color:#6B4A2E}
.mxgate{position:absolute;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:5;display:flex;align-items:center;gap:10px;padding:8px 18px 8px 10px;border-radius:999px;
  background:linear-gradient(180deg,#3A2A4C,#1B1230);border:3px solid #8A5B1C;box-shadow:0 0 0 2px #2A1A0A,0 8px 18px rgba(0,0,0,.6);color:#FFF3D6;font-family:var(--disp);font-size:19px}
.mxgate .e{font-family:${EMOF};font-size:30px}.mxgate small{display:block;font-size:13px;color:#CBB8FF}
.mxgate.open{background:linear-gradient(180deg,#6B3BB0,#2A1846);border-color:#FFE27A;animation:hxhot 1.2s ease-in-out infinite alternate}
.mxgate.won{background:linear-gradient(180deg,#FFCF5A,#E08A1A);color:#3A1F0C}
.arcbottle{cursor:pointer;background:linear-gradient(180deg,#7A5BC7,#4A2E8A)!important;border-color:#CBB8FF!important;animation:hxhot .9s ease-in-out infinite alternate}
.kcard{margin:10px 0;padding:16px 18px;border-radius:18px;background:#FFF8E6;border:3px dashed #D9A441;font-size:21px;line-height:1.55;color:#3A240E;text-align:left}
.kcard small{display:block;font-size:14px;color:#8A552B;margin-bottom:4px}
.kq{font-size:16px;color:#6B4A2E;margin:6px 0 0}
.cquiz{display:inline-block;margin:4px 0;padding:4px 14px;border-radius:99px;font-size:17px}
.cquiz.ok{background:#BFF0C8;color:#1F6B4A}.cquiz.no{background:#FFD0D0;color:#8A2020}
#arcTrial{position:fixed;inset:0;z-index:57;display:flex;flex-direction:column;gap:8px;padding:10px 12px 14px;box-sizing:border-box;color:#FFF3D6;font-family:var(--disp);
  background:radial-gradient(ellipse at 50% 0%,#3A2A6A 0%,#140C24 62%,#05030C 100%)}
body.trialOn #modal{z-index:70}
.guessbtns{display:grid!important;grid-template-columns:1fr 1fr;gap:8px}
@media (max-width:520px){.arcgrid{grid-template-columns:repeat(5,1fr);gap:6px}.arclv{font-size:20px;border-radius:12px}.arcico{width:64px;height:64px;font-size:42px}.arcinfo h2{font-size:23px}.fstats{grid-template-columns:repeat(2,1fr)}}
`;document.head.appendChild(st)})();

/* ---------- 상태 ---------- */
let AR=null; /* {id, def, lv, G, st, raf, lt} */
/* 예전 고퀄 놀이(팡팡·블록·퐁당·합치기)를 단계 놀이로 쓸 때: EXT = {id, kind, lv, d, goals, moves, orders, done(win,stars,score,why)} */
let EXT=null;
function arcBackSvg(){return `<svg viewBox="0 0 40 40"><path d="M6 20 L20 7 L34 20" fill="none" stroke="#FFE27A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 18 V33 H30 V18" fill="#F7E9C9" stroke="#4E2C14" stroke-width="2.5" stroke-linejoin="round"/><rect x="17" y="23" width="7" height="10" rx="1.5" fill="#8A552B"/></svg>`}
function diffBars(d){const n=1+Math.round(d*9);return `<span class="arcdiff" title="난이도">${Array.from({length:10},(_,i)=>`<i class="${i<n?'on':''}"></i>`).join('')}</span>`}

function openArc(id){
  const def=ARC_DEF[id]; if(!def) return;
  arcStop(); AR={id,def}; show('arc'); arcSelect();
}
function arcTop(sub,title){
  return `<div class="topbar mghud">
    <button class="hxslot hxbtn" id="arcBack" aria-label="뒤로" title="뒤로">${arcBackSvg()}</button>
    <span class="arcT"><small>${esc(sub)}</small><b>${esc(title)}</b></span>
    <span class="sp" style="flex:1"></span>
    <span class="mgstat" title="이 섬의 별 (단서를 여는 데 써요)"><svg viewBox="0 0 100 100" aria-hidden="true"><use href="#miStar"/></svg><b class="sVal">${chState(CI).stars}</b></span>
    <button class="hxslot hxbtn" id="arcHelp" aria-label="방법" title="방법"><svg viewBox="0 0 40 40"><text x="20" y="29" text-anchor="middle" font-family="Jua" font-size="26" fill="#FFE27A">?</text></svg></button>
  </div>`;
}
/* 단계 고르기 */
function arcSelect(){
  arcStop(); const {id,def}=AR, r=arcRec(id), ch=CH[CI], m=arcMedal(id), tot=arcTotal(), rk=arcRank(tot);
  const nextLv=r.s.findIndex(x=>x===0)+1;
  const el=$('#arc'); el.setAttribute('style',tintVars(ch));
  el.innerHTML=arcTop(ch.place,def.name)+`<div id="arcBody"><div class="arcsel">
    <div class="archead"><div class="arcico">${arcIconHTML(def.icon)}</div><div class="arcinfo"><h2>${esc(def.name)}</h2><span class="arcfrom">원조: ${esc(def.from)}</span>
      ${def.how.map(t=>`<p>· ${esc(t)}</p>`).join('')}</div></div>
    <div class="arcmeta">
      <span class="arcchip" title="이 놀이에서 모은 별">⭐ ${arcStars(id)}/30</span>
      <span class="arcchip" title="깬 단계">🚩 ${arcCleared(id)}/10단계</span>
      ${ARC_MEDAL.map((x,i)=>`<span class="arcchip ${m>=i?'':'dim'}" title="${x.t}"><span class="m">${x.e}</span>${x.n}</span>`).join('')}
      <span class="arcchip" title="가장 높은 점수">🏆 최고 ${(r.best||0).toLocaleString()}</span>
    </div>
    <div class="arcgrid">${Array.from({length:ARC_N},(_,i)=>{const lv=i+1,st=r.s[i],lock=!arcUnlocked(id,lv);
      return `<button class="arclv ${lock?'lock':''} ${lv===nextLv&&!lock?'next':''} ${st===3?'done3':''}" data-lv="${lv}" ${lock?'aria-disabled="true"':''}><small>단계</small>${lock?'🔒':lv}<span class="st">${lock?'':'⭐'.repeat(st)+'·'.repeat(3-st)}</span></button>`}).join('')}</div>
    <div class="arcmeta" style="justify-content:center"><span class="arcchip">${curGrade()?curGrade()+'학년 ':''}난이도 ${diffBars(arcDiff(nextLv>0?nextLv:10))}</span>
      <span class="arcchip" title="30가지 놀이 전체 별">🎖 ${rk.r[1]} · 전체 ⭐${tot}${rk.nx?` (다음 등급까지 ${rk.nx[0]-tot})`:''}</span></div>
    <div class="row"><button class="cbtn ghost" id="arcBoard">🏅 메달판</button><button class="cbtn mint" id="arcGo">${nextLv>0?`${nextLv}단계 도전!`:'10단계 다시 도전!'}</button></div>
    <p class="note" style="text-align:center;color:#FFE9A8;margin:0">단계를 깨면 이 섬의 ⭐을 받아요 → ⭐으로 이야기 단서를 열어요 → 단서 4개면 소문의 진실이 밝혀져요!</p>
  </div></div>`;
  $('#arcBack').onclick=()=>{sfx.tap();arcStop();goHub()};
  $('#arcHelp').onclick=()=>{sfx.tap();arcHow()};
  $('#arcBoard').onclick=()=>{sfx.tap();arcBoard()};
  $('#arcGo').onclick=()=>{sfx.tap();arcPlay(nextLv>0?nextLv:10)};
  el.querySelectorAll('.arclv').forEach(b=>b.onclick=()=>{const lv=+b.dataset.lv;if(!arcUnlocked(id,lv)){sfx.no();toast(`${lv-1}단계를 먼저 깨야 열려요`);return}sfx.tap();arcPlay(lv)});
}
function arcHow(){
  const def=AR.def, nm=AR.trial&&AR.trial.name||def.name;
  const sh=openModal(`<div class="arcKeep"><h2><span class="em">${def.icon}</span> ${esc(nm)}</h2><p class="note">원조 게임: ${esc(def.from)}</p>
    <ul class="cvrules">${def.how.map(t=>`<li>${esc(t)}</li>`).join('')}<li>단계가 올라갈수록, 학년이 높을수록 어려워져요.</li><li>별 3개를 받으려면 실수 없이, 빠르게!</li></ul></div>
    <div class="row"><button class="cbtn" id="ok">알겠어요</button></div>`);
  sh.querySelector('#ok').onclick=closeModal;
}
function arcBoard(){
  const tot=arcTotal(), rk=arcRank(tot);
  const sh=openModal(`<div class="arcKeep"><h2>🏅 도전 메달판</h2><p class="note">전체 ⭐ ${tot} / 900 · 메달 ${arcMedals()} / 90 · 등급 <b>${rk.r[1]}</b>${rk.nx?` → 다음 <b>${rk.nx[1]}</b>까지 ⭐${rk.nx[0]-tot}`:''}</p>
    <div class="arcboard">${CH.map((ch,ci)=>`<div class="arcisle"><h3>${ch.icon} ${esc(ch.place)}</h3><div class="gs">${arcGamesOf(ci).map(g=>{const m=arcMedal(g.id);
      return `<div class="arcg"><span class="e">${g.icon}</span>${esc(g.name)}<span>⭐${arcStars(g.id)} · ${arcCleared(g.id)}단계</span><span class="m">${m>=0?ARC_MEDAL[m].e:''}</span></div>`}).join('')}</div></div>`).join('')}</div></div>
    <div class="row"><button class="cbtn" id="ok">닫기</button></div>`);
  sh.querySelector('#ok').onclick=closeModal;
}

/* ---------- 한 판 ---------- */
function arcRoot(){return AR&&AR.trial?$('#arcTrial'):$('#arc')}
function arcPlay(lv){
  if(AR&&AR.def&&AR.def.ext&&!AR.trial) return arcPlayExt(lv);
  arcStop(); const {id,def}=AR, trial=!!AR.trial, ch=trial?AR.trial.ch:CH[CI], d=trial?AR.trial.d:arcDiff(lv);
  AR.lv=lv; AR.bt=22; AR.card=null; AR.bottles=0;
  const el=arcRoot();
  el.innerHTML=(trial?`<div class="topbar mghud"><span class="arcT"><small>${esc(AR.trial.sub||'소문 던전 시련')}</small><b>${def.icon} ${esc(AR.trial.name||def.name)}</b></span><span class="sp" style="flex:1"></span>
      <button class="hxslot hxbtn" id="arcHelp" aria-label="방법" title="방법"><svg viewBox="0 0 40 40"><text x="20" y="29" text-anchor="middle" font-family="Jua" font-size="26" fill="#FFE27A">?</text></svg></button></div>`
      :arcTop(`${def.name} · ${lv}단계`,`${def.icon} ${def.name}`))+`<div id="arcBody"><div class="arcplay">
    <div class="archud"><span class="arcchip" id="arcH0"></span><span class="arcchip" id="arcH1"></span><span class="arcchip" id="arcH2"></span><button class="arcchip arcbottle" id="arcBottle" hidden>🧪 퀴즈 병</button></div>
    <div class="arcstage" id="arcStage"><canvas id="arcCv" aria-label="${esc(def.name)}"></canvas></div></div></div>`;
  if(!trial) $('#arcBack').onclick=()=>{sfx.tap();ARC_settle();arcSelect()};
  $('#arcHelp').onclick=()=>{sfx.tap();arcHow()};
  $('#arcBottle').onclick=()=>arcBottle();
  const cv=$('#arcCv');
  const G=arcMakeG(cv,lv,d,ch); G.trial=trial; if(trial&&AR.trial.bg)G.bgCol=AR.trial.bg;
  AR.G=G; arcFit(); setTimeout(arcFit,0);
  try{AR.st=def.init(G)||{}}catch(e){console.error(e);AR.st={}}
  if(!trial){const r=arcRec(id); r.plays=(r.plays||0)+1; save()}
  arcInput(cv);
  AR.lt=0; AR.raf=requestAnimationFrame(arcLoop);
  if(trial){if(AR.trial.intro!==false)setTimeout(()=>{if(AR&&AR.G===G)arcHow()},150);return}
  /* 섬 놀이: 시작하기 전에 지식 카드를 읽어요 (단계를 깨면 이 카드로 확인 퀴즈) */
  arcCard(()=>{if(!S.tut['arc_'+id]){S.tut['arc_'+id]=true;save();if(AR&&AR.G===G)arcHow()}});
}
/* 고퀄 놀이 단계: 지식 카드를 읽고 → 그 놀이 화면으로 → 끝나면 arcEnd 로 돌아와 확인 퀴즈 · 별 · 메달 */
function arcPlayExt(lv){
  arcStop(); const {id,def}=AR, d=arcDiff(lv); AR.lv=lv; AR.G={score:0,over:false}; AR.st=null;
  const cfg=def.ext.cfg(d,lv);
  const go=()=>{EXT=Object.assign({id,kind:def.ext.kind,lv,d,t0:performance.now(),cnt:0,done:(win,stars,score,why)=>{EXT=null;if(!AR||AR.id!==id)return;AR.G.score=score||0;AR.G.over=true;show('arc');arcSelectBg();arcEnd(win,stars,why)}},cfg);
    ({match:openMatch,block:openBlock,drop:openDrop,merge:openMerge})[def.ext.kind]();
    setTimeout(()=>toast(cfg.goalText),400)};
  const r=arcRec(id); r.plays=(r.plays||0)+1; save();
  arcCard(go);
}
/* 결과 창 뒤에 보일 단계 고르기 화면 */
function arcSelectBg(){try{const el=$('#arc');el.setAttribute('style',tintVars(CH[CI]));if(!el.innerHTML)el.innerHTML=''}catch(e){}}
/* ---------- 범교과 공부: 지식 카드 → 퀴즈 병 → 확인 퀴즈 ---------- */
function arcCardQ(){let q=null;for(let i=0;i<6;i++){q=drawQ(CI);if(q&&q.x&&q.x.length>=8)break}return q}
function arcCard(after){
  const q=arcCardQ(); AR.card=q; if(!q){after&&after();return}
  const ch=CH[CI], wait=Math.max(3,Math.min(7,Math.round(q.x.length/12)));
  const sh=openModal(`<div class="arcKeep"><h2>📖 지식 카드</h2>
    <div class="kcard" style="${tintVars(ch)}"><small>${ch.icon} ${esc(ch.theme)}</small>${esc(q.x)}</div>
    <p class="kq">🔎 단계를 깨면 이 카드 내용으로 <b>확인 퀴즈</b>가 나와요. 맞히면 보너스 ⭐!</p></div>
    <div class="row"><button class="cbtn mint" id="go" disabled>읽는 중… ${wait}</button></div>`,{closable:false});
  const b=sh.querySelector('#go'); let n=wait;
  const t=setInterval(()=>{n--;if(n>0){b.textContent=`읽는 중… ${n}`}else{clearInterval(t);b.disabled=false;b.textContent='다 읽었어요! 시작 ▶';sfx.tap()}},1000);
  b.onclick=()=>{clearInterval(t);closeModal();sfx.tap();after&&after()};
}
function arcBottle(){
  if(!AR||!AR.G||AR.G.over) return; const b=$('#arcBottle'); if(b) b.hidden=true; AR.bt=24; AR.bottles++;
  const st=AR.st, txt=st&&st.boostText||'점수 +50';
  runQuiz(drawQ(CI),{tag:'🧪 퀴즈 병',title:`맞히면 ${txt}`,closable:false,rightLabel:'부스터 받기!',wrongLabel:'계속하기',
    onRight:()=>{if(!AR||!AR.G)return;if(st&&st.boost)st.boost();else AR.G.addScore(50);AR.G.pop('부스터!',AW/2,AH/2,'#CBB8FF',26);sfx.star()},onWrong:()=>{}});
}
function arcStop(){if(AR&&AR.raf){cancelAnimationFrame(AR.raf);AR.raf=0}if(AR&&AR.G)AR.G.over=true;if(AR){AR.st=null;AR.G=null}}
function arcFit(){
  if(!AR||!AR.G) return; const cv=$('#arcCv'), box=$('#arcStage'); if(!cv||!box) return;
  const bw=box.clientWidth-12, bh=box.clientHeight-12, k=Math.max(.4,Math.min(bw/AW,bh/AH,1.7));
  const dpr=Math.min(2,window.devicePixelRatio||1);
  cv.style.width=Math.round(AW*k)+'px'; cv.style.height=Math.round(AH*k)+'px';
  cv.width=Math.round(AW*k*dpr); cv.height=Math.round(AH*k*dpr);
  AR.G.k=k*dpr; AR.G.ctx.setTransform(k*dpr,0,0,k*dpr,0,0);
}
window.addEventListener('resize',()=>{if(SCREEN==='arc'||(AR&&AR.trial))arcFit()});
function arcLoop(t){
  if(!AR||!AR.G||!AR.st) return; const G=AR.G, st=AR.st;
  const dt=AR.lt?Math.min(.05,(t-AR.lt)/1000):0; AR.lt=t;
  const paused=!modal.hidden||document.hidden;
  if(!paused&&!G.over){G.t+=dt; if(st.update) try{st.update(dt)}catch(e){console.error(e);G.over=true}
    if(!G.trial&&st.boost!==null){AR.bt-=dt;const b=$('#arcBottle');if(AR.bt<=0&&b&&b.hidden){b.hidden=false;sfx.pop()}}}
  if(!paused) G.fxUpdate(dt);
  const c=G.ctx; c.save(); G.bg(); if(st.draw) try{st.draw(c)}catch(e){console.error(e)} G.drawBtns(); G.fxDraw(); c.restore();
  AR.raf=requestAnimationFrame(arcLoop);
}
function arcInput(cv){
  const P=e=>{const r=cv.getBoundingClientRect();return [(e.clientX-r.left)/r.width*AW,(e.clientY-r.top)/r.height*AH]};
  let start=null;
  cv.onpointerdown=e=>{if(!AR||!AR.st||!AR.G||AR.G.over)return;e.preventDefault();cv.setPointerCapture&&cv.setPointerCapture(e.pointerId);
    const [x,y]=P(e);start={x,y,t:performance.now()};AR.G.px=x;AR.G.py=y;AR.G.pdown=true;
    const b=AR.G.hitBtn(x,y);if(b){start.btn=b;return}
    AR.st.down&&AR.st.down(x,y)};
  cv.onpointermove=e=>{if(!AR||!AR.st||!AR.G)return;const [x,y]=P(e);AR.G.px=x;AR.G.py=y;if(start&&start.btn)return;AR.st.move&&AR.st.move(x,y,!!start)};
  cv.onpointerup=cv.onpointercancel=e=>{if(!AR||!AR.st||!AR.G||!start)return;const [x,y]=P(e);const s=start;start=null;AR.G.pdown=false;
    if(s.btn){if(Math.abs(x-s.x)<30&&Math.abs(y-s.y)<30&&!AR.G.over){sfx.tap();s.btn.fn()}return}
    AR.st.up&&AR.st.up(x,y);
    const dx=x-s.x,dy=y-s.y,dist=Math.hypot(dx,dy);
    if(dist>26&&AR.st.swipe){AR.st.swipe(Math.abs(dx)>Math.abs(dy)?(dx>0?'R':'L'):(dy>0?'D':'U'))}
    else if(dist<=26&&AR.st.tap&&!AR.G.over) AR.st.tap(s.x,s.y)};
}
document.addEventListener('keydown',e=>{
  if(!AR||!AR.st||!AR.G||AR.G.over||!modal.hidden||(SCREEN!=='arc'&&!AR.trial)) return;
  const k={ArrowLeft:'L',ArrowRight:'R',ArrowUp:'U',ArrowDown:'D',' ':'A',Enter:'A',a:'L',d:'R',w:'U',s:'D'}[e.key];
  if(k&&AR.st.key){e.preventDefault();AR.st.key(k)}
});
document.addEventListener('keyup',e=>{if(AR&&AR.st&&AR.st.keyup&&(SCREEN==='arc'||AR.trial)){const k={ArrowLeft:'L',ArrowRight:'R',ArrowUp:'U',ArrowDown:'D'}[e.key];if(k)AR.st.keyup(k)}});

/* ---------- 그림: Canva 로 그린 스프라이트(assets/arc-art.js)가 있으면 이모지 대신 그려요 ---------- */
const ARC_IMG=new Map();
function arcSprite(e){const k=String(e).replace(/️/g,''),src=window.ARC_SPRITES&&window.ARC_SPRITES[k];if(!src)return null;
  let im=ARC_IMG.get(k);if(!im){im=new Image();im.src=src;ARC_IMG.set(k,im)}return im.complete&&im.naturalWidth?im:null}
function arcBgImg(zone){const src=window.ARC_BGS&&window.ARC_BGS[zone];if(!src)return null;let im=ARC_IMG.get('bg:'+zone);if(!im){im=new Image();im.src=src;ARC_IMG.set('bg:'+zone,im)}return im.complete&&im.naturalWidth?im:null}
function arcIconHTML(e,cls=''){const k=String(e).replace(/️/g,''),src=window.ARC_SPRITES&&window.ARC_SPRITES[k];return src?`<img class="arcspr ${cls}" src="${src}" alt="">`:e}
/* ---------- 놀이에 건네는 도구 G ---------- */
const EMO_CACHE=new Map();
function emoSprite(e,px){
  const k=e+'|'+px; let c=EMO_CACHE.get(k); if(c) return c;
  c=document.createElement('canvas'); const s=Math.ceil(px*1.3); c.width=c.height=s;
  const x=c.getContext('2d'); x.textAlign='center'; x.textBaseline='middle'; x.font=`${px}px ${EMOF}`; x.fillText(e,s/2,s/2+px*.06);
  if(EMO_CACHE.size>600) EMO_CACHE.clear(); EMO_CACHE.set(k,c); return c;
}
function arcMakeG(cv,lv,d,ch){
  const ctx=cv.getContext('2d');
  const G={W:AW,H:AH,lv,d,ch,grade:curGrade()||2,ctx,t:0,k:1,over:false,score:0,btns:[],fx:[],px:0,py:0,pdown:false,
    rand:(a,b)=>a+Math.random()*(b-a), ri:(a,b)=>Math.floor(a+Math.random()*(b-a+1)), pick:a=>a[Math.floor(Math.random()*a.length)], shuffle,
    clamp:(v,a,b)=>Math.max(a,Math.min(b,v)), lerp:(a,b,t)=>a+(b-a)*t, dist:(a,b,c,d2)=>Math.hypot(a-c,b-d2),
    /* 이모지 그림: 미리 그려 둔 조각을 붙여서 빨라요 */
    emo(e,x,y,s=32,a=1,rot=0){const im=arcSprite(e);if(im){const w=s*1.2;if(a!==1)ctx.globalAlpha=a;if(rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(im,-w/2,-w/2,w,w);ctx.restore()}else ctx.drawImage(im,x-w/2,y-w/2,w,w);if(a!==1)ctx.globalAlpha=1;return}
      const sp=emoSprite(e,Math.round(s*G.k));const w=s*1.3;
      if(a!==1)ctx.globalAlpha=a; if(rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot);ctx.drawImage(sp,-w/2,-w/2,w,w);ctx.restore()}else ctx.drawImage(sp,x-w/2,y-w/2,w,w); if(a!==1)ctx.globalAlpha=1},
    text(str,x,y,s=18,col='#FFF3D6',al='center',stroke='#2A1A0E'){ctx.font=`${s}px Jua, "Malgun Gothic", sans-serif`;ctx.textAlign=al;ctx.textBaseline='middle';
      if(stroke){ctx.lineWidth=Math.max(2,s/6);ctx.strokeStyle=stroke;ctx.lineJoin='round';ctx.strokeText(str,x,y)}ctx.fillStyle=col;ctx.fillText(str,x,y)},
    rr(x,y,w,h,r,fill,stroke,lw=2){ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):ctx.rect(x,y,w,h);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke()}},
    circle(x,y,r,fill,stroke,lw=2){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke()}},
    grad(y0,y1,c0,c1){const g=ctx.createLinearGradient(0,y0,0,y1);g.addColorStop(0,c0);g.addColorStop(1,c1);return g},
    bgCol:null,
    bg(){if(G.bgCol===false)return;const im=!G.trial&&ch&&arcBgImg(ch.id);
      if(im){const s=Math.max(AW/im.width,AH/im.height);ctx.drawImage(im,(AW-im.width*s)/2,(AH-im.height*s)/2,im.width*s,im.height*s);ctx.fillStyle='rgba(16,10,30,.42)';ctx.fillRect(0,0,AW,AH);return}
      const g=ctx.createLinearGradient(0,0,0,AH);const c=G.bgCol||[mix(ch.tint,'#120C1E',.55),mix(ch.tint,'#0B0714',.82)];g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);ctx.fillStyle=g;ctx.fillRect(0,0,AW,AH)},
    setHud(a,b,c){const s=[a,b,c];s.forEach((v,i)=>{const e=document.getElementById('arcH'+i);if(!e)return;e.hidden=v==null;if(v!=null&&e._v!==v){e._v=v;e.textContent=v}})},
    burst(x,y,col='#FFE27A',n=12,sp=140){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=sp*(.4+Math.random()*.8);G.fx.push({k:'p',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,life:.7,max:.7,col,r:2+Math.random()*3})}},
    pop(txt,x,y,col='#FFE27A',s=20){G.fx.push({k:'t',x,y,vy:-50,life:.9,max:.9,txt,col,s})},
    spr(k,fb,x,y,s=32,a=1,rot=0){G.emo(arcSprite(k)?k:fb,x,y,s,a,rot)},
    shake:0,
    fxUpdate(dt){for(const f of G.fx){f.life-=dt;f.x+=(f.vx||0)*dt;f.y+=(f.vy||0)*dt;if(f.k==='p')f.vy+=260*dt}G.fx=G.fx.filter(f=>f.life>0);if(G.shake>0)G.shake=Math.max(0,G.shake-dt*30)},
    fxDraw(){for(const f of G.fx){const a=Math.max(0,f.life/f.max);if(f.k==='p'){ctx.globalAlpha=a;G.circle(f.x,f.y,f.r,f.col)}else{ctx.globalAlpha=a;G.text(f.txt,f.x,f.y,f.s,f.col)}}ctx.globalAlpha=1},
    btn(x,y,w,h,label,fn,o={}){const b={x,y,w,h,label,fn,...o};G.btns.push(b);return b},
    hitBtn(x,y){for(let i=G.btns.length-1;i>=0;i--){const b=G.btns[i];if(!b.hidden&&x>=b.x&&x<=b.x+b.w&&y>=b.y&&y<=b.y+b.h)return b}return null},
    drawBtns(){for(const b of G.btns){if(b.hidden)continue;G.rr(b.x,b.y+3,b.w,b.h,12,'#3A1F0C');G.rr(b.x,b.y,b.w,b.h,12,b.on?'#E08A1A':(b.col||'#8A552B'),'#4E2C14',2.5);
      const em=/\p{Extended_Pictographic}/u.test(b.label)&&[...b.label].length<=3;if(em)G.emo(b.label,b.x+b.w/2,b.y+b.h/2,Math.min(b.h*.62,30));else G.text(b.label,b.x+b.w/2,b.y+b.h/2+1,b.fs||Math.min(18,b.h*.45),'#FFF8E6')}},
    addScore(n,x,y){G.score=Math.max(0,G.score+n);if(x!=null&&n)G.pop((n>0?'+':'')+n,x,y,n>0?'#FFE27A':'#FF8A8A');arcBest()},
    win(stars){if(G.over)return;G.over=true;stars=Math.max(1,Math.min(3,stars|0));setTimeout(()=>arcEnd(true,stars,''),450)},
    lose(why){if(G.over)return;G.over=true;G.shake=8;setTimeout(()=>arcEnd(false,0,why||''),550)},
    sfx:k=>{try{(sfx[k]||sfx.tap)()}catch(e){}}
  };
  return G;
}
function arcBest(){if(!AR||!AR.G)return;const r=arcRec(AR.id);if(AR.G.score>(r.best||0)){r.best=AR.G.score;save()}}
/* 중간에 나가도 점수(최고 기록)는 남겨요 — 단계 별은 깬 순간 바로 저장돼요 */
/* 저장만 해요 (창을 잠깐 벗어날 때도 불려서, 여기서 놀이를 끝내면 돌아와도 멈춰 있어요. 나가기는 arcStop 이 멈춰요) */
function ARC_settle(){if(!AR||!AR.G)return;arcBest();try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
window.ARC_settle=ARC_settle;

/* ---------- 판 끝 ---------- */
function arcEnd(win,stars,why){
  if(!AR||!AR.G) return;
  if(AR.trial){const done=AR.trial.done;if(win){sfx.win();confetti(40)}else sfx.lose();
    const sh=openModal(`<div class="result arcKeep"><h2>${win?'시련 통과!':'시련 실패…'}</h2><p class="note">${win?'다음 방으로 갈 수 있어요!':esc(why||'')+'<br>하트 1개를 잃었어요.'}</p></div>
      <div class="row" style="justify-content:center"><button class="cbtn mint" id="go">${win?'던전으로 ▶':'확인'}</button></div>`,{closable:false});
    sh.querySelector('#go').onclick=()=>{closeModal();arcTrialClose();done&&done(win)};return}
  if(win&&AR.card&&!AR.cq){AR.cq=true;const card=AR.card;
    runQuiz(card,{tag:'🔎 확인 퀴즈',title:'지식 카드에서 읽은 내용이에요',closable:false,rightLabel:'별 받기!',wrongLabel:'결과 보기',
      onRight:()=>{AR.cqOk=1;arcEnd(true,stars,why)},onWrong:()=>{AR.cqOk=0;arcEnd(true,Math.max(1,stars-1),why)}});return}
  const {id,def,lv}=AR, G=AR.G, r=arcRec(id), c=chState(CI), cq=AR.cq?AR.cqOk:null; AR.cq=false;
  arcBest();
  let gain=0, medalUp=null;
  if(win){
    const old=r.s[lv-1], m0=arcMedal(id);
    if(stars>old) r.s[lv-1]=stars;
    gain=Math.max(1,stars-old)+(cq===1?1:0);
    const m1=arcMedal(id); if(m1>m0){medalUp=ARC_MEDAL[m1];gain+=ARC_MEDAL[m1].bonus}
    c.stars+=gain; save(); sfx.win(); confetti(20+stars*20); if(medalUp)setTimeout(()=>sfx.fanfare(),700);
  }else{sfx.lose();save()}
  $$('.sVal').forEach(e=>e.textContent=c.stars);
  const cost=c.done?0:STEP_COST[Math.min(c.step,3)], left=Math.max(0,cost-c.stars);
  const goal=c.done?'이 섬의 진실은 이미 밝혔어요! 메달과 별을 더 모아 등급을 올려 봐요.':left?`다음 이야기 단서까지 ⭐ ${left}개 남았어요!`:`⭐이 충분해요! 섬으로 돌아가 <b>${c.step+1}번째 단서</b>를 열어 봐요!`;
  const sh=openModal(`<div class="result arcres arcKeep"><h2>${win?`${lv}단계 성공!`:'아쉬워요!'}</h2>
    ${win?`<div class="stars rstars">${[0,1,2].map(i=>`<span class="rstar ${i<stars?'on':'off'}" style="--d:${.25+i*.28}s"><svg viewBox="0 0 100 100"><use href="#miStar"/></svg></span>`).join('')}</div>
      <div class="gain">이 섬의 ⭐ +${gain}</div>${cq===1?'<div class="cquiz ok">⭕ 확인 퀴즈 정답! 보너스 ⭐1</div>':cq===0?'<div class="cquiz no">❌ 확인 퀴즈 오답 · 별 -1 (지식 카드를 잘 읽어요!)</div>':''}`:`<div class="big">${def.icon}</div><p class="note">${esc(why||'다시 도전해 봐요!')}</p>`}
    ${G.score?`<p class="note">점수 ${G.score.toLocaleString()} · 최고 ${(r.best||0).toLocaleString()}</p>`:''}
    ${medalUp?`<div class="medal">${medalUp.e} ${medalUp.n} 획득! (${medalUp.t}) · 보너스 ⭐${medalUp.bonus}</div>`:''}
    <p class="nextgoal">${goal}</p></div>
    <div class="row" style="justify-content:center">
      <button class="cbtn ghost" id="arSel">단계 고르기</button>
      <button class="cbtn ${win?'ghost':'mint'}" id="arAgain">${win?'다시 하기':'다시 도전!'}</button>
      ${win&&lv<ARC_N?`<button class="cbtn mint" id="arNext">${lv+1}단계 ▶</button>`:''}
      ${win&&!c.done&&!left?`<button class="cbtn" id="arHub">섬으로 · 단서 열기</button>`:''}
    </div>`,{closable:false});
  sh.querySelector('#arSel').onclick=()=>{closeModal();arcSelect()};
  sh.querySelector('#arAgain').onclick=()=>{closeModal();arcPlay(lv)};
  const nx=sh.querySelector('#arNext'); if(nx) nx.onclick=()=>{closeModal();arcPlay(lv+1)};
  const hb=sh.querySelector('#arHub'); if(hb) hb.onclick=()=>{closeModal();arcStop();goHub()};
}

/* ---------- 허브: 별을 왜 모으는지 한눈에 ---------- */
function goalHTML(ci){
  const c=chState(ci), ch=CH[ci];
  if(c.done) return `<div class="hxgoal ready" id="hGoal" title="탐정 수첩"><span class="gt">🃏 진실 카드 획득!</span><span class="gcl">${[0,1,2,3].map(k=>`<b class="on">${k+1}</b>`).join('')}</span><span class="gt">🏰 던전 ${solvedCount()}/${CH.length}</span></div>`;
  const cost=STEP_COST[c.step], pct=Math.min(100,c.stars/cost*100), ready=c.stars>=cost;
  return `<div class="hxgoal ${ready?'ready':''}" id="hGoal" title="탐정 수첩: 별은 왜 모아요?">
    <span class="gt">⭐</span><span class="gbar"><i style="width:${pct}%"></i><span>${Math.min(c.stars,cost)} / ${cost}</span></span>
    <span class="gt">→ 🔍 단서</span><span class="gcl">${[0,1,2,3].map(k=>`<b class="${k<c.step?'on':k===c.step?'nx':''}">${k+1}</b>`).join('')}</span><span class="gt">→ 🃏</span></div>`;
}
function goalRefresh(){const g=$('#hGoal');if(!g||SCREEN!=='hub')return;const n=document.createElement('div');n.innerHTML=goalHTML(CI);const ne=n.firstElementChild;g.replaceWith(ne);ne.onclick=()=>{sfx.tap();notebookModal()}}
function clueBanner(ci,k){
  const ch=CH[ci], c=chState(ci), st=ch.steps[k], nxt=c.step<4?STEP_COST[c.step]:0;
  const b=document.createElement('div'); b.className='clueban arcKeep';
  b.innerHTML=`<span class="e">🔍</span><b>단서 ${c.step} / 4 획득!</b><small>${esc(st.title)}${c.step<4?` · 다음 단서는 ⭐ ${nxt}개`:''}</small>`;
  document.body.appendChild(b); setTimeout(()=>b.remove(),3500);
}
/* 탐정 수첩: 놀이 → ⭐ → 단서 4개 → 진실 판정 → 진실 카드 10장 → 소문 던전 → 끝판왕 */
function notebookModal(){
  const ci=CI, c=ci>=0?chState(ci):null, solved=solvedCount(), cv=typeof caveState==='function'?caveState():{};
  const step=(on,e,b,t)=>`<div class="${on?'on':''}"><span class="e">${e}</span><b>${b}</b>${t}</div>`;
  const sh=openModal(`<div class="arcKeep"><h2>📒 탐정 수첩</h2><p class="note">별은 이렇게 써요! 반짝이는 칸이 지금 내가 해낸 곳이에요.</p>
    <div class="flowmap">
      ${step(c&&c.stars>0,'🎮','섬 놀이 3가지','단계를 깨면 ⭐')}
      ${step(c&&c.step>0,'⭐','별 모으기',c?`지금 ⭐${c.stars}`:'')}
      ${step(c&&c.step>0,'🔍','단서 4개',c?`${c.step}/4 · 다음 ⭐${c.done?'-':STEP_COST[c.step]}`:'')}
      ${step(c&&c.first!=null,'⚖️','진실 판정','맞음·일부·틀림')}
      ${step(solved>0,'🃏','진실 카드',`${solved}/${CH.length}장`)}
      ${step(solved>=CH.length,'🏰','소문 던전','카드 10장이면 열림')}
      ${step(cv.clear,'👑','끝판왕','지하 5층 · 모험 완성')}
    </div>
    <ul class="cvrules"><li>첫 판단이 진실과 같으면 <b>🏅 명탐정 배지</b>!</li><li>놀이마다 <b>🥉🥈🥇 메달</b>을 따면 보너스 ⭐</li><li>30가지 놀이 전체 별로 <b>탐정 등급</b>이 올라가요 (지금: ${arcRank(arcTotal()).r[1]})</li></ul></div>
    <div class="row"><button class="cbtn" id="ok">알겠어요</button></div>`);
  sh.querySelector('#ok').onclick=closeModal;
}

/* ---------- 놀이들이 함께 쓰는 작은 도구 ---------- */
const HEARTS=(h,m=3)=>'❤️'.repeat(Math.max(0,h))+'🤍'.repeat(Math.max(0,m-Math.max(0,h)));
const TIME=s=>'⏱ '+Math.max(0,Math.ceil(s));
/* 왼쪽을 보는 이모지(🏃 등)를 오른쪽으로 뒤집어 그려요 */
function emoFlip(G,e,x,y,s){const c=G.ctx;c.save();c.translate(x,y);c.scale(-1,1);G.emo(e,0,0,s);c.restore()}
/* 별 기준: 남은 하트로 */
const starsByHearts=(h,m=3)=>h>=m?3:h>=m-1?2:1;

/* ---------- 던전 시련: 던전 안에서 놀이 한 판 (index.html 이 dq:game 을 받으면 열어요) ---------- */
function arcTrial(id,o){
  const def=ARC_DEF[id]; if(!def){o.done&&o.done(true);return}
  arcStop(); let el=$('#arcTrial'); if(!el){el=document.createElement('div');el.id='arcTrial';el.className='arcKeep';document.body.appendChild(el)}
  el.hidden=false; document.body.classList.add('trialOn');
  AR={id,def,trial:{ch:o.ch||CH[0],d:o.d!=null?o.d:.4,sub:o.sub,name:o.name,bg:o.bg,done:o.done,intro:o.intro}};
  arcPlay(o.lv||5);
}
function arcTrialClose(){arcStop();const el=$('#arcTrial');if(el){el.hidden=true;el.innerHTML=''}document.body.classList.remove('trialOn');AR=null}
