'use client'

import * as React from 'react'
import { Tooltip } from 'radix-ui'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HelpTooltipProps {
  /** 説明するテキスト（用語） */
  term: string
  /** ツールチップに表示する説明文 */
  description: string
  /** アイコンのサイズ */
  iconSize?: 'sm' | 'md'
  /** 追加のクラス名 */
  className?: string
}

export function HelpTooltip({
  term,
  description,
  iconSize = 'sm',
  className,
}: HelpTooltipProps) {
  const iconClass = iconSize === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <span className={cn('inline-flex items-center gap-1', className)}>
          {term}
          <Tooltip.Trigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-full"
              aria-label={`${term}の説明を表示`}
            >
              <HelpCircle className={iconClass} />
            </button>
          </Tooltip.Trigger>
        </span>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 max-w-xs rounded-md bg-zinc-900 px-3 py-2 text-sm text-zinc-50 shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
            sideOffset={5}
          >
            {description}
            <Tooltip.Arrow className="fill-zinc-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

/** 定義済みの専門用語とその説明 */
export const SEISMIC_TERMS = {
  upperStructureScore: {
    term: '上部構造評点（Iw）',
    description:
      '建物の耐震性能を示す数値。1.0以上で「一応倒壊しない」とされ、1.5以上で「倒壊しない」と判定されます。',
  },
  wallQuantity: {
    term: '壁量',
    description:
      '地震に抵抗する壁の量。耐力壁の長さと強さ（壁倍率）を掛け合わせた値で、建物の耐震性能の基本となります。',
  },
  eccentricityRatio: {
    term: '偏心率',
    description:
      '建物の重心と剛心のズレの程度を示す指標。この値が大きいと地震時にねじれが生じやすく、耐震性能が低下します。',
  },
  deterioration: {
    term: '劣化度',
    description:
      '建物の老朽化による耐力低下の度合い。シロアリ被害、腐朽、基礎のひび割れなどを評価します。',
  },
  newSeismicStandard: {
    term: '新耐震基準',
    description:
      '1981年6月以降の建築基準法による耐震基準。震度6強〜7程度の地震でも倒壊しないことを目標としています。',
  },
} as const

export type SeismicTermKey = keyof typeof SEISMIC_TERMS

/** 定義済み用語を簡単に表示するヘルパーコンポーネント */
export function SeismicHelpTooltip({
  termKey,
  iconSize,
  className,
}: {
  termKey: SeismicTermKey
  iconSize?: 'sm' | 'md'
  className?: string
}) {
  const { term, description } = SEISMIC_TERMS[termKey]
  return (
    <HelpTooltip
      term={term}
      description={description}
      iconSize={iconSize}
      className={className}
    />
  )
}
