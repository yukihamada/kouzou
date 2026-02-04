import { jsPDF } from 'jspdf'
import type { DetailedDiagnosisResult } from '@/types/diagnosis'
import type { ReinforcementPlan } from '@/types/reinforcement'
import type { SimpleDiagnosisResult } from '@/types/simple-diagnosis'
import type { WallSegment } from '@/types/wall'
import type { DeteriorationItem } from '@/types/deterioration'
import type { SimpleReportContent, DetailedReportContent, ReinforcementPlanContent } from '@/lib/report/types'
import { buildSimpleReportContent } from '@/lib/report/simple-report-content'
import { buildDetailedReportContent } from '@/lib/report/detailed-report-content'
import {
  loadFont,
  setupFont,
  addHeader,
  addFooter,
  drawSectionTitle,
  drawKeyValue,
  drawTableHeader,
  drawTrafficLight,
  drawProgressBar,
  checkPageBreak,
} from './pdf-primitives'

// ===== 簡易診断レポート =====

export async function generateSimpleReport(
  result: SimpleDiagnosisResult
): Promise<Blob> {
  const content = buildSimpleReportContent(result)
  const doc = new jsPDF('p', 'mm', 'a4')
  await loadFont(doc)

  const headerTitle = '簡易耐震診断 結果レポート'

  renderSimpleReport(doc, content, headerTitle)

  doc.setProperties({
    title: '簡易耐震診断レポート',
    creator: '耐震診断くん',
  })

  return doc.output('blob')
}

function renderSimpleReport(
  doc: jsPDF,
  content: SimpleReportContent,
  headerTitle: string
) {
  addHeader(doc, headerTitle)
  let y = 40

  // ① 総合判定ランク
  y = drawSectionTitle(doc, y, '① 総合判定')
  setupFont(doc)

  // 信号機
  drawTrafficLight(doc, 17, y, content.overallRating.trafficLight.color)
  doc.setFontSize(24)
  doc.text(
    `${content.overallRating.score}/${content.overallRating.maxScore} 点`,
    40,
    y + 8
  )
  doc.setFontSize(16)
  doc.text(content.overallRating.ratingLabelJa, 90, y + 8)
  y += 25

  // ② 建物基本データ
  y = drawSectionTitle(doc, y, '② 建物基本データ')
  for (const item of content.buildingData.items) {
    const prefix = item.warning ? '▲ ' : ''
    y = drawKeyValue(doc, y, `${prefix}${item.labelJa}`, item.valueJa)
    y = checkPageBreak(doc, y, 260, headerTitle)
  }
  y += 3

  // ③ 不合格チェック項目
  y = checkPageBreak(doc, y, 240, headerTitle)
  y = drawSectionTitle(doc, y, '③ リスクが見つかった項目')
  if (content.failedChecks.length === 0) {
    setupFont(doc)
    doc.setFontSize(9)
    doc.text('すべての項目で問題は見られませんでした。', 17, y)
    y += 8
  } else {
    for (const check of content.failedChecks) {
      y = checkPageBreak(doc, y, 250, headerTitle)
      setupFont(doc)
      doc.setFontSize(9)
      doc.setTextColor(220, 38, 38)
      doc.text(`問${check.questionNumber}. ${check.questionJa}`, 17, y)
      doc.setTextColor(0, 0, 0)
      y += 5
      const lines = doc.splitTextToSize(check.riskDescriptionJa, 170)
      doc.setFontSize(8)
      doc.text(lines, 20, y)
      y += lines.length * 4 + 3
    }
  }
  y += 3

  // ④ 過去の地震との比較
  y = checkPageBreak(doc, y, 220, headerTitle)
  y = drawSectionTitle(doc, y, '④ 過去の大地震との比較')
  for (const eq of content.earthquakeComparison) {
    y = checkPageBreak(doc, y, 248, headerTitle)
    setupFont(doc)
    doc.setFontSize(9)
    doc.text(`${eq.name}（${eq.year}年, M${eq.magnitude}, ${eq.maxIntensity}）`, 17, y)
    y += 5
    doc.setFontSize(7)
    doc.setTextColor(100, 100, 100)
    doc.text(eq.casualties, 20, y)
    doc.setTextColor(0, 0, 0)
    y += 4
    doc.setFontSize(8)
    const lines = doc.splitTextToSize(eq.riskDescriptionJa, 168)
    doc.text(lines, 20, y)
    y += lines.length * 4 + 3
  }
  y += 3

  // ⑤ 今後のロードマップ
  y = checkPageBreak(doc, y, 230, headerTitle)
  y = drawSectionTitle(doc, y, '⑤ 今後のロードマップ')
  for (const step of content.roadmap) {
    y = checkPageBreak(doc, y, 255, headerTitle)
    setupFont(doc)
    doc.setFontSize(10)
    doc.text(`${step.order}. ${step.titleJa}`, 17, y)
    y += 5
    doc.setFontSize(8)
    const lines = doc.splitTextToSize(step.descriptionJa, 168)
    doc.text(lines, 22, y)
    y += lines.length * 4 + 3
  }

  addFooter(doc, doc.getNumberOfPages())
}

// ===== 精密診断レポート =====

export async function generateDetailedReport(
  result: DetailedDiagnosisResult,
  reinforcementPlan: ReinforcementPlan | null,
  walls: WallSegment[] = [],
  deteriorationItems: DeteriorationItem[] = []
): Promise<Blob> {
  const content = buildDetailedReportContent(
    result,
    reinforcementPlan,
    walls,
    deteriorationItems
  )
  const doc = new jsPDF('p', 'mm', 'a4')
  await loadFont(doc)

  renderDetailedReport(doc, content)

  doc.setProperties({
    title: '精密診断レポート',
    creator: '耐震診断くん',
  })

  return doc.output('blob')
}

function renderDetailedReport(doc: jsPDF, content: DetailedReportContent) {
  // === ページ1: 表紙・サマリー ===
  renderCoverPage(doc, content)

  // === ページ2: 壁の量・配置 ===
  doc.addPage()
  renderWallDetailPage(doc, content)

  // === ページ3: 接合部・劣化 ===
  doc.addPage()
  renderJointAndDeteriorationPage(doc, content)

  // === 補強計画ページ ===
  if (content.reinforcement.planA || content.reinforcement.planB) {
    doc.addPage()
    renderReinforcementPage(doc, content)
  }

  // === 行政情報ページ ===
  doc.addPage()
  renderAdministrativePage(doc, content)

  // === 免責ページ ===
  doc.addPage()
  renderDisclaimerPage(doc, content)
}

// --- 精密レポート各ページの描画 ---

function renderCoverPage(doc: jsPDF, content: DetailedReportContent) {
  const headerTitle = '精密診断（一般診断法） 結果レポート'
  addHeader(doc, headerTitle)
  let y = 40

  // 大きなIw表示
  y = drawSectionTitle(doc, y, '総合評点')
  setupFont(doc)
  doc.setFontSize(28)
  doc.text(`Iw = ${content.cover.iwScore.toFixed(2)}`, 17, y + 5)
  doc.setFontSize(16)
  doc.text(`判定: ${content.cover.ratingLabelJa}`, 85, y + 5)
  y += 13
  doc.setFontSize(9)
  doc.text(content.cover.ratingDescriptionJa, 17, y)
  y += 10

  // 評価基準の凡例
  y = drawSectionTitle(doc, y, '評価基準')
  doc.setFontSize(8)
  const criteria = [
    'Iw ≧ 1.5：倒壊しない',
    '1.0 ≦ Iw < 1.5：一応倒壊しない',
    '0.7 ≦ Iw < 1.0：倒壊する可能性がある',
    'Iw < 0.7：倒壊する可能性が高い',
  ]
  for (const c of criteria) {
    doc.text(c, 17, y)
    y += 5
  }
  y += 5

  // 建物概要
  y = drawSectionTitle(doc, y, '建物情報')
  for (const item of content.cover.buildingOverview) {
    y = drawKeyValue(doc, y, item.labelJa, item.valueJa)
  }
  y += 5

  // 方向別・階別結果テーブル（結果のdirectionalResultsから直接描画）
  y = checkPageBreak(doc, y, 230, headerTitle)
  y = drawSectionTitle(doc, y, '方向別・階別 詳細')

  const cols = ['階', '方向', 'Qu(kN)', 'Qr(kN)', '偏心率', 'eKfl', 'dK', 'Iw', '判定']
  const colX = [17, 30, 45, 65, 85, 103, 118, 133, 150]
  y = drawTableHeader(doc, y, cols, colX)

  for (const row of content.cover.directionalResults) {
    doc.setFontSize(8)
    setupFont(doc)
    doc.text(`${row.floor}F`, colX[0], y)
    doc.text(row.direction, colX[1], y)
    doc.text(row.qu.toFixed(1), colX[2], y)
    doc.text(row.qr.toFixed(1), colX[3], y)
    doc.text(row.eccentricityRatio.toFixed(3), colX[4], y)
    doc.text(row.eccentricityFactor.toFixed(2), colX[5], y)
    doc.text(row.deteriorationFactor.toFixed(2), colX[6], y)
    doc.text(row.iw.toFixed(2), colX[7], y)
    doc.text(row.ratingLabelJa, colX[8], y)
    y += 5
  }

  addFooter(doc, 1)
}

function renderWallDetailPage(doc: jsPDF, content: DetailedReportContent) {
  const headerTitle = 'B-1. 壁の量 / B-2. 壁の配置バランス'
  addHeader(doc, headerTitle)
  let y = 40

  // B-1 壁の量
  y = drawSectionTitle(doc, y, 'B-1. 必要壁量 vs 存在壁量')
  const wCols = ['階・方向', '壁長(m)', '保有耐力(kN)', '必要耐力(kN)', '充足率']
  const wColX = [17, 50, 80, 115, 150]
  y = drawTableHeader(doc, y, wCols, wColX)

  for (const row of content.wallQuantity.rows) {
    doc.setFontSize(8)
    setupFont(doc)
    doc.text(row.labelJa, wColX[0], y)
    doc.text(row.totalLength.toFixed(1), wColX[1], y)
    doc.text(row.totalStrength.toFixed(1), wColX[2], y)
    doc.text(row.required.toFixed(1), wColX[3], y)
    doc.text(`${(row.ratio * 100).toFixed(0)}%`, wColX[4], y)
    y += 5
    // 充足率バー
    drawProgressBar(doc, 50, y, 80, 3, row.ratio)
    y += 7
  }
  y += 5

  // B-2 壁の配置バランス
  y = drawSectionTitle(doc, y, 'B-2. 壁の配置バランス（偏心率）')

  const eCols = ['階', '方向', '偏心率 Re', '低減係数 eKfl', '判定']
  const eColX = [17, 40, 65, 105, 145]
  y = drawTableHeader(doc, y, eCols, eColX)

  for (const row of content.wallBalance.rows) {
    doc.setFontSize(8)
    setupFont(doc)
    doc.text(`${row.floor}F`, eColX[0], y)
    doc.text(row.direction, eColX[1], y)
    doc.text(row.eccentricityRatio.toFixed(3), eColX[2], y)
    doc.text(row.eccentricityFactor.toFixed(2), eColX[3], y)
    doc.text(row.judgmentJa, eColX[4], y)
    y += 5
  }
  y += 5

  // 偏心率の説明
  doc.setFontSize(8)
  setupFont(doc)
  const explLines = doc.splitTextToSize(content.wallBalance.explanationJa, 175)
  doc.text(explLines, 17, y)
  y += explLines.length * 4

  addFooter(doc, doc.getNumberOfPages())
}

function renderJointAndDeteriorationPage(
  doc: jsPDF,
  content: DetailedReportContent
) {
  const headerTitle = 'B-3. 接合部 / B-4. 劣化度'
  addHeader(doc, headerTitle)
  let y = 40

  // B-3 接合部の仕様
  y = drawSectionTitle(doc, y, 'B-3. 接合部の仕様')
  if (content.joints.totalCount === 0) {
    setupFont(doc)
    doc.setFontSize(9)
    doc.text('壁データが未入力のため、接合部の集計はできません。', 17, y)
    y += 8
  } else {
    const jCols = ['接合部仕様', '本数', '割合']
    const jColX = [17, 110, 145]
    y = drawTableHeader(doc, y, jCols, jColX)

    for (const row of content.joints.rows) {
      if (row.count === 0) continue
      doc.setFontSize(8)
      setupFont(doc)
      doc.text(row.labelJa, jColX[0], y)
      doc.text(`${row.count}`, jColX[1], y)
      doc.text(`${row.percentage.toFixed(0)}%`, jColX[2], y)
      y += 5
    }
    doc.setFontSize(8)
    doc.text(`合計: ${content.joints.totalCount}箇所`, 17, y + 2)
    y += 10
  }

  // B-4 劣化度
  y = drawSectionTitle(doc, y, 'B-4. 劣化度評価')
  y = drawKeyValue(
    doc,
    y,
    '劣化低減係数 dK',
    content.deterioration.dK.toFixed(2)
  )
  y = drawKeyValue(
    doc,
    y,
    '劣化点数 / 存在点数',
    `${content.deterioration.totalDeteriorationPoints} / ${content.deterioration.totalExistencePoints}`
  )
  y += 3

  // カテゴリ別内訳
  if (content.deterioration.categories.length > 0) {
    y = drawSectionTitle(doc, y, '劣化 カテゴリ別内訳')
    const dCols = ['部位', '該当数/項目数', '指摘事項']
    const dColX = [17, 70, 110]
    y = drawTableHeader(doc, y, dCols, dColX)

    for (const cat of content.deterioration.categories) {
      y = checkPageBreak(doc, y, 260, headerTitle)
      doc.setFontSize(8)
      setupFont(doc)
      doc.text(cat.labelJa, dColX[0], y)
      doc.text(`${cat.checkedCount}/${cat.totalCount}`, dColX[1], y)
      const itemsText = cat.itemLabels.length > 0 ? cat.itemLabels.join(', ') : '—'
      const itemLines = doc.splitTextToSize(itemsText, 80)
      doc.text(itemLines, dColX[2], y)
      y += Math.max(5, itemLines.length * 4) + 1
    }
  }

  addFooter(doc, doc.getNumberOfPages())
}

function renderReinforcementPlanSection(
  doc: jsPDF,
  plan: ReinforcementPlanContent,
  y: number,
  headerTitle: string
): number {
  y = drawSectionTitle(doc, y, plan.targetLabelJa)
  y = drawKeyValue(doc, y, '現状 Iw', plan.currentIw.toFixed(2))
  y = drawKeyValue(doc, y, '補強後 Iw（見込み）', plan.estimatedIwAfter.toFixed(2))
  y += 3

  if (plan.suggestions.length > 0) {
    const rCols = ['優先度', '工法', '数量', '概算費用', '理由']
    const rColX = [17, 35, 90, 105, 140]
    y = drawTableHeader(doc, y, rCols, rColX)

    for (const s of plan.suggestions) {
      y = checkPageBreak(doc, y, 260, headerTitle)
      doc.setFontSize(8)
      setupFont(doc)
      const priorityJa: Record<string, string> = { high: '高', medium: '中', low: '低' }
      doc.text(priorityJa[s.priority] || s.priority, rColX[0], y)
      doc.text(s.labelJa, rColX[1], y)
      doc.text(s.quantity, rColX[2], y)
      doc.text(s.costRange, rColX[3], y)
      const reasonLines = doc.splitTextToSize(s.reason, 52)
      doc.text(reasonLines, rColX[4], y)
      y += Math.max(5, reasonLines.length * 4) + 2
    }

    y += 3
    setupFont(doc)
    doc.setFontSize(10)
    doc.text(`概算合計: ${plan.totalCostRange}`, 17, y)
    y += 8
  }

  doc.setFontSize(8)
  doc.text(
    '※ 概算費用は一般的な相場に基づく参考値です。実際の費用は建物の状態・施工条件等により変動します。',
    17,
    y
  )
  y += 8

  return y
}

function renderReinforcementPage(doc: jsPDF, content: DetailedReportContent) {
  const headerTitle = 'C. 補強計画'
  addHeader(doc, headerTitle)
  let y = 40

  y = drawSectionTitle(doc, y, '補強計画')
  setupFont(doc)
  doc.setFontSize(9)
  doc.text('2つのプランを提示します。予算と目標に応じてお選びください。', 17, y)
  y += 8

  // Plan A
  if (content.reinforcement.planA) {
    y = renderReinforcementPlanSection(doc, content.reinforcement.planA, y, headerTitle)
    y = checkPageBreak(doc, y, 200, headerTitle)
  }

  // Plan B
  if (content.reinforcement.planB) {
    y = renderReinforcementPlanSection(doc, content.reinforcement.planB, y, headerTitle)
  }

  addFooter(doc, doc.getNumberOfPages())
}

function renderAdministrativePage(doc: jsPDF, content: DetailedReportContent) {
  const headerTitle = 'D. 行政情報'
  addHeader(doc, headerTitle)
  let y = 40

  // ハザードマップ
  y = drawSectionTitle(doc, y, 'ハザードマップ情報')
  setupFont(doc)
  doc.setFontSize(8)
  const hazardLines = doc.splitTextToSize(content.administrative.hazardMapNote, 175)
  doc.text(hazardLines, 17, y)
  y += hazardLines.length * 4 + 8

  // 補助金情報
  y = drawSectionTitle(doc, y, '自治体補助金制度')
  doc.setFontSize(8)
  const subsidyLines = doc.splitTextToSize(
    content.administrative.subsidyTemplateJa,
    175
  )
  doc.text(subsidyLines, 17, y)

  addFooter(doc, doc.getNumberOfPages())
}

function renderDisclaimerPage(doc: jsPDF, content: DetailedReportContent) {
  addHeader(doc, '免責事項')
  let y = 45
  setupFont(doc)
  doc.setFontSize(10)

  for (let i = 0; i < content.disclaimer.items.length; i++) {
    doc.text(`${i + 1}. ${content.disclaimer.items[i]}`, 17, y)
    y += 7
  }
  y += 5
  doc.text('参考基準:', 17, y)
  y += 7

  for (const ref of content.disclaimer.references) {
    doc.text(`- ${ref}`, 17, y)
    y += 7
  }

  addFooter(doc, doc.getNumberOfPages())
}
