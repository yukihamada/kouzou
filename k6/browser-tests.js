import { browser } from 'k6/browser';
import { check } from 'k6';
import { Trend, Counter } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3456';

const pageLoadTime = new Trend('page_load_time');
const testsPassed = new Counter('tests_passed');
const testsFailed = new Counter('tests_failed');

export const options = {
  scenarios: {
    ui: {
      executor: 'shared-iterations',
      vus: 1,
      iterations: 1,
      options: {
        browser: {
          type: 'chromium',
        },
      },
    },
  },
  thresholds: {
    checks: ['rate==1.0'],
    tests_failed: ['count==0'],
  },
};

// Helper: check page content contains text
async function pageContains(page, text) {
  const content = await page.content();
  return content.includes(text);
}

// Helper: click button containing text
async function clickButton(page, text) {
  const result = await page.evaluate((btnText) => {
    const buttons = document.querySelectorAll('button');
    const btn = Array.from(buttons).find(b => b.textContent.includes(btnText));
    if (btn && !btn.disabled) {
      btn.click();
      return true;
    }
    return false;
  }, text);
  return result;
}

// Helper: click radio and next
async function answerAndNext(page) {
  await page.evaluate(() => {
    const radios = document.querySelectorAll('[role="radio"]');
    if (radios.length > 0) radios[0].click();
  });
  await page.waitForTimeout(200);
  await clickButton(page, '次の問題');
  await page.waitForTimeout(200);
}

export default async function () {
  const page = await browser.newPage();

  try {
    // Clear any previous session state
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.clear();
    });

    // ========================================
    // Test 1: Home Page Load
    // ========================================
    console.log('--- Test 1: Home Page ---');
    const startHome = Date.now();
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
    pageLoadTime.add(Date.now() - startHome);

    const title = await page.title();
    check(title, {
      'T1-1: Home title contains 耐震': (t) => t.includes('耐震'),
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasHeading = await pageContains(page, '木造住宅');
    check(hasHeading, {
      'T1-2: Home has main heading': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasSimpleBtn = await pageContains(page, '簡易診断を始める');
    check(hasSimpleBtn, {
      'T1-3: Simple diagnosis button exists': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasDetailedBtn = await pageContains(page, '精密診断を始める');
    check(hasDetailedBtn, {
      'T1-4: Detailed diagnosis button exists': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasNav = await pageContains(page, '耐震診断くん');
    check(hasNav, {
      'T1-5: Logo in navigation': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    // ========================================
    // Test 2: Simple Diagnosis Full Flow
    // ========================================
    console.log('--- Test 2: Simple Diagnosis ---');
    const startSimple = Date.now();
    await page.goto(`${BASE_URL}/simple`, { waitUntil: 'networkidle' });
    pageLoadTime.add(Date.now() - startSimple);

    // If previous results exist, click retry to start fresh
    const hasOldResult = await pageContains(page, '簡易診断結果');
    if (hasOldResult) {
      await clickButton(page, '最初からやり直す');
      await page.waitForTimeout(1000);
    }

    const hasQ1 = await pageContains(page, '簡易耐震診断');
    check(hasQ1, {
      'T2-1: Simple diagnosis page loaded': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    // Answer all 10 questions
    for (let i = 0; i < 10; i++) {
      await page.evaluate(() => {
        const radios = document.querySelectorAll('[role="radio"]');
        if (radios.length > 0) radios[0].click();
      });
      await page.waitForTimeout(300);

      const clicked = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button');
        const btn = Array.from(buttons).find(b =>
          b.textContent.includes('次の問題') || b.textContent.includes('診断結果')
        );
        if (btn) { btn.click(); return true; }
        return false;
      });
      await page.waitForTimeout(400);
    }

    await page.waitForTimeout(500);

    const hasResult = await pageContains(page, '簡易診断結果');
    check(hasResult, {
      'T2-2: Result title shown': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasScore = await pageContains(page, '/10');
    check(hasScore, {
      'T2-3: Score (x/10) displayed': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasPdf = await pageContains(page, 'PDF出力');
    check(hasPdf, {
      'T2-4: PDF button visible': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasRetry = await pageContains(page, '最初からやり直す');
    check(hasRetry, {
      'T2-5: Retry button visible': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    // ========================================
    // Test 3: Detailed Step 1 - Building Info
    // ========================================
    console.log('--- Test 3: Step 1 Building Info ---');
    const startS1 = Date.now();
    await page.goto(`${BASE_URL}/detailed/building-info`, { waitUntil: 'networkidle' });
    pageLoadTime.add(Date.now() - startS1);

    const hasStep1 = await pageContains(page, 'Step 1');
    check(hasStep1, {
      'T3-1: Step 1 title': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasConstruction = await pageContains(page, '構法');
    check(hasConstruction, {
      'T3-2: Construction field': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasYear = await pageContains(page, '建築年');
    check(hasYear, {
      'T3-3: Year field': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    // Next to Step 2
    await clickButton(page, '次へ');
    await page.waitForTimeout(1500);

    // ========================================
    // Test 4: Step 2 - Floor Plan
    // ========================================
    console.log('--- Test 4: Step 2 Floor Plan ---');
    const url2 = page.url();
    check(url2, {
      'T4-1: Navigated to floor-plan': (u) => u.includes('floor-plan'),
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasStep2 = await pageContains(page, 'Step 2');
    check(hasStep2, {
      'T4-2: Step 2 title': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasArea = await pageContains(page, '床面積');
    check(hasArea, {
      'T4-3: Floor area shown': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    // Next to Step 3
    await clickButton(page, '次へ');
    await page.waitForTimeout(1500);

    // ========================================
    // Test 5: Step 3 - Wall Spec
    // ========================================
    console.log('--- Test 5: Step 3 Wall Spec ---');
    const url3 = page.url();
    check(url3, {
      'T5-1: Navigated to wall-spec': (u) => u.includes('wall-spec'),
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasAddWall = await pageContains(page, '壁を追加');
    check(hasAddWall, {
      'T5-2: Add wall button': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    // Add 4 walls (1F-X, 1F-Y, 2F-X, 2F-Y)
    await page.evaluate(() => {
      (async () => {
        // 1F-X
        let btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('壁を追加'));
        if (btn) btn.click();
        await new Promise(r => setTimeout(r, 400));

        // Change to Y
        let triggers = document.querySelectorAll('[role="combobox"]');
        triggers[1].click();
        await new Promise(r => setTimeout(r, 200));
        let opt = Array.from(document.querySelectorAll('[role="option"]')).find(o => o.textContent.includes('Y方向'));
        if (opt) opt.click();
        await new Promise(r => setTimeout(r, 200));

        // 1F-Y
        btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('壁を追加'));
        if (btn) btn.click();
        await new Promise(r => setTimeout(r, 400));

        // Change to 2F
        triggers = document.querySelectorAll('[role="combobox"]');
        triggers[0].click();
        await new Promise(r => setTimeout(r, 200));
        opt = Array.from(document.querySelectorAll('[role="option"]')).find(o => o.textContent.includes('2階'));
        if (opt) opt.click();
        await new Promise(r => setTimeout(r, 200));

        // X direction
        triggers = document.querySelectorAll('[role="combobox"]');
        triggers[1].click();
        await new Promise(r => setTimeout(r, 200));
        opt = Array.from(document.querySelectorAll('[role="option"]')).find(o => o.textContent.includes('X方向'));
        if (opt) opt.click();
        await new Promise(r => setTimeout(r, 200));

        // 2F-X
        btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('壁を追加'));
        if (btn) btn.click();
        await new Promise(r => setTimeout(r, 400));

        // Y direction
        triggers = document.querySelectorAll('[role="combobox"]');
        triggers[1].click();
        await new Promise(r => setTimeout(r, 200));
        opt = Array.from(document.querySelectorAll('[role="option"]')).find(o => o.textContent.includes('Y方向'));
        if (opt) opt.click();
        await new Promise(r => setTimeout(r, 200));

        // 2F-Y
        btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('壁を追加'));
        if (btn) btn.click();
      })();
    });
    await page.waitForTimeout(3000);

    const hasWallList = await pageContains(page, '1階 壁一覧');
    check(hasWallList, {
      'T5-3: Wall list displayed': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasStrength = await pageContains(page, 'kN');
    check(hasStrength, {
      'T5-4: Wall strength calculated': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    // Next to Step 4
    await clickButton(page, '次へ');
    await page.waitForTimeout(1500);

    // ========================================
    // Test 6: Step 4 - Deterioration
    // ========================================
    console.log('--- Test 6: Step 4 Deterioration ---');
    const url4 = page.url();
    check(url4, {
      'T6-1: Navigated to deterioration': (u) => u.includes('deterioration'),
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasDk = await pageContains(page, 'dK');
    check(hasDk, {
      'T6-2: dK factor displayed': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasFoundationCat = await pageContains(page, '基礎');
    check(hasFoundationCat, {
      'T6-3: Categories displayed': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    // Next to Step 5
    await clickButton(page, '次へ');
    await page.waitForTimeout(1500);

    // ========================================
    // Test 7: Step 5 - Run Diagnosis
    // ========================================
    console.log('--- Test 7: Step 5 Run Diagnosis ---');
    const url5 = page.url();
    check(url5, {
      'T7-1: Navigated to foundation': (u) => u.includes('foundation'),
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasConfirm = await pageContains(page, '入力データの確認');
    check(hasConfirm, {
      'T7-2: Confirmation section': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const has4Walls = await pageContains(page, '壁数: 4本');
    check(has4Walls, {
      'T7-3: Shows 4 walls': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    // Execute diagnosis
    await clickButton(page, '診断を実行する');
    await page.waitForTimeout(3000);

    // ========================================
    // Test 8: Detailed Result
    // ========================================
    console.log('--- Test 8: Detailed Result ---');
    const urlResult = page.url();
    check(urlResult, {
      'T8-1: Navigated to result': (u) => u.includes('result'),
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasResultTitle = await pageContains(page, '精密診断結果');
    check(hasResultTitle, {
      'T8-2: Result title': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasIw = await pageContains(page, '上部構造評点');
    check(hasIw, {
      'T8-3: Iw score label': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasDirectional = await pageContains(page, '方向別');
    check(hasDirectional, {
      'T8-4: Directional table': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasWallSummary = await pageContains(page, '壁量サマリー');
    check(hasWallSummary, {
      'T8-5: Wall summary': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasRating = await pageContains(page, '倒壊');
    check(hasRating, {
      'T8-6: Rating badge': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    // ========================================
    // Test 9: Reinforcement Page
    // ========================================
    console.log('--- Test 9: Reinforcement ---');
    await clickButton(page, '補強提案');
    await page.waitForTimeout(1500);

    const urlReinforce = page.url();
    check(urlReinforce, {
      'T9-1: Navigated to reinforcement': (u) => u.includes('reinforcement'),
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasReinforce = await pageContains(page, '補強提案');
    check(hasReinforce, {
      'T9-2: Reinforcement title': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasCurrent = await pageContains(page, '現状');
    check(hasCurrent, {
      'T9-3: Current gauge': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasAfter = await pageContains(page, '補強後');
    check(hasAfter, {
      'T9-4: After gauge': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasCost = await pageContains(page, '概算合計');
    check(hasCost, {
      'T9-5: Cost total': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    // ========================================
    // Test 10: Report Page
    // ========================================
    console.log('--- Test 10: Report Page ---');
    const startReport = Date.now();
    await page.goto(`${BASE_URL}/report`, { waitUntil: 'networkidle' });
    pageLoadTime.add(Date.now() - startReport);

    const hasReportTitle = await pageContains(page, '診断レポート出力');
    check(hasReportTitle, {
      'T10-1: Report page title': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    const hasPdfDownload = await pageContains(page, 'PDFダウンロード');
    check(hasPdfDownload, {
      'T10-2: PDF download button': (v) => v === true,
    }) ? testsPassed.add(1) : testsFailed.add(1);

    console.log('=== All browser tests completed ===');

  } finally {
    await page.close();
  }
}
