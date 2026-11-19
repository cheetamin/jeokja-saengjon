import {useState} from 'react';

const topics: [RegExp, string[]][] = [
  [/친구|또래|다툼|말다툼|갈등|사과|화해/, ['친구 관계 상담', '갈등 상황과 대처 방법 지도', '서로의 입장 이해하기']],
  [/숙제|과제|공부|학습|수업|읽기|학업/, ['학습 상황 상담', '학습 습관 점검', '학습 참여 지원 방안']],
  [/결석|지각|등교|출결|조퇴/, ['학교 출결 상담', '등교 상황 점검', '학교생활 적응 지원']],
  [/불안|속상|걱정|긴장|우울|감정|마음/, ['정서 상태 상담', '감정 표현과 대처 방법 지도', '정서 지원 방안 협의']],
  [/학교폭력|괴롭힘|따돌림|위협|안전/, ['학생 안전 관련 상담', '학교생활 어려움 확인', '학생 보호 및 지원 방안 협의']],
  [/규칙|교실|생활지도|차례|질서/, ['학교생활 상담', '교실 생활 약속 점검', '생활 습관과 실천 방법 지도']],
  [/보호자|학부모|가정/, ['보호자 상담', '학교생활과 가정 연계 상담', '학생 지원 방안 협의']],
];
const generic = ['상담 내용 정리', '현재 상황과 지원 방안 점검', '상담 및 후속 지도 계획', '학교생활 지원 상담', '상담 내용과 실천 방안'];
const compact = (text: string) => text.normalize('NFKC').replace(/\s/g, '').toLowerCase();

export function suggestTitles(content: string, names: string[]) {
  const normalizedNames = [...new Set(names.map(compact).filter(Boolean))].sort((a, b) => b.length - a.length);
  let analysis = compact(content);
  for (const name of normalizedNames) analysis = analysis.replaceAll(name, ' ');
  const ranked = topics.map(([pattern, titles]) => ({
    titles,
    score: [...analysis.matchAll(new RegExp(pattern.source, 'g'))].length,
  })).filter(topic => topic.score).sort((a, b) => b.score - a.score);
  return [...new Set([...ranked.flatMap(topic => topic.titles), ...generic])]
    .filter(title => !normalizedNames.some(name => compact(title).includes(name)))
    .slice(0, 3);
}

export default function TitleSuggestions({content, names, onSelect}: {
  content: string;
  names: string[];
  onSelect: (title: string) => void;
}) {
  const [shown, setShown] = useState(false);
  const titles = shown && content.trim() ? suggestTitles(content, names) : [];
  return <div className="field">
    <button type="button" disabled={!content.trim()} aria-expanded={shown && !!content.trim()} onClick={() => setShown(true)}>
      제목 추천
    </button>
    <small>이 기기에서 상담 주제를 분석합니다. 제목에는 이름과 원문을 넣지 않습니다.</small>
    {shown && content.trim() && <div className="actions" aria-label="추천 제목">
      {titles.length ? titles.map(title => <button key={title} type="button" onClick={() => {
        onSelect(title);
        setShown(false);
      }}>{title}</button>) : <small role="status">추천할 제목이 없습니다. 제목을 직접 입력해 주세요.</small>}
    </div>}
  </div>;
}
