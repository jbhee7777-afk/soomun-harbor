/* 그림 자산 확인 테스트 (process-assets.js 가 끝에 자동 실행)
   node scripts/test-assets.js [--assets <폴더>]
   - 등록된 그림이 모두 열리는지 (404·깨짐 없음, 콘솔 오류 없음)
   - 지도: 그림 섬 수 · 이름표↔다른 섬 클릭 영역 · 클릭 영역끼리 겹침 없음 (데스크톱 1280×720 · 휴대폰)
   - 지도: 그림 섬마다 실제로 눌러서 그 구역 허브가 열리는지 (데스크톱 · 휴대폰 터치)
   - 허브 배경 · 합치기 물건 그림(구역별)이 실제 화면에 쓰이는지 */
const fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require('playwright-core');
const arg=k=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:null};
const ROOT=path.resolve(__dirname,'..'), A=path.resolve(arg('--assets')||path.join(ROOT,'assets'));
const CHROME=process.env.CHROME_PATH||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(f=>fs.existsSync(f));
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.json':'application/json'};
const srv=http.createServer((q,r)=>{let u=decodeURIComponent(q.url.split('?')[0].split('#')[0]);if(u==='/')u='/index.html';if(u==='/favicon.ico'){r.writeHead(204);return r.end()}
  const f=u.startsWith('/assets/')?path.join(A,u.slice(8)):path.join(ROOT,u);fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end()}r.writeHead(200,{'content-type':TYPES[path.extname(f)]||'application/octet-stream'});r.end(d)})});
const R=[];const ok=(n,c,i='')=>{R.push([c?'PASS':'FAIL',n,i]);console.log((c?'  ✓ ':'  ✗ ')+n+(c?'':' — '+i))};
const IDS=['safety','character','career','democracy','rights','multi','unify','dokdo','money','eco'];
(async()=>{
  await new Promise(r=>srv.listen(0,r));const URL=`http://localhost:${srv.address().port}/`;
  const b=await chromium.launch({executablePath:CHROME});const errs=[];
  const seed={v:2,energy:50,last:Date.now(),coins:20,sound:false,grade:3,tut:{hub:true,merge:true,match:true,drop:true,block:true},ch:Object.fromEntries(IDS.map(id=>[id,{intro:true,guess:'yes',step:0,stars:0}]))};
  const open=async o=>{const c=await b.newContext(o);const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});p.on('response',r=>{if(r.status()>=400)errs.push('http '+r.status()+' '+r.url())});
    await p.goto(URL);await p.evaluate(s=>localStorage.setItem('soomun-harbor-v2',JSON.stringify(s)),seed);await p.reload();await p.waitForTimeout(700);return {c,p}};
  /* 1) 등록된 그림 전부 열기 */
  let {c,p}=await open({viewport:{width:1280,height:720}});
  const art=await p.evaluate(()=>ART);
  const list=[art.hub_bg,art.map_sea,art.merge_bg,art.isle_home,...(art.isles||[]),...Object.values(art.npc||{}),'assets/chest.webp','assets/hero.webp','assets/gull.webp',
    ...Object.keys(art.items||{}).flatMap(z=>[...Array(12)].map((_,k)=>`assets/items/${z}_${String(k).padStart(2,'0')}.webp`))].filter(Boolean);
  const bad=await p.evaluate(async L=>{const out=[];for(const s of L){try{const i=new Image();i.src=s;await i.decode();if(!i.naturalWidth)out.push(s)}catch(e){out.push(s)}}return out},list);
  ok(`등록된 그림 ${list.length}개가 모두 열려요`,bad.length===0,bad.join(', '));
  /* 2) 지도 겹침 (데스크톱) */
  const geo=async q=>q.evaluate(()=>{const sc=$('#mxScroll');const R=e=>{const r=e.getBoundingClientRect();return {l:r.left,t:r.top+sc.scrollTop,r:r.right,b:r.bottom+sc.scrollTop}};
    return $$('.mxz').map(z=>({i:+z.dataset.i,tag:R(z.querySelector('.tagbg')),hit:R(z.querySelector('.mxhit')||z.querySelector('ellipse[fill="transparent"]')),painted:!!z.querySelector('.mxhit')}))});
  const X=(a,b)=>Math.max(0,Math.min(a.r,b.r)-Math.max(a.l,b.l))*Math.max(0,Math.min(a.b,b.b)-Math.max(a.t,b.t));
  const overlaps=G=>{const o=[];for(const A_ of G)for(const B of G){if(A_.i===B.i)continue;if(X(A_.tag,B.hit)>40)o.push(`이름표${A_.i}∩섬${B.i}`);if(A_.i<B.i&&X(A_.hit,B.hit)>40)o.push(`섬${A_.i}∩섬${B.i}`)}return o};
  let G=await geo(p);const painted=G.filter(g=>g.painted).length;
  ok(`지도 그림 섬 ${painted}개 (등록 ${(art.isles||[]).filter(Boolean).length}개)`,painted===(art.isles||[]).filter(Boolean).length);
  let ov=overlaps(G);ok('데스크톱 지도: 이름표·클릭 영역 겹침 없음',ov.length===0,ov.join(' '));
  const hud=await p.evaluate(()=>$('.hxquest').getBoundingClientRect().bottom);ok('데스크톱 지도: HUD 아래에 가린 이름표 없음',G.every(g=>g.tag.t>=hud-4),'');
  /* 3) 허브 · 합치기 */
  await p.evaluate(()=>goHub(0));await p.waitForTimeout(400);
  if(art.hub_bg)ok('허브에 그림 배경이 쓰여요',await p.evaluate(s=>!!$(`.hxworld image[href="${s}"]`),art.hub_bg));
  for(const z of Object.keys(art.items||{})){const zi=IDS.indexOf(z);if(zi<0)continue;
    const r=await p.evaluate(zi=>{goHub(zi);closeModal();openMerge();const t=$$('#board .tok');return {all:t.length,mgt:$$('#board .tok.mgt').length}},zi);await p.waitForTimeout(300);
    ok(`합치기 [${z}] 판의 물건이 모두 그림이에요`,r.all>0&&r.all===r.mgt,JSON.stringify(r))}
  await c.close();
  /* 4) 그림 섬 실제 누르기: 데스크톱 · 휴대폰 */
  for(const [w,h,mob,name] of [[1280,720,0,'데스크톱'],[390,844,1,'휴대폰']]){
    const fails=[];for(const g of G.filter(g=>g.painted)){const cc=await b.newContext({viewport:{width:w,height:h},isMobile:!!mob,hasTouch:!!mob});const q=await cc.newPage();q.on('pageerror',e=>errs.push(e.message));
      await q.goto(URL);await q.evaluate(s=>localStorage.setItem('soomun-harbor-v2',JSON.stringify(s)),seed);await q.reload();await q.waitForTimeout(400);
      if(mob&&g===G.find(x=>x.painted)){const og=overlaps(await geo(q));if(og.length)fails.push('휴대폰 겹침 '+og.join(' '))}
      await q.evaluate(i=>$('.mxz[data-i="'+i+'"]').scrollIntoView({block:'center'}),g.i);await q.waitForTimeout(150);
      for(const part of [.35,.84]){const pt=await q.evaluate(([i,f])=>{const r=$('.mxz[data-i="'+i+'"] .mxb image').getBoundingClientRect();return {x:r.left+r.width*.5,y:r.top+r.height*f}},[g.i,part]);
        if(mob)await q.touchscreen.tap(pt.x,pt.y);else await q.mouse.click(pt.x,pt.y);await q.waitForTimeout(350);
        if(!await q.evaluate(i=>SCREEN==='hub'&&CI===i,g.i))fails.push(`섬${g.i}(${part<.5?'건물':'물가'})`);
        await q.evaluate(()=>{closeModal();goMap(true)});await q.waitForTimeout(150);await q.evaluate(i=>$('.mxz[data-i="'+i+'"]').scrollIntoView({block:'center'}),g.i);await q.waitForTimeout(100)}
      await cc.close()}
    ok(`${name}: 그림 섬 ${G.filter(g=>g.painted).length}개 건물·물가를 누르면 그 구역이 열려요`,fails.length===0,fails.join(', '))}
  ok('콘솔·페이지·네트워크 오류 없음',errs.length===0,[...new Set(errs)].join(' | '));
  await b.close();srv.close();
  const f=R.filter(r=>r[0]==='FAIL').length;console.log(`\n테스트 ${R.length-f}/${R.length} 통과`);process.exit(f?5:0);
})().catch(e=>{console.error(e);process.exit(1)});
