/* ===== 섬마다 놀이 3가지 (순서 = 허브 장소 순서) =====
   고퀄 놀이 4가지(팡팡 · 블록 · 퐁당 · 합치기)는 예전 화면 그대로 쓰고, 단계마다 목표를 바꿔요 (arcPlayExt · EXT). */
const ISLE_SET={
  safety:['safety_match','safety_run','safety_cross'],
  character:['character_merge','character_crowd','character_rhythm'],
  career:['career_block','career_wordle','career_helix'],
  democracy:['democracy_bus','democracy_arrows','democracy_brain'],
  rights:['rights_triple','rights_flow','rights_diff'],
  multi:['multi_slice','multi_hexa','multi_sort'],
  unify:['unify_drop','unify_screw','unify_cbj'],
  dokdo:['dokdo_fish','dokdo_slide','dokdo_snakeio'],
  money:['money_mart','money_apple','money_pin'],
  eco:['eco_hole','eco_bubble','eco_ballblast']
};
const round50=v=>Math.round(v/50)*50;
arcDefine({id:'safety_match',ch:'safety',name:'구급상자 팡팡',tag:'3매치 퍼즐',from:'애니팡 · 캔디크러쉬 · 로열 매치',icon:'🧰',
  how:['옆 칸과 바꿔 같은 그림 3개를 한 줄로 맞추면 팡! 4개는 줄 폭탄, ㄱ·ㅗ 모양 5개는 소용돌이!','정해진 이동 횟수 안에 목표 점수를 넘겨요. 세 번째 목표를 넘기면 바로 성공!','보너스 퀴즈 병을 풀면 이동 3번과 ⭐을 더 받아요.'],
  ext:{kind:'match',cfg:(d)=>{const goals=[1000,2200,3600].map(x=>round50(x*(1+d*1.5))),moves=24-Math.round(d*9);return {goals,moves,goalText:`🎯 이동 ${moves}번 안에 ${goals[0].toLocaleString()}점 넘기기!`}}}});
arcDefine({id:'character_merge',ch:'character',name:'다정 꽃집 머지',tag:'합치기 · 의뢰',from:'가십 하버 · 머지 맨션 (머지-2)',icon:'💐',
  how:['같은 물건 두 개를 끌어서 겹치면 한 단계 높은 물건으로 합쳐져요.','위쪽 주민 의뢰에 필요한 물건을 만들어 "전달"을 눌러요.','이번 단계의 의뢰를 모두 해내면 성공! 빨리 해낼수록 별이 많아요.'],
  ext:{kind:'merge',cfg:(d)=>{const orders=2+Math.round(d*7);return {orders,goalText:`💌 주민 의뢰 ${orders}개를 해결해요!`}}}});
arcDefine({id:'career_block',ch:'career',name:'꿈 공방 블록',tag:'블록 퍼즐',from:'블록 블라스트 (Block Blast)',icon:'🧩',
  how:['아래 블록을 끌어 판에 놓아요. 가로·세로 줄을 꽉 채우면 펑!','여러 줄을 한 번에, 연속으로 없애면 점수가 쑥쑥.','놓을 곳이 없으면 끝! 목표 점수를 넘기면 성공, 세 번째 목표면 바로 성공!'],
  ext:{kind:'block',cfg:(d)=>{const goals=[250,550,900].map(x=>round50(x*(1+d*2.4)));return {goals,goalText:`🎯 목표 ${goals.map(g=>g.toLocaleString()).join(' · ')}점`}}}});
arcDefine({id:'unify_drop',ch:'unify',name:'평화 퐁당',tag:'떨어뜨려 합치기',from:'수박 게임 (Suika Game)',icon:'🍉',
  how:['항아리 위를 끌어 자리를 고르고 손을 떼면 퐁당!','똑같은 친구 둘이 닿으면 더 큰 친구로 합체! 점선 위로 넘치면 끝.','목표 점수를 넘기면 성공, 세 번째 목표면 바로 성공!'],
  ext:{kind:'drop',cfg:(d)=>{const goals=[400,1000,2000].map(x=>round50(x*(1+d*2)));return {goals,goalText:`🎯 목표 ${goals.map(g=>g.toLocaleString()).join(' · ')}점`}}}});
