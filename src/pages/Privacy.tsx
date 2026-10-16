import { Link } from "react-router-dom";
import LegalLayout, { type LegalSection } from "@/components/LegalLayout";
import Icon from "@/components/Icon";
import { LEGAL } from "@/lib/legal";

/**
 * 개인정보 처리방침
 * 「개인정보 보호법」 제30조, 같은 법 시행령 제31조, 개인정보보호위원회 「개인정보 처리방침 작성지침」의
 * 기재 항목·순서를 따르되, 이 앱은 회원가입·서버 저장이 없으므로 '해당 없음'을 분명히 밝힌다.
 */

const ExtLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

const SUMMARY = [
  { icon: "person_off", label: "수집하는 개인정보", value: "없음 (회원가입·로그인 없음)" },
  { icon: "devices", label: "작업 내용 보관", value: "내 기기(브라우저)에만 저장" },
  { icon: "block", label: "제3자 제공", value: "없음" },
  { icon: "cookie", label: "쿠키·광고·행태 분석", value: "사용하지 않음" },
  { icon: "public", label: "외부 서비스 접속", value: "책 검색·글꼴 등 (제6조)" },
  { icon: "mail", label: "문의", value: "litt.ly/chichiboo" },
];

const sections: LegalSection[] = [
  {
    id: "p1",
    title: "제1조 (개인정보의 처리 목적 및 처리 항목)",
    body: (
      <>
        <p>
          ① 운영자는 회원가입·로그인 기능을 운영하지 않으며, 서비스 이용을 위해 이름·연락처·이메일·학교 등 개인정보를
          요구하거나 운영자의 서버에 수집·저장하지 않습니다.
        </p>
        <p>② 다만, 서비스를 제공하는 과정에서 다음 정보가 처리될 수 있습니다.</p>
        <div className="legal-table">
          <table>
            <thead>
              <tr>
                <th>구분</th>
                <th>처리 항목</th>
                <th>처리 목적</th>
                <th>처리 방식</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>접속 기록</td>
                <td>접속 IP 주소, 접속 일시, 브라우저·기기 정보(User-Agent), 요청한 페이지 주소</td>
                <td>웹페이지 전송, 오류 확인, 부정 이용 방지</td>
                <td>호스팅 사업자 서버에 자동 기록 (운영자는 별도로 수집·보관하지 않음)</td>
              </tr>
              <tr>
                <td>책 검색어</td>
                <td>이용자가 검색창에 입력한 단어</td>
                <td>책 검색 결과 제공</td>
                <td>검색 제공자(카카오, Google)에 전달 후 결과만 화면에 표시, 운영자는 저장하지 않음</td>
              </tr>
              <tr>
                <td>표지 이미지 주소</td>
                <td>선택한 책의 표지 이미지 URL</td>
                <td>카드 이미지 저장 시 표지 표시(브라우저 보안 제한 우회)</td>
                <td>운영자의 서버리스 함수가 일시적으로 중계, 저장하지 않음</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          ③ 검색어와 표지 주소는 그 자체로 개인을 알아볼 수 있는 정보가 아니지만, 이용자는 검색창이나 카드에 자신 또는
          다른 사람의 이름·학교·전화번호·주소 등 개인정보를 입력하지 않도록 유의해 주세요.
        </p>
      </>
    ),
  },
  {
    id: "p2",
    title: "제2조 (이용자 기기에 저장되는 정보)",
    body: (
      <>
        <p>
          ① 카드 작성 내용(선택한 책 정보, 캐릭터 내용, 소개 글, 질문과 답, 첨부한 사진, 직접 그린 그림)과 언어·테마
          설정은 이용자 브라우저의 로컬 저장소(localStorage)에만 저장되며, 운영자의 서버로 전송되지 않습니다. 운영자는
          이 정보를 볼 수 없습니다.
        </p>
        <p>② 이 정보는 이용자가 지울 때까지 기기에 남아 있으며, 다음 방법으로 언제든지 삭제할 수 있습니다.</p>
        <ul>
          <li>화면 오른쪽 위 ⋮(더보기) 메뉴 → ‘모두 초기화’</li>
          <li>브라우저 설정에서 이 사이트의 데이터(사이트 데이터·캐시) 삭제</li>
        </ul>
        <p>
          ③ 학교 컴퓨터 등 여러 사람이 함께 쓰는 기기에서는 작업을 마친 뒤 ‘모두 초기화’를 해 주세요.
        </p>
        <p>
          ④ ‘작업 파일로 저장’ 기능으로 만든 파일(JSON)과 내려받은 카드 이미지는 이용자 기기에 저장되며, 그 관리는
          이용자에게 있습니다.
        </p>
      </>
    ),
  },
  {
    id: "p3",
    title: "제3조 (카메라 및 사진의 이용)",
    body: (
      <>
        <p>
          ① ‘표지 사진으로 찾기’를 이용하면 브라우저가 카메라 접근 권한을 요청합니다. 허용하지 않아도 다른 기능은 그대로
          이용할 수 있으며, 권한은 브라우저 설정에서 언제든지 철회할 수 있습니다.
        </p>
        <p>
          ② 촬영하거나 올린 표지 사진은 이용자 기기 안에서 글자 인식(OCR, Tesseract.js)으로만 처리되며 서버로 전송·저장되지
          않습니다. 다만 글자 인식 프로그램과 언어 데이터를 내려받기 위해 공개 CDN(jsDelivr)에 접속합니다.
        </p>
        <p>③ 카드에 넣은 사진과 그림도 제2조에 따라 이용자 기기에만 저장됩니다.</p>
      </>
    ),
  },
  {
    id: "p4",
    title: "제4조 (개인정보의 보유 기간 및 파기)",
    body: (
      <>
        <p>
          ① 운영자는 이용자의 개인정보를 수집·보관하지 않으므로 별도로 보유하거나 파기할 개인정보가 없습니다. 접속 기록은
          제6조의 각 사업자가 정한 기간이 지나면 자동으로 삭제됩니다.
        </p>
        <p>
          ② 앞으로 개인정보를 수집하게 되는 경우 이 방침을 개정하여 미리 알리고, 처리 목적이 달성되면 지체 없이
          파기합니다. 전자적 파일은 복구할 수 없는 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.
        </p>
      </>
    ),
  },
  {
    id: "p5",
    title: "제5조 (개인정보의 제3자 제공)",
    body: (
      <p>
        운영자는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 이용자가 ‘공유하기’ 기능으로 카드 이미지를 다른 앱에
        보내는 것은 이용자의 선택에 따라 기기의 공유 기능으로 이루어지며, 운영자는 그 과정에 관여하지 않습니다.
      </p>
    ),
  },
  {
    id: "p6",
    title: "제6조 (외부 서비스 이용 및 개인정보의 국외 이전)",
    body: (
      <>
        <p>
          ① 운영자는 서비스 제공을 위해 다음 외부 서비스를 이용합니다. 이용자의 브라우저가 이들 서비스에 접속하는
          과정에서 접속 정보가 해당 사업자에게 전송되어 처리될 수 있으며, 일부 사업자는 국외에 있습니다(「개인정보 보호법」
          제28조의8).
        </p>
        <div className="legal-table">
          <table>
            <thead>
              <tr>
                <th>사업자 (소재 국가)</th>
                <th>이용 목적</th>
                <th>전송될 수 있는 항목</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <ExtLink href="https://www.netlify.com/privacy/">Netlify, Inc.</ExtLink> (미국)
                </td>
                <td>웹사이트 호스팅, 책 검색·이미지 중계 서버리스 함수 실행</td>
                <td>접속 IP, 접속 일시, 브라우저 정보, 요청 주소(검색어 포함)</td>
              </tr>
              <tr>
                <td>
                  <ExtLink href="https://www.kakao.com/policy/privacy">㈜카카오</ExtLink> (대한민국)
                </td>
                <td>책 검색 데이터·표지 이미지 제공</td>
                <td>검색어(운영자 서버를 거쳐 전달), 표지 이미지를 불러올 때의 접속 IP·브라우저 정보</td>
              </tr>
              <tr>
                <td>
                  <ExtLink href="https://policies.google.com/privacy">Google LLC</ExtLink> (미국)
                </td>
                <td>책 검색 대체 제공(Google Books), 글꼴·아이콘 제공(Google Fonts)</td>
                <td>검색어, 접속 IP, 브라우저 정보</td>
              </tr>
              <tr>
                <td>
                  <ExtLink href="https://www.jsdelivr.com/terms/privacy-policy-jsdelivr-net">jsDelivr</ExtLink>{" "}
                  (폴란드, 전 세계 CDN)
                </td>
                <td>글꼴(Pretendard), 글자 인식 프로그램·언어 데이터 제공</td>
                <td>접속 IP, 브라우저 정보</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ul>
          <li>이전 시기 및 방법: 서비스에 접속하거나 해당 기능을 이용할 때 정보통신망을 통해 전송</li>
          <li>보유·이용 기간: 각 사업자의 개인정보 처리방침에 따름 (사업자 이름을 누르면 확인할 수 있습니다)</li>
          <li>
            거부 방법 및 효과: 국외 이전을 원하지 않으면 서비스 이용을 중단할 수 있습니다. 이 경우 서비스를 이용할 수
            없습니다.
          </li>
        </ul>
        <p>② 운영자는 개인정보 처리 업무를 별도로 위탁하지 않습니다.</p>
      </>
    ),
  },
  {
    id: "p7",
    title: "제7조 (개인정보 자동 수집 장치의 설치·운영 및 거부)",
    body: (
      <>
        <p>
          ① 운영자는 쿠키(cookie)를 사용하지 않으며, 광고 식별자나 웹 로그 분석 도구 등으로 이용자의 행태정보를 수집하지
          않습니다.
        </p>
        <p>
          ② 작업 내용 자동 저장을 위해 브라우저의 로컬 저장소를 사용합니다(제2조). 브라우저 설정에서 사이트 데이터 저장을
          차단할 수 있으나, 이 경우 자동 저장과 이어 하기 기능을 이용할 수 없습니다.
        </p>
      </>
    ),
  },
  {
    id: "p8",
    title: "제8조 (만 14세 미만 아동의 개인정보)",
    body: (
      <>
        <p>
          ① 서비스는 초등학생 등 어린이의 이용을 고려하여 만들어졌으며, 어린이의 개인정보를 수집하지 않으므로 법정대리인의
          동의 절차(「개인정보 보호법」 제22조의2)를 두고 있지 않습니다.
        </p>
        <p>
          ② 앞으로 만 14세 미만 아동의 개인정보를 처리하게 되는 경우 법정대리인의 동의를 받습니다. 어린이가 서비스를 이용할
          때에는 보호자나 선생님이 함께 지도해 주시기를 권장합니다.
        </p>
      </>
    ),
  },
  {
    id: "p9",
    title: "제9조 (정보주체와 법정대리인의 권리·의무 및 행사 방법)",
    body: (
      <>
        <p>
          ① 정보주체는 운영자에게 언제든지 개인정보 열람·정정·삭제·처리정지 요구 및 동의 철회 등의 권리를 행사할 수
          있습니다(「개인정보 보호법」 제35조부터 제37조까지).
        </p>
        <p>
          ② 운영자가 보관하는 개인정보는 없으나, 권리 행사나 문의는 제11조의 연락처로 할 수 있으며 운영자는 지체 없이
          조치합니다. 법정대리인이나 위임을 받은 사람을 통해서도 할 수 있습니다.
        </p>
        <p>③ 이용자 기기에 저장된 정보는 이용자가 직접 확인·수정·삭제할 수 있습니다(제2조).</p>
      </>
    ),
  },
  {
    id: "p10",
    title: "제10조 (개인정보의 안전성 확보 조치)",
    body: (
      <ul>
        <li>최소 처리: 서비스에 필요하지 않은 개인정보는 처음부터 수집하지 않습니다.</li>
        <li>전송 구간 암호화: 모든 통신은 HTTPS로 암호화됩니다.</li>
        <li>접근 통제: 외부 API 키는 서버 환경변수로만 관리하여 브라우저에 노출하지 않습니다.</li>
        <li>기기 내 처리: 사진 글자 인식과 카드 이미지 만들기는 이용자 기기 안에서 처리합니다.</li>
      </ul>
    ),
  },
  {
    id: "p11",
    title: "제11조 (개인정보 보호책임자 및 열람청구 접수)",
    body: (
      <>
        <p>
          운영자는 개인정보 처리에 관한 업무를 총괄하고, 관련 문의·불만·피해 구제를 처리하기 위하여 아래와 같이 개인정보
          보호책임자를 지정하고 있습니다. 개인정보 열람청구도 아래로 접수할 수 있습니다.
        </p>
        <ul>
          <li>개인정보 보호책임자: {LEGAL.operator} (서비스 운영자)</li>
          <li>
            연락처: <ExtLink href={LEGAL.contactUrl}>litt.ly/chichiboo</ExtLink> (문의 채널)
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "p12",
    title: "제12조 (권익침해 구제 방법)",
    body: (
      <>
        <p>
          정보주체는 개인정보 침해로 인한 구제를 받기 위하여 아래 기관에 분쟁 해결이나 상담을 신청할 수 있습니다.
        </p>
        <ul>
          <li>
            개인정보분쟁조정위원회: (국번 없이) 1833-6972 (<ExtLink href="https://www.kopico.go.kr">www.kopico.go.kr</ExtLink>)
          </li>
          <li>
            개인정보침해신고센터: (국번 없이) 118 (<ExtLink href="https://privacy.kisa.or.kr">privacy.kisa.or.kr</ExtLink>)
          </li>
          <li>
            대검찰청: (국번 없이) 1301 (<ExtLink href="https://www.spo.go.kr">www.spo.go.kr</ExtLink>)
          </li>
          <li>
            경찰청: (국번 없이) 182 (<ExtLink href="https://ecrm.police.go.kr">ecrm.police.go.kr</ExtLink>)
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "p13",
    title: "제13조 (개인정보 처리방침의 변경)",
    body: (
      <>
        <p>① 이 개인정보 처리방침은 {LEGAL.privacyEffectiveDate}부터 적용됩니다.</p>
        <p>
          ② 내용이 추가·삭제·수정되는 경우 시행 7일 전부터(이용자 권리에 중요한 변경은 30일 전부터) 서비스 화면을 통해
          알립니다.
        </p>
        <p>
          ③ 그 밖에 가명정보 처리, 자동화된 결정, 추가적인 이용·제공은 해당 사항이 없습니다.
        </p>
      </>
    ),
  },
];

export default function Privacy() {
  return (
    <LegalLayout
      title="개인정보 처리방침"
      effectiveDate={LEGAL.privacyEffectiveDate}
      intro={
        <>
          <p>
            {LEGAL.operator}(이하 ‘운영자’)은 「개인정보 보호법」 제30조에 따라 웹앱 ‘{LEGAL.serviceName}’(이하 ‘서비스’)
            이용자의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보
            처리방침을 수립·공개합니다.
          </p>

          <div>
            <p className="font-bold mb-2">한눈에 보기</p>
            <ul className="!list-none !pl-0 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUMMARY.map((s) => (
                <li key={s.label} className="rounded-2xl border border-border bg-card p-3 flex flex-col gap-1">
                  <Icon name={s.icon} size={22} className="text-primary-strong" />
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <span className="text-sm font-bold leading-snug">{s.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-primary/15 border border-primary/30 p-4 space-y-1.5">
            <p className="font-bold flex items-center gap-1.5">
              <Icon name="child_care" size={20} className="text-primary-strong" />
              어린이 친구들에게
            </p>
            <p className="text-sm">
              책임은 여러분의 이름, 학교, 전화번호를 묻지 않아요. 여러분이 만든 카드는 지금 쓰고 있는 기기에만 저장되고,
              치수쌤도 볼 수 없어요. 카드나 검색창에는 내 이름·학교·전화번호·주소·얼굴 사진처럼 나를 알아볼 수 있는 정보를
              적지 않도록 해요.
            </p>
          </div>
        </>
      }
      sections={sections}
      outro={
        <p className="text-sm text-muted-foreground pt-4 border-t border-border">
          서비스 이용 조건은 <Link to="/terms">이용약관</Link>에서 확인할 수 있습니다.
        </p>
      }
    />
  );
}
