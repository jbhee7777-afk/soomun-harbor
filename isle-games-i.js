/* ===== 다시 만든 놀이 5: 저금 코인 푸셔(새 놀이) · 동전 합 10 · 저금 핀 뽑기 · 독도 바다 낚시 · 괭이갈매기.io · 설명 다듬기 ===== */

/* ---------- 경제 1 (새 놀이): 저금 코인 푸셔 — 동전을 떨어뜨려 밀어내기 · 목표 금액 모으기 ---------- */
const COINV=[[10,9.5,'#D99A4A','#8A5A20'],[50,10.5,'#E4E4EC','#8A8A9A'],[100,11.5,'#D8DCE4','#7A7E8A'],[500,14,'#F0F0F4','#8A8A9A']];
const SAVE_TIP=['목표를 정하고 모으면 더 잘 모여요!','100원짜리 10개면 1,000원!','갖고 싶은 것과 필요한 것을 나눠 봐요.','조금씩이라도 꾸준히 모으는 게 저축이에요.','500원짜리 2개면 1,000원!'];
arcDefine({id:'money_pusher',ch:'money',name:'저금 코인 푸셔',tag:'동전 떨어뜨려 밀어내기',from:'코인 푸셔 (오락실 동전 밀기)',icon:'🪙',
  how:['위쪽을 눌러 동전을 떨어뜨려요','밀판이 동전을 밀어 저금통으로 쏙!','목표 금액을 모으면 성공'],
  init(G){
    const WISH=[['🎮','게임기'],['⚽','축구공'],['📚','동화책'],['🧸','곰 인형'],['🚲','자전거'],['🎨','물감 세트']],wish=G.pick(WISH);
    const goal=Math.round((700+G.d*1200)/100)*100,hand0=20+Math.round(G.d*6),FX0=34,FX1=AW-34,FY0=130,FRONT=452,PW0=128;
    let coins=[],hand=hand0,saved=0,lost=0,t=0,py=PW0,pv=0,drops=[],falls=[],settle=0,tip=G.pick(SAVE_TIP),tipT=0,bonus=[];
    const mkCoin=(x,y,vi)=>{const v=COINV[vi];return {x,y,vx:0,vy:0,r:v[1],v:v[0],vi,spin:Math.random()*6}};
    const pickV=()=>{const r=Math.random();return r<.35?0:r<.6?1:r<.9?2:3};
    for(let row=0,y=FY0+100;y<FRONT-14;row++,y+=21)for(let x=FX0+12+(row%2)*11.5;x<FX1-10;x+=23){if(Math.random()<.08)continue;const vi=pickV();coins.push(mkCoin(x+G.rand(-1.5,1.5),y+G.rand(-1.5,1.5),vi===3&&Math.random()<.5?2:vi))}
    for(let i=0;i<3;i++)bonus.push({x:G.rand(80,AW-80),y:G.rand(300,400),vx:0,vy:0,r:15,v:500,gift:true});
    const pusher=()=>FY0+40+56*(.5-.5*Math.cos(t*(1.5+.3*G.d)));
    const all=()=>coins.concat(bonus);
    return {
      boostText:'동전 5개 더', boost(){hand+=5},
      update(dt){t+=dt;tipT=Math.max(0,tipT-dt);const ny=pusher(),dy=ny-py;pv=dy/Math.max(dt,1e-3);py=ny;if(dy>0){const A0=all(),dep=new Map(),q=[];A0.forEach(c=>{if(c.y-c.r<py+2&&c.x>FX0&&c.x<FX1){dep.set(c,0);q.push(c)}});for(let qi=0;qi<q.length;qi++){const a=q[qi],da=dep.get(a);for(const b of A0){if(dep.has(b)||b.y<a.y-2)continue;if(Math.hypot(b.x-a.x,b.y-a.y)<a.r+b.r+1.5){dep.set(b,da+1);q.push(b)}}}for(const [c,d] of dep){c.y+=dy*Math.max(.3,1-d*.06);c.x+=G.rand(-.3,.3)}}
        for(const d of drops){d.t+=dt*3.2}const land=drops.filter(d=>d.t>=1);drops=drops.filter(d=>d.t<1);for(const d of land){const c=mkCoin(d.x,py+12,2);c.vy=60;coins.push(c);G.sfx('tap')}
        const A=all();let moving=false;
        for(let it=0;it<3;it++){
          for(const c of A){if(c.y-c.r<py&&c.x>FX0&&c.x<FX1){c.y=py+c.r;if(pv>0)c.vy=Math.max(c.vy,pv)}
            if(c.y<FRONT-40){if(c.x<FX0+c.r){c.x=FX0+c.r;c.vx=Math.abs(c.vx)*.3}if(c.x>FX1-c.r){c.x=FX1-c.r;c.vx=-Math.abs(c.vx)*.3}}}
          for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const a=A[i],b=A[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy),m=a.r+b.r;
            if(d<m&&d>0){const nx=dx/d,ny2=dy/d,p=(m-d)/2;a.x-=nx*p;a.y-=ny2*p;b.x+=nx*p;b.y+=ny2*p;const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny2;if(rv<0){a.vx+=rv*nx*.5;a.vy+=rv*ny2*.5;b.vx-=rv*nx*.5;b.vy-=rv*ny2*.5}}}}
        for(const c of A){c.x+=c.vx*dt;c.y+=c.vy*dt;c.vx*=Math.pow(.12,dt);c.vy*=Math.pow(.12,dt);if(Math.hypot(c.vx,c.vy)>8)moving=true;
          if(c.y>FRONT+c.r*.4){c.out=1;falls.push({x:c.x,y:c.y,v:c.v,vi:c.vi,gift:c.gift,t:0,side:c.x<FX0-2||c.x>FX1+2});
            if(c.x<FX0-2||c.x>FX1+2){lost++;G.pop('옆으로 떨어졌어요',c.x<AW/2?70:AW-70,FRONT-10,'#FFB3B3',15)}else{saved+=c.v;G.sfx('coin');G.pop(`+${c.v}원`,c.x,FRONT-16,'#FFE27A',c.gift?24:18);if(c.gift){G.burst(c.x,FRONT,'#FF9FC0',20);G.sfx('star')}}}
          else if((c.x<FX0-4||c.x>FX1+4)&&c.y>FRONT-40){c.out=1;lost++}}
        coins=coins.filter(c=>!c.out);bonus=bonus.filter(c=>!c.out);for(const f of falls)f.t+=dt*2.5;falls=falls.filter(f=>f.t<1);
        if(saved>=goal&&!G.over){G.burst(AW/2,500,'#FFE27A',40);return G.win(hand>=hand0*.4?3:hand>=hand0*.15?2:1)}
        settle=(!hand&&!drops.length)?settle+dt:0;if(settle>5&&!G.over)return G.lose(`${saved.toLocaleString()}원 모았어요. 목표 ${goal.toLocaleString()}원까지 조금 더!`);
        G.setHud(`🪙 손에 ${hand}개`,`🐷 ${saved.toLocaleString()}/${goal.toLocaleString()}원`,`${wish[0]} ${wish[1]}`)},
      draw(c){c.fillStyle=G.grad(0,AH,'#3A1A5A','#140A24');c.fillRect(0,0,AW,AH);
        for(let i=0;i<14;i++){const on=Math.floor(G.t*4+i)%3===0;G.circle(14+i*25.5,16,5,on?'#FFE27A':'#6A4A2A');G.circle(14+i*25.5,AH-10,5,on?'#FF9FC0':'#6A4A2A')}
        G.rr(12,26,AW-24,62,16,'#FFF8E6','#D9A441',4);G.emo(wish[0],46,57,40);G.text(`${wish[1]} 사기`,AW/2+18,44,18,'#4A240E','center',null);
        G.rr(78,60,AW-104,16,8,'#E8D8B8');G.rr(78,60,(AW-104)*Math.min(1,saved/goal),16,8,'#FFC83A');G.text(`${saved.toLocaleString()} / ${goal.toLocaleString()}원`,AW/2+26,68,13,'#4A240E','center',null);
        /* 판 */
        G.rr(FX0-14,FY0-10,FX1-FX0+28,FRONT-FY0+18,14,'#1E2E4A','#8AA0D0',3);c.fillStyle=G.grad(FY0,FRONT,'#2E4A7A','#3E6AA8');c.fillRect(FX0,FY0,FX1-FX0,FRONT-FY0);
        c.strokeStyle='rgba(255,255,255,.07)';c.lineWidth=1;for(let y=FY0;y<FRONT;y+=24){c.beginPath();c.moveTo(FX0,y);c.lineTo(FX1,y);c.stroke()}
        G.rr(FX0-8,FY0,8,FRONT-40-FY0,3,'#C8D4F0');G.rr(FX1,FY0,8,FRONT-40-FY0,3,'#C8D4F0');
        G.text('🕳️',FX0-6,FRONT-14,16,'#FFF','center',null);G.text('🕳️',FX1+6,FRONT-14,16,'#FFF','center',null);
        /* 밀판 */
        const g=c.createLinearGradient(0,FY0,0,py);g.addColorStop(0,'#8A9AC0');g.addColorStop(1,'#E8EEFF');c.fillStyle=g;c.fillRect(FX0,FY0-6,FX1-FX0,py-FY0+6);
        for(let x=FX0+10;x<FX1-16;x+=28)G.rr(x,py-14,16,6,3,'#FFC83A');G.rr(FX0,py-3,FX1-FX0,5,2,'#5A6A90');
        for(const k of all()){c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(k.x+2,k.y+3,k.r,k.r*.8,0,0,6.29);c.fill();
          if(k.gift){G.emo('🎁',k.x,k.y,30);continue}const v=COINV[k.vi],cg=c.createRadialGradient(k.x-k.r*.35,k.y-k.r*.4,1,k.x,k.y,k.r);cg.addColorStop(0,'#FFFFFF');cg.addColorStop(.5,v[2]);cg.addColorStop(1,v[3]);
          G.circle(k.x,k.y,k.r,cg,v[3],1.5);G.circle(k.x,k.y,k.r*.72,null,'rgba(0,0,0,.18)',1);G.text(String(k.v),k.x,k.y+.5,k.v>=100?k.r*.75:k.r*.85,'#4A3420','center',null)}
        /* 앞 가장자리 · 저금통 */
        c.save();c.shadowColor='#FFE27A';c.shadowBlur=12;G.rr(FX0,FRONT,FX1-FX0,5,2,'#FFE27A');c.restore();
        for(const f of falls){const y=f.y+f.t*60,a=1-f.t;if(f.gift)G.emo('🎁',f.x,y,26,a);else G.circle(f.x,y,COINV[f.vi][1]*(1-f.t*.4),COINV[f.vi][2])}
        G.emo('🐷',AW/2,505,58);
        for(const d of drops){const y=G.lerp(FY0-60,py+12,d.t),s=1.6-d.t*.6;c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(d.x,py+12,11*d.t,8*d.t,0,0,6.29);c.fill();G.circle(d.x,y,11.5*s,'#D8DCE4','#7A7E8A',2);G.text('100',d.x,y,9*s,'#4A3420','center',null)}
        if(hand&&!drops.length&&G.t<4)G.text('👆 위쪽을 눌러 동전 떨어뜨리기',AW/2,FY0+70,18,'#FFFFFF','center','#1A1030');
        if(tipT)G.text(`💡 ${tip}`,AW/2,AH-40,15,'#FFE9A8','center','#1A1030')},
      tap(x,y){if(y>FY0+120)return;if(hand<=0){G.sfx('no');G.pop('동전을 다 썼어요',AW/2,FY0+40,'#FFB3B3',18);return}if(drops.length>=2)return;
        hand--;drops.push({x:G.clamp(x,FX0+16,FX1-16),t:0});G.sfx('whoosh');if(hand%6===0){tip=G.pick(SAVE_TIP);tipT=3}}
    }}});

/* ---------- 경제 2: 동전 합 10 — 저학년은 짝꿍 동전이 붙어 있고, 짝꿍 힌트 · 판이 막히면 새 동전 ---------- */
arcDefine({id:'money_apple',ch:'money',name:'동전 합 10',tag:'숫자 묶기',from:'사과 게임 (Fruit Box)',icon:'🔟',
  how:['손가락으로 네모를 그려 묶어요','합이 딱 10이면 저금통으로 쏙!','예: 3+7 · 2+5+3'],
  init(G){
    const low=G.grade<=2,mid=G.grade<=4,C=low?6:mid?7:8,R=low?7:mid?9:10,cs=low?54:mid?46:40,ox=(AW-C*cs)/2,oy=low?40:34;
    const goal=low?10+Math.round(G.d*14):mid?20+Math.round(G.d*40):25+Math.round(G.d*65),T=Math.round(low?130-20*G.d:mid?110-20*G.d:100-20*G.d),pairBias=low?1:mid?.6:0;
    let g=[...Array(R)].map(()=>Array(C).fill(0)),sel=null,got=0,time=T,idle=0,hintBox=null,msg=null;
    const fill=()=>{const cells=G.shuffle([...Array(R*C)].map((_,i)=>i).filter(i=>!g[Math.floor(i/C)][i%C]));
      for(const i of cells){const r=Math.floor(i/C),c=i%C;if(g[r][c])continue;
        if(Math.random()<pairBias){const nb=G.shuffle([[0,1],[1,0],[0,-1],[-1,0]]).map(([a,b])=>[r+a,c+b]).find(([a,b])=>a>=0&&b>=0&&a<R&&b<C&&!g[a][b]);
          if(nb){const v=low?G.ri(1,9):G.ri(1,9);g[r][c]=v;g[nb[0]][nb[1]]=10-v;continue}}
        g[r][c]=low?G.ri(1,9):G.ri(1,9)}};fill();
    const cell=(x,y)=>[G.clamp(Math.floor((y-oy)/cs),0,R-1),G.clamp(Math.floor((x-ox)/cs),0,C-1)];
    const box=()=>{if(!sel)return null;const [r0,c0]=sel.a,[r1,c1]=sel.b;return [Math.min(r0,r1),Math.min(c0,c1),Math.max(r0,r1),Math.max(c0,c1)]};
    const sumOf=b=>{let s=0;for(let r=b[0];r<=b[2];r++)for(let c=b[1];c<=b[3];c++)s+=g[r][c]||0;return s};
    const findMove=()=>{for(let r0=0;r0<R;r0++)for(let c0=0;c0<C;c0++)for(let r1=r0;r1<Math.min(R,r0+4);r1++)for(let c1=c0;c1<Math.min(C,c0+4);c1++){const b=[r0,c0,r1,c1];if(g[r0][c0]&&sumOf(b)===10)return b}return null};
    return {
      boostText:'시간 +15초', boost(){time+=15},
      update(dt){time-=dt;idle+=dt;if(msg){msg.t-=dt;if(msg.t<=0)msg=null}if(time<=0)return G.lose(`시간이 다 됐어요! (${got}/${goal})`);
        if(idle>(low?5:8)&&!hintBox)hintBox=findMove();G.setHud(TIME(time),`🪙 ${got}/${goal}`,`${G.lv}단계`)},
      draw(c){for(let r=0;r<R;r++)for(let k=0;k<C;k++){const v=g[r][k];if(!v)continue;const x=ox+k*cs+cs/2,y=oy+r*cs+cs/2,rr=cs*.43;
          const cg=c.createRadialGradient(x-rr*.35,y-rr*.4,2,x,y,rr);cg.addColorStop(0,'#FFF6C8');cg.addColorStop(.55,'#FFD24A');cg.addColorStop(1,'#C8901A');G.circle(x,y+2,rr,'rgba(0,0,0,.3)');G.circle(x,y,rr,cg,'#8A5410',2.5);G.text(String(v),x,y+1,cs*.5,'#5A3410','center',null)}
        if(hintBox){const b=hintBox;G.rr(ox+b[1]*cs,oy+b[0]*cs,(b[3]-b[1]+1)*cs,(b[2]-b[0]+1)*cs,10,null,`rgba(255,255,255,${.5+.5*Math.sin(G.t*8)})`,4)}
        const b=box(),ty=oy+R*cs+24;if(b){const s=sumOf(b);G.rr(ox+b[1]*cs,oy+b[0]*cs,(b[3]-b[1]+1)*cs,(b[2]-b[0]+1)*cs,10,s===10?'rgba(127,214,154,.35)':'rgba(255,255,255,.15)',s===10?'#7FD69A':s>10?'#FF6A5A':'#FFF',3);
          const one=b[0]===b[2]&&b[1]===b[3]&&g[b[0]][b[1]];G.text(one&&low?`${g[b[0]][b[1]]}의 짝꿍은 ${10-g[b[0]][b[1]]}!`:`합 ${s}`,AW/2,ty,24,s===10?'#7FD69A':s>10?'#FF8A8A':'#FFF3D6')}
        else G.text(msg?msg.s:'네모를 그려 합 10을 만들어요',AW/2,ty,msg?20:19,msg?'#FFE27A':'#FFE9A8')},
      down(x,y){idle=0;hintBox=null;const p=cell(x,y);sel={a:p,b:p}},move(x,y,dn){if(dn&&sel)sel.b=cell(x,y)},
      up(){const b=box();sel=null;if(!b)return;const s=sumOf(b);if(s!==10){if(s>10)G.sfx('no');return}
        let n=0;for(let r=b[0];r<=b[2];r++)for(let c=b[1];c<=b[3];c++)if(g[r][c]){n++;G.burst(ox+c*cs+cs/2,oy+r*cs+cs/2,'#FFE27A',5);g[r][c]=0}
        got+=n;G.sfx('clear');try{sfx.clear(n)}catch(e){}G.addScore(n*10);if(got>=goal)return G.win(time>T*.45?3:time>T*.2?2:1);
        if(!findMove()){fill();msg={s:'새 동전이 왔어요!',t:2};G.sfx('unlock')}}
    }}});

/* ---------- 경제 3: 저금 핀 뽑기 — 저금통 · 기부함 · 쓰레기통 여러 곳 · 경사 핀(길 바꾸기) · 뽑으면 안 되는 핀 ----------
   단계마다 손으로 만든 판. 순서를 틀리면 금화가 엉뚱한 곳으로 가요. 높은 단계는 좌우를 뒤집고 구슬이 늘어요. */
const PIN_LV=[
  {h:'경사 핀이 금화를 어디로 보낼까요?',bins:[[8,180,'trash'],[180,352,'pig']],w:[[140,50,140,160],[220,50,220,160],[125,305,265,350]],
    p:[[140,160,220,160],[252,205,102,255]],b:[['g',146,58,68,96,12]],need:{pig:'g'}},
  {h:'금화 먼저! 충동구매 구슬은 쓰레기통으로',bins:[[8,180,'trash'],[180,352,'pig']],w:[[30,40,30,140],[120,40,120,140],[240,40,240,140],[330,40,330,140],[30,175,150,225],[330,175,210,225],[240,320,80,375]],
    p:[[30,140,120,140],[240,140,330,140],[140,250,290,300]],b:[['g',36,50,78,82,10],['x',246,50,78,82,8]],need:{pig:'g',trash:'x'}},
  {h:'빈 동전은 금화에 닿아야 금화가 돼요',bins:[[8,180,'trash'],[180,352,'pig']],w:[[130,30,130,110],[230,30,230,110],[110,140,110,250],[250,195,250,250],[270,30,270,120],[345,30,345,120],[345,150,240,182],[95,300,265,345]],
    p:[[130,110,230,110],[110,250,250,250],[270,120,345,120]],trap:[2],b:[['e',136,36,88,66,10],['g',116,205,128,40,6],['x',276,36,64,78,6]],need:{pig:'ge'},ratio:.85},
  {h:'저금통에도, 기부함에도 금화를!',bins:[[8,120,'pig'],[120,240,'trash'],[240,352,'give']],w:[[130,20,130,135],[230,20,230,135],[235,250,100,300],[255,20,255,110],[340,20,340,110]],
    p:[[130,72,230,72],[130,135,230,135],[120,170,262,215],[255,110,340,110]],trap:[3],b:[['g',136,26,88,40,8],['g',136,80,88,48,8],['x',262,28,72,72,6]],need:{pig:'g',give:'g'},split:[[0,'pig'],[1,'give']]},
  {h:'빈 동전 → 금화 → 저금통, 충동구매는 쓰레기통',bins:[[8,180,'trash'],[180,352,'pig']],w:[[30,30,30,110],[120,30,120,110],[30,140,30,230],[120,140,120,230],[240,60,240,180],[330,60,330,180],[30,260,150,300],[330,250,210,300],[240,385,80,430]],
    p:[[30,110,120,110],[30,230,120,230],[240,180,330,180],[140,320,290,365]],b:[['e',36,36,78,66,8],['g',36,150,78,72,6],['x',246,70,78,100,8]],need:{pig:'ge',trash:'x'},ratio:.85},
  {h:'빈 동전 두 무리 다 금화로! 충동구매는 마지막',bins:[[8,180,'trash'],[180,352,'pig']],w:[[120,200,120,290],[240,200,240,290],[20,40,20,130],[110,40,110,130],[20,160,128,193],[250,40,250,130],[340,40,340,130],[340,160,232,193],[140,30,140,110],[220,30,220,110],[230,380,90,425]],    p:[[20,130,110,130],[250,130,340,130],[120,290,240,290],[110,320,250,360],[140,110,220,110]],b:[['e',26,46,78,74,7],['e',256,46,78,74,7],['g',126,236,108,48,5],['x',146,36,68,64,6]],need:{pig:'ge',trash:'x'},ratio:.85},
  {h:'세 곳 모두 채워요! 길 바꾸는 핀 순서가 핵심',bins:[[8,120,'pig'],[120,240,'trash'],[240,352,'give']],w:[[20,40,20,120],[110,40,110,120],[20,150,125,185],[250,40,250,120],[340,40,340,120],[340,150,235,185],[140,30,140,100],[220,30,220,100]],    p:[[20,120,110,120],[250,120,340,120],[140,100,220,100],[110,230,255,270],[250,300,105,340]],b:[['g',26,46,78,66,8],['g',256,46,78,66,8],['x',146,36,68,56,6]],need:{pig:'g',give:'g',trash:'x'},split:[[0,'give'],[1,'pig']],ratio:.8}];
arcDefine({id:'money_pin',ch:'money',name:'저금 핀 뽑기',tag:'핀 뽑기 순서 퍼즐',from:'풀 더 핀 (Pull the Pin)',icon:'📌',
  how:['핀을 눌러 뽑아요 · 순서가 중요해요','금화는 🐷저금통 · 💝기부함으로','충동구매 구슬은 🗑️쓰레기통으로만'],
  init(G){
    const ORDER=[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[4,1],[5,1],[6,1]],li=ORDER[(G.lv-1)%10][0],mir=!!ORDER[(G.lv-1)%10][1],L=PIN_LV[li],RT=L.ratio||.75,M=v=>mir?AW-v:v,BR=7;
    const seg=s=>mir?[M(s[0]),s[1],M(s[2]),s[3]]:s.slice();
    let walls=[[8,0,8,560],[352,0,352,560],...L.w.map(seg)],bins=L.bins.map(([a,b,k])=>mir?[AW-b,AW-a,k]:[a,b,k]).sort((p,q)=>p[0]-q[0]);
    bins.slice(1).forEach(b=>walls.push([b[0],452,b[0],560]));
    let pins=L.p.map((s,i)=>({s:seg(s),out:0,pull:false,trap:(L.trap||[]).includes(i)})),balls=[];
    const extra=Math.round(G.d*3);L.b.forEach(([t,x,y,w,h,n],gi)=>{const N=n+(t==='x'?0:extra);for(let i=0;i<N;i++){const bx=mir?AW-x-w:x;balls.push({x:bx+G.rand(BR,w-BR),y:y+G.rand(BR,h-BR),vx:0,vy:0,t,in:null,grp:gi})}});
    const binOf=x=>bins.find(b=>x>=b[0]&&x<b[1]);
    const goldN=balls.filter(b=>b.t!=='x').length,blackN=balls.filter(b=>b.t==='x').length;
    const want={};for(const k in L.need)want[k]=k==='trash'?Math.ceil(blackN*.75):0;
    if(L.split){L.split.forEach(([gi,k])=>{want[k]=Math.ceil(balls.filter(b=>b.grp===gi).length*RT)})}else for(const k in L.need)if(k!=='trash')want[k]=Math.ceil(goldN*RT);
    let ended=false,settle=0,pulled=0,fact=G.pick(PIG_FACT);
    const segs=()=>[...walls,...pins.filter(p=>!p.pull).map(p=>p.s)];
    const coll=(b,s)=>{const [x1,y1,x2,y2]=s,dx=x2-x1,dy=y2-y1,L2=dx*dx+dy*dy||1;let k=((b.x-x1)*dx+(b.y-y1)*dy)/L2;k=Math.max(0,Math.min(1,k));const px=x1+dx*k,py=y1+dy*k,ddx=b.x-px,ddy=b.y-py,d=Math.hypot(ddx,ddy);
      if(d<BR+3&&d>0){const nx=ddx/d,ny=ddy/d,pen=BR+3-d;b.x+=nx*pen;b.y+=ny*pen;const vn=b.vx*nx+b.vy*ny;if(vn<0){b.vx-=1.4*vn*nx;b.vy-=1.4*vn*ny}b.vx*=.985;b.vy*=.985}};
    const count=k=>balls.filter(b=>b.in===k&&(k==='trash'?b.t==='x':b.t==='g')).length;
    const ICON={pig:'🐷',trash:'🗑️',give:'💝'},NAME={pig:'저금통',trash:'쓰레기통',give:'기부함'};
    const done=()=>Object.keys(want).every(k=>count(k)>=want[k]);
    return {
      boostText:'힌트 보기', boost(){const p=pins.find(p=>!p.pull&&!p.trap);if(p){p.hint=4}G.pop(L.h,AW/2,40,'#FFE27A',16)},
      update(dt){const n=3;for(let it=0;it<n;it++){const h=dt/n;
          for(const b of balls){if(b.in)continue;b.vy+=900*h;b.x+=b.vx*h;b.y+=b.vy*h;for(const s of segs())coll(b,s);
            if(b.y>470){const bn=binOf(b.x);b.in=bn?bn[2]:'trash';if(b.t==='x'&&b.in!=='trash'&&!ended){ended=true;G.sfx('boom');G.shake=8;return G.lose(`충동구매 구슬이 ${NAME[b.in]}에 들어갔어요! 순서를 다시 생각해요.`)}
              G.sfx(b.t==='g'&&b.in!=='trash'?'coin':'tap')}}
          for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){const a=balls[i],b=balls[j];if(a.in||b.in)continue;const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
            if(d<BR*2&&d>0){const nx=dx/d,ny=dy/d,p=(BR*2-d)/2;a.x-=nx*p;a.y-=ny*p;b.x+=nx*p;b.y+=ny*p;const rv=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rv<0){a.vx+=rv*nx*.5;a.vy+=rv*ny*.5;b.vx-=rv*nx*.5;b.vy-=rv*ny*.5}
              if(a.t==='x'&&b.t!=='x')b.t='x';else if(b.t==='x'&&a.t!=='x')a.t='x';else if(a.t==='g'&&b.t==='e')b.t='g';else if(b.t==='g'&&a.t==='e')a.t='g'}}}
        for(const p of pins){if(p.pull)p.out+=dt*500;if(p.hint)p.hint=Math.max(0,p.hint-dt)}
        const moving=balls.some(b=>!b.in&&Math.hypot(b.vx,b.vy)>20);settle=moving?0:settle+dt;
        if(!ended&&settle>.7&&done()){ended=true;const extraOk=Object.keys(want).every(k=>count(k)>=Math.min(want[k]/RT*.95,want[k]+3));return G.win(extraOk&&pulled<=pins.filter(p=>!p.trap).length?3:2)}
        if(!ended&&settle>1.4&&pins.every(p=>p.pull||p.trap)){ended=true;return G.lose(Object.keys(want).map(k=>`${ICON[k]} ${count(k)}/${want[k]}`).join(' · ')+' — 핀 순서를 바꿔 봐요!')}
        G.setHud(Object.keys(want).map(k=>`${ICON[k]}${count(k)}/${want[k]}`).join(' '),`📌 ${pulled}개`,`${G.lv}단계`)},
      draw(c){c.fillStyle=G.grad(0,AH,'#FFF6E4','#F4DDB0');c.fillRect(0,0,AW,AH);
        c.fillStyle='rgba(200,150,90,.08)';for(let y=30;y<AH;y+=28)for(let x=(y/28%2)*14;x<AW;x+=28){c.beginPath();c.arc(x,y,2,0,6.29);c.fill()}
        /* 나무 벽: 그림자 · 몸통 · 밝은 결 */
        c.lineCap='round';for(const [w,col,dy] of [[12,'rgba(60,30,10,.25)',3],[10,'#6B3F1C',0],[7,'#B07A44',0],[2.5,'#E2B07A',-2]])for(const s2 of walls){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(s2[0],s2[1]+dy);c.lineTo(s2[2],s2[3]+dy);c.stroke()}
        /* 받는 곳: 저금통 · 쓰레기통 · 기부함 */
        for(const b of bins){const k=b[2],x=b[0]+4,w=b[1]-b[0]-8,top={pig:'#FFC4D6',trash:'#C8D0D8',give:'#FFD6E6'}[k],bot={pig:'#F28AAE',trash:'#8E99A6',give:'#E88AB0'}[k],g=c.createLinearGradient(0,474,0,534);g.addColorStop(0,top);g.addColorStop(1,bot);
          G.rr(x,478,w,58,14,'rgba(60,30,10,.25)');G.rr(x,474,w,58,14,g,'#6B3D1F',2.5);G.rr(x+8,478,w-16,7,4,'rgba(255,255,255,.55)');G.emo(ICON[k],x+w/2,496,30);
          const done=want[k]!=null&&count(k)>=want[k];G.text(`${NAME[k]}${want[k]!=null?` ${count(k)}/${want[k]}`:''}${done?' ✔':''}`,x+w/2,522,14,done?'#1F6B3A':'#3A240E','center',null)}
        /* 핀: 은색 막대 + 금색 고리 손잡이 */
        for(const p of pins){const [x1,y1,x2,y2]=p.s,L2=Math.hypot(x2-x1,y2-y1)||1,ux=(x2-x1)/L2,uy=(y2-y1)/L2,o=p.out;c.save();c.translate(ux*o,uy*o);
          for(const [w,col,dy] of [[10,'rgba(40,40,60,.25)',3],[8,'#7A8296',0],[6,'#C9CFDD',0],[2,'#FFFFFF',-1.5]]){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(x1,y1+dy);c.lineTo(x2,y2+dy);c.stroke()}
          const hx=(x1+x2)/2,hy=(y1+y2)/2,on=p.hint&&Math.floor(G.t*6)%2;G.circle(hx+1,hy+3,13,'rgba(60,30,10,.3)');
          const kg=c.createRadialGradient(hx-4,hy-4,2,hx,hy,14);kg.addColorStop(0,on?'#FFFFFF':'#FFF2B0');kg.addColorStop(.6,on?'#FFF3B0':'#F5B820');kg.addColorStop(1,'#B07810');G.circle(hx,hy,13,kg,'#7A5008',2);G.circle(hx,hy,5,'#F4DDB0','#7A5008',1.5);c.restore()}
        /* 구슬: 금화 · 빈 동전 · 충동구매 구슬 */
        const R2=BR+1;for(const b of balls){if(b.in)continue;const x=b.x,y=b.y;
          if(b.t==='g'){G.circle(x,y+1.5,R2,'#9A6A08');const g=c.createRadialGradient(x-2.5,y-3,1,x,y,R2);g.addColorStop(0,'#FFFBD8');g.addColorStop(.45,'#FFD84A');g.addColorStop(1,'#D89A10');G.circle(x,y,R2,g,'#8A5A06',1.3);G.circle(x,y,R2*.62,null,'rgba(150,95,5,.7)',1);G.text('₩',x,y+.6,R2*1.15,'#9A6408','center',null);c.fillStyle='rgba(255,255,255,.75)';c.beginPath();c.ellipse(x-R2*.38,y-R2*.42,R2*.28,R2*.14,-.6,0,6.29);c.fill()}
          else if(b.t==='e'){G.circle(x,y+1.5,R2,'#8A8E98');const g=c.createRadialGradient(x-2.5,y-3,1,x,y,R2);g.addColorStop(0,'#FFFFFF');g.addColorStop(1,'#B4B9C4');G.circle(x,y,R2,g,'#7A7E88',1.3);c.setLineDash([2,2]);G.circle(x,y,R2*.6,null,'#8A8E98',1);c.setLineDash([])}
          else{c.save();c.shadowColor='#FF3A5A';c.shadowBlur=6;const g=c.createRadialGradient(x-2.5,y-3,1,x,y,R2);g.addColorStop(0,'#6A5A7A');g.addColorStop(1,'#120E18');G.circle(x,y,R2,g,'#FF4A6A',1.6);c.restore();c.fillStyle='#FF6A80';c.fillRect(x-.9,y-R2*.5,1.8,R2*.6);c.fillRect(x-.9,y+R2*.25,1.8,1.8)}}
        G.rr(14,4,AW-28,22,11,'rgba(255,255,255,.7)');G.text(`💡 ${L.h}`,AW/2,15,14,'#6B3D1F','center',null)},
      tap(x,y){const d=(p)=>{const [x1,y1,x2,y2]=p.s,dx=x2-x1,dy=y2-y1,L2=dx*dx+dy*dy;let k=((x-x1)*dx+(y-y1)*dy)/L2;k=Math.max(0,Math.min(1,k));return Math.hypot(x-(x1+dx*k),y-(y1+dy*k))};
        const cand=pins.filter(p=>!p.pull&&d(p)<18).sort((a,b)=>d(a)-d(b))[0];if(cand){cand.pull=true;pulled++;G.sfx('whoosh')}}
    }}});

/* ---------- 독도 1: 독도 바다 낚시 — 물고기 떼가 모인 곳에 타이밍 맞춰 던지기 ---------- */
arcDefine({id:'dokdo_fish',ch:'dokdo',name:'독도 바다 낚시',tag:'타이밍 던지기 낚시',from:'낚시 게임 · 피싱 타이밍',icon:'🎣',
  how:['움직이는 과녁이 물고기 떼 위에 올 때 톡!','떼 한가운데일수록 많이 올라와요','주문서 생물을 다 낚으면 성공'],
  init(G){
    const SEA=205,want=G.shuffle(DFISH.slice(0,5)).slice(0,2+(G.d>.45?1:0)).map((f,i)=>({f,need:2+(i===0?1:0)+Math.round(G.d*3),got:0}));
    let time=Math.round(95-20*G.d),shoals=[],cast=null,catchA=[],card=null,clean=0,combo=0,banner=null,cool=0;
    const W=.9+1.3*G.d;let ax=AW/2,ay=320,ph=Math.random()*6;
    const mkShoal=()=>{const ws=want.filter(w=>w.got<w.need),f=Math.random()<.7&&ws.length?G.pick(ws).f:G.pick(DFISH);return {f,x:G.rand(50,AW-50),y:G.rand(SEA+40,440),vx:G.rand(18,40)*(Math.random()<.5?-1:1),n:G.ri(3,7),ph:Math.random()*6,trash:false}};
    for(let i=0;i<3+Math.round(G.d*2);i++)shoals.push(mkShoal());
    if(Math.random()<.7)shoals.push({f:['🥫','바다 쓰레기','바다 쓰레기를 건져 독도 바다가 깨끗해졌어요!',1,true],x:G.rand(60,AW-60),y:G.rand(SEA+40,420),vx:12,n:1,ph:0,trash:true});
    const TIP=[AW/2+38,446];
    return {
      boostText:'시간 +15초', boost(){time+=15},
      update(dt){time-=dt;cool=Math.max(0,cool-dt);if(banner){banner.t-=dt;if(banner.t<=0)banner=null}if(card){card.t-=dt;if(card.t<=0)card=null}if(time<=0)return G.lose('시간이 다 됐어요!');
        ph+=dt*W;ax=AW/2+Math.sin(ph*1.3)*150;ay=SEA+130+Math.sin(ph*2.1+1)*95;
        for(const s of shoals){s.ph+=dt;s.x+=s.vx*dt;if(s.x<40||s.x>AW-40){s.vx*=-1;s.x=G.clamp(s.x,40,AW-40)}s.y+=Math.sin(s.ph*.8)*8*dt}
        if(cast){cast.t+=dt*2.4;if(cast.t>=1&&!cast.done){cast.done=1;G.sfx('pop');G.burst(cast.x,cast.y,'#BFEFFF',14);let best=null,bd=1e9;for(const s of shoals){const d=Math.hypot(s.x-cast.x,s.y-cast.y);if(d<bd){bd=d;best=s}}
            const R=40+Math.min(20,best?best.n*3:0);if(best&&bd<R){const close=1-bd/R,k=Math.max(1,Math.min(best.n,1+Math.floor(close*close*best.n*1.2)));best.n-=k;
              for(let i=0;i<k;i++)catchA.push({e:best.f[0],x:cast.x+G.rand(-14,14),y:cast.y,t:-i*.08,f:best.f,trash:best.trash});
              if(best.trash){clean++;G.addScore(20)}else{const w=want.find(w=>w.f===best.f);if(w)w.got=Math.min(w.need,w.got+k);G.addScore(10*k)}
              combo=k;if(k>=3){banner={t:`대박! ${k}마리!`,k:1.2};G.sfx('star')}else G.sfx('coin');
              if(!best.trash&&!card)card={f:best.f,t:2.6};if(best.n<=0){shoals=shoals.filter(s=>s!==best);setTimeout(()=>{if(!G.over)shoals.push(mkShoal())},900)}
              if(want.every(w=>w.got>=w.need))setTimeout(()=>{if(!G.over)G.win(time>45?3:time>20?2:1)},800)}
            else{G.pop('첨벙! 물고기가 없어요',G.clamp(cast.x,110,AW-110),cast.y-24,'#BFEFFF',18);combo=0}}
          if(cast.t>=1.7)cast=null}
        for(const c of catchA)c.t+=dt*1.6;catchA=catchA.filter(c=>c.t<1);
        G.setHud(TIME(time),want.map(w=>`${w.f[0]}${w.got}/${w.need}`).join(' '),clean?`🧹 ${clean}`:`${G.lv}단계`)},
      draw(c){const im=v2img('dokdo_sea.jpg');if(im)drawCover(c,im,0,0,AW,AH);else{c.fillStyle=G.grad(0,AH,'#9FD8FF','#0B3A60');c.fillRect(0,0,AW,AH)}if(typeof drawTaegeukgi==='function'){c.fillStyle='#E8E8EE';c.fillRect(280,102,2,30);drawTaegeukgi(c,282,101,26,Math.sin(G.t*3)*.5)}
        for(const s of shoals){for(let i=0;i<s.n;i++){const a=i*2.4+s.ph*1.5,r=8+(i%3)*9,x=s.x+Math.cos(a)*r*1.4,y=s.y+Math.sin(a)*r*.6;c.fillStyle='rgba(10,40,70,.45)';c.beginPath();c.ellipse(x,y+3,12,5,0,0,6.29);c.fill();G.emo(s.f[0],x,y,s.trash?26:22,.9)}
          c.strokeStyle=`rgba(255,255,255,${.25+.15*Math.sin(s.ph*4)})`;c.lineWidth=2;c.beginPath();c.ellipse(s.x,s.y,30+s.n*3,12+s.n,0,0,6.29);c.stroke();if(s.n>=5)G.text('✨',s.x+28,s.y-14,14,'#FFF','center',null)}
        if(!cast){c.save();c.translate(ax,ay);c.rotate(G.t);c.strokeStyle='#FFE27A';c.lineWidth=3;c.setLineDash([8,6]);c.beginPath();c.arc(0,0,22,0,6.29);c.stroke();c.restore();c.setLineDash([]);G.circle(ax,ay,4,'#FFE27A');}
        /* 배 · 아이 · 낚싯대 */
        c.fillStyle='#8A4A22';c.beginPath();c.moveTo(AW/2-80,462);c.lineTo(AW/2+80,462);c.lineTo(AW/2+60,500);c.lineTo(AW/2-60,500);c.closePath();c.fill();G.rr(AW/2-82,456,164,10,4,'#C07A3A');
        G.emo('🧒',AW/2-6,438,40);c.strokeStyle='#5A3A1A';c.lineWidth=4;c.beginPath();c.moveTo(AW/2+4,452);c.lineTo(TIP[0],TIP[1]-40);c.stroke();
        if(cast){const e=Math.min(1,cast.t),x=G.lerp(TIP[0],cast.x,e),y=G.lerp(TIP[1]-40,cast.y,e)-Math.sin(e*Math.PI)*120,back=cast.t>1?Math.min(1,(cast.t-1)/.7):0,hx=G.lerp(x,TIP[0],back),hy=G.lerp(y,TIP[1]-40,back);
          c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=1.6;c.beginPath();c.moveTo(TIP[0],TIP[1]-40);c.quadraticCurveTo((TIP[0]+hx)/2,Math.min(TIP[1]-40,hy)-40,hx,hy);c.stroke();G.circle(hx,hy,6,'#FF4A4A','#FFF',2)}
        for(const k of catchA){if(k.t<0)continue;const e=k.t,x=G.lerp(k.x,AW/2,e),y=G.lerp(k.y,450,e)-Math.sin(e*Math.PI)*140;G.emo(k.e,x,y,30,1,e*8)}
        G.rr(8,AH-34,AW-16,28,12,'rgba(20,10,30,.7)');G.text(want.map(w=>`${w.f[0]} ${w.f[1]} ${w.got}/${w.need}`).join('   '),AW/2,AH-20,15,'#FFF3D6','center',null);
        if(card){G.rr(24,60,AW-48,104,16,'#FFF8E6','#6B3D1F',3);G.emo(card.f[0],62,112,44);G.text(`${card.f[1]} 낚았다!`,AW/2+20,82,20,'#A3303C','center',null);wrapText(c,card.f[2],AW-130,15).slice(0,3).forEach((t,i)=>G.text(t,AW/2+22,106+i*19,15,'#4A240E','center',null))}
        if(banner)G.text(banner.t,AW/2,230,32,'#FFE27A','center','#1A1030');
        if(!cast&&G.t<4)G.text('과녁이 물고기 떼 위에 오면 톡!',AW/2,SEA-20,18,'#FFFFFF','center','#0A2A4A')},
      down(){if(cast||cool)return;cast={x:ax,y:ay,t:0};cool=.3;G.sfx('whoosh')}
    }}});

/* 독도 3: 괭이갈매기.io 는 isle-games-k.js 에서 새로 만들었어요 */
/* ---------- 섬마다 놀이 3가지: 경제 섬은 마트 타이쿤 대신 저금 코인 푸셔 ---------- */
if(typeof ISLE_SET!=='undefined')ISLE_SET.money=['money_pusher','money_apple','money_pin'];

/* ---------- 설명: 짧고 크게 ---------- */
const HOW_SHORT={
  safety_match:['같은 그림 3개를 한 줄로!','4 · 5개를 맞추면 폭탄이 생겨요','이동 횟수 안에 목표 점수!'],
  character_merge:['같은 물건 2개를 겹치면 합쳐져요','주민이 원하는 물건을 전달해요'],
  career_block:['블록을 끌어 판에 놓아요','줄을 꽉 채우면 펑!','목표 점수를 넘겨요'],
  unify_drop:['끌어서 자리를 고르고 떼요','같은 친구 둘이 닿으면 합체!','점선 위로 넘치면 끝'],
  democracy_bus:['길이 열린 주민을 눌러요','같은 색 버스에 타요','기다리는 칸이 꽉 차면 실패'],
  democracy_arrows:['화살표를 누르면 그쪽으로 나가요','막힌 화살표는 나중에!'],
  democracy_brain:['여러 가지 생각 문제가 나와요','시간 안에 잘 읽고 풀어요'],
  rights_triple:['같은 타일 3개를 모으면 사라져요','아래 칸이 꽉 차면 실패'],
  rights_flow:['같은 그림끼리 선으로 이어요','선이 겹치면 안 돼요','판을 꽉 채우면 성공'],
  multi_hexa:['육각 더미를 끌어 빈 칸에 놓아요','같은 색 10개가 모이면 펑!'],
  multi_sort:['과일을 옮겨 한 칸에 한 종류씩!','위에 같은 과일이 있어야 쌓여요'],
  dokdo_slide:['빈칸 옆 조각을 눌러 옮겨요','독도 그림을 완성해요'],
  eco_bubble:['끌어서 겨누고 떼면 쏴요','같은 쓰레기 3개면 펑!','바다 친구를 모두 구해요']};
for(const id in HOW_SHORT)if(ARC_DEF[id])ARC_DEF[id].how=HOW_SHORT[id];

/* 설명 창: 큰 글씨 · 번호 3줄 */
function arcHow(){
  const def=AR.def,nm=AR.trial&&AR.trial.name||def.name;
  const sh=openModal(`<div class="arcKeep howbig"><div class="hbHead"><span class="hbIco">${arcIconHTML(def.icon)}</span><h2>${esc(nm)}</h2></div>
    <ol class="hbList">${def.how.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></div>
    <div class="row"><button class="cbtn mint" id="ok">알겠어요!</button></div>`);
  sh.querySelector('#ok').onclick=closeModal;
}
(function(){const st=document.createElement('style');st.textContent=`
.arcsel{grid-template-columns:minmax(0,1fr)}
.arcgrid{grid-template-columns:repeat(5,minmax(0,1fr))!important}
.arcinfo p{font-size:20px;line-height:1.35;margin:3px 0;color:#4A2A12}
.arcinfo h2{font-size:30px}
.howbig .hbHead{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:6px}
.howbig .hbIco{font-size:48px;font-family:${EMOF};line-height:1}.howbig .hbIco .arcspr{width:56px;height:56px}
.howbig h2{margin:0;font-size:30px}
.hbList{list-style:none;counter-reset:hb;padding:0;margin:10px auto;max-width:460px;text-align:left}
.hbList li{counter-increment:hb;display:flex;align-items:center;gap:12px;font-size:24px;line-height:1.3;color:#3A220E;padding:10px 12px;margin:8px 0;border-radius:16px;background:#FFF8E6;border:3px solid #E0C090}
.hbList li::before{content:counter(hb);flex:none;width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:#E08A1A;color:#FFF;font-size:22px}
@media (max-width:520px){.arcinfo p{font-size:18px}.hbList li{font-size:21px}}
`;document.head.appendChild(st)})();
