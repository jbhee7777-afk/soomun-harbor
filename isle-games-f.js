/* ===== 다시 만든 놀이 2: 안전 건널목 (찻길마다 다른 횡단보도·신호) · 저금 핀 뽑기 (순서 퍼즐) ===== */

/* ---------- 안전 1: 안전 건널목 — 찻길마다 횡단보도 자리와 신호 시간이 달라요 ---------- */
arcDefine({id:'safety_cross',ch:'safety',name:'안전 건널목',tag:'신호 지키기 아케이드',from:'크로시 로드 (Crossy Road)',icon:'🚦',
  how:['톡 누른 쪽(위·아래·왼쪽·오른쪽)으로 한 칸씩 움직여요. 밀어도, 방향키도 돼요.','찻길마다 횡단보도 자리가 다르고, 신호등도 따로 바뀌어요! 그 찻길의 신호가 🚶초록일 때 그 횡단보도로 건너요.','🚨 차는 신호를 무시하고 달려요. 초록불이어도 좌우를 살펴요! 무단횡단 없이 빨리 건너면 별 3개.'],
  init(G){
    const C=9,R=13,S=40,OY=10, cars=['🚗','🚕','🚙','🚓','🚑','🛵','🚚'];
    const nRoad=4+Math.round(G.d*6), rows=G.shuffle([...Array(11)].map((_,i)=>i+1)).slice(0,nRoad);
    const lanes={};
    rows.forEach(r=>{const dir=Math.random()<.5?-1:1,sp=(60+170*G.d)*G.rand(.85,1.25),n=2+Math.round(G.d*2+Math.random()),bus=Math.random()<.22,go=G.rand(2.2,3.6)+1.2-1.6*G.d,stop=Math.max(1.2,2.9-1.5*G.d);
      lanes[r]={dir,sp,cw:G.ri(0,C-1),go,stop,walk:Math.random()<.4,t:G.rand(.2,go),
        cars:[...Array(n)].map((_,i)=>({x:i*(C*S/n)+G.rand(0,30),e:bus?'🚌':G.pick(cars),w:bus?70:36,rude:G.d>.35&&Math.random()<.06+.2*G.d}))}});
    const P={c:G.ri(0,C-1),r:12,x:0,y:12,inv:0};P.x=P.c;
    let hearts=3,time=Math.round(70-25*G.d),T0=time,jay=0,safe=0;
    const move=(dc,dr)=>{if(G.over)return;P.face=dr<0?'U':dr>0?'D':dc<0?'L':'R';const c=P.c+dc,r=P.r+dr;if(c<0||c>=C||r<0||r>12)return;
      const L=lanes[r];if(L&&dr!==0){if(c!==L.cw){jay++;G.pop('무단횡단!',c*S+S/2,OY+r*S,'#FF8A8A',16);G.sfx('no')}else if(L.walk){safe++;G.addScore(10,c*S+S/2,OY+r*S)}}
      P.c=c;P.r=r;G.sfx('jump');
      if(r===0){G.burst(P.c*S+S/2,OY+S/2,'#7FD69A',30);G.win(hearts===3&&jay===0&&time>T0*.3?3:hearts>=2&&jay<=1?2:1)}};
    const hit=k=>{hearts--;G.sfx('hurt');G.shake=6;G.burst(P.x*S+S/2,OY+P.y*S+S/2,'#FF6F8A',16);if(k&&k.rude)G.pop('신호 위반 차! 초록불에도 살펴요',AW/2,OY+P.r*S-20,'#FFB3B3',14);
      P.c=G.ri(0,C-1);P.r=12;P.x=P.c;P.y=12;P.inv=1;if(hearts<=0)G.lose('차에 너무 많이 부딪혔어요. 그 찻길의 횡단보도·신호를 확인해요!')};
    return {
      boostText:'하트 +1', boost(){hearts=Math.min(3,hearts+1)},
      update(dt){time-=dt;if(time<=0)return G.lose('시간이 다 됐어요! 신호를 기다리며 빨리 건너요.');
        P.x=G.lerp(P.x,P.c,Math.min(1,dt*18));P.y=G.lerp(P.y,P.r,Math.min(1,dt*18));P.inv=Math.max(0,P.inv-dt);
        for(const r in lanes){const L=lanes[r];L.t-=dt;if(L.t<=0){L.walk=!L.walk;L.t=L.walk?L.stop:L.go;if(+r===P.r-1||+r===P.r+1)G.sfx('tick')}
          const cwL=L.cw*S,cwR=cwL+S;const list=[...L.cars].sort((a,b)=>L.dir>0?b.x-a.x:a.x-b.x);
          list.forEach((k,i)=>{let mv=L.dir*L.sp*dt;const front=L.dir>0?k.x+k.w:k.x;
            if(L.walk&&!k.rude){if(L.dir>0&&front<=cwL-2&&front+mv>cwL-4)mv=Math.max(0,cwL-4-front);if(L.dir<0&&front>=cwR+2&&front+mv<cwR+4)mv=Math.min(0,cwR+4-front)}
            const ahead=list[i-1];if(ahead&&!k.rude){const gap=L.dir>0?ahead.x-(k.x+k.w):k.x-(ahead.x+ahead.w);if(gap>=0&&gap<10+Math.abs(mv))mv=0}
            k.x+=mv;if(k.x>C*S+40)k.x-=C*S+80+k.w;if(k.x<-80-k.w)k.x+=C*S+80+k.w;
            if(+r===P.r&&!P.inv){const px=P.x*S+S/2;if(px>k.x-6&&px<k.x+k.w+6&&Math.abs(P.y-P.r)<.3)hit(k)}})}
        G.setHud(HEARTS(hearts),TIME(time),jay?`🚫 무단 ${jay}`:`🦺 안전 ${safe}`)},
      draw(c){
        for(let r=0;r<R;r++){const y=OY+r*S,L=lanes[r];G.rr(0,y,AW,S,0,r===0?'#5FB36F':L?'#3B3B48':'#A8998A');
          if(L){const cwL=L.cw*S;for(let i=0;i<5;i++)G.rr(cwL+3,y+3+i*7.4,S-6,4,1,'rgba(255,255,255,.85)');
            c.strokeStyle='#FFD24A';c.lineWidth=2;c.setLineDash([10,10]);c.beginPath();c.moveTo(0,y+S-1);c.lineTo(cwL-4,y+S-1);c.moveTo(cwL+S+4,y+S-1);c.lineTo(AW,y+S-1);c.stroke();c.setLineDash([]);
            const lx=L.cw<C-1?cwL+S+12:cwL-12;G.rr(lx-8,y+6,16,28,5,'#1A1A22');G.circle(lx,y+13,5,L.walk?'#3FE07A':'#2A3A2A');G.circle(lx,y+27,5,L.walk?'#3A2A2A':'#FF4A4A');
            if(L.walk&&L.t<1.2)G.text(String(Math.ceil(L.t)),lx,y+20,10,'#FFF','center',null)}
          else if(r>0&&r<12)G.rr(0,y,AW,3,0,'#8A7A6A')}
        G.emo('🏫',AW/2,OY+S/2,30);
        for(const r in lanes){const L=lanes[r];for(const k of L.cars){const x=k.x+k.w/2,y=OY+r*S+S/2,s=k.w>40?40:32;if(L.dir>0)emoFlip(G,k.e,x,y,s);else G.emo(k.e,x,y,s);if(k.rude)G.emo('🚨',x,y-16,14)}}
        if(!(P.inv&&Math.floor(G.t*10)%2)){const px=P.x*S+S/2,py=OY+P.y*S+S/2-Math.abs(Math.sin((P.y-P.r)*Math.PI))*8,f=P.face||'U';
          if(f==='U')G.spr('walk_bag','🧒',px,py,34);else if(f==='L'&&arcSprite('run_side'))emoFlip(G,'run_side',px,py,34);else if(f==='R')G.spr('run_side','🧒',px,py,34);else G.emo('🧒',px,py,32)}},
      tap(x,y){const px=P.c*S+S/2,py=OY+P.r*S+S/2,dx=x-px,dy=y-py;if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1,0);else move(0,dy>0?1:-1)},
      swipe(d){move(d==='L'?-1:d==='R'?1:0,d==='U'?-1:d==='D'?1:0)},
      key(k){if(k!=='A')this.swipe(k)}
    }}});

/* ---------- 경제 3: 저금 핀 뽑기 — 칸이 여러 줄로 쌓인 순서 퍼즐 ----------
   규칙: 회색 빈 동전은 금화에 닿아야 금화가 돼요 · 검은 충동구매 구슬이 닿으면 금화·빈 동전도 검게 물들어요 · 검은 구슬이 저금통에 들어가면 실패.
   단계마다 기둥(1~4줄)과 칸(2~3층)이 늘고, 맨 위에 충동구매 칸(뽑으면 안 되는 핀)이 섞여요. "다 뽑기"나 "아래부터 뽑기"는 실패해요. */
arcDefine({id:'money_pin',ch:'money',name:'저금 핀 뽑기',tag:'핀 뽑기 순서 퍼즐',from:'풀 더 핀 (Pull the Pin)',icon:'📌',
  how:['핀의 둥근 손잡이를 누르면 핀이 빠지고, 위 칸 구슬이 아래 칸으로 떨어져요.','회색 빈 동전은 금화🪙에 닿아야 금화가 돼요. 금화와 섞기 전에 저금통으로 떨어뜨리면 손해!','검은 충동구매 구슬은 금화를 검게 물들이고, 저금통에 들어가면 실패! 뽑으면 안 되는 핀도 있어요.'],
  init(G){
    const nCol=Math.min(4,1+Math.floor((G.lv-1)/3)+(G.d>.9?1:0)), depth=G.lv<=1?2:G.d<.35?2:3, colW=344/nCol, BR=7;
    const hCh=depth===2?78:62, gap=24;
    let walls=[[8,0,8,560],[352,0,352,560]],pins=[],balls=[];
    /* 3단계부터는 뽑으면 안 되는 핀(충동구매 구슬)이 꼭 하나 이상 있어요 → 다 뽑기로는 못 깨요 */
    const bombs=[...Array(nCol)].map((_,c)=>G.lv>1&&Math.random()<.25+.4*G.d&&(c>0||nCol===1&&G.lv>=3));
    if(G.lv>=3&&!bombs.some(Boolean))bombs[nCol===1?0:G.ri(1,nCol-1)]=true;
    const yF=34+depth*(hCh+gap)-gap;
    for(let c=0;c<nCol;c++){
      const x0=8+c*colW+6,w=colW-12;
      /* 기둥 벽은 위에서 아래까지 이어져서 구슬이 옆 기둥 틈에 끼지 않아요 · 기둥 사이 지붕 */
      walls.push([x0,34,x0,yF],[x0+w,34,x0+w,yF]);if(c<nCol-1){const xn=x0+colW,m=(x0+w+xn)/2;walls.push([x0+w,34,m,24],[m,24,xn,34])}
      let types=[];const bomb=bombs[c];
      for(let k=0;k<depth;k++)types.push(Math.random()<.5?'e':'g');
      if(bomb)types[0]='x';
      if(!types.some(t=>t==='g'))types[bomb?1:G.ri(0,depth-1)]='g';
      if(!types.some(t=>t==='e')&&types.filter(t=>t!=='x').length>=2)types[types.length-1]='e';
      types.forEach((t,k)=>{const y=34+k*(hCh+gap);
        const left=(c+k)%2===1;pins.push({s:[x0-2,y+hCh,x0+w+2,y+hCh],left,out:0,pull:false,bomb:t==='x'});
        const n=Math.max(5,Math.min(14,Math.round(w*hCh/(BR*BR*5.2))));for(let i=0;i<n;i++)balls.push({x:x0+G.rand(BR+2,w-BR-2),y:y+G.rand(BR+2,hCh-BR-4),vx:0,vy:0,t,in:false})})}
    walls.push([8,yF,150,470],[352,yF,210,470]);
    const totalGood=balls.filter(b=>b.t!=='x').length,need=Math.ceil(totalGood*.85);let pulled=0,ended=false,settle=0,fact=G.pick(PIG_FACT),bad=0;
    const segs=()=>[...walls,...pins.filter(p=>!p.pull).map(p=>p.s)];
    const coll=(b,s)=>{const [x1,y1,x2,y2]=s,dx=x2-x1,dy=y2-y1,L2=dx*dx+dy*dy||1;let k=((b.x-x1)*dx+(b.y-y1)*dy)/L2;k=Math.max(0,Math.min(1,k));const px=x1+dx*k,py=y1+dy*k,ddx=b.x-px,ddy=b.y-py,d=Math.hypot(ddx,ddy);
      if(d<BR+2&&d>0){const nx=ddx/d,ny=ddy/d,pen=BR+2-d;b.x+=nx*pen;b.y+=ny*pen;const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.5*vn*nx;b.vy-=1.5*vn*ny}b.vx*=.98;b.vy*=.98}};
    /* 손잡이는 핀 막대 한가운데 (기둥이 여러 줄이어도 서로 겹치지 않게) · 핀 막대 아무 곳이나 눌러도 돼요 */
    const handle=p=>{const o=p.left?-p.out:p.out;return [(p.s[0]+p.s[2])/2+o,p.s[1]]};
    return {
      boostText:'힌트: 먼저 뽑을 핀', boost(){const p=pins.find(p=>!p.pull&&!p.bomb);if(p){p.hint=4;G.pop('반짝이는 핀부터!',AW/2,24,'#FFE27A',16)}},
      update(dt){const n=3;for(let it=0;it<n;it++){const h=dt/n;
          for(const b of balls){if(b.in)continue;b.vy+=900*h;b.x+=b.vx*h;b.y+=b.vy*h;for(const s of segs())coll(b,s);
            if(b.y>476&&b.x>150&&b.x<210){b.in=true;if(b.t==='x'&&!ended){ended=true;G.sfx('boom');G.shake=8;return G.lose('충동구매 구슬이 저금통에 들어갔어요! 뽑으면 안 되는 핀이 있어요.')}G.sfx('coin')}}
          for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){const a=balls[i],b=balls[j];if(a.in||b.in)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
            if(d<BR*2&&d>0){const nx=dx/d,ny=dy/d,p=(BR*2-d)/2;a.x-=nx*p;a.y-=ny*p;b.x+=nx*p;b.y+=ny*p;const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){a.vx+=rv*nx*.5;a.vy+=rv*ny*.5;b.vx-=rv*nx*.5;b.vy-=rv*ny*.5}
              if(a.t==='x'&&b.t!=='x')b.t='x';else if(b.t==='x'&&a.t!=='x')a.t='x';else if(a.t==='g'&&b.t==='e')b.t='g';else if(b.t==='g'&&a.t==='e')a.t='g'}}}
        for(const p of pins){if(p.pull)p.out+=dt*600;if(p.hint)p.hint=Math.max(0,p.hint-dt)}
        const moving=balls.some(b=>!b.in&&b.t!=='x'&&Math.hypot(b.vx,b.vy)>25);settle=moving?0:settle+dt;
        const inG=balls.filter(b=>b.in&&b.t==='g').length,left=balls.filter(b=>!b.in&&b.t!=='x').length;
        if(!ended&&settle>.8&&left===0){ended=true;if(inG>=need)return G.win(inG>=totalGood*.97&&!bad?3:inG>=totalGood*.9?2:1);return G.lose(`금화가 ${inG}/${need}개뿐이에요. 빈 동전은 금화와 먼저 섞어요!`)}
        if(!ended&&settle>1.2&&balls.some(b=>!b.in&&b.t==='x'&&b.y>yF)){ended=true;return G.lose('충동구매 구슬이 떨어지고 있어요!')}
        G.setHud(`🪙 ${inG}/${need}`,`📌 ${pulled}/${pins.filter(p=>!p.bomb).length}`,`${nCol}줄 · ${G.lv}단계`)},
      draw(c){c.lineCap='round';for(const s of walls){c.strokeStyle='#8A6A4A';c.lineWidth=6;c.beginPath();c.moveTo(s[0],s[1]);c.lineTo(s[2],s[3]);c.stroke()}
        for(const p of pins){const [x1,y1,x2,y2]=p.s,o=p.left?-p.out:p.out;c.strokeStyle='#D8D8E8';c.lineWidth=6;c.beginPath();c.moveTo(x1+o,y1);c.lineTo(x2+o,y2);c.stroke();
          const [hx,hy]=handle(p);G.circle(hx,hy,11,p.hint&&Math.floor(G.t*6)%2?'#FFF3B0':'#FFD24A','#8A5410',3)}
        for(const b of balls){if(b.in)continue;G.circle(b.x,b.y,BR,b.t==='g'?'#FFD24A':b.t==='x'?'#1A1A1A':'#B8B8C8',b.t==='g'?'#8A5410':b.t==='x'?'#FF4A6A':'#555',2)}
        G.emo('🐷',180,505,58);G.text(`${balls.filter(b=>b.in&&b.t==='g').length}`,180,530,14);G.text(fact,AW/2,16,12,'#FFE9A8')},
      tap(x,y){const cand=pins.filter(p=>!p.pull&&Math.abs(y-p.s[1])<16&&x>p.s[0]-4&&x<p.s[2]+4).sort((a,b)=>Math.abs(x-(a.s[0]+a.s[2])/2)-Math.abs(x-(b.s[0]+b.s[2])/2))[0];
        if(cand){cand.pull=true;pulled++;if(cand.bomb)bad++;G.sfx('whoosh')}}
    }}});
