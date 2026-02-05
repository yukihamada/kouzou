'use client'

import { useState } from 'react'
import type { DetailedDiagnosisResult } from '@/types/diagnosis'
import type { ReinforcementPlan } from '@/types/reinforcement'
import type { WallSegment } from '@/types/wall'
import type { DeteriorationItem } from '@/types/deterioration'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileDown, Loader2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ScoreGauge } from '@/components/visualization/score-gauge'
import { RatingBadge } from '@/components/visualization/rating-badge'
import { RATING_INFO } from '@/lib/calc/upper-structure-score'
import { HelpTooltip, SeismicHelpTooltip } from '@/components/ui/help-tooltip'
import { ShareButton } from '@/components/ui/share-button'
import Link from 'next/link'

interface DetailedResultDisplayProps {
  result: DetailedDiagnosisResult
  reinforcementPlan: ReinforcementPlan | null
  walls?: WallSegment[]
  deteriorationItems?: DeteriorationItem[]
  onReset: () => void
}

export function DetailedResultDisplay({
  result,
  reinforcementPlan,
  walls = [],
  deteriorationItems = [],
  onReset,
}: DetailedResultDisplayProps) {
  const info = RATING_INFO[result.overallRating]
  const [generating, setGenerating] = useState(false)

  const handlePdfDownload = async () => {
    setGenerating(true)
    try {
      const { generateDetailedReport } = await import(
        '@/lib/pdf/generate-report'
      )
      const blob = await generateDetailedReport(result, reinforcementPlan, walls, deteriorationItems)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '耐震診断レポート_精密診断.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 総合評点 */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle>精密診断結果（一般診断法）</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="text-center">
            <SeismicHelpTooltip termKey="upperStructureScore" iconSize="md" />
          </div>
          <ScoreGauge iw={result.overallIw} rating={result.overallRating} />
          <RatingBadge rating={result.overallRating} size="lg" />
          <p className="text-zinc-600 text-center max-w-md">
            {info.descriptionJa}
          </p>
        </CardContent>
      </Card>

      {/* 方向別・階別結果 */}
      <Card>
        <CardHeader>
          <CardTitle>方向別・階別 詳細</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>階</TableHead>
                <TableHead>方向</TableHead>
                <TableHead className="text-right">Qu (kN)</TableHead>
                <TableHead className="text-right">Qr (kN)</TableHead>
                <TableHead className="text-right">
                  <SeismicHelpTooltip termKey="eccentricityRatio" />
                </TableHead>
                <TableHead className="text-right">eKfl</TableHead>
                <TableHead className="text-right">dK</TableHead>
                <TableHead className="text-right">
                  <HelpTooltip
                    term="Iw"
                    description="上部構造評点。建物の耐震性能を示す数値で、1.0以上で「一応倒壊しない」、1.5以上で「倒壊しない」と判定されます。"
                  />
                </TableHead>
                <TableHead>判定</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.directionalResults.map((r) => (
                <TableRow key={`${r.floor}-${r.direction}`}>
                  <TableCell>{r.floor}F</TableCell>
                  <TableCell>{r.direction}</TableCell>
                  <TableCell className="text-right">
                    {r.qu.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.qr.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.eccentricityRatio.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.eccentricityFactor.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.deteriorationFactor.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {r.iw.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <RatingBadge rating={r.rating} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 壁量サマリー */}
      <Card>
        <CardHeader>
          <CardTitle>
            <SeismicHelpTooltip termKey="wallQuantity" />
            サマリー
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>階・方向</TableHead>
                <TableHead className="text-right">壁長さ (m)</TableHead>
                <TableHead className="text-right">保有耐力 (kN)</TableHead>
                <TableHead className="text-right">必要耐力 (kN)</TableHead>
                <TableHead className="text-right">充足率</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { label: '1F X', data: result.wallSummary.floor1X },
                { label: '1F Y', data: result.wallSummary.floor1Y },
                ...(result.wallSummary.floor2X
                  ? [
                      { label: '2F X', data: result.wallSummary.floor2X },
                      { label: '2F Y', data: result.wallSummary.floor2Y! },
                    ]
                  : []),
              ].map(({ label, data }) => (
                <TableRow key={label}>
                  <TableCell>{label}</TableCell>
                  <TableCell className="text-right">
                    {data.totalLength.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    {data.totalStrength.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    {data.required.toFixed(1)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="outline"
                      className={
                        data.ratio >= 1.0
                          ? 'border-green-500 text-green-700'
                          : 'border-red-500 text-red-700'
                      }
                    >
                      {(data.ratio * 100).toFixed(0)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 劣化度 */}
      <Card>
        <CardHeader>
          <CardTitle>
            <SeismicHelpTooltip termKey="deterioration" />
            評価
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-zinc-500">劣化低減係数 dK = </span>
              <span className="text-xl font-bold">
                {result.deteriorationScore.dK.toFixed(2)}
              </span>
            </div>
            <div className="text-sm text-zinc-500">
              （劣化点数: {result.deteriorationScore.totalDeteriorationPoints} /{' '}
              存在点数: {result.deteriorationScore.totalExistencePoints}）
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 補強提案へのリンク */}
      {result.overallIw < 1.5 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-600 mb-4">
              耐震性能を向上させるための補強提案と概算費用を確認できます。
            </p>
            <Link href="/reinforcement">
              <Button className="w-full">補強提案・見積もりを見る</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* シェアボタン */}
      <Card>
        <CardContent className="pt-6">
          <ShareButton
            text={`耐震診断くんで自宅の耐震性を診断しました！結果は「${info.labelJa}」（上部構造評点 Iw=${result.overallIw.toFixed(2)}）でした。あなたも診断してみませんか？`}
            url="https://kouzou.fly.dev"
            title="耐震診断くん - 精密診断結果"
          />
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onReset} className="flex-1">
          最初からやり直す
        </Button>
        <Button onClick={handlePdfDownload} disabled={generating} className="flex-1">
          {generating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4 mr-2" />
          )}
          PDF出力
        </Button>
      </div>
    </div>
  )
}
