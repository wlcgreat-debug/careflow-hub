# CareFlow Agent Hub - 멀티 에이전트 협업 시스템

## 시스템 개요

13개의 전문 AI 에이전트가 "단톡방" 형태로 협업하는 플랫폼

```
┌─────────────────────────────────────────────────────────────────┐
│                    CareFlow Agent Hub                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 글쓰기AI │  │ 기능재활 │  │ 백엔드   │  │ 프론트   │       │
│  │ Writer   │  │ Rehab    │  │ Backend  │  │ Frontend │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
│       │             │             │             │              │
│  ┌────┴─────────────┴─────────────┴─────────────┴────┐        │
│  │              Message Router (채팅방 관리)          │        │
│  └────┬─────────────┬─────────────┬─────────────┬────┘        │
│       │             │             │             │              │
│  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐       │
│  │ 아키텍트 │  │ UI디자인 │  │ 유튜브PD │  │ 영상PD   │       │
│  │ Architect│  │ Designer │  │ YT-Chief │  │ YT-Video │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ 숏츠PD   │  │ 댓글관리 │  │ AI연동   │  │ 일정비서 │       │
│  │ Shorts   │  │ Comments │  │ AILink   │  │ Schedule │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                │
│  ┌──────────┐                                                  │
│  │ 썸네일   │  ← NEW!                                          │
│  │Thumbnail │                                                  │
│  └──────────┘                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 에이전트 정의

### 1. Writer (글쓰기 AI)
- **역할**: 세영님의 스타일로 글 작성
- **지식**: 세영님의 글쓰기 패턴, 톤, 어휘
- **협업**: Rehab AI와 칼럼/댓글 답변 작성

### 2. Rehab (기능재활 전문가)
- **역할**: CareFlow 기능재활운동 지식 보유
- **지식**: DNS, IAP, 기능적 움직임, 운동처방
- **협업**: 모든 에이전트에 전문 지식 제공

### 3. Backend (백엔드 개발자)
- **역할**: 서버, API, 데이터베이스 개발
- **기술**: Python, FastAPI, PostgreSQL
- **협업**: Rehab + Frontend와 기능 구현

### 4. Frontend (프론트엔드 개발자)
- **역할**: 사용자 인터페이스 구현
- **기술**: React, TypeScript, TailwindCSS
- **협업**: Designer + Backend와 UI 구현

### 5. Architect (총괄 아키텍트)
- **역할**: 전체 시스템 설계 및 조율
- **권한**: 채팅방 생성, 업무 할당, 의사결정
- **협업**: 모든 에이전트 조율

### 6. Designer (UI/UX 디자이너)
- **역할**: 직관적이고 아름다운 UI 설계
- **산출물**: 와이어프레임, 디자인 시스템
- **협업**: Frontend + Architect

### 7. YT-Chief (유튜브 총괄 PD)
- **역할**: 치중진담/CareFlow 콘텐츠 기획
- **업무**: 키워드 리서치, 기획안 작성
- **협업**: 모든 유튜브 관련 에이전트 총괄

### 8. YT-Video (영상 PD)
- **역할**: 영상 분석, 제목/해시태그 추천
- **업무**: 전사, AI 학습 데이터 정리
- **협업**: YT-Chief + AILink

### 9. Shorts (숏츠 PD)
- **역할**: 숏폼 콘텐츠 기획 및 제작
- **업무**: 전사 기반 숏츠 컷, 이미지 생성
- **협업**: YT-Video + Designer

### 10. Comments (댓글 관리자)
- **역할**: 구독자 댓글 분석 및 정리
- **업무**: 콘텐츠 아이디어 발굴
- **협업**: YT-Chief에 기획안 제안

### 11. AILink (CareFlow AI 연동)
- **역할**: CareFlow AI 프로그램 연동
- **업무**: 운동 자료 분석, 개선사항 도출
- **협업**: Backend + Rehab

### 12. Schedule (일정 비서)
- **역할**: 세영님의 개인 비서
- **업무**: 일정, To-do, 운동, 메일 관리
- **특징**: 개별 알림, 리마인더

### 13. Thumbnail (썸네일 디자이너) ← NEW!
- **역할**: 일관된 브랜드 썸네일 제작
- **도구**: 나노 바나나 프로 (Nano Banana Pro)
- **업무**: 썸네일 제작, 포트폴리오 관리, A/B 테스트
- **협업**: YT-Chief, YT-Video, Shorts와 긴밀히 협업

---

## 채팅방 시스템

### 채팅방 유형

```typescript
enum RoomType {
  MAIN_LOBBY = 'main',      // 전체 에이전트 모임
  PROJECT = 'project',       // 프로젝트별 채팅방
  PAIR = 'pair',            // 1:1 협업
  USER_DIRECT = 'direct',   // 세영님과 직접 대화
}
```

### 예시 채팅방

| 채팅방 이름 | 참여자 | 목적 |
|------------|--------|------|
| 🏠 로비 | 전체 | 공지, 전체 회의 |
| ✍️ 칼럼 작성실 | Writer, Rehab | 칼럼/답변 작성 |
| 💻 개발실 | Backend, Frontend, Architect, Designer | 프로그램 개발 |
| 🎬 영상 기획실 | YT-Chief, YT-Video, Shorts, Comments, Thumbnail | 유튜브 콘텐츠 |
| 🖼️ 썸네일 작업실 | Thumbnail, YT-Chief, YT-Video, Shorts | 썸네일 제작 |
| 🔗 AI 연구소 | AILink, Rehab, Backend | CareFlow AI 개선 |
| 📅 세영님 개인방 | Schedule (+ 필요시 다른 에이전트) | 일정/업무 관리 |

---

## 기술 스택

### Backend
```
- Python 3.11+
- FastAPI (REST API + WebSocket)
- LangGraph (에이전트 오케스트레이션)
- Anthropic Claude API (각 에이전트의 두뇌)
- PostgreSQL (대화 기록, 상태 저장)
- Redis (실시간 메시지 큐)
```

### Frontend
```
- React 18 + TypeScript
- TailwindCSS
- Socket.io (실시간 채팅)
- Zustand (상태 관리)
```

### Infrastructure
```
- Docker Compose (개발)
- Railway / Vercel (배포)
```

---

## 핵심 데이터 모델

```python
class Agent(BaseModel):
    id: str
    name: str
    role: str
    system_prompt: str
    knowledge_base: list[str]  # RAG용 문서 경로
    can_create_rooms: bool
    
class ChatRoom(BaseModel):
    id: str
    name: str
    type: RoomType
    participants: list[str]  # agent_ids
    created_by: str
    messages: list[Message]
    
class Message(BaseModel):
    id: str
    room_id: str
    sender_id: str  # agent_id or 'user'
    content: str
    attachments: list[Attachment]
    timestamp: datetime
    
class Task(BaseModel):
    id: str
    assigned_to: list[str]
    room_id: str
    description: str
    status: Literal['pending', 'in_progress', 'completed']
    result: Optional[str]
```

---

## 메시지 흐름

```
1. 사용자 입력
   ↓
2. Router가 메시지 분석
   ↓
3. 적절한 채팅방/에이전트로 라우팅
   ↓
4. 에이전트(들)이 응답 생성
   ↓
5. 필요시 다른 에이전트 호출 (@멘션)
   ↓
6. 결과를 채팅방에 공유
   ↓
7. 사용자에게 알림
```

---

## MVP 구현 우선순위

### Phase 1: 기본 프레임워크 (1-2주)
- [ ] 에이전트 시스템 프롬프트 설계
- [ ] 기본 채팅 UI (로비 + 개인방)
- [ ] 메시지 라우팅 로직
- [ ] 3-4개 핵심 에이전트 구현

### Phase 2: 협업 기능 (2-3주)
- [ ] 동적 채팅방 생성
- [ ] @멘션으로 에이전트 호출
- [ ] 작업 결과 공유 시스템
- [ ] 파일 첨부 기능

### Phase 3: 전문화 (3-4주)
- [ ] 각 에이전트 지식베이스 구축 (RAG)
- [ ] CareFlow AI 연동
- [ ] 일정 관리 시스템 연동
- [ ] 유튜브 API 연동

### Phase 4: 고도화 (4주+)
- [ ] 에이전트 자율 협업
- [ ] 학습 및 개선 시스템
- [ ] 모바일 앱

---

## 예상 비용 (월간)

| 항목 | 비용 |
|-----|------|
| Claude API (Sonnet) | $50-200 |
| 호스팅 (Railway) | $20-50 |
| DB (Supabase/Neon) | $0-25 |
| **총합** | **$70-275** |

---

## 다음 단계

1. ✅ 아키텍처 설계 (현재 문서)
2. 🔲 프로토타입 UI 구현
3. 🔲 핵심 에이전트 3-4개 구현
4. 🔲 채팅방 시스템 구현
5. 🔲 지식베이스 구축
