# CareFlow Agent Hub - Claude Code 실행 가이드

## 📁 프로젝트 구조

```
careflow-agent-hub/
├── docs/                          # 설계 문서
│   ├── ARCHITECTURE.md            # 시스템 아키텍처
│   ├── CORE_PRINCIPLES.md         # 4가지 핵심 원칙
│   ├── CORE_SYSTEMS.md            # 피드백/에스컬레이션/장기기억
│   ├── WORKFLOW_AUTOMATION.md     # 워크플로우 자동화
│   └── INTEGRATIONS_MOBILE.md     # 외부 연동 & PWA
│
├── frontend/                      # React 프론트엔드
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   └── CareFlowAgentHub.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/                       # Python 백엔드 (Phase 2)
│   ├── main.py
│   ├── agents/
│   │   └── config.py
│   └── requirements.txt
│
├── prompts/                       # 시스템 프롬프트
│   └── SYSTEM_PROMPT.md
│
└── README.md
```

## 🚀 빠른 시작 (프론트엔드만)

```bash
# 1. 프로젝트 폴더 생성
mkdir careflow-agent-hub
cd careflow-agent-hub

# 2. Vite + React 프로젝트 생성
npm create vite@latest frontend -- --template react
cd frontend

# 3. 의존성 설치
npm install

# 4. TailwindCSS 설치
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 5. 개발 서버 실행
npm run dev
```

## 📋 Claude Code에게 전달할 명령어

```
이 프로젝트를 만들어줘:

1. Vite + React + TailwindCSS 프로젝트 생성
2. CareFlowAgentHub.jsx 컴포넌트 적용
3. 개발 서버 실행

설계 문서들은 docs/ 폴더에 저장해줘.
```

## 🔧 필요한 설정 파일들

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### src/App.jsx
```javascript
import CareFlowAgentHub from './components/CareFlowAgentHub'

function App() {
  return <CareFlowAgentHub />
}

export default App
```
