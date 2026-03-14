# 책임 · This is Book 📚

> *내가 그의 이름을 불러주었을 때, 그는 나에게로 와서 책이 되었다*

독서 활동 카드를 쉽고 예쁘게 만들 수 있는 웹 애플리케이션입니다.
책을 검색하고, 세 가지 카드(책 카드 · 소개 카드 · 질문 카드)를 작성한 뒤 이미지로 저장하거나 클립보드에 복사할 수 있습니다.

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 📖 책 검색 | 네이버 책 검색 API를 통해 제목·저자로 검색 (최대 100건) |
| 📷 이미지 검색 | 책 표지 사진 촬영 또는 이미지 업로드 → OCR로 제목 자동 인식 |
| 🃏 책 카드 | 등장인물 분석 카드 — 이름, 좋아하는 것/싫어하는 것, 특징, 명대사, 색깔, 이모지, 그림/사진 |
| 📝 소개 카드 | 책 소개 문구 + 이미지 첨부 |
| ❓ 질문 카드 | 책을 읽고 떠오르는 질문과 답변 |
| 🖼️ 내보내기 | 카드별 PNG 이미지 저장 또는 클립보드 복사 |
| 💾 데이터 저장/복원 | JSON 파일로 작업 내용 저장 및 불러오기 |
| 🌏 다국어 지원 | 한국어 · English · 日本語 · 中文 |
| 🎨 테마 | 파스텔 블루 / 그린 / 옐로우 / 핑크 |

---

## 🛠️ 기술 스택

- **Frontend** : React 18 + TypeScript + Vite
- **UI** : Tailwind CSS + shadcn/ui
- **상태 관리** : Zustand (localStorage 영속화)
- **라우팅** : React Router v6
- **이미지 내보내기** : html-to-image
- **OCR** : Tesseract.js
- **배포** : Netlify (서버리스 함수로 API 프록시)
- **책 검색 데이터** : NAVER Search API

---

## 🚀 로컬 개발 환경 설정

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- NAVER 개발자 센터에서 발급받은 책 검색 API 키

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone <YOUR_GIT_URL>
cd this_is_book

# 2. 의존성 설치
npm install

# 3. 환경변수 파일 생성
cp .env.example .env
# .env 파일에 NAVER API 키 입력 (아래 환경변수 항목 참고)

# 4. 개발 서버 실행
npm run dev
```

### 환경변수

로컬 개발 시 프로젝트 루트에 `.env` 파일을 생성하고 아래 항목을 입력하세요.
**API 키는 절대 공개 저장소에 커밋하지 마세요.**

```
NAVER_CLIENT_ID=여기에_클라이언트_ID_입력
NAVER_CLIENT_SECRET=여기에_클라이언트_시크릿_입력
```

> Vite 개발 서버는 `/api/naver/*` 경로를 NAVER API로 프록시합니다.
> 프로덕션(Netlify)에서는 `netlify/functions/naver-search.ts` 서버리스 함수가 동일 역할을 수행합니다.
> Netlify 배포 시 대시보드 → Site settings → Environment variables에서 위 두 값을 등록하세요.

### 빌드

```bash
npm run build   # 프로덕션 빌드
npm run preview # 빌드 결과 로컬 미리보기
```

---

## 📁 프로젝트 구조

```
src/
├── components/          # UI 컴포넌트
│   ├── BookSearch.tsx   # 책 검색 (OCR 포함)
│   ├── BookCardActivity.tsx   # 책 카드 작성
│   ├── IntroCardActivity.tsx  # 소개 카드 작성
│   ├── QuestionCardActivity.tsx # 질문 카드 작성
│   ├── *Preview.tsx     # 카드 미리보기
│   ├── ExportToolbar.tsx # 내보내기
│   ├── ThemeSelector.tsx # 테마 + 데이터 저장/복원
│   └── ResetButton.tsx  # 전체 초기화
├── lib/
│   ├── useAppStore.ts   # Zustand 전역 상태
│   ├── naverBooks.ts    # NAVER API 호출 로직
│   └── i18n.ts          # 다국어 번역
└── pages/
    └── Index.tsx        # 메인 페이지

netlify/
└── functions/
    └── naver-search.ts  # 서버리스 API 프록시
```

---

## ⚠️ 개발 아이디어 존중 안내

이 프로젝트는 **교육뮤지컬 꿈꾸는 치수쌤**이 직접 기획하고 개발한 독서 교육 도구입니다.

- 본 서비스의 아이디어, 기획, UI/UX 구성은 개발자의 창작물입니다.
- 상업적 목적의 무단 복제·배포·재배포를 금합니다.
- 교육 목적의 참고 및 비상업적 활용은 **출처를 명시**한 경우에 한해 허용합니다.
- 기능 개선 제안이나 협업 문의는 아래 개발자 링크를 통해 연락해 주세요.

---

## 👩‍🏫 개발자

| | |
|---|---|
| **이름** | 교육뮤지컬 꿈꾸는 치수쌤 |
| **링크** | [litt.ly/chichiboo](https://litt.ly/chichiboo) |

---

## 📜 라이선스

이 프로젝트는 개인 교육 목적으로 제작되었습니다.
무단 상업적 이용을 금하며, 교육적 활용 시 반드시 출처를 명시해 주세요.
