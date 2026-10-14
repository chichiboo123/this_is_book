# 책임 · This is Book 📚

> *내가 그의 이름을 불러주었을 때, 그는 나에게로 와서 책이 되었다*

독서 활동 카드를 쉽고 예쁘게 만들 수 있는 웹 애플리케이션입니다.
책을 검색하고, 세 가지 카드(책 카드 · 소개 카드 · 질문 카드)를 작성한 뒤 이미지로 저장하거나 클립보드에 복사할 수 있습니다.

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🧭 3단계 흐름 | ① 책 고르기 → ② 카드 만들기 → ③ 저장·공유하기, 단계·카드별 완성 표시 |
| 📖 책 검색 | 카카오 책 검색(키 미설정·오류 시 Google Books 자동 대체)으로 제목·저자 검색, 찾는 책이 없으면 직접 입력 |
| 📷 표지 사진 검색 | 표지 촬영 또는 사진 업로드 → OCR로 제목 인식 후 검색 |
| 🎭 책 카드 | 책을 캐릭터로 상상 — 이름, 좋아하는 것/싫어하는 것, 특징, 자주 하는 말, 색깔, 이모지, 사진 또는 직접 그린 그림 |
| 📣 소개 카드 | 추천 지수(별점), 글머리 아이디어, 추천 글 + 이미지 |
| ❓ 질문 카드 | 질문 아이디어, 질문·답 추가/삭제 (최대 8개) |
| 🎨 그림판 | 펜·지우개, 되돌리기, 색 10종, 굵기 조절, 필압 지원, 자동 복원 |
| 🖼️ 저장·공유 | 카드별 PNG 저장 · 클립보드 복사 · (모바일) 공유, 여러 장 한 번에 저장 |
| 📱 모바일 | 작성하기/미리보기 전환, 터치 친화적 버튼 |
| 💾 이어 하기 | 기기에 자동 저장 + 작업 파일(JSON) 저장/불러오기 |
| 🌏 다국어 | 한국어 · English · 日本語 · 中文 |
| 🎨 테마 | 하늘 · 새싹 · 햇살 · 꽃잎 (파스텔 4종) |

> UI/UX 진단 및 개선 내역은 [docs/UI-UX-개선-보고서.md](docs/UI-UX-개선-보고서.md)를 참고하세요.

---

## 🛠️ 기술 스택

- **Frontend** : React 18 + TypeScript + Vite
- **UI** : Tailwind CSS + shadcn/ui(Radix) · Pretendard · Google Material Icons
- **상태 관리** : Zustand (localStorage 영속화)
- **라우팅** : React Router v6
- **이미지 내보내기** : html-to-image
- **OCR** : Tesseract.js
- **배포** : Netlify (서버리스 함수로 API 프록시)
- **책 검색 데이터** : Kakao 책 검색(Daum 검색 API) · Google Books API
  - 네이버 책 검색 API는 2026-07-31 서비스 종료로 교체되었습니다.

---

## 🚀 로컬 개발 환경 설정

### 사전 요구사항

- Node.js 18 이상
- npm 또는 yarn
- [카카오 디벨로퍼스](https://developers.kakao.com)에서 발급받은 REST API 키 (없어도 Google Books로 검색 가능)

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone <YOUR_GIT_URL>
cd this_is_book

# 2. 의존성 설치
npm install

# 3. 환경변수 파일 생성
cp .env.example .env
# .env 파일에 카카오 REST API 키 입력 (아래 환경변수 항목 참고)

# 4. 개발 서버 실행
npm run dev
```

### 환경변수

로컬 개발 시 프로젝트 루트에 `.env` 파일을 생성하고 아래 항목을 입력하세요.
**API 키는 절대 공개 저장소에 커밋하지 마세요.**

```
KAKAO_REST_API_KEY=여기에_카카오_REST_API_키_입력
# (선택) VITE_GOOGLE_BOOKS_API_KEY=
```

> - 카카오 키 발급: 카카오 디벨로퍼스 → 내 애플리케이션 → 앱 추가 → **앱 키 > REST API 키**
> - Vite 개발 서버는 `/api/kakao-book-search`를 카카오 책 검색으로 프록시합니다.
> - 프로덕션(Netlify)에서는 `netlify/functions/kakao-book-search.ts` 서버리스 함수가 키를 붙여 중계합니다.
>   **Netlify 대시보드 → Site configuration → Environment variables**에 `KAKAO_REST_API_KEY`를 등록한 뒤 다시 배포하세요.
> - 카카오 키가 없거나 호출에 실패하면 브라우저에서 Google Books를 바로 검색합니다(키 불필요).
> - 더 이상 쓰지 않는 `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` 환경변수는 삭제해도 됩니다.

### 빌드

```bash
npm run build   # 프로덕션 빌드
npm run preview # 빌드 결과 로컬 미리보기
```

---

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── AppHeader.tsx          # 헤더 (테마·언어·사용법·더보기 메뉴)
│   ├── AppFooter.tsx          # 치수쌤 표준 푸터 + 데이터 출처
│   ├── BookSearch.tsx         # ① 책 고르기 (검색·OCR·직접 입력·선택한 책 요약)
│   ├── CardWorkspace.tsx      # ② 카드 작성 + 미리보기 레이아웃 (모바일 전환)
│   ├── BookContextBar.tsx     # 카드별 책 제목 수정·표지 넣기
│   ├── *CardActivity.tsx      # 책/소개/질문 카드 작성
│   ├── *CardPreview.tsx       # 카드 디자인 (미리보기 = 저장 이미지)
│   ├── CardShell.tsx          # 카드 공통 틀 (브랜드 표기)
│   ├── DrawingCanvas.tsx      # 그림판
│   ├── CardExportActions.tsx  # 카드별 저장·복사·공유
│   ├── ExportToolbar.tsx      # ③ 여러 장 저장
│   ├── ExportStage.tsx        # 내보내기용 숨김 렌더링
│   └── HelpModal.tsx, ConfirmDialog.tsx, ImageAttach.tsx, StarRating.tsx, Icon.tsx
├── hooks/useCardExport.ts     # 저장·복사·공유 + 오류 안내
├── lib/
│   ├── useAppStore.ts         # Zustand 전역 상태 (자동 저장)
│   ├── exportCard.ts          # html-to-image 캡처·파일명·클립보드·공유
│   ├── backup.ts              # 작업 파일 저장/불러오기
│   ├── image.ts               # 업로드 이미지 축소, 대비 글자색
│   ├── progress.ts            # 카드 완성 판정
│   ├── bookSearch.ts          # 책 검색 (카카오 → Google Books 대체)
│   └── i18n.ts                # 다국어 번역
└── pages/Index.tsx            # 메인 페이지

netlify/functions/
├── kakao-book-search.ts       # 카카오 책 검색 API 프록시 (키 보호)
└── image-proxy.ts             # 표지 이미지 CORS 프록시
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
