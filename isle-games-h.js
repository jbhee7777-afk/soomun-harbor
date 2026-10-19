/* ===== 다시 만든 놀이 4: 세계 요리 주문 썰기 · 모두의 마을 틀린 그림 · 철길 나사 잼 · 남북 열차 블록 잼 · 분리수거 블랙홀 · 미세먼지 볼 블라스트 ===== */

/* ---------- 한국 음식 그림 (Canva 그림 한 장을 4조각으로 잘라 흰 바탕을 지워요) ---------- */
(function(){const im=new Image();im.onload=()=>{try{const N=4,half=im.width/2;
  for(let q=0;q<N;q++){const cv=document.createElement('canvas'),S=256;cv.width=cv.height=S;const x=cv.getContext('2d');
    x.drawImage(im,(q%2)*half+half*.04,Math.floor(q/2)*half+half*.04,half*.92,half*.92,0,0,S,S);
    const d=x.getImageData(0,0,S,S),p=d.data,seen=new Uint8Array(S*S),st=[];
    const white=i=>p[i*4]>226&&p[i*4+1]>226&&p[i*4+2]>226;
    for(let i=0;i<S;i++){st.push(i,(S-1)*S+i,i*S,i*S+S-1)}
    while(st.length){const i=st.pop();if(seen[i]||!white(i))continue;seen[i]=1;p[i*4+3]=0;const xx=i%S,yy=(i/S)|0;if(xx>0)st.push(i-1);if(xx<S-1)st.push(i+1);if(yy>0)st.push(i-S);if(yy<S-1)st.push(i+S)}
    for(let i=0;i<S*S;i++){if(seen[i])continue;const xx=i%S,yy=(i/S)|0;if((xx>0&&seen[i-1])||(xx<S-1&&seen[i+1])||(yy>0&&seen[i-S])||(yy<S-1&&seen[i+S]))p[i*4+3]=150}
    x.putImageData(d,0,0);window.ARC_SPRITES=window.ARC_SPRITES||{};window.ARC_SPRITES['kf'+q]=cv.toDataURL('image/png')}}catch(e){}};im.src='assets/v2/kfood.jpg'})();

/* ---------- 다문화 1: 세계 요리 주문 썰기 (과일 닌자) — 글씨 크게 · 한국 음식은 김밥·떡볶이·비빔밥·불고기 ---------- */
const WFOOD2=[['🍣','스시','일본'],['🍙','주먹밥','일본'],['🍕','피자','이탈리아'],['🍝','스파게티','이탈리아'],['🌮','타코','멕시코'],['🌯','부리토','멕시코'],['🥐','크루아상','프랑스'],['🥖','바게트','프랑스'],
  ['🥟','만두','중국'],['🥮','월병','중국'],['🍛','카레','인도'],['🍔','햄버거','미국'],['🌭','핫도그','미국'],['🍜','쌀국수','베트남'],['🥙','케밥','튀르키예'],['🥨','프레첼','독일'],['🥘','파에야','스페인'],
  ['kf0','김밥','한국','🍙'],['kf1','떡볶이','한국','🍲'],['kf2','비빔밥','한국','🍚'],['kf3','불고기','한국','🥩']];
arcDefine({id:'multi_slice',ch:'multi',name:'세계 요리 주문 썰기',tag:'주문서 썰기',from:'과일 닌자 (Fruit Ninja)',icon:'🍣',
  how:['주문서 나라의 요리만 쓱 썰어요','다른 나라 요리 · 💣는 썰면 안 돼요','빠르고 곧게 그어야 잘려요'],
  init(G){
    const goal=12+Math.round(G.d*20),countries=[...new Set(WFOOD2.map(f=>f[2]))];
    let target=Math.random()<.35?'한국':G.pick(countries),need=3,objs=[],halves=[],trail=[],t=.6,got=0,hearts=3,stam=100,tired=0,banner=1.6;
    const fe=f=>arcSprite(f[0])?f[0]:(f[3]||f[0]);
    const spawn=()=>{const n=G.d>.35&&Math.random()<.3+.4*G.d?2+(G.d>.75&&Math.random()<.4?1:0):1;for(let i=0;i<n;i++){const bomb=Math.random()<.07+.18*G.d,x=G.rand(60,AW-60);
      const mine=WFOOD2.filter(f=>f[2]===target),oth=WFOOD2.filter(f=>f[2]!==target),f=Math.random()<.5?G.pick(mine):G.pick(oth);
      objs.push({x,y:AH+30,vx:(AW/2-x)*G.rand(.25,.6),vy:-G.rand(610,740),r:G.rand(-3,3),bomb,f:bomb?null:f,R:bomb?26:38})}};
    const nextOrder=()=>{let c;do{c=G.pick(countries)}while(c===target);target=c;need=2+Math.round(G.d*2);banner=1.8;G.sfx('unlock')};
    const chord=(o,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,L=Math.hypot(dx,dy);if(L<4)return false;let k=((o.x-a.x)*dx+(o.y-a.y)*dy)/(L*L);if(k<0||k>1)return false;return Math.hypot(a.x+dx*k-o.x,a.y+dy*k-o.y)<o.R};
    return {
      boostText:'하트 +1', boost(){hearts=Math.min(3,hearts+1)},
      update(dt){t-=dt;banner=Math.max(0,banner-dt);if(t<=0){spawn();t=G.rand(.8,1.2)*(1-.5*G.d)}
        stam=Math.min(100,stam+dt*45);tired=Math.max(0,tired-dt);
        for(const o of objs){o.vy+=620*dt;o.x+=o.vx*dt;o.y+=o.vy*dt;if(o.y>AH+50&&o.vy>0&&!o.gone){o.gone=1;if(!o.bomb&&o.f[2]===target){hearts--;G.sfx('no');G.pop(`${o.f[1]}를 놓쳤어요`,AW/2,AH-100,'#FF8A8A',20);if(hearts<=0)return G.lose('주문 요리를 너무 많이 놓쳤어요!')}}}
        objs=objs.filter(o=>!o.gone&&!o.cut);for(const h of halves){h.vy+=700*dt;h.x+=h.vx*dt;h.y+=h.vy*dt;h.a+=h.va*dt}halves=halves.filter(h=>h.y<AH+60);
        trail=trail.filter(p=>G.t-p.t<.12);G.setHud(HEARTS(hearts),`🔪 ${got}/${goal}`,`🗒 ${target}`)},
      draw(c){G.rr(0,AH-56,AW,56,0,'#6B4A3A');for(let x=0;x<AW;x+=40)G.rr(x,AH-56,38,4,0,'#8A6A4A');
        G.rr(AW/2-150,8,300,62,16,'#FFF8E6','#6B3D1F',4);G.text('🗒 주문서',AW/2,24,16,'#8A552B','center',null);G.text(`${target} 요리 ${need}개!`,AW/2,50,26,'#A3303C','center',null);
        for(const o of objs){if(o.bomb){G.emo('💣',o.x,o.y,58,1,o.r*G.t*.3);continue}const mine=o.f[2]===target;
          if(mine){c.save();c.shadowColor='#FFE27A';c.shadowBlur=18;G.circle(o.x,o.y,34,'rgba(255,226,122,.18)');c.restore()}
          G.emo(fe(o.f),o.x,o.y,58,1,o.r*G.t*.3);const lab=o.f[2],w=lab.length*15+18;G.rr(o.x-w/2,o.y+34,w,24,12,mine?'#FFE27A':'rgba(30,20,40,.82)',mine?'#8A5410':'#8A7AA8',2);G.text(lab,o.x,o.y+47,15,mine?'#4A240E':'#FFFFFF','center',null)}
        for(const h of halves){c.save();c.beginPath();c.rect(h.x+(h.s<0?-46:0),h.y-46,46,92);c.clip();G.emo(h.e,h.x,h.y,58,1,h.a);c.restore()}
        if(trail.length>1){c.strokeStyle=tired?'rgba(150,150,150,.6)':'rgba(255,255,255,.95)';c.lineWidth=7;c.lineCap='round';c.beginPath();trail.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.stroke()}
        G.rr(12,AH-44,140,14,7,'#3A2A3A');G.rr(12,AH-44,140*stam/100,14,7,tired?'#888':'#7FD6FF');G.text(tired?'칼이 지쳤어요!':'칼 힘',170,AH-37,16,'#FFF3D6','left');
        if(banner){c.globalAlpha=Math.min(1,banner*2);G.rr(30,200,AW-60,70,18,'rgba(20,10,30,.85)','#FFE27A',3);G.text(`새 주문: ${target} 요리!`,AW/2,235,26,'#FFE27A','center',null);c.globalAlpha=1}},
      down(x,y){trail=[{x,y,t:G.t}]},
      move(x,y,dn){if(!dn)return;const p={x,y,t:G.t},a=trail[trail.length-1]||p;trail.push(p);const seg=Math.hypot(p.x-a.x,p.y-a.y),sp=seg/Math.max(.001,p.t-a.t);
        stam-=seg*.035;if(stam<=0&&!tired){tired=1.2;stam=0;G.sfx('no')}
        if(tired||sp<260+140*G.d)return;
        for(const o of objs){if(o.cut||!chord(o,a,p))continue;o.cut=1;
          if(o.bomb){hearts--;G.sfx('hurt');G.shake=8;G.burst(o.x,o.y,'#FF6A5A',20);if(hearts<=0)return G.lose('폭탄을 너무 많이 건드렸어요!');continue}
          const e=fe(o.f);halves.push({x:o.x,y:o.y,vx:-70,vy:-100,a:0,va:-3,e,s:-1},{x:o.x,y:o.y,vx:70,vy:-100,a:0,va:3,e,s:1});
          if(o.f[2]!==target){hearts--;G.sfx('no');G.shake=5;G.pop(`그건 ${o.f[2]}의 ${o.f[1]}!`,AW/2,o.y-40,'#FF8A8A',20);if(hearts<=0)return G.lose('주문에 없는 요리를 너무 많이 썰었어요!');continue}
          got++;need--;G.sfx('whoosh');G.burst(o.x,o.y,'#FFE27A',12);G.pop(`${o.f[1]} (${o.f[2]})`,o.x,o.y-40,'#FFE27A',20);G.addScore(10);
          if(got>=goal)return G.win(starsByHearts(hearts));if(need<=0)nextOrder()}},
      up(){trail=[]}
    }}});

/* 틀린 그림 장면 12가지 (Canva) — 한 바퀴 다 볼 때까지 같은 그림이 다시 안 나와요 */
const DIFF_SCENES=['diff_town.jpg','diff_park.jpg','diff_school.jpg','diff_market.jpg','diff_library.jpg','diff_beach.jpg','diff_hospital.jpg','diff_farm.jpg','diff_station.jpg','diff_cafeteria.jpg','diff_winter.jpg','diff_aquarium.jpg'];
/* ---------- 인권 3: 모두의 마을 틀린 그림 — Canva 그림 위에서 진짜 다른 곳 찾기 ----------
   위 그림은 원래 그림, 아래 그림은 몇 군데를 바꿔요: 색 바꾸기 · 좌우 뒤집기 · 크게 · 물건 더하기/빼기 (부드러운 가장자리) */
const DIFF_FACT=['📚 모든 어린이는 배울 권리가 있어요','🏥 아플 때 치료받을 권리가 있어요','🍚 굶지 않고 먹을 권리가 있어요','🏠 안전한 집에서 살 권리가 있어요','⚽ 충분히 쉬고 놀 권리가 있어요',
  '🎨 문화를 누릴 권리가 있어요','🛡️ 폭력에서 보호받을 권리가 있어요','♿ 누구나 다닐 수 있는 길이 필요해요','🗣️ 내 생각을 말할 권리가 있어요','⚖️ 누구도 차별받지 않아요','🕊️ 평화롭게 살 권리가 있어요','💧 깨끗한 물을 마실 권리가 있어요'];
arcDefine({id:'rights_diff',ch:'rights',name:'모두의 마을 틀린 그림',tag:'다른 그림 찾기',from:'다른 그림 찾기 · 틀린 그림 찾기',icon:'🔍',
  how:['위·아래 그림에서 다른 곳을 눌러요','아무 데나 누르면 시간이 줄어요','빨리 찾을수록 별이 많아요'],
  init(G){
    const SC=DIFF_SCENES;let key;try{S.diffSeen=S.diffSeen||[];let u=S.diffSeen.filter(k=>SC.includes(k));if(u.length>=SC.length)u=u.slice(-2);const av=SC.filter(k=>!u.includes(k));key=G.pick(av);u.push(key);S.diffSeen=u;save()}catch(e){key=G.pick(SC)}
    const K=4+Math.round(G.d*4),PW=344,PH=229,X0=8,Y1=6,Y2=Y1+PH+26,HR=2;
    let base=null,alt=null,diffs=[],time=80-30*G.d,miss=0,hint=0,facts=G.shuffle(DIFF_FACT.slice()),fi=0,msg=null;const T0=time;
    const STK=['🎈','🐦','🌷','⚽','🦋','🍎','🐱','⭐','🎀','🧸','🍩','🐞'];
    const build=im=>{const W=PW*HR,H=PH*HR;const mk=()=>{const cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');const s=Math.max(W/im.width,H/im.height);x.drawImage(im,(W-im.width*s)/2,(H-im.height*s)/2,im.width*s,im.height*s);return cv};
      base=mk();alt=mk();const bx=base.getContext('2d'),ax=alt.getContext('2d');
      const cols=4,rows=3,cells=G.shuffle([...Array(cols*rows)].map((_,i)=>i)).slice(0,K),kinds=G.shuffle(['hue','flip','add','gone','big','hue','add','gone']);
      const R0=(30-8*G.d)*HR;
      diffs=cells.map((ci,j)=>{const cw=W/cols,ch=H/rows,r=R0*G.rand(.9,1.15),x=(ci%cols)*cw+G.rand(r+6,cw-r-6),y=Math.floor(ci/cols)*ch+G.rand(r+6,ch-r-6);return {x,y,r,kind:kinds[j%kinds.length],found:false}});
      const patch=(d,fn)=>{const s=Math.ceil(d.r*2),t=document.createElement('canvas');t.width=t.height=s;const tx=t.getContext('2d');fn(tx,s);
        tx.globalCompositeOperation='destination-in';const g=tx.createRadialGradient(s/2,s/2,s*.3,s/2,s/2,s/2);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,0)');tx.fillStyle=g;tx.fillRect(0,0,s,s);ax.drawImage(t,d.x-s/2,d.y-s/2)};
      for(const d of diffs){const s=Math.ceil(d.r*2);
        if(d.kind==='hue')patch(d,(tx)=>{tx.drawImage(base,d.x-s/2,d.y-s/2,s,s,0,0,s,s);const id=tx.getImageData(0,0,s,s),p=id.data;for(let i=0;i<p.length;i+=4){const r=p[i],g=p[i+1],b=p[i+2];p[i]=b;p[i+1]=r;p[i+2]=g}tx.putImageData(id,0,0)});
        else if(d.kind==='flip')patch(d,(tx)=>{tx.translate(s,0);tx.scale(-1,1);tx.drawImage(base,d.x-s/2,d.y-s/2,s,s,0,0,s,s)});
        else if(d.kind==='big')patch(d,(tx)=>{const k=.7;tx.drawImage(base,d.x-s*k/2,d.y-s*k/2,s*k,s*k,0,0,s,s)});
        else{const e=G.pick(STK),sp=arcSprite(e)||emoSprite(e,Math.round(d.r*1.3)),sz=d.r*1.15;(d.kind==='add'?ax:bx).drawImage(sp,d.x-sz/2,d.y-sz/2,sz,sz)}}};
    const toImg=(x,y)=>{if(x<X0||x>X0+PW)return null;if(y>=Y1&&y<=Y1+PH)return {x:(x-X0)*HR,y:(y-Y1)*HR};if(y>=Y2&&y<=Y2+PH)return {x:(x-X0)*HR,y:(y-Y2)*HR};return null};
    return {
      boostText:'다른 곳 하나 알려 주기', boost(){hint=3},
      update(dt){if(!base){const im=v2img(key);if(im)build(im);G.setHud('그림 준비 중…',null,null);return}
        time-=dt;hint=Math.max(0,hint-dt);if(msg){msg.t-=dt;if(msg.t<=0)msg=null}if(time<=0)return G.lose('시간이 다 됐어요!');
        G.setHud(TIME(time),`🔍 ${diffs.filter(d=>d.found).length}/${K}`,miss?`❌ ${miss}`:`${G.lv}단계`)},
      draw(c){if(!base){G.text('그림을 불러오는 중…',AW/2,AH/2,22);return}
        for(const [cv,y] of [[base,Y1],[alt,Y2]]){G.rr(X0-4,y-4,PW+8,PH+8,14,'#FFF8E6','#6B3D1F',3);c.save();c.beginPath();c.roundRect?c.roundRect(X0,y,PW,PH,10):c.rect(X0,y,PW,PH);c.clip();c.drawImage(cv,X0,y,PW,PH);c.restore()}
        G.text(`다른 곳 ${K}군데를 찾아요!`,AW/2,Y1+PH+12,17,'#FFE9A8');
        for(const d of diffs){if(!d.found)continue;for(const y of [Y1,Y2]){c.save();c.shadowColor='#FFFFFF';c.shadowBlur=6;G.circle(X0+d.x/HR,y+d.y/HR,d.r/HR+6,null,'#FF2A3A',4);c.restore()}}
        if(hint){const d=diffs.find(d=>!d.found);if(d)for(const y of [Y1,Y2])G.circle(X0+d.x/HR,y+d.y/HR,d.r/HR+10+Math.sin(G.t*10)*4,null,'#FFE27A',4)}
        if(msg){G.rr(14,Y2+PH+8,AW-28,32,12,'rgba(20,10,30,.88)','#FFE27A',2);G.text(msg.s,AW/2,Y2+PH+24,msg.s.length>18?15:17,'#FFE27A','center',null)}},
      tap(x,y){if(!base)return;const p=toImg(x,y);if(!p)return;
        const d=diffs.find(d=>!d.found&&Math.hypot(d.x-p.x,d.y-p.y)<Math.max(d.r*1.15,26*HR));
        if(d){d.found=true;G.sfx('ok');G.burst(x,y,'#FFE27A',16);G.addScore(20);msg={s:facts[fi++%facts.length],t:2.5};
          if(diffs.every(d=>d.found))G.win(time>T0*.5&&miss<=1?3:time>T0*.25?2:1)}
        else{miss++;const pen=Math.round(4+3*G.d);time-=pen;G.sfx('no');G.pop(`-${pen}초`,x,y-20,'#FF8A8A',20)}}
    }}});

/* ---------- 통일 2: 철길 나사 잼 — 가려진 나사 · 한 나사만 남은 판은 대롱대롱 · 공구함 순서 생각하기 ----------
   만들 때 컴퓨터가 여러 번 미리 풀어 봐서, 꼭 풀 수 있는 판만 내요. */
/* RAIL (철길 이야기)은 isle-games-d.js 것을 그대로 써요 */
const GRAVEL=[...Array(320)].map(()=>[Math.random(),Math.random(),1+Math.random()*2.4,['#8A857C','#5E5A54','#A39E94','#4A4640'][Math.floor(Math.random()*4)]]);
arcDefine({id:'unify_screw',ch:'unify',name:'철길 나사 잼',tag:'나사 빼기 퍼즐',from:'스크류 잼 · 너츠 앤 볼츠',icon:'🔩',
  how:['위에 드러난 나사를 눌러 빼요','같은 색 공구함으로! 없으면 보관함으로','보관함이 꽉 차면 실패! 순서를 생각해요'],
  init(G){
    const k=3+Math.round(G.d*2),COL=['#FF4A5E','#3C8AF0','#FFC83A','#2FBF7A','#B06AF0'].slice(0,k),TRAY=G.d>.6?4:5,BX0=24,BY0=160,BX1=AW-24,BY1=432;
    const PCOL=['#7FD0FF','#FFB07A','#A8F07A','#E0A8FF','#FFE07A','#7AF0D8'];
    let plates,screws,queue,boxes;
    const covers=(q,s,pl)=>{if(q===s.p||q.gone||q.L<=s.p.L||q.left<2)return false;const x=s.wx-q.cx,y=s.wy-q.cy;return Math.abs(x)<q.w/2+4&&Math.abs(y)<q.h/2+4};
    const gen=()=>{const ps=[],layers=4+Math.round(G.d*4);
      for(let L=0;L<layers;L++){const n=G.ri(1,2)+(L<2?1:0);for(let i=0;i<n;i++){const w=G.rand(100,200),h=G.rand(56,104),cx=G.rand(BX0+w/2,BX1-w/2),cy=G.rand(BY0+h/2,BY1-h/2);
        const spots=[[-w/2+16,-h/2+16],[w/2-16,-h/2+16],[-w/2+16,h/2-16],[w/2-16,h/2-16],[0,-h/2+16],[0,h/2-16]];const m=G.ri(2,w>170?4:3);
        ps.push({cx,cy,w,h,L,ang:0,av:0,col:G.pick(PCOL),spots:G.shuffle(spots).slice(0,m),holes:[],gone:false,fy:0,fv:0})}}
      let ss=[];ps.forEach(p=>p.spots.forEach(([lx,ly])=>{const wx=p.cx+lx,wy=p.cy+ly;if(ss.some(s=>Math.hypot(s.wx-wx,s.wy-wy)<30))return;ss.push({p,lx,ly,wx,wy,gone:false})}));
      ps.forEach(p=>{p.sc=ss.filter(s=>s.p===p);p.left=p.sc.length});
      const keep=ps.filter(p=>p.sc.length>=1);while(ss.length%3){const s=ss.pop();s.p.sc=s.p.sc.filter(x=>x!==s);s.p.left--}
      const cols=G.shuffle(ss.map((_,i)=>Math.floor(i/3)%k));ss.forEach((s,i)=>s.c=cols[i]);
      const per=COL.map((_,i)=>ss.filter(s=>s.c===i).length/3),q=G.shuffle(per.flatMap((n,i)=>Array(n).fill(i)));
      return {ps:keep.filter(p=>p.sc.length),ss,q}};
    /* 미리 풀어 보기: 무작위 욕심쟁이로 여러 번 → 한 번이라도 풀리면 OK */
    const solvable=({ps,ss,q})=>{for(let t=0;t<120;t++){const gone=new Set(),left=new Map(ps.map(p=>[p,p.sc.length]));let qi=2,bx=[{c:q[0],n:0},{c:q[1],n:0}].filter(b=>b.c!=null),tray=[];
        const cov=s=>ps.some(p=>p!==s.p&&p.L>s.p.L&&left.get(p)>=2&&Math.abs(s.wx-p.cx)<p.w/2+4&&Math.abs(s.wy-p.cy)<p.h/2+4);
        const settle=()=>{let ch=true;while(ch){ch=false;for(let i=0;i<bx.length;i++){const b=bx[i];if(b.n>=3){bx[i]=qi<q.length?{c:q[qi++],n:0}:null;ch=true}}bx=bx.filter(Boolean);
          for(const b of bx){const j=tray.indexOf(b.c);if(j>=0&&b.n<3){tray.splice(j,1);b.n++;ch=true}}}};
        let ok=true;while(gone.size<ss.length){const av=ss.filter(s=>!gone.has(s)&&!cov(s));if(!av.length){ok=false;break}
          const m=av.filter(s=>bx.some(b=>b.c===s.c&&b.n<3));let s;
          if(m.length)s=m[Math.floor(Math.random()*m.length)];else{if(tray.length>=TRAY-0){ok=false;break}const soon=q.slice(qi,qi+2);const pr=av.filter(s=>soon.includes(s.c));s=(pr.length&&Math.random()<.8?pr:av)[Math.floor(Math.random()*(pr.length&&Math.random()<.8?pr.length:av.length))]||av[0]}
          gone.add(s);left.set(s.p,left.get(s.p)-1);const b=bx.find(b=>b.c===s.c&&b.n<3);if(b)b.n++;else{tray.push(s.c);if(tray.length>TRAY){ok=false;break}}settle()}
        if(ok&&!tray.length)return true}return false};
    const minS=12+Math.round(G.d*12);for(let t=0;t<200;t++){const g=gen();if(g.ss.length>=minS-(t>120?6:0)&&solvable(g)){plates=g.ps;screws=g.ss;queue=g.q;break}}
    if(!plates){const g=gen();plates=g.ps;screws=g.ss;queue=g.q}
    boxes=[queue.shift(),queue.shift()].map(c=>c==null?null:{c,n:0,pop:0});
    let tray=[],left=screws.length,maxTray=0,fact='',fly=[];
    const world=(s)=>{const p=s.p;if(p.pv){const c=Math.cos(p.ang),sn=Math.sin(p.ang),dx=s.lx-p.pv.lx,dy=s.ly-p.pv.ly;return [p.pv.wx+dx*c-dy*sn,p.pv.wy+dx*sn+dy*c+p.fy]}return [p.cx+s.lx,p.cy+s.ly+p.fy]};
    const refill=()=>{let ch=true;while(ch){ch=false;boxes.forEach((b,i)=>{if(b&&b.n>=3){G.sfx('deliver');G.addScore(30);G.burst(70+i*150,82,COL[b.c],18);boxes[i]=queue.length?{c:queue.shift(),n:0,pop:.4}:null;ch=true}});
      for(const b of boxes){if(!b||b.n>=3)continue;const j=tray.findIndex(s=>s.c===b.c);if(j>=0){tray.splice(j,1);b.n++;ch=true}}}};
    const visible=s=>!plates.some(q=>covers(q,s));
    const tapScrew=s=>{if(!visible(s)){G.sfx('no');G.pop('판에 가려졌어요',s.wx,s.wy-24,'#FF8A8A',17);return}
      s.gone=1;left--;G.sfx('pop');const [x,y]=world(s);const p=s.p;p.left--;p.holes.push([s.lx,s.ly]);
      const bi=boxes.findIndex(b=>b&&b.c===s.c&&b.n<3);let tx,ty;if(bi>=0){boxes[bi].n++;tx=22+bi*150+26+(boxes[bi].n-1)*36;ty=94}else{tray.push(s);maxTray=Math.max(maxTray,tray.length);const cw=(AW-68)/TRAY;tx=34+(tray.length-1)*cw+(cw-8)/2;ty=487}
      fly.push({x,y,tx,ty,c:s.c,t:0});refill();
      if(p.left===1){const r=p.sc.find(q=>!q.gone),[wx,wy]=world(r);p.pv={lx:r.lx,ly:r.ly,wx,wy};G.sfx('whoosh')}
      if(p.left===0){p.gone=true;p.fv=-80;fact=G.pick(RAIL);G.sfx('whoosh')}
      if(!left&&!tray.length)return G.win(maxTray<=1?3:maxTray<=3?2:1);
      if(tray.length>=TRAY&&!boxes.some(b=>b&&tray.some(t=>t.c===b.c)))G.lose('보관함이 꽉 찼어요! 공구함 색과 "다음" 순서를 먼저 봐요.')};
    return {
      boostText:'보관함 한 칸 비우기', boost(){if(tray.length){tray.pop();left--;if(!left&&!tray.length)G.win(1)}},
      update(dt){for(const p of plates){if(p.gone){p.fv+=900*dt;p.fy+=p.fv*dt;p.ang+=dt*1.5;continue}
          if(p.pv){const c=Math.cos(p.ang),sn=Math.sin(p.ang),dx=-p.pv.lx,dy=-p.pv.ly,rx=dx*c-dy*sn,I=dx*dx+dy*dy+(p.w*p.w+p.h*p.h)/12;p.av+=(-rx*900/I)*dt*4;p.av*=Math.pow(.35,dt);p.ang+=p.av*dt}}
        plates=plates.filter(p=>p.fy<700);for(const s of screws)if(!s.gone){const [x,y]=world(s);s.wx=x;s.wy=y}
        for(const f of fly)f.t+=dt*3;fly=fly.filter(f=>f.t<1);boxes.forEach(b=>{if(b)b.pop=Math.max(0,b.pop-dt)});
        G.setHud(`🔩 남은 ${left}`,`🧰 보관 ${tray.length}/${TRAY}`,`${G.lv}단계`)},
      draw(c){
        /* 공방 배경 */
        const bg=G.grad(0,AH,'#2C4A6E','#1A2638');c.fillStyle=bg;c.fillRect(0,0,AW,AH);c.fillStyle='rgba(255,255,255,.04)';for(let i=0;i<AW;i+=30)c.fillRect(i,0,14,AH);
        const scr=(x,y,col,r,dim)=>{G.circle(x+1.5,y+2.5,r,'rgba(0,0,0,.4)');const g=c.createRadialGradient(x-r*.4,y-r*.4,r*.1,x,y,r);g.addColorStop(0,'#FFFFFF');g.addColorStop(.32,col);g.addColorStop(1,mix(col,'#000000',.5));
          G.circle(x,y,r,g,'#15151F',2);G.circle(x,y,r*.62,null,'rgba(255,255,255,.35)',1.5);c.strokeStyle='rgba(20,20,30,.75)';c.lineWidth=r*.24;c.lineCap='round';c.beginPath();c.moveTo(x-r*.42,y);c.lineTo(x+r*.42,y);c.moveTo(x,y-r*.42);c.lineTo(x,y+r*.42);c.stroke();
          if(dim){G.circle(x,y,r+1,'rgba(10,10,25,.6)');G.text('🔒',x,y+1,r*.9,'#FFF',null)}};
        /* 공구함 */
        boxes.forEach((b,i)=>{const x=22+i*150,y=34,s=1+(b?b.pop*.4:0);c.save();c.translate(x+62,y+46);c.scale(s,s);c.translate(-62,-46);
          if(b){const col=COL[b.c];G.rr(4,18,124,72,14,'rgba(0,0,0,.35)');G.rr(0,12,124,72,14,G.grad(12,84,mix(col,'#FFFFFF',.25),mix(col,'#000000',.2)),'#14141E',3);
            G.rr(-4,4,132,22,9,mix(col,'#000000',.45),'#14141E',2.5);G.rr(42,-10,40,18,8,null,'#3A3A4A',5);G.rr(8,30,108,6,3,'rgba(255,255,255,.4)');
            for(let q=0;q<3;q++){const hx=26+q*36,hy=60;G.circle(hx,hy,13,'rgba(0,0,0,.4)');if(q<b.n)scr(hx,hy,col,12,false)}
            if(b.n>=3)G.text('✔',62,58,30,'#FFFFFF')}
          else{G.rr(0,12,124,72,14,'rgba(255,255,255,.06)','rgba(255,255,255,.25)',2);G.text('완료!',62,48,18,'rgba(255,255,255,.5)')}c.restore()});
        G.rr(AW-56,34,46,100,12,'rgba(0,0,0,.3)');G.text('다음',AW-33,48,13,'#FFE9A8');queue.slice(0,2).forEach((q,i)=>{G.rr(AW-50,62+i*34,34,28,8,COL[q],'#14141E',2);scr(AW-33,76+i*34,COL[q],7,false)});
        if(fact){G.rr(14,128,AW-80,24,10,'rgba(0,0,0,.35)');G.text(fact,(AW-66)/2+14,140,12,'#FFE9A8',undefined,null)}
        /* 철길 공사 바닥: 자갈 · 침목 · 레일 */
        G.rr(BX0-12,BY0-12,BX1-BX0+24,BY1-BY0+24,18,'#6E6A62','#2A2620',4);
        c.save();c.beginPath();c.roundRect?c.roundRect(BX0-10,BY0-10,BX1-BX0+20,BY1-BY0+20,16):c.rect(BX0-10,BY0-10,BX1-BX0+20,BY1-BY0+20);c.clip();
        for(const [gx,gy,gr,gc] of GRAVEL)G.circle(BX0-10+gx*(BX1-BX0+20),BY0-10+gy*(BY1-BY0+20),gr,gc);
        for(const yy of [BY0+66,BY1-70]){for(let x=BX0-10;x<BX1+10;x+=24)G.rr(x,yy-12,14,40,3,'#7A5230','#4A3018',1.5);
          for(const ry of [yy-2,yy+14]){G.rr(BX0-10,ry,BX1-BX0+20,7,2,G.grad(ry,ry+7,'#E4E8EE','#6A7280'))}}c.restore();
        /* 판: 색유리처럼, 아래 판일수록 그림자 */
        [...plates].sort((a,b)=>a.L-b.L).forEach(p=>{c.save();if(p.pv||p.gone){const [px,py]=p.pv?[p.pv.wx,p.pv.wy+p.fy]:[p.cx,p.cy+p.fy];c.translate(px,py);c.rotate(p.ang);c.translate(-(p.pv?p.pv.lx:0),-(p.pv?p.pv.ly:0))}else c.translate(p.cx,p.cy);
          const w=p.w,h=p.h;G.rr(-w/2+5,-h/2+7,w,h,14,'rgba(0,0,0,.3)');c.globalAlpha=p.pv?.78:.86;
          G.rr(-w/2,-h/2,w,h,14,G.grad(-h/2,h/2,mix(p.col,'#FFFFFF',.35),p.col),mix(p.col,'#000000',.4),3.5);c.globalAlpha=1;
          G.rr(-w/2+8,-h/2+6,w-16,Math.min(14,h*.22),7,'rgba(255,255,255,.45)');G.rr(-w/2+3,-h/2+3,w-6,h-6,12,null,'rgba(255,255,255,.35)',1.5);
          for(const [hx,hy] of p.holes){G.circle(hx,hy,9,'rgba(25,20,20,.7)');G.circle(hx,hy,9,null,mix(p.col,'#000000',.5),2)}c.restore()});
        for(const s of screws){if(s.gone||s.p.gone)continue;const vis=visible(s);scr(s.wx,s.wy,COL[s.c],vis?14:12,!vis)}
        for(const f of fly){const e=1-Math.pow(1-f.t,3),x=G.lerp(f.x,f.tx,e),y=G.lerp(f.y,f.ty,e)-Math.sin(f.t*Math.PI)*60;scr(x,y,COL[f.c],12,false)}
        /* 보관함 */
        const warn=tray.length>=TRAY-1;G.rr(20,456,AW-40,62,16,'#2A2030',warn?(Math.floor(G.t*4)%2?'#FF5A5A':'#FFB13A'):'#D9A441',3);G.text(warn?'⚠️ 보관함 거의 꽉!':'보관함',AW/2,450,13,warn?'#FFB0A0':'#FFE9A8');
        for(let i=0;i<TRAY;i++){const sx=34+i*((AW-68)/TRAY);G.rr(sx,466,(AW-68)/TRAY-8,42,10,'#140E18',null);if(tray[i])scr(sx+((AW-68)/TRAY-8)/2,487,COL[tray[i].c],13,false)}},
      tap(x,y){const s=screws.filter(s=>!s.gone&&!s.p.gone&&Math.hypot(s.wx-x,s.wy-y)<20).sort((a,b)=>(visible(b)-visible(a))||(b.p.L-a.p.L))[0];if(s)tapScrew(s)}
    }}});

/* ---------- 통일 3: 남북 열차 블록 잼 — 더 빽빽한 판 · 바위 · 얼음 칸 · 꼭 풀리는 판만 ---------- */
arcDefine({id:'unify_cbj',ch:'unify',name:'남북 열차 블록 잼',tag:'밀어서 빼내기',from:'컬러 블록 잼 (Color Block Jam)',icon:'🚃',
  how:['열차 칸을 밀어서 움직여요','같은 색 역문으로 밀면 빠져나가요','🧊 얼음 칸은 다른 칸이 나가야 녹아요'],
  init(G){
    const n=6+(G.d>.45?1:0)+(G.d>.8?1:0),cs=Math.min(312/n,48),ox=(AW-cs*n)/2,oy=86,k=3+Math.round(G.d*2),COL=['#FF4A5E','#3C8AF0','#FFC83A','#2FBF7A','#B06AF0'].slice(0,k);
    const SH=[[[0,0]],[[0,0],[0,1]],[[0,0],[1,0]],[[0,0],[0,1],[0,2]],[[0,0],[1,0],[2,0]],[[0,0],[0,1],[1,0],[1,1]],[[0,0],[1,0],[1,1]],[[0,1],[1,0],[1,1]],[[0,0],[0,1],[1,0]],[[0,0],[1,0],[2,0],[2,1]],[[0,0],[0,1],[0,2],[1,1]]];
    const shW=s=>Math.max(...s.map(p=>p[1]))+1,shH=s=>Math.max(...s.map(p=>p[0]))+1;
    let gates,blocks,walls;
    const gen=dens=>{const gs=[],used=new Set();for(let i=0;i<k;i++)for(let rep=0;rep<(G.d>.5&&i<2?2:1);rep++)for(let t=0;t<60;t++){const side=G.ri(0,3),len=G.ri(2,3),pos=G.ri(0,n-len);if([...Array(len)].some((_,j)=>used.has(side+':'+(pos+j))))continue;for(let j=0;j<len;j++)used.add(side+':'+(pos+j));gs.push({side,pos,len,c:i});break}
      const ws=[];const nW=Math.round(G.d*4);for(let i=0;i<nW;i++)ws.push([G.ri(1,n-2),G.ri(1,n-2)]);
      const bs=[];const occ=()=>{const m=new Set(ws.map(([r,c])=>r*n+c));bs.forEach(b=>b.sh.forEach(([a,c2])=>m.add((b.r+a)*n+b.c+c2)));return m};
      const want=Math.round(n*n*dens);let tries=0;
      while(bs.reduce((a,b)=>a+b.sh.length,0)<want&&tries++<900){const g=G.pick(gs),fit=SH.filter(s=>(g.side%2?shH(s):shW(s))<=g.len);const sh=G.pick(fit),r=G.ri(0,n-1),c=G.ri(0,n-1);
        if(sh.some(([a,b])=>r+a>=n||c+b>=n))continue;const m=occ();if(sh.some(([a,b])=>m.has((r+a)*n+c+b)))continue;bs.push({sh,r,c,col:g.c,out:0,dir:null,ice:0})}
      if(G.d>.5){const ic=G.shuffle(bs.slice()).slice(0,1+(G.d>.8?1:0));ic.forEach(b=>b.ice=G.ri(2,3+Math.round(G.d)))}
      return {gs,bs,ws}};
    const exitOf=(b,gs,r,c)=>{for(const g of gs){if(g.c!==b.col)continue;const cells=b.sh.map(([a,c2])=>[r+a,c+c2]);
        if(g.side===0&&cells.some(p=>p[0]===0)&&cells.every(p=>p[1]>=g.pos&&p[1]<g.pos+g.len))return [-1,0];
        if(g.side===2&&cells.some(p=>p[0]===n-1)&&cells.every(p=>p[1]>=g.pos&&p[1]<g.pos+g.len))return [1,0];
        if(g.side===3&&cells.some(p=>p[1]===0)&&cells.every(p=>p[0]>=g.pos&&p[0]<g.pos+g.len))return [0,-1];
        if(g.side===1&&cells.some(p=>p[1]===n-1)&&cells.every(p=>p[0]>=g.pos&&p[0]<g.pos+g.len))return [0,1]}return null};
    /* 풀리는지 확인: 나갈 수 있는 칸을 하나씩 빼요 (빼면 자리만 늘어나서 순서가 상관없어요) */
    const solve=({gs,bs,ws})=>{let rest=bs.map(b=>({...b}));let melted=0;
      while(rest.length){let found=null;for(const b of rest){if(b.ice&&melted<b.ice)continue;const m=new Set(ws.map(([r,c])=>r*n+c));rest.forEach(o=>{if(o!==b)o.sh.forEach(([a,c2])=>m.add((o.r+a)*n+o.c+c2))});
          const seen=new Set([b.r+','+b.c]),q=[[b.r,b.c]];while(q.length&&!found){const [r,c]=q.shift();if(exitOf(b,gs,r,c)){found=b;break}
            for(const [dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]]){const R=r+dr,C=c+dc,key=R+','+C;if(seen.has(key))continue;if(b.sh.some(([a,c2])=>R+a<0||C+c2<0||R+a>=n||C+c2>=n||m.has((R+a)*n+C+c2)))continue;seen.add(key);q.push([R,C])}}
          if(found)break}
        if(!found)return false;rest=rest.filter(b=>b!==found);melted++}return true};
    let dens=.5+.3*G.d;for(let t=0;t<120;t++){const g=gen(dens);if(g.bs.length>=k+2&&solve(g)){gates=g.gs;blocks=g.bs;walls=g.ws;break}if(t%10===9)dens-=.03}
    if(!blocks){const g=gen(.35);gates=g.gs;blocks=g.bs;walls=g.ws;blocks.forEach(b=>b.ice=0)}
    let time=110-40*G.d,drag=null,moves=0,out=0;const T0=time;
    const occ=()=>{const m=new Map(walls.map(([r,c])=>[r*n+c,-1]));blocks.forEach((b,i)=>{if(!b.dir)b.sh.forEach(([a,c2])=>m.set((b.r+a)*n+b.c+c2,i))});return m};
    const can=(b,dr,dc)=>{const m=occ(),bi=blocks.indexOf(b);return b.sh.every(([a,c2])=>{const R=b.r+a+dr,C=b.c+c2+dc;if(R<0||C<0||R>=n||C>=n)return false;const o=m.get(R*n+C);return o==null||o===bi})};
    const step=(b,dr,dc)=>{if(can(b,dr,dc)){b.r+=dr;b.c+=dc;moves++;G.sfx('tap');return 1}const e=exitOf(b,gates,b.r,b.c);if(e&&e[0]===dr&&e[1]===dc){b.dir=e;out++;G.sfx('whoosh');G.addScore(20);return 2}return 0};
    return {
      boostText:'시간 +15초', boost(){time+=15},
      update(dt){time-=dt;if(time<=0)return G.lose('시간이 다 됐어요!');for(const b of blocks)if(b.dir)b.out+=dt*11;
        const gone=blocks.filter(b=>b.out>n+2);if(gone.length){blocks=blocks.filter(b=>b.out<=n+2);if(!blocks.length)return G.win(time>T0*.5?3:time>T0*.25?2:1)}
        G.setHud(TIME(time),`🚃 남은 ${blocks.filter(b=>!b.dir).length}`,`👆 ${moves}번`)},
      draw(c){G.rr(ox-14,oy-14,n*cs+28,n*cs+28,14,'#4A4A58','#2A2A34',3);
        for(const g of gates){const L=g.len*cs,P=g.pos*cs,col=COL[g.c];c.save();c.shadowColor=col;c.shadowBlur=10;
          if(g.side===0)G.rr(ox+P+2,oy-14,L-4,10,4,col);if(g.side===2)G.rr(ox+P+2,oy+n*cs+4,L-4,10,4,col);if(g.side===3)G.rr(ox-14,oy+P+2,10,L-4,4,col);if(g.side===1)G.rr(ox+n*cs+4,oy+P+2,10,L-4,4,col);c.restore()}
        for(let r=0;r<n;r++)for(let q=0;q<n;q++){G.rr(ox+q*cs+1,oy+r*cs+1,cs-2,cs-2,5,(r+q)%2?'#6A6A7C':'#727286')}
        for(const [r,q] of walls){G.rr(ox+q*cs+2,oy+r*cs+2,cs-4,cs-4,8,'#8A8478','#3A3630',2);G.emo('🪨',ox+q*cs+cs/2,oy+r*cs+cs/2,cs*.6)}
        c.save();c.beginPath();c.rect(ox-14,oy-14,n*cs+28,n*cs+28);c.clip();
        for(const b of blocks){const [dr,dc]=b.dir||[0,0],sx=dc*b.out*cs,sy=dr*b.out*cs,col=COL[b.col];
          const has=(a,c2)=>b.sh.some(p=>p[0]===a&&p[1]===c2);
          for(const pass of [0,1])b.sh.forEach(([a,c2])=>{const x=ox+(b.c+c2)*cs+sx,y=oy+(b.r+a)*cs+sy,f=pass?col:'rgba(0,0,0,.4)',dy=pass?2:6;
            G.rr(x+3,y+dy,cs-6,cs-6,9,f);if(has(a,c2+1))G.rr(x+cs-10,y+dy,20,cs-6,0,f);if(has(a+1,c2))G.rr(x+3,y+cs-10+dy,cs-6,20,0,f);if(has(a,c2+1)&&has(a+1,c2)&&has(a+1,c2+1))G.rr(x+cs-10,y+cs-10+dy,20,20,0,f)});
          b.sh.forEach(([a,c2])=>{const x=ox+(b.c+c2)*cs+sx,y=oy+(b.r+a)*cs+sy;G.rr(x+8,y+8,cs-16,cs*.26,4,'rgba(255,255,255,.75)');G.rr(x+cs/2-1,y+8,2,cs*.26,1,col)});
          {const x0=ox+b.c*cs+sx,y0=oy+b.r*cs+sy;c.strokeStyle='rgba(0,0,0,.45)';c.lineWidth=2;b.sh.forEach(([a,c2])=>{const x=x0+c2*cs,y=y0+a*cs+2;c.beginPath();
            if(!has(a-1,c2)){c.moveTo(x+3,y+3);c.lineTo(x+cs-3,y+3)}if(!has(a+1,c2)){c.moveTo(x+3,y+cs-3);c.lineTo(x+cs-3,y+cs-3)}if(!has(a,c2-1)){c.moveTo(x+3,y+3);c.lineTo(x+3,y+cs-3)}if(!has(a,c2+1)){c.moveTo(x+cs-3,y+3);c.lineTo(x+cs-3,y+cs-3)}c.stroke()})}
          if(b.ice){const x=ox+b.c*cs+sx,y=oy+b.r*cs+sy,w=shW(b.sh)*cs,h=shH(b.sh)*cs;G.rr(x+2,y+2,w-4,h-4,10,'rgba(200,240,255,.6)','#FFFFFF',2);G.text(`🧊${Math.max(0,b.ice-out)}`,x+w/2,y+h/2,18,'#1A4A6A','center','#FFFFFF')}
          if(drag&&drag.b===b){const x=ox+b.c*cs,y=oy+b.r*cs;G.rr(x,y,shW(b.sh)*cs,shH(b.sh)*cs,10,null,'#FFFFFF',3)}}
        c.restore();G.text('같은 색 역문으로 밀어서 빼내요',AW/2,oy+n*cs+40,18,'#FFE9A8')},
      down(x,y){const cI=Math.floor((x-ox)/cs),rI=Math.floor((y-oy)/cs);const b=blocks.find(b=>!b.dir&&b.sh.some(([a,c2])=>b.r+a===rI&&b.c+c2===cI));if(!b)return;
        if(b.ice&&out<b.ice){G.sfx('no');G.pop(`얼음! ${b.ice-out}칸 더 빼면 녹아요`,x,y-24,'#BFEFFF',17);return}drag={b,x,y}},
      move(x,y,dn){if(!drag||!dn)return;const b=drag.b;let dx=x-drag.x,dy=y-drag.y;
        for(let g=0;g<6;g++){if(Math.abs(dx)>=Math.abs(dy)&&Math.abs(dx)>cs*.5){const s=Math.sign(dx),r=step(b,0,s);if(r===2){drag=null;return}if(!r)break;drag.x+=s*cs;dx-=s*cs}
          else if(Math.abs(dy)>cs*.5){const s=Math.sign(dy),r=step(b,s,0);if(r===2){drag=null;return}if(!r)break;drag.y+=s*cs;dy-=s*cs}else break}},
      up(){drag=null}
    }}});

/* ---------- 환경 1: 분리수거 블랙홀 — 진짜로 빨려 들어가요 · 우주 블랙홀 ---------- */
const TRASH2={'플라스틱':['🧴','🥤','🛍️'],'종이':['📦','📰','✉️'],'캔':['🥫'],'유리':['🍾'],'음식물':['🍌','🍎','🥕','🍉'],'일반 쓰레기':['🧻','🦴']};
const NOEAT2=['🐶','🐦','🌳','🚲','🐱','🌷'];
arcDefine({id:'eco_hole',ch:'eco',name:'분리수거 블랙홀',tag:'빨아들이기 · 분류',from:'홀.io (Hole.io)',icon:'🕳️',
  how:['누른 쪽으로 블랙홀이 움직여요','위에 적힌 종류만 빨아들여요','동물 · 나무 · 자전거는 피해요'],
  init(G){
    const WW=1000,WH=1000,goal=14+Math.round(G.d*16),cats=Object.keys(TRASH2).slice(0,4+Math.round(G.d*2));
    let H={x:WW/2,y:WH/2,r:24},items=[],eat=[],aim=null,cat=G.pick(cats),catT=16,got=0,hearts=3,time=Math.round(100-15*G.d),inv=0,spin=0,swallow=0;const CT=16-6*G.d;
    const add=()=>{const pro=Math.random()<.08+.08*G.d,e=pro?G.pick(NOEAT2):null,cn=pro?null:G.pick(cats);let x,y;do{x=G.rand(30,WW-30);y=G.rand(30,WH-30)}while(Math.hypot(x-H.x,y-H.y)<160);items.push({x,y,vx:0,vy:0,e:e||G.pick(TRASH2[cn]),c:cn,pro,s:pro?G.rand(34,44):G.rand(16,28),a:0})};
    for(let i=0;i<110;i++)add();
    const disk=[...Array(70)].map(()=>({a:Math.random()*6.29,r:G.rand(1.05,1.4),s:G.rand(.6,1.4),c:G.pick(['#FFB45A','#FF6AD5','#8A7AFF','#FFE27A'])}));
    const consume=it=>{if(it.pro){if(!inv){hearts--;inv=1;G.sfx('hurt');G.shake=7;G.pop(`${it.e} 빨아들이면 안 돼요!`,AW/2,AH/2-90,'#FF8A8A',20);if(hearts<=0)return G.lose('지켜야 할 것을 너무 많이 삼켰어요!')}}
      else if(it.c===cat){got++;H.r=Math.min(40,H.r+.6);G.sfx('pop');G.addScore(10);swallow=.3;if(got>=goal)return G.win(starsByHearts(hearts))}
      else{time-=3;G.sfx('no');G.pop(`${it.e}는 ${it.c}! -3초`,AW/2,AH/2-90,'#FF8A8A',19)}};
    return {
      boostText:'블랙홀 조금 크게', boost(){H.r=Math.min(40,H.r+5)},
      update(dt){time-=dt;inv=Math.max(0,inv-dt);spin+=dt;swallow=Math.max(0,swallow-dt);if(time<=0)return G.lose(`시간이 다 됐어요! (${got}/${goal})`);
        catT-=dt;if(catT<=0){let nn;do{nn=G.pick(cats)}while(nn===cat&&cats.length>1);cat=nn;catT=CT;G.sfx('unlock');G.pop(`이번엔 ${cat}!`,AW/2,120,'#FFE27A',26)}
        if(aim){const a=Math.atan2(aim.y-AH/2,aim.x-AW/2),sp=160;H.x=G.clamp(H.x+Math.cos(a)*sp*dt,H.r,WW-H.r);H.y=G.clamp(H.y+Math.sin(a)*sp*dt,H.r,WH-H.r)}
        for(let i=items.length-1;i>=0;i--){const it=items[i],dx=H.x-it.x,dy=H.y-it.y,d=Math.hypot(dx,dy),fits=!it.pro&&it.s<H.r*1.25,PR=H.r*2;
          if(d<PR){const f=(1-d/PR);if(fits){const pull=900*f*f+120*f;it.vx+=(dx/d*pull-dy/d*pull*.6)*dt;it.vy+=(dy/d*pull+dx/d*pull*.6)*dt;it.a+=dt*8*f}else{it.a=Math.sin(G.t*20)*.15*f;if(d<H.r+it.s*.3){it.vx-=dx/d*260*dt;it.vy-=dy/d*260*dt;if(it.pro&&!inv&&d<H.r*.6+it.s*.12){hearts--;inv=1.2;G.sfx('hurt');G.shake=6;G.pop(`${it.e} 피해요! 하트 -1`,AW/2,AH/2-90,'#FF8A8A',20);if(hearts<=0)return G.lose('지켜야 할 것에 너무 많이 부딪혔어요!')}}}}
          it.vx*=Math.pow(.2,dt);it.vy*=Math.pow(.2,dt);it.x+=it.vx*dt;it.y+=it.vy*dt;
          if(fits&&d<H.r*.55){items.splice(i,1);eat.push({e:it.e,x:it.x-H.x,y:it.y-H.y,s:it.s,t:0});const r=consume(it);add();if(G.over)return}}
        for(const e of eat){e.t+=dt*2.6;const ang=Math.atan2(e.y,e.x)+dt*9,rr=Math.hypot(e.x,e.y)*(1-dt*4);e.x=Math.cos(ang)*rr;e.y=Math.sin(ang)*rr}eat=eat.filter(e=>e.t<1);
        G.setHud(HEARTS(hearts),`♻️ ${got}/${goal}`,TIME(time))},
      draw(c){const cx=H.x-AW/2,cy=H.y-AH/2;c.fillStyle='#7CC46A';c.fillRect(0,0,AW,AH);c.save();c.translate(-cx,-cy);
        for(let x=0;x<WW;x+=100)for(let y=0;y<WH;y+=100){c.fillStyle=((x+y)/100)%2?'#86CC72':'#78BE66';c.fillRect(x,y,100,100)}
        c.fillStyle='#D8C8A8';for(let x=50;x<WW;x+=300)c.fillRect(x,0,24,WH);for(let y=150;y<WH;y+=300)c.fillRect(0,y,WW,24);G.rr(0,0,WW,WH,0,null,'#4E2C14',10);
        for(const it of items){if(Math.abs(it.x-H.x)>AW*.7||Math.abs(it.y-H.y)>AH*.7)continue;const d=Math.hypot(it.x-H.x,it.y-H.y),sq=!it.pro&&d<H.r*2&&it.s<H.r*1.25?Math.max(.45,d/(H.r*2)):1;
          c.fillStyle='rgba(0,0,0,.18)';c.beginPath();c.ellipse(it.x,it.y+it.s*.42,it.s*.4*sq,it.s*.14*sq,0,0,6.29);c.fill();G.emo(it.e,it.x,it.y,it.s*sq,1,it.a)}
        c.restore();
        /* 블랙홀 */
        const X=AW/2,Y=AH/2,R=H.r*(1+swallow*.15);
        const halo=c.createRadialGradient(X,Y,R*.6,X,Y,R*1.6);halo.addColorStop(0,'rgba(120,60,255,.55)');halo.addColorStop(.5,'rgba(255,120,200,.18)');halo.addColorStop(1,'rgba(120,60,255,0)');c.fillStyle=halo;c.beginPath();c.arc(X,Y,R*1.6,0,6.29);c.fill();
        for(const p of disk){const a=p.a+spin*p.s*2.2,rr=R*p.r;G.circle(X+Math.cos(a)*rr,Y+Math.sin(a)*rr*.85,1.6+p.s,p.c)}
        c.save();c.translate(X,Y);c.rotate(spin*2);for(let i=0;i<5;i++){c.strokeStyle=`rgba(200,160,255,${.35-i*.05})`;c.lineWidth=3;c.beginPath();c.arc(0,0,R*(1.05+i*.12),i*1.2,i*1.2+2.2);c.stroke()}c.restore();
        for(const e of eat){const k=1-e.t;G.emo(e.e,X+e.x,Y+e.y,e.s*k,k,e.t*12)}
        const core=c.createRadialGradient(X,Y,0,X,Y,R);core.addColorStop(0,'#000000');core.addColorStop(.75,'#06020E');core.addColorStop(.93,'#2A0E4A');core.addColorStop(1,'#FFB45A');c.fillStyle=core;c.beginPath();c.arc(X,Y,R,0,6.29);c.fill();
        c.save();c.shadowColor='#FFB45A';c.shadowBlur=16;c.strokeStyle='rgba(255,200,120,.95)';c.lineWidth=2.5;c.beginPath();c.arc(X,Y,R,0,6.29);c.stroke();c.restore();
        G.rr(AW/2-140,8,280,50,16,'#FFF8E6','#6B3D1F',3);G.text(`빨아들일 것: ${cat}`,AW/2,26,20,'#3A240E','center',null);G.text(TRASH2[cat].join(' '),AW/2,46,16,'#3A240E','center',null);G.rr(AW/2-120,62,240*(catT/CT),6,3,'#FFD24A')},
      down(x,y){aim={x,y}},move(x,y,dn){if(dn)aim={x,y}},up(){aim=null},
      key(k){const d={L:[-1,0],R:[1,0],U:[0,-1],D:[0,1]}[k];if(d)aim={x:AW/2+d[0]*100,y:AH/2+d[1]*100}},keyup(){aim=null}
    }}});

/* ---------- 환경 3: 미세먼지 볼 블라스트 — 하늘 그림 · 폭발 · 물대포 차 · 아이템 · 마지막 대왕 공 ---------- */
const POLL2=[['미세먼지','가까운 곳은 걷거나 자전거를 타요'],['매연','대중교통을 이용하면 매연이 줄어요'],['플라스틱','다회용 컵과 장바구니를 써요'],['온실가스','안 쓰는 플러그를 뽑아요'],['폐수','세제를 알맞게 써요'],['쓰레기','분리배출로 자원을 다시 써요']];
/* 생태 3: 미세먼지 볼 블라스트 — 숫자 따라 색이 바뀌는 사탕 공 · 맑은 방울 모아 물대포 레벨업 · 콤보 · 대왕 보스 */
const BB_TIER=[[9,'#5FD35F','#23803A'],[20,'#FFD23F','#B97F00'],[40,'#FF9A3C','#B84A0C'],[75,'#FF5C8A','#A81E4A'],[130,'#A86BFF','#5226A8'],[1e9,'#FF4545','#8E1010']];
const BB_SIZE={3:{r:46,sp:72,top:120},2:{r:32,sp:92,top:165},1:{r:21,sp:112,top:215},9:{r:64,sp:64,top:96}};
const BB_GUN=[[1,.1],[2,.09],[2,.07],[3,.065],[3,.05]],BB_NEED=[8,20,36,56];
arcDefine({id:'eco_ballblast',ch:'eco',name:'미세먼지 볼 블라스트',tag:'튀는 공 부수기 · 물대포 레벨업',from:'볼 블라스트 (Ball Blast)',icon:'💥',
  how:['좌우로 끌어 물대포 차를 움직여요','숫자를 0으로! 큰 공은 둘로 갈라져요','💧방울을 모으면 물대포 레벨 업!'],
  init(G){
    const GY=488,hpMul=1+G.d*2.2,nBig=4+Math.round(G.d*4);
    const queue=[...Array(nBig)].map((_,i)=>({size:i>1&&Math.random()<.45?3:i%3===2?2:3,hp:Math.round(G.rand(10,16)*hpMul+i*2.5)}));
    const bossHp=Math.round(70*hpMul),total=queue.reduce((s,q)=>s+q.hp*(q.size===3?3:2),0)+bossHp*4;
    let balls=[],shots=[],gems=[],caps=[],booms=[],smog=[],dmg=0,tx=AW/2,px=AW/2,vxT=0,wheel=0,fire=0,recoil=0,hearts=3,inv=0,shield=0,rapid=0,spread=0,
      gun=0,gemN=0,spawnT=.6,boss=0,banner=null,combo=0,comboT=0,comboShow=null,flashT=0,keyD=0,sfxT=0,doneT=-1;
    for(let i=0;i<7;i++)smog.push({x:G.rand(0,AW),y:G.rand(40,420),r:G.rand(50,95),v:G.rand(6,16)*(Math.random()<.5?-1:1)});
    const city=[];for(let x=0;x<AW;){const w=G.ri(26,48),h=G.ri(40,120);city.push({x,w,h,win:[...Array(12)].map(()=>Math.random()<.4)});x+=w+G.ri(2,6)}
    const tier=hp=>BB_TIER.find(t=>hp<=t[0]);
    const mk=(x,y,vx,vy,size,hp,lab)=>({x,y,vx,vy,size,r:BB_SIZE[size].r,hp,max:hp,lab:lab||G.pick(POLL2),hit:0,nk:0,sq:0,blink:G.rand(1,4),in:false});
    const ban=(t,s,col)=>{banner={t,s,col:col||'#FFE27A',k:1.8}};
    const spawn=()=>{const q=queue.shift(),L=Math.random()<.5,S=BB_SIZE[q.size];balls.push(mk(L?-S.r:AW+S.r,G.rand(70,130),(L?1:-1)*S.sp,0,q.size,q.hp))};
    const hurtAt=b=>{const nx=G.clamp(b.x,px-30,px+30),ny=G.clamp(b.y,GY-44,GY);return Math.hypot(b.x-nx,b.y-ny)<b.r*.8};
    const breakBall=b=>{G.burst(b.x,b.y,tier(b.max)[1],18,260);G.burst(b.x,b.y,'#FFFFFF',10,200);booms.push({x:b.x,y:b.y,r:b.r,t:0,col:tier(b.max)[1]});
      G.shake=Math.max(G.shake,Math.min(12,3+b.r/7));G.sfx(b.size===9?'clear':'pop');G.addScore(b.max*2);
      combo=comboT>0?combo+1:1;comboT=1.3;if(combo>=2){comboShow={n:combo,k:1};G.addScore(combo*5);if(combo>=3)G.sfx('combo')}
      const n=b.size===9?10:b.size===3?4:b.size===2?3:2;for(let i=0;i<n;i++)gems.push({x:b.x,y:b.y,vx:G.rand(-130,130),vy:G.rand(-320,-160),t:0});
      if(Math.random()<(b.size===1?.1:.2))caps.push({x:b.x,y:b.y,vy:-200,k:G.pick(['⚡','💧','🛡️']),t:0});
      if(b.size===9||b.size>1){const ns=b.size===9?3:b.size-1,hp=Math.max(1,Math.ceil(b.max*.5)),S=BB_SIZE[ns];[-1,1].forEach(d=>balls.push(Object.assign(mk(b.x+d*b.r*.4,b.y,d*S.sp,-330,ns,hp,b.lab),{in:true})))}
      else G.pop('💡 '+b.lab[1],AW/2,232,'#B8FFC8',16)};
    const levelUp=()=>{if(gun>=BB_NEED.length||gemN<BB_NEED[gun])return;gun++;G.sfx('unlock');const g=BB_GUN[gun];ban(`물대포 레벨 ${gun+1}!`,g[0]>BB_GUN[gun-1][0]?`물줄기 ${g[0]}개 💦`:'더 빨리 쏴요 💨','#8FE3FF');G.burst(px,GY-60,'#8FE3FF',24,220)};
    return {
      boostText:'물대포 강화', boost(){rapid=10;spread=10;G.pop('💪 강화!',px,GY-90,'#FFE27A',22)},
      update(dt){
        if(keyD)tx=G.clamp(tx+keyD*420*dt,40,AW-40);const ox=px;px+=G.clamp(tx-px,-900*dt,900*dt);vxT=(px-ox)/Math.max(dt,1e-3);wheel+=(px-ox)/10;
        inv=Math.max(0,inv-dt);rapid=Math.max(0,rapid-dt);spread=Math.max(0,spread-dt);flashT=Math.max(0,flashT-dt);recoil=Math.max(0,recoil-dt*40);sfxT-=dt;
        comboT-=dt;if(comboShow){comboShow.k-=dt*.8;if(comboShow.k<=0)comboShow=null}if(banner){banner.k-=dt;if(banner.k<=0)banner=null}
        for(const s of smog){s.x+=s.v*dt;if(s.x<-s.r)s.x=AW+s.r;if(s.x>AW+s.r)s.x=-s.r}
        /* 공 나오기 */
        if(queue.length){spawnT-=dt;const maxOn=2+(G.d>.45?1:0);if(spawnT<=0&&balls.length<maxOn+2&&balls.filter(b=>b.size>=2).length<maxOn){spawn();spawnT=2.4-G.d*.6}}
        else if(!boss&&!balls.length){boss=1;ban('미세먼지 대왕 등장!','하늘을 맑게! 모두 함께 줄여요','#FF9A7A');G.sfx('boss');balls.push(Object.assign(mk(AW/2,-80,52,0,9,bossHp,['미세먼지 대왕','하늘을 맑게! 모두 함께 줄여요']),{in:true}))}
        else if(boss&&!balls.length){if(doneT<0)doneT=1.2;doneT-=dt;if(doneT<=0)return G.win(starsByHearts(hearts))}
        /* 쏘기 */
        const g=BB_GUN[gun],n=spread?3:g[0],rate=rapid?g[1]*.6:g[1];fire-=dt;
        if(fire<=0&&doneT<0){fire=rate;recoil=4;const offs=n===1?[0]:n===2?[-8,8]:[-13,0,13];for(const o of offs)shots.push({x:px+o,y:GY-74,vx:n===3?o*5:0,dmg:1})}
        for(const s of shots){s.y-=760*dt;s.x+=s.vx*dt}
        /* 공 움직이기 */
        for(const b of balls){b.hit=Math.max(0,b.hit-dt);b.nk=Math.max(0,b.nk-dt*4);b.sq=Math.max(0,b.sq-dt*4);b.blink-=dt;if(b.blink<0)b.blink=G.rand(1.5,4);
          b.vy+=540*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
          if(!b.in&&b.x>b.r&&b.x<AW-b.r)b.in=true;
          if(b.in){if(b.x<b.r){b.x=b.r;b.vx=Math.abs(b.vx)}if(b.x>AW-b.r){b.x=AW-b.r;b.vx=-Math.abs(b.vx)}}
          const floor=GY-b.r;if(b.y>floor){b.y=floor;b.vy=-Math.sqrt(2*540*Math.max(60,floor-BB_SIZE[b.size].top));b.sq=1;if(b.size>=3)G.shake=Math.max(G.shake,b.size===9?6:2)}
          if(!inv&&hurtAt(b)){if(shield){shield=0;inv=1;G.sfx('hit');G.burst(px,GY-40,'#8FE3FF',20,240);G.pop('🛡️ 막았다!',px,GY-90,'#8FE3FF',20)}
            else{hearts--;inv=2.2;G.sfx('hurt');G.shake=10;flashT=.35;if(hearts<=0)return G.lose('오염 공에 너무 많이 맞았어요!')}}
          for(const s of shots){if(s.hit||b.hp<=0)continue;if(Math.hypot(s.x-b.x,s.y-b.y)<b.r+3){s.hit=1;b.hp-=s.dmg;dmg+=s.dmg;b.hit=.05;b.nk=1;
            if(Math.random()<.3)G.fx.push({k:'p',x:s.x,y:b.y+b.r*.2*Math.random()-b.r*.6,vx:G.rand(-90,90),vy:G.rand(-140,-40),life:.35,max:.35,col:'#DFF8FF',r:2.5});
            if(sfxT<=0){G.sfx('tick');sfxT=.09}}}}
        shots=shots.filter(s=>s.y>-20&&!s.hit);
        const dead=balls.filter(b=>b.hp<=0);balls=balls.filter(b=>b.hp>0);dead.forEach(breakBall);
        /* 맑은 방울 · 아이템 */
        for(const m of gems){m.t+=dt;if(m.t>.55){const dx=px-m.x,dy=GY-40-m.y,dd=Math.hypot(dx,dy)||1,sp=200+m.t*900;m.x+=dx/dd*sp*dt;m.y+=dy/dd*sp*dt;if(dd<22){m.got=1;gemN++;if(sfxT<=0){G.sfx('coin');sfxT=.05}}}
          else{m.vy+=700*dt;m.x+=m.vx*dt;m.y+=m.vy*dt;if(m.y>GY-8){m.y=GY-8;m.vy*=-.45}}}
        gems=gems.filter(m=>!m.got);levelUp();
        for(const p of caps){p.t+=dt;p.vy+=500*dt;p.y+=p.vy*dt;if(p.y>GY-18){p.y=GY-18;p.vy=-Math.abs(p.vy)*.4}
          if(Math.abs(p.x-px)<38&&p.y>GY-70){p.got=1;G.sfx('star');if(p.k==='⚡'){spread=7;G.pop('⚡ 세 갈래 물줄기!',px,GY-96,'#FFE27A',20)}else if(p.k==='💧'){rapid=7;G.pop('💧 빨리 쏘기!',px,GY-96,'#8FE3FF',20)}else{shield=1;G.pop('🛡️ 방패!',px,GY-96,'#BFF',20)}}}
        caps=caps.filter(p=>!p.got&&p.t<7);
        for(const e of booms)e.t+=dt*2.2;booms=booms.filter(e=>e.t<1);
        const need=BB_NEED[gun];G.setHud(HEARTS(hearts),`💦 물대포 Lv${gun+1}`,need?`💧 ${gemN}/${need}`:'💧 최고 레벨!')},
      draw(c){const prog=Math.min(1,dmg/total),im=v2img('blast_sky.jpg');
        if(im)drawCover(c,im,0,0,AW,AH);else{c.fillStyle=G.grad(0,AH,'#8AB8E0','#5A6A7A');c.fillRect(0,0,AW,AH)}
        c.fillStyle=`rgba(96,80,66,${.45*(1-prog)})`;c.fillRect(0,0,AW,AH);
        if(prog>.5){c.save();c.globalAlpha=(prog-.5)*.9;c.globalCompositeOperation='lighter';const sg=c.createRadialGradient(AW*.8,40,10,AW*.8,40,260);sg.addColorStop(0,'rgba(255,240,180,.7)');sg.addColorStop(1,'rgba(255,240,180,0)');c.fillStyle=sg;c.fillRect(0,0,AW,AH);c.restore()}
        for(const s of smog){c.fillStyle=`rgba(70,60,52,${.22*(1-prog)})`;c.beginPath();c.arc(s.x,s.y,s.r,0,6.29);c.arc(s.x+s.r*.7,s.y+8,s.r*.7,0,6.29);c.arc(s.x-s.r*.7,s.y+10,s.r*.6,0,6.29);c.fill()}
        /* 도시 */
        for(const b of city){const y=GY-b.h;c.fillStyle=prog>.6?'#3E5A7A':'#4A4652';c.fillRect(b.x,y,b.w,b.h);c.fillStyle='rgba(255,255,255,.08)';c.fillRect(b.x,y,4,b.h);
          for(let i=0;i<b.win.length;i++){const wx=b.x+6+(i%3)*((b.w-12)/3),wy=y+8+Math.floor(i/3)*14;if(wy>GY-10)break;c.fillStyle=b.win[i]?'rgba(255,226,140,.85)':'rgba(20,24,40,.45)';c.fillRect(wx,wy,Math.max(4,(b.w-12)/3-4),7)}}
        /* 길 */
        G.rr(0,GY,AW,AH-GY,0,'#34343E');G.rr(0,GY,AW,5,0,'#9A9AAA');for(let x=-((wheel*4)%44+44);x<AW;x+=44)G.rr(x,GY+24,24,4,2,'#E8E8E8');
        /* 진행 막대 */
        G.rr(20,10,AW-40,20,10,'rgba(20,20,30,.55)','#FFF',2);const pw=(AW-44)*prog;if(pw>4){const pg=c.createLinearGradient(22,0,22+pw,0);pg.addColorStop(0,'#5FD35F');pg.addColorStop(1,'#5FD3FF');G.rr(22,12,pw,16,8,pg)}
        G.text(`하늘 맑음 ${Math.round(prog*100)}%`,AW/2,21,13,'#FFFFFF','center','#1A2A3A');G.emo('👑',AW-26,20,22);
        /* 아이템 */
        for(const p of caps){const a=p.t>5.5?(Math.floor(p.t*8)%2?.4:1):1;c.globalAlpha=a;G.circle(p.x,p.y,17,'rgba(255,255,255,.9)','#FFB13A',3);G.emo(p.k,p.x,p.y,20);c.globalAlpha=1}
        for(const m of gems){c.save();c.translate(m.x,m.y);c.rotate(.785);G.rr(-5,-5,10,10,2,'#8FE3FF','#FFFFFF',1.5);c.restore()}
        /* 물줄기 */
        for(const s of shots){c.fillStyle='rgba(150,225,255,.35)';c.beginPath();c.ellipse(s.x,s.y+4,6,13,0,0,6.29);c.fill();G.rr(s.x-3,s.y-8,6,18,3,'#E6FAFF');G.circle(s.x,s.y-6,3.5,'#FFFFFF')}
        /* 공 */
        for(const b of balls){const T=tier(b.hp),sh=Math.max(.3,1-(GY-b.y-b.r)/420);c.fillStyle=`rgba(0,0,0,${.32*sh})`;c.beginPath();c.ellipse(b.x,GY+3,b.r*sh,b.r*.2*sh,0,0,6.29);c.fill();
          const sq=b.sq*.18,pul=1+b.nk*.05;c.save();c.translate(b.x,b.y+b.r*sq*.5);c.scale((1+sq)*pul,(1-sq)*pul);const r=b.r;
          const gr=c.createRadialGradient(-r*.35,-r*.4,r*.1,0,0,r);gr.addColorStop(0,b.hit?'#FFFFFF':'#FFFFFFAA');gr.addColorStop(.25,T[1]);gr.addColorStop(1,T[2]);
          G.circle(0,0,r,gr,'#2A1A1A',Math.max(2.5,r*.07));
          c.fillStyle='rgba(60,40,40,.18)';for(const [a,dd,rr] of [[.6,.55,.22],[2.4,.6,.16],[4,.5,.2],[5.3,.62,.14]]){c.beginPath();c.arc(Math.cos(a)*r*dd,Math.sin(a)*r*dd,r*rr,0,6.29);c.fill()}
          c.fillStyle='rgba(255,255,255,.5)';c.beginPath();c.ellipse(-r*.38,-r*.5,r*.26,r*.14,-.6,0,6.29);c.fill();
          /* 얼굴: 눈이 물대포 차를 따라봐요 */
          const ey=-r*.3,ex=r*.3,lk=G.clamp((px-b.x)/160,-1,1)*r*.05,open=b.blink>.12;
          if(open){for(const s of [-1,1]){G.circle(s*ex,ey,r*.15,'#FFFFFF','#1A1010',Math.max(1.5,r*.04));G.circle(s*ex+lk,ey+r*.04,r*.075,'#1A1010')}}
          else{c.strokeStyle='#1A1010';c.lineWidth=Math.max(2,r*.06);c.beginPath();c.moveTo(-ex-r*.13,ey);c.lineTo(-ex+r*.13,ey);c.moveTo(ex-r*.13,ey);c.lineTo(ex+r*.13,ey);c.stroke()}
          c.strokeStyle='#1A1010';c.lineWidth=Math.max(2,r*.07);c.lineCap='round';c.beginPath();c.moveTo(-ex-r*.2,ey-r*.25);c.lineTo(-ex+r*.12,ey-r*.14);c.moveTo(ex+r*.2,ey-r*.25);c.lineTo(ex-r*.12,ey-r*.14);c.stroke();
          const ns=Math.max(15,r*.62)*(1+b.nk*.18);G.text(String(b.hp),0,r*.3,ns,'#FFFFFF','center','#1A1010');
          if(r>=40)G.text(b.lab[0],0,r*.74,Math.max(11,r*.2),'#FFF3C0','center','#1A1010');
          c.restore();if(b.size===9)G.emo('👑',b.x,b.y-b.r-12,36)}
        for(const e of booms){c.strokeStyle=e.col;c.globalAlpha=1-e.t;c.lineWidth=10*(1-e.t)+1;c.beginPath();c.arc(e.x,e.y,e.r*(.6+e.t*1.6),0,6.29);c.stroke();c.globalAlpha=1}
        /* 물대포 차 */
        if(!(inv&&Math.floor(G.t*12)%2)){const x=px,y=GY,tilt=G.clamp(vxT/3000,-.08,.08);c.fillStyle='rgba(0,0,0,.32)';c.beginPath();c.ellipse(x,y+3,40,7,0,0,6.29);c.fill();
          c.save();c.translate(x,y);c.rotate(tilt);
          const nb=spread?3:BB_GUN[gun][0],bx=nb===1?[0]:nb===2?[-8,8]:[-13,0,13];
          for(const o of bx){G.rr(o-5,-78+recoil,10,30,4,'#BFEFFF','#1A2A4A',2);G.rr(o-7,-80+recoil,14,7,3,'#3C5A80')}
          G.rr(-22,-54,44,24,12,'#E8F6FF','#1A2A4A',2.5);G.rr(-16,-46,32,8,4,'#5FC8FF');
          G.rr(-38,-34,76,26,9,'#2F7DE1','#12304F',2.5);G.rr(-38,-24,76,6,0,'#FFFFFF');
          G.circle(-30,-36,4,Math.floor(G.t*4)%2?'#FF5A5A':'#5A9BFF');
          for(const wx of [-22,22]){G.circle(wx,-6,10,'#222','#999',2.5);c.save();c.translate(wx,-6);c.rotate(wheel);G.rr(-1.5,-8,3,16,1,'#BBB');G.rr(-8,-1.5,16,3,1,'#BBB');c.restore()}
          if(fire>BB_GUN[gun][1]*.6)for(const o of bx)G.circle(o,-82,6,'rgba(230,250,255,.9)');
          c.restore();if(shield){c.strokeStyle=`rgba(140,230,255,${.6+.3*Math.sin(G.t*8)})`;c.lineWidth=3;c.beginPath();c.arc(x,y-38,50,0,6.29);c.stroke();c.fillStyle='rgba(140,230,255,.12)';c.fill()}}
        if(rapid||spread)G.text(`${spread?'⚡':''}${rapid?'💧':''} ${Math.ceil(Math.max(rapid,spread))}`,px,GY+40,14,'#FFE27A');
        if(flashT){c.fillStyle=`rgba(255,60,60,${flashT})`;c.fillRect(0,0,AW,AH)}
        if(comboShow){const s=1+Math.max(0,comboShow.k-.75)*2;c.save();c.globalAlpha=Math.min(1,comboShow.k*2);c.translate(AW/2,180);c.scale(s,s);G.text(`${comboShow.n} 콤보!`,0,0,24+Math.min(comboShow.n,8)*2,'#FFD23F','center','#5A1A0A');c.restore()}
        if(banner){const s=1+Math.max(0,banner.k-1.5)*2;c.save();c.globalAlpha=Math.min(1,banner.k*2);c.translate(AW/2,280);c.scale(s,s);G.rr(-150,-34,300,banner.s?72:48,16,'rgba(20,20,40,.7)');
          G.text(banner.t,0,-10,26,banner.col,'center','#1A0A0A');if(banner.s)G.text(banner.s,0,20,15,'#FFFFFF','center','#1A0A0A');c.restore()}},
      down(x){tx=G.clamp(x,40,AW-40)},move(x){tx=G.clamp(x,40,AW-40)},
      key(k){if(k==='L')keyD=-1;if(k==='R')keyD=1},keyup(k){if(k==='L'||k==='R')keyD=0}
    }}});
