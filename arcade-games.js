/* ===== 섬 도전 놀이 1/3: 안전 · 인성 · 진로 · 민주시민 =====
   모든 놀이: 360×540 캔버스 좌표 · G.d(0~1)로 어려워져요 · 목표를 이루는 순간 G.win(별) */

/* ---------- 안전·건강 1: 안전 건널목 (크로시 로드 · 프로거) ---------- */
arcDefine({id:'safety_cross',ch:'safety',name:'안전 건널목',tag:'길 건너기 아케이드',from:'크로시 로드 · 프로거',icon:'🚦',
  how:['화면을 톡 누른 쪽(위·아래·왼쪽·오른쪽)으로 한 칸씩 움직여요. 밀어도, 방향키도 돼요.','차를 피해 맨 위 학교까지 무사히 건너요!','부딪히면 하트가 줄어요. 하트가 많이 남을수록 별이 많아요.'],
  init(G){
    const C=9,R=13,S=40,OY=10, cars=['🚗','🚕','🚙','🚓','🚑','🛵','🚚'];
    const nRoad=4+Math.round(G.d*5), rows=G.shuffle([...Array(11)].map((_,i)=>i+1)).slice(0,nRoad);
    const lanes={}; rows.forEach(r=>{const dir=Math.random()<.5?-1:1,sp=(45+130*G.d)*G.rand(.8,1.3),n=2+Math.round(G.d*1.6+Math.random()),bus=Math.random()<.25;
      lanes[r]={dir,sp,cars:[...Array(n)].map((_,i)=>({x:i*(C*S/n)+G.rand(0,30),e:bus?'🚌':G.pick(cars),w:bus?70:36}))}});
    const P={c:4,r:12,x:4,y:12,inv:0}; let hearts=3, time=60;
    const move=(dc,dr)=>{if(G.over)return;const c=P.c+dc,r=P.r+dr;if(c<0||c>=C||r<0||r>12)return;P.c=c;P.r=r;G.sfx('jump');
      if(r===0){G.burst(P.c*S+S/2,OY+S/2,'#7FD69A',30);G.win(starsByHearts(hearts))}};
    const hit=()=>{hearts--;G.sfx('hurt');G.shake=6;G.burst(P.x*S+S/2,OY+P.y*S+S/2,'#FF6F8A',16);P.c=4;P.r=12;P.inv=1;if(hearts<=0)G.lose('차에 너무 많이 부딪혔어요. 좌우를 꼭 살펴요!')};
    return {
      update(dt){time-=dt;if(time<=0)return G.lose('시간이 다 됐어요!');
        P.x=G.lerp(P.x,P.c,Math.min(1,dt*18));P.y=G.lerp(P.y,P.r,Math.min(1,dt*18));P.inv=Math.max(0,P.inv-dt);
        for(const r in lanes){const L=lanes[r];for(const k of L.cars){k.x+=L.dir*L.sp*dt;if(k.x>C*S+40)k.x-=C*S+80;if(k.x<-80)k.x+=C*S+80;
          if(+r===P.r&&!P.inv){const px=P.x*S+S/2;if(px>k.x-8&&px<k.x+k.w+8&&Math.abs(P.y-P.r)<.3)hit()}}}
        G.setHud(HEARTS(hearts),TIME(time),`${G.lv}단계`)},
      draw(c){
        for(let r=0;r<R;r++){const y=OY+r*S;const road=!!lanes[r];G.rr(0,y,AW,S,0,r===0?'#5FB36F':road?'#3B3B48':'#9C8E80');
          if(road){c.strokeStyle='#FFF';c.lineWidth=2;c.setLineDash([12,10]);c.beginPath();c.moveTo(0,y+S);c.lineTo(AW,y+S);c.stroke();c.setLineDash([])}}
        G.emo('🏫',AW/2,OY+S/2,30);G.text('학교',AW/2+34,OY+S/2,14,'#fff','left');
        for(const r in lanes){const L=lanes[r];for(const k of L.cars){if(L.dir>0)emoFlip(G,k.e,k.x+k.w/2,OY+r*S+S/2,k.w>40?40:32);else G.emo(k.e,k.x+k.w/2,OY+r*S+S/2,k.w>40?40:32)}}
        if(!(P.inv&&Math.floor(G.t*10)%2))G.emo('🧒',P.x*S+S/2,OY+P.y*S+S/2-Math.abs(Math.sin((P.y-P.r)*Math.PI))*8,32)},
      tap(x,y){const px=P.c*S+S/2,py=OY+P.r*S+S/2,dx=x-px,dy=y-py;if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1,0);else move(0,dy>0?1:-1)},
      swipe(d){move(d==='L'?-1:d==='R'?1:0,d==='U'?-1:d==='D'?1:0)},
      key(k){if(k!=='A')this.swipe(k)}
    }}});

/* ---------- 안전·건강 2: 세균 탁탁 (두더지 잡기) ---------- */
arcDefine({id:'safety_germ',ch:'dungeon',name:'세균 탁탁',tag:'두더지 잡기',from:'두더지 잡기 (오락실 고전)',icon:'🦠',
  how:['구멍에서 튀어나온 세균🦠·벌레를 톡 눌러 잡아요.','비누🧼·물💧·사과🍎·칫솔🪥은 몸에 좋은 친구! 누르면 하트가 줄어요.','시간 안에 목표만큼 잡으면 성공!'],
  init(G){
    const rows=G.d>.5?4:3, cols=3, holes=[], bad=['🦠','🤧','🪳','🦟'], good=['🧼','💧','🍎','🪥'];
    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)holes.push({x:70+c*110,y:150+r*(rows===4?95:115),it:null,t:0,up:0});
    const goal=12+Math.round(G.d*13), upT=1.3-.6*G.d, every=.85-.45*G.d; let got=0,hearts=3,time=30,spawn=0,mis=0,whack=null;
    return {
      update(dt){time-=dt;if(time<=0)return G.lose(`시간이 다 됐어요! (${got}/${goal})`);
        spawn-=dt;if(spawn<=0){spawn=every*G.rand(.7,1.2);const free=holes.filter(h=>!h.it);if(free.length){const h=G.pick(free);const isGood=Math.random()<.22+.15*G.d;h.it={e:G.pick(isGood?good:bad),good:isGood};h.t=upT;h.up=0}}
        for(const h of holes){if(!h.it)continue;h.t-=dt;h.up=Math.min(1,h.up+dt*7);if(h.t<=0){h.it=null}}
        if(whack)whack.t-=dt;G.setHud(HEARTS(hearts),TIME(time),`🦠 ${got}/${goal}`)},
      draw(c){G.rr(10,90,340,rows*(rows===4?95:115)+20,24,'#6FAE5A','#3A6A2A',3);
        for(const h of holes){G.circle(h.x,h.y+18,38,'#2A1A0E');if(h.it){c.save();c.beginPath();c.rect(h.x-50,h.y-70,100,88);c.clip();G.emo(h.it.e,h.x,h.y+18-h.up*40,46);c.restore()}
          c.beginPath();c.ellipse(h.x,h.y+22,42,12,0,0,Math.PI);c.fillStyle='#4E8A3A';c.fill()}
        if(whack&&whack.t>0)G.emo('🧽',whack.x,whack.y-10,40,whack.t*4)},
      tap(x,y){whack={x,y,t:.25};for(const h of holes){if(h.it&&Math.abs(x-h.x)<48&&y>h.y-60&&y<h.y+40){
          if(h.it.good){hearts--;mis++;G.sfx('no');G.pop('몸에 좋은 친구!',h.x,h.y-30,'#FF8A8A',16);h.it=null;if(hearts<=0)G.lose('몸에 좋은 친구를 너무 많이 눌렀어요!');return}
          got++;G.sfx('pop');G.burst(h.x,h.y,'#9FE870',12);G.addScore(10,h.x,h.y-30);h.it=null;if(got>=goal)G.win(mis===0?3:mis===1?2:1);return}}}
    }}});

/* ---------- 안전·건강 3: 지진 대피 달리기 (크롬 공룡 달리기) ---------- */
arcDefine({id:'safety_quake',ch:'dungeon',name:'대피 달리기',tag:'점프 러너',from:'크롬 공룡 달리기 · 런 게임',icon:'🏃',
  how:['흔들림이 멈췄어요! 넓은 운동장까지 달려가요.','화면을 누르면 점프! 떨어진 물건을 뛰어넘어요.','⛑️ 안전모·🎒 생존 가방을 모으면 점수가 올라요.'],
  init(G){
    const GY=430, goal=90+Math.round(G.d*130), sp=190+170*G.d; let y=GY,vy=0,on=true,hearts=3,inv=0,dist=0,next=1,obs=[],items=[],bg=0,quake=0;
    const ground=['🪨','📦','🧱','🪑','🗑️'];
    return {
      update(dt){dist+=sp*dt/40;bg+=sp*dt;if(dist>=goal){G.burst(80,GY-30,'#7FD69A',30);return G.win(starsByHearts(hearts))}
        vy+=1900*dt;y+=vy*dt;if(y>=GY){y=GY;vy=0;on=true}inv=Math.max(0,inv-dt);quake=Math.max(0,quake-dt);
        next-=dt;if(next<=0){next=G.rand(.75,1.5)*(1.1-.35*G.d);
          if(G.d>.35&&Math.random()<.3)obs.push({x:G.rand(220,330),y:-30,vy:0,fall:true,e:'💡'});else obs.push({x:AW+30,y:GY,e:G.pick(ground)});
          if(Math.random()<.45)items.push({x:AW+120,y:GY-G.rand(70,130),e:G.pick(['⛑️','🎒','🔦'])})}
        for(const o of obs){o.x-=sp*dt;if(o.fall){o.vy+=900*dt;o.y+=o.vy*dt;if(o.y>=GY){o.y=GY;o.fall=false;quake=.2;G.sfx('place')}}
          if(!inv&&Math.abs(o.x-70)<26&&Math.abs(o.y-y)<30){hearts--;inv=1.2;G.sfx('hurt');G.shake=6;G.burst(70,y-20,'#FF6F8A',14);if(hearts<=0)return G.lose('물건에 너무 많이 부딪혔어요!')}}
        for(const it of items){it.x-=sp*dt;if(!it.got&&Math.abs(it.x-70)<28&&Math.abs(it.y-(y-20))<34){it.got=1;G.sfx('coin');G.addScore(10,it.x,it.y-20)}}
        obs=obs.filter(o=>o.x>-40);items=items.filter(i=>i.x>-40&&!i.got);
        G.setHud(HEARTS(hearts),`🏃 ${Math.floor(dist)}/${goal}m`,`${G.lv}단계`)},
      draw(c){const sx=quake?G.rand(-3,3):0;c.save();c.translate(sx,0);
        c.fillStyle=G.grad(0,GY,'#2A3A6A','#E0907A');c.fillRect(0,0,AW,GY);
        for(let i=0;i<6;i++){const x=((i*90-bg*.3)%540+540)%540-90;G.rr(x,GY-140-(i%3)*30,70,160,4,'#3A2E4C')}
        G.rr(0,GY+20,AW,AH-GY-20,0,'#7A5A3A');c.fillStyle='#9C7A50';c.fillRect(0,GY+18,AW,6);
        for(const o of obs){if(o.fall)G.circle(o.x,GY+16,10,'rgba(0,0,0,.35)');G.emo(o.e,o.x,o.y,34)}
        for(const it of items)G.emo(it.e,it.x,it.y,28);
        G.emo('🏁',AW-30,60,30);G.text(`운동장까지 ${Math.max(0,goal-Math.floor(dist))}m`,AW-56,60,15,'#fff','right');
        if(!(inv&&Math.floor(G.t*12)%2))emoFlip(G,'🏃',70,y,44);c.restore()},
      down(){if(on){vy=-720;on=false;G.sfx('jump')}},key(k){if(k==='U'||k==='A')this.down()}
    }}});

/* ---------- 인성 1: 마음 짝꿍 카드 (기억력 카드) ---------- */
arcDefine({id:'character_memory',ch:'dungeon',name:'마음 짝꿍 카드',tag:'짝 맞추기',from:'메모리 카드 · 신경쇠약',icon:'💌',
  how:['카드를 두 장씩 뒤집어 같은 마음 그림을 찾아요.','적게 뒤집을수록 별이 많아요!','높은 단계는 카드가 많아지고 미리 보는 시간이 없어져요.'],
  init(G){
    const W=[['🤝','배려'],['😊','미소'],['💌','편지'],['🙏','고마워'],['🎁','나눔'],['🌷','고운 말'],['👏','칭찬'],['🍀','응원'],['🌈','존중'],['🎈','협동'],['💐','환영'],['🧡','사랑']];
    const n=4+Math.round(G.d*6), pick=G.shuffle(W).slice(0,n), deck=G.shuffle([...pick,...pick]).map(w=>({w,open:0,done:false,f:0}));
    const cols=deck.length<=12?4:5, rows=Math.ceil(deck.length/cols), cw=(340-(cols-1)*8)/cols, ch=Math.min(100,(430-(rows-1)*8)/rows);
    deck.forEach((d,i)=>{d.x=10+(i%cols)*(cw+8);d.y=60+Math.floor(i/cols)*(ch+8)});
    let sel=[],moves=0,found=0,lock=0,time=30+6*n,peek=G.d<.5?2.4-1.5*G.d:0;
    if(peek)deck.forEach(d=>d.open=1);
    return {
      update(dt){if(peek>0){peek-=dt;if(peek<=0)deck.forEach(d=>d.open=0)}else{time-=dt;if(time<=0)return G.lose('시간이 다 됐어요!')}
        if(lock>0){lock-=dt;if(lock<=0){sel.forEach(d=>d.open=0);sel=[]}}
        for(const d of deck)d.f=G.lerp(d.f,d.open||d.done?1:0,Math.min(1,dt*12));
        G.setHud(`🔁 ${moves}번`,peek>0?'👀 기억해요!':TIME(time),`💌 ${found}/${n}`)},
      draw(c){for(const d of deck){const s=Math.abs(d.f-.5)*2,face=d.f>.5;c.save();c.translate(d.x+cw/2,d.y+ch/2);c.scale(Math.max(.05,s),1);
          if(face){G.rr(-cw/2,-ch/2,cw,ch,12,d.done?'#BFF0C8':'#FFF8E6','#6B3D1F',3);G.emo(d.w[0],0,-8,Math.min(40,ch*.45));G.text(d.w[1],0,ch/2-14,13,'#4A240E','center',null)}
          else{G.rr(-cw/2,-ch/2,cw,ch,12,'#D9577E','#6B1F34',3);G.emo('💗',0,0,26,.5)}c.restore()}},
      tap(x,y){if(peek>0||lock>0)return;const d=deck.find(d=>x>d.x&&x<d.x+cw&&y>d.y&&y<d.y+ch);if(!d||d.done||d.open)return;
        d.open=1;sel.push(d);G.sfx('tap');if(sel.length===2){moves++;
          if(sel[0].w===sel[1].w){sel.forEach(s=>{s.done=true;G.burst(s.x+cw/2,s.y+ch/2,'#FFB3C6',10)});G.sfx('ok');G.pop(sel[0].w[1]+'!',sel[1].x+cw/2,sel[1].y,'#FFE27A');sel=[];found++;
            if(found===n)G.win(moves<=n+Math.ceil(n*.5)?3:moves<=n*2?2:1)}else lock=.75}}
    }}});

/* ---------- 인성 2: 배려 탑 쌓기 (스택) ---------- */
arcDefine({id:'character_stack',ch:'dungeon',name:'배려 탑 쌓기',tag:'타이밍 쌓기',from:'스택 (Stack) · 하이퍼캐주얼',icon:'🧱',
  how:['좌우로 움직이는 블록을 알맞을 때 톡! 눌러 쌓아요.','삐져나온 부분은 잘려 나가요. 딱 맞추면 "완벽!"','목표 높이까지 쌓으면 성공! 넓게 남길수록 별이 많아요.'],
  init(G){
    const BH=24, goal=8+Math.round(G.d*10), words=['💗','🤝','😊','🙏','👏','🌷','🎁','🌈'];
    const blocks=[{x:80,w:200,y:0,col:'hsl(340,70%,62%)'}]; let cur={x:0,w:200,dir:1},sp=110+190*G.d,cam=0,falls=[],perfect=0;
    const top=()=>blocks[blocks.length-1];
    return {
      update(dt){cur.x+=cur.dir*sp*dt;if(cur.x+cur.w>AW+40){cur.dir=-1}if(cur.x<-40){cur.dir=1}
        const want=Math.max(0,blocks.length*BH-300);cam=G.lerp(cam,want,Math.min(1,dt*5));
        for(const f of falls){f.vy+=900*dt;f.y+=f.vy*dt}falls=falls.filter(f=>f.y<1000);
        G.setHud(`🧱 ${blocks.length-1}/${goal}층`,`✨ 완벽 ${perfect}`,`${G.lv}단계`)},
      draw(c){const base=500;
        for(let i=0;i<blocks.length;i++){const b=blocks[i],y=base-i*BH+cam;G.rr(b.x,y-BH,b.w,BH-2,6,b.col,'rgba(0,0,0,.35)');if(i)G.emo(words[i%words.length],b.x+14,y-BH/2,16)}
        for(const f of falls)G.rr(f.x,f.y+cam,f.w,BH-2,6,f.col);
        const y=base-blocks.length*BH+cam;G.rr(cur.x,y-BH,cur.w,BH-2,6,`hsl(${(340+blocks.length*24)%360},70%,62%)`,'#fff',2);
        G.text(`목표 ${goal}층`,AW/2,30,18)},
      down(){if(G.over)return;const t=top(),l=Math.max(cur.x,t.x),r=Math.min(cur.x+cur.w,t.x+t.w);
        if(r-l<=0){G.sfx('no');falls.push({x:cur.x,w:cur.w,y:500-blocks.length*BH-BH,vy:0,col:'#888'});return G.lose('블록이 탑을 벗어났어요!')}
        let nx=l,nw=r-l;if(Math.abs(cur.x-t.x)<5){nx=t.x;nw=t.w;perfect++;G.sfx('combo');G.pop('완벽!',AW/2,500-blocks.length*BH+cam-30)}
        else{G.sfx('place');const cutX=cur.x<t.x?cur.x:r;falls.push({x:cutX,w:cur.w-nw,y:500-blocks.length*BH-BH,vy:0,col:'#B07A90'})}
        blocks.push({x:nx,w:nw,col:`hsl(${(340+blocks.length*24)%360},70%,62%)`});G.burst(nx+nw/2,500-blocks.length*BH+cam,'#FFE27A',8);
        cur={x:cur.dir>0?-40:AW+40-nw,w:nw,dir:cur.dir};sp*=1.02;
        if(blocks.length-1>=goal){const k=nw/200;G.win(k>=.6||perfect>=goal*.5?3:k>=.35?2:1)}},
      key(k){if(k==='A'||k==='D')this.down()}
    }}});

/* ---------- 인성 3: 칭찬 리듬 (피아노 타일) ---------- */
arcDefine({id:'character_rhythm',ch:'character',name:'칭찬 리듬',tag:'리듬 탭',from:'피아노 타일 · 리듬 게임',icon:'🎵',
  how:['내려오는 칭찬 타일(💗😊👍🌟)을 바닥에 닿기 전에 톡 눌러요.','화난 말 타일(💢😠)은 누르지 말고 그냥 보내요!','놓치거나 화난 말을 누르면 하트가 줄어요.'],
  init(G){
    const LW=AW/4, HY=480, goal=18+Math.round(G.d*32), sp=160+380*G.d, kind=['💗','😊','👍','🌟','🙌'], bad=['💢','😠','🙄'];
    let notes=[],t=0,hearts=3,got=0,combo=0;
    return {
      boostText:'하트 +1', boost(){hearts=Math.min(3,hearts+1)},
      update(dt){t-=dt;if(t<=0){t=G.rand(.55,1)*(.85-.55*G.d);const isBad=Math.random()<.1+.25*G.d,l=G.ri(0,3);notes.push({l,y:-50,e:G.pick(isBad?bad:kind),bad:isBad});if(G.d>.45&&Math.random()<G.d*.45)notes.push({l:(l+G.ri(1,3))%4,y:-50,e:G.pick(kind),bad:false})}
        for(const n of notes){n.y+=sp*dt;if(n.y>HY+30&&!n.gone){n.gone=1;if(!n.bad){hearts--;combo=0;G.sfx('no');G.shake=4;if(hearts<=0)return G.lose('칭찬을 너무 많이 놓쳤어요!')}}}
        notes=notes.filter(n=>n.y<AH+60&&!n.hit);G.setHud(HEARTS(hearts),`💗 ${got}/${goal}`,combo>2?`🔥 ${combo}콤보`:`${G.lv}단계`)},
      draw(c){for(let i=0;i<4;i++)G.rr(i*LW+2,0,LW-4,AH,0,i%2?'rgba(255,255,255,.05)':'rgba(255,255,255,.09)');
        G.rr(0,HY,AW,4,0,'#FFE27A');
        for(const n of notes){G.rr(n.l*LW+6,n.y-38,LW-12,76,14,n.bad?'#5A2A3A':'#FFF3D6',n.bad?'#FF6F8A':'#D9A441',3);G.emo(n.e,n.l*LW+LW/2,n.y,38)}},
      down(x,y){const l=Math.floor(x/LW);const n=notes.filter(n=>n.l===l&&!n.gone&&Math.abs(n.y-y)<60).sort((a,b)=>b.y-a.y)[0];if(!n)return;
        n.hit=1;if(n.bad){hearts--;combo=0;G.sfx('no');G.pop('앗, 화난 말!',n.l*LW+LW/2,n.y,'#FF8A8A',16);if(hearts<=0)G.lose('화난 말을 너무 많이 눌렀어요!');return}
        got++;combo++;G.sfx('combo');try{sfx.combo(combo)}catch(e){}G.burst(n.l*LW+LW/2,n.y,'#FFB3C6',10);G.addScore(10+combo,n.l*LW+LW/2,n.y-40);if(got>=goal)G.win(starsByHearts(hearts))}
    }}});

/* ---------- 진로 1: 코딩 로봇 (라이트봇 · 코딩 퍼즐) ---------- */
arcDefine({id:'career_robot',ch:'dungeon',name:'코딩 로봇',tag:'코딩 퍼즐',from:'라이트봇 · 엔트리 코딩',icon:'🤖',
  how:['아래 명령 단추로 로봇의 순서를 짜요: ⬆️ 앞으로 · ↩️ 왼쪽 돌기 · ↪️ 오른쪽 돌기','▶ 실행을 누르면 로봇이 차례대로 움직여요. 🔩 부품을 모두 줍고 🏁에 도착!','명령이 짧을수록 별이 많아요. 부딪히면 기회가 하나 줄어요.'],
  init(G){
    const n=G.d<.3?5:G.d<.7?6:7, cs=300/n, ox=30, oy=24, DR=[[-1,0],[0,1],[1,0],[0,-1]], gems=G.d>.45?(G.d>.8?2:1):0;
    let grid,start,goal,gemPos,opt;
    const key=(r,c)=>r*n+c;
    const gen=()=>{for(let tries=0;tries<200;tries++){
      const sr=G.ri(0,n-1),sc=G.ri(0,n-1),path=[[sr,sc]],seen=new Set([key(sr,sc)]),L=4+Math.round(G.d*8);
      while(path.length<L){const [r,c]=path[path.length-1];const nb=G.shuffle(DR).map(([a,b])=>[r+a,c+b]).filter(([a,b])=>a>=0&&b>=0&&a<n&&b<n&&!seen.has(key(a,b)));if(!nb.length)break;path.push(nb[0]);seen.add(key(...nb[0]))}
      if(path.length<4)continue;
      grid=[...Array(n)].map(()=>Array(n).fill(0));for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(!seen.has(key(r,c))&&Math.random()<.2+.15*G.d)grid[r][c]=1;
      start={r:sr,c:sc,dir:G.ri(0,3)};goal=path[path.length-1];gemPos=G.shuffle(path.slice(1,-1)).slice(0,gems);
      opt=solve();if(opt&&opt>=3)return}
    };
    const solve=()=>{const full=(1<<gemPos.length)-1,q=[[start.r,start.c,start.dir,0,0]],seen=new Set([`${start.r},${start.c},${start.dir},0`]);
      while(q.length){const [r,c,d,m,k]=q.shift();if(r===goal[0]&&c===goal[1]&&m===full)return k;
        const nx=[[r,c,(d+3)%4,m],[r,c,(d+1)%4,m]];const fr=r+DR[d][0],fc=c+DR[d][1];
        if(fr>=0&&fc>=0&&fr<n&&fc<n&&!grid[fr][fc]){let mm=m;gemPos.forEach((g,i)=>{if(g[0]===fr&&g[1]===fc)mm|=1<<i});nx.push([fr,fc,d,mm])}
        for(const s of nx){const id=s.join(',');if(!seen.has(id)){seen.add(id);q.push([...s,k+1])}}}return null};
    gen(); if(!opt)opt=8;
    const maxLen=opt+Math.max(2,Math.round(6-4*G.d));
    let prog=[],run=null,bot={...start},got=new Set(),tries=3;
    const reset=()=>{bot={...start};got=new Set();run=null};
    const CMD={F:'⬆️',L:'↩️',R:'↪️'};
    G.btn(14,420,62,52,'⬆️',()=>{if(!run&&prog.length<maxLen)prog.push('F')});G.btn(84,420,62,52,'↩️',()=>{if(!run&&prog.length<maxLen)prog.push('L')});
    G.btn(154,420,62,52,'↪️',()=>{if(!run&&prog.length<maxLen)prog.push('R')});G.btn(224,420,56,52,'⌫',()=>{if(!run)prog.pop()},{col:'#7A4A5A'});
    G.btn(288,420,62,52,'▶',()=>{if(!run&&prog.length){reset();run={i:0,t:.2}}},{col:'#2F9E5B'});
    const fail=why=>{tries--;G.sfx('hurt');G.shake=5;G.pop(why,AW/2,200,'#FF8A8A',18);run=null;setTimeout(()=>{if(!G.over)reset()},500);if(tries<=0)G.lose('기회를 모두 썼어요. 순서를 다시 생각해 봐요!')};
    return {
      update(dt){if(run){run.t-=dt;if(run.t<=0){run.t=.38;const cm=prog[run.i++];
          if(cm==='L')bot.dir=(bot.dir+3)%4;else if(cm==='R')bot.dir=(bot.dir+1)%4;else{const r=bot.r+DR[bot.dir][0],c=bot.c+DR[bot.dir][1];
            if(r<0||c<0||r>=n||c>=n||grid[r][c])return fail('쾅! 부딪혔어요');bot.r=r;bot.c=c;G.sfx('tap');gemPos.forEach((g,i)=>{if(g[0]===r&&g[1]===c&&!got.has(i)){got.add(i);G.sfx('coin')}})}
          if(run.i>=prog.length){if(bot.r===goal[0]&&bot.c===goal[1]&&got.size===gemPos.length){run=null;G.burst(ox+goal[1]*cs+cs/2,oy+goal[0]*cs+cs/2,'#7FD69A',30);G.win(prog.length<=opt?3:prog.length<=opt+2?2:1)}else fail(got.size<gemPos.length&&bot.r===goal[0]&&bot.c===goal[1]?'부품을 다 못 주웠어요':'깃발에 못 갔어요')}}}
        G.setHud(`🔋 기회 ${tries}`,`📜 ${prog.length}/${maxLen}`,`최소 ${opt}개`)},
      draw(c){for(let r=0;r<n;r++)for(let k=0;k<n;k++){const x=ox+k*cs,y=oy+r*cs;G.rr(x+1,y+1,cs-2,cs-2,6,(r+k)%2?'#3A4A6A':'#33405E');if(grid[r][k])G.emo('🪨',x+cs/2,y+cs/2,cs*.7)}
        gemPos.forEach((g,i)=>{if(!got.has(i))G.emo('🔩',ox+g[1]*cs+cs/2,oy+g[0]*cs+cs/2,cs*.5)});
        G.emo('🏁',ox+goal[1]*cs+cs/2,oy+goal[0]*cs+cs/2,cs*.6);
        const bx=ox+bot.c*cs+cs/2,by=oy+bot.r*cs+cs/2;G.emo('🤖',bx,by,cs*.62);
        const [dr,dc]=DR[bot.dir];c.fillStyle='#FFE27A';c.beginPath();c.moveTo(bx+dc*cs*.48,by+dr*cs*.48);c.lineTo(bx+dc*cs*.3-dr*cs*.12,by+dr*cs*.3+dc*cs*.12);c.lineTo(bx+dc*cs*.3+dr*cs*.12,by+dr*cs*.3-dc*cs*.12);c.fill();
        G.rr(10,336,340,74,12,'rgba(0,0,0,.35)','#8A5B1C',2);
        prog.forEach((p,i)=>{const x=20+(i%12)*27,y=352+Math.floor(i/12)*30;G.rr(x-2,y-12,25,25,6,run&&run.i-1===i?'#E08A1A':'#4E2C14');G.emo(CMD[p],x+10,y,18)});
        if(!prog.length)G.text('명령 단추를 눌러 순서를 만들어요',AW/2,372,15,'#FFE9A8')}
    }}});

/* ---------- 진로 2: 꿈 셰프 주문 (요리 주문 러시) ---------- */
arcDefine({id:'career_chef',ch:'dungeon',name:'꿈 셰프 주문',tag:'요리 주문 러시',from:'오버쿡드 · 쿠킹 타이쿤',icon:'👩‍🍳',
  how:['여러 직업의 손님이 주문서를 보여 줘요. 재료 단추를 눌러 접시에 담아요.','접시가 주문과 똑같아지면 바로 대접! 틀린 재료는 🗑️로 버려요.','손님이 기다리다 떠나면 하트가 줄어요.'],
  init(G){
    const ING=['🍞','🥬','🍅','🧀','🥩','🥚'], JOB=['👨‍🚒','👩‍⚕️','👨‍🔬','👩‍🏫','👮','👩‍🌾','👨‍🎨','👩‍✈️'], goal=5+Math.round(G.d*7), k=2+Math.round(G.d*2), pat=17-7*G.d;
    let slots=[null,null,null], plate=[], hearts=3, served=0, wait=.3;
    const newOrder=()=>({who:G.pick(JOB),need:G.shuffle(ING).slice(0,k),t:pat,max:pat});
    ING.forEach((e,i)=>G.btn(18+(i%3)*112,350+Math.floor(i/3)*64,100,56,e,()=>add(e)));
    G.btn(130,478,100,50,'🗑️',()=>{if(plate.length){plate=[];G.sfx('whoosh')}},{col:'#7A4A5A'});
    const same=(a,b)=>a.length===b.length&&a.every(x=>b.includes(x));
    const add=e=>{if(plate.includes(e)){G.sfx('no');G.pop('이미 담았어요',AW/2,300,'#FF8A8A',15);return}plate.push(e);G.sfx('place');
      const i=slots.findIndex(s=>s&&same(s.need,plate));
      if(i>=0){served++;G.sfx('deliver');G.burst(60+i*120,90,'#FFE27A',18);G.addScore(Math.ceil(slots[i].t)*5,60+i*120,60);slots[i]=null;plate=[];if(served>=goal)G.win(starsByHearts(hearts));return}
      if(!slots.some(s=>s&&plate.every(x=>s.need.includes(x)))){G.pop('주문에 없는 재료!',AW/2,300,'#FF8A8A',15)}};
    return {
      update(dt){wait-=dt;const em=slots.findIndex(s=>!s);if(em>=0&&wait<=0){slots[em]=newOrder();wait=G.rand(1,2.2)-G.d*.6}
        slots.forEach((s,i)=>{if(!s)return;s.t-=dt;if(s.t<=0){slots[i]=null;hearts--;G.sfx('hurt');G.shake=5;if(hearts<=0)G.lose('손님이 너무 많이 기다리다 떠났어요!')}});
        G.setHud(HEARTS(hearts),`🍽 ${served}/${goal}`,`${G.lv}단계`)},
      draw(c){slots.forEach((s,i)=>{const x=10+i*116;G.rr(x,14,108,200,14,s?'#FFF8E6':'rgba(255,255,255,.08)','#6B3D1F',2);if(!s)return;
          G.emo(s.who,x+54,50,44);s.need.forEach((e,j)=>{const ok=plate.includes(e);G.rr(x+8+(j%2)*48,90+Math.floor(j/2)*48,44,44,8,ok?'#BFF0C8':'#F3E2C2');G.emo(e,x+30+(j%2)*48,112+Math.floor(j/2)*48,28)});
          const p=s.t/s.max;G.rr(x+8,196,92,10,5,'#3A2A3A');G.rr(x+8,196,92*p,10,5,p>.5?'#6FE0A6':p>.25?'#FFD24A':'#FF6A5A')});
        G.circle(AW/2,280,58,'#F3F3F3','#B8B8C8',4);plate.forEach((e,i)=>G.emo(e,AW/2-30+(i%3)*30,268+Math.floor(i/3)*28,30));if(!plate.length)G.text('접시',AW/2,280,16,'#999','center',null)}
    }}});

/* ---------- 진로 3: 꿈 사다리 점프 (두들 점프) ---------- */
arcDefine({id:'career_jump',ch:'dungeon',name:'꿈 사다리 점프',tag:'위로 점프',from:'두들 점프 · 로블록스 장애물 코스',icon:'🪜',
  how:['발판을 밟으면 저절로 통통 튀어 올라요. 화면 왼쪽·오른쪽을 누르고 있으면 그쪽으로 움직여요.','직업 도구(🎨🔬⚽🎤🩺💻)를 모으며 목표 높이까지 올라가요.','움직이는 발판, 부서지는 갈색 발판을 조심! 떨어지면 하트가 줄어요.'],
  init(G){
    const goal=1500+Math.round(G.d*2600), JOBS=['🎨','🔬','⚽','🎤','🩺','💻','🎹','📷','🚀'];
    let P={x:AW/2,y:400,vy:-600,vx:0},plat=[],cam=0,top=0,hearts=3,inv=0,got=0,dirK=0,maxH=0;
    const mk=y=>{const r=Math.random();plat.push({x:G.rand(10,AW-80),y,w:70-18*G.d,mv:r<.1+.35*G.d?G.rand(40,90)*(Math.random()<.5?1:-1):0,br:r>.92-.2*G.d,it:Math.random()<.3?G.pick(JOBS):null})};
    plat.push({x:AW/2-40,y:470,w:80,mv:0});for(let y=420;y>-600;y-=G.rand(60,60+50*G.d))mk(y);top=plat[plat.length-1].y;
    return {
      update(dt){const want=G.pdown?(G.px<AW/2?-1:1):dirK;P.vx=G.lerp(P.vx,want*260,Math.min(1,dt*10));P.x+=P.vx*dt;if(P.x<-15)P.x=AW+15;if(P.x>AW+15)P.x=-15;
        P.vy+=1250*dt;P.y+=P.vy*dt;inv=Math.max(0,inv-dt);
        for(const p of plat){if(p.mv){p.x+=p.mv*dt;if(p.x<0||p.x+p.w>AW)p.mv*=-1}
          if(P.vy>0&&!p.gone&&P.x>p.x-6&&P.x<p.x+p.w+6&&P.y>p.y-6&&P.y<p.y+14){if(p.br){p.gone=1;G.sfx('place');continue}P.vy=-640;P.y=p.y-6;G.sfx('jump')}
          if(p.it&&Math.abs(P.x-(p.x+p.w/2))<30&&Math.abs(P.y-20-(p.y-26))<34){G.addScore(10,p.x+p.w/2,p.y-40);got++;p.it=null;G.sfx('coin')}}
        if(P.y-cam<200)cam=P.y-200;maxH=Math.max(maxH,470-P.y);
        while(top>cam-80){top-=G.rand(60,60+50*G.d);mk(top)}plat=plat.filter(p=>p.y<cam+AH+40);
        if(P.y>cam+AH+30){hearts--;G.sfx('hurt');if(hearts<=0)return G.lose('너무 많이 떨어졌어요!');const p=plat.filter(p=>!p.br&&p.y<cam+AH-60&&p.y>cam+AH-260).pop()||plat[0];P.x=p.x+p.w/2;P.y=p.y-10;P.vy=-700;inv=1.5;p.br=false}
        if(maxH/2>=goal/2&&maxH>=goal){G.burst(AW/2,200,'#FFE27A',30);return G.win(starsByHearts(hearts))}
        G.setHud(HEARTS(hearts),`🪜 ${Math.floor(maxH/10)}/${goal/10|0}m`,`🎒 ${got}`)},
      draw(c){c.save();c.translate(0,-cam);
        for(let i=0;i<14;i++){const y=Math.floor(cam/120)*120+i*120;G.circle((i*97)%AW,y,2,'rgba(255,255,255,.5)')}
        if(goal-470>cam-50){G.rr(0,470-goal-6,AW,6,3,'#FFE27A');G.text('🎓 꿈 도착!',AW/2,470-goal-24,18,'#FFE27A')}
        for(const p of plat){if(p.gone)continue;G.rr(p.x,p.y,p.w,12,6,p.br?'#8A5A30':p.mv?'#6FB6FF':'#7FD69A','rgba(0,0,0,.4)');if(p.it)G.emo(p.it,p.x+p.w/2,p.y-24,26)}
        if(!(inv&&Math.floor(G.t*12)%2))G.emo('🧒',P.x,P.y-20,40);c.restore()},
      key(k){if(k==='L')dirK=-1;if(k==='R')dirK=1},keyup(k){if((k==='L'&&dirK<0)||(k==='R'&&dirK>0))dirK=0}
    }}});

/* ---------- 민주시민 1: 투표함 옮기기 (소코반) ---------- */
arcDefine({id:'democracy_soko',ch:'dungeon',name:'투표함 옮기기',tag:'밀기 퍼즐',from:'소코반 (창고지기)',icon:'🗳️',
  how:['투표함🗳️을 밀어서 ⭕ 자리에 모두 옮겨요. (끌 수는 없어요!)','누른 쪽으로 한 칸씩 움직여요. 밀어도, 방향키도 돼요.','구석에 박히면 ↶ 되돌리기나 🔄 처음부터! 적게 움직일수록 별이 많아요.'],
  init(G){
    const n=G.d<.35?7:G.d<.75?8:9, nb=G.lv<=2?1:G.d<.6?2:3, DR={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]};
    let wall,goals,boxes,pl,par;
    const K=(r,c)=>r*n+c;
    const gen=()=>{for(let t=0;t<300;t++){
      wall=[...Array(n)].map((_,r)=>[...Array(n)].map((_,c)=>r===0||c===0||r===n-1||c===n-1||Math.random()<.1));
      const free=[];for(let r=1;r<n-1;r++)for(let c=1;c<n-1;c++)if(!wall[r][c])free.push([r,c]);
      const pick=G.shuffle(free);if(pick.length<nb+4)continue;goals=pick.slice(0,nb);boxes=goals.map(g=>[...g]);pl=[...pick[nb]];
      for(let i=0;i<60+Math.round(G.d*140);i++){const d=G.pick(Object.values(DR));const nr=pl[0]+d[0],nc=pl[1]+d[1];
        if(wall[nr][nc]||boxes.some(b=>b[0]===nr&&b[1]===nc))continue;const bi=boxes.findIndex(b=>b[0]===pl[0]-d[0]&&b[1]===pl[1]-d[1]);
        if(bi>=0&&Math.random()<.65)boxes[bi]=[pl[0],pl[1]];pl=[nr,nc]}
      if(boxes.every(b=>goals.some(g=>g[0]===b[0]&&g[1]===b[1])))continue;
      par=solve();if(par&&par>=(nb>1?8:4))return}};
    const solve=()=>{const gs=new Set(goals.map(g=>K(...g)));const enc=(p,bs)=>p+'|'+bs.map(b=>K(...b)).sort((a,b)=>a-b).join(',');
      let q=[[pl,boxes]],seen=new Set([enc(K(...pl),boxes)]),depth=0;
      while(q.length&&depth<200&&seen.size<120000){const nq=[];for(const [p,bs] of q){if(bs.every(b=>gs.has(K(...b))))return depth;
          for(const d of Object.values(DR)){const nr=p[0]+d[0],nc=p[1]+d[1];if(wall[nr][nc])continue;let nbs=bs;const bi=bs.findIndex(b=>b[0]===nr&&b[1]===nc);
            if(bi>=0){const br=nr+d[0],bc=nc+d[1];if(wall[br][bc]||bs.some(b=>b[0]===br&&b[1]===bc))continue;nbs=bs.map((b,i)=>i===bi?[br,bc]:b)}
            const id=enc(K(nr,nc),nbs);if(!seen.has(id)){seen.add(id);nq.push([[nr,nc],nbs])}}}q=nq;depth++}return null};
    gen(); if(!par)par=30;
    const S0={pl:[...pl],boxes:boxes.map(b=>[...b])};let hist=[],moves=0;
    const cs=Math.min(300/n,40), ox=(AW-cs*n)/2, oy=30;
    G.btn(40,440,120,52,'↶ 되돌리기',()=>{const h=hist.pop();if(h){pl=h.pl;boxes=h.boxes;moves--}},{fs:16});
    G.btn(200,440,120,52,'🔄 처음부터',()=>{pl=[...S0.pl];boxes=S0.boxes.map(b=>[...b]);hist=[];moves=0},{fs:16,col:'#7A4A5A'});
    const step=k=>{if(G.over)return;const d=DR[k];const nr=pl[0]+d[0],nc=pl[1]+d[1];if(wall[nr][nc])return;const bi=boxes.findIndex(b=>b[0]===nr&&b[1]===nc);
      const snap={pl:[...pl],boxes:boxes.map(b=>[...b])};
      if(bi>=0){const br=nr+d[0],bc=nc+d[1];if(wall[br][bc]||boxes.some(b=>b[0]===br&&b[1]===bc)){G.sfx('no');return}boxes[bi]=[br,bc];G.sfx('place');if(goals.some(g=>g[0]===br&&g[1]===bc))G.burst(ox+bc*cs+cs/2,oy+br*cs+cs/2,'#FFE27A',8)}else G.sfx('tap');
      hist.push(snap);pl=[nr,nc];moves++;
      if(boxes.every(b=>goals.some(g=>g[0]===b[0]&&g[1]===b[1])))G.win(moves<=Math.ceil(par*1.25)+2?3:moves<=par*2+4?2:1)};
    return {
      update(){G.setHud(`👣 ${moves}번`,`최소 ${par}번`,`🗳️ ${boxes.filter(b=>goals.some(g=>g[0]===b[0]&&g[1]===b[1])).length}/${nb}`)},
      draw(c){for(let r=0;r<n;r++)for(let k=0;k<n;k++){const x=ox+k*cs,y=oy+r*cs;if(wall[r][k]){G.rr(x,y,cs,cs,3,'#7A5A44','#3A2010',1.5);c.strokeStyle='#5A3A24';c.beginPath();c.moveTo(x,y+cs/2);c.lineTo(x+cs,y+cs/2);c.stroke()}else G.rr(x,y,cs,cs,0,(r+k)%2?'#E9D6B0':'#F3E2C2')}
        goals.forEach(g=>G.circle(ox+g[1]*cs+cs/2,oy+g[0]*cs+cs/2,cs*.32,null,'#E2513A',4));
        boxes.forEach(b=>{const on=goals.some(g=>g[0]===b[0]&&g[1]===b[1]);if(on)G.circle(ox+b[1]*cs+cs/2,oy+b[0]*cs+cs/2,cs*.46,'rgba(127,214,154,.7)');G.emo('🗳️',ox+b[1]*cs+cs/2,oy+b[0]*cs+cs/2,cs*.72)});
        G.emo('🧑',ox+pl[1]*cs+cs/2,oy+pl[0]*cs+cs/2,cs*.75);G.text('누르거나 밀어서 움직여요',AW/2,415,15,'#FFE9A8')},
      tap(x,y){if(y>430)return;const px=ox+pl[1]*cs+cs/2,py=oy+pl[0]*cs+cs/2,dx=x-px,dy=y-py;step(Math.abs(dx)>Math.abs(dy)?(dx>0?'R':'L'):(dy>0?'D':'U'))},
      swipe(d){step(d)},key(k){if(DR[k])step(k)}
    }}});

/* ---------- 민주시민 2: 의견 모으기 2048 ---------- */
arcDefine({id:'democracy_2048',ch:'dungeon',name:'의견 모으기 2048',tag:'숫자 합치기',from:'2048',icon:'📢',
  how:['화면을 밀면(방향키도 돼요) 모든 의견 타일이 그쪽으로 미끄러져요.','같은 의견끼리 부딪히면 합쳐져요: 💬→🗨️→📝→📋→📢→🗳️→🏛️→🤝','목표 타일을 만들면 성공! 적게 움직일수록 별이 많아요.'],
  init(G){
    const IC={2:'💬',4:'🗨️',8:'📝',16:'📋',32:'📢',64:'🗳️',128:'🏛️',256:'🤝',512:'🎉',1024:'👑'};
    const goal=2**(5+Math.round(G.d*4)), N=4, cs=80, ox=20, oy=60; let b=[...Array(16)].fill(0),moves=0,fx={};
    const add=()=>{const e=b.map((v,i)=>v?-1:i).filter(i=>i>=0);if(!e.length)return;const i=G.pick(e);b[i]=Math.random()<.9?2:4;fx[i]={t:.2,k:'n'}};
    add();add();
    const can=()=>{for(let i=0;i<16;i++){if(!b[i])return true;const r=i>>2,c=i&3;if(c<3&&b[i]===b[i+1])return true;if(r<3&&b[i]===b[i+4])return true}return false};
    const slide=dir=>{if(G.over)return;let moved=false;const nb=[...b];fx={};
      for(let k=0;k<4;k++){const idx=[0,1,2,3].map(j=>dir==='L'?k*4+j:dir==='R'?k*4+3-j:dir==='U'?j*4+k:(3-j)*4+k);
        const vals=idx.map(i=>nb[i]).filter(v=>v);const out=[];for(let j=0;j<vals.length;j++){if(vals[j]===vals[j+1]){out.push(vals[j]*2);j++;out.push(-1)}else out.push(vals[j])}
        const clean=[];out.forEach(v=>{if(v===-1)fx[idx[clean.length-1]]={t:.25,k:'m'};else clean.push(v)});
        idx.forEach((i,j)=>{const v=clean[j]||0;if(nb[i]!==v)moved=true;nb[i]=v})}
      if(!moved)return;b=nb;moves++;G.sfx(Object.values(fx).some(f=>f.k==='m')?'merge':'tap');add();
      const mx=Math.max(...b);G.score=mx;if(mx>=goal){G.burst(AW/2,220,'#FFE27A',30);return G.win(moves<=goal*.62+6?3:moves<=goal*.85+10?2:1)}
      if(!can())G.lose('칸이 꽉 찼어요! 큰 의견을 한쪽 구석에 모아 봐요.')};
    const COL={2:'#FFF3D6',4:'#FFE6B0',8:'#FFC98A',16:'#FFAA70',32:'#FF8C74',64:'#E2513A',128:'#7FD69A',256:'#3FB98A',512:'#6FB6FF',1024:'#BBA9FF'};
    return {
      update(dt){for(const k in fx){fx[k].t-=dt;if(fx[k].t<=0)delete fx[k]}G.setHud(`👣 ${moves}번`,`목표 ${IC[goal]} ${goal}`,`최고 ${Math.max(...b)}`)},
      draw(c){G.rr(ox-6,oy-6,N*cs+12,N*cs+12,16,'#6B4A3A');
        for(let i=0;i<16;i++){const x=ox+(i&3)*cs,y=oy+(i>>2)*cs,v=b[i],f=fx[i],s=f?(f.k==='n'?1-f.t*3:1+f.t*.6):1;G.rr(x+4,y+4,cs-8,cs-8,12,'#8A6A5A');
          if(v){c.save();c.translate(x+cs/2,y+cs/2);c.scale(s,s);G.rr(-cs/2+4,-cs/2+4,cs-8,cs-8,12,COL[v]||'#BBA9FF','#4E2C14',2);G.emo(IC[v]||'⭐',0,-8,30);G.text(String(v),0,22,16,'#3A1F0C','center',null);c.restore()}}
        G.text(`목표: ${IC[goal]} ${goal} 만들기`,AW/2,420,20);G.text('같은 의견을 모아 큰 의견으로!',AW/2,452,15,'#FFE9A8')},
      swipe:slide,key(k){if(k!=='A')slide(k)}
    }}});

/* ---------- 민주시민 3: 서명 모으기 기차 (스네이크) ---------- */
arcDefine({id:'democracy_snake',ch:'dungeon',name:'서명 모으기 기차',tag:'꼬리 늘리기',from:'스네이크 (뱀 게임)',icon:'✍️',
  how:['확성기📢 기차가 마을을 돌며 주민 서명✍️을 모아요. 모을수록 줄이 길어져요.','밀거나 아래 화살표·방향키로 방향을 바꿔요.','벽이나 내 줄에 부딪히면 하트가 줄어요.'],
  init(G){
    const C=15,R=17,cs=22,ox=15,oy=12, goal=8+Math.round(G.d*14), speed=4.5+6*G.d;
    let walls=new Set();const nW=Math.round(G.d*12);for(let i=0;i<nW;i++){const r=G.ri(2,R-3),c=G.ri(2,C-3);if(Math.abs(r-8)>1||c>9)walls.add(r*C+c)}
    let body,dir,q,food,got=0,hearts=3,acc=0,flash=0;
    const reset=()=>{body=[[8,4],[8,3],[8,2]];dir='R';q=[]};reset();
    const occ=(r,c)=>walls.has(r*C+c)||body.some(b=>b[0]===r&&b[1]===c);
    const place=()=>{let r,c;do{r=G.ri(0,R-1);c=G.ri(0,C-1)}while(occ(r,c));food=[r,c]};place();
    const OPP={L:'R',R:'L',U:'D',D:'U'}, DV={U:[-1,0],D:[1,0],L:[0,-1],R:[0,1]};
    const turn=d=>{const last=q.length?q[q.length-1]:dir;if(d!==last&&d!==OPP[last]&&q.length<3)q.push(d)};
    [['U',150,402],['L',90,462],['D',150,462],['R',210,462]].forEach(([d,x,y])=>G.btn(x,y,56,52,{U:'⬆️',L:'⬅️',D:'⬇️',R:'➡️'}[d],()=>turn(d)));
    return {
      update(dt){flash=Math.max(0,flash-dt);acc+=dt*speed;while(acc>=1&&!G.over){acc--;if(q.length)dir=q.shift();
        const [r,c]=body[0],nr=r+DV[dir][0],nc=c+DV[dir][1];
        if(nr<0||nc<0||nr>=R||nc>=C||occ(nr,nc)){hearts--;G.sfx('hurt');G.shake=6;flash=.8;if(hearts<=0)return G.lose('기차가 너무 많이 부딪혔어요!');reset();return}
        body.unshift([nr,nc]);if(nr===food[0]&&nc===food[1]){got++;G.sfx('coin');G.burst(ox+nc*cs+cs/2,oy+nr*cs+cs/2,'#FFE27A',10);if(got>=goal)return G.win(starsByHearts(hearts));place()}else body.pop()}
        G.setHud(HEARTS(hearts),`✍️ ${got}/${goal}`,`${G.lv}단계`)},
      draw(c){G.rr(ox,oy,C*cs,R*cs,8,'#5F9E58');for(let r=0;r<R;r++)for(let k=0;k<C;k++)if((r+k)%2)G.rr(ox+k*cs,oy+r*cs,cs,cs,0,'rgba(0,0,0,.06)');
        walls.forEach(w=>G.emo('🌳',ox+(w%C)*cs+cs/2,oy+Math.floor(w/C)*cs+cs/2,cs*.95));
        G.emo('✍️',ox+food[1]*cs+cs/2,oy+food[0]*cs+cs/2,cs*.9);
        body.forEach(([r,k],i)=>{if(i===0)return;G.rr(ox+k*cs+2,oy+r*cs+2,cs-4,cs-4,6,i%2?'#FFD36E':'#FF9FB8','#6B3D1F',1.5);G.emo('🙋',ox+k*cs+cs/2,oy+r*cs+cs/2,cs*.6)});
        if(!(flash&&Math.floor(G.t*12)%2))G.emo('📢',ox+body[0][1]*cs+cs/2,oy+body[0][0]*cs+cs/2,cs*1.05)},
      swipe:turn,key(k){if(DV[k])turn(k)}
    }}});
