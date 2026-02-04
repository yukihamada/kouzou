import { describe, it, expect } from 'vitest'
import { calculateSimpleDiagnosis } from '@/lib/calc/simple-diagnosis'

describe('calculateSimpleDiagnosis', () => {
  it('全問安全側を選ぶと10点で safe', () => {
    const answers: Record<number, string> = {
      1: '1a',
      2: '2a',
      3: '3a',
      4: '4a',
      5: '5a',
      6: '6a',
      7: '7a',
      8: '8a',
      9: '9a',
      10: '10a',
    }
    const result = calculateSimpleDiagnosis(answers)
    expect(result.totalScore).toBe(10)
    expect(result.rating).toBe('safe')
    expect(result.recommendDetailedDiagnosis).toBe(false)
  })

  it('全問危険側を選ぶと0点で danger', () => {
    const answers: Record<number, string> = {
      1: '1b',
      2: '2b',
      3: '3c',
      4: '4c',
      5: '5b',
      6: '6b',
      7: '7b',
      8: '8b',
      9: '9b',
      10: '10b',
    }
    const result = calculateSimpleDiagnosis(answers)
    expect(result.totalScore).toBe(0)
    expect(result.rating).toBe('danger')
    expect(result.recommendDetailedDiagnosis).toBe(true)
  })

  it('8点で caution', () => {
    const answers: Record<number, string> = {
      1: '1a',
      2: '2a',
      3: '3a',
      4: '4a',
      5: '5a',
      6: '6a',
      7: '7a',
      8: '8a',
      9: '9b', // 0点
      10: '10b', // 0点
    }
    const result = calculateSimpleDiagnosis(answers)
    expect(result.totalScore).toBe(8)
    expect(result.rating).toBe('caution')
    expect(result.recommendDetailedDiagnosis).toBe(true)
  })

  it('9点で caution', () => {
    const answers: Record<number, string> = {
      1: '1a',
      2: '2a',
      3: '3a',
      4: '4a',
      5: '5a',
      6: '6a',
      7: '7a',
      8: '8a',
      9: '9a',
      10: '10b', // 0点
    }
    const result = calculateSimpleDiagnosis(answers)
    expect(result.totalScore).toBe(9)
    expect(result.rating).toBe('caution')
  })

  it('7点で danger', () => {
    const answers: Record<number, string> = {
      1: '1b', // 0
      2: '2b', // 0
      3: '3c', // 0
      4: '4a', // 1
      5: '5a', // 1
      6: '6a', // 1
      7: '7a', // 1
      8: '8a', // 1
      9: '9a', // 1
      10: '10a', // 1
    }
    const result = calculateSimpleDiagnosis(answers)
    expect(result.totalScore).toBe(7)
    expect(result.rating).toBe('danger')
  })

  it('未回答の設問はスコアに加算されない', () => {
    const answers: Record<number, string> = {
      1: '1a', // 1
    }
    const result = calculateSimpleDiagnosis(answers)
    expect(result.totalScore).toBe(1)
    expect(result.rating).toBe('danger')
  })

  it('増築の安全選択肢(3b)も1点になる', () => {
    const answers: Record<number, string> = {
      3: '3b', // 適法な増築 → 1点
    }
    const result = calculateSimpleDiagnosis(answers)
    expect(result.totalScore).toBe(1)
  })

  it('空の回答は0点', () => {
    const result = calculateSimpleDiagnosis({})
    expect(result.totalScore).toBe(0)
    expect(result.rating).toBe('danger')
  })
})
