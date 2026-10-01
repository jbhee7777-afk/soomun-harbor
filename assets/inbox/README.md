# 그림 자동 가져오기 (asset inbox)

사용자는 Canva 링크에서 그림을 **다운로드만** 한다 (이름 그대로, 기본 다운로드 폴더).
이름 바꾸기·폴더 옮기기는 하지 않는다.

## 흐름

1. Claude 가 Canva 로 그림을 만들면 `manifest.json` 에 이번 묶음을 적는다.
   각 항목: 게임 안 이름(`target`), 종류(`kind`), Canva media id, **Canva 파일 이름**(`canvaName`, `get-assets` 의 `name`).
2. 사용자가 "다운로드했어"라고 하면 Claude 가 실행한다:
   ```
   powershell -ExecutionPolicy Bypass -File scripts/import-assets.ps1          # 미리 보기 (후보·계획만)
   powershell -ExecutionPolicy Bypass -File scripts/import-assets.ps1 -Apply   # 복사 → 후처리 → 테스트
   ```
3. 가져오기 규칙
   - 묶음을 만든 시각 이후 다운로드 폴더에 생긴 그림(JPG/PNG/WebP, 내용으로 판별)만 후보.
   - Canva 파일 이름으로 먼저 짝짓기 (다운로드 순서 무관, `" (1)"` 같은 꼬리 허용).
   - 이름으로 못 찾은 것은 새 그림 수가 정확히 같을 때만 다운로드 시간 순서로.
   - 애매하면 복사하지 않고 후보만 보여 준다 (종료 코드 2).
   - 원본은 **복사만**, 실제 형식의 확장자를 그대로, 다른 내용의 같은 이름 파일은 덮어쓰지 않음 (종료 코드 3, `-Force` 로만).
4. 후처리 (`scripts/process-assets.js`)
   | kind | 결과 |
   |---|---|
   | `isle` (+`index`) | 흰 배경 투명화 → `isle_<index>.webp` |
   | `isle_home` | → `isle_home.webp` |
   | `bg` (+`out`) | webp 변환 → `<out>.webp` |
   | `item-sheet` (+`zone`) | 4열×3줄 자동 분리 → `items/<zone>_00~11.webp` |
   | `npc` (+`zone`) | 흰 배경 투명화 → `npc_<zone>.webp` |

   그다음 `assets/art-manifest.js`(게임이 읽는 그림 목록·섬 클릭 영역)를 다시 만들고 `scripts/test-assets.js` 를 실행한다.

## manifest.json 예

```json
{
  "batch": "items-character-career-democracy",
  "createdAt": "2026-10-01T06:00:00.000Z",
  "status": "waiting",
  "items": [
    { "target": "items_character_src", "kind": "item-sheet", "zone": "character", "canvaMedia": "MAH…", "canvaName": "Aa…-Aa….jpg" }
  ]
}
```
상태: `waiting`(다운로드 기다림) → `imported`(복사됨) → `processed`(후처리·테스트 끝).
