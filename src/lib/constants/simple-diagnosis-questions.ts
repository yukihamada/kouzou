import type { SimpleQuestion } from '@/types/simple-diagnosis'

/**
 * 「誰でもできるわが家の耐震診断」準拠の10問
 * 各問 1点（安全側）or 0点（危険側）
 */
export const SIMPLE_DIAGNOSIS_QUESTIONS: SimpleQuestion[] = [
  {
    id: 1,
    questionJa: '建てたのはいつ頃ですか？',
    helpTextJa:
      '1981年（昭和56年）6月に建築基準法の耐震基準が大幅に改正されました（新耐震基準）。',
    options: [
      {
        id: '1a',
        labelJa: '1981年（昭和56年）6月以降',
        descriptionJa: '新耐震基準で建てられた建物',
        score: 1,
      },
      {
        id: '1b',
        labelJa: '1981年（昭和56年）5月以前',
        descriptionJa: '旧耐震基準で建てられた建物',
        score: 0,
      },
    ],
  },
  {
    id: 2,
    questionJa: '今までに大きな災害に見舞われたことはありますか？',
    helpTextJa:
      '大きな地震・床上浸水・火災などの被害を受けた経験があるかどうか。',
    options: [
      {
        id: '2a',
        labelJa: 'いいえ',
        descriptionJa: '大きな災害の被害を受けたことがない',
        score: 1,
      },
      {
        id: '2b',
        labelJa: 'はい',
        descriptionJa: '被災した、または被災の心配がある',
        score: 0,
      },
    ],
  },
  {
    id: 3,
    questionJa: '増築について',
    helpTextJa:
      '増築を行っている場合、建物全体の耐震バランスが崩れている可能性があります。',
    options: [
      {
        id: '3a',
        labelJa: '増築していない',
        descriptionJa: '建築当時のまま、または減築のみ',
        score: 1,
      },
      {
        id: '3b',
        labelJa: '建築確認など必要な手続きをして増築した',
        descriptionJa: '適法な増築',
        score: 1,
      },
      {
        id: '3c',
        labelJa: '必要な手続きをせずに増築した',
        descriptionJa: '確認申請なしの増築、または不明',
        score: 0,
      },
    ],
  },
  {
    id: 4,
    questionJa: '傷み具合や補修・改修について',
    helpTextJa: '建物の老朽化やシロアリ被害、腐食の有無。',
    options: [
      {
        id: '4a',
        labelJa: '傷んだところはない',
        descriptionJa: '目立った傷みがなく、適切に維持管理されている',
        score: 1,
      },
      {
        id: '4b',
        labelJa: '傷んだところがあるが、補修してある',
        descriptionJa: '傷みが見つかったが、適切に補修済み',
        score: 1,
      },
      {
        id: '4c',
        labelJa: '傷んだところがある（白蟻、腐食等）',
        descriptionJa: '傷んだまま放置されている箇所がある',
        score: 0,
      },
    ],
  },
  {
    id: 5,
    questionJa: '建物の平面はどのような形ですか？',
    helpTextJa:
      '整形（長方形に近い形）の建物は地震力に対して強い。L字型やコの字型は弱点になりやすい。',
    options: [
      {
        id: '5a',
        labelJa: 'どちらかというと長方形に近い',
        descriptionJa: '整形な平面形状',
        score: 1,
      },
      {
        id: '5b',
        labelJa: 'どちらかというとL字・T字・コの字など複雑な形',
        descriptionJa: '不整形な平面形状',
        score: 0,
      },
    ],
  },
  {
    id: 6,
    questionJa: '大きな吹き抜けはありますか？',
    helpTextJa:
      '大きな吹き抜けがあると、床の剛性（水平方向の強さ）が低下します。',
    options: [
      {
        id: '6a',
        labelJa: 'いいえ',
        descriptionJa: '大きな吹き抜けはない',
        score: 1,
      },
      {
        id: '6b',
        labelJa: 'はい',
        descriptionJa: '大きな吹き抜けがある',
        score: 0,
      },
    ],
  },
  {
    id: 7,
    questionJa: '1階と2階の壁面の位置は一致していますか？（2階建ての場合）',
    helpTextJa:
      '上下階で壁の位置がずれていると、力の伝達がうまくいかず弱点になります。平屋の場合は「はい」を選んでください。',
    options: [
      {
        id: '7a',
        labelJa: 'はい（一致している、または平屋）',
        descriptionJa: '1階と2階の壁の位置がほぼ一致している',
        score: 1,
      },
      {
        id: '7b',
        labelJa: 'いいえ（ずれている）',
        descriptionJa: '1階と2階の壁の位置がかなりずれている',
        score: 0,
      },
    ],
  },
  {
    id: 8,
    questionJa: '壁の配置のバランスはよいですか？',
    helpTextJa:
      '東西南北の各面にバランスよく壁があるか。一方向に壁が少ないと、ねじれが生じます。',
    options: [
      {
        id: '8a',
        labelJa: '1階、2階とも各方向にバランスよく壁がある',
        descriptionJa: '偏りなく壁が配置されている',
        score: 1,
      },
      {
        id: '8b',
        labelJa: '壁が一方に偏っている、または壁が少ない方向がある',
        descriptionJa: '壁の配置に偏りがある',
        score: 0,
      },
    ],
  },
  {
    id: 9,
    questionJa: '屋根と壁の量のバランスは？',
    helpTextJa:
      '重い屋根（日本瓦等）には多くの壁が必要です。屋根が重いのに壁が少ないと危険です。',
    options: [
      {
        id: '9a',
        labelJa: '瓦など重い屋根で壁が多い、または軽い屋根（金属板等）',
        descriptionJa: '屋根の重さに対して十分な壁量がある',
        score: 1,
      },
      {
        id: '9b',
        labelJa: '瓦など重い屋根だが壁が少ない',
        descriptionJa: '屋根の重さに対して壁が不足している可能性',
        score: 0,
      },
    ],
  },
  {
    id: 10,
    questionJa: '基礎はどのようになっていますか？',
    helpTextJa:
      '鉄筋コンクリート布基礎やべた基礎は耐震性が高い。玉石基礎やひび割れのある基礎は弱点になります。',
    options: [
      {
        id: '10a',
        labelJa: '鉄筋コンクリートの布基礎またはべた基礎',
        descriptionJa: '現行基準に適合した堅固な基礎',
        score: 1,
      },
      {
        id: '10b',
        labelJa: 'その他の基礎（玉石基礎、無筋コンクリート等）',
        descriptionJa: '耐震性に不安のある基礎',
        score: 0,
      },
      {
        id: '10c',
        labelJa: '基礎にひび割れがある',
        descriptionJa: '基礎に構造上のダメージがある',
        score: 0,
      },
    ],
  },
]
