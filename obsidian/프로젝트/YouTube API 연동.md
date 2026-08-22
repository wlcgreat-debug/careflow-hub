---
tags:
  - careflow/infra
  - api
type: 인프라-노트
updated: 2026-08-19
---

# YouTube API 연동

치중진담 채널 데이터 분석용 YouTube Data API v3 연동 기록. (→ [[2026-08-19 치중진담 마케팅 세션]])

## 키 정보

- Google Cloud 프로젝트 `content-youtube`, 키 이름 **"치중진담 API"** (2026-08-15 생성)
- API 제한: Service Usage API, YouTube Analytics API, YouTube Data API v3
- 애플리케이션 제한: 없음 (원격 세션 IP를 특정할 수 없어 IP 제한 걸면 안 됨)
- 키 값은 절대 저장소·노트에 기록하지 않는다. 유출 시 Google Cloud → 사용자 인증 정보 → "키 순환".

## 환경변수 상태 (2026-08-19 기준)

- Claude Code 환경변수 `YOUTUBE_API_KEY`로 관리.
- ⚠️ 사용자가 변수 저장 과정에서 **"YOUTUBE_API_KEY"라는 이름의 별도 환경**(env_013WXr3BDgbHw6kf1AN1fTfX)을 생성함. Default 환경(env_01YcCtuMZBs8gdSrYhcLJJ9d)에는 변수 없음.
- 정리 필요: Default 환경 설정의 Environment variables 란에 `YOUTUBE_API_KEY=AIza...` 형식으로 추가하고, 별도 환경은 삭제해도 됨. 위치: claude.ai/code → 입력창 위 구름(☁) 아이콘 → 환경의 ⚙ → Environment variables.
- 환경변수는 **컨테이너 시작 시 주입** → 저장 후 새 세션부터 적용.

## 세션 네트워크 제약

- 원격 세션에서 youtube.com, blog.naver.com, tistory.com **직접 접근 차단** (egress 정책 403).
- **googleapis.com은 허용** → API 경유로만 유튜브 데이터 조회 가능.
- 유튜브 커뮤니티 게시판 글은 Data API 미지원 → 게시글 분석은 스크린샷/수동 입력 필요.

## 데이터 수집 방법 (재사용 레시피)

새 세션에서 "치중진담 쇼츠 분석해줘"라고 하면 아래 절차:

1. `search?part=snippet&type=channel&q=치중진담` → channelId ("치료에 대한 진실된 이야기. 치중진담")
2. `channels?part=snippet,statistics,contentDetails&id=...` → uploads 재생목록 ID
3. `playlistItems?part=contentDetails&playlistId=...&maxResults=50` (nextPageToken 순회) → 전체 videoId
4. `videos?part=snippet,statistics,contentDetails&id=...` (50개 배치) → 제목·게시일·길이·조회수·좋아요·댓글수
5. 결과: `marketing/data/youtube_channel_stats.json` (브랜치 `claude/ai-exposure-geo-strategy-iudc00`)
6. 쇼츠 판별: duration ≤ 3분 또는 제목/설명 #shorts

curl 사용 시 `--cacert /root/.ccr/ca-bundle.crt` 필수.

## 수집 이력

- 2026-08-19 1차: 실패 (Default 환경에 변수 미주입) → `marketing/data/youtube_fetch_error.txt`
- 2026-08-19 2차: "YOUTUBE_API_KEY" 환경에서 재시도 → 결과 대기
