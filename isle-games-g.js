/* ===== 다시 만든 놀이 3: 친구 모으기 런 · 대피 퀴즈 런 · 칭찬 리듬 · 안전 건널목 · 꿈의 탑 스택볼 · 직업 꼬들 =====
   arcDefine 은 같은 id 면 바꿔 끼워요. 그림 파일은 assets/v2 (Canva 로 그린 그림). */

/* ---------- 함께 쓰는 도구 ---------- */
const V2IMG={};
function v2img(k){let im=V2IMG[k];if(!im){im=new Image();im.decoding='async';im.src='assets/v2/'+k;V2IMG[k]=im}return im.complete&&im.naturalWidth?im:null}
/* 그림을 칸에 꽉 차게 (잘라서) 그려요 */
function drawCover(c,im,x,y,w,h,a=1){const s=Math.max(w/im.width,h/im.height),iw=im.width*s,ih=im.height*s;c.save();if(a!==1)c.globalAlpha=a;c.beginPath();c.rect(x,y,w,h);c.clip();c.drawImage(im,x+(w-iw)/2,y+(h-ih)/2,iw,ih);c.restore()}
/* 문제 + 보기(가·나·다)를 크게 · 보기마다 색 (줄 색과 같아요) */
const QCOL=['#FF9FC0','#8FE3FF','#C8F59A'];
function drawQBig(G,q,order,y){const c=G.ctx,qL=wrapText(c,q.q,AW-40,18).slice(0,3);
  const op=order.map((oi,j)=>oi==null?null:wrapText(c,`${'가나다'[j]}. ${q.o[oi]}`,AW-48,17).slice(0,2));
  const h=16+qL.length*22+6+op.reduce((a,o)=>a+(o?o.length*20+4:0),0)+6;
  G.rr(8,y,AW-16,h,14,'rgba(18,10,34,.93)','#FFD24A',3);
  qL.forEach((t,i)=>G.text(t,AW/2,y+18+i*22,18,'#FFF3D6'));let yy=y+18+qL.length*22+6;
  op.forEach((o,j)=>{if(!o)return;o.forEach((t,k)=>G.text(t,24,yy+k*20,17,QCOL[j],'left'));yy+=o.length*20+4});return h}
/* 보기 순서: 정답 1개 + 다른 보기 (같은 글자 보기는 빼요) · 보기가 2개면 한 줄은 막힌 길(null) */
function quizOrder(G,q){const ans=String(q.o[q.a]).trim();let idx=q.o.map((_,i)=>i).filter(i=>i===q.a||String(q.o[i]).trim()!==ans);
  idx=G.shuffle(idx.filter(i=>i!==q.a)).slice(0,2);idx.push(q.a);const ord=G.shuffle(idx);while(ord.length<3)ord.splice(G.ri(0,ord.length),0,null);return ord}

/* ---------- 인성 2: 친구 모으기 런 (카운트 마스터즈) ----------
   문마다 착한 행동 1개 · 나쁜 행동 1개 (둘 다 나쁜 문은 없어요). 숫자는 지나가야 보여요 → 행동을 읽고 골라요. */
arcDefine({id:'character_crowd',ch:'character',name:'친구 모으기 런',tag:'착한 행동 문 고르기',from:'카운트 마스터즈 (Count Masters)',icon:'🧑‍🤝‍🧑',
  how:['좌우로 끌어서 움직여요','착한 행동 문으로! 친구가 늘어요','끝에서 외로운 거인과 친구가 돼요'],
  init(G){
    const pairs=6+Math.round(G.d*6), SP=240+150*G.d, HOR=170, PY=448, FOC=330, RW=150;const LOGW=22;
    const kinds=G.shuffle(KIND.slice()), unk=G.shuffle(UNKIND.slice());let ki=0,ui=0;
    const good=()=>Math.random()<.28?{op:'×',v:2}:{op:'+',v:G.ri(3,6)+Math.round(G.d*5)};
    const bad=()=>Math.random()<.3?{op:'÷',v:2}:{op:'-',v:G.ri(3,6)+Math.round(G.d*7)};
    let ev=[];for(let i=0;i<pairs;i++){
      ev.push({z:620+i*440,type:'gate',sides:G.shuffle([{k:true,txt:kinds[ki++%kinds.length],...good()},{k:false,txt:unk[ui++%unk.length],...bad()}]),done:false});
      if(G.d>.12&&i<pairs-1)ev.push({z:620+i*440+220,type:'log',x:G.rand(-100,100),dir:Math.random()<.5?1:-1,done:false,rot:0})}
    let opt=5;ev.filter(e=>e.type==='gate').forEach(e=>{const s=e.sides.find(s=>s.k);opt=s.op==='×'?opt*2:opt+s.v});
    const bossHP=Math.max(12,Math.round(opt*(.55+.3*G.d)));
    let n=5,cx=AW/2,tx=AW/2,keyD=0,dist=0,phase='run',bt=0,clash=0,bossN=bossHP,shownN=0,flash=null,confT=0;
    const rad=()=>Math.min(72,12+Math.sqrt(n)*6);
    const P=z=>{const s=FOC/(FOC+Math.max(-FOC*.7,z));return {s,y:HOR+(PY-HOR)*s}};
    const X=(wx,s)=>AW/2+wx*s;
    const apply=s=>{const b=n;if(s.op==='+')n+=s.v;else if(s.op==='-')n=Math.max(0,n-s.v);else if(s.op==='×')n*=s.v;else n=Math.floor(n/s.v);
      flash={k:s.k,txt:`${s.op}${s.v}`,sub:s.k?'😊 착한 행동!':'😢 나쁜 행동…',t:1.1};G.sfx(n>b?'star':'no');if(!s.k){G.shake=5;G.burst(cx,PY-20,'#FF7A8A',18)}else G.burst(cx,PY-20,'#7FFFA0',22)};
    /* 거인 (코드로 그린 그림) */
    const giant=(x,y,s,sad)=>{const c=G.ctx;c.save();c.translate(x,y);c.scale(s,s);
      const body=c.createRadialGradient(-30,-150,20,0,-110,150);body.addColorStop(0,'#CDEBFF');body.addColorStop(1,'#5F9FD6');
      c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(0,0,120,22,0,0,6.29);c.fill();
      c.fillStyle=body;c.beginPath();c.ellipse(-120,-120,34,70,.5,0,6.29);c.ellipse(120,-120,34,70,-.5,0,6.29);c.fill();
      c.beginPath();c.ellipse(0,-115,110,118,0,0,6.29);c.fill();c.beginPath();c.ellipse(0,-250,78,70,0,0,6.29);c.fill();
      c.fillStyle='#4A7FB0';c.beginPath();c.ellipse(-40,-8,34,16,0,0,6.29);c.ellipse(40,-8,34,16,0,0,6.29);c.fill();
      c.strokeStyle='#2A4A6A';c.lineWidth=6;c.lineCap='round';
      c.beginPath();if(sad){c.arc(-28,-258,13,Math.PI*1.1,Math.PI*1.9);c.moveTo(41,-258);c.arc(28,-258,13,Math.PI*1.1,Math.PI*1.9)}else{c.arc(-28,-262,13,.2,Math.PI-.2);c.moveTo(41,-262);c.arc(28,-262,13,.2,Math.PI-.2)}c.stroke();
      c.beginPath();if(sad)c.arc(0,-205,20,Math.PI*1.15,Math.PI*1.85);else c.arc(0,-226,22,.3,Math.PI-.3);c.stroke();
      c.fillStyle='#FF9FB0';c.globalAlpha=.6;c.beginPath();c.ellipse(-50,-232,12,7,0,0,6.29);c.ellipse(50,-232,12,7,0,0,6.29);c.fill();c.globalAlpha=1;
      if(sad){c.fillStyle='#8FD8FF';c.beginPath();c.ellipse(-34,-236+((G.t*40)%30),6,9,0,0,6.29);c.fill()}
      c.restore()};
    return {
      boostText:'친구 +8', boost(){n+=8},
      update(dt){if(keyD)tx=G.clamp(tx+keyD*320*dt,40,AW-40);cx=G.lerp(cx,tx,Math.min(1,dt*10));if(flash){flash.t-=dt;if(flash.t<=0)flash=null}
        if(phase==='run'){dist+=SP*dt;
          for(const e of ev){e.z-=SP*dt;
            if(e.type==='gate'&&!e.done&&e.z<=0){e.done=1;apply(e.sides[cx<AW/2?0:1]);if(n<=0)return G.lose('친구가 모두 떠났어요… 착한 행동 문을 골라요!')}
            if(e.type==='log'){e.rot+=dt*6;e.x+=e.dir*(70+120*G.d)*dt;if(e.x<-105||e.x>105){e.dir*=-1;e.x=G.clamp(e.x,-105,105)}
              if(!e.done&&Math.abs(e.z)<18){const wx=cx-AW/2,R=rad(),ov=Math.max(0,Math.min(wx+R,e.x+LOGW+10)-Math.max(wx-R,e.x-LOGW-10))/(2*R);
                if(ov>0){const lost=Math.max(1,Math.ceil(n*ov*.5));n=Math.max(0,n-lost);e.done=1;G.sfx('hurt');G.shake=6;flash={k:false,txt:`-${lost}`,sub:'🪵 통나무에 걸렸어요',t:1};if(n<=0)return G.lose('친구가 모두 떠났어요…')}}}}
          ev=ev.filter(e=>e.z>-400);
          if(!ev.length){phase='boss';bt=0;G.sfx('boss')}}
        else if(phase==='boss'){bt+=dt;dist+=SP*dt*Math.max(0,1-bt/1.3);
          if(bt>1.5&&!clash){clash=1;shownN=n;bossN=bossHP}
          if(clash===1){const r=Math.max(10,bossHP/1.3)*dt;const d=Math.min(r,bossN,shownN);bossN-=d;shownN-=d;if(Math.random()<.3)G.sfx('pop');
            if(bossN<=0||shownN<=0){clash=2;bt=0;if(n>=bossHP){phase='win';G.sfx('fanfare');if(typeof confetti==='function')confetti(60)}else{phase='lose';G.sfx('no')}}}}
        else if(phase==='win'){bt+=dt;confT-=dt;if(confT<=0){confT=.25;G.burst(G.rand(40,AW-40),G.rand(60,300),G.pick(['#FFE27A','#FF9FC0','#8FE3FF','#C8F59A']),14,180)}
          if(bt>2.8&&!G.over)G.win(n>=bossHP*1.6?3:n>=bossHP*1.25?2:1)}
        else if(phase==='lose'){bt+=dt;if(bt>1.3)G.lose(`친구가 ${bossHP-n}명 모자랐어요. 착한 행동 문을 골라요!`)}
        G.setHud(`🧑‍🤝‍🧑 ${n}명`,`🚪 ${pairs-ev.filter(e=>e.type==='gate').length}/${pairs}`,`😢 거인 ${bossHP}`)},
      draw(c){
        /* 하늘 · 해 · 구름 · 언덕 */
        c.fillStyle=G.grad(0,HOR,'#5DB8FF','#FFE7BE');c.fillRect(0,0,AW,HOR+2);
        G.circle(292,58,30,'rgba(255,240,170,.45)');G.circle(292,58,22,'#FFF4B8');
        for(let i=0;i<3;i++){const x=((i*150+G.t*8)%520)-80,y=40+i*26;c.fillStyle='rgba(255,255,255,.9)';c.beginPath();c.ellipse(x,y,34,12,0,0,6.29);c.ellipse(x+22,y-8,22,13,0,0,6.29);c.ellipse(x-20,y-4,18,10,0,0,6.29);c.fill()}
        c.fillStyle='#8FCB7A';c.beginPath();c.moveTo(0,HOR);for(let x=0;x<=AW;x+=20)c.lineTo(x,HOR-14-Math.sin(x*.03+1)*10-Math.sin(x*.011)*8);c.lineTo(AW,HOR);c.fill();
        c.fillStyle=G.grad(HOR,AH,'#86D06E','#3F8F45');c.fillRect(0,HOR,AW,AH-HOR);
        /* 달리는 길: 타일 띠 + 빨강·하양 연석 */
        const BAND=70,zMax=2800;let z=zMax-((zMax+dist)%BAND);
        for(;z>-300;z-=BAND){const a=P(z),b=P(z-BAND),k=Math.floor((z+dist)/BAND);
          const quad=(w0,w1,col)=>{c.fillStyle=col;c.beginPath();c.moveTo(X(w0,a.s),a.y);c.lineTo(X(w1,a.s),a.y);c.lineTo(X(w1,b.s),b.y);c.lineTo(X(w0,b.s),b.y);c.closePath();c.fill()};
          quad(-RW,RW,k%2?'#8EC2FF':'#A9D2FF');quad(-RW,-RW*.02,k%2?'rgba(255,255,255,.05)':'rgba(255,255,255,0)');
          quad(-RW-18,-RW,k%2?'#FF5A6A':'#FFFFFF');quad(RW,RW+18,k%2?'#FF5A6A':'#FFFFFF');
          quad(-RW-26,-RW-18,'#2F6FB8');quad(RW+18,RW+26,'#2F6FB8')}
        c.fillStyle=G.grad(HOR-2,HOR+40,'rgba(255,240,215,.9)','rgba(255,240,215,0)');c.fillRect(0,HOR-2,AW,42);
        /* 길가 나무 */
        const trees=[];for(let i=0;i<14;i++){const zz=((i*200-dist)%2800+2800)%2800-150;for(const sd of [-1,1])trees.push({z:zz,x:sd*(RW+70+(i%3)*40),e:i%4?'🌳':'🌷'})}
        trees.sort((a,b)=>b.z-a.z).forEach(t=>{const p=P(t.z);if(p.y>AH+40)return;G.emo(t.e,X(t.x,p.s),p.y-30*p.s,(t.e==='🌳'?80:40)*p.s)});
        /* 문 · 통나무 (먼 것부터) */
        [...ev].sort((a,b)=>b.z-a.z).forEach(e=>{if(e.z>2500||e.z<-120)return;const p=P(e.z),s=p.s;
          if(e.type==='log'){/* 짧은 통나무: 그림자 · 나무껍질 · 나이테 (굴러가며 나이테가 돌아요) */
            const x=X(e.x,s),y=p.y-13*s,L=LOGW*s,r=12*s;c.fillStyle='rgba(0,30,70,.28)';c.beginPath();c.ellipse(x,p.y,L+r,6*s,0,0,6.29);c.fill();
            const g=c.createLinearGradient(0,y-r,0,y+r);g.addColorStop(0,'#C48A52');g.addColorStop(.45,'#8A5A30');g.addColorStop(1,'#4E2C14');G.rr(x-L,y-r,2*L,2*r,3*s,g);
            c.strokeStyle='rgba(60,32,12,.55)';c.lineWidth=Math.max(1,1.6*s);for(const k of [-.45,0,.45]){c.beginPath();c.moveTo(x-L+2*s,y+k*r);c.bezierCurveTo(x-L*.3,y+k*r-2*s,x+L*.3,y+k*r+2*s,x+L-2*s,y+k*r);c.stroke()}
            for(const sd of [-1,1]){const cx2=x+sd*L;G.circle(cx2,y,r,'#E8C08A','#6B3D1F',Math.max(1,2*s));c.strokeStyle='rgba(140,90,40,.8)';c.lineWidth=Math.max(.8,1.2*s);
              for(const rr of [.65,.35]){c.beginPath();c.arc(cx2,y,r*rr,e.rot*sd,e.rot*sd+5);c.stroke()}G.circle(cx2,y,1.6*s,'#8A5A30')}return}
          const H=130*s;e.sides.forEach((sd,i)=>{const w0=i?6:-RW+4,w1=i?RW-4:-6,x0=X(w0,s),x1=X(w1,s),w=x1-x0,top=p.y-H;
            const g=c.createLinearGradient(0,top,0,p.y);g.addColorStop(0,'rgba(120,200,255,.78)');g.addColorStop(1,'rgba(60,120,230,.62)');
            G.rr(x0,top,w,H,10*s,g,'#FFFFFF',Math.max(1.5,4*s));G.rr(x0+6*s,top+6*s,w-12*s,10*s,5*s,'rgba(255,255,255,.45)');
            const fs=Math.max(9,21*s),L=wrapText(c,sd.txt,w-14*s,fs).slice(0,2);L.forEach((t,j)=>G.text(t,x0+w/2,top+H*.42+(j-(L.length-1)/2)*fs*1.15,fs,'#FFFFFF','center','#173A6A'));
            G.text('친구 ?',x0+w/2,top+H*.82,Math.max(8,16*s),'#FFE27A','center','#173A6A')});
          G.rr(X(-RW-8,s),p.y-H-12*s,(2*RW+16)*s,14*s,6*s,'#FFD24A','#8A5410',Math.max(1,2*s))});
        /* 거인 */
        if(phase!=='run'){const bz=phase==='boss'?Math.max(170,900-bt/1.3*730):170,p=P(bz);
          if(phase!=='win')giant(AW/2,p.y,p.s*.95,phase!=='win'&&!(clash===2&&n>=bossHP));
          if(phase==='boss'||phase==='lose'){G.rr(AW/2-62,p.y-310*p.s-30,124,34,14,'#2A1A0E','#FFE27A',3);G.text(`💙 ${Math.ceil(clash?bossN:bossHP)}`,AW/2,p.y-310*p.s-13,20,'#FFE27A','center',null)}}
        /* 친구 무리 */
        if(phase!=='win'){const N=Math.ceil(clash===1?shownN:n),R=Math.min(72,12+Math.sqrt(Math.max(1,N))*6),show=Math.min(N,80),pts=[],cy=PY-(clash?Math.min(1,bt)*40:0);
          for(let i=0;i<show;i++){const a=i*2.399,r=Math.sqrt(i/show)*R;pts.push({i,x:cx+Math.cos(a)*r,y:cy+Math.sin(a)*r*.55})}pts.sort((p,q)=>p.y-q.y);
          c.fillStyle='rgba(0,40,90,.25)';c.beginPath();c.ellipse(cx,cy+8,R+10,R*.5+8,0,0,6.29);c.fill();
          const kid=arcSprite('run_g');for(const p of pts){const bob=Math.abs(Math.sin(G.t*12+p.i))*3;if(kid)G.emo(['run_g','run_k','run_b1','run_b2'][p.i%4],p.x,p.y-6-bob,show>45?18:show>15?24:30);else{G.circle(p.x,p.y+4,6,'#3C6FD1');G.circle(p.x,p.y-4,5,'#FFD9B8','#8A552B',1)}}
          G.rr(cx-28,cy-R*.55-42,56,28,12,'#173A6A','#FFFFFF',2.5);G.text(String(N),cx,cy-R*.55-28,19,'#FFE27A','center',null)}
        /* 문을 지날 때 결과 */
        if(flash){const a=Math.min(1,flash.t*2);c.globalAlpha=a;G.text(flash.txt,AW/2,250,44,flash.k?'#7FFFA0':'#FF8A8A','center','#1A1030');G.text(flash.sub,AW/2,292,22,'#FFFFFF','center','#1A1030');c.globalAlpha=1}
        if(phase==='run'&&dist<500)G.text('착한 행동 문으로 가요!',AW/2,HOR+40,22,'#FFFFFF','center','#173A6A');
        /* 성공 그림 */
        if(phase==='win'){const a=Math.min(1,bt/.7),im=v2img('crowd_finale.jpg');if(im)drawCover(c,im,0,0,AW,AH,a);else{c.globalAlpha=a;giant(AW/2,AH-80,.9,false);c.globalAlpha=1}
          if(bt>.5){G.rr(20,AH-96,AW-40,76,18,'rgba(255,248,230,.95)','#6B3D1F',4);G.text('외로운 거인과',AW/2,AH-71,22,'#A3303C','center',null);G.text('친구가 되었어요! 🤝',AW/2,AH-42,24,'#4A240E','center',null)}}},
      down(x){tx=G.clamp(x,40,AW-40)},move(x,y,dn){if(dn)tx=G.clamp(x,40,AW-40)},
      key(k){if(k==='L')keyD=-1;if(k==='R')keyD=1},keyup(k){if(k==='L'||k==='R')keyD=0}
    }}});

/* ---------- 안전 2: 대피 퀴즈 런 (서브웨이 서퍼) — 보기가 2개인 문제도 바르게 (빈 줄은 막힌 길) ---------- */
arcDefine({id:'safety_run',ch:'safety',name:'대피 퀴즈 런',tag:'3줄 달리기 · 정답 문',from:'서브웨이 서퍼 (Subway Surfers)',icon:'🏃',
  how:['좌우로 밀어 줄을 바꿔요','위로 밀면 점프, 아래로 밀면 숙이기','문제가 나오면 정답 줄로 가요'],
  init(G){
    const HY=150, goal=3+Math.round(G.d*5), vz=.3+.45*G.d, readT=8-3.5*G.d;
    let P={lane:1,x:1,jy:0,vy:0,slide:0,inv:0},objs=[],t=1.2,hearts=3,passed=0,gate=null,ann=null,annT=3,scroll=0,coins=0,msg=null;
    const proj=(lane,z)=>{const s=1/(1+z*3.2);return {x:AW/2+(lane-1)*112*s,y:HY+(470-HY)*s,s}};
    const newAnn=()=>{const q=drawQ(G.trial?0:CI);if(!q)return;ann={q,order:quizOrder(G,q),t:readT};objs=objs.filter(o=>o.z<.45);msg={t:'📖 장애물 멈춤! 문제를 읽어요',c:'#FFE27A',k:1.6}};
    const lane=d=>{P.lane=G.clamp(P.lane+d,0,2);G.sfx('whoosh')};
    const hit=why=>{if(P.inv)return;hearts--;P.inv=1.2;G.sfx('hurt');G.shake=7;if(why)msg={t:why,c:'#FF8A8A',k:1.4};if(hearts<=0)G.lose('너무 많이 부딪혔어요! 문제를 잘 읽고 미리 줄을 옮겨요.')};
    return {
      boostText:'하트 +1', boost(){hearts=Math.min(3,hearts+1)},
      update(dt){scroll+=dt*vz*8;P.x=G.lerp(P.x,P.lane,Math.min(1,dt*14));P.inv=Math.max(0,P.inv-dt);P.slide=Math.max(0,P.slide-dt);if(msg){msg.k-=dt;if(msg.k<=0)msg=null}
        if(P.jy>0||P.vy){P.vy-=1500*dt;P.jy+=P.vy*dt;if(P.jy<=0){P.jy=0;P.vy=0}}
        if(!ann&&!gate){annT-=dt;if(annT<=0)newAnn()}
        if(ann){ann.t-=dt;if(ann.t<=0){gate={...ann,z:1};ann=null}}
        t-=dt;if(t<=0){t=G.rand(.8,1.4)*(1.15-.6*G.d);if(!ann&&!gate){const L=G.ri(0,2),k=Math.random();objs.push({lane:L,z:1,k:k<.4?'low':k<.7?'high':'block'});if(Math.random()<.6)objs.push({lane:(L+G.ri(1,2))%3,z:1.08,k:'coin'})}}
        for(const o of objs){o.z-=vz*dt;if(o.z<.05&&o.z>-.05&&!o.done&&o.lane===P.lane){o.done=1;
          if(o.k==='coin'){coins++;G.sfx('coin');G.addScore(5)}else if(o.k==='low'&&P.jy<35)hit('🚧 점프!');else if(o.k==='high'&&P.slide<=0)hit('🪧 숙여요!');else if(o.k==='block')hit('🚌 옆 줄로!')}}
        objs=objs.filter(o=>o.z>-.1&&!(o.done&&o.k==='coin'));
        if(gate){gate.z-=vz*dt;if(gate.z<.03){const pick=gate.order[P.lane],ok=pick===gate.q.a;
            if(ok){passed++;G.sfx('ok');G.burst(AW/2,380,'#7FFFA0',24);G.addScore(30);msg={t:'⭕ 정답 문 통과!',c:'#7FFFA0',k:1.3};if(passed>=goal){gate=null;return G.win(starsByHearts(hearts))}}
            else{if(!G.trial)wrongAdd(CI,gate.q);hit(pick==null?`막힌 길! 정답은 ${'가나다'[gate.order.indexOf(gate.q.a)]}`:`❌ 정답은 ${'가나다'[gate.order.indexOf(gate.q.a)]}!`)}
            gate=null;annT=3+2*G.d}}
        G.setHud(HEARTS(hearts),`🚪 ${passed}/${goal}`,`⛑️ ${coins}`)},
      draw(c){
        c.fillStyle=G.grad(0,HY,'#4A6FD0','#FFC48A');c.fillRect(0,0,AW,HY);
        for(let i=0;i<9;i++){const w=30+((i*37)%28),h=40+((i*53)%60),x=i*42-6;c.fillStyle=i%2?'#3A4A7A':'#2E3C68';c.fillRect(x,HY-h,w,h);c.fillStyle='rgba(255,230,140,.7)';for(let r=0;r<h/12-1;r++)for(let q=0;q<w/10-1;q++)if((i+r+q)%3)c.fillRect(x+4+q*9,HY-h+5+r*12,4,5)}
        c.fillStyle=G.grad(HY,AH,'#9AA08A','#6E7560');c.fillRect(0,HY,AW,AH-HY);
        const quad=(l0,l1,z0,z1,col)=>{const a=proj(l0,z0),b=proj(l1,z0),cc=proj(l1,z1),d=proj(l0,z1);c.fillStyle=col;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.lineTo(cc.x,cc.y);c.lineTo(d.x,d.y);c.closePath();c.fill()};
        quad(-1.9,-.55,1.25,-.2,'#CDBFA8');quad(2.55,3.9,1.25,-.2,'#CDBFA8');
        for(let k=0;k<14;k++){const z0=((k*.1-scroll%.1)+1.3)%1.3-.1,z1=z0+.05;if(z0>1.25)continue;quad(-1.9,-.55,z0,z1,'rgba(150,130,105,.35)');quad(2.55,3.9,z0,z1,'rgba(150,130,105,.35)')}
        quad(-.55,2.55,1.25,-.2,'#3F4250');quad(-.62,-.5,1.25,-.2,'#F2F2F2');quad(2.5,2.62,1.25,-.2,'#F2F2F2');
        for(const ln of [.5,1.5])for(let k=0;k<12;k++){const z0=((k*.12-scroll%.12)+1.3)%1.3-.1,z1=z0+.055;if(z0>1.25)continue;quad(ln-.03,ln+.03,z0,z1,'rgba(255,255,255,.85)')}
        for(let k=0;k<6;k++){const z=((k*.24-scroll%.24)+1.4)%1.4-.15;for(const L of [-1.25,3.25]){const p=proj(L,z);if(p.y>AH+30)continue;G.emo(k%2?'🌳':'🏮',p.x,p.y-38*p.s,(k%2?96:56)*p.s)}}
        const all=[...objs.map(o=>({...o,g:false})),...(gate?[{...gate,g:true}]:[])].sort((x,y)=>y.z-x.z);
        for(const o of all){if(o.z>1.05||o.z<-.1)continue;
          if(o.g){for(let L=0;L<3;L++){const p=proj(L,o.z),nul=o.order[L]==null;
              if(nul){G.emo('🚧',p.x,p.y-30*p.s,80*p.s);G.text('막힘',p.x,p.y-82*p.s,Math.max(10,26*p.s),'#FF8A8A');continue}
              G.rr(p.x-50*p.s,p.y-128*p.s,100*p.s,128*p.s,14*p.s,'rgba(255,255,255,.12)',QCOL[L],6*p.s);G.text('가나다'[L],p.x,p.y-142*p.s,Math.max(12,36*p.s),QCOL[L])}continue}
          const p=proj(o.lane,o.z);G.emo({low:'🚧',high:'🪧',block:'🚌',coin:'⛑️'}[o.k],p.x,p.y-(o.k==='high'?70:o.k==='block'?34:20)*p.s,(o.k==='block'?88:54)*p.s)}
        const pp=proj(P.x,0);c.fillStyle='rgba(0,0,0,.3)';c.beginPath();c.ellipse(pp.x,pp.y-2,22,7,0,0,6.29);c.fill();
        if(!(P.inv&&Math.floor(G.t*12)%2)){c.save();c.translate(pp.x,pp.y-P.jy-6);const rk=P.jy>0?'run_bj':P.slide>0?'run_bc':(Math.floor(G.t*8)%2?'run_b1':'run_b2');if(P.slide>0&&!arcSprite(rk))c.scale(1.2,.55);G.spr(rk,'🏃',0,-26,60);c.restore()}
        const q=ann||gate;if(q){const h=drawQBig(G,q.q,q.order,6);if(ann)G.rr(16,h,(AW-32)*(ann.t/readT),6,3,'#FFE27A')}
        if(msg)G.text(msg.t,AW/2,q?300:230,22,msg.c,'center','#1A1030')},
      swipe(d){if(d==='L')lane(-1);else if(d==='R')lane(1);else if(d==='U'&&!P.jy){P.vy=620;P.jy=1;G.sfx('jump')}else if(d==='D'){P.slide=.8;P.vy=P.jy?-900:0;G.sfx('whoosh')}},
      tap(x){lane(x<AW/2?-1:1)},key(k){if(k==='A')k='U';this.swipe(k)}
    }}});

/* ---------- 인성 3: 칭찬 리듬 — 진짜 리듬 게임 (박자 판정 · 긴 노트 · 동시 노트) ----------
   소리가 없어도 할 수 있게: 판정선 · 줄 · 배경이 박자마다 번쩍여요. 3·2·1 세고 시작해요. */
arcDefine({id:'character_rhythm',ch:'character',name:'칭찬 리듬',tag:'박자 맞추기 리듬 게임',from:'리듬 게임 (피아노 타일 · 비트 게임)',icon:'🎵',
  how:['노트가 빛나는 줄에 닿을 때 톡!','긴 노트는 끝까지 꾹 눌러요','💢 화난 노트는 누르지 마요'],
  init(G){
    const BPM=Math.round(84+G.d*60), B=60/BPM, HY=440, TOP=64, SPD=230+190*G.d;
    const EMO=['💗','😊','👍','🌟'], LC=['#FF5FA2','#FFD23F','#3FD0FF','#7CF06B'], KEYS=['◀','▼','▲','▶'];
    const tier=G.d<.22?0:G.d<.5?1:G.d<.78?2:3, nMeas=7+Math.round(G.d*5);
    const PAT=[[[0,1,2,3],0],[[0,2],0],[[0,1,2],0],[[0,2,3],0],[[0,1.5,2,3],1],[[0,.5,1,2,3],1],[[0,1,1.5,2,3],1],[[0,1,2,2.5,3],1],
      [[0,.5,1,1.5,2,3],2],[[0,.75,1.5,2,2.5,3],2],[[0,.5,1.5,2,3,3.5],2],[[0,.5,1,1.5,2,2.5,3,3.5],3],[[0,.25,.5,1,2,2.25,2.5,3],3],[[0,.75,1,1.75,2,2.5,3,3.25],3]];
    const notes=[];let lane=G.ri(0,3);const other=l=>{let k;do{k=G.ri(0,3)}while(k===l);return k};
    for(let m=0;m<nMeas;m++){const t0=m*4*B,cand=PAT.filter(p=>p[1]<=tier&&p[1]>=tier-1),p=G.pick(cand)[0],mode=G.ri(0,2);
      p.forEach((o,i)=>{if(mode===0)lane=(lane+1)%4;else if(mode===1)lane=i%2?3-lane:other(lane);else lane=other(lane);
        const nt={t:t0+o*B,l:lane,e:EMO[lane]},nx=p[i+1]!=null?p[i+1]:4;
        if(tier>=1&&nx-o>=1&&Math.random()<.4)nt.hold=(nx-o-.5)*B;else if(tier===0&&G.d>.12&&nx-o>=2&&Math.random()<.5)nt.hold=(nx-o-.7)*B;notes.push(nt);
        if(tier>=1&&Number.isInteger(o)&&!nt.hold&&Math.random()<.1+.12*tier){const l2=other(lane);notes.push({t:nt.t,l:l2,e:EMO[l2]})}});
      if(tier>=2&&m>0&&Math.random()<.45){const o=G.pick([.5,1.5,2.5,3.5]),tt=t0+o*B,used=notes.filter(n=>Math.abs(n.t-tt)<B*.6).map(n=>n.l),l=[0,1,2,3].filter(x=>!used.includes(x));if(l.length)notes.push({t:tt,l:G.pick(l),e:'💢',mine:true})}}
    notes.sort((a,b)=>a.t-b.t);
    const END=(nMeas*4+1)*B,total=notes.filter(n=>!n.mine).length,W1=.075,W2=.14,W3=.2;
    let T=-4*B,lastBeat=-99,life=100,combo=0,maxC=0,cnt={p:0,g:0,o:0,m:0},pops=[],press=[0,0,0,0],hold=[null,null,null,null],praise=null,ended=false;
    const k=y=>.4+.6*G.clamp((y-TOP)/(HY-TOP),0,1.2);
    const lx=(l,y)=>AW/2+((l+.5)*AW/4-AW/2)*k(y);
    const yOf=t=>HY-(t-T)*SPD;
    const pop=(txt,l,col)=>pops.push({txt,x:lx(l,HY),col,t:.6});
    const note=(l,v=.07)=>{try{tone([523,659,784,1046][l]*(combo>20?1.5:1),.16,'triangle',v)}catch(e){}};
    const hitLane=l=>{press[l]=.18;const n=notes.filter(n=>n.l===l&&!n.done&&Math.abs(n.t-T)<=W3).sort((a,b)=>Math.abs(a.t-T)-Math.abs(b.t-T))[0];if(!n)return;n.done=true;
      if(n.mine){life-=16;combo=0;pop('앗! 💢',l,'#FF6A6A');G.sfx('hurt');G.shake=6;return}
      const e=Math.abs(n.t-T),r=e<=W1?'p':e<=W2?'g':'o';cnt[r]++;combo++;maxC=Math.max(maxC,combo);life=Math.min(100,life+(r==='p'?3:r==='g'?2:1));
      G.addScore(r==='p'?30:r==='g'?20:10);pop({p:'완벽!',g:'좋아!',o:'괜찮아'}[r],l,{p:'#FFE27A',g:'#7FFFA0',o:'#9FE8FF'}[r]);G.burst(lx(l,HY),HY,LC[l],r==='p'?16:9,r==='p'?200:130);note(l);
      if(n.hold){hold[l]=n;n.holding=true}
      if(combo%10===0){praise={txt:G.pick(['최고야!','고마워!','멋지다!','넌 정말 친절해!','함께해서 좋아!','잘했어!','넌 최고의 친구!']),t:1.3}}};
    const release=l=>{const h=hold[l];hold[l]=null;if(h&&T<h.t+h.hold-.15){h.broke=true;h.holding=false;combo=0;life-=6;pop('끝까지 꾹!',l,'#FFB3B3')}};
    const laneOf=x=>G.clamp(Math.floor(x/(AW/4)),0,3);
    return {
      boostText:'생명 회복', boost(){life=Math.min(100,life+40)},
      update(dt){T+=dt;press=press.map(p=>Math.max(0,p-dt));pops.forEach(p=>p.t-=dt);pops=pops.filter(p=>p.t>0);if(praise){praise.t-=dt;if(praise.t<=0)praise=null}
        const bi=Math.floor(T/B+1e-6);if(bi>lastBeat){lastBeat=bi;
          if(bi<0){try{tone(1320,.06,'square',.04)}catch(e){}}else if(T<END-B){try{tone(70,.14,'sine',.22,.5);noise(.03,.03,8000,'highpass',B/2);if(bi%4===0)tone([110,147,131,165][(bi/4|0)%4],B*3.5,'triangle',.035)}catch(e){}}}
        for(const n of notes){if(n.done){if(n.holding&&T>=n.t+n.hold){n.holding=false;hold[n.l]=null;G.addScore(20);G.burst(lx(n.l,HY),HY,LC[n.l],12);pop('꾹 성공!',n.l,'#FFE27A')}continue}
          if(T-n.t>W3){n.done=true;if(n.mine)continue;cnt.m++;combo=0;life-=10;pop('놓침',n.l,'#FF8A8A');G.sfx('no')}}
        if(life<=0&&!ended){ended=true;return G.lose('칭찬 노트를 너무 많이 놓쳤어요! 줄에 닿는 순간을 봐요.')}
        if(T>=END&&!ended){ended=true;const acc=(cnt.p+cnt.g*.75+cnt.o*.45)/Math.max(1,total);
          if(acc<.5)return G.lose(`정확도 ${Math.round(acc*100)}% — 50%를 넘겨요!`);return G.win(acc>=.9?3:acc>=.75?2:1)}
        const acc=(cnt.p+cnt.g*.75+cnt.o*.45)/Math.max(1,cnt.p+cnt.g+cnt.o+cnt.m);
        G.setHud(`💗 ${Math.max(0,Math.round(life))}`,combo>2?`🔥 ${combo}콤보`:`🎵 ${BPM}박자`,`🎯 ${Math.round(acc*100||100)}%`)},
      draw(c){
        const ph=((T/B)%1+1)%1,pulse=T>=0?Math.pow(1-ph,3):0;
        c.fillStyle=G.grad(0,AH,'#24104A','#0A0618');c.fillRect(0,0,AW,AH);
        c.save();c.globalAlpha=.12+.1*pulse;for(let i=0;i<2;i++){const a=Math.sin(G.t*.7+i*2)*.5;c.fillStyle=i?'#FF5FA2':'#3FD0FF';c.beginPath();c.moveTo(i?AW:0,0);c.lineTo(AW/2+Math.sin(a)*260-60,AH);c.lineTo(AW/2+Math.sin(a)*260+60,AH);c.closePath();c.fill()}c.restore();
        for(let r=0;r<4;r++){const rr=40+r*46+pulse*14;c.strokeStyle=`rgba(255,255,255,${(.16-r*.03)*(.5+pulse)})`;c.lineWidth=3;c.beginPath();c.arc(AW/2,120,rr,0,6.29);c.stroke()}
        /* 길 */
        c.fillStyle='rgba(10,6,24,.75)';c.beginPath();c.moveTo(lx(-.5,TOP),TOP);c.lineTo(lx(3.5,TOP),TOP);c.lineTo(AW,HY+40);c.lineTo(0,HY+40);c.closePath();c.fill();
        for(let l=0;l<4;l++){const g=c.createLinearGradient(0,TOP,0,HY);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,LC[l]+(press[l]>0?'88':'26'));c.fillStyle=g;
          c.beginPath();c.moveTo(lx(l-.5,TOP),TOP);c.lineTo(lx(l+.5,TOP),TOP);c.lineTo(lx(l+.5,HY+40),HY+40);c.lineTo(lx(l-.5,HY+40),HY+40);c.closePath();c.fill()}
        c.strokeStyle='rgba(255,255,255,.18)';c.lineWidth=2;for(let l=0;l<=4;l++){c.beginPath();c.moveTo(lx(l-.5,TOP),TOP);c.lineTo(lx(l-.5,HY+40),HY+40);c.stroke()}
        for(let b=Math.ceil(T/B);b<T/B+3;b++){const y=yOf(b*B);if(y<TOP)continue;c.strokeStyle=b%4===0?'rgba(255,255,255,.28)':'rgba(255,255,255,.1)';c.lineWidth=b%4===0?3:1.5;c.beginPath();c.moveTo(lx(-.5,y),y);c.lineTo(lx(3.5,y),y);c.stroke()}
        /* 판정선 */
        c.save();c.shadowColor='#FFFFFF';c.shadowBlur=10+18*pulse;G.rr(0,HY-3,AW,6,3,`rgba(255,255,255,${.75+.25*pulse})`);c.restore();
        for(let l=0;l<4;l++){const x=lx(l,HY);G.circle(x,HY,24+pulse*5+press[l]*20,null,LC[l],3+press[l]*10)}
        /* 노트 */
        for(const n of notes){if(n.done&&!n.holding)continue;const y=n.holding?HY:yOf(n.t);if(y<TOP-30||y>HY+60)continue;
          if(n.hold){const y2=Math.max(TOP,yOf(n.t+n.hold)),kk=k(y);c.fillStyle=LC[n.l]+(n.broke?'40':'99');c.beginPath();c.moveTo(lx(n.l,y)-14*kk,y);c.lineTo(lx(n.l,y2)-14*k(y2),y2);c.lineTo(lx(n.l,y2)+14*k(y2),y2);c.lineTo(lx(n.l,y)+14*kk,y);c.closePath();c.fill();
            G.circle(lx(n.l,y2),y2,10*k(y2),LC[n.l],'#FFF',2)}
          const kk=k(y),x=lx(n.l,y),w=AW/4*kk*.82,h=34*kk;
          if(n.mine){G.rr(x-w/2,y-h/2,w,h,12*kk,'#3A0A14','#FF3A5A',3+2*pulse);G.emo('💢',x,y,26*kk);continue}
          const g=c.createLinearGradient(0,y-h/2,0,y+h/2);g.addColorStop(0,'#FFFFFF');g.addColorStop(.35,LC[n.l]);g.addColorStop(1,LC[n.l]);
          G.rr(x-w/2,y-h/2,w,h,12*kk,g,'#FFFFFF',2.5);G.emo(n.e,x,y,26*kk)}
        /* 누르는 판 */
        for(let l=0;l<4;l++){const x=l*AW/4;G.rr(x+5,HY+40,AW/4-10,AH-HY-48,16,press[l]>0?LC[l]:'rgba(255,255,255,.1)',LC[l],3);G.text(KEYS[l],x+AW/8,HY+40+(AH-HY-48)/2,26,press[l]>0?'#1A1030':LC[l],'center',null)}
        /* 위쪽: 진행 · 생명 */
        G.rr(12,12,AW-24,10,5,'rgba(255,255,255,.15)');G.rr(12,12,(AW-24)*G.clamp(T/END,0,1),10,5,'#FFE27A');
        G.rr(12,28,AW-24,8,4,'rgba(255,255,255,.12)');G.rr(12,28,(AW-24)*G.clamp(life/100,0,1),8,4,life>40?'#7FF0A0':'#FF6A6A');
        if(T<0){const nleft=Math.ceil(-T/B);G.text(nleft>3?'준비!':String(nleft),AW/2,250,80,'#FFE27A','center','#1A1030');G.text('빛나는 줄에 닿을 때 눌러요',AW/2,320,20,'#FFFFFF','center','#1A1030')}
        if(combo>=3)G.text(`${combo}`,AW/2,200,54+pulse*8,'rgba(255,255,255,.9)','center','#5A1A8A'),G.text('콤보',AW/2,240,20,'#FFE27A','center','#5A1A8A');
        for(const p of pops)G.text(p.txt,p.x,HY-50-(.6-p.t)*60,22,p.col,'center','#1A1030');
        if(praise)G.text(`💬 ${praise.txt}`,AW/2,150,26,'#FF9FC0','center','#1A1030')},
      down(x,y){if(y>TOP)hitLane(laneOf(x))},up(x){release(laneOf(x))},
      key(k){const l={L:0,D:1,U:2,R:3}[k];if(l!=null)hitLane(l)},keyup(k){const l={L:0,D:1,U:2,R:3}[k];if(l!=null)release(l)}
    }}});

/* ---------- 안전 1: 안전 건널목 — 찻길마다 횡단보도 여러 개 · 신호등은 따로따로(가끔 동시에) · 무단횡단 벌점 ---------- */
arcDefine({id:'safety_cross',ch:'safety',name:'안전 건널목',tag:'신호 보고 골라 건너기',from:'크로시 로드 (Crossy Road)',icon:'🚦',
  how:['누른 쪽으로 한 칸씩 걸어요','초록불 횡단보도로만 건너요','무단횡단은 벌점! 3점이면 실패'],
  init(G){
    const C=9,S=40,OY=10,ROWS=13,CARS=['🚗','🚕','🚙','🚓','🚑','🛵','🚚'];
    const nR=2+Math.round(G.d*2.3),widths=[...Array(nR)].map(()=>G.d>.2&&Math.random()<.3+.35*G.d?2:1);
    let extra=11-(widths.reduce((a,b)=>a+b,0)+nR-1);const type=Array(ROWS).fill('walk'),roads=[];let r=11;
    for(let i=0;i<nR;i++){if(extra>0&&Math.random()<.55){r--;extra--}const rows=[];for(let k=0;k<widths[i];k++){type[r]='road';rows.push(r);r--}roads.push(rows);if(i<nR-1)r--}
    /* 신호 조종기: 횡단보도마다 하나씩, 가끔 다른 횡단보도와 같이 써서 동시에 켜져요 */
    const ctls=[];const mkCtl=()=>{const c={walk:Math.random()<.35,go:G.rand(2.6,3.6)-1.1*G.d,stop:G.rand(2.4,4)-.8*G.d};c.t=G.rand(.3,c.walk?c.go:c.stop);ctls.push(c);return c};
    const CW=roads.map(()=>{const m=2+(G.d>.45?1:0),cols=[];let tries=0;while(cols.length<m&&tries++<200){const c=G.ri(0,C-1);if(cols.every(x=>Math.abs(x-c)>=2))cols.push(c)}
      return cols.sort((a,b)=>a-b).map(c=>({c,ctl:ctls.length&&Math.random()<.3?G.pick(ctls):mkCtl()}))});
    const lanes={};roads.forEach((rows,R)=>rows.forEach((row,i)=>{const dir=rows.length===2?(i?-1:1):(Math.random()<.5?-1:1),sp=(60+150*G.d)*G.rand(.85,1.25),n=2+Math.round(G.d*1.5+Math.random()),bus=Math.random()<.2;
      lanes[row]={R,dir,sp,cars:[...Array(n)].map((_,j)=>({x:j*(C*S/n)+G.rand(0,30),e:bus?'🚌':G.pick(CARS),w:bus?70:36,rude:G.d>.4&&Math.random()<.05+.15*G.d}))}}));
    const roadOf=row=>lanes[row]?lanes[row].R:-1, cwAt=(R,c)=>R<0?null:CW[R].find(w=>w.c===c);
    const P={c:G.ri(0,C-1),r:12,x:0,y:12,inv:0,face:'U'};P.x=P.c;
    let hearts=3,time=Math.round(80-20*G.d),T0=time,pen=0,safe=0,flash=0,msg=null;
    const penalty=t=>{pen++;flash=.5;G.addScore(-30);G.sfx('no');G.shake=5;msg={t:`🚨 ${t} 벌점 +1`,k:1.6};if(pen>=3)G.lose('벌점 3점! 초록불 횡단보도로만 건너요.')};
    const move=(dc,dr)=>{if(G.over)return;P.face=dr<0?'U':dr>0?'D':dc<0?'L':'R';const c=P.c+dc,r2=P.r+dr;if(c<0||c>=C||r2<0||r2>12)return;
      if(type[r2]==='road'){const R=roadOf(r2),w=cwAt(R,c),from=type[P.r]==='road';
        if(!w)penalty(from&&dc?'찻길에서 옆으로 걸었어요!':'무단횡단!');else if(!from&&!w.ctl.walk)penalty('빨간불에 건넜어요!');else if(!from){safe++;G.addScore(10,c*S+S/2,OY+r2*S)}}
      P.c=c;P.r=r2;G.sfx('jump');
      if(r2===0&&!G.over){G.burst(P.c*S+S/2,OY+S/2,'#7FD69A',30);G.win(pen===0&&hearts===3?3:pen<=1&&hearts>=2?2:1)}};
    const hit=k=>{hearts--;G.sfx('hurt');G.shake=7;G.burst(P.x*S+S/2,OY+P.y*S+S/2,'#FF6F8A',16);msg={t:k&&k.rude?'🚨 신호를 어긴 차! 초록불에도 살펴요':'💥 차에 부딪혔어요!',k:1.6};
      P.r=12;P.y=12;P.inv=1.2;if(hearts<=0)G.lose('차에 너무 많이 부딪혔어요. 초록불 횡단보도로 건너요!')};
    const specks=[...Array(160)].map(()=>[Math.random()*AW,Math.random()*S,Math.random()<.5]);
    return {
      boostText:'하트 +1', boost(){hearts=Math.min(3,hearts+1)},
      update(dt){time-=dt;flash=Math.max(0,flash-dt);if(msg){msg.k-=dt;if(msg.k<=0)msg=null}if(time<=0)return G.lose('시간이 다 됐어요! 초록불을 찾아 빨리 건너요.');
        P.x=G.lerp(P.x,P.c,Math.min(1,dt*18));P.y=G.lerp(P.y,P.r,Math.min(1,dt*18));P.inv=Math.max(0,P.inv-dt);
        for(const c of ctls){c.t-=dt;if(c.t<=0){c.walk=!c.walk;c.t=c.walk?c.go:c.stop}}
        for(const row in lanes){const L=lanes[row],greens=CW[L.R].filter(w=>w.ctl.walk),list=[...L.cars].sort((a,b)=>L.dir>0?b.x-a.x:a.x-b.x);
          list.forEach((k,i)=>{let mv=L.dir*L.sp*dt;const front=L.dir>0?k.x+k.w:k.x;
            if(!k.rude)for(const w of greens){const l=w.c*S,rr=l+S;if(L.dir>0&&front<=l-2&&front+mv>l-4)mv=Math.min(mv,Math.max(0,l-4-front));if(L.dir<0&&front>=rr+2&&front+mv<rr+4)mv=Math.max(mv,Math.min(0,rr+4-front))}
            const ahead=list[i-1];if(ahead&&!k.rude){const gap=L.dir>0?ahead.x-(k.x+k.w):k.x-(ahead.x+ahead.w);if(gap>=0&&gap<10+Math.abs(mv))mv=0}
            k.x+=mv;if(k.x>C*S+40)k.x-=C*S+80+k.w;if(k.x<-80-k.w)k.x+=C*S+80+k.w;
            if(+row===P.r&&!P.inv&&Math.abs(P.y-P.r)<.3){const px=P.x*S+S/2;if(px>k.x-4&&px<k.x+k.w+4)hit(k)}})}
        G.setHud(HEARTS(hearts),TIME(time),`🚨 벌점 ${pen}/3`)},
      draw(c){
        for(let r=0;r<ROWS;r++){const y=OY+r*S;
          if(r===0){G.rr(0,y,AW,S,0,'#6FC07A');for(let x=0;x<AW;x+=14)G.rr(x,y+S-12,4,12,1,'#E8D8B8');G.rr(0,y+S-10,AW,3,0,'#E8D8B8');continue}
          if(type[r]==='road'){G.rr(0,y,AW,S,0,'#3A3D4A');for(const s of specks)if(s[2])G.rr(s[0],y+s[1],2,2,0,'rgba(255,255,255,.06)');
            const up=type[r-1]!=='road',dn=type[r+1]!=='road';if(up)G.rr(0,y,AW,3,0,'#F2F2F2');if(dn)G.rr(0,y+S-3,AW,3,0,'#F2F2F2');
            if(!dn){G.rr(0,y+S-3,AW,2,0,'#FFD24A');G.rr(0,y+S+1,AW,2,0,'#FFD24A')}}
          else{G.rr(0,y,AW,S,0,'#DCD2C4');c.strokeStyle='rgba(150,135,115,.45)';c.lineWidth=1;c.beginPath();for(let x=0;x<=AW;x+=20){c.moveTo(x,y);c.lineTo(x,y+S)}c.moveTo(0,y+S/2);c.lineTo(AW,y+S/2);c.stroke();
            if(type[r-1]==='road')G.rr(0,y,AW,4,0,'#9A9088');if(type[r+1]==='road')G.rr(0,y+S-4,AW,4,0,'#9A9088')}}
        /* 횡단보도 · 신호 */
        roads.forEach((rows,R)=>{const top=OY*1+Math.min(...rows)*S,bot=OY+(Math.max(...rows)+1)*S;
          CW[R].forEach(w=>{const x=w.c*S,on=w.ctl.walk,blink=on&&w.ctl.t<1.2&&Math.floor(G.t*6)%2;
            G.rr(x+1,top+1,S-2,bot-top-2,4,on?'rgba(80,230,130,.22)':'rgba(255,70,70,.16)');
            for(let yy=top+4;yy<bot-4;yy+=9)G.rr(x+4,yy,S-8,5,1.5,'rgba(255,255,255,.92)');
            c.save();if(on&&!blink){c.shadowColor='#4CFF8A';c.shadowBlur=12}G.rr(x+1,top+1,S-2,bot-top-2,4,null,on?(blink?'#C8FFC8':'#3FE07A'):'#FF4A4A',3);c.restore();
            const bx=x+S-9,by=bot+2;G.rr(bx-1,by,2,12,1,'#555');G.rr(bx-8,by-1,16,15,4,'#15151C','#555',1.5);
            if(on)G.text('🚶',bx,by+7,11,'#3FE07A','center',null);else G.circle(bx,by+6.5,5,'#FF4A4A');
            })});
        G.emo('🏫',AW/2,OY+S/2-2,34);
        for(const row in lanes){const L=lanes[row];for(const k of L.cars){const x=k.x+k.w/2,y=OY+row*S+S/2,s=k.w>40?42:34;c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(x,y+12,k.w/2,5,0,0,6.29);c.fill();
          if(L.dir>0)emoFlip(G,k.e,x,y,s);else G.emo(k.e,x,y,s);if(k.rude)G.emo('🚨',x,y-17,15)}}
        if(!(P.inv&&Math.floor(G.t*10)%2)){const px=P.x*S+S/2,py=OY+P.y*S+S/2-Math.abs(Math.sin((P.y-P.r)*Math.PI))*8,f=P.face;
          c.fillStyle='rgba(0,0,0,.25)';c.beginPath();c.ellipse(px,py+14,11,4,0,0,6.29);c.fill();
          if(f==='U')G.spr('walk_bag','🧒',px,py,36);else if(f==='L'&&arcSprite('run_side'))emoFlip(G,'run_side',px,py,36);else if(f==='R')G.spr('run_side','🧒',px,py,36);else G.emo('🧒',px,py,34)}
        if(flash){c.fillStyle=`rgba(255,40,40,${flash*.5})`;c.fillRect(0,0,AW,AH)}
        if(msg){G.rr(16,AH-62,AW-32,46,14,'rgba(20,10,30,.9)','#FF8A8A',3);G.text(msg.t,AW/2,AH-39,msg.t.length>16?16:19,'#FFFFFF','center',null)}},
      tap(x,y){const px=P.c*S+S/2,py=OY+P.r*S+S/2,dx=x-px,dy=y-py;if(Math.abs(dx)>Math.abs(dy))move(dx>0?1:-1,0);else move(0,dy>0?1:-1)},
      swipe(d){move(d==='L'?-1:d==='R'?1:0,d==='U'?-1:d==='D'?1:0)},
      key(k){if(k!=='A')this.swipe(k)}
    }}});

/* ---------- 진로 3: 꿈의 탑 스택볼 — 3D 탑 · 눈에 띄는 검은 띠 ---------- */
arcDefine({id:'career_helix',ch:'career',name:'꿈의 탑 스택볼',tag:'누르고 부수며 내려가기',from:'스택 볼 · 헬릭스 점프',icon:'🗼',
  how:['꾹 누르면 공이 쾅쾅 내려가요','빨갛게 빛나는 검은 띠는 피해요','많이 부수면 🔥불꽃 공!'],
  init(G){
    const N=18+Math.round(G.d*30),JOB=['🩺','🎨','🔬','⚽','🎤','💻','🚒','✈️','🍳','📷'],RX=128,RY=42,TH=18,GAP=60,CX=AW/2,PR=18;
    const rings=[];for(let i=0;i<N;i++){const blk=i<2?0:G.ri(1+Math.round(G.d*2),2+Math.round(G.d*3)),st=G.ri(0,7),sec=[...Array(8)].map(()=>0);for(let k=0;k<blk;k++)sec[(st+k)%8]=1;
      rings.push({sec,off:G.rand(0,Math.PI*2),hue:(200+i*17)%360,job:Math.random()<.18?G.pick(JOB):null})}
    let rot=0,spd=1.1+2.2*G.d,top=0,by=0,bv=0,hold=false,hearts=3,cool=0,combo=0,fire=0,cam=0,frags=[],got=0,sq=0;
    const stars=[...Array(50)].map(()=>[Math.random()*AW,Math.random()*AH,Math.random()*2+.5,Math.random()*6]);
    const ry=i=>210+(i-top)*GAP+cam;
    const secAt=i=>{const a=((Math.PI/2-rot-rings[i].off)%(Math.PI*2)+Math.PI*4)%(Math.PI*2);return Math.floor(a/(Math.PI/4))%8};
    const shade=(h,l)=>`hsl(${h},78%,${l}%)`;
    const drawRing=(c,i)=>{const y=ry(i),r=rings[i],pulse=.5+.5*Math.sin(G.t*6);
      for(let s=0;s<8;s++){const a0=rot+r.off+s*Math.PI/4,a1=a0+Math.PI/4,blk=r.sec[s];
        /* 옆면 (앞쪽만) */
        const segs=[];for(let k=0;k<=8;k++){const a=a0+(a1-a0)*k/8;if(Math.sin(a)>-.05)segs.push(a)}
        if(segs.length>1){c.beginPath();segs.forEach((a,j)=>{const x=CX+Math.cos(a)*RX,yy=y+Math.sin(a)*RY;j?c.lineTo(x,yy):c.moveTo(x,yy)});for(let j=segs.length-1;j>=0;j--){const a=segs[j];c.lineTo(CX+Math.cos(a)*RX,y+TH+Math.sin(a)*RY)}c.closePath();
          const lit=.55+.45*Math.cos((a0+a1)/2-2.2);c.fillStyle=blk?`rgb(${20+lit*20},${10+lit*8},${18+lit*10})`:shade(r.hue,22+lit*18);c.fill()}
        /* 윗면 */
        c.beginPath();c.ellipse(CX,y,RX,RY,0,a0,a1);c.ellipse(CX,y,PR+4,(PR+4)*RY/RX,0,a1,a0,true);c.closePath();
        const lit=.5+.5*Math.cos((a0+a1)/2-2.2);
        if(blk){const g=c.createLinearGradient(CX-RX,y-RY,CX+RX,y+RY);g.addColorStop(0,'#2A2433');g.addColorStop(1,'#0B090F');c.fillStyle=g;c.fill();
          c.save();c.shadowColor='#FF2448';c.shadowBlur=10+10*pulse;c.strokeStyle=`rgba(255,${60+60*pulse},${80+40*pulse},1)`;c.lineWidth=3;c.stroke();c.restore();
          const am=(a0+a1)/2;for(let k=1;k<=2;k++){const rr=RX*(.45+k*.2);c.strokeStyle='rgba(255,60,90,.55)';c.lineWidth=2;c.beginPath();c.ellipse(CX,y,rr,rr*RY/RX,0,am-.25,am+.25);c.stroke()}}
        else{c.fillStyle=shade(r.hue,46+lit*22);c.fill();c.strokeStyle='rgba(255,255,255,.25)';c.lineWidth=1;c.stroke()}}
      c.strokeStyle='rgba(255,255,255,.35)';c.lineWidth=1.5;c.beginPath();c.ellipse(CX,y,RX,RY,0,Math.PI*1.05,Math.PI*1.95);c.stroke();
      if(r.job)G.emo(r.job,CX+Math.cos(rot+r.off+.4)*RX*.66,y-6+Math.sin(rot+r.off+.4)*RY*.66,26)};
    const pole=(c,y0,y1)=>{const g=c.createLinearGradient(CX-PR,0,CX+PR,0);g.addColorStop(0,'#3A2A5A');g.addColorStop(.35,'#B8A8F0');g.addColorStop(.6,'#7A68C0');g.addColorStop(1,'#2A1A44');c.fillStyle=g;c.fillRect(CX-PR,y0,PR*2,y1-y0)};
    return {
      boostText:'하트 +1', boost(){hearts=Math.min(3,hearts+1)},
      update(dt){rot+=spd*dt*(Math.floor(top/6)%2?-1:1);cool=Math.max(0,cool-dt);fire=Math.max(0,fire-dt);cam=G.lerp(cam,0,Math.min(1,dt*9));sq=Math.max(0,sq-dt*5);
        for(const f of frags){f.vy+=1000*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;f.a+=f.va*dt}frags=frags.filter(f=>f.y<AH+60);
        if(top>=N)return;
        if(hold&&!cool){by+=760*dt;if(by>=-8){by=-8;const s=secAt(top),black=rings[top].sec[s]===1;
            if(black&&!fire){hearts--;cool=.7;bv=-540;combo=0;G.sfx('hurt');G.shake=9;G.burst(CX,ry(top)-10,'#FF2448',22);if(hearts<=0)return G.lose('빨갛게 빛나는 검은 띠에 너무 많이 부딪혔어요!')}
            else{const r=rings[top];for(let k=0;k<12;k++)frags.push({x:CX+G.rand(-RX,RX),y:ry(top)+G.rand(-RY,RY),vx:G.rand(-300,300),vy:G.rand(-380,-80),a:0,va:G.rand(-8,8),col:r.sec[k%8]&&fire?'#2A2433':shade(r.hue,58),w:G.rand(14,26)});
              if(r.job){got++;G.pop(r.job+' 꿈 도구!',CX,ry(top)-50,'#FFE27A',20);G.sfx('coin')}else G.sfx('pop');
              combo++;if(combo>=8&&!fire){fire=2.6;G.sfx('unlock');G.pop('🔥 불꽃 공!',CX,130,'#FF9A3A',28)}
              G.addScore(5+combo);top++;cam=GAP;by=-GAP+8;sq=1;if(top>=N){G.burst(CX,300,'#FFE27A',50);return G.win(starsByHearts(hearts))}}}}
        else{bv+=1500*dt;by+=bv*dt;if(by>=-8){by=-8;bv=-500;sq=1;if(!hold)combo=0}}
        G.setHud(HEARTS(hearts),`🗼 ${top}/${N}`,fire?'🔥 불꽃!':`🎒 ${got}`)},
      draw(c){c.fillStyle=G.grad(0,AH,'#1E2A6A','#0A0A24');c.fillRect(0,0,AW,AH);
        for(const s of stars){c.globalAlpha=.4+.4*Math.sin(G.t*2+s[3]);G.circle(s[0],s[1],s[2],'#FFFFFF')}c.globalAlpha=1;
        const glow=c.createRadialGradient(CX,AH*.45,20,CX,AH*.45,260);glow.addColorStop(0,'rgba(140,110,255,.35)');glow.addColorStop(1,'rgba(140,110,255,0)');c.fillStyle=glow;c.fillRect(0,0,AW,AH);
        const last=Math.min(N-1,top+8);pole(c,ry(last)+TH,AH);
        for(let i=last;i>=top;i--){const y=ry(i);if(y>AH+60)continue;drawRing(c,i);pole(c,i>top?ry(i-1)+TH:-10,y)}
        if(top>=N){G.emo('🎓',CX,260,70)}
        for(const f of frags){c.save();c.translate(f.x,f.y);c.rotate(f.a);G.rr(-f.w/2,-5,f.w,10,3,f.col,'rgba(0,0,0,.3)',1);c.restore()}
        if(top<N){const y=ry(top)+by-16,s=1+sq*.25;c.fillStyle='rgba(0,0,0,.35)';c.beginPath();c.ellipse(CX,ry(top)+2,16*(1+(by+8)/-200),5,0,0,6.29);c.fill();
          if(fire){for(let k=0;k<4;k++)G.circle(CX+G.rand(-6,6),y-k*10-6,12-k*2.5,`rgba(255,${120+k*30},40,${.6-k*.12})`)}
          c.save();c.translate(CX,y);c.scale(s,1/s);const g=c.createRadialGradient(-5,-6,2,0,0,16);g.addColorStop(0,'#FFFFFF');g.addColorStop(.4,fire?'#FFB040':'#FFE9C0');g.addColorStop(1,fire?'#E04A10':'#C08A50');G.circle(0,0,15,g);c.restore()}
        G.rr(10,90,10,360,5,'rgba(255,255,255,.15)');G.rr(10,90,10,360*top/N,5,'#FFE27A');G.text('🎓',15,78,18,'#FFF','center',null)},
      down(){hold=true},up(){hold=false},key(k){if(k==='A'||k==='D'){hold=true;setTimeout(()=>hold=false,250)}}
    }}});

/* ---------- 진로 2: 직업 꼬들 — 단서 카드 3장 · 뒤집기 · 직업 도감 ----------
   아이디어: 그냥 맞히기 대신 "직업 탐정"처럼 단서(하는 일 → 쓰는 도구 → 일하는 곳)를 하나씩 열어 가며 추리해요.
   단서를 적게 열고 맞힐수록 점수가 높고, 맞힌 직업은 도감 카드로 모여요. */
const JOBX={소방관:['🚒','소방서'],간호사:['💉','병원'],요리사:['🍳','식당'],수의사:['🐶','동물 병원'],건축가:['📐','건축 사무소'],사서:['📚','도서관'],경찰관:['🚓','경찰서'],약사:['💊','약국'],농부:['🌾','논과 밭'],조종사:['✈️','비행기 조종실'],
  기자:['📰','신문사 · 방송국'],판사:['⚖️','법원'],통역사:['🗣️','국제 회의장'],교사:['✏️','학교'],의사:['🩺','병원'],화가:['🎨','작업실'],어부:['🎣','바다 위 배'],디자이너:['📏','디자인 회사'],바리스타:['☕','카페'],큐레이터:['🖼️','미술관 · 박물관'],
  프로그래머:['💻','회사'],웹툰작가:['📱','작업실'],기상캐스터:['🌦️','방송국'],드론조종사:['🚁','넓은 들판'],우주비행사:['🚀','우주 정거장'],로봇공학자:['🤖','연구소'],환경연구원:['🌱','연구소'],물리치료사:['🦵','재활 병원'],
  동물사육사:['🦁','동물원'],게임개발자:['🎮','게임 회사'],데이터과학자:['📊','연구소'],인공지능개발자:['🧠','IT 회사'],소방대원:['🧯','소방서'],영양사:['🥗','급식실']};
arcDefine({id:'career_wordle',ch:'career',name:'직업 탐정 꼬들',tag:'단서로 직업 맞히기',from:'워들 · 꼬들 (한글 워들)',icon:'🔤',
  how:['단서를 보고 직업을 맞혀요','초록=맞음 · 노랑=자리 다름 · 회색=없음','단서를 적게 열수록 점수 UP!'],
  init(G){
    const lo=G.d<.25?2:G.d<.6?3:3, hi=G.d<.25?3:G.d<.6?4:7, pool=JOBS.filter(j=>[...j[0]].length>=lo&&[...j[0]].length<=hi&&JOBX[j[0]]);
    const words=G.shuffle(pool).slice(0,2+(G.d>.4?1:0)+(G.d>.8?1:0)),MAXT=6-Math.round(G.d*1.5);
    let wi=0,tries=[],cur=[],state={},total=0,msg='',msgT=0,tiles=[],open=1,flip=0,shake=0,solved=null,streak=0;
    const W=()=>[...words[wi][0]],L=()=>W().length;
    const mkTiles=()=>{const w=W(),dec=G.shuffle(JOBS.flatMap(j=>[...j[0]]).filter(s=>!w.includes(s))).filter((s,i,a)=>a.indexOf(s)===i).slice(0,Math.max(4,10-w.length));tiles=G.shuffle([...new Set([...w,...dec])]).slice(0,12);state={};open=1;tries=[];cur=[]};mkTiles();
    const clue=i=>{const j=words[wi],x=JOBX[j[0]];return [['💡 하는 일',j[1]],['🧰 쓰는 도구',x[0]],['🏢 일하는 곳',x[1]]][i]};
    const bs=()=>Math.min(42,(AW-40)/L()-6);
    const submit=()=>{if(solved)return;if(cur.length<L()){G.sfx('no');shake=.4;msg='칸을 모두 채워요';msgT=1.2;return}const w=W(),res=cur.map((s,i)=>s===w[i]?2:w.includes(s)?1:0);
      tries.push({s:cur.slice(),r:res});flip=.5;cur.forEach((s,i)=>state[s]=Math.max(state[s]||0,res[i]+1));cur=[];total++;
      if(res.every(v=>v===2)){G.sfx('ok');G.burst(AW/2,200,'#7FFFA0',30);streak++;const pts=80-tries.length*8-(open-1)*15;G.addScore(Math.max(10,pts));solved={w:words[wi],t:2.6};
        try{S.jobdex=S.jobdex||[];if(!S.jobdex.includes(words[wi][0])){S.jobdex.push(words[wi][0]);save()}}catch(e){}}
      else{G.sfx('tap');if(tries.length>=MAXT){G.lose(`정답은 "${words[wi][0]}"이었어요.`)}else if(open<3&&tries.length>=open){open++;msg='새 단서가 열렸어요!';msgT=2;G.sfx('unlock')}}};
    G.btn(AW-128,490,112,44,'✔ 확인',submit,{col:'#2F9E5B',fs:19});G.btn(16,490,112,44,'⌫ 지우기',()=>{cur.pop();G.sfx('tap')},{col:'#7A4A5A',fs:18});
    G.btn(136,490,88,44,'🔍 단서',()=>{if(open<3){open++;G.sfx('unlock')}else{msg='단서를 다 열었어요';msgT=1.2}},{col:'#5A4AA0',fs:17});
    return {
      boostText:'글자 하나 공개', boost(){const w=W();const i=w.findIndex((s,k)=>!tries.some(t=>t.s[k]===s));if(i>=0){msg=`${i+1}번째 글자는 "${w[i]}"`;msgT=4}},
      update(dt){msgT=Math.max(0,msgT-dt);flip=Math.max(0,flip-dt);shake=Math.max(0,shake-dt);
        if(solved){solved.t-=dt;if(solved.t<=0){solved=null;wi++;if(wi>=words.length){const avg=total/words.length;return G.win(avg<=2.5?3:avg<=4?2:1)}mkTiles()}}
        G.setHud(`🕵️ ${Math.min(wi+1,words.length)}/${words.length}번째`,`🔁 ${tries.length}/${MAXT}`,`🔍 단서 ${open}/3`)},
      draw(c){let y=8;for(let i=0;i<3;i++){const [h,t]=clue(i),on=i<open,big=i===1;const lines=on?wrapText(c,t,AW-120,big?28:17).slice(0,2):['?'];const hh=Math.max(38,10+lines.length*(big?32:21));
          G.rr(10,y,AW-20,hh,12,on?'#FFF8E6':'rgba(255,255,255,.12)',on?'#6B3D1F':'#8A7AA8',2);G.text(h,16,y+hh/2,15,on?'#8A552B':'#CBB8FF','left',null);
          lines.forEach((l,j)=>G.text(l,AW/2+44,y+hh/2+(j-(lines.length-1)/2)*(big?32:21),big?28:17,on?'#3A240E':'#CBB8FF','center',null));y+=hh+5}
        const b=bs(),bh=b*.72,y0=y+6,sx=shake?Math.sin(G.t*60)*6:0;
        for(let r=0;r<MAXT;r++){const row=tries[r]||(r===tries.length?{s:cur,r:null}:null);for(let i=0;i<L();i++){const x=AW/2-(L()*(b+6))/2+i*(b+6)+(r===tries.length?sx:0),yy=y0+r*(bh+5);
            const v=row&&row.r?row.r[i]:-1,fl=r===tries.length-1&&flip?Math.abs(Math.cos(flip*Math.PI*2)):1;
            c.save();c.translate(x+b/2,yy+bh/2);c.scale(1,fl);G.rr(-b/2,-bh/2,b,bh,8,v===2?'#3FB98A':v===1?'#E0B030':v===0?'#5A5A6A':'rgba(255,255,255,.12)','#8A7AA8',2);if(row&&row.s[i])G.text(row.s[i],0,1,b*.5,'#FFF');c.restore()}}
        const ty=y0+MAXT*(bh+5)+8,tw=(AW-32)/6;tiles.forEach((s,i)=>{const x=16+(i%6)*tw,yy=ty+Math.floor(i/6)*46,v=state[s]||0;G.rr(x+2,yy,tw-4,40,10,v===3?'#3FB98A':v===2?'#E0B030':v===1?'#4A4A5A':'#8A552B','#4E2C14',2);G.text(s,x+tw/2,yy+21,22,'#FFF')});
        if(msgT)G.text(msg,AW/2,ty-14,17,'#FFE27A');
        if(solved){const a=Math.min(1,(2.6-solved.t)*3);c.globalAlpha=a;G.rr(30,150,AW-60,200,22,'#FFF8E6','#D9A441',5);const x=JOBX[solved.w[0]];G.emo(x[0],AW/2,205,64);
          G.text(`🃏 ${solved.w[0]}`,AW/2,262,30,'#A3303C','center',null);G.text('직업 카드를 모았어요!',AW/2,298,18,'#6B4A2E','center',null);G.text(`도감 ${(S.jobdex||[]).length}장`,AW/2,326,16,'#8A552B','center',null);c.globalAlpha=1}},
      tap(x,y){if(solved)return;const b=bs(),bh=b*.72;let yy=8;for(let i=0;i<3;i++){const on=i<open,big=i===1;const lines=on?wrapText(G.ctx,clue(i)[1],AW-120,big?28:17).slice(0,2):['?'];yy+=Math.max(38,10+lines.length*(big?32:21))+5}
        const ty=yy+6+MAXT*(bh+5)+8,tw=(AW-32)/6;tiles.forEach((s,i)=>{const tx=16+(i%6)*tw,ty2=ty+Math.floor(i/6)*46;if(x>tx&&x<tx+tw&&y>ty2&&y<ty2+40&&cur.length<L()){cur.push(s);G.sfx('tap')}})}
    }}});
