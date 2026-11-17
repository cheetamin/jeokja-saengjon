const initials='ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
const normalize=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/\s+/gu,'');
const chosung=name=>Array.from(String(name)).map(c=>{const n=c.codePointAt(0)-0xAC00;return n>=0&&n<11172?initials[Math.floor(n/588)]:c}).join('');
export function matchesStudent(student,query){
  const tokens=String(query??'').trim().split(/\s+/u).filter(Boolean);
  const name=normalize(student.name),initial=normalize(chosung(String(student.name).normalize('NFC')));
  const number=Number(student.number);
  return tokens.every(raw=>{const q=normalize(raw);if(/^\d+(?:번)?$/u.test(q))return number===Number(q.replace(/번$/u,''));return name.includes(q)||initial.includes(q)||normalize(`${number}번${student.name}`).includes(q)||normalize(`${number}${student.name}`).includes(q)});
}
