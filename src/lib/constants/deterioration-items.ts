import type { DeteriorationItem, DeteriorationCategory } from '@/types/deterioration'

interface DeteriorationTemplate {
  id: string
  category: DeteriorationCategory
  labelJa: string
  descriptionJa: string
  points: number
}

/**
 * 劣化度調査チェック項目テンプレート
 * 2012年改訂版準拠
 */
export const DETERIORATION_TEMPLATES: DeteriorationTemplate[] = [
  // 基礎
  {
    id: 'f1',
    category: 'foundation',
    labelJa: '基礎にひび割れがある',
    descriptionJa: '幅0.5mm以上のひび割れ、鉄筋の露出など',
    points: 3,
  },
  {
    id: 'f2',
    category: 'foundation',
    labelJa: '基礎が大きく傾いている',
    descriptionJa: '不同沈下による傾き',
    points: 4,
  },
  // 外壁
  {
    id: 'ew1',
    category: 'exterior_wall',
    labelJa: '外壁の仕上げにひび割れがある',
    descriptionJa: 'モルタル・サイディングのひび割れ',
    points: 2,
  },
  {
    id: 'ew2',
    category: 'exterior_wall',
    labelJa: '外壁に著しい劣化がある',
    descriptionJa: '仕上げの剥落・浮き・腐食',
    points: 3,
  },
  // 屋根
  {
    id: 'r1',
    category: 'roof',
    labelJa: '屋根にずれ・割れ・浮きがある',
    descriptionJa: '瓦のずれ、スレートの割れなど',
    points: 2,
  },
  {
    id: 'r2',
    category: 'roof',
    labelJa: '雨漏りがある',
    descriptionJa: '室内への雨漏り跡がある',
    points: 3,
  },
  // 居室・廊下
  {
    id: 'lr1',
    category: 'living_room',
    labelJa: '床が著しく傾いている',
    descriptionJa: '3/1000以上の傾斜',
    points: 3,
  },
  {
    id: 'lr2',
    category: 'living_room',
    labelJa: '床がぶかぶかする',
    descriptionJa: '床板の腐食・たわみ',
    points: 2,
  },
  {
    id: 'lr3',
    category: 'living_room',
    labelJa: '建具（ドア・襖）の建付が悪い',
    descriptionJa: '開閉困難、隙間が大きい',
    points: 2,
  },
  // 浴室
  {
    id: 'b1',
    category: 'bathroom',
    labelJa: '浴室周辺の土台に腐食がある',
    descriptionJa: '水回りの木部腐食',
    points: 3,
  },
  {
    id: 'b2',
    category: 'bathroom',
    labelJa: '浴室周辺にシロアリ被害がある',
    descriptionJa: '蟻道・食害跡',
    points: 4,
  },
  // バルコニー
  {
    id: 'bl1',
    category: 'balcony',
    labelJa: 'バルコニーの手すりがぐらつく',
    descriptionJa: '手すり・支柱の腐食',
    points: 2,
  },
  // 小屋裏
  {
    id: 'at1',
    category: 'attic',
    labelJa: '小屋裏に雨漏り跡がある',
    descriptionJa: '雨染み・カビ',
    points: 2,
  },
  {
    id: 'at2',
    category: 'attic',
    labelJa: '小屋裏の木部に著しい劣化がある',
    descriptionJa: '腐食・虫害',
    points: 3,
  },
  // 床下
  {
    id: 'uf1',
    category: 'under_floor',
    labelJa: '床下にシロアリ被害がある',
    descriptionJa: '蟻道・食害・木くず',
    points: 4,
  },
  {
    id: 'uf2',
    category: 'under_floor',
    labelJa: '床下の土台・大引に腐食がある',
    descriptionJa: '含水率が高い・腐朽',
    points: 3,
  },
  {
    id: 'uf3',
    category: 'under_floor',
    labelJa: '床下の換気が不十分',
    descriptionJa: '換気口の不足・閉塞',
    points: 1,
  },
]

/**
 * テンプレートからDeteriorationItem配列を生成
 */
export function createDeteriorationItems(): DeteriorationItem[] {
  return DETERIORATION_TEMPLATES.map((t) => ({
    ...t,
    checked: false,
    exists: true,
  }))
}
