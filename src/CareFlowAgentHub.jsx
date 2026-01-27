import React, { useState, useRef, useEffect } from 'react';

// OpenRouter API 설정
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = import.meta.env.VITE_MODEL || 'meta-llama/llama-3.1-8b-instruct:free';

// 13개 에이전트 정의
const AGENTS = {
  writer: {
    id: 'writer',
    name: '글쓰기 AI',
    emoji: '✍️',
    color: 'bg-purple-500',
    role: '세영님 스타일 글 작성',
    systemPrompt: `당신은 세영님의 글쓰기 스타일을 완벽히 이해한 AI 작가입니다.

세영님의 글쓰기 특징:
- 따뜻하면서도 전문적인 톤
- 환자 중심의 공감적 표현
- 복잡한 의학 개념을 쉽게 풀어 설명
- 적절한 비유와 예시 활용
- "~해요" 체의 친근한 존댓말

응답 시 확신도를 표시하세요: 🟢 확실(95%+), 🟡 높음(75-94%), 🟠 중간(50-74%)`
  },
  rehab: {
    id: 'rehab',
    name: '기능재활 전문가',
    emoji: '🏃',
    color: 'bg-green-500',
    role: 'CareFlow 기능재활 지식',
    systemPrompt: `당신은 CareFlow의 기능재활운동 전문가 AI입니다.

전문 지식 영역:
- DNS (Dynamic Neuromuscular Stabilization)
- IAP (Intra-Abdominal Pressure) 훈련
- 기능적 움직임 패턴
- 운동처방 및 평가
- Traffic Light System

응답은 전문적이면서도 이해하기 쉽게 작성하세요.
확신도를 표시하세요: 🟢 확실(95%+), 🟡 높음(75-94%), 🟠 중간(50-74%)`
  },
  backend: {
    id: 'backend',
    name: '백엔드 개발자',
    emoji: '⚙️',
    color: 'bg-gray-600',
    role: '서버/API 개발',
    systemPrompt: `당신은 CareFlow의 백엔드 개발자 AI입니다.

기술 스택:
- Python 3.11+ / FastAPI
- PostgreSQL / Supabase
- Redis, Docker

코드를 작성할 때는 타입 힌트와 간결한 설명을 포함하세요.`
  },
  frontend: {
    id: 'frontend',
    name: '프론트엔드',
    emoji: '🎨',
    color: 'bg-blue-500',
    role: 'UI 구현',
    systemPrompt: `당신은 CareFlow의 프론트엔드 개발자 AI입니다.

기술 스택:
- React 18 + TypeScript
- TailwindCSS
- Zustand, React Query

환자 친화적이고 접근성 좋은 UI를 설계하세요.`
  },
  architect: {
    id: 'architect',
    name: '아키텍트',
    emoji: '🏛️',
    color: 'bg-amber-600',
    role: '총괄 기획/조율',
    systemPrompt: `당신은 CareFlow 시스템의 총괄 아키텍트 AI입니다.

책임:
- 전체 시스템 아키텍처 설계
- 팀 간 업무 조율
- 기술 방향성 제시

요청을 분석하고 적절한 에이전트에게 위임하거나 직접 답변하세요.
다른 에이전트가 필요하면 @에이전트명 으로 언급하세요.`
  },
  designer: {
    id: 'designer',
    name: 'UI 디자이너',
    emoji: '🎯',
    color: 'bg-pink-500',
    role: 'UI/UX 설계',
    systemPrompt: `당신은 CareFlow의 UI/UX 디자이너 AI입니다.

디자인 원칙:
- 환자 친화적 (의료 지식 없어도 이해 가능)
- 직관적 (학습 없이 바로 사용)
- CareFlow 브랜드 일관성`
  },
  'yt-chief': {
    id: 'yt-chief',
    name: '유튜브 총괄PD',
    emoji: '🎬',
    color: 'bg-red-500',
    role: '콘텐츠 기획',
    systemPrompt: `당신은 치중진담 & CareFlow 유튜브 채널의 총괄 PD AI입니다.

채널 특성:
- 치중진담: 치료 이론, 전문 지식 공유
- CareFlow: 실제 운동 방법, 실용적 콘텐츠

콘텐츠 기획, 트렌드 분석, 채널 성장 전략을 제안하세요.`
  },
  'yt-video': {
    id: 'yt-video',
    name: '영상 PD',
    emoji: '🎥',
    color: 'bg-red-400',
    role: '영상 분석/전사',
    systemPrompt: `당신은 유튜브 영상 분석 전문 PD AI입니다.

역할:
- 영상 분석 및 전사
- SEO 최적화 제목 추천
- 해시태그 추천

제목은 검색 친화적이면서 클릭률을 높이는 방향으로 작성하세요.`
  },
  shorts: {
    id: 'shorts',
    name: '숏츠 PD',
    emoji: '📱',
    color: 'bg-orange-500',
    role: '숏폼 콘텐츠',
    systemPrompt: `당신은 유튜브 숏츠 전문 PD AI입니다.

숏츠 원칙:
- 30-60초 내 핵심 전달
- 강력한 훅(hook)으로 시작
- 시각적 임팩트

롱폼에서 숏츠 구간을 추출하고 훅을 제안하세요.`
  },
  comments: {
    id: 'comments',
    name: '댓글 관리자',
    emoji: '💬',
    color: 'bg-teal-500',
    role: '구독자 소통',
    systemPrompt: `당신은 유튜브 댓글 관리 전문 AI입니다.

역할:
- 댓글 분류 및 분석
- 콘텐츠 아이디어 발굴
- FAQ 정리

구독자의 진짜 needs를 파악하고 콘텐츠 기회로 연결하세요.`
  },
  thumbnail: {
    id: 'thumbnail',
    name: '썸네일',
    emoji: '🖼️',
    color: 'bg-violet-500',
    role: '썸네일 제작',
    systemPrompt: `당신은 유튜브 썸네일 전문 디자이너 AI입니다.

썸네일 원칙:
- 3초 안에 주제 파악
- 텍스트는 크고 명확하게 (모바일 고려)
- 채널 컬러 일관성

컨셉을 여러 가지 제안하고 선택을 요청하세요.`
  },
  ailink: {
    id: 'ailink',
    name: 'AI 연동',
    emoji: '🔗',
    color: 'bg-indigo-500',
    role: 'CareFlow AI',
    systemPrompt: `당신은 CareFlow AI 시스템 연동 전문 AI입니다.

역할:
- CareFlow 데이터 분석
- 환자 운동 데이터 패턴 파악
- 개선사항 도출

데이터 기반의 객관적 분석을 제공하세요.`
  },
  schedule: {
    id: 'schedule',
    name: '일정 비서',
    emoji: '📅',
    color: 'bg-cyan-500',
    role: '개인 비서',
    systemPrompt: `당신은 세영님의 개인 비서 AI입니다.

역할:
- 일정 관리 및 리마인더
- To-do 리스트 관리
- 매일 브리핑 제공

아침에는 하루 일정을, 저녁에는 내일 준비사항을 브리핑하세요.
시간은 현재 한국 시간 기준으로 응답하세요.`
  },
};

// 채팅방 정의
const INITIAL_ROOMS = [
  { id: 'lobby', name: '🏠 로비', type: 'main', participants: Object.keys(AGENTS) },
  { id: 'youtube', name: '🎬 영상팀', type: 'project', participants: ['yt-chief', 'yt-video', 'shorts', 'comments', 'thumbnail'] },
  { id: 'dev', name: '💻 개발팀', type: 'project', participants: ['architect', 'backend', 'frontend', 'designer'] },
  { id: 'content', name: '✍️ 콘텐츠팀', type: 'project', participants: ['writer', 'rehab'] },
  { id: 'personal', name: '📅 개인비서', type: 'direct', participants: ['schedule'] },
];

// 워크플로우 정의
const WORKFLOWS = {
  'video-analysis': {
    name: '영상 분석 파이프라인',
    trigger: ['영상 분석', '유튜브 분석', '전사'],
    agents: ['yt-video', 'thumbnail', 'shorts'],
    steps: [
      { agent: 'yt-video', action: '영상 전사 및 분석' },
      { agent: 'thumbnail', action: '썸네일 컨셉 제안' },
      { agent: 'shorts', action: '숏츠 구간 추출' },
    ]
  },
  'content-planning': {
    name: '콘텐츠 기획',
    trigger: ['콘텐츠 기획', '댓글 분석'],
    agents: ['comments', 'yt-chief'],
    steps: [
      { agent: 'comments', action: '댓글 분석' },
      { agent: 'yt-chief', action: '콘텐츠 기획안 작성' },
    ]
  },
  'column-writing': {
    name: '칼럼 작성',
    trigger: ['칼럼', '글 써줘'],
    agents: ['rehab', 'writer'],
    steps: [
      { agent: 'rehab', action: '전문 내용 정리' },
      { agent: 'writer', action: '세영님 스타일로 작성' },
    ]
  },
  'morning-briefing': {
    name: '아침 브리핑',
    trigger: ['아침 브리핑', '오늘 일정', '브리핑'],
    agents: ['schedule'],
    steps: [
      { agent: 'schedule', action: '일정 및 할일 정리' },
    ]
  },
};

// OpenRouter API 호출
const callOpenRouter = async (agent, userInput, conversationHistory = []) => {
  const systemPrompt = `${agent.systemPrompt}

## 응답 규칙
- 한국어로 응답하세요
- 응답은 간결하고 실용적으로
- 세영님이라고 부르세요
- 이모지를 적절히 사용하세요`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-6).map(msg => ({
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.isUser ? msg.content : `[${msg.sender.name}]: ${msg.content}`
    })),
    { role: 'user', content: userInput }
  ];

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'CareFlow Agent Hub'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API 호출 실패');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    return `⚠️ API 오류가 발생했어요: ${error.message}\n\n잠시 후 다시 시도해주세요.`;
  }
};

// 워크플로우 감지
const detectWorkflow = (input) => {
  const lowerInput = input.toLowerCase();
  for (const [key, wf] of Object.entries(WORKFLOWS)) {
    if (wf.trigger.some(t => lowerInput.includes(t))) {
      return { key, ...wf };
    }
  }
  return null;
};

// 적절한 에이전트 선택
const selectAgent = (input, roomParticipants) => {
  const lowerInput = input.toLowerCase();

  const keywords = {
    schedule: ['일정', '브리핑', '할일', '투두', '리마인드', '메일'],
    thumbnail: ['썸네일', '이미지', '표지'],
    backend: ['코드', '개발', 'api', '서버', '백엔드', '데이터베이스'],
    frontend: ['프론트', 'ui', '화면', '컴포넌트', '리액트'],
    rehab: ['운동', '재활', '치료', '통증', '스트레칭', 'dns', '호흡'],
    writer: ['글', '칼럼', '포스트', '작성', '블로그'],
    'yt-chief': ['기획', '전략', '채널'],
    'yt-video': ['영상', '분석', '제목', '전사'],
    shorts: ['숏츠', '숏폼', '릴스'],
    comments: ['댓글', '구독자', '피드백'],
    designer: ['디자인', 'ux', '와이어프레임'],
    ailink: ['데이터', '분석', '패턴', '통계'],
  };

  for (const [agentId, words] of Object.entries(keywords)) {
    if (words.some(w => lowerInput.includes(w)) && roomParticipants.includes(agentId)) {
      return AGENTS[agentId];
    }
  }

  // 기본값: 방의 첫 번째 에이전트 또는 아키텍트
  if (roomParticipants.includes('architect')) return AGENTS.architect;
  return AGENTS[roomParticipants[0]];
};

export default function CareFlowAgentHub() {
  const [rooms] = useState(INITIAL_ROOMS);
  const [currentRoom, setCurrentRoom] = useState('lobby');
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState(null);
  const [showAgents, setShowAgents] = useState(true);
  const messagesEndRef = useRef(null);

  const room = rooms.find(r => r.id === currentRoom);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (roomId, sender, content, isUser = false) => {
    setMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), { sender, content, isUser, timestamp: new Date() }]
    }));
  };

  const processWorkflow = async (workflow, userInput) => {
    setActiveWorkflow(workflow);
    const roomMessages = messages[currentRoom] || [];

    addMessage(currentRoom, AGENTS.architect,
      `🏛️ **워크플로우 시작: ${workflow.name}**\n\n담당: ${workflow.agents.map(a => AGENTS[a].emoji + AGENTS[a].name).join(' → ')}`
    );

    let context = userInput;
    for (const step of workflow.steps) {
      const agent = AGENTS[step.agent];
      const prompt = `[워크플로우: ${workflow.name}]\n[작업: ${step.action}]\n\n사용자 요청: ${context}`;

      const response = await callOpenRouter(agent, prompt, roomMessages);
      addMessage(currentRoom, agent, response);
      context = response; // 다음 에이전트에게 컨텍스트 전달
    }

    setActiveWorkflow(null);
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userInput = input;
    setInput('');
    addMessage(currentRoom, { id: 'user', name: '세영님', emoji: '👤' }, userInput, true);
    setIsProcessing(true);

    const workflow = detectWorkflow(userInput);

    if (workflow) {
      await processWorkflow(workflow, userInput);
    } else {
      const roomMessages = messages[currentRoom] || [];
      const respondingAgent = selectAgent(userInput, room.participants);
      const response = await callOpenRouter(respondingAgent, userInput, roomMessages);
      addMessage(currentRoom, respondingAgent, response);
    }

    setIsProcessing(false);
  };

  const roomMessages = messages[currentRoom] || [];

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      {/* 사이드바 */}
      <div className="w-64 bg-gray-800 flex flex-col border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            CareFlow Hub
          </h1>
          <p className="text-xs text-gray-400 mt-1">13 Agents · AI Connected</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="text-xs text-gray-500 px-2 mb-2">채팅방</div>
          {rooms.map(r => (
            <button
              key={r.id}
              onClick={() => setCurrentRoom(r.id)}
              className={`w-full text-left p-3 rounded-lg mb-1 transition-all ${
                currentRoom === r.id
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-700'
              }`}
            >
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                {r.participants.slice(0, 3).map(p => AGENTS[p]?.emoji).join(' ')}
                {r.participants.length > 3 && ` +${r.participants.length - 3}`}
              </div>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
              세
            </div>
            <div>
              <div className="text-sm font-medium">세영님</div>
              <div className="text-xs text-gray-400">CareFlow CEO</div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 채팅 */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-800">
          <div>
            <h2 className="font-bold text-lg">{room?.name}</h2>
            <p className="text-sm text-gray-400">
              {room?.participants.length}명의 에이전트
            </p>
          </div>
          <button
            onClick={() => setShowAgents(!showAgents)}
            className="p-2 hover:bg-gray-700 rounded-lg"
          >
            👥
          </button>
        </div>

        {/* 메시지 영역 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {roomMessages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">
              <p className="text-4xl mb-4">👋</p>
              <p className="font-medium">안녕하세요, 세영님!</p>
              <p className="text-sm mt-2">무엇을 도와드릴까요?</p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {['아침 브리핑', '영상 분석해줘', '콘텐츠 기획해줘', '칼럼 써줘'].map(cmd => (
                  <button
                    key={cmd}
                    onClick={() => setInput(cmd)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}

          {roomMessages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.isUser
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                  : AGENTS[msg.sender.id]?.color || 'bg-gray-600'
              }`}>
                {msg.isUser ? '세' : msg.sender.emoji}
              </div>
              <div className={`max-w-2xl ${msg.isUser ? 'text-right' : ''}`}>
                <div className="text-xs text-gray-400 mb-1">
                  {msg.isUser ? '세영님' : msg.sender.name}
                </div>
                <div className={`inline-block p-4 rounded-2xl ${
                  msg.isUser
                    ? 'bg-blue-600 rounded-tr-sm'
                    : 'bg-gray-700 rounded-tl-sm'
                }`}>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                {activeWorkflow ? '🏛️' : '🤔'}
              </div>
              <div className="bg-gray-700 p-4 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 입력 */}
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="메시지 입력... (예: 영상 분석해줘, 아침 브리핑)"
              className="flex-1 p-3 bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isProcessing}
            />
            <button
              onClick={handleSend}
              disabled={isProcessing || !input.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl font-medium transition-colors"
            >
              전송
            </button>
          </div>
        </div>
      </div>

      {/* 에이전트 패널 */}
      {showAgents && (
        <div className="w-72 bg-gray-800 border-l border-gray-700 overflow-y-auto">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-bold">에이전트 (13)</h3>
          </div>
          <div className="p-2">
            {Object.values(AGENTS).map(agent => (
              <div
                key={agent.id}
                className={`p-3 rounded-lg mb-2 ${
                  room?.participants.includes(agent.id)
                    ? 'bg-gray-700'
                    : 'bg-gray-750 opacity-40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${agent.color} rounded-full flex items-center justify-center`}>
                    {agent.emoji}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{agent.name}</div>
                    <div className="text-xs text-gray-400">{agent.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
