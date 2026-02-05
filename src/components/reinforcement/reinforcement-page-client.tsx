'use client'

import { useDetailedDiagnosisStore } from '@/stores/detailed-diagnosis-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScoreGauge } from '@/components/visualization/score-gauge'
import { getStructuralRating } from '@/lib/calc/upper-structure-score'
import Link from 'next/link'

const priorityLabels = {
  high: { label: '優先度高', class: 'bg-red-100 text-red-800' },
  medium: { label: '優先度中', class: 'bg-yellow-100 text-yellow-800' },
  low: { label: '優先度低', class: 'bg-green-100 text-green-800' },
}

function formatYen(amount: number): string {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}万円`
  }
  return `${amount.toLocaleString()}円`
}

export function ReinforcementPageClient() {
  const { result, reinforcementPlan } = useDetailedDiagnosisStore()

  if (!reinforcementPlan || !result) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-8 text-center">
        <p className="text-zinc-500">
          先に精密診断を実行してください。
        </p>
        <Link href="/detailed/building-info">
          <Button className="mt-4">精密診断を開始</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">補強提案・見積もり</h1>

      {/* Before / After 比較 */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">現状</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ScoreGauge
              iw={reinforcementPlan.currentIw}
              rating={result.overallRating}
              size={160}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-center">補強後（見込み）</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ScoreGauge
              iw={reinforcementPlan.estimatedIwAfter}
              rating={getStructuralRating(reinforcementPlan.estimatedIwAfter)}
              size={160}
            />
          </CardContent>
        </Card>
      </div>

      {/* 補強項目一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>補強項目</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>優先度</TableHead>
                <TableHead>工法</TableHead>
                <TableHead>数量</TableHead>
                <TableHead className="text-right">概算費用</TableHead>
                <TableHead>理由</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reinforcementPlan.suggestions.map((s, i) => {
                const p = priorityLabels[s.priority]
                return (
                  <TableRow key={i}>
                    <TableCell>
                      <Badge className={p.class}>{p.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{s.labelJa}</div>
                      <div className="text-xs text-zinc-500">
                        {s.descriptionJa}
                      </div>
                    </TableCell>
                    <TableCell>
                      {s.quantity}
                      {s.unit}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {formatYen(s.estimatedCostMin)}〜
                      {formatYen(s.estimatedCostMax)}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-600">
                      {s.reason}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 合計 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">概算合計</span>
            <span className="text-xl font-bold">
              {formatYen(reinforcementPlan.totalCostMin)}〜
              {formatYen(reinforcementPlan.totalCostMax)}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            ※ 概算費用は一般的な相場に基づく参考値です。
            実際の費用は建物の状態・施工条件等により大きく変動します。
            正確な見積もりは専門業者にご依頼ください。
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Link href="/detailed/result" className="flex-1">
          <Button variant="outline" className="w-full">
            診断結果に戻る
          </Button>
        </Link>
      </div>
    </div>
  )
}
