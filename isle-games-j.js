/* ===== 다시 만든 놀이 6: 민주 탐정 브레인 — 문제 종류 12가지 · 종류마다 여러 내용 · 한 바퀴 돌 때까지 같은 문제 안 나옴 =====
   비밀 투표 문제는 Canva 그림(교실 투표소 · 벨벳 커튼)을 써요. */
const DB_OX=[['투표할 때 짝꿍에게 누구를 뽑았는지 꼭 알려 줘야 해요.',0,'비밀 선거라서 누구를 뽑았는지 말하지 않아도 돼요.'],
  ['다수결로 정한 뒤에도 소수 의견을 존중해요.',1,'소수 의견에도 좋은 생각이 있을 수 있어요.'],
  ['학급 회의에서는 손을 들고 차례대로 말해요.',1,'차례를 지켜야 모두의 의견을 들을 수 있어요.'],
  ['반장은 선생님이 혼자 정해야 공정해요.',0,'반장은 반 친구들이 투표로 함께 뽑아요.'],
  ['한 사람이 투표를 여러 번 해도 돼요.',0,'평등 선거: 누구나 한 사람 한 표예요.'],
  ['투표는 다른 사람이 대신 해 줘도 돼요.',0,'직접 선거: 내가 직접 투표해요.'],
  ['법은 국회에서 만들어요.',1,'국회는 법을 만드는 곳이에요.'],
  ['재판은 법원에서 해요.',1,'법원은 법에 따라 재판을 해요.'],
  ['대통령은 국회의원들끼리 뽑아요.',0,'대통령은 국민이 직접 투표로 뽑아요.'],
  ['의견이 다르면 목소리가 큰 사람이 이겨요.',0,'까닭(근거)을 들어 말하고 서로 들어요.'],
  ['공약은 후보가 당선되면 하겠다고 약속한 일이에요.',1,'공약을 비교해 보고 투표해요.'],
  ['시장·군수·구청장도 주민이 투표로 뽑아요.',1,'지방 자치: 우리 지역 대표도 우리가 뽑아요.'],
  ['나라의 주인은 국민이에요.',1,'국민 주권: 나라의 중요한 일은 국민이 정해요.'],
  ['회의할 때 친구 말을 끊고 말해도 괜찮아요.',0,'끝까지 듣고 나서 내 생각을 말해요.'],
  ['투표용지에 여러 후보를 함께 찍어도 돼요.',0,'한 명만 찍어야 해요. 여러 명을 찍으면 무효표가 돼요.'],
  ['소수 의견은 무시해도 돼요.',0,'적은 사람의 의견도 귀 기울여 들어요.'],
  ['뉴스나 선거 공보로 후보의 공약을 비교할 수 있어요.',1,'공약을 꼼꼼히 살피는 것이 똑똑한 투표예요.'],
  ['초등학생은 학급 회의에 참여할 수 없어요.',0,'학급 회의는 우리 반 모두가 함께해요.'],
  ['반장 후보가 표를 얻으려고 선물을 주면 안 돼요.',1,'선물로 표를 얻는 것은 공정하지 않아요.'],
  ['학급 규칙은 함께 의논해서 만들 수 있어요.',1,'함께 만든 규칙은 더 잘 지켜요.'],
  ['1표 차이로 졌으면 결과를 무시해도 돼요.',0,'결과가 아쉬워도 정한 방법에 따라 나온 결과를 존중해요.'],
  ['대화와 타협은 갈등을 푸는 좋은 방법이에요.',1,'서로 조금씩 양보하며 함께 방법을 찾아요.'],
  ['국회의원은 국민이 선거로 뽑아요.',1,'국회의원은 국민의 대표예요.'],
  ['투표가 끝나면 결과를 모두에게 알려요.',1,'결과를 알려야 모두가 믿을 수 있어요.'],
  ['나라의 힘을 국회·정부·법원이 나누어 맡아요.',1,'삼권 분립: 힘이 한곳에 몰리지 않게 해요.'],
  ['내 생각과 다른 의견은 틀린 의견이에요.',0,'다른 의견은 틀린 것이 아니라 다른 것이에요.']];
const DB_ORDER=[['학급 회의 순서대로 눌러요',['🔔 회의 시작 알리기','📋 오늘의 주제 알리기','💬 의견 나누기','🗳️ 투표로 정하기','📢 결과 발표하기']],
  ['선거가 열리는 순서대로 눌러요',['📝 후보 등록하기','📣 공약 알리기','🗳️ 투표하기','🔢 표 세기 (개표)','🎉 당선자 발표']],
  ['투표소에서 투표하는 순서대로 눌러요',['🪪 내가 누구인지 확인','📄 투표용지 받기','✅ 기표소에서 도장 찍기','📃 투표용지 접기','📥 투표함에 넣기']],
  ['법이 만들어지는 순서대로 눌러요',['📄 법률안 내기','💬 국회에서 토론하기','🗳️ 국회에서 투표로 정하기','📢 대통령이 널리 알리기']],
  ['친구와의 갈등을 푸는 순서대로 눌러요',['🔍 무엇이 문제인지 알기','🗣️ 서로 생각 말하기','💡 해결 방법 찾기','🤝 함께 정하고 지키기']],
  ['우리 반 규칙을 만드는 순서대로 눌러요',['💡 필요한 규칙 의견 내기','💬 의견 나누기','🗳️ 투표로 정하기','📌 붙여 두고 함께 지키기']],
  ['우리 동네 문제를 해결하는 순서대로 눌러요',['🔍 문제 찾기','📊 까닭 조사하기','💬 주민들과 의논하기','✉️ 시청·구청에 의견 내기']]];
const DB_MATCH=[['보통 선거','나이가 되면 누구나 투표'],['평등 선거','누구나 한 사람 한 표'],['직접 선거','내가 직접 투표'],['비밀 선거','누굴 뽑았는지 비밀'],['국회','법을 만들어요'],['정부','법에 따라 나라 살림'],
  ['법원','재판을 해요'],['공약','당선되면 할 일 약속'],['다수결','많은 쪽 의견으로 정하기'],['지방 자치','지역 일을 주민이 스스로'],['헌법','나라의 가장 기본 법'],['개표','투표지를 세어 결과 내기']];
const DB_SCN=[['공 하나를 두 반이 쓰고 싶어요. 가장 공정한 방법은?',['시간을 나눠 번갈아 써요','힘센 반이 가져가요','먼저 잡은 반이 계속 써요']],
  ['체험 학습 장소를 정해요. 어떻게 할까요?',['의견을 듣고 투표로 정해요','반장 혼자 정해요','가장 큰 소리로 말한 친구 뜻대로']],
  ['투표 결과가 동점이에요!',['의견을 더 나누고 다시 투표해요','선생님이 좋아하는 쪽으로','먼저 손 든 쪽으로']],
  ['회의 중 친구가 내 의견에 반대해요.',['까닭을 듣고 내 생각도 근거를 들어 말해요','화를 내요','회의에서 나가요']],
  ['그네가 하나뿐이에요.',['줄 서서 차례로 타요','이긴 사람만 계속 타요','형·누나만 타요']],
  ['한 친구만 계속 말해요. 사회자는?',['다른 친구에게도 말할 기회를 줘요','그냥 끝날 때까지 기다려요','다 같이 떠들어요']],
  ['동네 공원에 쓰레기가 많아요.',['주민과 의논하고 구청에 의견을 내요','못 본 척해요','다른 동네 탓을 해요']],
  ['다수결로 후식이 정해졌는데 나는 반대였어요.',['결과를 따르고 다음에 또 의견을 내요','혼자 다른 후식을 달라고 떼써요','결과를 무시해요']],
  ['휠체어를 탄 친구와 함께 체험 학습을 가요.',['모두 갈 수 있는 곳인지 함께 살펴요','그 친구만 빼고 정해요','아무 데나 가요']],
  ['상대 후보 포스터가 찢어져 있어요.',['선생님께 알리고 공정하게 선거해요','잘됐다고 좋아해요','더 찢어요']],
  ['반 규칙 "복도에서 뛰지 않기"가 생겼어요.',['모두 함께 지켜요','반장만 지켜요','바쁠 땐 안 지켜도 돼요']],
  ['모둠 이름 의견이 4개예요.',['좋은 점을 말한 뒤 투표해요','모둠장 마음대로 정해요','가장 긴 이름으로 해요']],
  ['교실 텔레비전 채널로 다퉈요.',['의논해서 보는 시간을 정해요','리모컨 가진 사람 마음대로','매일 다퉈요']],
  ['회의 결과를 모르는 친구가 있어요.',['게시판에 붙여 모두 알게 해요','아는 사람만 알면 돼요','비밀로 해요']],
  ['반장 선거에 나가고 싶은 친구가 둘이에요.',['둘 다 후보가 되어 투표로 정해요','더 친한 친구만 나가요','가위바위보로 끝내요']],
  ['우리 반에 새로 전학 온 친구가 있어요.',['회의에서 의견을 말할 기회를 줘요','아직 잘 모르니 빼고 정해요','나중에 알려 줘요']]];
const DB_PLEDGE=[['쉬는 시간 보드게임을 함께 고르겠습니다','매일 급식에 피자 100판!'],['교실 분리수거를 당번 정해 챙기겠습니다','학교를 놀이공원으로 바꾸겠습니다'],
  ['의견함을 만들어 매주 함께 읽겠습니다','모두에게 용돈 만 원씩 주겠습니다'],['학급 문고 빌리는 규칙을 만들겠습니다','교실에 수영장을 만들겠습니다'],
  ['아침마다 창문을 열어 환기하겠습니다','하늘을 날 수 있게 해 주겠습니다'],['다툼은 학급 회의로 함께 풀겠습니다','숙제를 반장이 다 해 주겠습니다'],
  ['청소 구역을 공평하게 돌아가며 맡겠습니다','방학을 1년으로 늘리겠습니다'],['친구 생일을 다 같이 축하하겠습니다','모든 과목을 체육으로 바꾸겠습니다']];
const DB_SORT=[[['권리','🙋'],['의무','📋'],[['투표하기','권리'],['배울 수 있기','권리'],['내 생각 말하기','권리'],['차별받지 않기','권리'],['세금 내기','의무'],['나라 지키기 (국방)','의무'],['환경 지키기','의무'],['법 지키기','의무']]],
  [['국회','🏛️'],['법원','⚖️'],[['법 만들기','국회'],['나라 살림 예산 정하기','국회'],['재판하기','법원'],['다툼을 법으로 판단하기','법원']]],
  [['공정해요','😊'],['불공정해요','😠'],[['차례대로 하기','공정해요'],['모두 한 표씩','공정해요'],['규칙을 미리 알리기','공정해요'],['친한 친구만 뽑기','불공정해요'],['몰래 두 번 투표','불공정해요'],['선물 주고 표 받기','불공정해요']]]];
const DB_HIDE=[['열쇠는 책 사이에 끼워 두었어요.','📚'],['열쇠는 화분 흙 위에 올려 두었어요.','🪴'],['열쇠는 가방 주머니에 넣었어요.','🎒'],['열쇠는 곰 인형이 안고 있어요.','🧸'],['열쇠는 시계 뒤에 걸어 두었어요.','⏰'],['열쇠는 우산 안에 넣어 두었어요.','☂️']];
const CANDI=[['🐶','멍멍'],['🐱','야옹'],['🐰','깡총'],['🐻','곰곰']];
const BRAIN_KIND=['ox','order','count','tally','minority','secret','mc','match','scn','pledge','sort','hide'];
arcDefine({id:'democracy_brain',ch:'democracy',name:'민주 탐정 브레인',tag:'생각하는 퀴즈 퍼즐',from:'브레인 테스트 · 생각 퀴즈 게임',icon:'🧠',
  how:['한 단계에 여러 종류 생각 문제!','시간 안에 잘 읽고 풀어요','틀리면 하트가 줄어요'],
  init(G){
    const ci=G.trial?3:CI,n=5+Math.round(G.d*3),TL=28-12*G.d;
    let hearts=3,idx=0,cur=null,t=TL,flash=null;
    const fresh=(key,len)=>{try{S.brain=S.brain||{};let u=S.brain[key]||[];if(u.length>=len)u=[];const av=[...Array(len)].map((_,i)=>i).filter(i=>!u.includes(i));const i=G.pick(av);u.push(i);S.brain[key]=u;save();return i}catch(e){return G.ri(0,len-1)}};
    /* 지난번 단계 첫 문제와 다른 종류부터, 한 단계 안에서는 종류가 안 겹쳐요 */
    let kinds=G.shuffle(BRAIN_KIND.slice());try{const last=S.brainLast;if(last&&kinds[0]===last)kinds.push(kinds.shift());S.brainLast=kinds[0]}catch(e){}kinds=kinds.slice(0,n);
    const btn=(i,cnt,y0=150,h=62,gap=10)=>({x:20,y:y0+i*(h+gap),w:AW-40,h});
    const make=k=>{
      if(k==='ox'){const c=DB_OX[fresh('ox',DB_OX.length)];return {k,txt:'맞으면 ⭕, 틀리면 ❌',stmt:c[0],ans:!!c[1],x:c[2]}}
      if(k==='order'){const o=DB_ORDER[fresh('order',DB_ORDER.length)],items=o[1].slice(0,G.d<.3?4:5).map((s,i)=>({s,i}));return {k,txt:o[0],items:G.shuffle(items),next:0,x:'앞에서 할 일을 먼저 생각해 봐요.'}}
      if(k==='count'||k==='tally'){const m=G.d<.3?2:3,cs=G.shuffle(CANDI.slice()).slice(0,m);let votes;do{votes=cs.map(()=>G.ri(2,6+Math.round(G.d*6)))}while(new Set(votes).size<m);
        const max=Math.max(...votes),win=votes.indexOf(max),sorted=[...votes].sort((a,b)=>b-a),form=G.d<.3?0:G.ri(0,k==='tally'?3:2);let q,ans,opts;
        if(form===0){q=`누가 반장이 되었을까요? (다수결)`;ans=win;opts=cs.map((c,i)=>({l:`${c[0]} ${c[1]}`,v:i}))}
        else if(form===1){const p=G.ri(0,m-1);q=`${cs[p][0]} ${cs[p][1]} 후보는 몇 표일까요?`;ans=votes[p];opts=[...new Set([votes[p],votes[p]+1,Math.max(1,votes[p]-1),votes[p]+2])].slice(0,4).map(v=>({l:`${v}표`,v}))}
        else if(form===2){q='1등과 2등은 몇 표 차이일까요?';ans=sorted[0]-sorted[1];opts=[...new Set([ans,ans+1,ans+2,Math.max(1,ans-1)])].map(v=>({l:`${v}표`,v}))}
        else{const sum=votes.reduce((a,b)=>a+b,0);q='투표한 사람은 모두 몇 명일까요?';ans=sum;opts=[...new Set([sum,sum+1,sum-1,sum+2])].map(v=>({l:`${v}명`,v}))}
        return {k,txt:(k==='tally'?'📊 개표 결과 막대그래프! ':'🗳️ 개표! ')+q,cs,votes,ans,opts:G.shuffle(opts),list:G.shuffle(cs.flatMap((c,i)=>Array(votes[i]).fill(c[0])))}}
      if(k==='minority'){const T=G.pick([['🍎',['🍌','🍇','🍊'],'간식으로 모두 🍎를 원해요.'],['⚽',['🏸','🏀','🎾'],'체육 시간에 모두 ⚽를 하고 싶어요.'],['🏞️',['🏛️','🏖️','🎡'],'체험 학습으로 모두 🏞️에 가고 싶어요.'],['🎨',['🎵','📚','🧪'],'동아리로 모두 🎨를 하고 싶어요.']]);
        const m=G.ri(14,24),two=G.d>.5,pos=G.shuffle([...Array(m)].map((_,i)=>i)).slice(0,two?2:1);return {k,txt:`${T[2]} 그런데 다른 의견도 있어요! 소수 의견${two?' 2개를 모두':'을'} 찾아요.`,m,pos,found:[],main:T[0],odd:pos.map(()=>G.pick(T[1]))}}
      if(k==='secret'){const fold=G.d>.25&&Math.random()<.6;return {k,txt:fold?'비밀 투표! 커튼을 닫고, 투표지를 접어서 넣어요.':'비밀 투표! 투표지를 투표함에 넣어요. (누가 보고 있으면 안 돼요)',fold,folded:false,open:1,curtain:false,drag:null,bx:56,by:300,peek:G.pick(['👀','🧐','🙄'])}}
      if(k==='match'){const pr=G.shuffle(DB_MATCH.slice()).slice(0,G.d<.4?3:4);return {k,txt:'알맞은 짝을 이어요! 왼쪽을 누르고 오른쪽을 눌러요.',pr,right:G.shuffle(pr.map((_,i)=>i)),sel:null,done:[]}}
      if(k==='scn'){const s=DB_SCN[fresh('scn',DB_SCN.length)],o=G.shuffle([0,1,2]);return {k,txt:s[0],ord:o,ops:s[1],ans:0,x:`민주적인 방법: ${s[1][0]}`}}
      if(k==='pledge'){const silly=Math.random()<.5,base=G.shuffle(DB_PLEDGE.slice()).slice(0,3);let ops,ans;
        if(!silly){ops=[base[0][0],base[1][1],base[2][1]];ans=0}else{ops=[base[0][1],base[1][0],base[2][0]];ans=0}
        return {k,txt:silly?'🤪 지킬 수 없는 엉뚱한 공약은 무엇일까요?':'📣 반장이 정말 지킬 수 있는 공약은 무엇일까요?',ord:G.shuffle([0,1,2]),ops,ans,x:silly?'지킬 수 없는 약속으로 표를 얻으면 안 돼요.':'공약은 지킬 수 있는 약속이어야 해요.'}}
      if(k==='sort'){const s=DB_SORT[fresh('sort',DB_SORT.length)],cards=G.shuffle(s[2].slice()).slice(0,G.d<.4?4:6);return {k,txt:'카드를 알맞은 쪽으로! 왼쪽 · 오른쪽 상자를 눌러요.',L:s[0],R:s[1],cards,i:0}}
      if(k==='hide'){const h=DB_HIDE[fresh('hide',DB_HIDE.length)],objs=G.shuffle(DB_HIDE.map(x=>x[1]));return {k,txt:`투표함 열쇠를 찾아요! 단서: "${h[0]}"`,objs,key:h[1],tries:0}}
      const q=drawQ(ci);return {k:'mc',txt:q.q,q,ord:G.shuffle(q.o.map((_,i)=>i))}};
    const next=()=>{if(idx>=kinds.length)return G.win(starsByHearts(hearts));cur=make(kinds[idx]);t=TL};
    const right=()=>{G.sfx('ok');G.burst(AW/2,260,'#7FFFA0',20);G.addScore(20);flash={ok:1,t:.8};idx++;cur.done=1;setTimeout(()=>{if(!G.over)next()},800)};
    const wrong=why=>{hearts--;G.sfx('no');G.shake=6;flash={ok:0,t:1.6,why};cur.done=1;if(hearts<=0)return G.lose(why||'생각 문제를 너무 많이 틀렸어요.');idx++;setTimeout(()=>{if(!G.over)next()},1600)};
    next();
    const choiceBtns=(c,list,y0=150,h=62)=>list.forEach((l,i)=>{const b=btn(i,list.length,y0,h,h<60?8:10);G.rr(b.x,b.y+4,b.w,b.h,14,'#3A1F0C');G.rr(b.x,b.y,b.w,b.h,14,['#8A552B','#5A4AA0','#2F7A6A','#7A4A5A'][i%4],'#4E2C14',3);
      const L=wrapText(c,`${'가나다라'[i]}. ${l}`,b.w-24,18).slice(0,2);L.forEach((s,j)=>G.text(s,b.x+b.w/2,b.y+b.h/2+(j-(L.length-1)/2)*21,18,'#FFF'))});
    const hitBtn=(y,cnt,y0=150,h=62)=>{for(let i=0;i<cnt;i++){const b=btn(i,cnt,y0,h,h<60?8:10);if(y>b.y&&y<b.y+b.h)return i}return -1};
    return {
      boostText:'시간 +10초', boost(){t+=10},
      update(dt){if(flash){flash.t-=dt;if(flash.t<=0)flash=null}if(cur&&cur.k==='secret'){cur.open=G.lerp(cur.open,cur.curtain?0:1,Math.min(1,dt*6))}
        if(cur&&!cur.done){t-=dt;if(t<=0)wrong('시간이 다 됐어요!')}
        G.setHud(HEARTS(hearts),`🧠 ${Math.min(idx+1,kinds.length)}/${kinds.length}`,TIME(t))},
      draw(c){if(!cur)return;
        if(cur.k==='secret'){const im=v2img('vote_room.jpg');if(im)drawCover(c,im,0,0,AW,AH);else{c.fillStyle=G.grad(0,AH,'#F6E7C8','#C9A877');c.fillRect(0,0,AW,AH)}}
        const L=wrapText(c,cur.txt,AW-44,18).slice(0,4),hh=24+L.length*23;G.rr(10,10,AW-20,hh,14,'#FFF8E6','#6B3D1F',3);L.forEach((l,i)=>G.text(l,AW/2,22+11+i*23,18,'#3A240E','center',null));
        G.rr(16,hh+16,(AW-32)*Math.max(0,t/TL),7,3,'#FFD24A');const k=cur.k;
        if(k==='ox'){G.rr(20,150,AW-40,110,16,'#2A2244','#8A7AA8',3);wrapText(c,`“${cur.stmt}”`,AW-70,19).slice(0,4).forEach((l,i,a)=>G.text(l,AW/2,205+(i-(a.length-1)/2)*24,19));
          G.rr(30,290,140,140,24,'#3FB98A','#1F6B4A',4);G.text('⭕',100,360,64,'#FFF','center',null);G.rr(190,290,140,140,24,'#E2513A','#6B1F14',4);G.text('❌',260,360,64,'#FFF','center',null)}
        if(k==='order'){cur.items.forEach((it,i)=>{const b=btn(i,cur.items.length,150,58,10);G.rr(b.x,b.y,b.w,b.h,12,it.done?'#3FB98A':'#8A552B','#4E2C14',3);G.text(it.done?`${it.n}. ${it.s}`:it.s,AW/2,b.y+b.h/2,18,'#FFF')})}
        if(k==='count'){cur.list.forEach((e,i)=>G.emo(e,34+(i%9)*36,150+Math.floor(i/9)*38,30));choiceBtns(c,cur.opts.map(o=>o.l),150+Math.ceil(cur.list.length/9)*38+10,48)}
        if(k==='tally'){const mx=Math.max(...cur.votes),y0=150,bh=34;cur.cs.forEach((cd,i)=>{const y=y0+i*(bh+12);G.emo(cd[0],34,y+bh/2,30);G.rr(60,y,(AW-100)*cur.votes[i]/(mx+2),bh,8,['#FF7A8A','#7AB8FF','#FFC83A'][i]);
            for(let v=1;v<cur.votes[i];v++)G.rr(60+(AW-100)*v/(mx+2)-1,y+4,2,bh-8,1,'rgba(255,255,255,.5)')});
          const gy=y0+cur.cs.length*(bh+12)+4;G.text('칸 하나 = 1표',AW/2,gy,15,'#FFE9A8');choiceBtns(c,cur.opts.map(o=>o.l),gy+16,48)}
        if(k==='minority'){for(let i=0;i<cur.m;i++){const x=40+(i%6)*56,y=170+Math.floor(i/6)*66,oi=cur.pos.indexOf(i),f=cur.found.includes(i);if(f)G.circle(x,y-6,30,'rgba(127,255,160,.35)','#7FFFA0',3);G.emo('🙋',x,y,40);G.emo(oi>=0?cur.odd[oi]:cur.main,x+17,y-20,22)}}
        if(k==='secret'){const BX=243,BY=196,BW=112,BH=222,box={x:100,y:318,w:136,h:150},hasBg=!!v2img('vote_room.jpg');
          if(!hasBg){G.rr(BX-8,BY-14,BW+16,BH+20,8,'#7A4A22','#3A2410',3);G.rr(BX,BY,BW,BH,4,'#F2E2C2')}G.text('기표소',BX+BW/2,BY-14,16,'#FFF8E6','center','#3A2410');
          const cim=v2img('curtain.jpg'),open=cur.open;if(open<.98||!cur.curtain){const wgt=BW*(1-open*.8);c.save();c.beginPath();c.rect(BX,BY,BW,BH);c.clip();
            const half=wgt/2;for(const [x0,flip] of [[BX,false],[BX+BW-half,true]]){if(cim){c.save();c.translate(x0+(flip?half:0),BY);c.scale(flip?-1:1,1);c.drawImage(cim,0,0,cim.width/2,cim.height,0,0,half,BH);c.restore()}else{c.fillStyle='#B0283A';c.fillRect(x0,BY,half,BH)}}c.restore()}
          G.rr(BX-6,BY-8,BW+12,8,4,'#D9A441','#7A5410',2);
          if(!cur.curtain||open>.2){G.emo(cur.peek,BX-36,BY+30,40);G.text('누가 보고 있어요!',BX-40,BY+66,14,'#FFE27A','center','#3A2410')}
          if(!hasBg){G.rr(box.x,box.y,box.w,box.h,10,'rgba(220,240,255,.55)','#6A8AAA',3);G.rr(box.x+35,box.y-4,60,8,4,'#2A3A4A')}if(cur.drag)G.rr(box.x-4,box.y-4,box.w+8,box.h+8,12,null,'#FFE27A',4);G.text('투표함',box.x+box.w/2,box.y-10,16,'#FFF8E6','center','#3A2410');
          const d=cur.drag,px=d?d.x:cur.bx,py=d?d.y:cur.by,fh=cur.folded?26:52;G.rr(px-22,py-fh/2,44,fh,4,'#FFFFFF','#8A8A9A',2);if(!cur.folded){G.text('투표지',px,py-12,10,'#555','center',null);G.circle(px,py+8,7,null,'#E03A3A',2)}else G.rr(px-22,py-1,44,2,1,'#BBB');
          if(!d)G.text(cur.fold&&!cur.folded?'👆 투표지를 눌러 접고, 끌어서 넣어요':'👆 커튼을 눌러 닫고, 투표지를 끌어 넣어요',AW/2,AH-22,15,'#FFFFFF','center','#3A2410')}
        if(k==='match'){cur.pr.forEach((p,i)=>{const y=150+i*76,dn=cur.done.includes(i),sel=cur.sel===i;G.rr(14,y,140,64,12,dn?'#3FB98A':sel?'#E08A1A':'#5A4AA0','#2A1A4A',3);G.text(p[0],84,y+32,19,'#FFF')});
          cur.right.forEach((pi,j)=>{const y=150+j*76,dn=cur.done.includes(pi);G.rr(166,y,AW-180,64,12,dn?'#3FB98A':'#8A552B','#4E2C14',3);const L=wrapText(c,cur.pr[pi][1],AW-200,15).slice(0,2);L.forEach((s,q)=>G.text(s,166+(AW-180)/2,y+32+(q-(L.length-1)/2)*18,15,'#FFF'))})}
        if(k==='scn'||k==='pledge')choiceBtns(c,cur.ord.map(i=>cur.ops[i]),170);
        if(k==='sort'){const cd=cur.cards[cur.i];if(cd){G.rr(60,160,AW-120,90,18,'#FFF8E6','#D9A441',4);G.text(cd[0],AW/2,205,22,'#3A240E','center',null);G.text(`${cur.i+1} / ${cur.cards.length}`,AW/2,268,15,'#FFE9A8')}
          for(const [s,x] of [[cur.L,20],[cur.R,190]]){G.rr(x,300,150,150,20,'#5A4AA0','#2A1A4A',4);G.text(s[1],x+75,350,44,'#FFF','center',null);G.text(s[0],x+75,410,22,'#FFF')}}
        if(k==='hide'){cur.objs.forEach((o,i)=>{const x=70+(i%3)*110,y=210+Math.floor(i/3)*130;G.rr(x-46,y-46,92,92,18,'rgba(255,255,255,.12)','#8A7AA8',2);G.emo(o,x,y,58)});G.text(`남은 기회 ${2-cur.tries}번`,AW/2,AH-30,17,'#FFE9A8')}
        if(k==='mc')choiceBtns(c,cur.ord.map(i=>cur.q.o[i]),150);
        if(flash){G.rr(30,190,AW-60,130,20,flash.ok?'rgba(63,185,138,.96)':'rgba(226,81,58,.96)','#FFF',3);G.text(flash.ok?'딩동댕! 🧠':'앗!',AW/2,226,30,'#FFF');if(!flash.ok&&flash.why)wrapText(c,flash.why,AW-100,17).slice(0,3).forEach((l,i)=>G.text(l,AW/2,262+i*21,17,'#FFF'))}},
      down(x,y){if(!cur||cur.done||cur.k!=='secret')return;if(Math.abs(x-cur.bx)<30&&Math.abs(y-cur.by)<34)cur.drag={x,y,sx:x,sy:y}},
      move(x,y,dn){if(cur&&cur.drag&&dn){cur.drag.x=x;cur.drag.y=y}},
      up(x,y){if(!cur||cur.k!=='secret'||!cur.drag||cur.done)return;const d=cur.drag;cur.drag=null;
        if(Math.hypot(d.x-d.sx,d.y-d.sy)<10){if(cur.fold&&!cur.folded){cur.folded=true;G.sfx('tap')}return}
        if(d.x>96&&d.x<240&&d.y>300&&d.y<472){if(!cur.curtain)return wrong('누가 보고 있었어요! 비밀 선거는 커튼을 닫고 혼자 투표해요.');if(cur.fold&&!cur.folded)return wrong('투표지를 접어서 넣어야 누구를 뽑았는지 보이지 않아요.');right()}},
      tap(x,y){if(!cur||cur.done||flash)return;const k=cur.k;
        if(k==='ox'&&y>290&&y<430){const pick=x<AW/2;if(pick===cur.ans)right();else wrong(cur.x)}
        if(k==='order'){cur.items.forEach((it,i)=>{const b=btn(i,cur.items.length,150,58,10);if(it.done||y<b.y||y>b.y+b.h)return;if(it.i===cur.next){it.done=1;it.n=++cur.next;G.sfx('tap');if(cur.next>=cur.items.length)right()}else wrong(cur.x)})}
        if(k==='count'||k==='tally'){const y0=k==='count'?150+Math.ceil(cur.list.length/9)*38+10:150+cur.cs.length*46+4+16;const i=hitBtn(y,cur.opts.length,y0,48);if(i>=0){const v=cur.opts[i].v;if(v===cur.ans)right();else wrong(k==='count'||k==='tally'?`하나씩 차근차근 세어 봐요! 정답: ${cur.opts.find(o=>o.v===cur.ans).l}`:'')}}
        if(k==='minority'){for(let i=0;i<cur.m;i++){const ex=40+(i%6)*56,ey=170+Math.floor(i/6)*66;if(Math.hypot(x-ex,y-ey)<28){if(cur.pos.includes(i)){if(!cur.found.includes(i)){cur.found.push(i);G.sfx('pop');if(cur.found.length>=cur.pos.length)right()}}else wrong('같은 의견이에요. 다른 것을 원하는 친구를 찾아요!');return}}}
        if(k==='secret'&&x>236&&x<360&&y>180&&y<425&&!cur.curtain){cur.curtain=true;G.sfx('whoosh')}
        if(k==='match'){for(let i=0;i<cur.pr.length;i++){const yy=150+i*76;if(y>yy&&y<yy+64){if(x<160){if(!cur.done.includes(i)){cur.sel=i;G.sfx('tap')}}else if(cur.sel!=null){const pi=cur.right[i];if(pi===cur.sel){cur.done.push(pi);cur.sel=null;G.sfx('pop');if(cur.done.length>=cur.pr.length)right()}else wrong(`"${cur.pr[cur.sel][0]}"은(는) "${cur.pr[cur.sel][1]}"이에요.`)}return}}}
        if(k==='scn'||k==='pledge'){const i=hitBtn(y,3,170);if(i>=0){if(cur.ord[i]===cur.ans)right();else wrong(cur.x)}}
        if(k==='sort'&&y>300&&y<450){const cd=cur.cards[cur.i],side=x<AW/2?cur.L[0]:cur.R[0];if(cd[1]===side){cur.i++;G.sfx('pop');if(cur.i>=cur.cards.length)right()}else wrong(`"${cd[0]}"은(는) ${cd[1]}이에요.`)}
        if(k==='hide'){cur.objs.forEach((o,i)=>{const ox=70+(i%3)*110,oy=210+Math.floor(i/3)*130;if(Math.abs(x-ox)<46&&Math.abs(y-oy)<46){if(o===cur.key){G.emo('🔑',ox,oy,40);right()}else{cur.tries++;G.sfx('no');G.pop('없어요!',ox,oy-50,'#FF8A8A',18);if(cur.tries>=2)wrong('단서를 다시 읽어 봐요. 탐정은 단서를 꼼꼼히!')}}})}
        if(k==='mc'){const i=hitBtn(y,cur.ord.length,150);if(i>=0){if(cur.ord[i]===cur.q.a)right();else{if(!G.trial)wrongAdd(CI,cur.q);wrong(cur.q.x)}}}}
    }}});
