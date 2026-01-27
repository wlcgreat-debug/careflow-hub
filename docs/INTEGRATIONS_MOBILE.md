# CareFlow Agent Hub - 외부 연동 & 모바일

---

## 외부 도구 연동 목록

### ✅ 연동할 것

| 도구 | 용도 | 연동 에이전트 | 우선순위 |
|-----|------|-------------|---------|
| **Google Calendar** | 일정 동기화 | 일정비서 📅 | 🔴 높음 |
| **Google Drive** | 문서/자료 저장 | 전체 | 🔴 높음 |
| **Notion** | 프로젝트/지식 관리 | 아키텍트 🏛️ | 🔴 높음 |
| **YouTube API** | 채널 분석, 댓글 수집 | 유튜브팀 전체 | 🔴 높음 |
| **YouTube Studio** | 업로드, 썸네일 적용 | 영상PD 🎥, 썸네일 🖼️ | 🟠 중간 |
| **Gmail** | 메일 요약, 알림 | 일정비서 📅 | 🟠 중간 |
| **Slack/Discord** | 알림 전송 | 전체 | 🟠 중간 |
| **Figma** | 디자인 협업 | 디자이너 🎯, 프론트 🎨 | 🟡 낮음 |
| **GitHub** | 코드 관리 | 백엔드 ⚙️, 프론트 🎨 | 🟡 낮음 |
| **나노바나나프로** | 이미지 생성 | 썸네일 🖼️, 숏츠 📱 | 🔴 높음 |
| **Whisper API** | 영상 전사 | 영상PD 🎥 | 🔴 높음 |

### ❌ 연동 안 함 (보안)

| 도구 | 이유 |
|-----|------|
| 환자 관리 시스템 | 민감 정보, 별도 보안 필요 |
| 의료 기록 DB | HIPAA/개인정보 이슈 |
| 결제 시스템 | 금융 정보 보안 |

---

## 연동 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                 CareFlow Agent Hub                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  Integration Layer                   │   │
│  │                                                      │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐            │   │
│  │  │ Google   │ │ YouTube  │ │ Notion   │            │   │
│  │  │ Suite    │ │ API      │ │ API      │            │   │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘            │   │
│  │       │            │            │                   │   │
│  │  ┌────┴────────────┴────────────┴────┐             │   │
│  │  │        Unified API Gateway         │             │   │
│  │  │   (인증, 레이트리밋, 로깅)          │             │   │
│  │  └────────────────┬───────────────────┘             │   │
│  │                   │                                  │   │
│  └───────────────────┼──────────────────────────────────┘   │
│                      │                                      │
│                      ▼                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Agent Layer                        │   │
│  │                                                      │   │
│  │   📅 ←→ Calendar    🎬 ←→ YouTube    🏛️ ←→ Notion   │   │
│  │   🖼️ ←→ 나노바나나   🎥 ←→ Whisper    ⚙️ ←→ GitHub   │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 주요 연동 상세

### 1. Google Calendar 연동

```python
class CalendarIntegration:
    """Google Calendar 연동"""
    
    async def get_today_events(self) -> list[Event]:
        """오늘 일정 가져오기"""
        
    async def get_week_events(self) -> list[Event]:
        """이번 주 일정"""
        
    async def create_event(self, event: Event) -> str:
        """일정 추가"""
        
    async def update_event(self, event_id: str, updates: dict):
        """일정 수정"""
        
    async def find_free_slots(self, duration: int, days: int = 7) -> list[TimeSlot]:
        """빈 시간 찾기"""
```

**일정비서 활용 예시:**
```
세영님: "다음 주 미팅 잡아줘"

일정비서: "다음 주 빈 시간 확인했어요.

📅 가능한 시간:
- 월요일 14:00-16:00
- 수요일 10:00-12:00
- 금요일 15:00-17:00

어떤 시간이 좋으세요?
상대방 이메일 주시면 캘린더 초대 보내드릴게요."
```

### 2. YouTube API 연동

```python
class YouTubeIntegration:
    """YouTube API 연동"""
    
    # 분석
    async def get_channel_stats(self, channel_id: str) -> ChannelStats:
        """채널 통계"""
        
    async def get_video_analytics(self, video_id: str) -> VideoAnalytics:
        """영상별 분석"""
        
    async def get_comments(self, video_id: str, max_results: int = 100) -> list[Comment]:
        """댓글 수집"""
        
    async def get_search_suggestions(self, keyword: str) -> list[str]:
        """연관 검색어"""
        
    # 업로드 (YouTube Studio API)
    async def upload_video(self, video: VideoUpload) -> str:
        """영상 업로드"""
        
    async def set_thumbnail(self, video_id: str, thumbnail_path: str):
        """썸네일 설정"""
        
    async def update_metadata(self, video_id: str, metadata: VideoMetadata):
        """제목/설명/태그 수정"""
```

**유튜브팀 활용 예시:**
```
[주간 자동 리포트]

유튜브 총괄PD: "이번 주 채널 리포트입니다.

📊 치중진담
- 구독자: 10,234 (+127)
- 조회수: 45,678 (+12%)
- 최고 영상: "허리 통증 운동" (CTR 8.2%)

📊 CareFlow  
- 구독자: 3,456 (+89)
- 조회수: 12,345 (+8%)
- 최고 영상: "아침 스트레칭 루틴" (CTR 6.5%)

💡 인사이트:
- 치중진담: "~하면 안 되는" 제목이 CTR 높음
- CareFlow: 루틴 영상이 시청 지속시간 김

다음 주 콘텐츠 제안:
1. "허리 아플 때 하면 안 되는 운동 TOP 5"
2. "저녁 5분 스트레칭 루틴"
"
```

### 3. Notion 연동

```python
class NotionIntegration:
    """Notion API 연동"""
    
    # 데이터베이스
    async def query_database(self, db_id: str, filters: dict) -> list[Page]:
        """DB 쿼리"""
        
    async def create_page(self, parent_id: str, properties: dict) -> str:
        """페이지 생성"""
        
    async def update_page(self, page_id: str, properties: dict):
        """페이지 수정"""
        
    # 프로젝트 관리
    async def get_project_status(self, project_name: str) -> ProjectStatus:
        """프로젝트 현황"""
        
    async def update_task_status(self, task_id: str, status: str):
        """태스크 상태 변경"""
```

**장기 기억 저장소로 활용:**
```
┌─────────────────────────────────────────────────────────────┐
│  📚 CareFlow Knowledge Base (Notion)                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  📂 프로젝트                                                 │
│  ├── CareFlow 2.0                                          │
│  │   ├── 결정 로그                                          │
│  │   ├── 회의록                                             │
│  │   └── 마일스톤                                           │
│  └── 유튜브 콘텐츠                                          │
│      ├── 콘텐츠 캘린더                                      │
│      └── 성과 분석                                          │
│                                                             │
│  📂 학습된 규칙                                              │
│  ├── 글쓰기 스타일                                          │
│  ├── 썸네일 패턴                                            │
│  └── 코드 컨벤션                                            │
│                                                             │
│  📂 지식 베이스                                              │
│  ├── CareFlow 이론                                         │
│  ├── 브랜드 가이드라인                                      │
│  └── FAQ                                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4. 나노바나나프로 연동

```python
class NanoBananaProIntegration:
    """나노바나나프로 이미지 생성 연동"""
    
    async def generate_thumbnail(
        self,
        prompt: str,
        style: str,  # "치중진담", "CareFlow"
        reference_images: list[str] = None,  # 참고 이미지
    ) -> GeneratedImage:
        """썸네일 이미지 생성"""
        
    async def generate_variations(
        self,
        base_image: str,
        count: int = 3,
    ) -> list[GeneratedImage]:
        """변형 이미지 생성 (A/B 테스트용)"""
        
    async def apply_brand_style(
        self,
        image: str,
        channel: str,
    ) -> GeneratedImage:
        """브랜드 스타일 적용"""
```

---

## 📱 모바일 앱 (PWA)

### PWA란?

```
Progressive Web App
= 웹사이트인데 앱처럼 동작

장점:
✅ 앱스토어 심사 불필요
✅ 홈 화면에 추가 가능
✅ 푸시 알림 가능
✅ 오프라인 지원
✅ 웹과 코드 공유 (개발 비용 ↓)

단점:
❌ iOS에서 일부 기능 제한
❌ 네이티브보다 성능 약간 ↓
❌ 앱스토어 노출 안 됨
```

### PWA 기능 목록

| 기능 | 지원 | 설명 |
|-----|------|------|
| 홈 화면 추가 | ✅ | 앱 아이콘처럼 |
| 푸시 알림 | ✅ | 승인 요청, 완료 알림 |
| 오프라인 | ⚠️ | 읽기만 가능 |
| 카메라 | ✅ | 문서 스캔 등 |
| 파일 업로드 | ✅ | |
| 백그라운드 동기화 | ⚠️ | iOS 제한적 |

### 모바일 UI 설계

```
┌─────────────────────────────────────────┐
│ ≡  CareFlow Hub            🔔 3        │
├─────────────────────────────────────────┤
│                                         │
│  🔴 승인 대기 (2)                        │
│  ┌─────────────────────────────────┐   │
│  │ 🖼️ 썸네일 시안 검토               │   │
│  │    10분 전 · 썸네일 디자이너       │   │
│  │    [승인] [수정요청]              │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ ✍️ 칼럼 초안 검토                 │   │
│  │    30분 전 · 글쓰기 AI            │   │
│  │    [보기] [나중에]                │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📋 진행 중 (3)                         │
│  ┌─────────────────────────────────┐   │
│  │ 🎬 영상 전사 중... 60%           │   │
│  │ 💻 버그 수정 중... 완료 예정 2시간 │   │
│  │ 📱 숏츠 기획 중... 대기           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📅 오늘 일정                           │
│  • 14:00 유튜브 촬영                    │
│  • 16:00 팀 미팅                        │
│                                         │
├─────────────────────────────────────────┤
│  🏠      💬      ➕      📋      👤    │
│  홈     채팅    새요청   작업    설정   │
└─────────────────────────────────────────┘
```

### 빠른 액션 (모바일 최적화)

```
[새 요청 버튼 누르면]

┌─────────────────────────────────────────┐
│                                         │
│  ⚡ 빠른 요청                            │
│                                         │
│  ┌─────────┐  ┌─────────┐              │
│  │ 🎬      │  │ 🖼️      │              │
│  │ 영상    │  │ 썸네일   │              │
│  │ 분석    │  │ 제작    │              │
│  └─────────┘  └─────────┘              │
│                                         │
│  ┌─────────┐  ┌─────────┐              │
│  │ ✍️      │  │ 📅      │              │
│  │ 칼럼    │  │ 일정    │              │
│  │ 작성    │  │ 확인    │              │
│  └─────────┘  └─────────┘              │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🎤 음성으로 요청하기              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ✏️ 직접 입력                      │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### 알림 시스템

```python
class MobileNotification(BaseModel):
    title: str
    body: str
    icon: str  # 에이전트 이모지
    
    priority: Literal["low", "normal", "high", "urgent"]
    
    action_type: Literal["view", "approve", "respond"]
    action_url: str
    
    # 빠른 액션 버튼
    actions: list[NotificationAction] = []

class NotificationAction(BaseModel):
    label: str  # "승인", "거절", "나중에"
    action: str  # "approve", "reject", "snooze"

# 예시
notification = MobileNotification(
    title="🖼️ 썸네일 검토 요청",
    body="'허리 통증 운동' 영상 썸네일 3종",
    icon="🖼️",
    priority="high",
    action_type="approve",
    action_url="/review/thumb_001",
    actions=[
        NotificationAction(label="✅ 승인", action="approve"),
        NotificationAction(label="✏️ 수정요청", action="request_edit"),
        NotificationAction(label="⏰ 나중에", action="snooze_1h"),
    ]
)
```

### PWA 구현 기술 스택

```
프론트엔드:
- React 18 (이미 사용 중)
- Workbox (Service Worker 관리)
- Web Push API (푸시 알림)

백엔드 추가:
- Web Push 서버 (FCM 또는 자체)
- 알림 스케줄러

필요한 파일:
- manifest.json (앱 메타데이터)
- service-worker.js (오프라인, 캐싱)
- push-handler.js (푸시 알림)
```

### manifest.json 예시

```json
{
  "name": "CareFlow Agent Hub",
  "short_name": "CareFlow",
  "description": "AI 에이전트 협업 플랫폼",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1f2937",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 개발 로드맵 (수정)

### Phase 1: MVP (4주)
- [x] 기본 에이전트 13개
- [x] 채팅방 시스템
- [ ] 에스컬레이션 시스템
- [ ] 우선순위 시스템
- [ ] 기본 워크플로우 3개

### Phase 2: 핵심 시스템 (4주)
- [ ] 피드백 학습
- [ ] 충돌 해결
- [ ] PWA 변환 (모바일)
- [ ] 푸시 알림

### Phase 3: 외부 연동 (4주)
- [ ] Google Calendar
- [ ] YouTube API
- [ ] Notion
- [ ] 나노바나나프로

### Phase 4: 장기 기억 (2주)
- [ ] 메모리 시스템
- [ ] RAG 검색
- [ ] 자동 메모리 생성

### Phase 5: 고도화 (ongoing)
- [ ] 추가 워크플로우
- [ ] 성능 최적화
- [ ] 음성 인터페이스

---

## 예상 비용 (월간, 수정)

| 항목 | 비용 |
|-----|------|
| Claude API (Sonnet) | $100-300 |
| 호스팅 (Vercel/Railway) | $20-50 |
| DB (Supabase) | $25 |
| YouTube API | 무료 (쿼터 내) |
| Google APIs | 무료 (쿼터 내) |
| Notion API | 무료 |
| 나노바나나프로 | ? (기존 사용 중) |
| 푸시 알림 (FCM) | 무료 |
| **총합** | **$145-375** |

---

## 세영님께 질문

1. **외부 도구** 중 가장 먼저 연동했으면 하는 것?
   (제 추천: Google Calendar → YouTube API)

2. **모바일에서 가장 많이 할 것 같은 작업**?
   (승인/거절? 간단한 지시? 결과 확인?)

3. **Notion** 이미 쓰고 계세요? 아니면 다른 도구?
