/* ===== 섬 도전 놀이 3/3: 경제·금융 · 환경 ===== */

/* ---------- 경제 1: 저금통 동전 받기 (받기 게임) ---------- */
arcDefine({id:'money_catch',ch:'dungeon',name:'저금통 동전 받기',tag:'떨어지는 것 받기',from:'캐치 게임 · 오락실 받기 게임',icon:'🐷',
  how:['화면을 좌우로 끌어 저금통🐷을 움직여요.','동전🪙·지폐💵·돈주머니💰를 받으면 저축이 늘어요.','사탕🍭·장난감🧸·게임기🎮는 충동구매! 받으면 저축이 줄어요.'],
  init(G){
    const goal=30+Math.round(G.d*50), fall=150+170*G.d, every=.55-.25*G.d;
    const GOOD=[['🪙',2],['💵',4],['💰',7]], BAD=[['🍭',-4],['🧸',-6],['🎮',-8],['👟',-6]];
    let px=AW/2,save0=0,objs=[],t=0,time=45,keyD=0;
    return {
      update(dt){time-=dt;if(time<=0)return G.lose(`시간이 다 됐어요! (${save0}/${goal})`);if(keyD)px=G.clamp(px+keyD*380*dt,30,AW-30);
        t-=dt;if(t<=0){t=every*G.rand(.6,1.3);const bad=Math.random()<.3+.15*G.d;const it=G.pick(bad?BAD:GOOD);objs.push({x:G.rand(24,AW-24),y:-30,e:it[0],v:it[1],sp:fall*G.rand(.85,1.25),r:G.rand(-2,2)})}
        for(const o of objs){o.y+=o.sp*dt;if(!o.got&&o.y>470&&o.y<510&&Math.abs(o.x-px)<40){o.got=1;save0=Math.max(0,save0+o.v);
          if(o.v>0){G.sfx('coin');G.pop('+'+o.v,o.x,450)}else{G.sfx('no');G.shake=4;G.pop('충동구매 '+o.v,o.x,450,'#FF8A8A',16)}
          if(save0>=goal)return G.win(time>45*.4?3:time>45*.2?2:1)}}
        objs=objs.filter(o=>o.y<AH+40&&!o.got);G.setHud(TIME(time),`🐷 ${save0}/${goal}`,`${G.lv}단계`)},
      draw(c){for(const o of objs)G.emo(o.e,o.x,o.y,34,1,o.r*G.t*.4);
        const s=40+Math.min(24,save0/goal*24);G.emo('🐷',px,490,s);G.rr(20,24,AW-40,14,7,'#3A2A3A');G.rr(20,24,(AW-40)*Math.min(1,save0/goal),14,7,'#FFD24A');G.text('저축 목표',AW/2,50,14)},
      down(x){px=G.clamp(x,30,AW-30)},move(x){px=G.clamp(x,30,AW-30)},
      key(k){if(k==='L')keyD=-1;if(k==='R')keyD=1},keyup(k){if(k==='L'||k==='R')keyD=0}
    }}});

/* ---------- 경제 2: 거스름돈 가게 (가게 타이쿤) ---------- */
arcDefine({id:'money_change',ch:'dungeon',name:'거스름돈 가게',tag:'가게 타이쿤',from:'가게 운영 타이쿤 게임',icon:'🧾',
  how:['손님이 낸 돈에서 물건값을 빼고 거스름돈을 만들어 줘요.','아래 동전·지폐를 눌러 쟁반에 담고 "건네기"!','틀리거나 손님이 오래 기다리면 하트가 줄어요. 가장 적은 개수로 주면 "최소 개수!"'],
  init(G){
    const ITEMS=[['🍞','빵'],['🥛','우유'],['✏️','연필'],['📒','공책'],['🍦','아이스크림'],['🧃','주스'],['🍪','과자'],['🎈','풍선'],['🧦','양말'],['🖍️','크레파스']];
    const lvl=G.d<.35?0:G.d<.7?1:2, goal=4+Math.round(G.d*4), patience=22-8*G.d;
    const MONEY=[10,50,100,500,1000,5000], ICON={10:'🟤',50:'⚪',100:'⚪',500:'🟡',1000:'💵',5000:'💶'};
    let cust=null,tray=[],hearts=3,served=0,minOK=0,wait=.4;
    const mk=()=>{let pay,price;if(lvl===0){pay=1000;price=G.ri(1,9)*100}else if(lvl===1){pay=5000;price=G.ri(3,98)*50}else{pay=10000;price=G.ri(30,998)*10}
      if(price>=pay)price=pay-100;return {it:G.pick(ITEMS),pay,price,t:patience,face:G.pick(['🧑','👩','👴','👧','👦','👵'])}};
    const minCount=v=>{let n=0;for(const m of [...MONEY].reverse()){n+=Math.floor(v/m);v%=m}return n};
    const avail=()=>MONEY.filter(m=>!cust||m<cust.pay);
    MONEY.forEach((m,i)=>G.btn(12+(i%3)*114,352+Math.floor(i/3)*58,104,50,`${m.toLocaleString()}원`,()=>{if(!cust||m>=cust.pay){G.sfx('no');return}tray.push(m);G.sfx('coin')},{fs:16,col:m>=1000?'#3F7A4A':'#8A6A2A'}));
    G.btn(12,470,104,52,'↶ 빼기',()=>{tray.pop();G.sfx('tap')},{fs:16,col:'#7A4A5A'});
    G.btn(126,470,222,52,'건네기 ✋',()=>give(),{fs:18,col:'#2F9E5B'});
    const give=()=>{if(!cust)return;const sum=tray.reduce((a,b)=>a+b,0),need=cust.pay-cust.price;
      if(sum===need){served++;const best=tray.length===minCount(need);if(best)minOK++;G.sfx('deliver');G.pop(best?'최소 개수! 👍':'고마워요!',AW/2,120,'#FFE27A');G.burst(AW/2,100,'#FFE27A',16);G.addScore(best?20:10);cust=null;tray=[];wait=.6;
        if(served>=goal)G.win(hearts===3&&minOK>=Math.ceil(goal/2)?3:hearts>=2?2:1)}
      else{hearts--;G.sfx('hurt');G.shake=5;G.pop(sum>need?`${(sum-need).toLocaleString()}원 많아요`:`${(need-sum).toLocaleString()}원 모자라요`,AW/2,250,'#FF8A8A',18);tray=[];if(hearts<=0)G.lose('거스름돈을 너무 많이 틀렸어요!')}};
    return {
      update(dt){if(!cust){wait-=dt;if(wait<=0)cust=mk()}else{cust.t-=dt;if(cust.t<=0){hearts--;G.sfx('hurt');cust=null;tray=[];wait=.6;if(hearts<=0)return G.lose('손님이 너무 많이 기다리다 갔어요!')}}
        G.setHud(HEARTS(hearts),`🧾 ${served}/${goal}`,`👍 최소 ${minOK}`)},
      draw(c){G.rr(10,10,340,190,16,'#FFF8E6','#6B3D1F',3);
        if(cust){G.emo(cust.face,50,62,52);G.emo(cust.it[0],50,140,40);G.text(`${cust.it[1]}`,50,182,15,'#4A240E','center',null);
          G.text(`물건값 ${cust.price.toLocaleString()}원`,210,48,20,'#4A240E','center',null);G.text(`낸 돈 ${cust.pay.toLocaleString()}원`,210,82,20,'#3F7A4A','center',null);
          G.text('거스름돈은 얼마일까요?',210,118,16,'#8A552B','center',null);const p=cust.t/patience;G.rr(110,170,220,12,6,'#E0D0B0');G.rr(110,170,220*p,12,6,p>.5?'#6FE0A6':p>.25?'#FFD24A':'#FF6A5A')}
        else G.text('다음 손님이 와요…',AW/2,100,18,'#8A552B','center',null);
        const sum=tray.reduce((a,b)=>a+b,0);G.rr(10,212,340,128,16,'#5A3A24','#D9A441',3);G.text(`쟁반: ${sum.toLocaleString()}원`,AW/2,232,18);
        tray.forEach((m,i)=>{const x=34+(i%10)*31,y=268+Math.floor(i/10)*34;if(m>=1000){G.rr(x-14,y-10,30,20,3,m===5000?'#E8A0A0':'#9FD0A0','#3A2010',1.5);G.text(m===5000?'5천':'천',x+1,y,11,'#2A1A0E','center',null)}
          else{G.circle(x,y,m===500?14:m===10?10:12,m===10?'#C08850':'#D8D8E0','#5A4A3A',1.5);G.text(String(m),x,y,m===500?10:9,'#2A1A0E','center',null)}})}
    }}});

/* ---------- 경제 3: 동전 합 10 (사과 게임 · 프루트 박스) ---------- */
arcDefine({id:'money_apple',ch:'money',name:'동전 합 10',tag:'숫자 묶기',from:'사과 게임 (Fruit Box)',icon:'🪙',
  how:['손가락으로 네모를 그려 동전을 묶어요.','묶은 숫자의 합이 딱 10이면 동전이 저금통으로 쏙! (예: 3+7, 2+5+3)','시간 안에 목표 개수만큼 모으면 성공. 빨리 모을수록 별이 많아요.'],
  init(G){
    const C=8,R=10,cs=40,ox=20,oy=34,goal=25+Math.round(G.d*70),T=Math.round(100-20*G.d);
    let g=[...Array(R)].map(()=>[...Array(C)].map(()=>G.ri(1,9))),sel=null,got=0,time=T;
    const cell=(x,y)=>[G.clamp(Math.floor((y-oy)/cs),0,R-1),G.clamp(Math.floor((x-ox)/cs),0,C-1)];
    const box=()=>{if(!sel)return null;const [r0,c0]=sel.a,[r1,c1]=sel.b;return [Math.min(r0,r1),Math.min(c0,c1),Math.max(r0,r1),Math.max(c0,c1)]};
    const sumOf=b=>{let s=0;for(let r=b[0];r<=b[2];r++)for(let c=b[1];c<=b[3];c++)s+=g[r][c]||0;return s};
    return {
      boostText:'시간 +15초', boost(){time+=15},
      update(dt){time-=dt;if(time<=0)return G.lose(`시간이 다 됐어요! (${got}/${goal})`);G.setHud(TIME(time),`🪙 ${got}/${goal}`,`${G.lv}단계`)},
      draw(c){for(let r=0;r<R;r++)for(let k=0;k<C;k++){const v=g[r][k];if(!v)continue;const x=ox+k*cs+cs/2,y=oy+r*cs+cs/2;G.circle(x,y,17,'#FFD24A','#8A5410',2.5);G.text(String(v),x,y+1,18,'#5A3410','center',null)}
        const b=box();if(b){const s=sumOf(b);G.rr(ox+b[1]*cs,oy+b[0]*cs,(b[3]-b[1]+1)*cs,(b[2]-b[0]+1)*cs,8,s===10?'rgba(127,214,154,.35)':'rgba(255,255,255,.15)',s===10?'#7FD69A':s>10?'#FF6A5A':'#FFF',3);
          G.text(`합 ${s}`,AW/2,oy+R*cs+20,20,s===10?'#7FD69A':s>10?'#FF8A8A':'#FFF3D6')}
        else G.text('네모를 그려 합 10을 만들어요',AW/2,oy+R*cs+20,16,'#FFE9A8')},
      down(x,y){const p=cell(x,y);sel={a:p,b:p}},move(x,y,dn){if(dn&&sel)sel.b=cell(x,y)},
      up(){const b=box();sel=null;if(!b)return;const s=sumOf(b);if(s!==10){if(s>0)G.sfx('no');return}
        let n=0;for(let r=b[0];r<=b[2];r++)for(let c=b[1];c<=b[3];c++)if(g[r][c]){n++;G.burst(ox+c*cs+cs/2,oy+r*cs+cs/2,'#FFE27A',4);g[r][c]=0}
        got+=n;G.sfx('clear');try{sfx.clear(n)}catch(e){}G.addScore(n*10);if(got>=goal)G.win(time>T*.45?3:time>T*.2?2:1)}
    }}});

/* ---------- 환경 1: 분리수거 달리기 (분류 러시) ---------- */
arcDefine({id:'eco_recycle',ch:'dungeon',name:'분리수거 대작전',tag:'빠른 분류',from:'분류 러시 · 리사이클 게임',icon:'♻️',
  how:['위에서 쓰레기가 내려와요. 바닥에 닿기 전에 알맞은 통을 눌러요!','종이📦 · 플라스틱🧴 · 캔🥫 · 유리🍾 · 음식물🍌','틀리거나 놓치면 하트가 줄어요. 갈수록 빨라져요!'],
  init(G){
    const ALL=[['종이','#4A90D9',['📦','📰','✉️','📄']],['플라스틱',"#E2513A",['🧴','🥤','🛍️']],['캔·고철','#8A8A9A',['🥫','🔩']],['유리','#2F9E5B',['🍾','🥛']],['음식물','#C9A227',['🍌','🍎','🥕','🍉']]];
    const B=ALL.slice(0,3+Math.round(G.d*2)), goal=12+Math.round(G.d*18); let sp=110+140*G.d,item=null,hearts=3,got=0,combo=0,flash=null;
    const bw=(AW-20)/B.length;
    const next=()=>{const i=G.ri(0,B.length-1);item={b:i,e:G.pick(B[i][2]),y:-30,x:AW/2}};next();
    const choose=i=>{if(!item||G.over)return;if(i===item.b){got++;combo++;G.sfx('ok');G.burst(10+i*bw+bw/2,440,B[i][1],12);G.addScore(10+combo*2);flash={i,ok:1,t:.3};sp*=1.025;
        if(got>=goal)return G.win(starsByHearts(hearts));next()}
      else{hearts--;combo=0;G.sfx('no');G.shake=5;flash={i,ok:0,t:.3};G.pop(`${item.e}는 ${B[item.b][0]}!`,AW/2,300,'#FF8A8A',18);if(hearts<=0)return G.lose('분리수거를 너무 많이 틀렸어요!');next()}};
    return {
      update(dt){if(item){item.y+=sp*dt;if(item.y>390){hearts--;combo=0;G.sfx('hurt');G.pop(`놓쳤어요! ${B[item.b][0]}`,AW/2,300,'#FF8A8A',16);if(hearts<=0)return G.lose('쓰레기를 너무 많이 놓쳤어요!');next()}}
        if(flash){flash.t-=dt;if(flash.t<=0)flash=null}G.setHud(HEARTS(hearts),`♻️ ${got}/${goal}`,combo>2?`🔥 ${combo}`:`${G.lv}단계`)},
      draw(c){G.rr(AW/2-40,0,80,400,10,'rgba(255,255,255,.08)');if(item){G.emo(item.e,item.x,item.y,58)}
        B.forEach((b,i)=>{const x=10+i*bw;G.rr(x+3,410,bw-6,120,14,flash&&flash.i===i?(flash.ok?'#7FD69A':'#FF6A5A'):b[1],'#2A1A0E',3);G.emo('🗑️',x+bw/2,452,34);G.text(b[0],x+bw/2,500,b[0].length>3?13:16)})},
      tap(x,y){if(y>400)choose(G.clamp(Math.floor((x-10)/bw),0,B.length-1))},
      key(k){const m={L:0,D:1,R:2,U:3}[k];if(m!=null&&m<B.length)choose(m)}
    }}});

/* ---------- 환경 2: 숲 지뢰찾기 (지뢰 찾기) ---------- */
arcDefine({id:'eco_mines',ch:'dungeon',name:'오염 찾기 숲',tag:'숫자 추리',from:'지뢰 찾기 (Minesweeper)',icon:'🌳',
  how:['숲 땅에 오염 통🛢️이 숨어 있어요. 칸을 눌러 깨끗한 땅을 열어요.','숫자는 둘레 8칸에 숨은 오염 통의 개수예요. 🚩 단추로 깃발 꽂기!','깨끗한 땅을 모두 열면 나무가 자라나요. 오염 통을 열면 하트가 줄어요.'],
  init(G){
    const C=8+(G.d>.5?1:0), R=10+Math.round(G.d*3), cs=Math.min(320/C,400/R), ox=(AW-cs*C)/2, oy=16, nM=Math.round(C*R*(.1+.08*G.d));
    let mine=null,open=[...Array(R)].map(()=>Array(C).fill(0)),flag=[...Array(R)].map(()=>Array(C).fill(0)),hearts=3,flagMode=false,t=0;
    const N=(r,c)=>{const o=[];for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){if(!a&&!b)continue;const R2=r+a,C2=c+b;if(R2>=0&&C2>=0&&R2<R&&C2<C)o.push([R2,C2])}return o};
    const cnt=(r,c)=>N(r,c).filter(([a,b])=>mine[a][b]).length;
    const lay=(sr,sc)=>{mine=[...Array(R)].map(()=>Array(C).fill(0));let k=0;while(k<nM){const r=G.ri(0,R-1),c=G.ri(0,C-1);if(mine[r][c]||(Math.abs(r-sr)<=1&&Math.abs(c-sc)<=1))continue;mine[r][c]=1;k++}};
    const flood=(r,c)=>{const q=[[r,c]];while(q.length){const [a,b]=q.pop();if(open[a][b]||flag[a][b])continue;open[a][b]=1;if(!cnt(a,b))N(a,b).forEach(p=>{if(!open[p[0]][p[1]]&&!mine[p[0]][p[1]])q.push(p)})}};
    const fb=G.btn(AW/2-80,AH-62,160,50,'⛏️ 열기',()=>{flagMode=!flagMode;fb.label=flagMode?'🚩 깃발 꽂기':'⛏️ 열기';fb.on=flagMode},{fs:17});
    const safeLeft=()=>{let n=0;for(let r=0;r<R;r++)for(let c=0;c<C;c++)if(!mine[r][c]&&!open[r][c])n++;return n};
    const COLS=['','#3C6FD1','#2F9E5B','#E2513A','#7A5BC7','#B03A2E','#16A085','#333','#777'];
    return {
      update(dt){t+=dt;G.setHud(HEARTS(hearts),mine?`🌱 남은 땅 ${safeLeft()}`:'아무 칸이나 톡!',`🛢️ ${nM}개`)},
      draw(c){for(let r=0;r<R;r++)for(let k=0;k<C;k++){const x=ox+k*cs,y=oy+r*cs;
          if(open[r][k]){G.rr(x+1,y+1,cs-2,cs-2,4,mine&&mine[r][k]?'#5A3A3A':'#D8C49A');if(mine&&mine[r][k])G.emo('🛢️',x+cs/2,y+cs/2,cs*.7);else{const n=cnt(r,k);if(n)G.text(String(n),x+cs/2,y+cs/2+1,cs*.55,COLS[n],'center',null)}}
          else{G.rr(x+1,y+1,cs-2,cs-2,4,(r+k)%2?'#5FAE58':'#6FBE68');if(flag[r][k])G.emo('🚩',x+cs/2,y+cs/2,cs*.6)}}},
      tap(x,y){const c=Math.floor((x-ox)/cs),r=Math.floor((y-oy)/cs);if(r<0||c<0||r>=R||c>=C||open[r][c])return;
        if(flagMode){flag[r][c]^=1;G.sfx('tap');return}if(flag[r][c])return;
        if(!mine)lay(r,c);
        if(mine[r][c]){open[r][c]=1;hearts--;G.sfx('hurt');G.shake=6;G.burst(ox+c*cs+cs/2,oy+r*cs+cs/2,'#8A5A30',14);if(hearts<=0)return G.lose('오염 통을 너무 많이 열었어요!')}
        else{flood(r,c);G.sfx('pop')}
        if(!safeLeft()){for(let a=0;a<R;a++)for(let b=0;b<C;b++)if(!mine[a][b])G.burst(ox+b*cs+cs/2,oy+a*cs+cs/2,'#7FD69A',1);G.sfx('ok');G.win(starsByHearts(hearts))}}
    }}});

/* ---------- 환경 3: 미세먼지 인베이더 (스페이스 인베이더) ---------- */
arcDefine({id:'eco_invaders',ch:'dungeon',name:'미세먼지 인베이더',tag:'슈팅 아케이드',from:'스페이스 인베이더 (1978)',icon:'🌫️',
  how:['화면을 좌우로 끌면 나무 대포🌳가 움직이고, 맑은 물방울💧이 저절로 발사돼요.','미세먼지 구름을 모두 없애요! 떨어지는 먼지🟤는 피해요.','☀️를 받으면 물방울이 빨라져요. 먼지가 땅까지 내려오면 실패!'],
  init(G){
    const rows=2+Math.round(G.d*2), cols=6, E=['🌫️','💨','☁️','🌪️'];
    let en=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)en.push({x:50+c*46,y:70+r*44,e:E[r%E.length]});
    const total=en.length;let px=AW/2,shots=[],dusts=[],ups=[],dir=1,esp=24+30*G.d,cool=0,hearts=3,inv=0,rapid=0,keyD=0;
    return {
      update(dt){if(keyD)px=G.clamp(px+keyD*360*dt,24,AW-24);inv=Math.max(0,inv-dt);rapid=Math.max(0,rapid-dt);
        cool-=dt;if(cool<=0){cool=rapid?.18:.45;shots.push({x:px,y:470});G.sfx('tick')}
        for(const s of shots)s.y-=420*dt;shots=shots.filter(s=>s.y>-10&&!s.hit);
        const left=en.filter(e=>!e.dead),speed=esp*(1+(1-left.length/total)*2.2);let edge=false;
        for(const e of left){e.x+=dir*speed*dt;if(e.x<22||e.x>AW-22)edge=true}
        if(edge){dir*=-1;for(const e of left)e.y+=16}
        for(const s of shots)for(const e of left){if(!e.dead&&Math.abs(s.x-e.x)<20&&Math.abs(s.y-e.y)<18){e.dead=1;s.hit=1;G.sfx('pop');G.burst(e.x,e.y,'#BFEFFF',10);G.addScore(10);if(Math.random()<.08)ups.push({x:e.x,y:e.y})}}
        if(Math.random()<dt*(.5+1.5*G.d)&&left.length){const e=G.pick(left);dusts.push({x:e.x,y:e.y+14})}
        for(const d of dusts){d.y+=(150+90*G.d)*dt;if(!inv&&Math.abs(d.x-px)<20&&Math.abs(d.y-490)<18){d.y=AH+50;hearts--;inv=1.2;G.sfx('hurt');G.shake=6;if(hearts<=0)return G.lose('먼지를 너무 많이 맞았어요!')}}
        dusts=dusts.filter(d=>d.y<AH);
        for(const u of ups){u.y+=120*dt;if(Math.abs(u.x-px)<24&&Math.abs(u.y-490)<22){u.got=1;rapid=6;G.sfx('star')}}ups=ups.filter(u=>u.y<AH&&!u.got);
        if(!en.some(e=>!e.dead)){G.burst(AW/2,200,'#7FD69A',30);return G.win(starsByHearts(hearts))}
        if(left.some(e=>e.y>440))return G.lose('미세먼지가 땅까지 내려왔어요!');
        G.setHud(HEARTS(hearts),`🌫️ ${total-left.length}/${total}`,rapid?'☀️ 빠르게!':`${G.lv}단계`)},
      draw(c){const clean=1-en.filter(e=>!e.dead).length/total;c.fillStyle=G.grad(0,AH,`rgba(${150-clean*60},${140+clean*60},${120+clean*120},1)`,'#2A3A2A');c.fillRect(0,0,AW,AH);
        for(const e of en)if(!e.dead)G.emo(e.e,e.x,e.y,36);for(const s of shots)G.emo('💧',s.x,s.y,16);for(const d of dusts)G.circle(d.x,d.y,6,'#7A5A3A','#3A2A1A',1.5);for(const u of ups)G.emo('☀️',u.x,u.y,24);
        G.rr(0,510,AW,30,0,'#4E7A3A');if(!(inv&&Math.floor(G.t*12)%2))G.emo('🌳',px,490,40)},
      down(x){px=G.clamp(x,24,AW-24)},move(x){px=G.clamp(x,24,AW-24)},
      key(k){if(k==='L')keyD=-1;if(k==='R')keyD=1},keyup(k){if(k==='L'||k==='R')keyD=0}
    }}});
