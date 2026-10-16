/* ===== 새 섬 놀이 2/3: 민주 탐정 브레인 · 다른 그림 찾기 · 세계 시장 헥사 · 철길 나사 잼 · 남북 블록 잼 · 괭이갈매기.io ===== */

/* ---------- 민주시민 3: 민주 탐정 브레인 테스트 (브레인 테스트 · 생각 퀴즈) ---------- */
arcDefine({id:'democracy_brain',ch:'democracy',name:'민주 탐정 브레인',tag:'생각하는 퀴즈 퍼즐',from:'브레인 테스트 · 생각 퀴즈 게임',icon:'🧠',
  how:['한 단계에 여러 가지 생각 문제가 나와요: OX, 순서 맞추기, 표 세기, 소수 의견 찾기, 비밀 투표!','문제마다 시간이 있어요. 틀리거나 시간이 지나면 하트가 줄어요.','문제를 잘 읽어요 — 브레인 테스트처럼 숨은 방법이 있을 수도 있어요!'],
  init(G){
    const ci=G.trial?3:CI, games=(typeof GAMES!=='undefined'&&GAMES[CH[ci].id])||[], oxs=games.filter(g=>g.type==='ox').flatMap(g=>g.cards), ords=games.filter(g=>g.type==='order');
    const n=5+Math.round(G.d*4), TL=24-13*G.d; let hearts=3,idx=0,cur=null,t=TL,flash=null;
    const kinds=G.shuffle(['ox','ox','order','count','minority','secret','mc','mc']).slice(0,n);
    const make=k=>{
      if(k==='ox'&&oxs.length){const c=G.pick(oxs);return {k,txt:`맞으면 ⭕, 틀리면 ❌`,stmt:c.t,ans:c.a}}
      if(k==='order'&&ords.length){const o=G.pick(ords);const items=o.items.map((s,i)=>({s,i}));return {k,txt:o.prompt,items:G.shuffle(items),next:0,x:o.x}}
      if(k==='count'){const a=G.ri(5,9+Math.round(G.d*8)),b=G.ri(3,a-1),list=G.shuffle([...Array(a).fill('⭕'),...Array(b).fill('❌')]);return {k,txt:'반장 선거 개표! ⭕가 몇 표일까요? (다수결)',list,ans:a,opts:G.shuffle([a,a+1,a-1,b].filter((v,i,s)=>s.indexOf(v)===i)).slice(0,4)}}
      if(k==='minority'){const m=G.ri(14,24),pos=G.ri(0,m-1);return {k,txt:'모두 🍎를 원해요. 그런데 다른 의견도 있어요! 소수 의견을 찾아 눌러 주세요.',m,pos,odd:G.pick(['🍌','🍇','🍊'])}}
      if(k==='secret')return {k,txt:'비밀 선거! 투표지를 투표함에 넣어요. (힌트: 누가 보고 있으면 안 돼요)',curtain:false,drag:null,bx:90,by:420};
      const q=drawQ(ci);return {k:'mc',txt:q.q,q,ord:G.shuffle(q.o.map((_,i)=>i))}};
    const next=()=>{if(idx>=kinds.length)return G.win(starsByHearts(hearts));cur=make(kinds[idx]);t=TL};
    const right=()=>{G.sfx('ok');G.burst(AW/2,260,'#7FFFA0',20);G.addScore(20);flash={ok:1,t:.8};idx++;setTimeout(()=>{if(!G.over)next()},700);cur.done=1};
    const wrong=why=>{hearts--;G.sfx('no');G.shake=6;flash={ok:0,t:1.2,why};if(hearts<=0){cur.done=1;return G.lose(why||'생각 문제를 너무 많이 틀렸어요.')}idx++;cur.done=1;setTimeout(()=>{if(!G.over)next()},1100)};
    next();
    const B=(i,n2)=>({x:24,y:250+i*62,w:AW-48,h:52});
    return {
      boostText:'시간 +10초', boost(){t+=10},
      update(dt){if(flash){flash.t-=dt;if(flash.t<=0)flash=null}if(cur&&!cur.done){t-=dt;if(t<=0)wrong('시간이 다 됐어요!')}
        G.setHud(HEARTS(hearts),`🧠 ${Math.min(idx+1,kinds.length)}/${kinds.length}`,TIME(t))},
      draw(c){if(!cur)return;G.rr(10,10,AW-20,96,14,'#FFF8E6','#6B3D1F',3);wrapText(c,cur.txt,AW-44,16).slice(0,4).forEach((l,i)=>G.text(l,AW/2,30+i*21,16,'#3A240E','center',null));
        G.rr(16,112,(AW-32)*Math.max(0,t/TL),6,3,'#FFD24A');
        if(cur.k==='ox'){G.rr(20,140,AW-40,90,14,'#2A2244','#8A7AA8',2);wrapText(c,`“${cur.stmt}”`,AW-70,17).slice(0,3).forEach((l,i)=>G.text(l,AW/2,165+i*22,17));
          G.rr(30,280,140,140,24,'#3FB98A','#1F6B4A',4);G.text('⭕',100,350,60,'#FFF','center',null);G.rr(190,280,140,140,24,'#E2513A','#6B1F14',4);G.text('❌',260,350,60,'#FFF','center',null)}
        if(cur.k==='order'){cur.items.forEach((it,i)=>{const b=B(i);const done=it.done;G.rr(b.x,b.y-110,b.w,b.h,12,done?'#3FB98A':'#8A552B','#4E2C14',2);G.text(done?`${it.n}. ${it.s}`:it.s,AW/2,b.y-110+b.h/2,15,'#FFF')})}
        if(cur.k==='count'){cur.list.forEach((e,i)=>G.text(e,30+(i%9)*36,150+Math.floor(i/9)*34,24,'#FFF','center',null));cur.opts.forEach((v,i)=>{const x=20+(i%2)*165,y=380+Math.floor(i/2)*66;G.rr(x,y,155,56,14,'#8A552B','#4E2C14',3);G.text(`${v}표`,x+77,y+28,22,'#FFF')})}
        if(cur.k==='minority'){for(let i=0;i<cur.m;i++){const x=40+(i%6)*56,y=160+Math.floor(i/6)*62;G.emo('🙋',x,y,38);G.emo(i===cur.pos?cur.odd:'🍎',x+16,y-18,20)}}
        if(cur.k==='secret'){G.rr(220,200,120,220,10,cur.curtain?'#B03A5A':'rgba(176,58,90,.25)','#6B1F34',3);G.text(cur.curtain?'기표소 커튼 닫힘':'커튼을 눌러 닫아요',280,190,13);
          if(!cur.curtain){G.emo('👀',150,170,40);G.emo('🧍',150,215,40)}G.emo('🗳️',280,360,70);const d=cur.drag;G.emo('📄',d?d.x:cur.bx,d?d.y:cur.by,40);G.text('투표지를 끌어 넣어요',90,470,13)}
        if(cur.k==='mc'){cur.ord.forEach((oi,j)=>{const x=20,y=140+j*74;G.rr(x,y,AW-40,64,14,'#8A552B','#4E2C14',3);wrapText(c,`${'가나다라'[j]}. ${cur.q.o[oi]}`,AW-70,15).slice(0,2).forEach((l,k)=>G.text(l,AW/2,y+(k?42:22)+(wrapText(c,cur.q.o[oi],AW-70,15).length>1?0:10),15,'#FFF'))})}
        if(flash){G.rr(40,200,AW-80,110,20,flash.ok?'rgba(63,185,138,.95)':'rgba(226,81,58,.95)');G.text(flash.ok?'딩동댕! 🧠':'앗!',AW/2,235,28,'#FFF');if(!flash.ok&&flash.why)wrapText(c,flash.why,AW-110,14).slice(0,2).forEach((l,i)=>G.text(l,AW/2,268+i*18,14,'#FFF'))}},
      down(x,y){if(cur&&cur.k==='secret'&&!cur.done&&Math.hypot(x-cur.bx,y-cur.by)<34)cur.drag={x,y}},
      move(x,y,dn){if(cur&&cur.drag&&dn){cur.drag.x=x;cur.drag.y=y}},
      up(x,y){if(cur&&cur.k==='secret'&&cur.drag&&!cur.done){const d=cur.drag;cur.drag=null;if(Math.abs(d.x-280)<60&&Math.abs(d.y-360)<60){if(cur.curtain)right();else wrong('누가 보고 있었어요! 비밀 선거는 커튼을 닫고 혼자 투표해요.')}}},
      tap(x,y){if(!cur||cur.done||flash)return;const k=cur.k;
        if(k==='ox'&&y>280&&y<420){const pick=x<AW/2;if(pick===cur.ans)right();else wrong('다시 생각해 봐요. 탐정은 근거를 따져요!')}
        if(k==='order'){cur.items.forEach((it,i)=>{const b=B(i);if(it.done||y<b.y-110||y>b.y-110+b.h)return;if(it.i===cur.next){it.done=1;it.n=++cur.next;G.sfx('tap');if(cur.next>=cur.items.length)right()}else wrong(cur.x||'순서를 다시 생각해 봐요.')})}
        if(k==='count'){cur.opts.forEach((v,i)=>{const bx=20+(i%2)*165,by=380+Math.floor(i/2)*66;if(x>bx&&x<bx+155&&y>by&&y<by+56){if(v===cur.ans)right();else wrong(`⭕는 ${cur.ans}표였어요. 하나씩 차근차근 세어요!`)}})}
        if(k==='minority'){for(let i=0;i<cur.m;i++){const ex=40+(i%6)*56,ey=160+Math.floor(i/6)*62;if(Math.hypot(x-ex,y-ey)<28){if(i===cur.pos)right();else wrong('같은 의견이에요. 다른 과일을 원하는 친구를 찾아요!')}}}
        if(k==='secret'&&x>220&&x<340&&y>200&&y<420&&!cur.drag){cur.curtain=true;G.sfx('whoosh')}
        if(k==='mc'){cur.ord.forEach((oi,j)=>{const by=140+j*74;if(y>by&&y<by+64){if(oi===cur.q.a)right();else{if(!G.trial)wrongAdd(CI,cur.q);wrong(cur.q.x)}}})}}
    }}});

/* ---------- 인권 3: 모두의 마을 다른 그림 찾기 ---------- */
const DIFF_PROPS=[['📚','교육받을 권리'],['🏥','건강할 권리'],['🍚','먹을 권리'],['🏠','집에서 살 권리'],['⚽','놀 권리'],['🎨','문화를 누릴 권리'],['🛡️','보호받을 권리'],['♿','누구나 다닐 수 있는 길'],['🚸','어린이 보호 구역'],['🌳','쉴 곳'],['🗣️','말할 권리'],['🕊️','평화'],['🎒','학교 가는 길'],['🧸','놀이'],['🍎','건강한 음식'],['💧','깨끗한 물']];
arcDefine({id:'rights_diff',ch:'rights',name:'모두의 마을 틀린 그림',tag:'다른 그림 찾기',from:'다른 그림 찾기 · 틀린 그림 찾기',icon:'🔍',
  how:['위와 아래 그림에서 다른 곳을 찾아 눌러요!','찾을 때마다 그 물건이 지켜 주는 어린이 권리를 알려 줘요.','아무 데나 누르면 시간이 줄어요. 빨리 찾을수록 별이 많아요!'],
  init(G){
    const K=4+Math.round(G.d*5), PW=340, PH=228, P1=36, P2=286, nP=14+Math.round(G.d*14);
    let props=[];for(let tries=0;props.length<nP&&tries<500;tries++){const x=G.rand(26,PW-26),y=G.rand(70,PH-22),s=G.rand(26-8*G.d,40-12*G.d);if(props.some(p=>Math.hypot(p.x-x,p.y-y)<(p.s+s)*.62))continue;props.push({x,y,s,e:G.pick(DIFF_PROPS)})}
    const diffs=G.shuffle(props).slice(0,K).map(p=>{const kind=G.pick(['gone','swap','big']);let e2=p.e;if(kind==='swap'){do{e2=G.pick(DIFF_PROPS)}while(e2[0]===p.e[0])}return {p,kind,e2,found:false}});
    let time=72-32*G.d,miss=0,hint=0;const T0=time;
    const drawScene=(oy,alt)=>{const c=G.ctx;G.rr(10,oy,PW,PH,14,null);c.save();c.beginPath();c.roundRect?c.roundRect(10,oy,PW,PH,14):c.rect(10,oy,PW,PH);c.clip();
      c.fillStyle=G.grad(oy,oy+PH,'#9FD8FF','#E8F7FF');c.fillRect(10,oy,PW,PH);c.fillStyle='#7FC870';c.fillRect(10,oy+PH*.55,PW,PH*.45);
      G.rr(40,oy+40,70,60,4,'#F3D2A6','#6B3D1F',2);G.rr(260,oy+30,70,70,4,'#D8C8F0','#4A3878',2);
      for(const p of props){const d=alt&&diffs.find(x=>x.p===p);if(d&&d.kind==='gone')continue;G.emo(d&&d.kind==='swap'?d.e2[0]:p.e[0],10+p.x,oy+p.y,d&&d.kind==='big'?p.s*1.45:p.s)}
      c.restore();G.rr(10,oy,PW,PH,14,null,'#6B3D1F',4)};
    return {
      boostText:'다른 곳 하나 알려 주기', boost(){hint=3},
      update(dt){time-=dt;hint=Math.max(0,hint-dt);if(time<=0)return G.lose('시간이 다 됐어요!');G.setHud(TIME(time),`🔍 ${diffs.filter(d=>d.found).length}/${K}`,miss?`❌ ${miss}`:`${G.lv}단계`)},
      draw(c){drawScene(P1,false);drawScene(P2,true);G.text('▲ 위 그림 · 아래 그림 ▼  다른 곳을 찾아요',AW/2,P1+PH+11,13,'#FFE9A8');
        for(const d of diffs){if(d.found){for(const oy of [P1,P2])G.circle(10+d.p.x,oy+d.p.y,d.p.s*.8+6,null,'#FF3A3A',4)}}
        if(hint){const d=diffs.find(d=>!d.found);if(d)for(const oy of [P1,P2])G.circle(10+d.p.x,oy+d.p.y,30+Math.sin(G.t*10)*5,null,'#FFE27A',3)}},
      tap(x,y){const oy=y<P1+PH+6?P1:P2,lx=x-10,ly=y-oy;if(ly<0||ly>PH)return;
        const d=diffs.find(d=>!d.found&&Math.hypot(d.p.x-lx,d.p.y-ly)<Math.max(26,d.p.s*.8));
        if(d){d.found=true;G.sfx('ok');G.burst(x,y,'#FFE27A',14);G.addScore(20);const info=(d.kind==='swap'?d.e2:d.p.e);G.pop(`${info[0]} ${info[1]}`,AW/2,y-30,'#FFE27A',17);
          if(diffs.every(d=>d.found))G.win(time>T0*.5&&miss<=1?3:time>T0*.25?2:1)}
        else{miss++;const pen=Math.round(4+4*G.d);time-=pen;G.sfx('no');G.pop(`-${pen}초`,x,y-20,'#FF8A8A',16)}}
    }}});

/* ---------- 다문화 2: 세계 시장 헥사 소트 (헥사 소트) ---------- */
const SPICE=[['#E2513A','고춧가루','한국'],['#F0B020','강황','인도'],['#C03070','비트','러시아'],['#3FB98A','바질','이탈리아'],['#8A6AE0','라벤더','프랑스'],['#3C8AF0','블루 커피콩','에티오피아']];
arcDefine({id:'multi_hexa',ch:'multi',name:'세계 시장 헥사',tag:'육각 쌓기 정렬',from:'헥사 소트 (Hexa Sort)',icon:'⬢',
  how:['아래 육각 더미 3개 중 하나를 끌어 빈 칸에 놓아요.','옆 칸과 맨 위 색이 같으면 그 색 조각들이 한쪽으로 모여요.','같은 색이 10개 모이면 펑! 세계의 향신료 이름을 알려 줘요. 판이 꽉 차기 전에 목표만큼 없애요!'],
  init(G){
    const R=G.d<.4?2:3, hs=R===2?30:24, k=4+Math.round(G.d*2), COL=SPICE.slice(0,k), goal=50+Math.round(G.d*170), CY=230;
    const cells=[];for(let q=-R;q<=R;q++)for(let r=-R;r<=R;r++){if(Math.abs(q+r)>R)continue;cells.push({q,r,x:AW/2+hs*1.5*q,y:CY+hs*Math.sqrt(3)*(r+q/2),st:[]})}
    const nb=c=>cells.filter(o=>o!==c&&Math.abs(o.q-c.q)+Math.abs(o.r-c.r)+Math.abs((o.q+o.r)-(c.q+c.r))===2);
    const mkStack=()=>{const n=G.ri(2,5),runs=G.ri(1,Math.min(3,1+Math.round(G.d*2))),st=[];let col=G.ri(0,k-1);for(let i=0;i<n;i++){if(i&&Math.random()<runs/n)col=(col+G.ri(1,k-1))%k;st.push(col)}return st};
    let offer=[mkStack(),mkStack(),mkStack()],drag=null,cleared=0,busy=0;
    const top=c=>c.st[c.st.length-1], run=c=>{let n=0;const t=top(c);for(let i=c.st.length-1;i>=0&&c.st[i]===t;i--)n++;return n};
    const settle=start=>{const q=[start];let guard=0;while(q.length&&guard++<200){const c=q.shift();if(!c.st.length)continue;
        for(const o of nb(c)){if(o.st.length&&top(o)===top(c)){const n=run(o);c.st.push(...o.st.splice(o.st.length-n,n));G.sfx('place');q.push(o);q.push(c)}}
        if(run(c)>=10){const n=run(c),col=top(c);c.st.splice(c.st.length-n,n);cleared+=n;G.sfx('clear');G.burst(c.x,c.y,COL[col][0],24);G.pop(`${COL[col][1]} (${COL[col][2]})`,c.x,c.y-30,'#FFE27A',16);G.addScore(n*5);q.push(c);nb(c).forEach(o=>q.push(o))}}
      if(cleared>=goal)return G.win(cells.filter(c=>c.st.length).length<=cells.length*.4?3:cells.filter(c=>!c.st.length).length>=3?2:1);
      if(cells.every(c=>c.st.length))G.lose('판이 꽉 찼어요! 같은 색끼리 이웃하게 놓아요.')};
    const hexPath=(c,x,y,s)=>{c.beginPath();for(let i=0;i<6;i++){const a=Math.PI/3*i;c.lineTo(x+s*Math.cos(a),y+s*Math.sin(a))}c.closePath()};
    const drawStack=(c,st,x,y,s)=>{st.forEach((col,i)=>{hexPath(c,x,y-i*3,s*.92);c.fillStyle=COL[col][0];c.fill();c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=1.5;c.stroke()});if(st.length)G.text(String(run({st})),x,y-st.length*3+1,12,'#FFF')};
    const OY=470;
    return {
      boostText:'새 더미로 바꾸기', boost(){offer=[mkStack(),mkStack(),mkStack()]},
      update(){G.setHud(`⬢ ${cleared}/${goal}`,`빈 칸 ${cells.filter(c=>!c.st.length).length}`,`${k}색`)},
      draw(c){for(const cl of cells){hexPath(c,cl.x,cl.y,hs*.96);c.fillStyle='rgba(255,255,255,.1)';c.fill();c.strokeStyle='rgba(255,255,255,.25)';c.stroke();drawStack(c,cl.st,cl.x,cl.y,hs)}
        offer.forEach((st,i)=>{if(!st||(drag&&drag.i===i))return;drawStack(c,st,70+i*110,OY,26)});
        if(drag)drawStack(c,offer[drag.i],drag.x,drag.y,hs)},
      down(x,y){offer.forEach((st,i)=>{if(st&&Math.hypot(x-(70+i*110),y-OY)<40)drag={i,x,y}})},
      move(x,y,dn){if(drag&&dn){drag.x=x;drag.y=y-20}},
      up(){if(!drag)return;const d=drag;drag=null;const cl=cells.filter(c=>!c.st.length).sort((a,b)=>Math.hypot(a.x-d.x,a.y-d.y)-Math.hypot(b.x-d.x,b.y-d.y))[0];
        if(!cl||Math.hypot(cl.x-d.x,cl.y-d.y)>hs*1.2){G.sfx('no');return}cl.st=offer[d.i].slice();offer[d.i]=null;G.sfx('place');
        if(offer.every(o=>!o))offer=[mkStack(),mkStack(),mkStack()];settle(cl)}
    }}});

/* ---------- 통일 2: 철길 나사 잼 (스크류 잼 · 너츠 앤 볼츠) ---------- */
const RAIL=['경의선은 서울과 신의주를 잇던 철길이에요.','남과 북의 철길이 이어지면 기차로 유럽까지 갈 수 있어요.','이산가족은 분단으로 헤어진 가족이에요.','남북은 같은 한글을 써요.','평화는 서로를 이해하는 데서 시작해요.','2018년 남북 정상이 판문점에서 만났어요.'];
arcDefine({id:'unify_screw',ch:'unify',name:'철길 나사 잼',tag:'나사 빼기 퍼즐',from:'스크류 잼 · 너츠 앤 볼츠',icon:'🔩',
  how:['맨 위에 보이는 나사를 눌러 빼요. 위쪽 같은 색 공구함에 쏙 들어가요!','같은 색 공구함이 없으면 아래 보관함(5칸)에서 기다려요. 보관함이 꽉 차면 실패!','나사가 다 빠진 판은 떨어져요. 모든 나사를 빼서 철길을 고쳐요!'],
  init(G){
    const k=3+Math.round(G.d*2), COL=['#FF5A6A','#3C8AF0','#FFD24A','#3FB98A','#B07AF0'].slice(0,k), layers=3+Math.round(G.d*5), TRAY=G.d>.6?4:5;
    let plates=[];for(let L=0;L<layers;L++){const n=G.ri(1,2);for(let i=0;i<n;i++){const w=G.rand(110,220),h=G.rand(60,110),x=G.rand(20,AW-20-w),y=G.rand(150,430-h);
      const sc=[];const m=G.ri(2,4),pts=[[x+16,y+16],[x+w-16,y+16],[x+16,y+h-16],[x+w-16,y+h-16]];G.shuffle(pts).slice(0,m).forEach(p=>sc.push({x:p[0],y:p[1]}));plates.push({x,y,w,h,L,sc,hue:G.ri(20,45),fall:0})}}
    let screws=plates.flatMap(p=>p.sc.map(s=>Object.assign(s,{p})));while(screws.length%3){const s=screws.pop();s.p.sc=s.p.sc.filter(x=>x!==s)}
    const cols=G.shuffle(screws.map((_,i)=>Math.floor(i/3)%k));screws.forEach((s,i)=>s.c=cols[i]);
    const per=COL.map((_,i)=>screws.filter(s=>s.c===i).length/3);let queue=G.shuffle(per.flatMap((n,i)=>Array(n).fill(i)));let boxes=[queue.shift(),queue.shift()].map(c=>c==null?null:{c,n:0});
    let tray=[],left=screws.length,maxTray=0,fact='';
    const covered=s=>plates.some(p=>p!==s.p&&!p.gone&&p.L>s.p.L&&s.x>p.x-6&&s.x<p.x+p.w+6&&s.y>p.y-6&&s.y<p.y+p.h+6);
    const refill=()=>{boxes.forEach((b,i)=>{if(b&&b.n>=3){G.sfx('deliver');G.addScore(30);boxes[i]=queue.length?{c:queue.shift(),n:0}:null}});
      let moved=true;while(moved){moved=false;for(const b of boxes){if(!b||b.n>=3)continue;const j=tray.findIndex(s=>s.c===b.c);if(j>=0){tray.splice(j,1);b.n++;moved=true}}}
      if(boxes.some(b=>b&&b.n>=3))refill()};
    return {
      boostText:'보관함 한 칸 비우기', boost(){if(tray.length){tray.pop();left--}},
      update(dt){for(const p of plates)if(p.gone)p.fall+=dt*700;plates=plates.filter(p=>p.fall<700);G.setHud(`🔩 남은 ${left}`,`🧰 보관 ${tray.length}/${TRAY}`,`${G.lv}단계`)},
      draw(c){G.rr(10,140,AW-20,300,14,'#2A3A2A');c.strokeStyle='#8A7A6A';c.lineWidth=6;c.beginPath();c.moveTo(10,300);c.lineTo(AW-10,300);c.moveTo(10,330);c.lineTo(AW-10,330);c.stroke();
        [...plates].sort((a,b)=>a.L-b.L).forEach(p=>{const y=p.y+p.fall;G.rr(p.x,y,p.w,p.h,10,`hsla(${p.hue},55%,${48+p.L*4}%,.92)`,'#3A2010',2.5);
          p.sc.forEach(s=>{if(s.gone)return;const cv=covered(s);G.circle(s.x,s.y+p.fall,11,COL[s.c],'#1A1A2A',2);G.rr(s.x-6,s.y+p.fall-1.5,12,3,1,'rgba(0,0,0,.5)');if(cv)G.circle(s.x,s.y+p.fall,11,'rgba(0,0,0,.45)')})});
        boxes.forEach((b,i)=>{const x=40+i*150;G.rr(x,40,130,70,14,b?COL[b.c]:'#444','#1A1A2A',3);G.emo('🧰',x+26,75,32);if(b)for(let s=0;s<3;s++)G.circle(x+66+s*22,75,8,s<b.n?'#FFF':'rgba(0,0,0,.3)')});
        G.text(fact,AW/2,126,12,'#FFE9A8');
        G.rr(20,452,AW-40,62,14,'#4E2C14','#D9A441',3);for(let i=0;i<TRAY;i++){G.rr(32+i*62,462,52,42,8,'#2A1A0E');if(tray[i])G.circle(58+i*62,483,12,COL[tray[i].c],'#111',2)}},
      tap(x,y){const s=screws.filter(s=>!s.gone&&!s.p.gone&&Math.hypot(s.x-x,s.y-y)<18).sort((a,b)=>b.p.L-a.p.L)[0];if(!s)return;if(covered(s)){G.sfx('no');G.pop('판에 가려졌어요',x,y-20,'#FF8A8A',13);return}
        s.gone=1;left--;G.sfx('pop');const b=boxes.find(b=>b&&b.c===s.c&&b.n<3);if(b){b.n++;refill()}else{tray.push(s);maxTray=Math.max(maxTray,tray.length)}
        if(s.p.sc.every(q=>q.gone)){s.p.gone=1;fact=G.pick(RAIL);G.sfx('whoosh')}
        if(!left&&!tray.length)return G.win(maxTray<=2?3:maxTray<=4?2:1);
        if(tray.length>=TRAY&&!boxes.some(b=>b&&tray.some(t=>t.c===b.c)))G.lose('보관함이 꽉 찼어요! 공구함 색을 먼저 살펴요.')}
    }}});

/* ---------- 통일 3: 남북 블록 잼 (컬러 블록 잼) ---------- */
arcDefine({id:'unify_cbj',ch:'unify',name:'남북 열차 블록 잼',tag:'밀어서 빼내기',from:'컬러 블록 잼 (Color Block Jam)',icon:'🚃',
  how:['열차 칸 블록을 손가락으로 밀어 움직여요. 다른 블록이나 벽에 막히면 멈춰요.','판 가장자리의 같은 색 역문에 닿으면 열차 칸이 빠져나가요! (문보다 넓으면 못 나가요)','모든 열차 칸을 빼내면 남북 철길이 이어져요. 빨리 할수록 별이 많아요!'],
  init(G){
    const n=6+Math.round(G.d*2), cs=Math.min(300/n,48), ox=(AW-cs*n)/2, oy=70, k=3+Math.round(G.d*2), COL=['#FF5A6A','#3C8AF0','#FFD24A','#3FB98A','#B07AF0'].slice(0,k);
    const SH=[[[0,0]],[[0,0],[0,1]],[[0,0],[1,0]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[1,0],[1,1]],[[0,0],[1,0],[1,1]]];
    let gates=[],blocks=[];const used=new Set();
    for(let i=0;i<k;i++){for(let t=0;t<50;t++){const side=G.ri(0,3),len=G.ri(2,3),pos=G.ri(0,n-len),key=side+':'+pos;if([...Array(len)].some((_,j)=>used.has(side+':'+(pos+j))))continue;for(let j=0;j<len;j++)used.add(side+':'+(pos+j));gates.push({side,pos,len,c:i});break}}
    const occ=()=>{const m=new Map();blocks.forEach((b,i)=>b.sh.forEach(([r,c])=>m.set((b.r+r)*n+b.c+c,i)));return m};
    const want=Math.round(n*n*(.38+.22*G.d));let tries=0;
    while(blocks.reduce((a,b)=>a+b.sh.length,0)<want&&tries<600){tries++;const g=G.pick(gates),sh=G.pick(SH.filter(s=>{const w=Math.max(...s.map(p=>p[1]))+1,h=Math.max(...s.map(p=>p[0]))+1;return (g.side%2?h:w)<=g.len}));
      const r=G.ri(0,n-1),c=G.ri(0,n-1);if(sh.some(([a,b])=>r+a>=n||c+b>=n))continue;const m=occ();if(sh.some(([a,b])=>m.has((r+a)*n+c+b)))continue;blocks.push({sh,r,c,col:g.c,out:0,dir:null})}
    let time=100-45*G.d,drag=null,moves=0;const T0=time;
    const can=(b,dr,dc)=>{const m=occ(),bi=blocks.indexOf(b);return b.sh.every(([a,c2])=>{const R=b.r+a+dr,C=b.c+c2+dc;if(R<0||C<0||R>=n||C>=n)return false;const o=m.get(R*n+C);return o==null||o===bi})};
    /* 가장자리 같은 색 문: side 0 위 · 1 오른쪽 · 2 아래 · 3 왼쪽 */
    const exitDir=b=>{for(const g of gates){if(g.c!==b.col)continue;const cells=b.sh.map(([a,c2])=>[b.r+a,b.c+c2]);
        if(g.side===0&&cells.some(p=>p[0]===0)&&cells.every(p=>p[1]>=g.pos&&p[1]<g.pos+g.len))return [-1,0];
        if(g.side===2&&cells.some(p=>p[0]===n-1)&&cells.every(p=>p[1]>=g.pos&&p[1]<g.pos+g.len))return [1,0];
        if(g.side===3&&cells.some(p=>p[1]===0)&&cells.every(p=>p[0]>=g.pos&&p[0]<g.pos+g.len))return [0,-1];
        if(g.side===1&&cells.some(p=>p[1]===n-1)&&cells.every(p=>p[0]>=g.pos&&p[0]<g.pos+g.len))return [0,1]}return null};
    return {
      boostText:'시간 +15초', boost(){time+=15},
      update(dt){time-=dt;if(time<=0)return G.lose('시간이 다 됐어요!');for(const b of blocks)if(b.dir)b.out+=dt*10;
        const gone=blocks.filter(b=>b.out>n+2);if(gone.length){blocks=blocks.filter(b=>b.out<=n+2);if(!blocks.length)return G.win(time>T0*.5?3:time>T0*.25?2:1)}
        G.setHud(TIME(time),`🚃 남은 ${blocks.filter(b=>!b.dir).length}`,`👆 ${moves}번`)},
      draw(c){G.rr(ox-8,oy-8,n*cs+16,n*cs+16,10,'#3A3A4A');for(const g of gates){const L=g.len*cs,P=g.pos*cs,col=COL[g.c];
          if(g.side===0)G.rr(ox+P,oy-12,L,8,3,col);if(g.side===2)G.rr(ox+P,oy+n*cs+4,L,8,3,col);if(g.side===3)G.rr(ox-12,oy+P,8,L,3,col);if(g.side===1)G.rr(ox+n*cs+4,oy+P,8,L,3,col)}
        for(let r=0;r<n;r++)for(let q=0;q<n;q++)G.rr(ox+q*cs+1,oy+r*cs+1,cs-2,cs-2,5,'#55556A');
        c.save();c.beginPath();c.rect(ox-12,oy-12,n*cs+24,n*cs+24);c.clip();
        for(const b of blocks){const [dr,dc]=b.dir||[0,0],sx=dc*b.out*cs+(drag&&drag.b===b?drag.vx:0),sy=dr*b.out*cs+(drag&&drag.b===b?drag.vy:0);
          b.sh.forEach(([a,c2])=>{G.rr(ox+(b.c+c2)*cs+3+sx,oy+(b.r+a)*cs+3+sy,cs-6,cs-6,8,COL[b.col],'rgba(0,0,0,.4)',2);G.rr(ox+(b.c+c2)*cs+8+sx,oy+(b.r+a)*cs+7+sy,cs-16,6,3,'rgba(255,255,255,.45)')});
          G.emo('🚃',ox+(b.c+b.sh[0][1])*cs+cs/2+sx,oy+(b.r+b.sh[0][0])*cs+cs/2+sy,cs*.5,.85)}
        c.restore();G.text('같은 색 역문으로 밀어서 빼내요',AW/2,oy+n*cs+40,15,'#FFE9A8')},
      down(x,y){const cI=Math.floor((x-ox)/cs),rI=Math.floor((y-oy)/cs);const b=blocks.find(b=>!b.dir&&b.sh.some(([a,c2])=>b.r+a===rI&&b.c+c2===cI));if(b)drag={b,x,y,vx:0,vy:0}},
      move(x,y,dn){if(!drag||!dn)return;const dx=x-drag.x,dy=y-drag.y,b=drag.b;
        if(Math.abs(dx)>cs*.55){const s=Math.sign(dx);if(can(b,0,s)){b.c+=s;moves++;G.sfx('tap')}else{const e=exitDir(b);if(e&&e[1]===s){b.dir=e;G.sfx('whoosh');drag=null;return}}drag.x+=s*cs*.55*2}
        else if(Math.abs(dy)>cs*.55){const s=Math.sign(dy);if(can(b,s,0)){b.r+=s;moves++;G.sfx('tap')}else{const e=exitDir(b);if(e&&e[0]===s){b.dir=e;G.sfx('whoosh');drag=null;return}}drag.y+=s*cs*.55*2}},
      up(){if(drag){const e=exitDir(drag.b);drag=null}}
    }}});

/* ---------- 독도 3: 괭이갈매기.io (스네이크.io · 슬리더리오) ---------- */
arcDefine({id:'dokdo_snakeio',ch:'dokdo',name:'괭이갈매기.io',tag:'.io 꼬리 키우기',from:'스네이크.io · 슬리더리오',icon:'🐦',
  how:['화면을 누른 채 방향을 가리키면 괭이갈매기 무리가 그쪽으로 날아요.','🐟 물고기를 먹으면 무리가 길어져요. 다른 갈매기 몸에 머리를 박으면 하트가 줄어요!','문제가 나오면 정답(가·나·다) 구슬을 먹어요! 정답이면 쑥 길어지고, 틀리면 짧아져요.'],
  init(G){
    const WW=1300,WH=1300, goal=30+Math.round(G.d*60), nAI=2+Math.round(G.d*5);
    const mk=(x,y,len,ai)=>({x,y,a:Math.random()*6.28,ta:0,trail:[],len,ai,dead:0,col:ai?`hsl(${G.ri(0,360)},60%,70%)`:'#FFFFFF'});
    let me=mk(WW/2,WH/2,8,false),ais=[...Array(nAI)].map(()=>mk(G.rand(200,WW-200),G.rand(200,WH-200),G.ri(8,18),true)),food=[],quiz=null,qT=8,hearts=3,inv=1.5,aim=null,time=Math.round(130-20*G.d);
    const addFood=(x,y,v=1)=>food.push({x:x??G.rand(30,WW-30),y:y??G.rand(30,WH-30),v});for(let i=0;i<90;i++)addFood();
    const seg=s=>{const out=[];const sp=10;let d=0,last={x:s.x,y:s.y};out.push(last);for(const p of s.trail){d+=Math.hypot(p.x-last.x,p.y-last.y);last=p;if(d>=sp*out.length)out.push(p);if(out.length>=s.len)break}return out};
    const step=(s,dt,sp)=>{let da=((s.ta-s.a+Math.PI*3)%(Math.PI*2))-Math.PI;s.a+=G.clamp(da,-3.2*dt,3.2*dt);s.x+=Math.cos(s.a)*sp*dt;s.y+=Math.sin(s.a)*sp*dt;
      if(s.x<20||s.x>WW-20||s.y<20||s.y>WH-20){s.ta=Math.atan2(WH/2-s.y,WW/2-s.x);s.x=G.clamp(s.x,20,WW-20);s.y=G.clamp(s.y,20,WH-20)}s.trail.unshift({x:s.x,y:s.y});if(s.trail.length>s.len*12)s.trail.length=s.len*12};
    const newQuiz=()=>{const q=drawQ(G.trial?7:CI);if(!q)return;const ord=G.shuffle(q.o.map((_,i)=>i)).slice(0,3);if(!ord.includes(q.a))ord[0]=q.a;const o=G.shuffle(ord);
      quiz={q,order:o,orbs:o.map((oi,j)=>({x:G.clamp(me.x+Math.cos(j*2.1+me.a)*170,40,WW-40),y:G.clamp(me.y+Math.sin(j*2.1+me.a)*170,40,WH-40),j,oi})),t:22-6*G.d};inv=Math.max(inv,3);G.pop('📖 3초 동안 안 부딪혀요! 문제를 읽어요',AW/2,250,'#FFE27A',16)};
    const hurt=()=>{if(inv)return;hearts--;inv=2;G.sfx('hurt');G.shake=7;const s=seg(me);s.forEach((p,i)=>{if(i%2)addFood(p.x,p.y,1)});me.len=Math.max(6,Math.floor(me.len*.6));if(hearts<=0)G.lose('다른 갈매기에 너무 많이 부딪혔어요!')};
    return {
      boostText:'무리 +5', boost(){me.len+=5},
      update(dt){time-=dt;if(time<=0)return G.lose(`시간이 다 됐어요! (${me.len}/${goal})`);inv=Math.max(0,inv-dt);
        if(aim)me.ta=Math.atan2(aim.y-AH/2,aim.x-AW/2);step(me,dt,125+20*G.d);
        for(const a of ais){if(a.dead){a.dead-=dt;if(a.dead<=0){Object.assign(a,mk(G.rand(100,WW-100),G.rand(100,WH-100),G.ri(8,14),true));a.dead=0}continue}
          const f=food.reduce((b,x)=>{const d=Math.hypot(x.x-a.x,x.y-a.y);return d<b.d?{d,x}:b},{d:1e9,x:null});if(!quiz&&Math.random()<.02+.05*G.d&&Math.hypot(me.x-a.x,me.y-a.y)<300)a.ta=Math.atan2(me.y+Math.sin(me.a)*60-a.y,me.x+Math.cos(me.a)*60-a.x);else if(f.x&&Math.random()<.05)a.ta=Math.atan2(f.x.y-a.y,f.x.x-a.x);step(a,dt,(110+60*G.d)*(quiz?.6:1))}
        const all=[me,...ais.filter(a=>!a.dead)];
        for(const s of all){for(let i=food.length-1;i>=0;i--){const f=food[i];if(Math.hypot(f.x-s.x,f.y-s.y)<16){s.len+=f.v;food.splice(i,1);if(s===me){G.sfx('coin');G.addScore(f.v*2)}}}}
        while(food.length<90)addFood();
        for(const a of ais){if(a.dead)continue;const sa=seg(a);if(!inv&&sa.slice(3).some(p=>Math.hypot(p.x-me.x,p.y-me.y)<12))hurt();
          const sm=seg(me);if(sm.slice(3).some(p=>Math.hypot(p.x-a.x,p.y-a.y)<12)){sa.forEach(p=>addFood(p.x+G.rand(-6,6),p.y+G.rand(-6,6),1));a.dead=3;G.sfx('pop');G.pop('갈매기 퇴장!',AW/2,200,'#FFE27A')}}
        if(!quiz){qT-=dt;if(qT<=0)newQuiz()}else{quiz.t-=dt;
          for(const o of quiz.orbs){if(Math.hypot(o.x-me.x,o.y-me.y)<26){const ok=o.oi===quiz.q.a;if(ok){me.len+=6;G.sfx('ok');G.pop('정답! +6',AW/2,200,'#7FFFA0',22);G.addScore(30)}
            else{me.len=Math.max(5,me.len-4);G.sfx('no');if(!G.trial)wrongAdd(CI,quiz.q);G.pop(`정답은 ${'가나다'[quiz.order.indexOf(quiz.q.a)]}!`,AW/2,200,'#FF8A8A',20)}quiz=null;qT=9;break}}
          if(quiz&&quiz.t<=0){quiz=null;qT=6}}
        if(me.len>=goal)return G.win(starsByHearts(hearts));
        G.setHud(HEARTS(hearts),`🐦 ${me.len}/${goal}`,TIME(time))},
      draw(c){const cx=me.x-AW/2,cy=me.y-AH/2;c.fillStyle=G.grad(0,AH,'#2E8BC0','#0B3A60');c.fillRect(0,0,AW,AH);c.save();c.translate(-cx,-cy);
        c.strokeStyle='rgba(255,255,255,.08)';c.lineWidth=2;for(let x=0;x<=WW;x+=100){c.beginPath();c.moveTo(x,0);c.lineTo(x,WH);c.stroke()}for(let y=0;y<=WH;y+=100){c.beginPath();c.moveTo(0,y);c.lineTo(WW,y);c.stroke()}
        G.rr(0,0,WW,WH,0,null,'#FFE27A',6);G.emo('🏝️',WW/2,WH/2-160,90,.6);
        for(const f of food)if(Math.abs(f.x-me.x)<AW&&Math.abs(f.y-me.y)<AH)G.emo('🐟',f.x,f.y,f.v>1?24:16);
        if(quiz)for(const o of quiz.orbs){G.circle(o.x,o.y,22,'#FFE27A','#8A5410',3);G.text('가나다'[o.j],o.x,o.y+1,20,'#4A240E','center',null)}
        for(const s of [...ais.filter(a=>!a.dead),me]){const sg=seg(s);for(let i=sg.length-1;i>0;i--)G.circle(sg[i].x,sg[i].y,9,s.col,'rgba(0,0,0,.3)',1.5);
          if(s===me&&inv&&Math.floor(G.t*12)%2)continue;if(arcSprite('gull_top'))G.emo('gull_top',s.x,s.y,36,1,s.a+Math.PI/2);else if(Math.cos(s.a)>0)emoFlip(G,'🐦',s.x,s.y,30);else G.emo('🐦',s.x,s.y,30)}
        c.restore();if(quiz)drawQPanel(G,quiz.q,6,100,quiz.order)},
      down(x,y){aim={x,y}},move(x,y,dn){if(dn)aim={x,y}},
      key(k){const m={L:Math.PI,R:0,U:-Math.PI/2,D:Math.PI/2}[k];if(m!=null){me.ta=m;aim=null}}
    }}});
