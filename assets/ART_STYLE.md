# 소문 항구 탐정단 — 그림 자산 스타일 기준

기준(benchmark): `dungeon.html`의 던전 그림 (지하 1층 속삭이는 동굴, 지하 2층 심해의 봉인)과
던전 스프라이트(`hero.webp`, `gull.webp`, `chest.webp` 등).
모든 배경·장소 그림은 이 문서의 기준을 지켜서 같은 게임처럼 보이게 한다.

## 공통 스타일 기준

| 항목 | 기준 |
|---|---|
| 화풍 | 손으로 칠한 듯한 2D 디지털 일러스트, 동화책 질감. 벡터 도형·플랫 디자인·3D 렌더 금지 |
| 분위기 | 밝고 모험적인 어린이용 판타지. 너무 유아틱하지 않게 (과한 얼굴 그리기·파스텔 범벅 금지) |
| 시간·조명 | 해 질 녘(트와일라잇). 보라·분홍·주황 하늘 + 따뜻한 등불/창문 빛(금빛) + 차가운 그늘(남보라·청록) 대비 |
| 색감 | 던전과 같은 계열: 깊은 남색·보라 그늘, 금빛 하이라이트, 청록 마법 빛. 채도는 중상, 검은색 대신 짙은 남보라 |
| 시점 | 배경: 약간 높은 정면 시점(살짝 내려다봄), 앞·중간·먼 거리 3층 깊이감. 지도: 위에서 내려다본 시점 |
| 디테일 밀도 | 중심 장소는 촘촘하게, 가장자리·하늘은 단순하게 (HUD가 올라갈 위·아래 가장자리는 복잡하지 않게) |
| 대기 효과 | 옅은 안개, 떠다니는 빛 입자, 물 반사, 등불 번짐 |
| 금지 | 사람·캐릭터(주인공·갈매기는 따로 얹음), 글자·로고, 이모지 같은 아이콘, UI 모양 |
| 비율·크기 | 배경 16:9 (1920×1080 이상) → webp 로 저장. 장소 스프라이트는 투명 배경 PNG/webp |

## 화면별 자산

| 파일 | 화면 | 상태 |
|---|---|---|
| `hub_bg.webp` | 구역 허브 배경 (1680×944, 원본 `hub_bg_src.jpg`) | 적용됨 — 장소 좌표 `HOT.hubPainted` |
| `map_sea.webp` | 첫 지도 바다 (위에서 본 시점) | 적용됨 (1680×944, 세로 지도는 위아래로 이어 붙이고 번갈아 뒤집음) |
| `isle_0.webp` | 구역 섬: 안전·건강 (반짝 등대 보건소) | 적용됨 (1264×1264 → 흰 배경 투명화) |
| `isle_1.webp` ~ `isle_3.webp` | 구역 섬: 다정 꽃집 · 꿈틀 공방 · 고래 마을회관 | 적용됨 (1264×1264 → 흰 배경 투명화, 지도에서 280px 크기) |
| `isle_4.webp` ~ `isle_6.webp` | 구역 섬: 누구나 도서관 · 알록달록 세계 시장 · 평화 기차역 | 적용됨 (가장자리 여백 확인: isle_5 왼쪽 2px 은 물보라, isle_6 다리 끝 여백 32px) |
| `isle_7.webp` ~ `isle_9.webp` | 구역 섬: 해 뜨는 전망대 · 반짝 저금 시장 · 푸른 바닷가 | 적용됨 (여백: isle_7 깃발 끝 11px, isle_8 돔 위 48px, isle_9 날개 끝 32px · 오른쪽 물가 4px 접함) |
| `isle_home.webp` | 탐정단 항구 섬 (투명 배경) | 적용됨 (1264×1264 → 흰 배경 투명화, 벡터 소품은 숨김) |
| `npc_<구역id>.webp` | 주민 초상화 (투명 배경) | 계획 (아래 참고) |

게임 연결: `index.html` 의 `ART` 목록에 경로를 적으면 그 그림을 쓰고, 비어 있으면 코드로 그린 그림을 대신 쓴다.
장소를 누르는 위치는 `HOT.hub` (1680×944 좌표)에서 그림에 맞춰 조정한다.

## 생성 기록

### hub_bg (Canva 이미지 생성, LANDSCAPE_16_9, 2026-10-01)

프롬프트:

> Hand-painted 2D fantasy adventure game background for a children's game, wide panoramic scene of a cozy seaside harbor town at dusk, seen from a slightly elevated front view. Left side: tall red-and-white striped lighthouse with a glowing lamp on top of a grassy rocky cliff, small cottage beside it. Center-left foreground: wooden pier dock with stacked wooden crates, barrels, ropes and a moored small sailboat with cream sails. Center: waterfront town of colorful storybook houses with warm glowing windows, chimneys and strings of lanterns. Center-right: a large wooden market warehouse with wide open glowing doorway and colorful goods crates outside. Far right background: a dark misty cliff with a mysterious fairytale castle silhouette and a glowing purple cave entrance wrapped in swirling fog. Bottom right foreground: warm sandy beach with seashells and starfish, an empty clear sandy spot. Twilight sky in purple, pink and orange with a few stars, setting sun reflecting on calm sea water, soft drifting mist, warm lantern glow, magical floating light particles. Rich painterly texture, detailed storybook illustration, warm and cool lighting contrast, depth with foreground midground background layers. No people, no characters, no text, no letters.

장소 배치 의도 (허브의 놀이 입구):
- 왼쪽 절벽 등대 → 소문 퐁당
- 왼쪽 앞 부두(상자·통·돛배) → 항구 합치기
- 가운데 오른쪽 시장 창고 → 블록 퍼즐
- 오른쪽 아래 보물 해변(빈 모래밭에 보물상자 스프라이트를 얹음) → 소문 팡팡
- 먼 오른쪽 안개 동굴 성 → 소문 던전

### 2차 묶음 (2026-10-01): map_sea · isle_home · isle_0

공통: 텍스트만으로 생성(참조 그림 없음, 구도 복사 방지) + 아래 "꼬리말" 동일 사용.
섬은 흰 배경 위에 생성 → 원본을 받은 뒤 Chrome 캔버스로 바깥 흰색을 투명하게 만들어 webp 로 저장.

| 자산 | Canva media | 비율 | 프롬프트 핵심 |
|---|---|---|---|
| map_sea | MAHWu-n-Ajo | 16:9 | top-down calm open sea, indigo/navy/teal water, painted wave strokes, purple-pink sky reflections, golden glints, drifting mist banks, faint moonlight upper right, no islands/land/boats |
| isle_home | MAHWu8-sMeA | 1:1 | single small island, high three-quarter top-down view, plain white background; detective harbor town: striped lighthouse with glowing lamp, three storybook houses, wooden dock with crates and moored sailboat, lanterns, sandy shore, rocks, pines |
| isle_0 (안전·건강 · 반짝 등대 보건소) | MAHWu878XMs | 1:1 | 같은 섬 틀; white-walled clinic cottage with red tiled roof, small lighthouse-style lamp tower on its corner, white flag with simple red cross, bench, herb/flower garden, fence |

### 3차 묶음 (2026-10-01): isle_1 · isle_2 · isle_3

isle_0 에서 섬 뒤에 분홍 하늘이 조금 남았던 점을 막으려고 섬 틀에 "pure white · no sky/clouds/horizon · 넉넉한 흰 여백 · 잘림 없음" 문장을 추가했다.

| 자산 | Canva media | 장소 특징 (작게 보여도 구분되게) |
|---|---|---|
| isle_1 (인성 · 다정 꽃집) | MAHWvCWpO-w | 분홍 지붕 오두막, 문 위 꽃 아치, 꽃 가판대, 작은 유리 온실, 분홍·노랑·보라 꽃밭, 꽃 깃발 |
| isle_2 (진로 · 꿈틀 공방) | MAHWvIGyDpw | 톱니 지붕 나무·벽돌 공방, 연기 나는 굴뚝, 벽의 큰 황동 톱니, 물레방아, 바깥 작업대, 발명품 상자, 작은 장난감 로켓, 주황 톱니 깃발 |
| isle_3 (민주시민 · 고래 마을회관) | MAHWvC8onnw | 흰 돌기둥·넓은 계단·파란 지붕과 작은 종탑, 앞 광장의 고래 모양 분수, 게시판, 벤치, 가로등, 파란 깃발 |

### 4차 묶음 (2026-10-01): isle_4 · isle_5 · isle_6

3차와 같은 섬 틀(pure white · no sky/clouds/horizon · generous margin · nothing cropped) + 꼬리말.

| 자산 | Canva media | 장소 특징 (작게 보여도 구분되게) |
|---|---|---|
| isle_4 (인권 · 누구나 도서관) | MAHWvHuEGLY | 보라 지붕 돌·목조 도서관, 따뜻하게 빛나는 아치 창, 계단 옆 손잡이 달린 경사로(누구나 들어갈 수 있는 곳), 바깥 책장, 큰 나무 아래 벤치, 무지개 띠 현수막, 펼친 책 무늬 보라 깃발 |
| isle_5 (다문화 · 알록달록 세계 시장) | MAHWvLIH_NM | 여러 나라 느낌의 다양한 천막(줄무늬·무늬·돔·탑 모양), 여러 색 종이 등 줄, 김 나는 음식 가판대, 과일·향신료 바구니, 작은 둥근 축제 무대와 색색 깃발 줄, 청록 깃발, 야자수 |
| isle_6 (통일 · 평화 기차역) | MAHWvEA94n4 | 초록 지붕 역사와 작은 시계탑, 비둘기 풍향계, 가로등 플랫폼, 섬을 도는 철길이 돌 아치 다리로 바다 쪽까지 이어짐(이어지는 길 = 통일), 빨간 증기 기관차와 객차 2량, 하늘색 깃발 |

### 5차 묶음 (2026-10-01): isle_7 · isle_8 · isle_9

같은 섬 틀 + 꼬리말. 세 섬이 비슷해 보이지 않게 실루엣을 일부러 다르게 잡았다 (세로로 높은 바위 / 넓고 둥근 평지 / 낮고 넓은 모래 해변).

| 자산 | Canva media | 실루엣 · 랜드마크 |
|---|---|---|
| isle_7 (독도 · 해 뜨는 전망대) | MAHWvT_YIAw | 나란히 솟은 가파른 바위 봉우리 두 개(세로 실루엣), 높은 봉우리 꼭대기의 둥근 나무 전망대와 큰 황동 망원경, 작은 돌 망루, 바위에 새긴 밧줄 계단, 아래 작은 선착장, 빨강·흰 깃발 |
| isle_8 (경제·금융 · 반짝 저금 시장) | MAHWvevZ45M | 넓고 둥근 평지 섬, 빛나는 금색 돔의 크림색 저금 시장 건물, 광장의 커다란 금화 기념비, 저울·보물 단지 가판대, 분홍 돼지 저금통 분수, 금색 깃발 |
| isle_9 (환경 · 푸른 바닷가) | MAHWvdVR7vI | 낮고 넓은 흰 모래 해변 섬, 키 큰 흰 풍력 발전기(랜드마크), 태양광 지붕 오두막, 분리배출 통, 거북 모양 바위, 산호가 보이는 맑은 물, 초록 잎 깃발 |

섬 프롬프트 틀 (3차부터): "A single small island seen from a high three-quarter top-down view, isolated in the center on a pure plain flat white background, no sky, no clouds, no horizon, with generous empty white margin on all sides so the whole island, its shoreline, building and flag are fully visible and nothing is cropped. On the island stands [구역 건물·소품]. " + 꼬리말

## 주민 초상화 (painted style)

대표 3명 먼저 (2026-10-01, SQUARE_1_1, 흰 배경 → 자동 투명화 → `assets/npc_<구역id>.webp`):

| 주민 | Canva media | 설명 |
|---|---|---|
| npc_safety 하나 보건 선생님 | MAHWvnJicsg | 20대 후반, 단발 흑갈색 머리·빨간 십자 머리핀, 흰 가운·민트 블라우스·청진기, 작은 금색 등대 배지, 다정하고 믿음직한 미소 |
| npc_career 공방지기 도윤 | MAHWvsdS6YE | 30대 초, 헝클어진 밤색 머리 위 황동 고글, 뺨의 그을음, 겨자색 셔츠·가죽 작업 앞치마(연필·렌치), 주황 톱니 배지, 신난 웃음 |
| npc_unify 평화 역장 할아버지 | MAHWvg8NOI0 | 70대, 은백 머리·흰 콧수염·동그란 안경, 남색 역장 제복(금단추·하늘색 깃)과 금색 비둘기 모자, 은 회중시계 줄, 따뜻하고 그리운 미소 |

초상화 프롬프트 틀: "Hand-painted storybook bust portrait for a children's fantasy adventure game: [나이·외모·표정·의상·구역 소품]. Head and shoulders only, three-quarter view facing slightly left/right, the face is large and clearly readable, filling the upper two-thirds of the image, nothing cropped at the top of the head. Same art style as a painted storybook detective hero: soft clean painted shapes, gentle warm outlines, expressive eyes, cute but not babyish, natural proportions. Warm golden rim light and soft cool indigo shadows, rich painterly texture. Isolated on a pure plain flat white background, no scenery, no frame, no text, no letters." (SQUARE_1_1)

게임 연결: `personFace(ch,p)` — `ART.npc[구역id]`(대표 주민) · `ART.npc[구역id_1|_2]`(이웃 주민)가 있으면 그림, 없으면 `villagerSVG`. 허브 액자 · 이야기 대화 · 합치기 의뢰 카드 공통. 액자 배경은 던전 같은 밤빛 보라 그라데이션. 이웃 주민은 manifest 의 zone 을 `safety_1` 처럼 적으면 `npc_safety_1.webp` 로 등록된다.

### (예전 계획 메모)

지금 대화창의 주민 얼굴(`villagerSVG`)은 코드로 그린 벡터라 배경 그림과 결이 다르다. 섬 묶음이 끝난 뒤 진행:

1. 대상: 구역마다 대표 주민(`CH[i].npc`) 10명 먼저 → 필요하면 이웃 주민(`villagers`) 20명.
2. 형식: 정사각 1:1, 가슴 위 반신 초상, 정면 3/4, 단색 배경(흰색) → 배경 투명화 → `assets/npc_<구역id>.webp` (예: `npc_safety.webp`).
3. 프롬프트 틀: "Hand-painted storybook bust portrait of [이름·직업·나이·옷 설명], friendly expression, three-quarter view, warm golden rim light and cool indigo shadow, plain flat white background, rich painterly texture, children's fantasy adventure game character art, same style as a painted harbor town at twilight. No text." — 던전 스프라이트(hero, gull)와 같은 그림체가 되도록 "cute but not babyish, clean painted shapes" 를 덧붙임.
4. 게임 연결: `ART.npc[구역id]` 가 있으면 대화창 액자에 그림을, 없으면 지금의 `villagerSVG` 를 그대로 사용 (허브·합치기 의뢰·이야기 대화 공통).

## 나머지 그림용 프롬프트 틀

모든 프롬프트 끝에 아래 꼬리말을 붙여 톤을 맞춘다:

> …Twilight lighting with purple, pink and orange sky tones, warm golden lantern and window glow against cool indigo and teal shadows, soft drifting mist, magical floating light particles. Rich painterly texture, detailed hand-painted storybook illustration for a children's fantasy adventure game, bright and adventurous but not babyish. No people, no characters, no text, no letters.

- 지도 바다: "top-down view of a calm twilight sea for a fantasy adventure map, gentle waves, moonlight reflections, drifting fog banks, no islands, …" + 꼬리말
- 구역 섬: "single small island seen from a high three-quarter top-down view, isolated on a plain white background, with [구역 건물 설명] on it, sandy shore, rocks, small trees, …" + 꼬리말 → Canva 배경 제거로 투명화

## 지도 배치 메모 (2026-10-01)

그림 섬 7개부터는 1680×960 한 화면에 겹치지 않게 넣기 어려워 가로 지도도 세 줄 · 위아래 스크롤로 바꿨다 (MXL 1680×1340, 섬 280px). 그림 섬 클릭 영역은 그림의 투명 모서리가 아닌 섬 모양 타원(.mxhit). 검사: 이름표↔다른 섬 클릭 영역·클릭 영역끼리 겹침 없음, 그림 섬 건물·물가 실제 클릭 (1280×720 · 1920×1080 · 휴대폰).

10개 구역 섬 모두 그림으로 교체 완료 (2026-10-01). 겹침·클릭 검사: 3개 화면 크기 × 10섬 × 건물/물가 = 60번 실제 클릭 모두 정상.

## Stage B · 항구 합치기 (2026-10-01)

### merge_bg (Canva MAHWvbY3RKU, LANDSCAPE_16_9)

해 질 녘 항구 창고 작업장 실내, 약간 높은 정면 시점. 가운데 앞쪽 큰 나무 작업대(윗면 가운데는 비워 둠 → 합치기 판이 올라감), 왼쪽 벽 코르크 게시판(비어 있음 → 주민 의뢰), 뒤쪽 상자·통 선반, 큰 아치 창으로 해 질 녘 항구와 먼 등대 불빛, 천장 기름 등불. 꼬리말 동일.

게임 연결: `ART.merge_bg` 등록 시 합치기 화면 배경으로 사용(없으면 어두운 나무색). 판은 작업대 위 나무 상자판(황동 모서리·홈 칸)으로 그림과 어울리게.

### 물건 그림 (구역별 묶음 그림 → 자동 분리)

구역마다 12개(만드는 상자 2 + 사슬 2개 × 5단계)를 4열×3줄 흰 배경 한 장으로 생성 → 흰 배경 위 덩어리를 자동으로 잘라 `assets/items/<구역id>_<번호>.webp` 로 저장. 10장이면 120개 전부.
배치 순서: 1줄 = 상자0, 사슬0 1~3단계 / 2줄 = 사슬0 4~5단계, 상자1, 사슬1 1단계 / 3줄 = 사슬1 2~5단계.

| 묶음 | Canva media | 상태 |
|---|---|---|
| items_safety (안전·건강) | MAHWvQCBtvY | 적용됨 — 자동 분리 12개 → assets/items/safety_00~11.webp (256×256) |
| items_character (인성 · 다정 꽃집) | MAHWvl1px3c | 적용됨 — 자동 분리 12개 (화분 상자, 씨앗, 새싹, 튤립, 해바라기, 꽃다발 / 하트 우체통, 연필, 쪽지, 하트 편지, 선물 상자, 하트 고리) |
| items_career (진로 · 꿈틀 공방) | MAHWvn7iChc | 적용됨 — 자동 분리 12개 (서랍장, 크레용, 공책, 책 더미, 학사모, 트로피 / 발명 기계, 볼트, 렌치, 장난감 로봇, 로켓, 인공위성) |
| items_democracy (민주시민 · 고래 마을회관) | MAHWvtO_zrM | 적용됨 — 자동 분리 12개 (서류 상자, 의견 쪽지, 클립보드, 투표함, 약속 두루마리, 마을회관 / 신문 가판대, 신문, 돋보기, 막대그래프, 확성기, 방송탑) |
| items_rights (인권 · 누구나 도서관) | MAHWvhhI318 | 적용됨 — 자동 분리 12개 (책 상자, 종이, 펼친 책, 깃펜·잉크, 학교, 무지개 / 보금자리 오두막, 빵, 사과, 집, 하트 방패, 올리브 화환 비둘기) |
| items_multi (다문화 · 알록달록 세계 시장) | MAHWvvs-E8A | 적용됨 — 자동 분리 12개 (시장 부엌, 밥, 주먹밥, 쌀국수, 커리, 잔치 케이크 / 축제 천막, 인사 카드, 말풍선, 북과 음표, 팔레트, 등불 축제) |
| items_unify (통일 · 평화 기차역) | MAHWvpOCO2A | 적용됨 — 자동 분리 12개 (매표소, 기차표, 여행 가방, 객차, 기관차, 고속 열차 / 우체통, 편지, 사진기, 고향 그림 액자, 악수 조각상, 평화 비둘기) |
| items_dokdo (독도 · 해 뜨는 전망대) | MAHWvkFEW_Y | 적용됨 — 자동 분리 12개 (고깃배, 조개, 게, 물고기, 문어, 강치 / 기록 보관장, 나침반, 옛 바다 지도, 옛 기록책, 망원경, 두 바위섬) |
| items_money (경제·금융 · 반짝 저금 시장) | MAHWvhJhvqU | 적용됨 — 자동 분리 12개 (돈 주머니, 금화, 지폐 묶음, 돼지 저금통, 은행, 보석 / 장바구니 가방, 영수증, 용돈 기입장, 수레, 가게, 큰 시장) |
| items_eco (환경 · 푸른 바닷가) | MAHWvgwzvbY | 적용됨 — 자동 분리 12개 (분리배출 통, 캔, 플라스틱 컵, 재활용 묶음, 에코백, 푸른 지구 / 새싹 양동이, 새싹, 풀, 나무, 작은 숲, 산호 바다 방울) |

묶음 프롬프트 틀: "Game item icon sprite sheet: twelve separate small objects arranged in a neat grid of 4 columns and 3 rows on a pure plain flat white background, each object isolated with generous empty white space around it, no overlapping, nothing cropped, all objects the same size and seen from the same slight three-quarter top-down view. Row 1, left to right: … Row 2 … Row 3 … Hand-painted storybook game item art, rich painterly texture, warm golden rim light and soft cool indigo shadows, cute but not babyish, consistent style for a children's fantasy adventure game. No people, no characters, no text, no letters, no numbers, no labels." (LANDSCAPE_4_3)
