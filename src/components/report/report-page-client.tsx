'use client'

import { useState } from 'react'
import { useDetailedDiagnosisStore } from '@/stores/detailed-diagnosis-store'
import { useSimpleDiagnosisStore } from '@/stores/simple-diagnosis-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileDown, Loader2 } from 'lucide-react'
import Link from 'next/link'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function ReportPageClient() {
  const { result: detailedResult, reinforcementPlan, walls, deteriorationItems } =
    useDetailedDiagnosisStore()
  const { result: simpleResult } = useSimpleDiagnosisStore()
  const [generating, setGenerating] = useState(false)

  const handleDetailedPdf = async () => {
    if (!detailedResult) return
    setGenerating(true)
    try {
      const { generateDetailedReport } = await import(
        '@/lib/pdf/generate-report'
      )
      const blob = await generateDetailedReport(
        detailedResult,
        reinforcementPlan,
        walls,
        deteriorationItems
      )
      downloadBlob(blob, '耐震診断レポート_精密診断.pdf')
    } finally {
      setGenerating(false)
    }
  }

  const handleSimplePdf = async () => {
    if (!simpleResult) return
    setGenerating(true)
    try {
      const { generateSimpleReport } = await import(
        '@/lib/pdf/generate-report'
      )
      const blob = await generateSimpleReport(simpleResult)
      downloadBlob(blob, '耐震診断レポート_簡易診断.pdf')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">診断レポート出力</h1>

      <Card>
        <CardHeader>
          <CardTitle>簡易診断レポート</CardTitle>
        </CardHeader>
        <CardContent>
          {simpleResult ? (
            <div className="space-y-3">
              <p className="text-sm text-zinc-600">
                簡易診断の結果（{simpleResult.totalScore}/10点）をPDFで出力します。
              </p>
              <Button onClick={handleSimplePdf} disabled={generating}>
                {generating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4 mr-2" />
                )}
                PDFダウンロード
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-zinc-400">
                簡易診断がまだ実施されていません。
              </p>
              <Link href="/simple">
                <Button variant="outline">簡易診断を実施</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>精密診断レポート</CardTitle>
        </CardHeader>
        <CardContent>
          {detailedResult ? (
            <div className="space-y-3">
              <p className="text-sm text-zinc-600">
                精密診断の結果（Iw={detailedResult.overallIw.toFixed(2)}）と
                補強提案をPDFで出力します。
              </p>
              <Button onClick={handleDetailedPdf} disabled={generating}>
                {generating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4 mr-2" />
                )}
                PDFダウンロード
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-zinc-400">
                精密診断がまだ実施されていません。
              </p>
              <Link href="/detailed/building-info">
                <Button variant="outline">精密診断を実施</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
