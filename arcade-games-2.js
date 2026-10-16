/* ===== 섬 도전 놀이 2/3: 인권 · 다문화 · 통일 · 독도 ===== */

/* ---------- 인권 1: 손잡기 연결 (플로우 프리) ---------- */
arcDefine({id:'rights_flow',ch:'rights',name:'손잡기 연결',tag:'선 잇기 퍼즐',from:'플로우 프리 (Flow Free)',icon:'🤝',
  how:['같은 친구 둘을 손가락으로 끌어서 길로 이어 줘요.','길끼리는 서로 겹칠 수 없어요. 다른 길을 지나가면 그 길이 끊겨요.','모든 친구를 잇고, 빈칸 없이 모두 채우면 별 3개!'],
  init(G){
    const n=5+Math.round(G.d*3), k=n-1+(G.d>.5?1:0), cs=320/n, ox=20, oy=40;
    const FACE=['🧒','👧','👦','👵','👴','👩','👨','👶'], COL=['#FF6F8A','#6FB6FF','#FFD24A','#7FD69A','#BBA9FF','#FF9F5A','#5AD8D0','#E58AE0'];
    /* 해밀턴 경로(모든 칸을 한 번씩 지나는 길)를 만들고 k 조각으로 잘라 짝을 정해요 → 늘 풀 수 있어요 */
    let path=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)path.push([r,r%2?n-1-c:c]);
    const adj=(a,b)=>Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])===1;
    for(let it=0;it<n*n*30;it++){if(Math.random()<.5)path.reverse();const h=path[0];const nb=[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[h[0]+a,h[1]+b]).filter(([a,b])=>a>=0&&b>=0&&a<n&&b<n);
      const v=G.pick(nb),i=path.findIndex(p=>p[0]===v[0]&&p[1]===v[1]);if(i<2)continue;path=[...path.slice(0,i).reverse(),...path.slice(i)]}
    const cuts=[];let left=n*n;const lens=[];for(let i=0;i<k;i++){const rem=k-i-1,mx=left-rem*3,L=i===k-1?left:G.ri(3,Math.max(3,Math.min(mx,Math.round(n*n/k*1.6))));lens.push(L);left-=L}
    const ends=[],segs=[];let p0=0;lens.forEach((L,i)=>{ends.push([path[p0],path[p0+L-1]]);segs.push(path.slice(p0,p0+L));p0+=L});
    const own={};ends.forEach(([a,b],i)=>{own[a+'']=i;own[b+'']=i});
    let lines=ends.map(()=>[]),cur=null,t=0;
    const cellAt=(x,y)=>{const c=Math.floor((x-ox)/cs),r=Math.floor((y-oy)/cs);return r>=0&&c>=0&&r<n&&c<n?[r,c]:null};
    const lineOf=cell=>lines.findIndex(L=>L.some(p=>p[0]===cell[0]&&p[1]===cell[1]));
    const done=i=>{const L=lines[i];if(L.length<2)return false;const e=ends[i],a=L[0]+'',b=L[L.length-1]+'';return (a===e[0]+''&&b===e[1]+'')||(a===e[1]+''&&b===e[0]+'')};
    const check=()=>{if(lines.every((_,i)=>done(i))){const filled=lines.reduce((a,L)=>a+L.length,0);G.sfx('ok');G.burst(AW/2,200,'#FFE27A',30);G.win(filled===n*n?3:filled>=n*n*.85?2:1)}};
    return {
      boostText:'친구 한 쌍 자동 연결', boost(){const i=lines.findIndex((_,k)=>!done(k));if(i<0)return;lines.forEach((L,k)=>{if(k!==i)lines[k]=L.filter(p=>!segs[i].some(q=>q+''===p+''))});lines[i]=segs[i].map(p=>[...p]);check()},
      update(dt){t+=dt;const filled=lines.reduce((a,L)=>a+L.length,0);G.setHud(`🤝 ${lines.filter((_,i)=>done(i)).length}/${k}`,`🟩 ${Math.round(filled/(n*n)*100)}%`,`⏱ ${Math.floor(t)}초`)},
      draw(c){G.rr(ox-4,oy-4,n*cs+8,n*cs+8,12,'#1E1430','#6B3D1F',3);
        for(let r=0;r<n;r++)for(let q=0;q<n;q++)G.rr(ox+q*cs+1,oy+r*cs+1,cs-2,cs-2,6,'#2C2244');
        lines.forEach((L,i)=>{if(!L.length)return;L.forEach(p=>G.rr(ox+p[1]*cs+2,oy+p[0]*cs+2,cs-4,cs-4,6,COL[i]+'44'));c.strokeStyle=COL[i];c.lineWidth=cs*.32;c.lineCap='round';c.lineJoin='round';c.beginPath();
          L.forEach((p,j)=>{const x=ox+p[1]*cs+cs/2,y=oy+p[0]*cs+cs/2;j?c.lineTo(x,y):c.moveTo(x,y)});c.stroke()});
        ends.forEach(([a,b],i)=>[a,b].forEach(p=>{G.circle(ox+p[1]*cs+cs/2,oy+p[0]*cs+cs/2,cs*.42,COL[i],done(i)?'#FFF':'#2A1A0E',3);G.emo(FACE[i],ox+p[1]*cs+cs/2,oy+p[0]*cs+cs/2,cs*.55)}));
        G.text('같은 친구끼리 끌어서 이어요',AW/2,400,16,'#FFE9A8');G.text('빈칸 없이 채우면 별 3개!',AW/2,428,14,'#CBB8FF')},
      down(x,y){const cell=cellAt(x,y);if(!cell)return;const o=own[cell+''];
        if(o!=null){lines[o]=[cell];cur=o;G.sfx('tap');return}
        const li=lineOf(cell);if(li>=0){const L=lines[li],j=L.findIndex(p=>p[0]===cell[0]&&p[1]===cell[1]);lines[li]=L.slice(0,j+1);cur=li}},
      move(x,y,dn){if(!dn||cur==null)return;const cell=cellAt(x,y);if(!cell)return;const L=lines[cur],last=L[L.length-1];if(!last||cell+''===last+'')return;
        if(!adj(cell,last))return;
        const j=L.findIndex(p=>p+''===cell+'');if(j>=0){lines[cur]=L.slice(0,j+1);return}
        if(done(cur))return;
        const o=own[cell+''];if(o!=null&&o!==cur)return;
        const li=lineOf(cell);if(li>=0&&li!==cur){const M=lines[li],q=M.findIndex(p=>p+''===cell+'');lines[li]=M.slice(0,q)}
        L.push(cell);if(o===cur){G.sfx('combo');G.burst(ox+cell[1]*cs+cs/2,oy+cell[0]*cs+cs/2,COL[cur],10)}},
      up(){cur=null;check()}
    }}});

/* ---------- 인권 2: 편견의 벽 깨기 (벽돌 깨기) ---------- */
arcDefine({id:'rights_breakout',ch:'dungeon',name:'편견의 벽 깨기',tag:'벽돌 깨기',from:'벽돌 깨기 (알카노이드)',icon:'🧱',
  how:['화면을 좌우로 끌어 손 받침🤝을 움직이고, 톡 누르면 공이 출발해요.','공으로 편견의 벽돌을 모두 깨요! 깨질 때 인권 낱말이 나타나요.','🌈를 받으면 받침이 넓어져요. 공을 놓치면 하트가 줄어요.'],
  init(G){
    const rows=3+Math.round(G.d*3), cols=7, bw=46, bh=22, words=['평등','존중','배려','참여','자유','안전','차별 없이','함께','표현','보호'];
    let bricks=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)bricks.push({x:9+c*(bw+3),y:60+r*(bh+4),hp:Math.random()<G.d*.45?2:1,col:`hsl(${260+r*18},45%,${45+r*4}%)`});
    const total=bricks.length, sp0=270+170*G.d;
    let pw=92-30*G.d,px=AW/2,ball={x:AW/2,y:470,vx:0,vy:0,stuck:true},hearts=3,drops=[],wide=0,keyD=0;
    const launch=()=>{if(ball.stuck){ball.stuck=false;const a=G.rand(-.5,.5);ball.vx=Math.sin(a)*sp0;ball.vy=-Math.cos(a)*sp0;G.sfx('jump')}};
    return {
      update(dt){if(keyD)px=G.clamp(px+keyD*380*dt,pw/2,AW-pw/2);wide=Math.max(0,wide-dt);const W=wide?pw*1.6:pw;
        if(ball.stuck){ball.x=px;ball.y=480}else{const steps=3;for(let s=0;s<steps;s++){ball.x+=ball.vx*dt/steps;ball.y+=ball.vy*dt/steps;
          if(ball.x<8){ball.x=8;ball.vx*=-1}if(ball.x>AW-8){ball.x=AW-8;ball.vx*=-1}if(ball.y<8){ball.y=8;ball.vy*=-1}
          if(ball.vy>0&&ball.y>484&&ball.y<500&&Math.abs(ball.x-px)<W/2+8){const k=(ball.x-px)/(W/2),sp=Math.hypot(ball.vx,ball.vy)*1.01;ball.vx=sp*Math.sin(k*1.05);ball.vy=-sp*Math.cos(k*1.05);G.sfx('tap')}
          for(const b of bricks){if(b.dead)continue;if(ball.x>b.x-6&&ball.x<b.x+bw+6&&ball.y>b.y-6&&ball.y<b.y+bh+6){
            const ox=Math.min(ball.x-(b.x-6),b.x+bw+6-ball.x),oy=Math.min(ball.y-(b.y-6),b.y+bh+6-ball.y);if(ox<oy)ball.vx*=-1;else ball.vy*=-1;
            b.hp--;G.sfx(b.hp?'place':'pop');if(!b.hp){b.dead=1;G.burst(b.x+bw/2,b.y+bh/2,'#FFE27A',8);G.pop(G.pick(words),b.x+bw/2,b.y,'#FFE27A',15);G.addScore(10);if(Math.random()<.12)drops.push({x:b.x+bw/2,y:b.y})}break}}}
          if(ball.y>AH+20){hearts--;G.sfx('hurt');G.shake=5;ball.stuck=true;if(hearts<=0)return G.lose('공을 너무 많이 놓쳤어요!')}}
        for(const d of drops){d.y+=160*dt;if(d.y>480&&d.y<500&&Math.abs(d.x-px)<W/2+10){d.got=1;wide=8;G.sfx('star')}}drops=drops.filter(d=>d.y<AH&&!d.got);
        const left=bricks.filter(b=>!b.dead).length;if(!left){G.burst(AW/2,150,'#FFE27A',30);return G.win(starsByHearts(hearts))}
        G.setHud(HEARTS(hearts),`🧱 ${total-left}/${total}`,ball.stuck?'톡! 출발':`${G.lv}단계`)},
      draw(c){for(const b of bricks){if(b.dead)continue;G.rr(b.x,b.y,bw,bh,5,b.hp>1?'#4A3A5A':b.col,'rgba(0,0,0,.4)');G.emo(b.hp>1?'⛓️':'🚫',b.x+bw/2,b.y+bh/2,15,.8)}
        for(const d of drops)G.emo('🌈',d.x,d.y,26);
        const W=wide?pw*1.6:pw;G.rr(px-W/2,488,W,14,7,'#FFD36E','#6B3D1F',2);G.emo('🤝',px,494,22);G.emo('⚽',ball.x,ball.y,18)},
      down(x){px=G.clamp(x,pw/2,AW-pw/2)},move(x){px=G.clamp(x,pw/2,AW-pw/2)},tap(){launch()},
      key(k){if(k==='L')keyD=-1;if(k==='R')keyD=1;if(k==='A'||k==='U')launch()},keyup(k){if(k==='L'||k==='R')keyD=0}
    }}});

/* ---------- 인권 3: 권리 타일 3매치 (양갈갈 · 타일 매치) ---------- */
arcDefine({id:'rights_triple',ch:'rights',name:'권리 타일 모으기',tag:'타일 3개 모으기',from:'양 떼 게임 (Sheep a Sheep) · 타일 매치',icon:'⚖️',
  how:['위에 덮이지 않은 밝은 타일을 눌러 아래 칸으로 보내요.','같은 권리 그림 3개가 모이면 사라져요! (📚교육 🏥건강 🍚먹을 권리 🏠집 🗣️표현 ⚖️공정 🎨문화 ⚽놀이 🛡️보호)','아래 칸 7개가 꽉 차면 실패! ↶ 되돌리기는 한 번만, 쓰지 않으면 별 3개.'],
  init(G){
    const ICONS=['📚','🏥','🍚','🏠','🗣️','⚖️','🎨','⚽','🛡️','🎓'], types=5+Math.round(G.d*4), sets=G.d>.5?2:1, layers=2+Math.round(G.d*2), TS=46;
    const total=types*3*sets;let tiles=[];
    /* 자리 먼저 놓고 → 위에서부터 걷어 내는 순서를 정해 그 순서대로 3개씩 같은 그림을 줘요 → 늘 풀 수 있어요 */
    for(let i=0;i<total;i++){let x,y,L,tries=0;do{L=G.ri(0,layers-1);x=30+G.ri(0,12)*23+(L%2)*11;y=40+G.ri(0,13)*23+(L%2)*11;tries++}while(tries<40&&tiles.some(t=>t.L===L&&Math.abs(t.x-x)<TS&&Math.abs(t.y-y)<TS));tiles.push({x,y,L,id:i})}
    const covered=(t,list)=>list.some(o=>o!==t&&o.L>t.L&&Math.abs(o.x-t.x)<TS-2&&Math.abs(o.y-t.y)<TS-2);
    let rest=[...tiles],order=[];while(rest.length){const free=rest.filter(t=>!covered(t,rest));const p=G.pick(free);order.push(p);rest=rest.filter(t=>t!==p)}
    const gt=G.shuffle([...Array(types*sets)].map((_,i)=>ICONS[i%types]));order.forEach((t,i)=>t.e=gt[Math.floor(i/3)]);
    let board=[...tiles],tray=[],undo=1,used=0,time=130-40*G.d,last=null;
    return {
      update(dt){time-=dt;if(time<=0)return G.lose('시간이 다 됐어요!');G.setHud(TIME(time),`🧩 남은 ${board.length}`,undo?'↶ 1번':'↶ 다 씀')},
      draw(c){const sorted=[...board].sort((a,b)=>a.L-b.L);
        for(const t of sorted){const cv=covered(t,board);G.rr(t.x-TS/2+2,t.y-TS/2+4,TS,TS,10,'rgba(0,0,0,.35)');G.rr(t.x-TS/2,t.y-TS/2,TS,TS,10,cv?'#8C8296':'#FFF8E6','#6B3D1F',2);G.emo(t.e,t.x,t.y,30,cv?.45:1)}
        G.rr(8,430,344,62,14,'#4E2C14','#D9A441',3);for(let i=0;i<7;i++){G.rr(16+i*48,438,44,46,8,'#2A1A0E');if(tray[i])G.emo(tray[i].e,38+i*48,461,30)}
        G.rr(130,500,100,34,10,undo?'#8A552B':'#5A4A5C','#4E2C14',2);G.text('↶ 되돌리기',180,517,15)},
      tap(x,y){if(y>496&&x>130&&x<230){if(undo&&last){undo=0;used++;tray.splice(tray.indexOf(last),1);board.push(last);last=null;G.sfx('whoosh')}return}
        const cand=board.filter(t=>Math.abs(x-t.x)<TS/2&&Math.abs(y-t.y)<TS/2&&!covered(t,board)).sort((a,b)=>b.L-a.L)[0];if(!cand)return;
        board=board.filter(t=>t!==cand);const at=tray.map(t=>t.e).lastIndexOf(cand.e);tray.splice(at>=0?at+1:tray.length,0,cand);last=cand;G.sfx('tap');
        const same=tray.filter(t=>t.e===cand.e);if(same.length>=3){tray=tray.filter(t=>t.e!==cand.e);last=null;G.sfx('clear');try{sfx.clear(2)}catch(e){}G.burst(AW/2,460,'#FFE27A',16);G.addScore(30)}
        if(!board.length&&!tray.length)return G.win(used?2:3);
        if(tray.length>=7)G.lose('아래 칸이 꽉 찼어요! 같은 그림이 3개 될 것부터 골라 봐요.')}
    }}});

/* ---------- 다문화 1: 세계 악기 따라 하기 (사이먼) ---------- */
arcDefine({id:'multi_simon',ch:'dungeon',name:'세계 악기 따라 하기',tag:'소리 기억',from:'사이먼 (Simon) 기억 게임',icon:'🥁',
  how:['세계 여러 나라의 악기가 차례로 반짝이며 소리를 내요.','같은 순서대로 악기를 눌러 따라 연주해요. 한 번 성공할 때마다 하나씩 길어져요!','틀리면 하트가 줄고 같은 순서를 다시 들려줘요.'],
  init(G){
    const ALL=[['🥁','장구','한국',262],['🎻','바이올린','이탈리아',330],['🎸','기타','스페인',392],['🎹','피아노','독일',440],['🎺','트럼펫','미국',523],['🎷','색소폰','벨기에',587]];
    const P=ALL.slice(0,G.d<.5?4:6), goal=4+Math.round(G.d*6), gap=.62-.3*G.d, cols=P.length===4?2:3, pw=(AW-30)/cols-10, ph=P.length===4?170:150;
    P.forEach((p,i)=>{p.x=20+(i%cols)*(pw+10);p.y=70+Math.floor(i/cols)*(ph+12)});
    let seq=[G.ri(0,P.length-1)],show=0,idx=0,t=1,lit=-1,litT=0,hearts=3,mode='show';
    const play=i=>{lit=i;litT=.32;try{tone(P[i][3],.35,'triangle',.09);tone(P[i][3]*2,.25,'sine',.03)}catch(e){}};
    return {
      update(dt){litT-=dt;if(litT<=0)lit=-1;
        if(mode==='show'){t-=dt;if(t<=0){if(show<seq.length){play(seq[show]);show++;t=gap}else{mode='input';idx=0}}}
        G.setHud(HEARTS(hearts),`🎵 ${seq.length-1}/${goal}`,mode==='show'?'👂 잘 들어요':'👆 따라 해요')},
      draw(c){P.forEach((p,i)=>{const on=lit===i;G.rr(p.x,p.y,pw,ph,20,on?'#FFF3B0':'#3A2A4C',on?'#FFE27A':'#8A5B1C',on?5:3);if(on)G.burst&&0;
          G.emo(p[0],p.x+pw/2,p.y+ph/2-14,on?66:56);G.text(`${p[1]} (${p[2]})`,p.x+pw/2,p.y+ph-22,15,on?'#4A240E':'#FFE9A8','center',on?null:'#2A1A0E')})},
      tap(x,y){if(mode!=='input'||G.over)return;const i=P.findIndex(p=>x>p.x&&x<p.x+pw&&y>p.y&&y<p.y+ph);if(i<0)return;play(i);
        if(i!==seq[idx]){hearts--;G.sfx('no');G.shake=5;mode='show';show=0;t=1.1;if(hearts<=0)G.lose('순서를 너무 많이 틀렸어요!');return}
        idx++;if(idx>=seq.length){G.burst(AW/2,250,'#FFE27A',12);if(seq.length>=goal+1||seq.length>goal){return G.win(starsByHearts(hearts))}
          seq.push(G.ri(0,P.length-1));if(seq.length>goal){return G.win(starsByHearts(hearts))}mode='show';show=0;t=.9;G.pop('잘했어요!',AW/2,40)}}
    }}});

/* ---------- 다문화 2: 세계 음식 썰기 (과일 닌자) ---------- */
arcDefine({id:'multi_slice',ch:'multi',name:'세계 요리 썰기',tag:'스와이프 썰기',from:'과일 닌자 (Fruit Ninja)',icon:'🍣',
  how:['튀어 오르는 세계 요리를 손가락으로 쓱 그어 썰어요!','폭탄💣은 피해요. 요리를 바닥에 떨어뜨려도 하트가 줄어요.','썰면 어느 나라 요리인지 알려 줘요.'],
  init(G){
    const FOOD=[['🍣','스시','일본'],['🌮','타코','멕시코'],['🥐','크루아상','프랑스'],['🍜','쌀국수','베트남'],['🥟','만두','중국'],['🍕','피자','이탈리아'],['🥙','케밥','튀르키예'],['🍛','카레','인도'],['🥨','프레첼','독일'],['🍙','주먹밥','일본'],['🥘','파에야','스페인'],['🍚','비빔밥','한국']];
    const goal=15+Math.round(G.d*20); let objs=[],halves=[],trail=[],t=.5,got=0,hearts=3;
    const spawn=()=>{const n=G.d>.5&&Math.random()<.4?2:1;for(let i=0;i<n;i++){const bomb=Math.random()<.1+.13*G.d;const x=G.rand(60,AW-60);
      objs.push({x,y:AH+30,vx:(AW/2-x)*G.rand(.2,.6),vy:-G.rand(560,720),r:G.rand(-3,3),bomb,f:bomb?null:G.pick(FOOD)})}};
    const segHit=(o,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy||1;let k=((o.x-a.x)*dx+(o.y-a.y)*dy)/L;k=Math.max(0,Math.min(1,k));return Math.hypot(a.x+dx*k-o.x,a.y+dy*k-o.y)<30};
    return {
      update(dt){t-=dt;if(t<=0){spawn();t=G.rand(.7,1.1)*(1-.45*G.d)}
        for(const o of objs){o.vy+=600*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;if(o.y>AH+50&&o.vy>0&&!o.gone){o.gone=1;if(!o.bomb){hearts--;G.sfx('no');if(hearts<=0)return G.lose('요리를 너무 많이 떨어뜨렸어요!')}}}
        objs=objs.filter(o=>!o.gone&&!o.cut);for(const h of halves){h.vy+=700*dt;h.x+=h.vx*dt;h.y+=h.vy*dt;h.a+=h.va*dt}halves=halves.filter(h=>h.y<AH+60);
        trail=trail.filter(p=>G.t-p.t<.15);G.setHud(HEARTS(hearts),`🔪 ${got}/${goal}`,`${G.lv}단계`)},
      draw(c){G.rr(0,AH-70,AW,70,0,'#6B4A3A');for(const o of objs)G.emo(o.bomb?'💣':o.f[0],o.x,o.y,48,1,o.r*G.t*.3);
        for(const h of halves){c.save();c.beginPath();c.rect(h.x+(h.s<0?-40:0),h.y-40,40,80);c.clip();G.emo(h.e,h.x,h.y,48,1,h.a);c.restore()}
        if(trail.length>1){c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=6;c.lineCap='round';c.beginPath();trail.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke()}},
      down(x,y){trail=[{x,y,t:G.t}]},
      move(x,y,dn){if(!dn)return;const p={x,y,t:G.t},a=trail[trail.length-1]||p;trail.push(p);
        for(const o of objs){if(o.cut||!segHit(o,a,p))continue;o.cut=1;
          if(o.bomb){hearts--;G.sfx('hurt');G.shake=8;G.burst(o.x,o.y,'#FF6A5A',20);if(hearts<=0)return G.lose('폭탄을 너무 많이 건드렸어요!');continue}
          got++;G.sfx('whoosh');G.burst(o.x,o.y,'#FFE27A',10);G.pop(`${o.f[1]} (${o.f[2]})`,o.x,o.y-30,'#FFE27A',15);halves.push({x:o.x,y:o.y,vx:-60,vy:-100,a:0,va:-3,e:o.f[0],s:-1},{x:o.x,y:o.y,vx:60,vy:-100,a:0,va:3,e:o.f[0],s:1});
          if(got>=goal)return G.win(starsByHearts(hearts))}},
      up(){trail=[]}
    }}});

/* ---------- 다문화 3: 세계 과일 정리 (볼 소트 퍼즐) ---------- */
arcDefine({id:'multi_sort',ch:'multi',name:'세계 과일 정리',tag:'정렬 퍼즐',from:'볼 소트 · 워터 소트 퍼즐',icon:'🍊',
  how:['병을 눌러 맨 위 과일을 들고, 다른 병을 눌러 옮겨요.','같은 과일 위나 빈 병에만 놓을 수 있어요. 한 병에 4개까지!','병마다 한 가지 과일만 모이면 성공! 적게 옮길수록 별이 많아요.'],
  init(G){
    const FR=['🍎','🍐','🍋','🥝','🍇','🍊','🍑'], k=Math.min(7,3+Math.round(G.d*5)), CAP=4; let nT=k+(G.d>.7?1:2);
    let tubes,sol;
    const solved=ts=>ts.every(t=>!t.length||(t.length===CAP&&t.every(x=>x===t[0])));
    const solve=ts=>{const seen=new Set();let nodes=0;const dfs=(s,depth)=>{if(solved(s))return depth;if(++nodes>40000||depth>120)return null;const key=s.map(t=>t.join('')).sort().join('|');if(seen.has(key))return null;seen.add(key);
        for(let a=0;a<s.length;a++){if(!s[a].length)continue;const top=s[a][s[a].length-1];if(s[a].length===CAP&&s[a].every(x=>x===top))continue;
          for(let b=0;b<s.length;b++){if(a===b||s[b].length>=CAP)continue;if(s[b].length&&s[b][s[b].length-1]!==top)continue;if(!s[b].length&&s[a].every(x=>x===top))continue;
            const n=s.map(t=>t.slice());n[b].push(n[a].pop());const r=dfs(n,depth+1);if(r!=null)return r}}return null};return dfs(ts,0)};
    for(let pass=0;pass<2&&sol==null;pass++){if(pass)nT=k+2;for(let t=0;t<40;t++){const balls=G.shuffle([...Array(k*CAP)].map((_,i)=>i%k));tubes=[...Array(nT)].map((_,i)=>i<k?balls.slice(i*CAP,i*CAP+CAP):[]);
      if(solved(tubes))continue;sol=solve(tubes);if(sol!=null)break}
    }
    if(sol==null)sol=k*4;
    const S0=tubes.map(t=>t.slice());let sel=-1,moves=0,hist=[];
    const perRow=nT>6?Math.ceil(nT/2):nT, tw=Math.min(56,(AW-20)/perRow-8), th=CAP*44+20;
    const pos=i=>{const row=nT>6&&i>=perRow?1:0,j=row?i-perRow:i,cnt=row?nT-perRow:perRow,x=AW/2-(cnt*(tw+10))/2+j*(tw+10);return {x,y:row?250:40}};
    G.btn(40,470,120,50,'↶ 되돌리기',()=>{const h=hist.pop();if(h){tubes=h;moves--;sel=-1}},{fs:16});
    G.btn(200,470,120,50,'🔄 처음부터',()=>{tubes=S0.map(t=>t.slice());hist=[];moves=0;sel=-1},{fs:16,col:'#7A4A5A'});
    return {
      update(){G.setHud(`👆 ${moves}번`,`기준 ${sol}번`,`🍊 ${k}가지`)},
      draw(c){tubes.forEach((t,i)=>{const p=pos(i);G.rr(p.x,p.y,tw,th-(nT>6?36:0),tw/2,'rgba(255,255,255,.12)',sel===i?'#FFE27A':'#C9B6E0',3);
          const h=nT>6?37:44;t.forEach((b,j)=>{const lift=sel===i&&j===t.length-1?-26:0;G.emo(FR[b],p.x+tw/2,p.y+(th-(nT>6?36:0))-24-j*h+lift,Math.min(tw*.8,38))})})},
      tap(x,y){const i=tubes.findIndex((t,i)=>{const p=pos(i);return x>p.x-4&&x<p.x+tw+4&&y>p.y-30&&y<p.y+th});if(i<0){sel=-1;return}
        if(sel<0){if(tubes[i].length){sel=i;G.sfx('tap')}return}
        if(sel===i){sel=-1;return}
        const a=tubes[sel],b=tubes[i],top=a[a.length-1];if(b.length>=CAP||(b.length&&b[b.length-1]!==top)){G.sfx('no');sel=-1;return}
        hist.push(tubes.map(t=>t.slice()));b.push(a.pop());moves++;sel=-1;G.sfx('place');
        if(b.length===CAP&&b.every(x=>x===b[0])){G.sfx('ok');const p=pos(i);G.burst(p.x+tw/2,p.y+40,'#FFE27A',12)}
        if(solved(tubes))G.win(moves<=sol?3:moves<=Math.ceil(sol*1.6)?2:1)}
    }}});

/* ---------- 통일 1: 남북 철길 잇기 (파이프 퍼즐) ---------- */
arcDefine({id:'unify_pipe',ch:'dungeon',name:'남북 철길 잇기',tag:'길 돌려 잇기',from:'파이프 매니아 · 철길 퍼즐',icon:'🚆',
  how:['철길 칸을 누르면 오른쪽으로 90도씩 돌아가요.','왼쪽 아래 🚉남쪽 역에서 오른쪽 🚉북쪽 역까지 철길을 이어요.','이어지면 기차🚆가 달려요! 적게 돌릴수록 별이 많아요.'],
  init(G){
    const n=G.d<.35?5:G.d<.7?6:7, cs=320/n, ox=20, oy=60, DR=[[-1,0],[0,1],[1,0],[0,-1]];
    const rot=m=>((m<<1)|(m>>3))&15;
    let mask,path,sr,er,minRot=0,taps=0,time=95-35*G.d,train=null;
    for(let t=0;t<300;t++){sr=G.ri(Math.floor(n/2),n-1);er=G.ri(0,Math.floor(n/2));const seen=new Set([sr+','+0]);path=[[sr,0]];
      const dfs=()=>{const [r,c]=path[path.length-1];if(r===er&&c===n-1)return true;if(path.length>n*n*.7)return false;
        for(const [a,b] of G.shuffle(DR)){const R=r+a,C=c+b;if(R<0||C<0||R>=n||C>=n||seen.has(R+','+C))continue;seen.add(R+','+C);path.push([R,C]);if(dfs())return true;path.pop();seen.delete(R+','+C)}return false};
      if(dfs()&&path.length>=n+1)break}
    mask=[...Array(n)].map(()=>Array(n).fill(0));const need=[...Array(n)].map(()=>Array(n).fill(0));
    const dirTo=(a,b)=>DR.findIndex(([x,y])=>a[0]+x===b[0]&&a[1]+y===b[1]);
    path.forEach((p,i)=>{let m=0;const prev=i?path[i-1]:[p[0],-1],next=i<path.length-1?path[i+1]:[p[0],n];m|=1<<dirTo(p,prev);m|=1<<dirTo(p,next);need[p[0]][p[1]]=m});
    const TYPES=[5,3,G.d>.5?7:6];
    for(let r=0;r<n;r++)for(let c=0;c<n;c++){let m=need[r][c]||G.pick(TYPES);const k=G.ri(0,3);for(let j=0;j<k;j++)m=rot(m);mask[r][c]=m;
      if(need[r][c]){let mm=m,j=0;while(mm!==need[r][c]&&j<4){mm=rot(mm);j++}minRot+=j}}
    const flow=()=>{const seen=new Set(),q=[[sr,0]];if(!(mask[sr][0]&8))return null;seen.add(sr+',0');const prev={};
      while(q.length){const [r,c]=q.shift();if(r===er&&c===n-1&&(mask[r][c]&2)){const out=[[r,c]];let k=r+','+c;while(prev[k]){out.unshift(prev[k]);k=prev[k][0]+','+prev[k][1]}return out}
        for(let d=0;d<4;d++){if(!(mask[r][c]&(1<<d)))continue;const R=r+DR[d][0],C=c+DR[d][1];if(R<0||C<0||R>=n||C>=n)continue;if(!(mask[R][C]&(1<<((d+2)%4))))continue;const k=R+','+C;if(seen.has(k))continue;seen.add(k);prev[k]=[r,c];q.push([R,C])}}return null};
    /* 처음부터 이어져 있으면 그냥 통과되던 문제: 길 한 칸을 돌려 놓아요 */
    for(let g=0;g<8&&flow();g++){const p=G.pick(path);mask[p[0]][p[1]]=rot(mask[p[0]][p[1]]);minRot++}
    const ang={};
    return {
      update(dt){for(const k in ang){ang[k]=Math.max(0,ang[k]-dt*12)}
        if(train){train.t+=dt*4;if(train.t>=train.p.length+1){G.burst(AW-20,oy+er*cs+cs/2,'#FFE27A',30);return G.win(taps<=minRot+2?3:taps<=Math.ceil(minRot*1.6)+6?2:1)}}
        else{time-=dt;if(time<=0)return G.lose('시간이 다 됐어요!')}
        G.setHud(TIME(time),`🔄 ${taps}번`,`최소 ${minRot}번`)},
      draw(c){G.rr(ox-6,oy-6,n*cs+12,n*cs+12,10,'#5E7A4A');
        G.emo('🚉',ox-2,oy+sr*cs+cs/2,24);G.emo('🚉',ox+n*cs+2,oy+er*cs+cs/2,24);G.text('남',ox+4,oy+sr*cs+cs/2+22,12);G.text('북',ox+n*cs-4,oy+er*cs+cs/2-22,12);
        for(let r=0;r<n;r++)for(let k=0;k<n;k++){const x=ox+k*cs+cs/2,y=oy+r*cs+cs/2,m=mask[r][k];G.rr(x-cs/2+1,y-cs/2+1,cs-2,cs-2,6,'#8FB27A');
          c.save();c.translate(x,y);c.rotate(-(ang[r+','+k]||0)*Math.PI/2/1);
          for(let d=0;d<4;d++)if(m&(1<<d)){c.save();c.rotate(d*Math.PI/2);for(let s=0;s<3;s++)G.rr(-cs*.28,-cs*.12-s*cs*.14,cs*.56,cs*.06,2,'#7A4A2A');
            c.strokeStyle='#C8C8D4';c.lineWidth=3;c.beginPath();c.moveTo(-cs*.16,0);c.lineTo(-cs*.16,-cs/2);c.moveTo(cs*.16,0);c.lineTo(cs*.16,-cs/2);c.stroke();c.restore()}
          G.circle(0,0,cs*.18,'#7A4A2A');c.restore()}
        if(train){const i=Math.min(train.p.length-1,Math.floor(train.t)),p=train.p[i];emoFlip(G,'🚆',ox+p[1]*cs+cs/2,oy+p[0]*cs+cs/2,cs*.7)}
        G.text('눌러서 돌려요 · 남에서 북까지!',AW/2,oy+n*cs+30,16,'#FFE9A8')},
      tap(x,y){if(train)return;const c=Math.floor((x-ox)/cs),r=Math.floor((y-oy)/cs);if(r<0||c<0||r>=n||c>=n)return;mask[r][c]=rot(mask[r][c]);ang[r+','+c]=1;taps++;G.sfx('tap');
        const f=flow();if(f){G.sfx('ok');train={p:f,t:0}}}
    }}});

/* ---------- 통일 2: 평화 탁구 (퐁) ---------- */
arcDefine({id:'unify_pong',ch:'dungeon',name:'평화 탁구',tag:'탁구 대결',from:'퐁 (Pong, 1972)',icon:'🏓',
  how:['1991년 남과 북은 "코리아" 단일팀으로 세계 탁구 대회에서 함께 우승했어요!','화면을 좌우로 끌어 아래 라켓을 움직여 공을 받아쳐요.','연습 상대 로봇🤖보다 먼저 목표 점수를 내면 성공!'],
  init(G){
    const goal=3+Math.round(G.d*2), ai=170+250*G.d, sp0=260+150*G.d; let px=AW/2,ax=AW/2,me=0,bot=0,ball,serve=1,keyD=0;
    const PW=84-14*G.d;
    const reset=dir=>{ball={x:AW/2,y:AH/2,vx:G.rand(-120,120),vy:dir*sp0,wait:.8}};reset(1);
    return {
      update(dt){if(keyD)px=G.clamp(px+keyD*400*dt,PW/2,AW-PW/2);
        const tx=ball.vy<0?ball.x+G.rand(-20,20):AW/2;ax+=G.clamp(tx-ax,-ai*dt,ai*dt);
        if(ball.wait>0){ball.wait-=dt}else{ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
          if(ball.x<10||ball.x>AW-10){ball.vx*=-1;ball.x=G.clamp(ball.x,10,AW-10);G.sfx('tap')}
          if(ball.vy>0&&ball.y>478&&ball.y<498&&Math.abs(ball.x-px)<PW/2+8){const k=(ball.x-px)/(PW/2);ball.vy=-Math.abs(ball.vy)*1.04;ball.vx=k*260;G.sfx('pop');G.burst(ball.x,485,'#FFE27A',6)}
          if(ball.vy<0&&ball.y<62&&ball.y>42&&Math.abs(ball.x-ax)<PW/2+8){const k=(ball.x-ax)/(PW/2);ball.vy=Math.abs(ball.vy)*1.04;ball.vx=k*240;G.sfx('pop')}
          if(ball.y<-10){me++;G.sfx('star');G.pop('득점!',AW/2,200);if(me>=goal)return G.win(bot===0?3:bot===1?2:1);reset(-1)}
          if(ball.y>AH+10){bot++;G.sfx('no');G.shake=4;if(bot>=3)return G.lose('로봇이 먼저 3점을 냈어요! 다시 연습해요.');reset(1)}}
        G.setHud(`🧒 ${me} : ${bot} 🤖`,`목표 ${goal}점`,`🤖 3점이면 끝`)},
      draw(c){G.rr(14,20,AW-28,AH-40,10,'#2E7D4F','#FFF',4);c.strokeStyle='rgba(255,255,255,.85)';c.lineWidth=3;c.beginPath();c.moveTo(14,AH/2);c.lineTo(AW-14,AH/2);c.moveTo(AW/2,20);c.lineTo(AW/2,AH-20);c.stroke();
        G.rr(ax-PW/2-2,42,PW+4,16,8,'#FF5A5A','#2A0A0A',3);G.emo('🤖',ax,24,26);G.rr(px-PW/2-2,482,PW+4,16,8,'#FFD24A','#2A1A0A',3);G.emo('🧒',px,516,26);
        G.circle(ball.x,ball.y,9,'#FFFFFF','#FF8A1A',3);
        G.text('KOREA',AW/2,AH/2-16,16,'rgba(255,255,255,.5)','center',null)},
      down(x){px=G.clamp(x,PW/2,AW-PW/2)},move(x){px=G.clamp(x,PW/2,AW-PW/2)},
      key(k){if(k==='L')keyD=-1;if(k==='R')keyD=1},keyup(k){if(k==='L'||k==='R')keyD=0}
    }}});

/* ---------- 통일 3: 평화 그림 맞추기 (네모로직 · 노노그램) ---------- */
arcDefine({id:'unify_nono',ch:'dungeon',name:'평화 그림 로직',tag:'숫자 그림 퍼즐',from:'네모네모 로직 (노노그램)',icon:'🕊️',
  how:['줄 옆의 숫자는 그 줄에 연달아 칠할 칸의 개수예요. (2 1 → 두 칸, 띄우고, 한 칸)','칸을 눌러(끌어서) 칠해요. ✖ 단추를 켜면 빈칸 표시를 할 수 있어요.','숫자가 모두 맞으면 숨은 평화 그림이 나타나요!'],
  init(G){
    const PIC=[['하트',['01010','11111','11111','01110','00100']],['집',['00100','01110','11111','01110','01010']],['별',['00100','11111','01110','01010','10001']],['나무',['00100','01110','11111','00100','00100']],
      ['무궁화',['0010100','0111110','1110111','1101011','1110111','0111110','0010100']],['기차',['1111110','1010010','1111111','1111111','0100100','0000000','1111111']],['한반도',['0011000','0011100','0111100','0111000','0011100','0011100','0110000']],
      ['평화 비둘기',['00000110','00001111','01111110','11111100','01111100','00111000','00010000','00110000']],['다리',['00000000','11111111','10000001','10100101','11111111','10000001','10000001','00000000']],['웃는 얼굴',['00111100','01000010','10100101','10000001','10100101','10011001','01000010','00111100']]];
    const [name,rowsS]=PIC[(G.lv-1)%10], n=rowsS.length, sol=rowsS.map(r=>[...r].map(Number));
    const runs=a=>{const o=[];let k=0;a.forEach(v=>{if(v)k++;else if(k){o.push(k);k=0}});if(k)o.push(k);return o.length?o:[0]};
    const rc=sol.map(runs), cc=sol[0].map((_,c)=>runs(sol.map(r=>r[c])));
    const cw=Math.max(...rc.map(r=>r.length))*15+14, chh=Math.max(...cc.map(c=>c.length))*16+8, cs=Math.min((AW-cw-16)/n,(380-chh)/n), ox=cw+8, oy=chh+14;
    let g=[...Array(n)].map(()=>Array(n).fill(0)),xMode=false,paint=null,t=0,done=false;
    const btn=G.btn(AW/2-70,470,140,50,'✖ 표시: 꺼짐',()=>{xMode=!xMode;btn.label=xMode?'✖ 표시: 켜짐':'✖ 표시: 꺼짐';btn.on=xMode},{fs:16});
    const ok=()=>g.every((r,i)=>runs(r.map(v=>v===1?1:0)).join()===rc[i].join())&&g[0].every((_,c)=>runs(g.map(r=>r[c]===1?1:0)).join()===cc[c].join());
    const cell=(x,y)=>{const c=Math.floor((x-ox)/cs),r=Math.floor((y-oy)/cs);return r>=0&&c>=0&&r<n&&c<n?[r,c]:null};
    const apply=p=>{if(!p||done)return;const [r,c]=p;if(g[r][c]===paint)return;g[r][c]=paint;G.sfx('tap');if(ok()){done=true;G.sfx('ok');G.burst(AW/2,200,'#FFE27A',30);G.pop(`“${name}” 완성!`,AW/2,oy+n*cs/2,'#FFE27A',24);setTimeout(()=>G.win(t<=n*n*1.3?3:t<=n*n*2.6?2:1),900)}};
    return {
      update(dt){if(!done)t+=dt;G.setHud(`⏱ ${Math.floor(t)}초`,`🧩 ${n}×${n}`,`${G.lv}단계`)},
      draw(c){rc.forEach((r,i)=>{const ok=runs(g[i].map(v=>v===1?1:0)).join()===r.join();r.forEach((v,j)=>{const x=ox-12-(r.length-1-j)*15,y=oy+i*cs+cs/2;G.rr(x-7,y-8,14,16,4,ok?'#2F6B4A':'#3A2A4C');G.text(String(v),x,y+1,12,ok?'#BFF0C8':'#FFF3D6','center',null)})});
        cc.forEach((col,i)=>{const ok=runs(g.map(r=>r[i]===1?1:0)).join()===col.join();col.forEach((v,j)=>{const x=ox+i*cs+cs/2,y=oy-10-(col.length-1-j)*16;G.rr(x-7,y-8,14,16,4,ok?'#2F6B4A':'#3A2A4C');G.text(String(v),x,y+1,12,ok?'#BFF0C8':'#FFF3D6','center',null)})});
        for(let r=0;r<n;r++)for(let k=0;k<n;k++){const x=ox+k*cs,y=oy+r*cs,v=g[r][k];G.rr(x+1,y+1,cs-2,cs-2,3,v===1?(done?CH_TINT():'#3A2A4C'):'#FFF8E6');if(v===2)G.text('✖',x+cs/2,y+cs/2,cs*.5,'#C08080','center',null)}
        c.strokeStyle='#6B3D1F';c.lineWidth=2;for(let i=0;i<=n;i+=n>5?(n%2?7:4):5){c.beginPath();c.moveTo(ox+i*cs,oy);c.lineTo(ox+i*cs,oy+n*cs);c.moveTo(ox,oy+i*cs);c.lineTo(ox+n*cs,oy+i*cs);c.stroke()}
        if(done)G.text(`🕊 ${name}`,AW/2,oy+n*cs+24,20,'#FFE27A')},
      down(x,y){const p=cell(x,y);if(!p)return;const v=g[p[0]][p[1]];paint=xMode?(v===2?0:2):(v===1?0:1);apply(p)},
      move(x,y,dn){if(dn&&paint!=null)apply(cell(x,y))},up(){paint=null}
    };
    function CH_TINT(){return G.ch.tint}
  }});

/* ---------- 독도 1: 괭이갈매기 날기 (플래피 버드) ---------- */
arcDefine({id:'dokdo_flappy',ch:'dungeon',name:'괭이갈매기 날기',tag:'날갯짓 아케이드',from:'플래피 버드 (Flappy Bird)',icon:'🐦',
  how:['독도에 사는 괭이갈매기가 되어 날아요! 화면을 톡톡 누르면 날갯짓.','바위 기둥 사이 틈으로 빠져나가요. 🐟를 먹으면 점수!','부딪히면 하트가 줄어요. 목표 개수만큼 기둥을 지나면 성공.'],
  init(G){
    const gap=172-55*G.d, spc=215-40*G.d, sp=130+80*G.d, goal=6+Math.round(G.d*14);
    let b={y:250,vy:0},pipes=[],x0=AW+40,passed=0,hearts=3,inv=0,started=false,bgx=0;
    const mk=x=>pipes.push({x,g:G.rand(110,AH-140-gap),fish:Math.random()<.4});
    for(let i=0;i<3;i++)mk(x0+i*spc);
    return {
      update(dt){bgx+=sp*dt*.3;if(!started){b.y=250+Math.sin(G.t*4)*8;G.setHud(HEARTS(hearts),`🪨 ${passed}/${goal}`,'톡! 시작');return}
        b.vy+=1250*dt;b.y+=b.vy*dt;inv=Math.max(0,inv-dt);
        for(const p of pipes){p.x-=sp*dt;if(!p.pass&&p.x+30<90){p.pass=1;passed++;G.sfx('coin');if(passed>=goal)return G.win(starsByHearts(hearts))}
          if(p.fish&&Math.abs(p.x+30-90)<24&&Math.abs(p.g+gap/2-b.y)<26){p.fish=false;G.addScore(10,90,b.y-30);G.sfx('star')}
          if(!inv&&90+14>p.x&&90-14<p.x+60&&(b.y-14<p.g||b.y+14>p.g+gap)){hearts--;inv=1.5;G.sfx('hurt');G.shake=6;b.vy=-200;if(hearts<=0)return G.lose('바위에 너무 많이 부딪혔어요!')}}
        if(b.y>AH-40||b.y<0){if(!inv){hearts--;inv=1.5;G.sfx('hurt');if(hearts<=0)return G.lose('바다에 너무 많이 빠졌어요!')}b.y=G.clamp(b.y,20,AH-60);b.vy=-300}
        if(pipes[0].x<-70){pipes.shift();mk(pipes[pipes.length-1].x+spc)}
        G.setHud(HEARTS(hearts),`🪨 ${passed}/${goal}`,`${G.lv}단계`)},
      draw(c){c.fillStyle=G.grad(0,AH,'#7FC8F0','#E6F6FF');c.fillRect(0,0,AW,AH);
        c.fillStyle='#5A7A8A';const dx=-(bgx%500);[0,500].forEach(o=>{c.beginPath();c.moveTo(dx+o+60,AH-60);c.lineTo(dx+o+110,AH-150);c.lineTo(dx+o+150,AH-60);c.moveTo(dx+o+170,AH-60);c.lineTo(dx+o+230,AH-180);c.lineTo(dx+o+280,AH-60);c.fill()});
        G.rr(0,AH-60,AW,60,0,'#2E7AB0');
        for(const p of pipes){G.rr(p.x,-10,60,p.g+10,10,'#7A6A5A','#3A2E24',3);G.rr(p.x,p.g+gap,60,AH,10,'#7A6A5A','#3A2E24',3);if(p.fish)G.emo('🐟',p.x+30,p.g+gap/2,24)}
        if(!(inv&&Math.floor(G.t*12)%2))emoFlip(G,'🐦',90,b.y,36);
        if(!started)G.text('톡! 눌러서 날아요',AW/2,330,22)},
      down(){started=true;b.vy=-390;G.sfx('jump')},key(k){if(k==='U'||k==='A')this.down()}
    }}});

/* ---------- 독도 2: 독도 바다 낚시 (낚시 게임) ---------- */
arcDefine({id:'dokdo_fish',ch:'dokdo',name:'독도 바다 낚시',tag:'타이밍 낚시',from:'낚시 게임 · 피싱 미니게임',icon:'🎣',
  how:['배를 좌우로 끌어 옮기고, 톡 누르면 낚싯줄이 내려가요.','주문서에 적힌 독도 바다 생물을 모두 낚으면 성공!','해파리🪼에 쏘이면 하트가 줄어요. 빨리 끝낼수록 별이 많아요.'],
  init(G){
    const SP=[['🦑','오징어'],['🐙','문어'],['🦐','새우'],['🐟','물고기'],['🦀','게']], kinds=G.shuffle(SP).slice(0,2+(G.d>.5?1:0));
    const want=kinds.map((s,i)=>({e:s[0],n:s[1],need:1+Math.round(G.d*2)+(i===0?1:0),got:0}));
    let boat=AW/2,hook=null,fish=[],t=0,hearts=3,time=60,bx=AW/2;
    const spawn=()=>{const jelly=Math.random()<.12+.1*G.d,s=jelly?['🪼','해파리']:Math.random()<.65?G.pick(kinds):G.pick(SP);const dir=Math.random()<.5?1:-1;
      fish.push({x:dir>0?-30:AW+30,y:G.rand(190,500),dir,sp:G.rand(40,90)+80*G.d,e:s[0],n:s[1],jelly})};
    for(let i=0;i<5;i++){spawn();fish[i].x=G.rand(30,AW-30)}
    return {
      update(dt){time-=dt;if(time<=0)return G.lose('시간이 다 됐어요!');boat=G.lerp(boat,bx,Math.min(1,dt*6));
        t-=dt;if(t<=0){spawn();t=G.rand(.5,1.1)}for(const f of fish){if(f.caught)continue;f.x+=f.dir*f.sp*dt}fish=fish.filter(f=>f.x>-50&&f.x<AW+50||f.caught);
        if(hook){if(hook.st==='down'){hook.y+=300*dt;const f=fish.find(f=>!f.caught&&Math.abs(f.x-hook.x)<22&&Math.abs(f.y-hook.y)<20);
            if(f){f.caught=true;hook.f=f;hook.st='up';G.sfx('pop')}else if(hook.y>520)hook.st='up'}
          else{hook.y-=340*dt;if(hook.f){hook.f.x=hook.x;hook.f.y=hook.y+16}if(hook.y<=110){const f=hook.f;hook=null;if(f){fish=fish.filter(x=>x!==f);
              if(f.jelly){hearts--;G.sfx('hurt');G.shake=5;G.pop('앗, 따가워!',boat,90,'#FF8A8A');if(hearts<=0)return G.lose('해파리에 너무 많이 쏘였어요!')}
              else{const w=want.find(w=>w.e===f.e&&w.got<w.need);if(w){w.got++;G.sfx('coin');G.pop(`${f.n} 낚았다!`,boat,80);G.burst(boat,100,'#FFE27A',10)}else{G.sfx('tap');G.pop(`${f.n}는 놓아줘요`,boat,80,'#CBB8FF',15)}
                if(want.every(w=>w.got>=w.need))return G.win(time>30?3:time>15?2:1)}}}}}
        G.setHud(HEARTS(hearts),TIME(time),want.map(w=>`${w.e}${w.got}/${w.need}`).join(' '))},
      draw(c){c.fillStyle=G.grad(0,110,'#FFD6A0','#9FD8FF');c.fillRect(0,0,AW,110);c.fillStyle=G.grad(110,AH,'#2E8BC0','#0B2A4A');c.fillRect(0,110,AW,AH-110);
        c.fillStyle='#6A6A7A';c.beginPath();c.moveTo(250,110);c.lineTo(280,60);c.lineTo(300,110);c.moveTo(300,110);c.lineTo(330,48);c.lineTo(355,110);c.fill();G.text('독도',318,30,13,'#4A240E','center',null);
        for(const f of fish){if(f.dir>0)emoFlip(G,f.e,f.x,f.y,34);else G.emo(f.e,f.x,f.y,34)}
        G.emo('⛵',boat,90,46);
        if(hook){c.strokeStyle='#EEE';c.lineWidth=2;c.beginPath();c.moveTo(hook.x,100);c.lineTo(hook.x,hook.y);c.stroke();G.text('ʃ',hook.x,hook.y+6,20,'#DDD','center',null)}
        want.forEach((w,i)=>G.text(`${w.e} ${w.n} ${w.got}/${w.need}`,12,140+i*22,15,w.got>=w.need?'#7FD69A':'#FFF3D6','left'))},
      down(x,y){if(y<140)bx=G.clamp(x,30,AW-30)},move(x,y,dn){if(dn&&!hook)bx=G.clamp(x,30,AW-30)},
      tap(x,y){if(!hook&&y>=140){hook={x:boat,y:110,st:'down'};G.sfx('whoosh')}},
      key(k){if(k==='L')bx=G.clamp(bx-40,30,AW-30);if(k==='R')bx=G.clamp(bx+40,30,AW-30);if((k==='A'||k==='D')&&!hook){hook={x:boat,y:110,st:'down'};G.sfx('whoosh')}}
    }}});

/* ---------- 독도 3: 독도 그림 퍼즐 (15 퍼즐 · 슬라이드 퍼즐) ---------- */
arcDefine({id:'dokdo_slide',ch:'dokdo',name:'독도 그림 퍼즐',tag:'밀어 맞추기',from:'15 퍼즐 (슬라이드 퍼즐, 1880년대)',icon:'🏝️',
  how:['빈칸 옆 조각을 누르면 빈칸으로 미끄러져요. (같은 줄이면 여러 칸도 한 번에)','흩어진 독도 그림을 원래대로 맞춰요!','적게 움직일수록 별이 많아요. 단계가 오르면 조각이 많아져요.'],
  init(G){
    const n=G.lv<=3?3:G.lv<=8?4:5, size=320, cs=size/n, ox=20, oy=40, shuf=15+Math.round(G.d*110);
    const img=new Image();let ready=false;img.onload=()=>ready=true;img.src=(typeof ART!=='undefined'&&ART.isles&&ART.isles[7])||'assets/isle_7.webp';
    let b=[...Array(n*n)].map((_,i)=>i),blank=n*n-1,moves=0,last=-1,nums=G.d<.5;
    for(let i=0;i<shuf;i++){const r=Math.floor(blank/n),c=blank%n,opts=[[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([a,d])=>a>=0&&d>=0&&a<n&&d<n).map(([a,d])=>a*n+d).filter(x=>x!==last);
      const j=G.pick(opts);[b[blank],b[j]]=[b[j],b[blank]];last=blank;blank=j}
    if(b.every((v,i)=>v===i)){const j=blank-1>=0?blank-1:blank+1;[b[blank],b[j]]=[b[j],b[blank]];blank=j}
    const tb=G.btn(AW/2-60,440,120,46,nums?'🔢 번호 끄기':'🔢 번호 켜기',()=>{nums=!nums;tb.label=nums?'🔢 번호 끄기':'🔢 번호 켜기'},{fs:15});
    return {
      update(){G.setHud(`👆 ${moves}번`,`기준 ${shuf}번`,`🧩 ${n}×${n}`)},
      draw(c){G.rr(ox-6,oy-6,size+12,size+12,12,'#4E2C14');
        b.forEach((v,i)=>{if(v===n*n-1)return;const x=ox+(i%n)*cs,y=oy+Math.floor(i/n)*cs,sx=(v%n)/n,sy=Math.floor(v/n)/n;
          c.save();c.beginPath();c.roundRect?c.roundRect(x+1,y+1,cs-2,cs-2,6):c.rect(x+1,y+1,cs-2,cs-2);c.clip();
          if(ready){c.fillStyle='#6FB6E0';c.fillRect(x,y,cs,cs);const s=Math.min(img.width,img.height);c.drawImage(img,(img.width-s)/2+sx*s,(img.height-s)/2+sy*s,s/n,s/n,x,y,cs,cs)}else{c.fillStyle=`hsl(${200+v*7},60%,55%)`;c.fillRect(x,y,cs,cs)}
          c.restore();if(nums||!ready)G.text(String(v+1),x+14,y+14,14,'#fff')});
        if(ready){c.globalAlpha=.9;const s=Math.min(img.width,img.height);c.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,AW-86,440,66,66);c.globalAlpha=1;G.text('완성 그림',AW-53,512,12,'#FFE9A8')}},
      tap(x,y){const c=Math.floor((x-ox)/cs),r=Math.floor((y-oy)/cs);if(r<0||c<0||r>=n||c>=n)return;const br=Math.floor(blank/n),bc=blank%n;
        if(r!==br&&c!==bc)return;if(r===br&&c===bc)return;
        while(blank!==r*n+c){const BR=Math.floor(blank/n),BC=blank%n,step=r===BR?(c>BC?1:-1):(r>BR?n:-n);const j=blank+step;[b[blank],b[j]]=[b[j],b[blank]];blank=j;moves++}
        G.sfx('tap');if(b.every((v,i)=>v===i)){G.sfx('ok');G.burst(AW/2,200,'#FFE27A',30);G.win(moves<=shuf?3:moves<=shuf*2?2:1)}}
    }}});
