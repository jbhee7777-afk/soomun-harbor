/* ===== 새 섬 놀이 3/3: 반짝 마트 타이쿤 · 저금 핀 뽑기 · 분리수거 블랙홀 · 바다 쓰레기 버블 · 미세먼지 볼 블라스트 ===== */

/* ---------- 경제 1: 반짝 마트 타이쿤 (슈퍼마켓 시뮬레이터) ---------- */
arcDefine({id:'money_mart',ch:'money',name:'반짝 마트 타이쿤',tag:'가게 운영 · 계산 · 재고',from:'슈퍼마켓 시뮬레이터 · 마트 타이쿤',icon:'🏪',
  how:['손님이 물건을 골라 계산대로 와요. 낸 돈에서 물건값을 빼고 거스름돈을 만들어 "건네기"!','진열대가 비면 손님이 그냥 가 버려요. 진열대를 눌러 물건을 채워요 (원가만큼 돈이 들어요).','이익 = 판 돈 − 물건을 산 돈(원가). 하루가 끝나기 전에 목표 이익을 내요!'],
  init(G){
    const step=G.d<.35?100:G.d<.7?50:10;const rp=(v)=>Math.round(v/step)*step;
    const P=[['🍞','빵',800,1200],['🥛','우유',900,1300],['🍎','사과',500,800],['🍪','과자',700,1100],['🧃','주스',600,1000]].map(([e,n,c,p])=>({e,n,cost:rp(c*G.rand(.9,1.1)),price:rp(p*G.rand(.95,1.15)),stock:3}));
    P.forEach(p=>{if(p.price<=p.cost)p.price=p.cost+step*3});
    const start=10000;let money=start,hearts=3,time=110-15*G.d,queue=[],spawnT=1.5,tray=[],served=0,msg='',msgT=0;const goal=rp(3000+G.d*12000);
    const MONEY=[10,50,100,500,1000,5000];
    const newCust=()=>{const want=G.shuffle(P).slice(0,G.ri(1,1+Math.round(G.d*2)));const miss=want.find(p=>p.stock<=0);
      if(miss){hearts--;G.sfx('no');msg=`${miss.n}가 다 떨어져서 손님이 그냥 갔어요!`;msgT=2.5;if(hearts<=0)G.lose('진열대가 자꾸 비어 손님이 떠났어요. 재고를 미리 채워요!');return}
      want.forEach(p=>p.stock--);const total=want.reduce((a,p)=>a+p.price,0),pay=[1000,5000,10000,50000].find(v=>v>total);
      queue.push({want,total,pay,face:G.pick(['🧑','👩','👴','👧','👦','👵']),pat:24-12*G.d,max:24-12*G.d})};
    const SY=30,CY=212;
    P.forEach((p,i)=>G.btn(6+i*70,SY+110,66,30,'채우기',()=>{const n=6-p.stock,c=n*p.cost;if(!n)return;if(money<c){G.sfx('no');msg='돈이 모자라요! 먼저 팔아서 돈을 벌어요';msgT=2;return}money-=c;p.stock=6;G.sfx('place');G.pop(`-${c.toLocaleString()}원 (원가)`,40+i*70,SY+90,'#FF8A8A',13)},{fs:13,col:'#3F7A4A'}));
    MONEY.forEach((m,i)=>G.btn(10+(i%3)*116,392+Math.floor(i/3)*48,108,42,`${m.toLocaleString()}원`,()=>{if(!queue[0])return;tray.push(m);G.sfx('coin')},{fs:15,col:m>=1000?'#3F7A4A':'#8A6A2A'}));
    G.btn(10,490,108,44,'↶ 빼기',()=>{tray.pop();G.sfx('tap')},{fs:15,col:'#7A4A5A'});
    G.btn(126,490,224,44,'건네기 ✋',()=>{const c=queue[0];if(!c)return;const sum=tray.reduce((a,b)=>a+b,0),need=c.pay-c.total;
      if(sum===need){money+=c.total;served++;queue.shift();tray=[];G.sfx('deliver');G.burst(AW/2,CY+40,'#FFE27A',16);G.pop(`+${c.total.toLocaleString()}원`,AW/2,CY+10,'#FFE27A',18);
        if(money-start>=goal)G.win(hearts===3&&time>30?3:hearts>=2?2:1)}
      else{hearts--;G.sfx('hurt');G.shake=5;msg=sum>need?`${(sum-need).toLocaleString()}원 더 줬어요!`:`${(need-sum).toLocaleString()}원 모자라요!`;msgT=2;tray=[];if(hearts<=0)G.lose('거스름돈을 너무 많이 틀렸어요!')}},{fs:17,col:'#2F9E5B'});
    return {
      boostText:'시간 +15초', boost(){time+=15},
      update(dt){time-=dt;msgT=Math.max(0,msgT-dt);if(time<=0)return G.lose(`하루가 끝났어요. 이익 ${(money-start).toLocaleString()}원 / 목표 ${goal.toLocaleString()}원`);
        spawnT-=dt;if(spawnT<=0&&queue.length<4){newCust();spawnT=G.rand(4.5,7)-G.d*3}
        if(queue[0]){queue[0].pat-=dt;if(queue[0].pat<=0){queue.shift();tray=[];hearts--;G.sfx('hurt');msg='손님이 기다리다 갔어요!';msgT=2;if(hearts<=0)return G.lose('손님이 너무 오래 기다렸어요!')}}
        G.setHud(HEARTS(hearts),`💰 이익 ${(money-start).toLocaleString()}/${goal.toLocaleString()}`,TIME(time))},
      draw(c){G.rr(4,SY-4,AW-8,150,12,'#6B4A3A');P.forEach((p,i)=>{const x=6+i*70;G.rr(x,SY,66,104,10,'#FFF8E6','#6B3D1F',2);G.emo(p.e,x+33,SY+26,32);
          G.text(`${p.price.toLocaleString()}원`,x+33,SY+56,12,'#3A240E','center',null);G.text(`원가 ${p.cost.toLocaleString()}`,x+33,SY+72,10,'#8A6A4A','center',null);
          for(let s=0;s<6;s++)G.rr(x+6+s*9.5,SY+86,8,10,2,s<p.stock?'#3FB98A':'#D8C8B0')});
        G.rr(4,CY-14,AW-8,172,12,'#4E3A5A');const q=queue[0];
        if(q){G.emo(q.face,40,CY+30,48);q.want.forEach((p,i)=>G.emo(p.e,90+i*36,CY+14,28));
          G.text(`합계 ${q.total.toLocaleString()}원`,250,CY+6,17);G.text(`낸 돈 ${q.pay.toLocaleString()}원`,250,CY+30,17,'#7FFFA0');G.text('거스름돈은?',250,CY+54,15,'#FFE9A8');
          const pp=q.pat/q.max;G.rr(80,CY+76,260,8,4,'#2A1A2A');G.rr(80,CY+76,260*pp,8,4,pp>.5?'#6FE0A6':pp>.25?'#FFD24A':'#FF6A5A')}
        else G.text('손님을 기다려요…',AW/2,CY+30,16,'#CBB8FF');
        queue.slice(1).forEach((w,i)=>G.emo(w.face,AW-30-i*30,CY+110,24));
        const sum=tray.reduce((a,b)=>a+b,0);G.text(`쟁반 ${sum.toLocaleString()}원`,80,CY+112,15,'#FFF3D6');G.text(`이익 = 판 돈 − 원가`,AW/2+40,CY+136,12,'#CBB8FF');
        if(msgT)G.text(msg,AW/2,CY+136-20,14,'#FF8A8A')}
    }}});

/* ---------- 경제 2: 저금 핀 뽑기 (풀 더 핀) ---------- */
const PIG_FACT=['저축하면 이자가 붙어요!','충동구매를 참으면 꼭 필요한 곳에 쓸 수 있어요.','용돈 기입장으로 돈의 흐름을 살펴요.','필요한 것과 갖고 싶은 것을 구분해요.','은행에 맡긴 돈은 안전하게 지켜져요.'];
arcDefine({id:'money_pin',ch:'money',name:'저금 핀 뽑기',tag:'핀 뽑기 물리 퍼즐',from:'풀 더 핀 (Pull the Pin)',icon:'📌',
  how:['핀의 둥근 손잡이를 눌러 핀을 뽑으면 구슬이 떨어져요.','회색 빈 동전은 금화🪙에 닿으면 금화가 돼요! 금화를 많이 돼지 저금통에 모아요.','검은 충동구매 구슬이 저금통에 들어가면 실패! 핀을 뽑는 순서를 잘 생각해요.'],
  init(G){
    const SIDE=[[8,0,8,390],[352,0,352,390]], FUN=[[8,390,150,465],[352,390,210,465]];
    const box=(x,y,w,h)=>[[x,y,x,y+h],[x+w,y,x+w,y+h]];
    const L=[
      {w:[...box(130,110,100,120)],p:[[130,230,230,230]],b:[['g',140,120,80,100,14]],h:'핀을 뽑아 금화를 저금통에!'},
      {w:[...box(50,110,110,110),...box(200,110,110,110)],p:[[50,220,160,220],[200,220,310,220]],b:[['g',60,120,90,90,12],['x',210,120,90,90,6]],h:'어느 핀을 뽑을까요?'},
      {w:[...box(130,50,100,90),...box(130,190,100,90)],p:[[130,140,230,140],[130,280,230,280]],b:[['g',140,60,80,70,10],['e',140,200,80,70,12]],h:'빈 동전을 금화로 바꾸려면?'},
      {w:[...box(40,80,110,100),...box(210,80,110,100),[40,180,120,250],[320,180,240,250],[120,250,120,320],[240,250,240,320]],p:[[40,180,150,180],[210,180,320,180],[120,320,240,320]],b:[['e',50,90,90,80,12],['g',220,90,90,80,12]],h:'섞은 다음에 떨어뜨려요'},
      {w:[...box(40,40,110,90),...box(40,170,110,100),...box(210,120,110,100)],p:[[40,130,150,130],[40,270,150,270],[210,220,320,220]],b:[['e',50,50,90,70,10],['g',50,180,90,80,10],['x',220,130,90,80,6]],h:'빈 동전을 먼저 금화 위로 떨어뜨려요. 충동구매 구슬은 건드리지 마요'},
      {w:[...box(130,40,100,90),...box(130,170,100,90),...box(130,300,100,60)],p:[[130,130,230,130],[130,260,230,260],[130,360,230,360]],b:[['g',140,50,80,70,9],['e',140,180,80,70,9],['e',140,305,80,45,6]],h:'위에서부터 차례로!'}];
    const lv=L[(G.lv-1)%L.length], extraX=G.lv>L.length?1:0;
    let walls=[...SIDE,...FUN,...lv.w],pins=lv.p.map(p=>({s:p,out:0,pull:false})),balls=[];
    lv.b.forEach(([t,x,y,w,h,n])=>{const N=n+(t==='x'?extraX*2:Math.round(G.d*4));for(let i=0;i<N;i++)balls.push({x:x+G.rand(8,w-8),y:y+G.rand(8,h-8),vx:0,vy:0,t:t==='e'?'e':t,in:false})});
    const R=8, totalGood=balls.filter(b=>b.t!=='x').length; let pulled=0,ended=false,settle=0,fact=G.pick(PIG_FACT);
    const segs=()=>[...walls,...pins.filter(p=>!p.pull).map(p=>p.s)];
    const coll=(b,s)=>{const [x1,y1,x2,y2]=s,dx=x2-x1,dy=y2-y1,L2=dx*dx+dy*dy;let k=((b.x-x1)*dx+(b.y-y1)*dy)/L2;k=Math.max(0,Math.min(1,k));const px=x1+dx*k,py=y1+dy*k,ddx=b.x-px,ddy=b.y-py,d=Math.hypot(ddx,ddy);
      if(d<R+2&&d>0){const nx=ddx/d,ny=ddy/d,pen=R+2-d;b.x+=nx*pen;b.y+=ny*pen;const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.5*vn*nx;b.vy-=1.5*vn*ny}b.vx*=.98;b.vy*=.98}};
    return {
      boostText:'힌트 보기', boost(){G.pop(lv.h,AW/2,30,'#FFE27A',16)},
      update(dt){const n=3;for(let it=0;it<n;it++){const h=dt/n;
          for(const b of balls){if(b.in)continue;b.vy+=900*h;b.x+=b.vx*h;b.y+=b.vy*h;for(const s of segs())coll(b,s);
            if(b.y>470&&b.x>150&&b.x<210){b.in=true;if(b.t==='x'&&!ended){ended=true;G.sfx('boom');G.shake=8;return G.lose('충동구매 구슬이 저금통에 들어갔어요! 핀 순서를 다시 생각해요.')}G.sfx('coin')}}
          for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){const a=balls[i],b=balls[j];if(a.in||b.in)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
            if(d<R*2&&d>0){const nx=dx/d,ny=dy/d,p=(R*2-d)/2;a.x-=nx*p;a.y-=ny*p;b.x+=nx*p;b.y+=ny*p;const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){a.vx+=rv*nx*.5;a.vy+=rv*ny*.5;b.vx-=rv*nx*.5;b.vy-=rv*ny*.5}
              if(a.t==='g'&&b.t==='e')b.t='g';else if(b.t==='g'&&a.t==='e')a.t='g';else if(a.t==='x'&&b.t!=='x')b.t='x';else if(b.t==='x'&&a.t!=='x')a.t='x'}}}
        for(const p of pins)if(p.pull)p.out+=dt*600;
        const moving=balls.some(b=>!b.in&&Math.hypot(b.vx,b.vy)>25);settle=moving?0:settle+dt;
        const inG=balls.filter(b=>b.in&&b.t==='g').length;
        if(!ended&&inG>=Math.ceil(totalGood*.8)&&settle>.6){ended=true;return G.win(inG>=totalGood*.97?3:inG>=totalGood*.9?2:1)}
        if(!ended&&pins.every(p=>p.pull)&&settle>1.2){ended=true;return G.lose(`금화가 ${inG}/${Math.ceil(totalGood*.8)}개 모였어요. 빈 동전을 금화와 섞어 봐요!`)}
        G.setHud(`🪙 ${inG}/${Math.ceil(totalGood*.8)}`,`📌 ${pulled}개 뽑음`,`${G.lv}단계`)},
      draw(c){c.lineCap='round';for(const s of walls){c.strokeStyle='#8A6A4A';c.lineWidth=6;c.beginPath();c.moveTo(s[0],s[1]);c.lineTo(s[2],s[3]);c.stroke()}
        for(const p of pins){const [x1,y1,x2,y2]=p.s,ox=p.out;c.strokeStyle='#C8C8D8';c.lineWidth=6;c.beginPath();c.moveTo(x1+ox,y1);c.lineTo(x2+ox,y2);c.stroke();G.circle(x2+ox+10,y2,10,'#FFD24A','#8A5410',3)}
        for(const b of balls){if(b.in)continue;G.circle(b.x,b.y,R,b.t==='g'?'#FFD24A':b.t==='x'?'#222':'#B8B8C8',b.t==='g'?'#8A5410':'#111',2)}
        G.emo('🐷',180,505,58);G.text(`${balls.filter(b=>b.in&&b.t==='g').length}`,180,530,14);G.text(fact,AW/2,18,12,'#FFE9A8')},
      tap(x,y){for(const p of pins){if(p.pull)continue;const [x1,y1,x2,y2]=p.s;if(Math.hypot(x-(x2+10),y-y2)<22){p.pull=true;pulled++;G.sfx('whoosh');return}}}
    }}});

/* ---------- 환경 1: 분리수거 블랙홀 (홀.io) ---------- */
const TRASH={'플라스틱':['🧴','🥤','🛍️'],'종이':['📦','📰','✉️'],'캔':['🥫'],'유리':['🍾'],'음식물':['🍌','🍎','🥕','🍉'],'일반 쓰레기':['🧻','🦴']};
const NOEAT=['🐶','🐦','🌳','🚲','🐱','🌷'];
arcDefine({id:'eco_hole',ch:'eco',name:'분리수거 블랙홀',tag:'구멍 키우기 · 분류',from:'홀.io (Hole.io)',icon:'🕳️',
  how:['화면을 누른 채 가리키는 쪽으로 구멍이 움직여요.','위에 적힌 종류의 쓰레기만 삼켜요! 다른 종류를 삼키면 분리배출 실수(시간 -3초).','동물·나무·자전거는 삼키면 안 돼요(하트 -1). 많이 삼킬수록 구멍이 커져요. (치킨 뼈는 일반 쓰레기!)'],
  init(G){
    const WW=1000,WH=1000,goal=20+Math.round(G.d*45),cats=Object.keys(TRASH).slice(0,4+Math.round(G.d*2));
    let H={x:WW/2,y:WH/2,r:22},items=[],aim=null,cat=G.pick(cats),catT=16,got=0,hearts=3,time=Math.round(95-20*G.d),inv=0;const CT=16-6*G.d;
    const add=()=>{const pro=Math.random()<.12+.15*G.d;const e=pro?G.pick(NOEAT):null,cn=pro?null:G.pick(cats);items.push({x:G.rand(30,WW-30),y:G.rand(30,WH-30),e:e||G.pick(TRASH[cn]),c:cn,pro,s:pro?G.rand(30,44):G.rand(18,32)})};
    for(let i=0;i<120;i++)add();
    return {
      boostText:'구멍 크게', boost(){H.r+=8},
      update(dt){time-=dt;inv=Math.max(0,inv-dt);if(time<=0)return G.lose(`시간이 다 됐어요! (${got}/${goal})`);
        catT-=dt;if(catT<=0){let n;do{n=G.pick(cats)}while(n===cat&&cats.length>1);cat=n;catT=CT;G.sfx('unlock');G.pop(`이번엔 ${cat}!`,AW/2,110,'#FFE27A',22)}
        if(aim){const a=Math.atan2(aim.y-AH/2,aim.x-AW/2),sp=150;H.x=G.clamp(H.x+Math.cos(a)*sp*dt,H.r,WW-H.r);H.y=G.clamp(H.y+Math.sin(a)*sp*dt,H.r,WH-H.r)}
        for(let i=items.length-1;i>=0;i--){const it=items[i],d=Math.hypot(it.x-H.x,it.y-H.y);if(d<H.r*.85&&it.s<H.r*1.15){items.splice(i,1);
          if(it.pro){if(!inv){hearts--;inv=1;G.sfx('hurt');G.shake=6;G.pop(`${it.e} 삼키면 안 돼요!`,AW/2,AH/2-60,'#FF8A8A',18);if(hearts<=0)return G.lose('지켜야 할 것을 너무 많이 삼켰어요!')}}
          else if(it.c===cat){got++;H.r=Math.min(70,H.r+.9);G.sfx('pop');G.addScore(10);if(got>=goal)return G.win(starsByHearts(hearts))}
          else{time-=3;G.sfx('no');G.pop(`${it.e}는 ${it.c}! -3초`,AW/2,AH/2-60,'#FF8A8A',16)}add()}}
        G.setHud(HEARTS(hearts),`♻️ ${got}/${goal}`,TIME(time))},
      draw(c){const cx=H.x-AW/2,cy=H.y-AH/2;c.fillStyle='#7FBF6A';c.fillRect(0,0,AW,AH);c.save();c.translate(-cx,-cy);
        c.fillStyle='#6FAE5A';for(let x=0;x<WW;x+=80)for(let y=(x/80)%2*40;y<WH;y+=80)c.fillRect(x,y,40,40);G.rr(0,0,WW,WH,0,null,'#4E2C14',8);
        for(const it of items)if(Math.abs(it.x-H.x)<AW&&Math.abs(it.y-H.y)<AH)G.emo(it.e,it.x,it.y,it.s);
        c.restore();c.fillStyle='#111';c.beginPath();c.arc(AW/2,AH/2,H.r,0,Math.PI*2);c.fill();c.strokeStyle='#4A3A6A';c.lineWidth=4;c.stroke();
        G.rr(AW/2-110,8,220,40,14,'#FFF8E6','#6B3D1F',3);G.text(`삼킬 것: ${cat} ${TRASH[cat].join('')}`,AW/2,28,16,'#3A240E','center',null);G.rr(AW/2-100,52,200*(catT/CT),5,3,'#FFD24A')},
      down(x,y){aim={x,y}},move(x,y,dn){if(dn)aim={x,y}},up(){aim=null},
      key(k){const d={L:[-1,0],R:[1,0],U:[0,-1],D:[0,1]}[k];if(d)aim={x:AW/2+d[0]*100,y:AH/2+d[1]*100}},keyup(){aim=null}
    }}});

/* ---------- 환경 2: 바다 쓰레기 버블 (버블 슈터) ---------- */
arcDefine({id:'eco_bubble',ch:'eco',name:'바다 쓰레기 버블',tag:'버블 슈터 · 바다 구조',from:'버블 슈터 · 버블 위치 (Bubble Witch)',icon:'🫧',
  how:['화면을 끌어 방향을 정하고, 손을 떼면 쓰레기 방울을 쏴요. 벽에 튕길 수도 있어요!','같은 쓰레기 방울이 3개 이상 붙으면 펑! 매달린 곳이 끊긴 방울은 떨어져요.','갇힌 바다 친구(🐢🐠🐬)를 모두 구해 주면 성공! 방울이 아래 선까지 내려오면 실패.'],
  init(G){
    const RAD=18,COLS=9,k=4+Math.round(G.d*2),TR=['🧴','🥫','📦','🍾','🛍️','🥤'].slice(0,k),COL=['#7FC8FF','#C8C8D8','#E0B080','#7FD69A','#FF9FC0','#FFD24A'].slice(0,k),ANI=['🐢','🐠','🐬','🦀'];
    let rows=5+Math.round(G.d*4),grid=[],shot=null,aim={x:AW/2,y:300},next=G.ri(0,k-1),cur=G.ri(0,k-1),shots=0,drop=8-Math.round(G.d*4),off=0,saved=0,falling=[];
    const pos=(r,c)=>({x:RAD+c*RAD*2+(r%2?RAD:0)+(AW-COLS*RAD*2-RAD)/2,y:44+r*RAD*1.74+off});
    for(let r=0;r<rows;r++){grid[r]=[];for(let c=0;c<COLS-(r%2);c++)grid[r][c]={t:G.ri(0,k-1),ani:null}}
    const nAni=2+Math.round(G.d*4);for(let i=0;i<nAni;i++){const r=G.ri(1,rows-1),c=G.ri(0,grid[r].length-1);grid[r][c].ani=ANI[i%ANI.length]}
    const total=nAni;
    const nbs=(r,c)=>{const o=r%2?[[0,-1],[0,1],[-1,0],[-1,1],[1,0],[1,1]]:[[0,-1],[0,1],[-1,-1],[-1,0],[1,-1],[1,0]];return o.map(([a,b])=>[r+a,c+b]).filter(([a,b])=>a>=0&&grid[a]&&b>=0&&b<COLS-(a%2)&&grid[a][b])};
    const flood=(r,c,f)=>{const s=new Set([r+','+c]),q=[[r,c]];while(q.length){const [a,b]=q.pop();for(const [x,y] of nbs(a,b)){const k2=x+','+y;if(!s.has(k2)&&f(grid[x][y])){s.add(k2);q.push([x,y])}}}return [...s].map(v=>v.split(',').map(Number))};
    const dropFloat=()=>{const keep=new Set();(grid[0]||[]).forEach((b,c)=>{if(b)flood(0,c,()=>true).forEach(p=>keep.add(p+''))});
      grid.forEach((row,r)=>row.forEach((b,c)=>{if(b&&!keep.has([r,c]+'')){const p=pos(r,c);falling.push({...p,vy:0,b});if(b.ani){saved++;G.pop(`${b.ani} 구출!`,p.x,p.y,'#7FFFA0',18);G.sfx('star')}grid[r][c]=null}}))};
    const snap=(x,y)=>{let best=null;const lim=grid.length+1;for(let r=0;r<lim;r++){if(!grid[r])grid[r]=[];for(let c=0;c<COLS-(r%2);c++){if(grid[r][c])continue;const p=pos(r,c),d=Math.hypot(p.x-x,p.y-y);if((r===0||nbs(r,c).length)&&(!best||d<best.d))best={r,c,d}}}return best};
    return {
      boostText:'무지개 방울', boost(){cur=-1},
      update(dt){for(const f of falling){f.vy+=900*dt;f.y+=f.vy*dt}falling=falling.filter(f=>f.y<AH+40);
        if(shot){for(let s=0;s<4;s++){shot.x+=shot.vx*dt/4;shot.y+=shot.vy*dt/4;if(shot.x<RAD||shot.x>AW-RAD)shot.vx*=-1;
            let hit=shot.y<44+off;if(!hit)for(let r=0;r<grid.length&&!hit;r++)for(let c=0;c<(grid[r]||[]).length;c++){if(grid[r][c]){const p=pos(r,c);if(Math.hypot(p.x-shot.x,p.y-shot.y)<RAD*1.8){hit=true;break}}}
            if(hit){const sp=snap(shot.x,shot.y);if(sp){const t=shot.t<0?(()=>{const n=nbs(sp.r,sp.c).find(([a,b])=>!grid[a][b].ani);return n?grid[n[0]][n[1]].t:0})():shot.t;grid[sp.r][sp.c]={t,ani:null};
                const grp=flood(sp.r,sp.c,b=>!b.ani&&b.t===t);grp.push([sp.r,sp.c]);const uniq=[...new Set(grp.map(p=>p+''))].map(v=>v.split(',').map(Number));
                if(uniq.length>=3){uniq.forEach(([a,b])=>{const p=pos(a,b);G.burst(p.x,p.y,COL[t],5);grid[a][b]=null});G.sfx('clear');G.addScore(uniq.length*10);dropFloat()}else G.sfx('place');
                shots++;if(shots%drop===0){off+=RAD*1.74;G.sfx('whoosh')}}
              shot=null;if(saved>=total)return G.win(shots<=total*6?3:shots<=total*10?2:1);
              const low=grid.some((row,r)=>row.some((b,c)=>b&&pos(r,c).y>430));if(low)return G.lose('쓰레기 방울이 바닥 선까지 내려왔어요!');break}}}
        G.setHud(`🐢 구출 ${saved}/${total}`,`🫧 ${shots}발`,`${drop-shots%drop}발 뒤 내려옴`)},
      draw(c){c.fillStyle=G.grad(0,AH,'#2E8BC0','#0B2A4A');c.fillRect(0,0,AW,AH);G.rr(0,440,AW,3,0,'rgba(255,120,120,.7)');
        grid.forEach((row,r)=>row.forEach((b,cI)=>{if(!b)return;const p=pos(r,cI);if(b.ani){G.circle(p.x,p.y,RAD-1,'rgba(255,255,255,.25)','#FFF',2);G.emo(b.ani,p.x,p.y,24)}else{G.circle(p.x,p.y,RAD-1,COL[b.t],'rgba(0,0,0,.35)',2);G.emo(TR[b.t],p.x,p.y,18)}}));
        for(const f of falling){G.circle(f.x,f.y,RAD-1,f.b.ani?'rgba(255,255,255,.3)':COL[f.b.t]);G.emo(f.b.ani||TR[f.b.t],f.x,f.y,18)}
        const sx=AW/2,sy=500;if(!shot){const a=Math.atan2(aim.y-sy,aim.x-sx);c.setLineDash([6,8]);c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=3;c.beginPath();c.moveTo(sx,sy);c.lineTo(sx+Math.cos(a)*200,sy+Math.sin(a)*200);c.stroke();c.setLineDash([])}
        const drawB=(t,x,y)=>{if(t<0){G.circle(x,y,RAD,'#FFF','#FF8AE0',3);G.emo('🌈',x,y,20)}else{G.circle(x,y,RAD,COL[t],'#111',2);G.emo(TR[t],x,y,18)}};
        if(shot)drawB(shot.t,shot.x,shot.y);else drawB(cur,sx,sy);drawB(next,sx+60,sy+14);G.text('다음',sx+60,sy+40,11)},
      down(x,y){aim={x,y}},move(x,y,dn){if(dn)aim={x,y:Math.min(y,480)}},
      up(x,y){if(shot)return;const sx=AW/2,sy=500,a=Math.atan2(Math.min(y,480)-sy,x-sx);if(Math.sin(a)>-.15)return;shot={x:sx,y:sy,vx:Math.cos(a)*620,vy:Math.sin(a)*620,t:cur};cur=next;next=G.ri(0,k-1);G.sfx('whoosh')}
    }}});

/* ---------- 환경 3: 미세먼지 볼 블라스트 (볼 블라스트) ---------- */
const POLL=[['미세먼지','가까운 곳은 걷거나 자전거를 타요'],['매연','대중교통을 이용하면 매연이 줄어요'],['플라스틱','다회용 컵과 장바구니를 써요'],['온실가스','안 쓰는 전기 플러그를 뽑아요'],['폐수','세제를 알맞게 써요'],['쓰레기','분리배출로 자원을 다시 써요']];
arcDefine({id:'eco_ballblast',ch:'eco',name:'미세먼지 볼 블라스트',tag:'튀는 공 부수기',from:'볼 블라스트 (Ball Blast)',icon:'💥',
  how:['화면을 좌우로 끌어 물대포를 움직여요. 물방울은 저절로 계속 나가요!','숫자가 적힌 오염 공을 맞혀 숫자를 0으로! 큰 공은 작은 공 둘로 나뉘어요.','공에 닿으면 하트가 줄어요. 모든 파도를 이겨 내면 성공! 공을 부수면 환경 지키는 방법을 알려 줘요.'],
  init(G){
    const waves=3+Math.round(G.d*4);let wave=0,balls=[],shots=[],px=AW/2,fire=0,hearts=3,inv=0,power=1,pT=0,keyD=0,between=1.2;
    const spawn=()=>{wave++;const n=(wave>=2&&G.d>.3)||(wave>=4)?2:1;for(let i=0;i<n;i++){const hp=Math.round((14+wave*10)*(1+G.d*2.6));const p=G.pick(POLL);balls.push({x:i?AW-60:60,y:120,vx:(i?-1:1)*70,vy:0,r:44,hp,max:hp,lab:p})}};
    return {
      boostText:'물대포 강화', boost(){power=2;pT=10},
      update(dt){if(keyD)px=G.clamp(px+keyD*380*dt,24,AW-24);inv=Math.max(0,inv-dt);pT=Math.max(0,pT-dt);if(!pT)power=1;
        if(!balls.length){between-=dt;if(between<=0){if(wave>=waves)return G.win(starsByHearts(hearts));spawn();between=1.4;G.sfx('boss')}}
        fire-=dt;if(fire<=0){fire=.085;shots.push({x:px+G.rand(-3,3),y:470})}
        for(const s of shots)s.y-=640*dt;
        for(const b of balls){b.vy+=520*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)}if(b.x>AW-b.r){b.x=AW-b.r;b.vx=-Math.abs(b.vx)}
          const floor=490-b.r;if(b.y>floor){b.y=floor;b.vy=-Math.sqrt(2*520*(floor-(110+(44-b.r)*2)))}
          if(!inv&&Math.abs(b.x-px)<b.r+14&&b.y+b.r>462){hearts--;inv=1.5;G.sfx('hurt');G.shake=8;if(hearts<=0)return G.lose('오염 공에 너무 많이 맞았어요!')}
          for(const s of shots){if(!s.hit&&Math.hypot(s.x-b.x,s.y-b.y)<b.r){s.hit=1;b.hp-=power;if(Math.random()<.2)G.sfx('tick')}}}
        shots=shots.filter(s=>s.y>-10&&!s.hit);
        const nb=[];for(const b of balls){if(b.hp>0){nb.push(b);continue}G.burst(b.x,b.y,'#BFEFFF',20);G.sfx('pop');G.addScore(Math.round(b.max));
          if(b.r>20){const hp=Math.ceil(b.max/2);[-1,1].forEach(d=>nb.push({x:b.x,y:b.y,vx:d*90,vy:-260,r:b.r*.68,hp,max:hp,lab:b.lab}))}else G.pop(`💡 ${b.lab[1]}`,AW/2,200,'#7FFFA0',14)}
        balls=nb;G.setHud(HEARTS(hearts),`🌊 ${wave}/${waves}파도`,power>1?'💪 강화!':`${G.lv}단계`)},
      draw(c){const clean=wave/waves;c.fillStyle=G.grad(0,AH,`rgb(${140-clean*40},${140+clean*50},${150+clean*80})`,'#3A4A3A');c.fillRect(0,0,AW,AH);G.rr(0,490,AW,50,0,'#5E8A4A');
        for(const s of shots)G.circle(s.x,s.y,4,'#BFEFFF');
        for(const b of balls){G.circle(b.x,b.y,b.r,'#6A5A6A','#2A1A2A',3);G.circle(b.x-b.r*.3,b.y-b.r*.3,b.r*.25,'rgba(255,255,255,.18)');G.text(String(b.hp),b.x,b.y-4,Math.max(14,b.r*.6),'#FFF');G.text(b.lab[0],b.x,b.y+b.r*.45,Math.max(9,b.r*.24),'#FFE9A8')}
        if(!(inv&&Math.floor(G.t*12)%2)){G.rr(px-20,466,40,24,8,'#3C8AF0','#1A2A4A',3);G.rr(px-6,452,12,18,4,'#BFEFFF','#1A2A4A',2)}
        if(!balls.length&&wave<waves)G.text(`${wave+1}번째 파도가 와요!`,AW/2,250,22)},
      down(x){px=G.clamp(x,24,AW-24)},move(x){px=G.clamp(x,24,AW-24)},
      key(k){if(k==='L')keyD=-1;if(k==='R')keyD=1},keyup(k){if(k==='L'||k==='R')keyD=0}
    }}});
