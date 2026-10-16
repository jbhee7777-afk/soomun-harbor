/* ===== 새 섬 놀이 1/3: 대피 퀴즈 런 · 친구 모으기 런 · 직업 꼬들 · 꿈의 탑 스택볼 · 투표소 버스 잼 · 회의장 화살표 탈출 ===== */

/* 글자를 폭에 맞춰 여러 줄로 나눠요 (캔버스용) */
function wrapText(ctx,str,maxW,size){ctx.font=`${size}px Jua, "Malgun Gothic", sans-serif`;const out=[];let line='';
  for(const ch of String(str)){const t=line+ch;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=ch.trim()?ch:''}else line=t}if(line)out.push(line);return out}
/* 문제 하나를 퀴즈 칸으로 그려요 (가·나·다 보기) */
function drawQPanel(G,q,y,h,order,label){const c=G.ctx;G.rr(8,y,AW-16,h,14,'rgba(20,12,36,.88)','#D9A441',3);
  const L=wrapText(c,q.q,AW-40,15);L.slice(0,2).forEach((t,i)=>G.text(t,AW/2,y+18+i*19,15,'#FFF3D6'));
  order.forEach((oi,j)=>{const tx=wrapText(c,`${'가나다'[j]}. ${q.o[oi]}`,AW-44,13)[0];G.text(tx.length<[...`${'가나다'[j]}. ${q.o[oi]}`].length?tx+'…':tx,22,y+18+Math.min(2,L.length)*19+j*18,13,label===j?'#7FFFA0':'#FFE9A8','left')})}

/* ---------- 안전 2: 대피 퀴즈 런 (서브웨이 서퍼) ---------- */
arcDefine({id:'safety_run',ch:'safety',name:'대피 퀴즈 런',tag:'3줄 달리기 · 정답 문',from:'서브웨이 서퍼 (Subway Surfers)',icon:'🏃',
  how:['왼쪽·오른쪽으로 밀면 줄을 바꾸고, 위로 밀면 점프, 아래로 밀면 숙이기!','위에 문제가 나오면 장애물이 잠깐 멈춰요. 차분히 읽고 정답(가·나·다) 줄로 옮겨 문을 통과해요!','🚧는 뛰어넘고, 🪧 표지판은 숙여 피하고, 🚌 버스는 옆 줄로 피해요. ⛑️를 모으면 점수!'],
  init(G){
    const HY=150, goal=3+Math.round(G.d*6), vz=.3+.48*G.d, readT=7-3.6*G.d;
    let P={lane:1,x:1,jy:0,vy:0,slide:0,inv:0},objs=[],t=1.2,hearts=3,passed=0,gate=null,ann=null,annT=3.5,scroll=0,coins=0;
    const proj=(lane,z)=>{const s=1/(1+z*3.2);return {x:AW/2+(lane-1)*112*s,y:HY+(470-HY)*s,s}};
    const newAnn=()=>{const q=drawQ(G.trial?0:CI);if(!q)return;const ord=G.shuffle(q.o.map((_,i)=>i)).slice(0,3);if(!ord.includes(q.a))ord[0]=q.a;const order=G.shuffle(ord);ann={q,order,t:readT};objs=objs.filter(o=>o.z<.45);G.pop('📖 장애물 멈춤! 문제를 읽어요',AW/2,300,'#FFE27A',17)};
    const lane=d=>{P.lane=G.clamp(P.lane+d,0,2);G.sfx('whoosh')};
    const hit=why=>{if(P.inv)return;hearts--;P.inv=1.2;G.sfx('hurt');G.shake=7;if(why)G.pop(why,AW/2,300,'#FF8A8A',16);if(hearts<=0)G.lose('너무 많이 부딪혔어요! 문제를 잘 읽고 미리 줄을 옮겨요.')};
    return {
      boostText:'하트 +1', boost(){hearts=Math.min(3,hearts+1)},
      update(dt){scroll+=dt*vz*8;P.x=G.lerp(P.x,P.lane,Math.min(1,dt*14));P.inv=Math.max(0,P.inv-dt);P.slide=Math.max(0,P.slide-dt);
        if(P.jy>0||P.vy){P.vy-=1500*dt;P.jy+=P.vy*dt;if(P.jy<=0){P.jy=0;P.vy=0}}
        if(!ann&&!gate){annT-=dt;if(annT<=0)newAnn()}
        if(ann){ann.t-=dt;if(ann.t<=0){gate={...ann,z:1};ann=null}}
        t-=dt;if(t<=0){t=G.rand(.8,1.4)*(1.15-.65*G.d);if(!ann&&!gate){const L=G.ri(0,2),k=Math.random();objs.push({lane:L,z:1,k:k<.4?'low':k<.7?'high':'block'});if(Math.random()<.6)objs.push({lane:(L+G.ri(1,2))%3,z:1.08,k:'coin'})}}
        for(const o of objs){o.z-=vz*dt;if(o.z<.05&&o.z>-.05&&!o.done&&o.lane===P.lane){o.done=1;
          if(o.k==='coin'){coins++;G.sfx('coin');G.addScore(5)}else if(o.k==='low'&&P.jy<35)hit('🚧 점프!');else if(o.k==='high'&&P.slide<=0)hit('🪧 숙여요!');else if(o.k==='block')hit('🚌 옆 줄로!')}}
        objs=objs.filter(o=>o.z>-.1&&!(o.done&&o.k==='coin'));
        if(gate){gate.z-=vz*dt;if(gate.z<.03){const ok=gate.order[P.lane]===gate.q.a;
            if(ok){passed++;G.sfx('ok');G.burst(AW/2,380,'#7FFFA0',24);G.addScore(30);G.pop('정답 문 통과!',AW/2,330,'#7FFFA0',22);if(passed>=goal){gate=null;return G.win(starsByHearts(hearts))}}
            else{if(!G.trial)wrongAdd(CI,gate.q);hit(`정답은 ${'가나다'[gate.order.indexOf(gate.q.a)]}!`)}
            gate=null;annT=3.5+2.5*G.d}}
        G.setHud(HEARTS(hearts),`🚪 ${passed}/${goal}`,`⛑️ ${coins}`)},
      draw(c){c.fillStyle=G.grad(0,HY,'#5A3A8A','#FF9A6A');c.fillRect(0,0,AW,HY);c.fillStyle='#4E8A3A';c.fillRect(0,HY,AW,AH-HY);
        const a=proj(-.5,1),b=proj(2.5,1),c2=proj(2.5,0),d=proj(-.5,0);c.fillStyle='#4A4A58';c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.lineTo(c2.x+30,AH);c.lineTo(d.x-30,AH);c.fill();
        c.strokeStyle='rgba(255,255,255,.75)';c.lineWidth=3;for(const ln of [.5,1.5]){for(let k=0;k<10;k++){const z0=((k*.12-scroll%.12)+1.2)%1.2,z1=z0+.05;if(z0>1)continue;const p0=proj(ln,z0),p1=proj(ln,Math.min(1,z1));c.beginPath();c.moveTo(p0.x,p0.y);c.lineTo(p1.x,p1.y);c.stroke()}}
        const all=[...objs.map(o=>({...o,g:false})),...(gate?[{...gate,g:true}]:[])].sort((x,y)=>y.z-x.z);
        for(const o of all){if(o.z>1.05||o.z<-.1)continue;
          if(o.g){for(let L=0;L<3;L++){const p=proj(L,o.z);G.rr(p.x-48*p.s,p.y-120*p.s,96*p.s,120*p.s,12*p.s,null,'#FFE27A',5*p.s);G.text('가나다'[L],p.x,p.y-132*p.s,Math.max(10,30*p.s),'#FFE27A')}continue}
          const p=proj(o.lane,o.z);G.emo({low:'🚧',high:'🪧',block:'🚌',coin:'⛑️'}[o.k],p.x,p.y-(o.k==='high'?70:o.k==='block'?34:20)*p.s,(o.k==='block'?84:52)*p.s)}
        const pp=proj(P.x,0);if(!(P.inv&&Math.floor(G.t*12)%2)){c.save();c.translate(pp.x,pp.y-P.jy-6);const rk=P.jy>0?'run_bj':P.slide>0?'run_bc':(Math.floor(G.t*8)%2?'run_b1':'run_b2');if(P.slide>0&&!arcSprite(rk))c.scale(1.2,.55);G.spr(rk,'🏃',0,-24,56);c.restore()}
        const q=ann||gate;if(q){drawQPanel(G,q.q,6,100,q.order);if(ann){G.rr(16,98,(AW-32)*(ann.t/readT),5,3,'#FFE27A')}}},
      swipe(d){if(d==='L')lane(-1);else if(d==='R')lane(1);else if(d==='U'&&!P.jy){P.vy=620;P.jy=1;G.sfx('jump')}else if(d==='D'){P.slide=.8;P.vy=P.jy?-900:0;G.sfx('whoosh')}},
      tap(x){lane(x<AW/2?-1:1)},key(k){if(k==='A')k='U';this.swipe(k)}
    }}});

/* ---------- 인성 2: 친구 모으기 런 (카운트 마스터즈) ---------- */
const KIND=['먼저 인사하기','고마워 말하기','친구 도와주기','차례 양보하기','줄 서서 기다리기','솔직하게 사과하기','좋은 점 칭찬하기','함께 놀자 하기','끝까지 들어 주기','약속 지키기','고운 말 쓰기','힘든 친구 위로하기'];
const UNKIND=['새치기하기','친구 놀리기','따돌리기','거짓말하기','나쁜 말 쓰기','못 본 척하기','약속 어기기','혼자 독차지','뒤에서 흉보기','남 탓하기','장난감 뺏기','비웃기'];
arcDefine({id:'character_crowd',ch:'character',name:'친구 모으기 런',tag:'문 고르기 · 무리 달리기',from:'카운트 마스터즈 (Count Masters)',icon:'🧑‍🤝‍🧑',
  how:['화면을 좌우로 끌어 친구 무리를 움직여요.','두 문 중 하나를 지나요: 착한 행동 문은 친구가 늘고(+, ×), 나쁜 행동 문은 줄어요(-, ÷).','둘 다 착하면 더 큰 쪽을, 굴러오는 통나무🪵는 피하고! 끝에 기다리는 외로운 거인보다 친구가 많으면 성공!'],
  init(G){
    const pairs=7+Math.round(G.d*7), sp=150+110*G.d; let n=5,cx=AW/2,tx=AW/2,ev=[],y0=-120,keyD=0,dist=0,boss=null,flash=0;
    const val=kind=>{if(kind){return Math.random()<.35?{op:'×',v:2}:{op:'+',v:G.ri(3,6)+Math.round(G.d*6)}}return Math.random()<.4?{op:'÷',v:2}:{op:'-',v:G.ri(3,6)+Math.round(G.d*8)}};
    for(let i=0;i<pairs;i++){const both=G.d>.3&&Math.random()<.3;const kL=both?Math.random()<.6:Math.random()<.5;const kinds=both?[kL,kL]:G.shuffle([true,false]);
      ev.push({y:y0-i*300,type:'gate',sides:kinds.map(k=>({k,txt:G.pick(k?KIND:UNKIND),...val(k)})),done:false});
      if(G.d>.1&&i<pairs-1)ev.push({y:y0-i*300-150,type:'log',x:G.rand(40,AW-40),dir:Math.random()<.5?1:-1,done:false})}
    /* 거인 체력: 매번 가장 좋은 문을 골랐을 때 모이는 친구 수의 일정 비율 → 대충 고르면 못 이겨요 */
    let opt=5;ev.filter(e=>e.type==='gate').forEach(e=>{opt=Math.max(...e.sides.map(s=>s.op==='+'?opt+s.v:s.op==='-'?Math.max(0,opt-s.v):s.op==='×'?opt*s.v:Math.floor(opt/s.v)))});
    const bossHP=Math.max(12,Math.round(opt*(.5+.42*G.d)));
    const apply=s=>{const before=n;if(s.op==='+')n+=s.v;else if(s.op==='-')n=Math.max(0,n-s.v);else if(s.op==='×')n*=s.v;else n=Math.floor(n/s.v);
      G.pop(`${s.op}${s.v} ${s.txt}`,cx,360,s.k?'#7FFFA0':'#FF8A8A',16);G.sfx(n>before?'star':'no');if(!s.k)G.shake=4};
    const rad=()=>Math.min(70,10+Math.sqrt(n)*6);
    return {
      boostText:'친구 +8', boost(){n+=8},
      update(dt){if(keyD)tx=G.clamp(tx+keyD*300*dt,30,AW-30);cx=G.lerp(cx,tx,Math.min(1,dt*10));flash=Math.max(0,flash-dt);
        if(boss){boss.t+=dt;if(boss.t>1.2&&!boss.end){boss.end=1;if(n>=bossHP){G.burst(AW/2,200,'#FFE27A',40);G.sfx('fanfare');G.win(n>=bossHP*1.8?3:n>=bossHP*1.3?2:1)}else G.lose(`친구가 ${bossHP-n}명 모자랐어요. 착한 행동 문을 골라요!`)}return}
        dist+=sp*dt;for(const e of ev){e.y+=sp*dt;
          if(e.type==='gate'&&!e.done&&e.y>400){e.done=1;apply(e.sides[cx<AW/2?0:1]);if(n<=0)return G.lose('친구가 모두 떠났어요…')}
          if(e.type==='log'){e.x+=e.dir*(90+150*G.d)*dt;if(e.x<30||e.x>AW-30)e.dir*=-1;if(!e.done&&Math.abs(e.y-430)<14){const ov=Math.max(0,Math.min(cx+rad(),e.x+40)-Math.max(cx-rad(),e.x-40))/(2*rad());if(ov>0){const lost=Math.ceil(n*ov*.6);n=Math.max(0,n-lost);e.done=1;G.sfx('hurt');G.pop(`-${lost} 통나무!`,cx,380,'#FF8A8A');if(n<=0)return G.lose('친구가 모두 떠났어요…')}}}}
        if(ev.every(e=>e.y>600)&&!boss){boss={t:0};G.sfx('boss')}
        G.setHud(`🧑‍🤝‍🧑 ${n}명`,`🚪 ${ev.filter(e=>e.type==='gate'&&e.done).length}/${pairs}`,`😢 거인 ${bossHP}`)},
      draw(c){G.rr(30,0,AW-60,AH,0,'#7A8AA8');c.fillStyle='#5E9E58';c.fillRect(0,0,30,AH);c.fillRect(AW-30,0,30,AH);
        for(let k=0;k<12;k++){const y=(k*60+dist*1)%720-90;G.rr(AW/2-3,y,6,30,3,'rgba(255,255,255,.4)')}
        for(const e of ev){if(e.y<-200||e.y>620)continue;
          if(e.type==='gate'){e.sides.forEach((s,i)=>{const x=30+i*(AW-60)/2;G.rr(x+4,e.y-34,(AW-60)/2-8,64,10,s.k?'rgba(79,214,140,.85)':'rgba(240,90,90,.85)','#FFF',3);
            G.text(`${s.op}${s.v}`,x+(AW-60)/4,e.y-12,24,'#FFF');G.text(s.txt,x+(AW-60)/4,e.y+14,13,'#FFF')})}
          else G.emo('🪵',e.x,e.y,70)}
        if(boss){G.emo('😢',AW/2,150,120);G.text(`외로운 거인 ${bossHP}`,AW/2,230,18);G.text(n>=bossHP?'친구가 되어 줬어요!':'친구가 모자라요…',AW/2,260,16,n>=bossHP?'#7FFFA0':'#FF8A8A')}
        const R=rad(),show=Math.min(n,70),kid=arcSprite('run_g'),pts=[];for(let i=0;i<show;i++){const a=i*2.399,r=Math.sqrt(i/show)*R;pts.push({i,x:cx+Math.cos(a)*r,y:430+Math.sin(a)*r*.6})}pts.sort((p,q)=>p.y-q.y);
        for(const p of pts){if(kid){const bob=Math.abs(Math.sin(G.t*10+p.i))*2.5;G.emo(['run_g','run_k','run_b1','run_b2'][p.i%4],p.x,p.y-4-bob,show>40?15:19)}else{G.circle(p.x,p.y+4,5,'#3C6FD1');G.circle(p.x,p.y-3,4.5,'#FFD9B8','#8A552B',1)}}
        G.rr(cx-22,430-R*.6-30,44,22,10,'#2A1A0E');G.text(String(n),cx,430-R*.6-19,15,'#FFE27A','center',null)},
      down(x){tx=G.clamp(x,30,AW-30)},move(x){tx=G.clamp(x,30,AW-30)},
      key(k){if(k==='L')keyD=-1;if(k==='R')keyD=1},keyup(k){if(k==='L'||k==='R')keyD=0}
    }}});

/* ---------- 진로 2: 직업 낱말 꼬들 (워들) ---------- */
const JOBS=[['소방관','불을 끄고 위험에 빠진 사람을 구해요'],['간호사','병원에서 환자를 돌보고 치료를 도와요'],['요리사','맛있고 건강한 음식을 만들어요'],['수의사','아픈 동물을 치료해요'],['건축가','건물을 설계해요'],
  ['사서','도서관에서 책을 정리하고 찾아 줘요'],['경찰관','시민의 안전을 지키고 질서를 바로잡아요'],['약사','약을 짓고 바르게 먹는 법을 알려 줘요'],['농부','곡식과 채소를 길러요'],['조종사','비행기를 몰아요'],['기자','새 소식을 취재해 알려요'],
  ['판사','법에 따라 공정하게 판결해요'],['통역사','다른 나라 말을 우리말로 옮겨 줘요'],['교사','학교에서 학생을 가르쳐요'],['의사','아픈 사람을 진찰하고 치료해요'],['화가','그림으로 생각과 느낌을 표현해요'],['어부','바다에서 물고기를 잡아요'],
  ['디자이너','보기 좋고 쓰기 편한 모양을 만들어요'],['바리스타','커피를 만드는 전문가예요'],['큐레이터','박물관·미술관 전시를 기획해요'],['프로그래머','컴퓨터 프로그램을 만들어요'],['웹툰작가','인터넷 만화를 그려요'],
  ['기상캐스터','날씨를 알려 주는 방송인이에요'],['드론조종사','드론을 날려 촬영하거나 물건을 날라요'],['우주비행사','우주선을 타고 우주에서 일해요'],['로봇공학자','로봇을 연구하고 만들어요'],['환경연구원','환경을 지키는 방법을 연구해요'],
  ['물리치료사','다친 몸이 다시 잘 움직이도록 도와요'],['동물사육사','동물원에서 동물을 돌봐요'],['게임개발자','재미있는 게임을 만들어요'],['데이터과학자','많은 자료를 분석해 문제를 풀어요'],['인공지능개발자','스스로 배우는 컴퓨터 프로그램을 만들어요'],['소방대원','불을 끄고 구조 활동을 해요'],['영양사','건강한 식단을 짜요']];
arcDefine({id:'career_wordle',ch:'career',name:'직업 낱말 꼬들',tag:'낱말 맞히기',from:'워들 · 꼬들 (한글 워들)',icon:'🔤',
  how:['설명을 읽고 어떤 직업인지 맞혀요! 아래 글자 조각을 눌러 칸을 채우고 ✔를 눌러요.','초록 = 자리까지 맞음 · 노랑 = 글자는 있지만 자리가 다름 · 회색 = 없는 글자','6번 안에 맞혀야 해요. 적게 시도할수록 별이 많아요!'],
  init(G){
    const lo=G.d<.25?2:G.d<.6?3:4, hi=G.d<.25?3:G.d<.6?4:7, pool=JOBS.filter(j=>[...j[0]].length>=lo&&[...j[0]].length<=hi);
    const words=G.shuffle(pool).slice(0,2+(G.d>.4?1:0)+(G.d>.8?1:0)), MAXT=6-Math.round(G.d*2);let wi=0,tries=[],cur=[],state={},total=0,msg='',msgT=0,tiles=[];
    const W=()=>[...words[wi][0]];let bs=40;
    const mkTiles=()=>{bs=Math.min(48,(AW-30)/W().length-6);const w=W(),dec=G.shuffle(JOBS.flatMap(j=>[...j[0]]).filter(s=>!w.includes(s))).filter((s,i,a)=>a.indexOf(s)===i).slice(0,Math.max(4,12-w.length));tiles=G.shuffle([...new Set([...w,...dec])]).slice(0,15);state={}};
    mkTiles();
    const L=()=>W().length;
    const submit=()=>{if(cur.length<L()){G.sfx('no');msg='칸을 모두 채워요';msgT=1.2;return}const w=W(),res=cur.map((s,i)=>s===w[i]?2:w.includes(s)?1:0);
      tries.push({s:cur.slice(),r:res});cur.forEach((s,i)=>state[s]=Math.max(state[s]||0,res[i]+1));cur=[];total++;
      if(res.every(v=>v===2)){G.sfx('ok');G.burst(AW/2,200,'#7FFFA0',28);msg=`정답! ${words[wi][0]} — ${words[wi][1]}`;msgT=2.5;G.addScore(60-tries.length*8);
        setTimeout(()=>{if(G.over)return;wi++;tries=[];if(wi>=words.length){const avg=total/words.length;G.win(avg<=3?3:avg<=4.5?2:1)}else mkTiles()},1400)}
      else{G.sfx('tap');if(tries.length>=MAXT){G.lose(`정답은 "${words[wi][0]}"이었어요.`)}else if(tries.length===3){msg=`힌트: 첫 글자는 "${w[0]}"`;msgT=3}}};
    G.btn(AW-120,486,104,44,'✔ 확인',submit,{col:'#2F9E5B',fs:17});G.btn(16,486,104,44,'⌫ 지우기',()=>{cur.pop();G.sfx('tap')},{col:'#7A4A5A',fs:16});
    return {
      boostText:'글자 하나 공개', boost(){const w=W();const i=w.findIndex((s,k)=>!tries.some(t=>t.s[k]===s));if(i>=0){msg=`${i+1}번째 글자는 "${w[i]}"`;msgT=4}},
      update(dt){msgT=Math.max(0,msgT-dt);G.setHud(`📝 ${wi+1}/${words.length}번째 직업`,`🔁 ${tries.length}/${MAXT}`,`${L()}글자`)},
      draw(c){const lines=wrapText(c,`💡 ${words[wi][1]}`,AW-40,16);G.rr(10,6,AW-20,24+lines.length*20,12,'#FFF8E6','#6B3D1F',2);lines.forEach((t,i)=>G.text(t,AW/2,22+i*20,16,'#4A240E','center',null));
        const y0=40+lines.length*20;for(let r=0;r<MAXT;r++){const row=tries[r]||(r===tries.length?{s:cur,r:null}:null);for(let i=0;i<L();i++){const x=AW/2-(L()*(bs+6))/2+i*(bs+6),y=y0+r*(bs*.82+6);
          const v=row&&row.r?row.r[i]:-1;G.rr(x,y,bs,bs*.82,8,v===2?'#3FB98A':v===1?'#E0B030':v===0?'#5A5A6A':'rgba(255,255,255,.12)','#8A7AA8',2);if(row&&row.s[i])G.text(row.s[i],x+bs/2,y+bs*.41+1,bs*.5,'#FFF')}}
        const ty=y0+MAXT*(bs*.82+6)+6;tiles.forEach((s,i)=>{const x=16+(i%5)*67,y=ty+Math.floor(i/5)*44,v=state[s]||0;G.rr(x,y,60,38,10,v===3?'#3FB98A':v===2?'#E0B030':v===1?'#4A4A5A':'#8A552B','#4E2C14',2);G.text(s,x+30,y+20,20,'#FFF')});
        if(msgT)G.text(msg,AW/2,ty-12,15,'#FFE27A')},
      tap(x,y){const lines=wrapText(G.ctx,`💡 ${words[wi][1]}`,AW-40,16),y0=40+lines.length*20,ty=y0+MAXT*(bs*.82+6)+6;
        tiles.forEach((s,i)=>{const tx=16+(i%5)*67,yy=ty+Math.floor(i/5)*44;if(x>tx&&x<tx+60&&y>yy&&y<yy+38&&cur.length<L()){cur.push(s);G.sfx('tap')}})}
    }}});

/* ---------- 진로 3: 꿈의 탑 스택볼 (스택 볼 · 헬릭스 점프) ---------- */
arcDefine({id:'career_helix',ch:'career',name:'꿈의 탑 스택볼',tag:'누르고 부수며 내려가기',from:'스택 볼 · 헬릭스 점프',icon:'🗼',
  how:['화면을 누르고 있으면 공이 쾅쾅 아래 칸을 부수며 내려가요. 떼면 통통 튀어요.','검은 칸을 누르고 내려가면 쾅! 하트가 줄어요. 색깔 칸이 공 밑에 올 때 눌러요.','쉬지 않고 많이 부수면 🔥불꽃 공! 그때는 검은 칸도 부술 수 있어요. 직업 도구를 모아요!'],
  init(G){
    const N=18+Math.round(G.d*32), rings=[], JOB=['🩺','🎨','🔬','⚽','🎤','💻','🚒','✈️','🍳','📷'], RW=230,RH=58,GAP=46;
    for(let i=0;i<N;i++){const blk=i<2?0:G.ri(1+Math.round(G.d*2),2+Math.round(G.d*3)),st=G.ri(0,7),sec=[...Array(8)].map(()=>0);for(let k=0;k<blk;k++)sec[(st+k)%8]=1;
      rings.push({sec,off:G.rand(0,Math.PI*2),hue:(i*23)%360,job:Math.random()<.18?G.pick(JOB):null})}
    let rot=0,spd=1.1+2.3*G.d,top=0,by=0,bv=0,hold=false,hearts=3,cool=0,combo=0,fire=0,cam=0,frags=[],got=0;
    const ry=i=>200+(i-top)*GAP+cam;
    const secAt=i=>{const a=((Math.PI/2-rot-rings[i].off)%(Math.PI*2)+Math.PI*4)%(Math.PI*2);return Math.floor(a/(Math.PI/4))%8};
    return {
      boostText:'하트 +1', boost(){hearts=Math.min(3,hearts+1)},
      update(dt){rot+=spd*dt*(Math.floor(top/6)%2?-1:1);cool=Math.max(0,cool-dt);fire=Math.max(0,fire-dt);cam=G.lerp(cam,0,Math.min(1,dt*8));
        for(const f of frags){f.vy+=900*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.a+=f.va*dt}frags=frags.filter(f=>f.y<AH+40);
        if(top>=N)return;
        if(hold&&!cool){by+=700*dt;if(by>=-6){by=-6;const s=secAt(top),black=rings[top].sec[s]===1;
            if(black&&!fire){hearts--;cool=.7;bv=-520;combo=0;G.sfx('hurt');G.shake=8;G.burst(AW/2,ry(top)-10,'#333',16);if(hearts<=0)return G.lose('검은 칸에 너무 많이 부딪혔어요!')}
            else{const r=rings[top];for(let k=0;k<10;k++)frags.push({x:AW/2+G.rand(-RW/2,RW/2),y:ry(top),vx:G.rand(-260,260),vy:G.rand(-300,-60),a:0,va:G.rand(-6,6),col:`hsl(${r.hue},70%,60%)`});
              if(r.job){got++;G.pop(r.job+' 꿈 도구!',AW/2,ry(top)-40,'#FFE27A');G.sfx('coin')}else G.sfx('pop');
              combo++;if(combo>=8&&!fire){fire=2.5;G.sfx('unlock');G.pop('🔥 불꽃 공!',AW/2,120,'#FF9A3A',24)}
              G.addScore(5+combo);top++;cam=GAP;by=-GAP+6;if(top>=N){G.burst(AW/2,300,'#FFE27A',40);return G.win(starsByHearts(hearts))}}}}
        else{bv+=1400*dt;by+=bv*dt;if(by>=-6){by=-6;bv=-480;if(!hold)combo=0}}
        G.setHud(HEARTS(hearts),`🗼 ${top}/${N}`,fire?'🔥 불꽃!':`🎒 ${got}`)},
      draw(c){G.rr(AW/2-14,0,28,AH,6,'#4A3A5A');
        for(let i=Math.min(N-1,top+9);i>=top;i--){const y=ry(i),r=rings[i];if(y>AH+40)continue;
          for(let s=0;s<8;s++){const a0=rot+r.off+s*Math.PI/4,a1=a0+Math.PI/4;c.beginPath();c.ellipse(AW/2,y,RW/2,RH/2,0,a0,a1);c.ellipse(AW/2,y+14,RW/2,RH/2,0,a1,a0,true);c.closePath();
            c.fillStyle=r.sec[s]?'#1A1424':`hsl(${r.hue},70%,${Math.sin(a0+Math.PI/8)>0?62:46}%)`;c.fill();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1;c.stroke()}
          if(r.job)G.emo(r.job,AW/2+Math.cos(rot+r.off+.4)*RW*.32,y-8+Math.sin(rot+r.off+.4)*RH*.3,22)}
        if(top>=N)G.emo('🎓',AW/2,260,60);
        for(const f of frags)G.rr(f.x,f.y,14,8,3,f.col);
        const y=ry(top)+by-14;G.circle(AW/2,y,14,fire?'#FF7A2A':'#FFF3D6',fire?'#FFE27A':'#8A552B',3);if(fire)G.burst(AW/2,y,'#FF9A3A',1,40)},
      down(){hold=true},up(){hold=false},key(k){if(k==='A'||k==='D'){hold=true;setTimeout(()=>hold=false,250)}}
    }}});

/* ---------- 민주시민 1: 투표소 버스 잼 (버스 잼) ---------- */
const VOTE=['보통 선거: 일정한 나이가 되면 누구나 투표해요','평등 선거: 누구나 한 사람 한 표예요','직접 선거: 내가 직접 투표해요','비밀 선거: 누구를 뽑았는지 비밀이에요','다수결로 정해도 소수 의견을 존중해요','투표하기 전에 후보의 약속(공약)을 살펴요'];
arcDefine({id:'democracy_bus',ch:'democracy',name:'투표소 버스 잼',tag:'색깔 맞춰 태우기',from:'버스 잼 (Bus Jam) · 버스 아웃',icon:'🚌',
  how:['위쪽 길까지 막힘없이 나갈 수 있는 주민을 눌러요. 같은 색 버스가 있으면 바로 타요!','다른 색이면 기다리는 칸(5칸)에서 기다려요. 칸이 꽉 차면 실패!','버스는 3명이 타면 투표소로 출발해요. 모든 주민을 투표소에 데려다줘요!'],
  init(G){
    const C=6,R=6,cs=52,ox=(AW-C*cs)/2,oy=220,k=3+Math.round(G.d*3),SLOT=G.d>.6?4:5,COL=['#FF5A6A','#3C8AF0','#FFD24A','#3FB98A','#B07AF0','#FF9A3A'].slice(0,k);
    const nP=Math.min(C*R-3,Math.round(C*R*(.62+.32*G.d)/3)*3);let colors=[];for(let i=0;i<nP/3;i++)colors.push(i%k,i%k,i%k);colors=G.shuffle(colors);
    const cells=G.shuffle([...Array(C*R)].map((_,i)=>i)).slice(0,nP);let grid=Array(C*R).fill(null);cells.forEach((cI,i)=>grid[cI]={c:colors[i],hid:G.d>.35&&Math.random()<.15+.4*G.d});
    const counts=COL.map((_,i)=>colors.filter(x=>x===i).length/3);let buses=G.shuffle(counts.flatMap((n,i)=>Array(n).fill(i))).map(c=>({c,seat:0}));
    let wait=[],maxWait=0,walkers=[],leaving=0,fact='';
    const free=i=>{if(i<C)return true;const seen=new Set([i]),q=[i];while(q.length){const a=q.shift(),r=Math.floor(a/C),cc=a%C;for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]){const R2=r+dr,C2=cc+dc;if(R2<0||C2<0||R2>=R||C2>=C)continue;const b=R2*C+C2;if(seen.has(b)||grid[b])continue;if(R2===0)return true;seen.add(b);q.push(b)}}return false};
    const board=()=>{const b=buses[0];if(!b)return;for(let i=0;i<wait.length;i++){if(wait[i].c===b.c&&b.seat<3){b.seat++;wait.splice(i,1);i--;G.sfx('place')}}if(b.seat>=3)depart()};
    const depart=()=>{const b=buses.shift();leaving=1;fact=G.pick(VOTE);G.sfx('deliver');G.addScore(30);if(!buses.length&&!grid.some(Boolean)&&!wait.length)return G.win(maxWait<=3?3:maxWait<=4?2:1);setTimeout(board,350)};
    return {
      boostText:'기다리는 칸 정리', boost(){wait=wait.slice(Math.min(2,wait.length));},
      update(dt){leaving=Math.max(0,leaving-dt*1.5);for(const w of walkers)w.t+=dt*3;walkers=walkers.filter(w=>w.t<1);
        G.setHud(`🚌 남은 버스 ${buses.length}`,`🪑 기다림 ${wait.length}/${SLOT}`,`🧑 ${grid.filter(Boolean).length}`)},
      draw(c){G.rr(0,40,AW,110,0,'#5A5A6A');c.strokeStyle='#FFD24A';c.setLineDash([12,10]);c.lineWidth=3;c.beginPath();c.moveTo(0,95);c.lineTo(AW,95);c.stroke();c.setLineDash([]);
        G.emo('🗳️',AW-28,68,34);buses.slice(0,3).forEach((b,i)=>{const x=40+i*110-(i===0?leaving*200:0);G.rr(x,60,100,58,14,COL[b.c],'#1A1A2A',3);G.rr(x+8,68,84,18,6,'rgba(255,255,255,.6)');
          for(let s=0;s<3;s++)G.circle(x+24+s*26,100,8,s<b.seat?'#FFF':'rgba(0,0,0,.3)');if(i===0)G.text('투표소행',x+50,77,12,'#2A1A0E','center',null)});
        G.text(fact,AW/2,140,12,'#FFE9A8');
        for(let i=0;i<SLOT;i++){G.rr(30+i*62,158,54,50,10,'rgba(255,255,255,.12)','#8A7AA8',2);const w=wait[i];if(w)drawP(c,G,30+i*62+27,186,COL[w.c],false)}
        G.rr(ox-6,oy-6,C*cs+12,R*cs+12,12,'#3A5A3A');
        for(let i=0;i<C*R;i++){const x=ox+(i%C)*cs,y=oy+Math.floor(i/C)*cs;G.rr(x+2,y+2,cs-4,cs-4,8,'#5E8A58');const p=grid[i];if(!p)continue;const ok=free(i);
          drawP(c,G,x+cs/2,y+cs/2+4,p.hid&&!ok?'#777':COL[p.c],!ok);if(p.hid&&!ok)G.text('?',x+cs/2,y+cs/2-2,16,'#FFF')}}
      ,tap(x,y){const cI=Math.floor((x-ox)/cs),rI=Math.floor((y-oy)/cs);if(cI<0||rI<0||cI>=C||rI>=R)return;const i=rI*C+cI,p=grid[i];if(!p)return;
        if(!free(i)){G.sfx('no');G.pop('길이 막혔어요',x,y-20,'#FF8A8A',14);return}
        grid[i]=null;const b=buses[0];if(b&&b.c===p.c&&b.seat<3){b.seat++;G.sfx('place');if(b.seat>=3)depart()}else{wait.push(p);maxWait=Math.max(maxWait,wait.length);G.sfx('tap');if(wait.length>SLOT)return G.lose('기다리는 칸이 꽉 찼어요! 버스 색을 보고 차례를 생각해요.')}
        if(!grid.some(Boolean)&&!wait.length&&!buses.length)G.win(maxWait<=3?3:maxWait<=4?2:1)}
    };
    function drawP(c,G,x,y,col,dim){c.globalAlpha=dim?.55:1;G.rr(x-11,y-2,22,20,8,col,'#1A1A2A',2);G.circle(x,y-10,9,'#FFD9B8','#6B3D1F',2);c.globalAlpha=1}
  }});

/* ---------- 민주시민 2: 회의장 화살표 탈출 (애로우즈 퍼즐 이스케이프) ---------- */
arcDefine({id:'democracy_arrows',ch:'democracy',name:'회의장 화살표 탈출',tag:'차례 지켜 빼내기',from:'애로우즈 – 퍼즐 이스케이프',icon:'➡️',
  how:['화살표를 누르면 그 방향으로 쭉 미끄러져 판 밖으로 나가요.','앞에 다른 화살표가 있으면 쾅 부딪혀요(하트 -1). 누가 먼저 나가야 할지 차례를 생각해요!','모든 화살표를 빼내면 성공! 회의도 차례를 지켜야 모두의 의견이 나와요.'],
  init(G){
    const n=G.d<.3?5:G.d<.6?6:G.d<.85?7:8, cs=Math.min(300/n,52), ox=(AW-cs*n)/2, oy=40, DV={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]};
    let pieces=[],occ=()=>{const m=new Map();pieces.forEach((p,i)=>p.cells.forEach(c=>m.set(c[0]*n+c[1],i)));return m};
    const want=Math.round(n*n*(.3+.32*G.d));let tries=0;let time=120-55*G.d;
    while(pieces.reduce((a,p)=>a+p.cells.length,0)<want&&tries<4000){tries++;const d=G.pick(Object.keys(DV)),len=Math.random()<.5?1:Math.random()<.6?2:3,[dr,dc]=DV[d];
      const hr=G.ri(0,n-1),hc=G.ri(0,n-1),cells=[];for(let k=0;k<len;k++)cells.push([hr-dr*k,hc-dc*k]);
      if(cells.some(([r,c])=>r<0||c<0||r>=n||c>=n))continue;const m=occ();if(cells.some(([r,c])=>m.has(r*n+c)))continue;
      let r=hr+dr,c=hc+dc,clear=true;while(r>=0&&c>=0&&r<n&&c<n){if(m.has(r*n+c)){clear=false;break}r+=dr;c+=dc}if(!clear)continue;
      pieces.push({d,cells,col:`hsl(${G.ri(0,360)},65%,62%)`,off:0,shake:0})}
    pieces.reverse();
    let hearts=G.d>.7?2:3,moving=null,cleared=0,total=pieces.length;
    return {
      boostText:'하트 +1', boost(){hearts=Math.min(3,hearts+1)},
      update(dt){time-=dt;if(time<=0)return G.lose('시간이 다 됐어요!');for(const p of pieces)p.shake=Math.max(0,p.shake-dt*4);
        if(moving){const p=moving;p.off+=dt*14;if(p.lim!=null&&p.off>=p.lim){p.off=0;moving=null;p.shake=1;hearts--;G.sfx('hurt');G.shake=5;if(hearts<=0)return G.lose('너무 많이 부딪혔어요! 막히지 않은 화살표부터 빼요.')}
          else if(p.lim==null&&p.off>n+3){pieces=pieces.filter(x=>x!==p);moving=null;cleared++;G.sfx('pop');G.addScore(10);if(!pieces.length)return G.win(starsByHearts(hearts))}}
        G.setHud(HEARTS(hearts),`➡️ ${cleared}/${total}`,TIME(time))},
      draw(c){G.rr(ox-6,oy-6,n*cs+12,n*cs+12,12,'#2A2244','#8A7AA8',3);for(let r=0;r<n;r++)for(let k=0;k<n;k++)G.circle(ox+k*cs+cs/2,oy+r*cs+cs/2,3,'rgba(255,255,255,.2)');
        for(const p of pieces){const [dr,dc]=DV[p.d],sx=Math.sin(p.shake*20)*p.shake*4;c.save();c.translate(dc*p.off*cs+sx,dr*p.off*cs);
          c.strokeStyle=p.col;c.lineWidth=cs*.34;c.lineCap='round';c.beginPath();p.cells.forEach((q,i)=>{const x=ox+q[1]*cs+cs/2,y=oy+q[0]*cs+cs/2;i?c.lineTo(x,y):c.moveTo(x,y)});
          if(p.cells.length===1){const q=p.cells[0];c.moveTo(ox+q[1]*cs+cs/2-dc*cs*.25,oy+q[0]*cs+cs/2-dr*cs*.25);c.lineTo(ox+q[1]*cs+cs/2,oy+q[0]*cs+cs/2)}c.stroke();
          const h=p.cells[0],hx=ox+h[1]*cs+cs/2+dc*cs*.3,hy=oy+h[0]*cs+cs/2+dr*cs*.3;c.fillStyle=p.col;c.beginPath();c.moveTo(hx+dc*cs*.22,hy+dr*cs*.22);c.lineTo(hx-dr*cs*.3,hy+dc*cs*.3);c.lineTo(hx+dr*cs*.3,hy-dc*cs*.3);c.fill();c.restore()}
        G.text('막힌 화살표는 나중에! 나갈 길이 열린 것부터',AW/2,oy+n*cs+28,14,'#FFE9A8')},
      tap(x,y){if(moving)return;const cI=Math.floor((x-ox)/cs),rI=Math.floor((y-oy)/cs);if(cI<0||rI<0||cI>=n||rI>=n)return;
        const p=pieces.find(p=>p.cells.some(q=>q[0]===rI&&q[1]===cI));if(!p)return;const [dr,dc]=DV[p.d],m=occ();let r=p.cells[0][0]+dr,c=p.cells[0][1]+dc,k=0,lim=null;
        while(r>=0&&c>=0&&r<n&&c<n){if(m.has(r*n+c)&&pieces[m.get(r*n+c)]!==p){lim=k+.35;break}r+=dr;c+=dc;k++}
        p.lim=lim;p.off=0;moving=p;G.sfx(lim==null?'whoosh':'tap')}
    }}});
