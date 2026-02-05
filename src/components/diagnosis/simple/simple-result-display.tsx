'use client'

import { useState } from 'react'
import type { SimpleDiagnosisResult } from '@/types/simple-diagnosis'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileDown, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { ShareButton } from '@/components/ui/share-button'

const ratingConfig = {
  safe: {
    label: '一応安全',
    color: 'bg-green-100 text-green-800 border-green-300',
    bgColor: 'bg-green-50',
  },
  caution: {
    label: '要注意',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    bgColor: 'bg-yellow-50',
  },
  danger: {
    label: '要診断',
    color: 'bg-red-100 text-red-800 border-red-300',
    bgColor: 'bg-red-50',
  },
} as const

interface SimpleResultDisplayProps {
  result: SimpleDiagnosisResult
  onReset: () => void
}

export function SimpleResultDisplay({
  result,
  onReset,
}: SimpleResultDisplayProps) {
  const config = ratingConfig[result.rating]
  const [generating, setGenerating] = useState(false)

  const handlePdfDownload = async () => {
    setGenerating(true)
    try {
      const { generateSimpleReport } = await import(
        '@/lib/pdf/generate-report'
      )
      const blob = await generateSimpleReport(result)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = '耐震診断レポート_簡易診断.pdf'
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
      <Card className={config.bgColor}>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">簡易診断結果</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-6xl font-bold">
            {result.totalScore}
            <span className="text-2xl text-zinc-500">/10</span>
          </div>
          <Badge className={`text-lg px-4 py-1 ${config.color}`}>
            {config.label}
          </Badge>
          <p className="text-zinc-700 max-w-md mx-auto">{result.messageJa}</p>
        </CardContent>
      </Card>

      {result.recommendDetailedDiagnosis && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-zinc-600 mb-4">
              より正確な診断のために、精密診断（一般診断法）を受けることをお勧めします。
              精密診断では壁量計算・偏心率・劣化度を考慮した上部構造評点(Iw)を算出し、
              具体的な補強方法と費用の目安を提案します。
            </p>
            <Link href="/detailed/building-info">
              <Button className="w-full">精密診断に進む</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* シェアボタン */}
      <Card>
        <CardContent className="pt-6">
          <ShareButton
            text={`耐震診断くんで自宅の耐震性を診断しました！結果は「${config.label}」（${result.totalScore}/10点）でした。あなたも診断してみませんか？`}
            url="https://kouzou.fly.dev"
            title="耐震診断くん - 簡易診断結果"
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
