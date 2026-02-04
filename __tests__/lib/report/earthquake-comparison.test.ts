import { describe, it, expect } from 'vitest'
import { generateEarthquakeComparison } from '@/lib/report/earthquake-comparison'

describe('generateEarthquakeComparison', () => {
  it('returns 5 earthquake comparison items', () => {
    const result = generateEarthquakeComparison('danger')
    expect(result).toHaveLength(5)
  })

  it('includes expected earthquakes', () => {
    const result = generateEarthquakeComparison('safe')
    const names = result.map((item) => item.name)
    expect(names).toContain('阪神・淡路大震災')
    expect(names).toContain('熊本地震')
    expect(names).toContain('東日本大震災')
    expect(names).toContain('新潟県中越地震')
    expect(names).toContain('能登半島地震')
  })

  it('maps danger rating to high risk level', () => {
    const result = generateEarthquakeComparison('danger')
    for (const item of result) {
      expect(item.riskLevel).toBe('high')
    }
  })

  it('maps caution rating to medium risk level', () => {
    const result = generateEarthquakeComparison('caution')
    for (const item of result) {
      expect(item.riskLevel).toBe('medium')
    }
  })

  it('maps safe rating to low risk level', () => {
    const result = generateEarthquakeComparison('safe')
    for (const item of result) {
      expect(item.riskLevel).toBe('low')
    }
  })

  it('provides different risk descriptions per rating', () => {
    const dangerResult = generateEarthquakeComparison('danger')
    const safeResult = generateEarthquakeComparison('safe')

    // Same earthquake, different description
    expect(dangerResult[0].riskDescriptionJa).not.toBe(
      safeResult[0].riskDescriptionJa
    )
  })

  it('includes numeric data for each earthquake', () => {
    const result = generateEarthquakeComparison('caution')
    for (const item of result) {
      expect(item.year).toBeGreaterThan(1900)
      expect(item.magnitude).toBeGreaterThan(0)
      expect(item.maxIntensity).toBeTruthy()
      expect(item.casualties).toBeTruthy()
    }
  })
})
