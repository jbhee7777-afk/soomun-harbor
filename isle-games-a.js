/* ===== 섬 놀이 (다시 만든 것): 안전 건널목 · 권리 타일 · 세계 요리 썰기 · 독도 낚시 · 독도 그림 퍼즐 =====
   arcade-games*.js 의 같은 id 정의를 바꿔 끼워요 (arcDefine 은 같은 id 면 교체). */

/* ---------- 안전 1: 안전 건널목 — 신호등과 횡단보도 (크로시 로드) ---------- */
arcDefine({id:'safety_cross',ch:'safety',name:'안전 건널목',tag:'신호 지키기 아케이드',from:'크로시 로드 (Crossy Road)',icon:'🚦',
  how:['톡 누른 쪽(위·아래·왼쪽·오른쪽)으로 한 칸씩 움직여요. 밀어도, 방향키도 돼요.','하얀 줄무늬 횡단보도에서 🚶초록불일 때 건너면 차가 멈춰 줘요! (+10점)','횡단보도가 아닌 곳으로 건너면 무단횡단 — 별 3개를 받을 수 없어요.'],
  init(G){
    const C=9,R=13,S=40,OY=10,CW=4, cars=['🚗','🚕','🚙','🚓','🚑','🛵','🚚'];
    const nRoad=4+Math.round(G.d*5), rows=G.shuffle([...Array(11)].map((_,i)=>i+1)).slice(0,nRoad);
    const lanes={}; rows.forEach(r=>{const dir=Math.random()<.5?-1:1,sp=(50+120*G.d)*G.rand(.85,1.25),n=2+Math.round(G.d*1.6+Math.random()),bus=Math.random()<.25;
      lanes[r]={dir,sp,cars:[...Array(n)].map((_,i)=>({x:i*(C*S/n)+G.rand(0,30),e:bus?'🚌':G.pick(cars),w:bus?70:36}))}});
    const P={c:CW,r:12,x:CW,y:12,inv:0}; let hearts=3,time=75,jay=0,safe=0,light=0,phase='car',pt=3;
    const goT=3.6-1.2*G.d, stopT=2.8;
    const cwL=CW*S, cwR=CW*S+S;
    const move=(dc,dr)=>{if(G.over)return;const c=P.c+dc,r=P.r+dr;if(c<0||c>=C||r<0||r>12)return;
      if(lanes[r]&&!lanes[P.r]&&dr!==0){if(c!==CW){jay++;G.pop('무단횡단!',c*S+S/2,OY+r*S,'#FF8A8A',16);G.sfx('no')}else if(phase==='walk'){safe++;G.addScore(10,c*S+S/2,OY+r*S)}}
      P.c=c;P.r=r;G.sfx('jump');
      if(r===0){G.burst(P.c*S+S/2,OY+S/2,'#7FD69A',30);G.win(hearts===3&&jay===0?3:hearts>=2?2:1)}};
    const hit=()=>{hearts--;G.sfx('hurt');G.shake=6;G.burst(P.x*S+S/2,OY+P.y*S+S/2,'#FF6F8A',16);P.c=CW;P.r=12;P.inv=1;if(hearts<=0)G.lose('차에 너무 많이 부딪혔어요. 횡단보도에서 초록불을 기다려요!')};
    return {
      boostText:'하트 +1', boost(){hearts=Math.min(3,hearts+1)},
      update(dt){time-=dt;if(time<=0)return G.lose('시간이 다 됐어요!');
        pt-=dt;if(pt<=0){phase=phase==='car'?'walk':'car';pt=phase==='car'?goT:stopT;G.sfx(phase==='walk'?'tick':'tap')}
        P.x=G.lerp(P.x,P.c,Math.min(1,dt*18));P.y=G.lerp(P.y,P.r,Math.min(1,dt*18));P.inv=Math.max(0,P.inv-dt);
        for(const r in lanes){const L=lanes[r];const list=[...L.cars].sort((a,b)=>L.dir>0?b.x-a.x:a.x-b.x);
          list.forEach((k,i)=>{let mv=L.dir*L.sp*dt;const front=L.dir>0?k.x+k.w:k.x;
            if(phase==='walk'){if(L.dir>0&&front<=cwL-2&&front+mv>cwL-4)mv=Math.max(0,cwL-4-front);if(L.dir<0&&front>=cwR+2&&front+mv<cwR+4)mv=Math.min(0,cwR+4-front)}
            const ahead=list[i-1];if(ahead){const gap=L.dir>0?ahead.x-(k.x+k.w):k.x-(ahead.x+ahead.w);if(gap>=0&&gap<10+Math.abs(mv))mv=0}
            k.x+=mv;if(k.x>C*S+40)k.x-=C*S+80+k.w;if(k.x<-80-k.w)k.x+=C*S+80+k.w;
            if(+r===P.r&&!P.inv){const px=P.x*S+S/2;if(px>k.x-6&&px<k.x+k.w+6&&Math.abs(P.y-P.r)<.3)hit()}})}
        G.setHud(HEARTS(hearts),TIME(time),jay?`🚫 무단 ${jay}`:`🦺 안전 ${safe}`)},
      draw(c){
        for(let r=0;r<R;r++){const y=OY+r*S;const road=!!lanes[r];G.rr(0,y,AW,S,0,r===0?'#5FB36F':road?'#3B3B48':'#A8998A');
          if(road){for(let i=0;i<5;i++)G.rr(cwL+3,y+3+i*7.4,S-6,4,1,'rgba(255,255,255,.85)');
            c.strokeStyle='#FFD24A';c.lineWidth=2;c.setLineDash([10,10]);c.beginPath();c.moveTo(0,y+S-1);c.lineTo(cwL-4,y+S-1);c.moveTo(cwR+4,y+S-1);c.lineTo(AW,y+S-1);c.stroke();c.setLineDash([])}
          else if(r>0&&r<12)G.rr(0,y,AW,3,0,'#8A7A6A')}
        for(const r in lanes)G.circle(cwR+12,OY+r*S+S/2,6,phase==='walk'?'#3FE07A':'#FF4A4A','#111',2);
        G.emo('🏫',AW/2,OY+S/2,30);
        for(const r in lanes){const L=lanes[r];for(const k of L.cars){if(L.dir>0)emoFlip(G,k.e,k.x+k.w/2,OY+r*S+S/2,k.w>40?40:32);else G.emo(k.e,k.x+k.w/2,OY+r*S+S/2,k.w>40?40:32)}}
        G.rr(AW-118,OY+4,112,30,10,'rgba(0,0,0,.6)');G.text(phase==='walk'?'🚶 초록불':'✋ 빨간불',AW-62,OY+20,16,phase==='walk'?'#7FFFA0':'#FF8A8A','center',null);
        if(!(P.inv&&Math.floor(G.t*10)%2))G.emo('🧒',P.x*S+S/2,OY+P.y*S+S/2-Math.abs(Math.sin((P.y-P.r)*Math.PI))*8,32)},
      tap(x,y){const px=P.c*S+S/2,py=OY+P.r*S+S/2,dx=x-px,dy=y-py;if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1,0);else move(0,dy>0?1:-1)},
      swipe(d){move(d==='L'?-1:d==='R'?1:0,d==='U'?-1:d==='D'?1:0)},
      key(k){if(k!=='A')this.swipe(k)}
    }}});

/* ---------- 인권 1: 권리 타일 매치 — 층층이 쌓인 타일 + 뒤집힌 더미 + 도구 3가지 (젠 매치 · 타일 익스플로러) ---------- */
const RIGHTS=[['📚','교육받을 권리','모든 어린이는 학교에서 배울 권리가 있어요.'],['🏥','건강할 권리','아플 때 치료받고 건강하게 자랄 권리가 있어요.'],['🍚','먹을 권리','굶지 않고 영양 있는 음식을 먹을 권리가 있어요.'],
  ['🏠','집에서 살 권리','안전한 집에서 살 권리가 있어요.'],['🗣️','말할 권리','나와 관련된 일에 내 생각을 말할 권리가 있어요 (참여권).'],['⚖️','차별받지 않을 권리','성별·장애·피부색 때문에 차별받지 않아요.'],
  ['🎨','문화를 누릴 권리','그림·음악·책 같은 문화를 즐길 권리가 있어요.'],['⚽','놀 권리','충분히 쉬고 놀 권리가 있어요.'],['🛡️','보호받을 권리','폭력과 위험에서 보호받을 권리가 있어요.'],['🕊️','평화롭게 살 권리','전쟁 없이 평화롭게 살 권리가 있어요.']];
arcDefine({id:'rights_triple',ch:'rights',name:'권리 타일 매치',tag:'층층 타일 3개 모으기',from:'젠 매치 · 타일 익스플로러 · 양갈갈',icon:'⚖️',
  how:['맨 위에 있어 밝게 보이는 타일을 눌러 아래 칸으로 보내요. 같은 권리 3개가 모이면 사라지며 권리 카드를 얻어요!','양옆 뒤집힌 더미는 맨 위 한 장씩만 꺼낼 수 있어요.','도구: ↶ 되돌리기 · 🔀 섞기 · 📤 3칸 빼 두기 (한 번씩). 도구를 안 쓰고 빨리 깨면 별 3개!'],
  init(G){
    const types=5+Math.round(G.d*5), sets=1+(G.d>.3?1:0)+(G.d>.7?1:0), layers=3+Math.round(G.d*3), TS=44, stackN=G.d>.25?Math.min(9,3+Math.round(G.d*6)):0;
    const ICON=RIGHTS.slice(0,types);
    let total=types*3*sets, boardN=total-stackN*2; if(boardN<9){boardN=total;}
    const sN=Math.max(0,Math.floor((total-boardN)/2));
    let tiles=[];
    for(let L=0;L<layers&&tiles.length<boardN;L++){const off=(L%2)*TS/2, cols=7-(L%2), rows=Math.max(3,7-L)-(L%2), x0=(AW-cols*TS)/2+off*0, y0=40+L*6+off;
      const cells=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const cx=x0+c*TS+TS/2+(L%2?TS/2:0),cy=y0+r*TS+TS/2;if(cx<TS/2+4||cx>AW-TS/2-4)continue;cells.push([cx,cy])}
      const want=L===layers-1?boardN-tiles.length:Math.min(boardN-tiles.length,Math.round(boardN/layers*(1.25-L*.12)));
      G.shuffle(cells).slice(0,want).forEach(([x,y])=>tiles.push({x,y,L}))}
    while(tiles.length<boardN){const L=G.ri(0,layers-1);tiles.push({x:G.rand(40,AW-40),y:G.rand(50,300),L:L+layers})}
    const stacks=[[],[]];for(let i=0;i<sN*2;i++)stacks[i%2].push({stack:i%2});
    const cover=(t,list)=>list.some(o=>o!==t&&!o.stack&&o.stack!==0&&o.L>t.L&&Math.abs(o.x-t.x)<TS-4&&Math.abs(o.y-t.y)<TS-4);
    /* 걷어 내는 순서를 미리 정해 3개씩 같은 그림 → 늘 풀 수 있어요 */
    let rest=[...tiles],st=[stacks[0].slice(),stacks[1].slice()],order=[];
    while(rest.length||st[0].length||st[1].length){const av=rest.filter(t=>!cover(t,rest));st.forEach(s=>{if(s.length)av.push(s[s.length-1])});const p=G.pick(av);order.push(p);
      if(p.stack!=null)st[p.stack].pop();else rest=rest.filter(t=>t!==p)}
    const groups=G.shuffle([...Array(order.length/3|0)].map((_,i)=>ICON[i%types]));order.forEach((t,i)=>{t.r=groups[Math.floor(i/3)]||ICON[0]});
    let board=[...tiles],tray=[],hold=[],last=[],tools={undo:1,mix:1,out:1},used=0,time=150-70*G.d,T0=150-70*G.d,combo=0,comboT=0,cards=new Set();
    const free=t=>t.stack!=null?stacks[t.stack][stacks[t.stack].length-1]===t:!cover(t,board);
    const toTray=t=>{if(t.stack!=null)stacks[t.stack].pop();else board=board.filter(x=>x!==t);const at=tray.map(x=>x.r).lastIndexOf(t.r);tray.splice(at>=0?at+1:tray.length,0,t);last.push(t);G.sfx('tap');
      const same=tray.filter(x=>x.r===t.r);if(same.length>=3){tray=tray.filter(x=>x.r!==t.r);last=last.filter(x=>x.r!==t.r);combo=comboT>0?combo+1:1;comboT=4;
        G.sfx('clear');try{sfx.combo(combo)}catch(e){}G.burst(AW/2,452,'#FFE27A',18);G.addScore(30*combo);cards.add(t.r[1]);G.pop(`${t.r[0]} ${t.r[1]}`,AW/2,400,'#FFE27A',18);G.pop(t.r[2],AW/2,372,'#FFF3D6',12)}
      if(!board.length&&!tray.length&&!hold.length&&!stacks[0].length&&!stacks[1].length)return G.win(used===0&&time>T0*.35?3:used<=1?2:1);
      if(tray.length>=7)G.lose('아래 칸 7개가 꽉 찼어요! 같은 그림이 3개 될 것부터 골라요.')};
    const BY=496;
    G.btn(12,BY,104,40,'↶ 되돌리기',()=>{if(!tools.undo||!last.length)return;tools.undo=0;used++;const t=last.pop();tray.splice(tray.indexOf(t),1);if(t.stack!=null)stacks[t.stack].push(t);else board.push(t);G.sfx('whoosh')},{fs:14});
    G.btn(128,BY,104,40,'🔀 섞기',()=>{if(!tools.mix)return;tools.mix=0;used++;const rs=G.shuffle(board.map(t=>t.r));board.forEach((t,i)=>t.r=rs[i]);G.sfx('whoosh')},{fs:14});
    G.btn(244,BY,104,40,'📤 빼 두기',()=>{if(!tools.out||!tray.length)return;tools.out=0;used++;hold=tray.splice(0,3);G.sfx('whoosh')},{fs:14});
    const draw1=(t,x,y,dim,s=TS)=>{G.rr(x-s/2+2,y-s/2+4,s,s,10,'rgba(0,0,0,.4)');G.rr(x-s/2,y-s/2,s,s,10,dim?'#8C8296':'#FFF8E6','#6B3D1F',2);G.rr(x-s/2+3,y-s/2+3,s-6,6,3,dim?'#9C92A6':'#FFFFFF');G.emo(t.r[0],x,y+2,s*.62,dim?.45:1)};
    return {
      boostText:'시간 +20초', boost(){time+=20},
      update(dt){time-=dt;comboT=Math.max(0,comboT-dt);if(time<=0)return G.lose('시간이 다 됐어요!');
        G.setHud(TIME(time),`🃏 권리 카드 ${cards.size}/${types}`,combo>1&&comboT?`🔥 ${combo}콤보`:`남은 ${board.length+stacks[0].length+stacks[1].length+tray.length+hold.length}`)},
      draw(c){[...board].sort((a,b)=>a.L-b.L).forEach(t=>draw1(t,t.x,t.y,!free(t)));
        stacks.forEach((s,i)=>{const x=i?AW-34:34,y=372;s.forEach((t,j)=>{if(j<s.length-1)G.rr(x-TS/2+2,y-TS/2-j*3,TS,TS,10,'#5A4A7A','#2A1A3A',2)});if(s.length){draw1(s[s.length-1],x,y-(s.length-1)*3,false);G.text('×'+s.length,x,y+30,13)}});
        hold.forEach((t,i)=>draw1(t,AW/2-50+i*50,388,false,40));
        G.rr(8,418,344,70,14,'#4E2C14','#D9A441',3);for(let i=0;i<7;i++){G.rr(16+i*48,428,44,50,9,i>=5&&tray.length>=5?'#5A1A1A':'#2A1A0E');if(tray[i])draw1(tray[i],38+i*48,453,false,40)}
        G.btns.forEach((b,i)=>{b.on=false;b.col=Object.values(tools)[i]?'#8A552B':'#4A3A4C'})},
      tap(x,y){if(y>BY-4)return;
        const h=hold.find(t=>Math.abs(x-(AW/2-50+hold.indexOf(t)*50))<22&&Math.abs(y-388)<22);if(h){hold=hold.filter(t=>t!==h);toTray(h);return}
        for(const i of [0,1]){const s=stacks[i];if(s.length&&Math.abs(x-(i?AW-34:34))<24&&Math.abs(y-(372-(s.length-1)*3))<26){toTray(s[s.length-1]);return}}
        const cand=board.filter(t=>Math.abs(x-t.x)<TS/2&&Math.abs(y-t.y)<TS/2&&free(t)).sort((a,b)=>b.L-a.L)[0];if(cand)toTray(cand)}
    }}});

/* ---------- 다문화 1: 세계 요리 주문 썰기 (과일 닌자) — 주문서의 나라 요리만, 빠르고 곧게 그어야 잘려요 ---------- */
const WFOOD=[['🍣','스시','일본'],['🍙','주먹밥','일본'],['🍕','피자','이탈리아'],['🍝','스파게티','이탈리아'],['🌮','타코','멕시코'],['🌯','부리토','멕시코'],['🥐','크루아상','프랑스'],['🥖','바게트','프랑스'],
  ['🥟','만두','중국'],['🥮','월병','중국'],['🍛','카레','인도'],['🍔','햄버거','미국'],['🌭','핫도그','미국'],['🍜','쌀국수','베트남'],['🥙','케밥','튀르키예'],['🥨','프레첼','독일'],['🥘','파에야','스페인'],['🍚','비빔밥','한국'],['🍢','떡꼬치','한국']];
arcDefine({id:'multi_slice',ch:'multi',name:'세계 요리 주문 썰기',tag:'주문서 썰기',from:'과일 닌자 (Fruit Ninja)',icon:'🍣',
  how:['위의 주문서에 적힌 나라의 요리만 썰어요! 다른 나라 요리를 썰면 하트가 줄어요.','손가락을 빠르고 곧게 요리 한가운데로 그어야 잘려요. 막 휘두르면 칼이 지쳐서 안 잘려요!','폭탄💣은 피하고, 주문서 요리를 떨어뜨리지 마요.'],
  init(G){
    const goal=12+Math.round(G.d*22), countries=[...new Set(WFOOD.map(f=>f[2]))];
    let target=G.pick(countries),need=3,objs=[],halves=[],trail=[],t=.6,got=0,hearts=3,stam=100,tired=0;
    const spawn=()=>{const n=G.d>.35&&Math.random()<.3+.4*G.d?2+(G.d>.75&&Math.random()<.4?1:0):1;for(let i=0;i<n;i++){const bomb=Math.random()<.08+.2*G.d,x=G.rand(60,AW-60);
      const mine=WFOOD.filter(f=>f[2]===target),oth=WFOOD.filter(f=>f[2]!==target),f=Math.random()<.5?G.pick(mine):G.pick(oth);
      objs.push({x,y:AH+30,vx:(AW/2-x)*G.rand(.25,.6),vy:-G.rand(600,740),r:G.rand(-3,3),bomb,f:bomb?null:f,R:26})}};
    const nextOrder=()=>{let c;do{c=G.pick(countries)}while(c===target);target=c;need=2+Math.round(G.d*2);G.pop(`새 주문: ${target} 요리!`,AW/2,140,'#FFE27A',20);G.sfx('unlock')};
    /* 곧고 빠른 한 획이 요리의 가운데(반지름 55% 안)를 지나야 잘려요 */
    const chord=(o,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<4)return false;let k=((o.x-a.x)*dx+(o.y-a.y)*dy)/(L*L);if(k<0||k>1)return false;
      const d=Math.hypot(a.x+dx*k-o.x,a.y+dy*k-o.y);return d<o.R*.55};
    return {
      boostText:'하트 +1', boost(){hearts=Math.min(3,hearts+1)},
      update(dt){t-=dt;if(t<=0){spawn();t=G.rand(.75,1.15)*(1-.55*G.d)}
        stam=Math.min(100,stam+dt*28);tired=Math.max(0,tired-dt);
        for(const o of objs){o.vy+=620*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;if(o.y>AH+50&&o.vy>0&&!o.gone){o.gone=1;if(!o.bomb&&o.f[2]===target){hearts--;G.sfx('no');G.pop(`${o.f[1]}를 놓쳤어요`,AW/2,AH-90,'#FF8A8A',15);if(hearts<=0)return G.lose('주문 요리를 너무 많이 놓쳤어요!')}}}
        objs=objs.filter(o=>!o.gone&&!o.cut);for(const h of halves){h.vy+=700*dt;h.x+=h.vx*dt;h.y+=h.vy*dt;h.a+=h.va*dt}halves=halves.filter(h=>h.y<AH+60);
        trail=trail.filter(p=>G.t-p.t<.12);G.setHud(HEARTS(hearts),`🔪 ${got}/${goal}`,`🗒 ${target}`)},
      draw(c){G.rr(0,AH-60,AW,60,0,'#6B4A3A');
        G.rr(AW/2-120,8,240,42,14,'#FFF8E6','#6B3D1F',3);G.text(`주문서: ${target} 요리 ${need}개`,AW/2,29,18,'#4A240E','center',null);
        for(const o of objs){G.emo(o.bomb?'💣':o.f[0],o.x,o.y,50,1,o.r*G.t*.3);if(!o.bomb)G.text(o.f[2],o.x,o.y+34,11,o.f[2]===target?'#FFE27A':'#CCC')}
        for(const h of halves){c.save();c.beginPath();c.rect(h.x+(h.s<0?-40:0),h.y-40,40,80);c.clip();G.emo(h.e,h.x,h.y,50,1,h.a);c.restore()}
        if(trail.length>1){c.strokeStyle=tired?'rgba(150,150,150,.6)':'rgba(255,255,255,.9)';c.lineWidth=6;c.lineCap='round';c.beginPath();trail.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke()}
        G.rr(12,AH-48,120,12,6,'#3A2A3A');G.rr(12,AH-48,120*stam/100,12,6,tired?'#888':'#7FD6FF');G.text(tired?'칼이 지쳤어요!':'칼 힘',72,AH-24,12)},
      down(x,y){trail=[{x,y,t:G.t}]},
      move(x,y,dn){if(!dn)return;const p={x,y,t:G.t},a=trail[trail.length-1]||p;trail.push(p);const seg=Math.hypot(p.x-a.x,p.y-a.y),dtm=Math.max(.001,p.t-a.t),sp=seg/dtm;
        stam-=seg*.09;if(stam<=0&&!tired){tired=1.2;stam=0;G.sfx('no')}
        if(tired||sp<650+260*G.d)return;
        for(const o of objs){if(o.cut||!chord(o,a,p))continue;o.cut=1;
          if(o.bomb){hearts--;G.sfx('hurt');G.shake=8;G.burst(o.x,o.y,'#FF6A5A',20);if(hearts<=0)return G.lose('폭탄을 너무 많이 건드렸어요!');continue}
          halves.push({x:o.x,y:o.y,vx:-60,vy:-100,a:0,va:-3,e:o.f[0],s:-1},{x:o.x,y:o.y,vx:60,vy:-100,a:0,va:3,e:o.f[0],s:1});
          if(o.f[2]!==target){hearts--;G.sfx('no');G.shake=5;G.pop(`그건 ${o.f[2]}의 ${o.f[1]}!`,o.x,o.y-30,'#FF8A8A',16);if(hearts<=0)return G.lose('주문에 없는 요리를 너무 많이 썰었어요!');continue}
          got++;need--;G.sfx('whoosh');G.burst(o.x,o.y,'#FFE27A',10);G.pop(`${o.f[1]} (${o.f[2]})`,o.x,o.y-30,'#FFE27A',15);G.addScore(10);
          if(got>=goal)return G.win(starsByHearts(hearts));if(need<=0)nextOrder()}},
      up(){trail=[]}
    }}});

/* ---------- 독도 1: 독도 바다 낚시 — 찌 · 입질 · 당김 게이지 (로블록스 Fisch · 스타듀 밸리 낚시) ---------- */
const DFISH=[['🦑','오징어','독도 바다는 따뜻한 물과 차가운 물이 만나 오징어가 많이 잡혀요.',1],['🐙','문어','독도 바위틈에는 문어가 숨어 살아요.',1.4],['🦐','독도새우','독도 근처 깊고 차가운 바다에는 독도새우가 살아요.',1.2],
  ['🐟','볼락','독도 바다 숲(해조류 숲)에는 볼락 같은 물고기가 모여 살아요.',.8],['🦀','홍게','동해 깊은 바다에는 붉은 홍게가 살아요.',1.1],['🐡','쥐치','독도 바다에는 쥐치·복어 같은 물고기도 살아요.',1.6]];
arcDefine({id:'dokdo_fish',ch:'dokdo',name:'독도 바다 낚시',tag:'찌 · 당김 게이지 낚시',from:'로블록스 Fisch · 낚시 게임',icon:'🎣',
  how:['화면을 누르면 낚싯줄을 던져요. 찌가 흔들리다 ❗가 뜨면 바로 눌러요! (너무 일찍 누르면 도망가요)','물고기가 걸리면 오른쪽 게이지에서 초록 칸을 누르고 있으면 올라가고, 떼면 내려가요. 물고기를 초록 칸 안에 두면 끌어올려져요.','주문서의 독도 바다 생물을 모두 낚으면 성공! 쓰레기를 건지면 바다 청소 보너스!'],
  init(G){
    const want=G.shuffle(DFISH.slice(0,5)).slice(0,2+(G.d>.45?1:0)).map((f,i)=>({f,need:1+(i===0?1:0)+Math.round(G.d*2.2),got:0}));
    let st='idle',t=0,bob={x:200,y:300},bite=null,zone=0.5,zv=0,fish=.5,fv=0,prog=.3,time=Math.round(100-25*G.d),clean=0,hook=false,flash=0;
    const zoneH=.3-.17*G.d;
    const done=()=>want.every(w=>w.got>=w.need);
    const pickBite=()=>{if(Math.random()<.12)return ['🥫','바다 쓰레기','바다 쓰레기를 건져 독도 바다가 깨끗해졌어요!',.7,true];const ws=want.filter(w=>w.got<w.need);return Math.random()<.65&&ws.length?G.pick(ws).f:G.pick(DFISH)};
    return {
      boostText:'시간 +15초', boost(){time+=15},
      update(dt){time-=dt;flash=Math.max(0,flash-dt);if(time<=0)return G.lose('시간이 다 됐어요!');
        if(st==='wait'){t-=dt;bob.y=300+Math.sin(G.t*3)*3;if(t<=0){st='bite';t=.9-.55*G.d;bite=pickBite();G.sfx('pop')}}
        else if(st==='bite'){t-=dt;bob.y=300+Math.sin(G.t*30)*6;if(t<=0){st='idle';G.pop('놓쳤어요… 다시 던져요',AW/2,250,'#CBB8FF',16)}}
        else if(st==='reel'){const k=bite[3]*(1+2*G.d);fv+=G.rand(-1,1)*dt*9*k;fv*=.96;fish+=fv*dt;if(fish<.05||fish>.95){fv*=-1;fish=G.clamp(fish,.05,.95)}
          zv+=(hook?2.4:-2.0)*dt;zv*=.92;zone=G.clamp(zone+zv*dt*1.4,zoneH/2,1-zoneH/2);if(zone===zoneH/2||zone===1-zoneH/2)zv=0;
          const inZ=Math.abs(fish-zone)<zoneH/2;prog+=(inZ?.32:-.22)*dt;if(inZ&&Math.random()<.1)G.sfx('tick');
          if(prog>=1){st='idle';const w=want.find(w=>w.f===bite&&w.got<w.need);
            if(bite[4]){clean++;G.addScore(20);G.pop('바다 청소 +20',AW/2,200,'#7FD69A')}else if(w){w.got++;G.sfx('coin')}else G.sfx('tap');
            G.burst(160,300,'#FFE27A',16);flash=2.6;this.last=bite;if(done())return G.win(time>55?3:time>25?2:1)}
          if(prog<=0){st='idle';G.sfx('no');G.pop(`${bite[1]}가 도망갔어요!`,AW/2,250,'#FF8A8A',16)}}
        G.setHud(TIME(time),want.map(w=>`${w.f[0]}${w.got}/${w.need}`).join(' '),clean?`🧹 ${clean}`:`${G.lv}단계`)},
      draw(c){c.fillStyle=G.grad(0,150,'#FFB88A','#9FD8FF');c.fillRect(0,0,AW,150);c.fillStyle=G.grad(150,AH,'#2E8BC0','#082440');c.fillRect(0,150,AW,AH-150);
        c.fillStyle='#5A6A7A';c.beginPath();c.moveTo(210,150);c.lineTo(245,80);c.lineTo(270,150);c.moveTo(262,150);c.lineTo(300,62);c.lineTo(340,150);c.fill();G.text('독도',290,40,14,'#4A240E','center',null);
        G.emo('⛵',70,130,56);
        if(st!=='idle'){c.strokeStyle='#EEE';c.lineWidth=1.5;c.beginPath();c.moveTo(92,108);c.quadraticCurveTo(140,150,bob.x,bob.y-6);c.stroke();G.circle(bob.x,bob.y,7,'#FF4A4A','#FFF',2)}
        if(st==='bite')G.text('❗',bob.x,bob.y-34,34,'#FFE27A');
        if(st==='idle')G.text(flash?'':'톡! 낚싯줄 던지기',AW/2,250,20);
        if(flash&&this.last){G.rr(30,190,300,110,16,'#FFF8E6','#6B3D1F',3);G.emo(this.last[0],70,245,46);G.text(this.last[1]+' 낚았다!',200,215,18,'#4A240E','center',null);
          const w=this.last[2];G.text(w.slice(0,18),200,248,12,'#6B4A2E','center',null);G.text(w.slice(18,36),200,266,12,'#6B4A2E','center',null);G.text(w.slice(36),200,284,12,'#6B4A2E','center',null)}
        if(st==='reel'){const X=300,Y=170,H=320;G.rr(X,Y,36,H,12,'#1A2A3A','#8AC',3);G.rr(X+3,Y+H*(1-zone-zoneH/2),30,H*zoneH,8,'rgba(111,224,166,.75)');
          G.emo(bite[0],X+18,Y+H*(1-fish),26);G.rr(X-16,Y,8,H,4,'#2A1A2A');G.rr(X-16,Y+H*(1-prog),8,H*prog,4,'#FFD24A');
          G.text('누르고 있으면 ⬆',AW/2-40,AH-40,16,'#FFF3D6')}
        want.forEach((w,i)=>G.text(`${w.f[0]} ${w.f[1]} ${w.got}/${w.need}`,12,170+i*22,15,w.got>=w.need?'#7FD69A':'#FFF3D6','left'))},
      down(){if(st==='idle'){st='wait';t=G.rand(1,3.2);bob={x:G.rand(150,250),y:300};G.sfx('whoosh');flash=0}
        else if(st==='wait'){st='idle';G.pop('너무 일찍 당겼어요!',AW/2,250,'#FF8A8A',16);G.sfx('no')}
        else if(st==='bite'){st='reel';prog=.3;fish=.5;fv=0;zone=.5;zv=0;G.sfx('jump')}
        hook=true},
      up(){hook=false},key(k){if(k==='A'||k==='U'){this.down();setTimeout(()=>hook=false,180)}}
    }}});

/* ---------- 독도 2: 독도 그림 퍼즐 — 단계마다 다른 그림 (15 퍼즐) ---------- */
const DOKDO_PICS=[['assets/isle_7.webp','해 뜨는 독도 전망대'],['assets/map_sea.webp','동해 밤바다'],['assets/hub_bg.webp','해 질 녘 항구'],['assets/isle_9.webp','푸른 바닷가 섬'],['assets/match_bg.webp','보물 해변'],
  ['assets/isle_6.webp','평화 기차역 섬'],['assets/drop_bg.webp','등대 절벽'],['assets/isle_home.webp','탐정단 항구 섬'],['assets/block_bg.webp','시장 창고'],['assets/merge_bg.webp','항구 작업장']];
arcDefine({id:'dokdo_slide',ch:'dokdo',name:'독도 그림 퍼즐',tag:'밀어 맞추기',from:'15 퍼즐 · 슬라이드 퍼즐',icon:'🏝️',
  how:['빈칸 옆 조각을 누르면 빈칸으로 미끄러져요. (같은 줄이면 여러 칸도 한 번에)','단계마다 다른 그림이 나와요! 오른쪽 아래 완성 그림을 보며 맞춰요.','적게 움직일수록 별이 많아요. 단계가 오르면 조각이 많아져요.'],
  init(G){
    const pic=(window.DOKDO_ART&&DOKDO_ART[(G.lv-1)%DOKDO_ART.length])||DOKDO_PICS[(G.lv-1)%DOKDO_PICS.length];
    const n=G.lv<=2?3:G.lv<=6?4:5, size=320, cs=size/n, ox=20, oy=40, shuf=20+Math.round(G.d*200);
    const img=new Image();let ready=false;img.onload=()=>ready=true;img.src=pic[0];
    let b=[...Array(n*n)].map((_,i)=>i),blank=n*n-1,moves=0,last=-1,nums=G.d<.4,hint=0;
    for(let i=0;i<shuf;i++){const r=Math.floor(blank/n),c=blank%n,opts=[[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([a,d])=>a>=0&&d>=0&&a<n&&d<n).map(([a,d])=>a*n+d).filter(x=>x!==last);
      const j=G.pick(opts);[b[blank],b[j]]=[b[j],b[blank]];last=blank;blank=j}
    if(b.every((v,i)=>v===i)){const j=blank-1>=0?blank-1:blank+1;[b[blank],b[j]]=[b[j],b[blank]];blank=j}
    const tb=G.btn(20,440,120,44,nums?'🔢 번호 끄기':'🔢 번호 켜기',()=>{nums=!nums;tb.label=nums?'🔢 번호 끄기':'🔢 번호 켜기'},{fs:15});
    return {
      boostText:'완성 그림 3초 보기', boost(){hint=3},
      update(dt){hint=Math.max(0,hint-dt);G.setHud(`👆 ${moves}번`,`기준 ${shuf}번`,`🖼 ${pic[1]}`)},
      draw(c){G.rr(ox-6,oy-6,size+12,size+12,12,'#4E2C14');const s=ready?Math.min(img.width,img.height):1;
        if(hint&&ready){c.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,ox,oy,size,size);return}
        b.forEach((v,i)=>{if(v===n*n-1)return;const x=ox+(i%n)*cs,y=oy+Math.floor(i/n)*cs,sx=(v%n)/n,sy=Math.floor(v/n)/n;
          c.save();c.beginPath();c.roundRect?c.roundRect(x+1,y+1,cs-2,cs-2,6):c.rect(x+1,y+1,cs-2,cs-2);c.clip();
          if(ready){c.fillStyle='#6FB6E0';c.fillRect(x,y,cs,cs);c.drawImage(img,(img.width-s)/2+sx*s,(img.height-s)/2+sy*s,s/n,s/n,x,y,cs,cs)}else{c.fillStyle=`hsl(${200+v*7},60%,55%)`;c.fillRect(x,y,cs,cs)}
          c.restore();if(nums||!ready)G.text(String(v+1),x+14,y+14,14,'#fff')});
        if(ready){c.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,AW-96,430,76,76);G.text('완성 그림',AW-58,516,12,'#FFE9A8')}
        G.text(pic[1],AW/2-20,500,16,'#FFE27A')},
      tap(x,y){const c=Math.floor((x-ox)/cs),r=Math.floor((y-oy)/cs);if(r<0||c<0||r>=n||c>=n)return;const br=Math.floor(blank/n),bc=blank%n;
        if(r!==br&&c!==bc)return;if(r===br&&c===bc)return;
        while(blank!==r*n+c){const BR=Math.floor(blank/n),BC=blank%n,step=r===BR?(c>BC?1:-1):(r>BR?n:-n);const j=blank+step;[b[blank],b[j]]=[b[j],b[blank]];blank=j;moves++}
        G.sfx('tap');if(b.every((v,i)=>v===i)){G.sfx('ok');G.burst(AW/2,200,'#FFE27A',30);G.win(moves<=shuf?3:moves<=shuf*2?2:1)}}
    }}});
