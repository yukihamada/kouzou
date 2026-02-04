import type { SimpleRating } from '@/types/simple-diagnosis'
import type { EarthquakeComparisonItem } from './types'

interface EarthquakeData {
  name: string
  year: number
  magnitude: number
  maxIntensity: string
  casualties: string
  riskByRating: Record<SimpleRating, string>
}

const EARTHQUAKES: EarthquakeData[] = [
  {
    name: '阪神・淡路大震災',
    year: 1995,
    magnitude: 7.3,
    maxIntensity: '震度7',
    casualties: '死者6,434人、全壊約10万棟',
    riskByRating: {
      danger: '旧耐震基準の木造住宅の多くが倒壊しました。同様の地震が発生した場合、お住まいも大きな被害を受ける可能性が高いです。',
      caution: '新耐震基準の建物でも一部被害がありました。壁量不足や劣化がある場合、中〜大破の可能性があります。',
      safe: '新耐震基準を満たす建物の多くは軽微な被害で済みましたが、家具の転倒等による被害は発生しています。',
    },
  },
  {
    name: '熊本地震',
    year: 2016,
    magnitude: 7.3,
    maxIntensity: '震度7（2回）',
    casualties: '死者273人、全壊約8,700棟',
    riskByRating: {
      danger: '震度7が2回連続で発生し、1回目に耐えた建物も2回目で倒壊する事例が多発しました。旧耐震基準の建物は特に危険です。',
      caution: '2000年以前の新耐震基準の建物でも接合部の不備により倒壊した事例がありました。接合部の確認が重要です。',
      safe: '2000年以降の現行基準を満たす建物は概ね安全でしたが、繰り返し地震への注意は必要です。',
    },
  },
  {
    name: '東日本大震災',
    year: 2011,
    magnitude: 9.0,
    maxIntensity: '震度7',
    casualties: '死者・行方不明者約2.2万人、全壊約12万棟',
    riskByRating: {
      danger: '津波による被害が甚大でしたが、揺れによる木造住宅の倒壊も多数発生しました。旧耐震基準の建物は大きなリスクがあります。',
      caution: '長周期の揺れが広範囲に及びました。液状化による被害も発生しており、地盤の確認も重要です。',
      safe: '耐震基準を満たす建物の揺れによる倒壊は少なかったですが、津波や液状化への備えは別途必要です。',
    },
  },
  {
    name: '新潟県中越地震',
    year: 2004,
    magnitude: 6.8,
    maxIntensity: '震度7',
    casualties: '死者68人、全壊約3,200棟',
    riskByRating: {
      danger: '山間部の古い木造住宅を中心に大きな被害がありました。地盤が軟弱な場所では被害が拡大しています。',
      caution: '余震が多発し、本震で損傷した建物がさらに被害を受けました。初期の損傷を放置しないことが重要です。',
      safe: '耐震性能が十分な建物では大きな被害は少なかったですが、地盤や斜面の影響は考慮が必要です。',
    },
  },
  {
    name: '能登半島地震',
    year: 2024,
    magnitude: 7.6,
    maxIntensity: '震度7',
    casualties: '死者245人、全壊約8,500棟',
    riskByRating: {
      danger: '古い木造住宅の倒壊が相次ぎました。積雪地域特有の重い屋根と壁量不足の組み合わせが被害を拡大させています。',
      caution: '新耐震基準の建物でも劣化や積雪荷重の影響で被害を受けた事例がありました。定期的なメンテナンスが重要です。',
      safe: '適切に維持管理された建物では被害は限定的でしたが、地盤の隆起・液状化による被害は別問題として注意が必要です。',
    },
  },
]

function ratingToRiskLevel(rating: SimpleRating): 'high' | 'medium' | 'low' {
  switch (rating) {
    case 'danger':
      return 'high'
    case 'caution':
      return 'medium'
    case 'safe':
      return 'low'
  }
}

/**
 * 簡易診断の判定に基づいて、過去の大地震との比較データを生成する
 */
export function generateEarthquakeComparison(
  rating: SimpleRating
): EarthquakeComparisonItem[] {
  return EARTHQUAKES.map((eq) => ({
    name: eq.name,
    year: eq.year,
    magnitude: eq.magnitude,
    maxIntensity: eq.maxIntensity,
    casualties: eq.casualties,
    riskDescriptionJa: eq.riskByRating[rating],
    riskLevel: ratingToRiskLevel(rating),
  }))
}
