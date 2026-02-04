import { jsPDF } from 'jspdf'
import type { TrafficLightColor } from '@/lib/report/types'

let fontLoaded = false

export async function loadFont(doc: jsPDF) {
  if (fontLoaded) return
  const { NOTO_SANS_JP_BASE64 } = await import('./font-data')
  doc.addFileToVFS('NotoSansJP-Regular.ttf', NOTO_SANS_JP_BASE64)
  doc.addFont('NotoSansJP-Regular.ttf', 'NotoSansJP', 'normal')
  fontLoaded = true
}

export function setupFont(doc: jsPDF) {
  doc.setFont('NotoSansJP', 'normal')
}

/** ページ管理: y座標がlimitを超えたら改ページして初期y位置を返す */
export function checkPageBreak(
  doc: jsPDF,
  y: number,
  limit: number,
  headerTitle: string
): number {
  if (y > limit) {
    addFooter(doc, doc.getNumberOfPages())
    doc.addPage()
    addHeader(doc, headerTitle)
    return 40
  }
  return y
}

export function addHeader(doc: jsPDF, title: string) {
  doc.setFillColor(24, 24, 27)
  doc.rect(0, 0, 210, 30, 'F')
  setupFont(doc)
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.text('耐震診断くん - 診断レポート', 15, 15)
  doc.setFontSize(11)
  doc.text(title, 15, 24)
  doc.setTextColor(0, 0, 0)
}

export function addFooter(doc: jsPDF, pageNum: number) {
  setupFont(doc)
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(
    '本レポートは参考情報です。正式な耐震診断は建築士等の専門家にご依頼ください。',
    15,
    285
  )
  doc.text(`${pageNum}`, 195, 285, { align: 'right' })
  doc.setTextColor(0, 0, 0)
}

export function drawSectionTitle(doc: jsPDF, y: number, title: string): number {
  setupFont(doc)
  doc.setFontSize(13)
  doc.setFillColor(240, 240, 245)
  doc.rect(15, y - 5, 180, 8, 'F')
  doc.text(title, 17, y)
  return y + 10
}

export function drawKeyValue(
  doc: jsPDF,
  y: number,
  key: string,
  value: string,
  x = 17
): number {
  setupFont(doc)
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(key, x, y)
  doc.setTextColor(0, 0, 0)
  doc.text(value, x + 55, y)
  return y + 6
}

/** テーブルヘッダ行の描画 */
export function drawTableHeader(
  doc: jsPDF,
  y: number,
  columns: string[],
  colX: number[]
): number {
  doc.setFontSize(8)
  doc.setFillColor(230, 230, 235)
  doc.rect(15, y - 4, 180, 6, 'F')
  setupFont(doc)
  columns.forEach((col, i) => {
    doc.text(col, colX[i], y)
  })
  return y + 6
}

/** 信号機アイコンの描画 */
export function drawTrafficLight(
  doc: jsPDF,
  x: number,
  y: number,
  color: TrafficLightColor,
  size = 8
) {
  const colorMap: Record<TrafficLightColor, [number, number, number]> = {
    red: [220, 38, 38],
    yellow: [234, 179, 8],
    green: [22, 163, 74],
  }
  const [r, g, b] = colorMap[color]

  // 外枠
  doc.setDrawColor(100, 100, 100)
  doc.setFillColor(50, 50, 50)
  doc.roundedRect(x, y, size, size * 2.5, 2, 2, 'FD')

  // 3つのライト
  const cx = x + size / 2
  const radius = size * 0.3
  const lights: Array<{ cy: number; active: boolean; activeColor: [number, number, number] }> = [
    { cy: y + size * 0.5, active: color === 'red', activeColor: [220, 38, 38] },
    { cy: y + size * 1.25, active: color === 'yellow', activeColor: [234, 179, 8] },
    { cy: y + size * 2.0, active: color === 'green', activeColor: [22, 163, 74] },
  ]

  for (const light of lights) {
    if (light.active) {
      doc.setFillColor(light.activeColor[0], light.activeColor[1], light.activeColor[2])
    } else {
      doc.setFillColor(80, 80, 80)
    }
    doc.circle(cx, light.cy, radius, 'F')
  }

  // ラベル
  setupFont(doc)
  doc.setFontSize(10)
  doc.setTextColor(r, g, b)
  const labelMap: Record<TrafficLightColor, string> = {
    red: '危険',
    yellow: '注意',
    green: '安全',
  }
  doc.text(labelMap[color], x + size + 4, y + size * 1.25 + 3)
  doc.setTextColor(0, 0, 0)
}

/** 充足率バー（横棒グラフ） */
export function drawProgressBar(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  ratio: number,
  label?: string
) {
  // 背景
  doc.setFillColor(230, 230, 230)
  doc.rect(x, y, width, height, 'F')

  // バー（100%上限で表示）
  const fillWidth = Math.min(ratio, 1.5) / 1.5 * width
  if (ratio >= 1.0) {
    doc.setFillColor(22, 163, 74) // green
  } else if (ratio >= 0.7) {
    doc.setFillColor(234, 179, 8) // yellow
  } else {
    doc.setFillColor(220, 38, 38) // red
  }
  doc.rect(x, y, fillWidth, height, 'F')

  // 100%ライン
  const line100x = x + (1.0 / 1.5) * width
  doc.setDrawColor(0, 0, 0)
  doc.setLineWidth(0.3)
  doc.line(line100x, y - 1, line100x, y + height + 1)

  // ラベル
  if (label) {
    setupFont(doc)
    doc.setFontSize(7)
    doc.setTextColor(0, 0, 0)
    doc.text(label, x + width + 3, y + height - 1)
  }
}

export function formatYen(amount: number): string {
  if (amount >= 10000) {
    return `約${(amount / 10000).toFixed(0)}万円`
  }
  return `${amount.toLocaleString()}円`
}
