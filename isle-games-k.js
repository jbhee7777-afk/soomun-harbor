/* ===== 다시 만든 놀이 7: 태극기 그리기 · 괭이갈매기.io (새로 만듦) =====
   태극기는 국기법 시행령 비율대로 그려요: 가로:세로 3:2 · 태극 지름 = 세로의 1/2 · 위 빨강 · 아래 파랑 (대각선으로 기울어짐)
   4괘: 왼쪽 위 건(☰) · 오른쪽 아래 곤(☷) · 오른쪽 위 감(☵) · 왼쪽 아래 리(☲) · 괘 길이 = 세로의 1/4 · 막대 굵기 = 세로의 1/24 */
function drawTaegeukgi(c,x,y,w,wave=0){const h=w*2/3,cx=x+w/2,cy=y+h/2,R=h/4,a=Math.atan2(2,3);
  c.save();if(wave){c.translate(x,y);c.transform(1,Math.sin(wave)*.06,0,1,0,0);c.translate(-x,-y)}
  c.fillStyle='#FFFFFF';c.fillRect(x,y,w,h);c.strokeStyle='rgba(0,0,0,.35)';c.lineWidth=Math.max(.5,w/120);c.strokeRect(x,y,w,h);
  c.save();c.translate(cx,cy);c.rotate(a);
  c.fillStyle='#CD2E3A';c.beginPath();c.arc(0,0,R,Math.PI,Math.PI*2);c.fill();
  c.fillStyle='#0047A0';c.beginPath();c.arc(0,0,R,0,Math.PI);c.fill();
  c.fillStyle='#CD2E3A';c.beginPath();c.arc(-R/2,0,R/2,0,Math.PI*2);c.fill();
  c.fillStyle='#0047A0';c.beginPath();c.arc(R/2,0,R/2,0,Math.PI*2);c.fill();c.restore();
  const L=h/4,bw=h/24,gap=h/48,dist=R+h/8+h/12;
  /* 막대: 1=이어진 막대, 0=가운데가 끊긴 막대 (안쪽부터 바깥쪽 순서) */
  const tri=[[Math.atan2(-2,-3),[1,1,1]],[Math.atan2(2,3),[0,0,0]],[Math.atan2(-2,3),[0,1,0]],[Math.atan2(2,-3),[1,0,1]]];
  c.fillStyle='#000000';for(const [ang,bars] of tri){c.save();c.translate(cx+Math.cos(ang)*dist,cy+Math.sin(ang)*dist);c.rotate(ang);
    bars.forEach((b,k)=>{const bx=-h/12+k*(bw+gap);if(b)c.fillRect(bx,-L/2,bw,L);else{c.fillRect(bx,-L/2,bw,L/2-gap/2);c.fillRect(bx,gap/2,bw,L/2-gap/2)}});c.restore()}
  c.restore()}
window.drawTaegeukgi=drawTaegeukgi;
/* 깃대 + 태극기 (깃대 아래 끝 x,y · 깃발 너비 w) */
function flagPole(c,x,y,w,t=0){const ph=w*1.6;c.fillStyle='#E8E8EE';c.fillRect(x-1.2,y-ph,2.4,ph);c.fillStyle='#D9A441';c.beginPath();c.arc(x,y-ph,2.6,0,6.29);c.fill();drawTaegeukgi(c,x+1,y-ph+2,w,Math.sin(t*3)*.6)}

/* 독도 섬 그림 (Canva, 깃발 없이 그림) — 흰 바탕을 지워서 써요. 태극기는 코드로 정확하게 그려 넣어요 */
let DOKDO_SPR=null;(function(){const im=new Image();im.onload=()=>{try{const W=im.width,H=im.height,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,W,H),p=d.data,seen=new Uint8Array(W*H),st=[];const wh=i=>p[i*4]>228&&p[i*4+1]>228&&p[i*4+2]>228;for(let i=0;i<W;i++)st.push(i,(H-1)*W+i);for(let j=0;j<H;j++)st.push(j*W,j*W+W-1);while(st.length){const i=st.pop();if(seen[i]||!wh(i))continue;seen[i]=1;p[i*4+3]=0;const xx=i%W,yy=(i/W)|0;if(xx>0)st.push(i-1);if(xx<W-1)st.push(i+1);if(yy>0)st.push(i-W);if(yy<H-1)st.push(i+W)}x.putImageData(d,0,0);DOKDO_SPR=cv}catch(e){}};im.src='assets/v2/dokdo_isle.jpg'})();
/* ---------- 독도 3: 괭이갈매기.io — 새로 만듦 ----------
   바다 위 독도(동도 · 서도, 태극기)를 가운데 두고 괭이갈매기 무리를 키워요. 물고기·오징어·독도새우를 먹고, 쓰레기는 피하고,
   🐚 황금 조개를 먹으면 게임이 멈추고 퀴즈. ⚡ 빠르게 단추 · 순위표 · 작은 지도. */
arcDefine({id:'dokdo_snakeio',ch:'dokdo',name:'괭이갈매기.io',tag:'.io 무리 키우기',from:'스네이크.io · 슬리더리오',icon:'🐦',
  how:['누른 쪽으로 갈매기 무리가 날아요','물고기를 먹으면 무리가 커져요 · 쓰레기는 피해요','🐚 황금 조개를 먹으면 퀴즈! (게임 멈춤)'],
  init(G){
    const WW=1600,WH=1600,DX=WW/2,DY=WH/2,goal=28+Math.round(G.d*45),nAI=3+Math.round(G.d*3),SP=17;
    const NAMES=['파도','바람','물결','은빛','하늘','노을'],WING=['#E8B04A','#7AB8E8','#E87A9A','#9AD87A','#B89AE8','#E8946A'];
    const mk=(x,y,len,ai,i)=>({x,y,a:Math.random()*6.28,ta:0,trail:[],len,ai,dead:0,wing:ai?WING[i%WING.length]:'#8A96A6',name:ai?NAMES[i%NAMES.length]:'나',think:0,boost:0});
    let me=mk(DX,DY+260,6,false,0),ais=[...Array(nAI)].map((_,i)=>{const a=i/nAI*6.28;return mk(DX+Math.cos(a)*560,DY+Math.sin(a)*560,G.ri(6,14),true,i)});
    let food=[],trash=[],shells=[],hearts=3,inv=2,aim=null,time=Math.round(140-25*G.d),boosting=false,bAcc=0,msg=null,waves=0,eatN=0;
    const KIND=[['fish',1,.7],['squid',3,.18],['shrimp',2,.12]];
    const rndPos=()=>{let x,y;do{x=G.rand(40,WW-40);y=G.rand(40,WH-40)}while(Math.hypot(x-DX,y-DY)<190);return [x,y]};
    const addFood=(x,y,k)=>{if(x==null){[x,y]=rndPos();const r=Math.random();k=r<.7?'fish':r<.88?'squid':'shrimp'}food.push({x,y,k,v:k==='squid'?3:k==='shrimp'?2:1,ph:Math.random()*6,vx:G.rand(-12,12),vy:G.rand(-12,12)})};
    for(let i=0;i<110;i++)addFood();
    const addTrash=()=>{const [x,y]=rndPos();trash.push({x,y,e:G.pick(['🛍️','🥤','🧴']),ph:Math.random()*6})};for(let i=0;i<8+Math.round(G.d*8);i++)addTrash();
    const addShell=()=>{const [x,y]=rndPos();shells.push({x,y})};for(let i=0;i<3;i++)addShell();
    const FACT=['독도는 동도와 서도, 그리고 89개의 작은 바위섬으로 이루어져 있어요.','괭이갈매기는 고양이처럼 "야옹" 하고 울어서 이름이 붙었어요.','독도는 천연기념물로 지정되어 보호받고 있어요.','독도 바다는 따뜻한 물과 차가운 물이 만나 물고기가 많아요.','독도에는 독도경비대와 등대가 있어요.','독도는 경상북도 울릉군에 속한 대한민국 땅이에요.'];
    const seg=s=>{const out=[];let d=0,last={x:s.x,y:s.y};out.push({x:s.x,y:s.y,a:s.a});for(let i=0;i<s.trail.length;i++){const p=s.trail[i];d+=Math.hypot(p.x-last.x,p.y-last.y);last=p;if(d>=SP*out.length)out.push(p);if(out.length>=s.len)break}return out};
    const steer=(s,dt,sp)=>{let da=((s.ta-s.a+Math.PI*3)%(Math.PI*2))-Math.PI;s.a+=G.clamp(da,-3.4*dt,3.4*dt);s.x+=Math.cos(s.a)*sp*dt;s.y+=Math.sin(s.a)*sp*dt;
      if(s.x<30||s.x>WW-30||s.y<30||s.y>WH-30){s.ta=Math.atan2(DY-s.y,DX-s.x);s.x=G.clamp(s.x,30,WW-30);s.y=G.clamp(s.y,30,WH-30)}
      s.trail.unshift({x:s.x,y:s.y,a:s.a});if(s.trail.length>s.len*SP/2+40)s.trail.length=Math.round(s.len*SP/2+40)};
    const quiz=()=>{const q=drawQ(G.trial?7:CI);if(!q||typeof runQuiz!=='function')return;aim=null;boosting=false;
      runQuiz(q,{tag:'🐚 황금 조개 퀴즈',title:'맞히면 갈매기 +5마리!',closable:false,rightLabel:'좋아요! 계속 날기',wrongLabel:'계속 날기',
        onRight:()=>{if(G.over)return;me.len+=5;G.sfx('star');msg={t:'정답! 갈매기 +5마리',c:'#7FFFA0',k:1.6};G.addScore(30);inv=Math.max(inv,1.5)},
        onWrong:()=>{if(G.over)return;if(!G.trial)wrongAdd(CI,q);inv=Math.max(inv,1.5)}})};
    const hurt=why=>{if(inv)return;hearts--;inv=2;G.sfx('hurt');G.shake=7;seg(me).forEach((p,i)=>{if(i%2)addFood(p.x,p.y,'fish')});me.len=Math.max(4,Math.floor(me.len*.65));msg={t:why,c:'#FF8A8A',k:1.6};if(hearts<=0)G.lose('다른 무리에 너무 많이 부딪혔어요!')};
    /* 괭이갈매기 (위에서 본 모습): 흰 몸 · 회색 날개 끝 검정 · 꼬리 검은 띠 · 노란 부리 끝 빨강·검정 */
    const gull=(c,x,y,a,s,wing,flap,lead)=>{c.save();c.translate(x,y);c.rotate(a);c.scale(s,s);
      c.fillStyle='rgba(10,40,70,.22)';c.beginPath();c.ellipse(-4,10,12,5,0,0,6.29);c.fill();
      const f=Math.sin(flap),span=17+f*5;
      for(const sd of [-1,1]){c.fillStyle=wing;c.beginPath();c.moveTo(3,0);c.quadraticCurveTo(0,sd*span*.6,-6,sd*span);c.lineTo(-11,sd*(span-3));c.quadraticCurveTo(-6,sd*6,-6,0);c.closePath();c.fill();
        c.fillStyle='#1A1A22';c.beginPath();c.moveTo(-6,sd*span);c.lineTo(-11,sd*(span-3));c.lineTo(-8,sd*(span-7));c.closePath();c.fill()}
      c.fillStyle='#FFFFFF';c.beginPath();c.ellipse(0,0,11,5,0,0,6.29);c.fill();c.strokeStyle='rgba(0,0,0,.15)';c.lineWidth=1;c.stroke();
      c.fillStyle='#FFFFFF';c.beginPath();c.moveTo(-9,-4);c.lineTo(-16,-3);c.lineTo(-16,3);c.lineTo(-9,4);c.fill();c.fillStyle='#1A1A22';c.fillRect(-15,-3,2.5,6);
      c.fillStyle='#FFFFFF';c.beginPath();c.arc(9,0,4.2,0,6.29);c.fill();c.fillStyle='#F2C230';c.beginPath();c.moveTo(12,-1.5);c.lineTo(18,0);c.lineTo(12,1.5);c.fill();c.fillStyle='#D8303A';c.fillRect(15.5,-.8,1.5,1.6);
      c.fillStyle='#1A1A22';c.beginPath();c.arc(10,-2,.9,0,6.29);c.arc(10,2,.9,0,6.29);c.fill();
      if(lead){c.strokeStyle='#FFE27A';c.lineWidth=1.5;c.beginPath();c.arc(0,0,20,0,6.29);c.stroke()}c.restore()};
    const fish=(c,f)=>{const a=Math.atan2(f.vy,f.vx);c.save();c.translate(f.x,f.y);c.rotate(a);
      if(f.k==='squid'){G.emo('🦑',0,0,24,1,Math.PI/2)}else if(f.k==='shrimp'){G.emo('🦐',0,0,20)}
      else{const g=c.createLinearGradient(0,-5,0,5);g.addColorStop(0,'#E8F4FF');g.addColorStop(1,'#7A9AB8');c.fillStyle=g;c.beginPath();c.ellipse(0,0,8,4,0,0,6.29);c.fill();c.beginPath();c.moveTo(-7,0);c.lineTo(-12,-4+Math.sin(f.ph*8)*1.5);c.lineTo(-12,4+Math.sin(f.ph*8)*1.5);c.fill();c.fillStyle='#1A2A3A';c.beginPath();c.arc(4,-1,1,0,6.29);c.fill()}
      c.restore()};
    const dokdo=c=>{const t=G.t;if(DOKDO_SPR){const w=460,h=w*DOKDO_SPR.height/DOKDO_SPR.width,x0=DX-w/2,y0=DY-h/2;c.fillStyle='rgba(120,210,230,.35)';c.beginPath();c.ellipse(DX,DY+h*.22,w*.52,h*.3,0,0,6.29);c.fill();c.strokeStyle='rgba(255,255,255,.55)';c.lineWidth=3;c.beginPath();c.ellipse(DX,DY+h*.22,w*.5+Math.sin(t*2)*4,h*.28+Math.sin(t*2)*3,0,0,6.29);c.stroke();c.drawImage(DOKDO_SPR,x0,y0,w,h);flagPole(c,x0+w*.76,y0+h*.36,40,t);G.rr(DX-66,y0+h-4,132,30,12,'rgba(255,255,255,.94)','#0047A0',2);G.text('대한민국 독도',DX,y0+h+11,17,'#0B2A5A','center',null);return}
      c.fillStyle='rgba(120,210,230,.35)';c.beginPath();c.ellipse(DX,DY+10,215,120,0,0,6.29);c.fill();
      c.strokeStyle='rgba(255,255,255,.6)';c.lineWidth=3;c.beginPath();c.ellipse(DX,DY+10,200+Math.sin(t*2)*4,108+Math.sin(t*2)*3,0,0,6.29);c.stroke();
      const isl=(x,y,w,h,col)=>{c.fillStyle='rgba(255,255,255,.85)';c.beginPath();c.ellipse(x,y+h*.38,w*.62,h*.22,0,0,6.29);c.fill();
        const g=c.createLinearGradient(x-w/2,y-h,x+w/2,y+h*.4);g.addColorStop(0,'#B8A07A');g.addColorStop(.55,'#7A6248');g.addColorStop(1,'#4A3A2C');c.fillStyle=g;
        c.beginPath();c.moveTo(x-w/2,y+h*.3);c.bezierCurveTo(x-w*.45,y-h*.2,x-w*.2,y-h*.75,x,y-h*.8);c.bezierCurveTo(x+w*.25,y-h*.7,x+w*.48,y-h*.15,x+w/2,y+h*.3);c.closePath();c.fill();
        c.fillStyle=col;c.beginPath();c.moveTo(x-w*.3,y-h*.25);c.bezierCurveTo(x-w*.2,y-h*.6,x+w*.15,y-h*.68,x+w*.28,y-h*.3);c.bezierCurveTo(x+w*.1,y-h*.38,x-w*.1,y-h*.35,x-w*.3,y-h*.25);c.fill();
        c.strokeStyle='rgba(40,30,20,.35)';c.lineWidth=2;for(let k=0;k<4;k++){c.beginPath();c.moveTo(x-w*.35+k*w*.2,y+h*.25);c.lineTo(x-w*.25+k*w*.18,y-h*.2);c.stroke()}};
      isl(DX-75,DY+10,150,170,'#6FA858');isl(DX+80,DY+20,170,130,'#7AB860');
      for(const [rx,ry,rs] of [[DX-160,DY+60,22],[DX+175,DY+70,18],[DX+10,DY+95,14],[DX-30,DY-90,12]]){c.fillStyle='#5A4A3A';c.beginPath();c.ellipse(rx,ry,rs,rs*.7,0,0,6.29);c.fill();c.strokeStyle='rgba(255,255,255,.8)';c.lineWidth=2;c.beginPath();c.ellipse(rx,ry+3,rs+5,rs*.7+3,0,0,6.29);c.stroke()}
      G.rr(DX+66,DY-62,26,30,4,'#F4F4F4','#8A8A9A',1.5);G.rr(DX+70,DY-74,18,14,6,'#E04A3A');G.circle(DX+79,DY-70,4,`rgba(255,240,150,${.6+.4*Math.sin(t*4)})`);
      flagPole(c,DX+112,DY-30,34,t);
      G.rr(DX-62,DY+118,124,28,12,'rgba(255,255,255,.92)','#0047A0',2);G.text('대한민국 독도',DX,DY+132,16,'#0B2A5A','center',null)};
    return {
      boostText:'갈매기 +5마리', boost(){me.len+=5},
      update(dt){time-=dt;inv=Math.max(0,inv-dt);waves+=dt;if(msg){msg.k-=dt;if(msg.k<=0)msg=null}if(time<=0)return G.lose(`시간이 다 됐어요! (갈매기 ${me.len}/${goal}마리)`);
        if(aim)me.ta=Math.atan2(aim.y-AH/2,aim.x-AW/2);const bst=boosting&&me.len>5;if(bst){bAcc+=dt;if(bAcc>.45){bAcc=0;me.len--;const t=me.trail[me.trail.length-1];if(t)addFood(t.x,t.y,'fish')}}
        steer(me,dt,(bst?220:130)+20*G.d);
        for(const f of food){f.ph+=dt;f.x+=f.vx*dt;f.y+=f.vy*dt;if(Math.random()<.01){f.vx=G.rand(-14,14);f.vy=G.rand(-14,14)}}
        for(const a of ais){if(a.dead){a.dead-=dt;if(a.dead<=0){const [x,y]=rndPos();Object.assign(a,mk(x,y,G.ri(6,12),true,ais.indexOf(a)));a.dead=0}continue}
          a.think-=dt;if(a.think<=0){a.think=G.rand(.3,.8);const dMe=Math.hypot(me.x-a.x,me.y-a.y);
            if(dMe<260&&a.len>me.len&&Math.random()<.25+.4*G.d)a.ta=Math.atan2(me.y+Math.sin(me.a)*70-a.y,me.x+Math.cos(me.a)*70-a.x);
            else{const f=food.reduce((b,x)=>{const d=Math.hypot(x.x-a.x,x.y-a.y);return d<b.d?{d,x}:b},{d:1e9,x:null});if(f.x)a.ta=Math.atan2(f.x.y-a.y,f.x.x-a.x)}}
          steer(a,dt,(105+55*G.d))}
        for(const s of [me,...ais.filter(a=>!a.dead)]){for(let i=food.length-1;i>=0;i--){const f=food[i];if(Math.hypot(f.x-s.x,f.y-s.y)<18){s.len+=f.v;food.splice(i,1);
              if(s===me){G.sfx('coin');G.addScore(f.v*3);if(f.k!=='fish')msg={t:f.k==='squid'?'🦑 독도 오징어! +3':'🦐 독도새우! +2',c:'#FFE27A',k:1.2};eatN++;if(eatN%25===0)msg={t:'💡 '+G.pick(FACT),c:'#BFEFFF',k:3.5}}}}}
        while(food.length<110)addFood();
        for(let i=trash.length-1;i>=0;i--){const t=trash[i];if(Math.hypot(t.x-me.x,t.y-me.y)<20){trash.splice(i,1);me.len=Math.max(4,me.len-3);G.sfx('no');G.shake=4;msg={t:`${t.e} 쓰레기를 먹었어요! -3마리 (바다를 깨끗하게!)`,c:'#FF8A8A',k:2};setTimeout(addTrash,4000)}}
        for(let i=shells.length-1;i>=0;i--){if(Math.hypot(shells[i].x-me.x,shells[i].y-me.y)<26){shells.splice(i,1);G.sfx('unlock');setTimeout(addShell,7000);quiz();break}}
        for(const a of ais){if(a.dead)continue;const sa=seg(a);if(!inv&&sa.slice(2).some(p=>Math.hypot(p.x-me.x,p.y-me.y)<16))hurt(`${a.name} 무리에 부딪혔어요!`);
          const sm=seg(me);if(sm.slice(2).some(p=>Math.hypot(p.x-a.x,p.y-a.y)<16)){sa.forEach(p=>addFood(p.x+G.rand(-6,6),p.y+G.rand(-6,6),'fish'));a.dead=3;G.sfx('pop');msg={t:`${a.name} 무리가 흩어졌어요! 물고기 잔치!`,c:'#FFE27A',k:1.5}}}
        if(me.len>=goal)return G.win(starsByHearts(hearts));
        G.setHud(HEARTS(hearts),`🐦 ${me.len}/${goal}마리`,TIME(time))},
      draw(c){const cx=me.x-AW/2,cy=me.y-AH/2;const g=c.createRadialGradient(AW/2,AH/2,40,AW/2,AH/2,520);g.addColorStop(0,'#3FB0E0');g.addColorStop(1,'#0D4A7A');c.fillStyle=g;c.fillRect(0,0,AW,AH);
        c.save();c.translate(-cx,-cy);
        c.strokeStyle='rgba(255,255,255,.14)';c.lineWidth=2;const y0=Math.floor((me.y-AH)/60)*60;for(let y=y0;y<me.y+AH;y+=60){c.beginPath();for(let x=me.x-AW;x<=me.x+AW;x+=24){const yy=y+Math.sin(x*.025+waves*1.4+y*.1)*5;x===me.x-AW?c.moveTo(x,yy):c.lineTo(x,yy)}c.stroke()}
        c.fillStyle='rgba(255,255,255,.06)';for(let i=0;i<14;i++){const sx=((i*373)%WW),sy=((i*911)%WH);c.beginPath();c.ellipse(sx+Math.sin(waves+i)*10,sy,60,22,i,0,6.29);c.fill()}
        G.rr(0,0,WW,WH,30,null,'rgba(255,255,255,.5)',6);
        if(Math.abs(DX-me.x)<AW+260&&Math.abs(DY-me.y)<AH+260)dokdo(c);
        for(const f of food)if(Math.abs(f.x-me.x)<AW&&Math.abs(f.y-me.y)<AH)fish(c,f);
        for(const t of trash)if(Math.abs(t.x-me.x)<AW&&Math.abs(t.y-me.y)<AH){G.circle(t.x,t.y,15,'rgba(255,80,80,.18)');G.emo(t.e,t.x,t.y+Math.sin(G.t*2+t.ph)*2,22)}
        for(const s of shells){c.save();c.shadowColor='#FFE27A';c.shadowBlur=16+8*Math.sin(G.t*5);G.circle(s.x,s.y,20,'rgba(255,226,122,.4)');c.restore();G.emo('🐚',s.x,s.y,30)}
        for(const s of [...ais.filter(a=>!a.dead),me]){if(s===me&&inv&&Math.floor(G.t*12)%2)continue;const sg=seg(s);
          for(let i=sg.length-1;i>=0;i--){const p=sg[i],an=p.a!=null?p.a:s.a,side=i?(i%2?1:-1)*(10+Math.min(14,i*1.2)):0,px=p.x-Math.sin(an)*side,py=p.y+Math.cos(an)*side;gull(c,px,py,an,i?.95:1.35,s.wing,G.t*10+i*1.3,i===0&&s===me)}
          G.rr(s.x-26,s.y-36,52,17,8,s===me?'rgba(255,226,122,.92)':'rgba(10,30,60,.7)');G.text(`${s.name} ${s.len}`,s.x,s.y-27,12,s===me?'#3A240E':'#FFFFFF','center',null)}
        c.restore();
        /* 순위표 · 작은 지도 · 빠르게 단추 */
        const rank=[me,...ais.filter(a=>!a.dead)].sort((a,b)=>b.len-a.len).slice(0,3);G.rr(8,8,118,22+rank.length*18,10,'rgba(10,30,60,.7)');G.text('🏆 순위',16,19,13,'#FFE27A','left',null);
        rank.forEach((s,i)=>G.text(`${i+1}. ${s.name} ${s.len}`,16,37+i*18,13,s===me?'#FFE27A':'#FFFFFF','left',null));
        const MX=AW-80,MY=8,MS=72;G.rr(MX,MY,MS,MS,10,'rgba(10,30,60,.7)','rgba(255,255,255,.5)',1.5);G.circle(MX+DX/WW*MS,MY+DY/WH*MS,5,'#8A6A4A');
        for(const s of shells)G.circle(MX+s.x/WW*MS,MY+s.y/WH*MS,2.5,'#FFE27A');for(const a of ais)if(!a.dead)G.circle(MX+a.x/WW*MS,MY+a.y/WH*MS,2.5,a.wing);G.circle(MX+me.x/WW*MS,MY+me.y/WH*MS,3.5,'#FFFFFF');
        const sh=shells.reduce((b,s)=>{const d=Math.hypot(s.x-me.x,s.y-me.y);return d<b.d?{d,s}:b},{d:1e9,s:null});
        if(sh.s&&sh.d>220){const a=Math.atan2(sh.s.y-me.y,sh.s.x-me.x);G.text('🐚',AW/2+Math.cos(a)*150,AH/2+Math.sin(a)*150,22,'#FFF','center',null)}
        G.circle(AW-44,AH-44,30,boosting?'#FFC83A':'rgba(255,255,255,.2)','#FFFFFF',3);G.text('⚡',AW-44,AH-48,22,'#FFF','center',null);G.text('빠르게',AW-44,AH-26,11,'#FFFFFF','center',null);
        if(msg){G.rr(16,AH-120,AW-100,48,12,'rgba(10,20,40,.82)',msg.c,2);const L=wrapText(c,msg.t,AW-120,15).slice(0,2);L.forEach((l,i)=>G.text(l,16+(AW-100)/2,AH-96+(i-(L.length-1)/2)*18,15,msg.c,'center',null))}},
      down(x,y){if(Math.hypot(x-(AW-44),y-(AH-44))<34){boosting=true;return}aim={x,y}},
      move(x,y,dn){if(dn&&!boosting)aim={x,y}},
      up(x,y){if(boosting){boosting=false;return}},
      key(k){const m={L:Math.PI,R:0,U:-Math.PI/2,D:Math.PI/2}[k];if(m!=null){me.ta=m;aim=null}if(k==='A')boosting=!boosting}
    }}});
