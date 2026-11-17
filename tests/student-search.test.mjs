import test from 'node:test';import assert from 'node:assert/strict';
import {matchesStudent} from '../src/student-search.mjs';
const p={number:8,name:'김민수'};
test('student names accept whitespace, decomposed Korean and initials',()=>{for(const q of ['김민수',' 김민수 ','김 민 수','민수','김민수'.normalize('NFD'),'ㄱㅁㅅ','ᄀᄆᄉ'])assert.equal(matchesStudent(p,q),true,q);assert.equal(matchesStudent(p,'가상바다'),false)});
test('student number is exact and accepts number suffix or combined name',()=>{for(const q of ['8','08','8번','8번 김민수','8 김민수','8번김민수','8김민수','김민수 8번'])assert.equal(matchesStudent(p,q),true,q);for(const q of ['1','18','18번','8번 가상바다'])assert.equal(matchesStudent(p,q),false,q);assert.equal(matchesStudent({number:18,name:'가상바다'},'8'),false);assert.equal(matchesStudent(p,''),true)});
