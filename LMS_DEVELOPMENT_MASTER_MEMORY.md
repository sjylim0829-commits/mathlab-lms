# 🏫 영서중학교 수학 LMS - 프로젝트 인수인계 및 마스터 메모리 기록문서

본 문서는 **영서중학교 임종윤 선생님의 수학 LMS 개발 내역, 백엔드 구글 연동 정보, 시스템 구조 및 모든 핵심 설정**을 다른 PC의 AI 인공지능이 즉시 100% 학습하여 연속해서 개발을 진행할 수 있도록 작성된 마스터 인수인계 기록 파일입니다.

---

## 📌 1. 핵심 프로젝트 인프라 및 배포 정보

| 항목 | 상세 정보 및 URL / ID |
| :--- | :--- |
| **담당 교사** | **임종윤 교사 (영서중학교 수학과)** |
| **마스터 교사 로그인 계정** | **아이디**: `test` / **비밀번호**: `11111111` |
| **Vercel 실시간 배포 URL** | **[https://mathlab-lms-9fdt.vercel.app/](https://mathlab-lms-9fdt.vercel.app/)** |
| **GitHub 소스코드 저장소** | **[https://github.com/sjylim0829-commits/mathlab-lms.git](https://github.com/sjylim0829-commits/mathlab-lms.git)** |
| **구글 앱스 스크립트 Script ID** | `17cQ5FvmIVP39-2S31_WT0tudDBgwCvyk7k6XmEMhsC-DAt-YmnftZIhT` |
| **구글 앱스 스크립트 라이브 WebApp URL** | `https://script.google.com/macros/s/AKfycbxnxVFfw9oeqks1lrDj_SgrS8ltk7HGdcmfA98BlLxf3f7PdC9M47LETlV6JuAbOJ8E/exec` |
| **구글 시트 파일명** | `영서중학교 수학 LMS DB` |

---

## 📊 2. 구글 시트 데이터베이스 (4개 탭 구조)

구글 시트(`영서중학교 수학 LMS DB`)는 아래 4개 탭으로 구성되며, Apps Script 백엔드(`gas/Code.gs`)를 통해 실시간 자동 동기화됩니다:

1. **`학생명부` 탭**: 학생 가입 및 회원 정보 (`학번`, `성명`, `학년`, `학반`, `비밀번호`, `가입일시`)
2. **`수업진도` 탭**: 학반별 수학 진도 (`학년`, `학반`, `진도단원`, `진도페이지`, `진도율`, `수업과제`, `교사메모`, `최종수정일`)
3. **`교육과정DB` 탭**: 1~3학년 교육과정 단원 마스터 DB (`학년`, `순번`, `단원명`, `기본페이지`, `비고`)
4. **`탐구활동결과` 탭**: 학생 탐구 실습 답안 및 드라이브 파일 링크 (`학번`, `학생성명`, `학년`, `학반`, `탐구활동제목`, `학생제출답안`, `이해도점수`, `제출일시`, `드라이브파일URL`)

---

## 📁 3. 구글 드라이브 탐구보고서 자동 생성 시스템

- **자동 생성 폴더**: `영서중학교 수학 LMS 탐구보고서`
- **자동 생성 파일명 서식**: `[탐구보고서] 학번_성명_탐구활동제목.txt`
- **파일 내부 구성**:
  - 학번, 성명, 소속(영서중학교 X학년 Y반)
  - 제출 일시, 형성평가 점수(100점)
  - 학생 작성 수식 및 탐구 소감 전문
- **Clasp 기반 자동 배포**: 프로젝트 내 `.clasp.json` 및 `gas/Code.gs`가 바인딩되어 있어, CLI 명령어(`npx clasp push -f` / `clasp deploy`)로 구글 서버에 자동 배포됩니다.

---

## 🎨 4. 디자인 시스템 & UI/UX 사양

1. **세련된 럭셔리 화이트 톤 (Sleek Modern White Theme)**:
   - 메인 배경: 포셀린 화이트 (`#f8fafc`) & 에어리 수학 그리드 오버레이
   - 모듈 카드: 퓨어 화이트 글래스 카드 (`#ffffff`, `border: 1px solid #e2e8f0`)
   - 포인트 컬러: 딥 인디고 & 바이올렛 그라데이션 (`#6366f1` ~ `#4f46e5`)
   - 폰트: `Pretendard`, `Inter` 및 다크 슬레이트 텍스트 (`#0f172a`, `#475569`)
2. **컴팩트 로그인 카드**: `max-width: 440px`, 중앙 정렬
3. **와이드스크린 스마트 대시보드**: 4컬럼 메트릭 그리드 및 3컬럼 퀵 액션 카드

---

## 📐 5. 탐구 활동 센터 (Activity Registry Catalog & Canvas Explorer)

1. **등록된 탐구활동 목록 선택 시스템 (Activity Catalog System)**:
   - `mathlab_registered_activities` (`localStorage`) 기반 목록 저장 및 연동
   - **Redbook 제작 웹 앱 2종 통합 연동 완료**:
     1) `📘 [2학년] 이등변삼각형 & 직각삼각형의 합동 탐구 (Redbook 웹 앱)`
     2) `📐 [2학년] 삼각형의 외심 (Circumcenter) 탐구 (Redbook 웹 앱)`
   - iframe 연동 및 `MathLMSBridge` / `postMessage` (`MATH_LMS_SUBMIT`) 제출 신호 수신을 통해 영서중학교 수학 LMS DB (`영서중학교 수학 LMS DB` 시트의 `탐구활동결과` 탭)에 자동 통합 기록됨.
2. **직각삼각형의 합동 조건 (RHA & RHS) 통째 겹치기 실습 엔진**:
   - `js/grapher.js` 내 `RightTriangleCongruenceExplorer` 엔진
   - 점 하나씩 이동 방식이 아닌, **삼각형 $\triangle DEF$ 전체를 통째로 마우스/손가락으로 끌어다 포개는** 솔리드 피직스 인터랙션
   - RHA(빗변+한예각) & RHS(빗변+한변) 모드 토글, 0°~360° 회전 슬라이더, Snap-to-overlap 포개기 자동 판정, 자동 애니메이션 포함

---

## 🔍 6. 자가 진단 및 예외 처리 엔진 (`CloudDB.saveActivityResult`)

- `doPost(e)` 내부에서 에디터의 `[실행]` 버튼 클릭 시 `TypeError: Cannot read properties of undefined (reading 'postData')`가 발생하지 않도록 `if (!e || !e.postData)` 안전 분기 처리 구축.
- 웹앱 응답 페이로드의 `apiVersion`을 분석하여 구글 웹앱 실행 상태 및 권한 미승인 상태를 자가 진단 리포트로 출력함.

---

## 📂 7. 프로젝트 주요 파일 구조

```text
mathlab-lms/
├── index.html                    # 메인 HTML 엔트리포인트
├── css/
│   └── styles.css                # 마스터 세련된 화이트 톤 디자인 시스템 (CSS Variables)
├── js/
│   ├── app.js                    # 통합 스마트 인증, 사이드바 내비게이션, 사용자 셸
│   ├── db.js                     # CloudDB 구글 시트 & 드라이브 동기화 및 자가 진단 엔진
│   ├── teacher.js                # 교사 대시보드, 탐구 활동 목록 센터, 실습 제출 관리
│   ├── student.js                # 학생 전용 학습 포털 및 제출 이력
│   ├── progress.js               # 학반별(1~2학년 1~8반, 3학년 1~6반: 총 22개 학급) 수업 진도 매트릭스 및 마스터 DB 연동
│   ├── archive.js                # 학생 기록 아카이빙 & AI 세특 자동 생성기
│   └── grapher.js                # 직각삼각형 통째 겹치기 Canvas 렌더링 엔진
├── gas/
│   ├── Code.gs                   # 구글 앱스 스크립트 마스터 백엔드 (v3.1)
│   └── appsscript.json           # GAS 매니페스트 및 webapp/oauthScopes 설정
├── .clasp.json                   # Clasp CLI 구글 앱스 스크립트 ID 연동 파일
└── LMS_DEVELOPMENT_MASTER_MEMORY.md  # 마스터 인수인계 기록 문서 (본 파일)
```

---

## 💡 8. 새 PC에서 이전하여 대화를 계속할 때 가이드

1. 새로 여는 AI 차시에서 **`LMS_DEVELOPMENT_MASTER_MEMORY.md` 파일을 업로드**하거나 위 문서 내용을 제시해 주세요.
2. AI는 위 기록을 토대로 영서중학교 임종윤 선생님의 LMS 시스템 구조, 구글 시트/드라이브 백엔드, 화이트 톤 UI 디자인, 직각삼각형 겹치기 캔버스 엔진을 100% 완벽하게 이해하고 개발을 이어가게 됩니다.
