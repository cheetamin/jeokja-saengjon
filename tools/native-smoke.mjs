import {_electron as electron} from '@playwright/test';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import assert from 'node:assert/strict';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'jeokja-native-'));
const app=await electron.launch({executablePath:process.env.JEOKJA_EXECUTABLE,args:[],env:{...process.env,JEOKJA_DATA_DIR:dir},timeout:60000});
try{
 const page=await app.firstWindow();await page.getByRole('button',{name:'보관함 만들기',exact:true}).waitFor();
 await page.getByLabel('보관함 비밀번호',{exact:true}).fill('virtual-test-password-123');await page.getByLabel('비밀번호 확인',{exact:true}).fill('virtual-test-password-123');
 await page.getByRole('button',{name:'보관함 만들기',exact:true}).click();await page.getByRole('button',{name:'설정',exact:true}).click();
 await page.getByRole('button',{name:'가상 학생 3명 등록',exact:true}).click();await page.getByText('3명 재학',{exact:true}).waitFor();
 await page.getByRole('button',{name:'기록하기',exact:true}).click();await page.getByLabel('학생 *',{exact:true}).selectOption({label:'1번 가상하늘'});
 await page.getByLabel('상담 제목 *',{exact:true}).fill('가상 시험 상담');await page.getByLabel('상담 내용 *',{exact:true}).fill('실기기 자동 시험을 위한 가상 상담 내용입니다.');
 await page.getByRole('button',{name:/저장하기/}).click();await page.getByRole('status').filter({hasText:'상담 기록이 저장되었습니다.'}).waitFor();
 const state=await page.evaluate(()=>window.jeokja.call('state'));assert.equal(state.records.length,1);assert.equal(state.records[0].title,'가상 시험 상담');
 assert.ok(fs.existsSync(path.join(dir,'records.jjvault')));assert.ok(!fs.readFileSync(path.join(dir,'records.jjvault'),'utf8').includes('가상 시험 상담'));
 await page.getByRole('navigation').getByRole('button',{name:'기록 조회',exact:true}).click();await page.screenshot({path:'native-windows-smoke.png',fullPage:true});
 console.log('Native Windows app: launch, unlock, virtual roster, record save and encrypted disk storage PASS');
}finally{await app.close();fs.rmSync(dir,{recursive:true,force:true});}
