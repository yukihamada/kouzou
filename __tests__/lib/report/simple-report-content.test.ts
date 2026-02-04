import { describe, it, expect } from 'vitest'
import { buildSimpleReportContent } from '@/lib/report/simple-report-content'
import type { SimpleDiagnosisResult } from '@/types/simple-diagnosis'

/** 全問正解（safe） */
function makeSafeResult(): SimpleDiagnosisResult {
  return {
    answers: {
      1: '1a', 2: '2a', 3: '3a', 4: '4a', 5: '5a',
      6: '6a', 7: '7a', 8: '8a', 9: '9a', 10: '10a',
    },
    totalScore: 10,
    rating: 'safe',
    recommendDetailedDiagnosis: false,
    messageJa: '現時点では大きな問題は見られません。',
  }
}

/** 8点（caution） */
function makeCautionResult(): SimpleDiagnosisResult {
  return {
    answers: {
      1: '1b', 2: '2b', 3: '3a', 4: '4a', 5: '5a',
      6: '6a', 7: '7a', 8: '8a', 9: '9a', 10: '10a',
    },
    totalScore: 8,
    rating: 'caution',
    recommendDetailedDiagnosis: true,
    messageJa: 'いくつか注意点があります。',
  }
}

/** 5点（danger） */
function makeDangerResult(): SimpleDiagnosisResult {
  return {
    answers: {
      1: '1b', 2: '2b', 3: '3c', 4: '4c', 5: '5b',
      6: '6a', 7: '7a', 8: '8a', 9: '9a', 10: '10a',
    },
    totalScore: 5,
    rating: 'danger',
    recommendDetailedDiagnosis: true,
    messageJa: '精密診断をお勧めします。',
  }
}

describe('buildSimpleReportContent', () => {
  // ① 総合判定ランク
  describe('overallRating section', () => {
    it('returns correct score and maxScore', () => {
      const content = buildSimpleReportContent(makeSafeResult())
      expect(content.overallRating.score).toBe(10)
      expect(content.overallRating.maxScore).toBe(10)
    })

    it('maps safe rating to green traffic light', () => {
      const content = buildSimpleReportContent(makeSafeResult())
      expect(content.overallRating.trafficLight.color).toBe('green')
      expect(content.overallRating.ratingLabelJa).toBe('一応安全')
    })

    it('maps caution rating to yellow traffic light', () => {
      const content = buildSimpleReportContent(makeCautionResult())
      expect(content.overallRating.trafficLight.color).toBe('yellow')
      expect(content.overallRating.ratingLabelJa).toBe('要注意')
    })

    it('maps danger rating to red traffic light', () => {
      const content = buildSimpleReportContent(makeDangerResult())
      expect(content.overallRating.trafficLight.color).toBe('red')
      expect(content.overallRating.ratingLabelJa).toBe('要診断')
    })
  })

  // ② 建物基本データ
  describe('buildingData section', () => {
    it('extracts all 10 answer items', () => {
      const content = buildSimpleReportContent(makeSafeResult())
      expect(content.buildingData.items).toHaveLength(10)
    })

    it('marks items with score=0 as warning', () => {
      const content = buildSimpleReportContent(makeDangerResult())
      const warnings = content.buildingData.items.filter((i) => i.warning)
      // questions 1,2,3,4,5 are answered with 0-score options
      expect(warnings.length).toBe(5)
    })

    it('marks items with score=1 as non-warning', () => {
      const content = buildSimpleReportContent(makeSafeResult())
      const warnings = content.buildingData.items.filter((i) => i.warning)
      expect(warnings).toHaveLength(0)
    })
  })

  // ③ 不合格チェック項目
  describe('failedChecks section', () => {
    it('returns no failed checks for safe result', () => {
      const content = buildSimpleReportContent(makeSafeResult())
      expect(content.failedChecks).toHaveLength(0)
    })

    it('returns failed checks for danger result', () => {
      const content = buildSimpleReportContent(makeDangerResult())
      expect(content.failedChecks.length).toBeGreaterThan(0)
    })

    it('includes question number and risk description', () => {
      const content = buildSimpleReportContent(makeDangerResult())
      for (const item of content.failedChecks) {
        expect(item.questionNumber).toBeGreaterThanOrEqual(1)
        expect(item.questionNumber).toBeLessThanOrEqual(10)
        expect(item.questionJa).toBeTruthy()
        expect(item.riskDescriptionJa).toBeTruthy()
      }
    })

    it('identifies correct failed questions for caution result', () => {
      const content = buildSimpleReportContent(makeCautionResult())
      const failedNums = content.failedChecks.map((f) => f.questionNumber)
      expect(failedNums).toContain(1) // 1b = 旧耐震 (score 0)
      expect(failedNums).toContain(2) // 2b = 被災あり (score 0)
      expect(failedNums).not.toContain(3) // 3a = score 1
    })
  })

  // ④ 過去の地震との比較
  describe('earthquakeComparison section', () => {
    it('returns 5 earthquake items', () => {
      const content = buildSimpleReportContent(makeSafeResult())
      expect(content.earthquakeComparison).toHaveLength(5)
    })

    it('contains known earthquake names', () => {
      const content = buildSimpleReportContent(makeDangerResult())
      const names = content.earthquakeComparison.map((e) => e.name)
      expect(names).toContain('阪神・淡路大震災')
      expect(names).toContain('能登半島地震')
    })
  })

  // ⑤ ロードマップ
  describe('roadmap section', () => {
    it('returns danger roadmap starting with 精密診断', () => {
      const content = buildSimpleReportContent(makeDangerResult())
      expect(content.roadmap.length).toBeGreaterThanOrEqual(3)
      expect(content.roadmap[0].titleJa).toContain('精密診断')
    })

    it('returns caution roadmap starting with 精密診断の検討', () => {
      const content = buildSimpleReportContent(makeCautionResult())
      expect(content.roadmap[0].titleJa).toContain('精密診断')
    })

    it('returns safe roadmap starting with メンテナンス', () => {
      const content = buildSimpleReportContent(makeSafeResult())
      expect(content.roadmap[0].titleJa).toContain('メンテナンス')
    })

    it('roadmap steps have sequential order', () => {
      const content = buildSimpleReportContent(makeDangerResult())
      for (let i = 0; i < content.roadmap.length; i++) {
        expect(content.roadmap[i].order).toBe(i + 1)
      }
    })
  })

  // 統合テスト
  describe('full content structure', () => {
    it('returns all 5 sections', () => {
      const content = buildSimpleReportContent(makeDangerResult())
      expect(content.overallRating).toBeDefined()
      expect(content.buildingData).toBeDefined()
      expect(content.failedChecks).toBeDefined()
      expect(content.earthquakeComparison).toBeDefined()
      expect(content.roadmap).toBeDefined()
    })
  })
})
