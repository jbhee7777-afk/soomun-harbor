/* 그림 자산 후처리: 가져온 원본(*_src.*) → 게임용 webp · 그림 목록(assets/art-manifest.js) · 테스트
   node scripts/process-assets.js [--assets <폴더>] [--manifest <파일>] [--no-test] [--only-manifest]

   manifest 의 items[].kind
     isle       : 흰 배경 투명화 → isle_<index>.webp            (구역 섬)
     isle_home  : 흰 배경 투명화 → isle_home.webp
     bg         : webp 변환       → <out>.webp                   (hub_bg · map_sea · merge_bg …)
     item-sheet : 4열×3줄 묶음 → items/<zone>_00~11.webp      (합치기 물건)
     npc        : 흰 배경 투명화 → npc_<zone>.webp              (주민 초상화)
   마지막에 assets 폴더를 훑어 art-manifest.js 를 다시 만들고(그림 등록 · 섬 클릭 영역 크기), scripts/test-assets.js 로 확인해요. */
const fs=require('fs'),path=require('path');
const {chromium}=require('playwright-core');
const arg=k=>{const i=process.argv.indexOf(k);return i>0?process.argv[i+1]:null};
const ROOT=path.resolve(__dirname,'..');
const A=path.resolve(arg('--assets')||path.join(ROOT,'assets'));
const MAN=arg('--manifest')||path.join(A,'inbox','manifest.json');
const CHROME=process.env.CHROME_PATH||['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(f=>fs.existsSync(f));

/* ---------- 브라우저 캔버스로 하는 그림 작업 ---------- */
const PAGE_FNS=`
window.loadImg=async d=>{const i=new Image();i.src=d;await i.decode();const c=document.createElement('canvas');c.width=i.naturalWidth;c.height=i.naturalHeight;const x=c.getContext('2d');x.drawImage(i,0,0);return {c,x,W:c.width,H:c.height}};
/* 가장자리(와 seeds)에서 이어진 흰색만 투명하게, 경계는 부드럽게 */
window.clearWhite=(x,W,H,seeds,strict)=>{const id=x.getImageData(0,0,W,H),a=id.data;
  const white=i=>{const r=a[i],g=a[i+1],b=a[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);return strict?(mn>222&&mx-mn<26):(mn>196&&mx-mn<34)};
  const seen=new Uint8Array(W*H),st=seeds.slice();for(let X=0;X<W;X++)st.push(X,(H-1)*W+X);for(let Y=0;Y<H;Y++)st.push(Y*W,Y*W+W-1);
  while(st.length){const k=st.pop();if(seen[k])continue;if(!white(k*4))continue;seen[k]=1;a[k*4+3]=0;const X=k%W,Y=(k/W)|0;if(X>0)st.push(k-1);if(X<W-1)st.push(k+1);if(Y>0)st.push(k-W);if(Y<H-1)st.push(k+W)}
  for(let k=0;k<W*H;k++){if(seen[k])continue;const X=k%W,Y=(k/W)|0;if((X>0&&seen[k-1])||(X<W-1&&seen[k+1])||(Y>0&&seen[k-W])||(Y<H-1&&seen[k+W])){const i=k*4,l=(a[i]+a[i+1]+a[i+2])/3;a[i+3]=Math.max(40,Math.min(255,(255-l)*4))}}
  x.putImageData(id,0,0);let cl=0;for(let k=0;k<W*H;k++)cl+=seen[k];return cl/(W*H)};
window.bbox=(x,W,H)=>{const a=x.getImageData(0,0,W,H).data;let l=W,t=H,r=-1,b=-1;for(let y=0;y<H;y++)for(let X=0;X<W;X++)if(a[(y*W+X)*4+3]>40){if(X<l)l=X;if(X>r)r=X;if(y<t)t=y;if(y>b)b=y}
  return {l,t,r,b,margin:{left:l,top:t,right:W-1-r,bottom:H-1-b}}};
`;
async function withPage(fn){if(!CHROME)throw new Error('Chrome 을 찾지 못했어요 (CHROME_PATH 로 지정 가능)');
  const b=await chromium.launch({executablePath:CHROME});try{const p=await b.newPage();await p.addInitScript(PAGE_FNS);await p.goto('about:blank');await p.evaluate(PAGE_FNS);return await fn(p)}finally{await b.close()}}
const dataUrl=f=>{const b=fs.readFileSync(f);const t=b[0]===0x89?'image/png':b.toString('ascii',8,12)==='WEBP'?'image/webp':'image/jpeg';return `data:${t};base64,`+b.toString('base64')};
const writeUrl=(f,u)=>{fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,Buffer.from(u.split(',')[1],'base64'))};
const srcOf=target=>{const f=fs.readdirSync(A).find(n=>path.parse(n).name===target&&/\.(jpe?g|png|webp)$/i.test(n));return f?path.join(A,f):null};

async function toWebp(p,src,dst,q=.86){const r=await p.evaluate(async([d,q])=>{const {c,W,H}=await loadImg(d);return {W,H,u:c.toDataURL('image/webp',q)}},[dataUrl(src),q]);writeUrl(dst,r.u);return `${r.W}×${r.H}`}
async function cutout(p,src,dst){const r=await p.evaluate(async d=>{const {c,x,W,H}=await loadImg(d);const cl=clearWhite(x,W,H,[],true);const bb=bbox(x,W,H);return {W,H,cl,bb,u:c.toDataURL('image/webp',.88)}},dataUrl(src));
  writeUrl(dst,r.u);const m=r.bb.margin;const warn=Object.entries(m).filter(([,v])=>v<8).map(([k,v])=>`${k} ${v}px`);
  return `${r.W}×${r.H} · 투명 ${(r.cl*100|0)}% · 여백 위${m.top} 아래${m.bottom} 왼${m.left} 오${m.right}${warn.length?' · ⚠ 가장자리에 닿음('+warn.join(', ')+') 확인 필요':''}`}
async function splitSheet(p,src,dir,prefix){const outs=await p.evaluate(async d=>{const {c,x,W,H}=await loadImg(d);
    const seeds=[];for(let cx=1;cx<4;cx++){const X=Math.round(cx*W/4);for(let Y=0;Y<H;Y++)seeds.push(Y*W+X)}for(let cy=1;cy<3;cy++){const Y=Math.round(cy*H/3);for(let X=0;X<W;X++)seeds.push(Y*W+X)}
    clearWhite(x,W,H,seeds,false);const id=x.getImageData(0,0,W,H),a=id.data,outs=[],S=256,pad=10;
    for(let r=0;r<3;r++)for(let q=0;q<4;q++){const x0=Math.round(q*W/4),x1=Math.round((q+1)*W/4),y0=Math.round(r*H/3),y1=Math.round((r+1)*H/3),cw=x1-x0,ch=y1-y0;
      const lab=new Int32Array(cw*ch).fill(-1),comps=[];
      for(let Y=0;Y<ch;Y++)for(let X=0;X<cw;X++){const k=Y*cw+X;if(lab[k]>=0||a[((Y+y0)*W+X+x0)*4+3]<=40)continue;const idn=comps.length,st=[k];lab[k]=idn;let n=0,edge=false;
        while(st.length){const m=st.pop();n++;const mx=m%cw,my=(m/cw)|0;if(mx===0||my===0||mx===cw-1||my===ch-1)edge=true;
          for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=mx+dx,ny=my+dy;if(nx<0||ny<0||nx>=cw||ny>=ch)continue;const nk=ny*cw+nx;if(lab[nk]<0&&a[((ny+y0)*W+nx+x0)*4+3]>40){lab[nk]=idn;st.push(nk)}}}
        comps.push({n,edge})}
      const big=Math.max(0,...comps.map(c=>c.n)),keep=comps.map(c=>!c.edge?c.n>=big*.004:c.n===big);
      for(let Y=0;Y<ch;Y++)for(let X=0;X<cw;X++){const L=lab[Y*cw+X];if(L>=0&&!keep[L])a[((Y+y0)*W+X+x0)*4+3]=0}
      x.putImageData(id,0,0);let l=x1,t=y1,rr=x0-1,bt=y0-1;for(let Y=y0;Y<y1;Y++)for(let X=x0;X<x1;X++)if(a[(Y*W+X)*4+3]>40){if(X<l)l=X;if(X>rr)rr=X;if(Y<t)t=Y;if(Y>bt)bt=Y}
      if(rr<l){outs.push(null);continue}
      const w=rr-l+1,h=bt-t+1,sc=(S-pad*2)/Math.max(w,h),o=document.createElement('canvas');o.width=o.height=S;const ox=o.getContext('2d');ox.imageSmoothingQuality='high';
      ox.drawImage(c,l,t,w,h,(S-w*sc)/2,(S-h*sc)/2,w*sc,h*sc);outs.push({u:o.toDataURL('image/webp',.9),w,h,area:comps.length?big:0})}
    return outs},dataUrl(src));
  const msg=[];outs.forEach((o,k)=>{const f=path.join(dir,`${prefix}_${String(k).padStart(2,'0')}.webp`);if(!o){msg.push(`${k}: ⚠ 비어 있음`);return}writeUrl(f,o.u)});
  const empty=outs.filter(o=>!o).length;return `물건 ${12-empty}/12개${empty?' · ⚠ 빈 칸 '+empty+'개':''}`}

/* ---------- 그림 목록 다시 만들기 (게임이 읽는 assets/art-manifest.js) ---------- */
async function buildArtManifest(p){
  const has=n=>fs.existsSync(path.join(A,n));const rel=n=>'assets/'+n;
  const isles=[...Array(10)].map((_,i)=>has(`isle_${i}.webp`)?rel(`isle_${i}.webp`):null);
  /* 섬 그림의 실제 영역(0~1) → 클릭 타원 크기 */
  const isleBox=[];for(let i=0;i<10;i++){if(!isles[i]){isleBox.push(null);continue}
    const r=await p.evaluate(async d=>{const {x,W,H}=await loadImg(d);const b=bbox(x,W,H);return [b.l/W,b.t/H,(b.r+1)/W,(b.b+1)/H].map(v=>+v.toFixed(3))},dataUrl(path.join(A,`isle_${i}.webp`)));isleBox.push(r)}
  const items={};const idir=path.join(A,'items');if(fs.existsSync(idir)){const fsn=fs.readdirSync(idir);const zones=new Set(fsn.map(n=>(n.match(/^([a-z]+)_\d\d\.webp$/)||[])[1]).filter(Boolean));
    zones.forEach(z=>{if([...Array(12)].every((_,k)=>fsn.includes(`${z}_${String(k).padStart(2,'0')}.webp`)))items[z]=true})}
  const npc={};fs.readdirSync(A).forEach(n=>{const m=n.match(/^npc_([a-z]+)\.webp$/);if(m)npc[m[1]]=rel(n)});
  const ART={hub_bg:has('hub_bg.webp')?rel('hub_bg.webp'):null,map_sea:has('map_sea.webp')?rel('map_sea.webp'):null,merge_bg:has('merge_bg.webp')?rel('merge_bg.webp'):null,
    isle_home:has('isle_home.webp')?rel('isle_home.webp'):null,isles,isleBox,items,npc};
  const js=`/* 자동 생성 파일 — scripts/process-assets.js 가 assets 폴더를 훑어서 만들어요. 손으로 고치지 마세요.\n   게임(index.html)은 이 목록에 있는 그림만 쓰고, 없는 것은 코드로 그린 그림을 대신 써요. */\nwindow.ART_FILES=${JSON.stringify(ART,null,1)};\n`;
  fs.writeFileSync(path.join(A,'art-manifest.js'),js);
  return `그림 목록: 섬 ${isles.filter(Boolean).length}/10 · 물건 구역 ${Object.keys(items).length} (${Object.keys(items).join(', ')||'-'}) · 주민 ${Object.keys(npc).length} · 배경 ${['hub_bg','map_sea','merge_bg'].filter(k=>ART[k]).join(', ')}`;
}

(async()=>{
  const man=fs.existsSync(MAN)?JSON.parse(fs.readFileSync(MAN,'utf8')):{items:[]};
  const todo=process.argv.includes('--only-manifest')?[]:(man.items||[]);
  const report=[];let fail=0;
  await withPage(async p=>{
    for(const it of todo){const src=srcOf(it.target);if(!src){report.push(`⚠ ${it.target}: 원본이 assets 에 없어요 (아직 가져오지 않음)`);fail++;continue}
      try{let r;
        if(it.kind==='isle')r=await cutout(p,src,path.join(A,`isle_${it.index}.webp`));
        else if(it.kind==='isle_home')r=await cutout(p,src,path.join(A,'isle_home.webp'));
        else if(it.kind==='npc')r=await cutout(p,src,path.join(A,`npc_${it.zone}.webp`));
        else if(it.kind==='bg')r=await toWebp(p,src,path.join(A,`${it.out}.webp`));
        else if(it.kind==='item-sheet')r=await splitSheet(p,src,path.join(A,'items'),it.zone);
        else {report.push(`⚠ ${it.target}: 모르는 종류 ${it.kind}`);fail++;continue}
        report.push(`✓ ${it.target} (${it.kind}) → ${r}`)}catch(e){report.push(`✗ ${it.target}: ${e.message}`);fail++}}
    report.push(await buildArtManifest(p));
  });
  if(todo.length&&!fail&&fs.existsSync(MAN)){man.status='processed';man.processedAt=new Date().toISOString();fs.writeFileSync(MAN,JSON.stringify(man,null,2))}
  console.log(report.join('\n'));
  if(fail){console.log(`\n처리하지 못한 항목 ${fail}개 — 테스트는 건너뛰어요.`);process.exit(4)}
  if(process.argv.includes('--no-test'))return;
  console.log('\n테스트 실행...');
  const {spawnSync}=require('child_process');const t=spawnSync(process.execPath,[path.join(__dirname,'test-assets.js'),'--assets',A],{stdio:'inherit'});
  process.exit(t.status);
})().catch(e=>{console.error(e);process.exit(1)});
