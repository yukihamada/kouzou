import Link from 'next/link'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ClipboardList,
  Calculator,
  Globe,
  CircleDollarSign,
  ShieldCheck,
  MousePointerClick,
  MessageCircleQuestion,
  FileDown,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">木造住宅 耐震診断ツール</h1>
        <p className="text-zinc-600 max-w-2xl mx-auto">
          お住まいの耐震性能を診断し、必要に応じた補強方法と概算費用を提案します。
          まずは簡易診断でスクリーニングし、必要に応じて精密診断に進みましょう。
        </p>
      </div>

      {/* 3つの特徴セクション */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8">3つの特徴</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-4">
              <Globe className="h-7 w-7 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">ダウンロード不要</h3>
            <p className="text-sm text-zinc-600">
              ブラウザだけで完結。アプリのインストールは一切不要です。
            </p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
              <CircleDollarSign className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">完全無料</h3>
            <p className="text-sm text-zinc-600">
              登録不要、今すぐ使えます。費用は一切かかりません。
            </p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-100 rounded-full mb-4">
              <ShieldCheck className="h-7 w-7 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">プライバシー保護</h3>
            <p className="text-sm text-zinc-600">
              入力データはサーバーに送信されません。すべてブラウザ内で処理されます。
            </p>
          </div>
        </div>
      </div>

      {/* 使い方セクション */}
      <div className="mb-16">
        <h2 className="text-xl font-bold text-center mb-8">使い方</h2>
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
            <div className="flex-1 text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 text-white rounded-full mb-3 text-lg font-bold">
                1
              </div>
              <div className="flex justify-center mb-3">
                <MousePointerClick className="h-8 w-8 text-zinc-500" />
              </div>
              <h3 className="font-semibold mb-1">診断タイプを選ぶ</h3>
              <p className="text-sm text-zinc-600">
                簡易診断か精密診断を選択
              </p>
            </div>
            <div className="hidden md:flex items-center pt-6">
              <div className="w-12 h-0.5 bg-zinc-300"></div>
            </div>
            <div className="flex-1 text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 text-white rounded-full mb-3 text-lg font-bold">
                2
              </div>
              <div className="flex justify-center mb-3">
                <MessageCircleQuestion className="h-8 w-8 text-zinc-500" />
              </div>
              <h3 className="font-semibold mb-1">質問に答える</h3>
              <p className="text-sm text-zinc-600">
                建物情報や状態を入力
              </p>
            </div>
            <div className="hidden md:flex items-center pt-6">
              <div className="w-12 h-0.5 bg-zinc-300"></div>
            </div>
            <div className="flex-1 text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-zinc-900 text-white rounded-full mb-3 text-lg font-bold">
                3
              </div>
              <div className="flex justify-center mb-3">
                <FileDown className="h-8 w-8 text-zinc-500" />
              </div>
              <h3 className="font-semibold mb-1">結果を確認</h3>
              <p className="text-sm text-zinc-600">
                診断結果をPDFでダウンロード
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 診断メニューセクション */}
      <h2 className="text-xl font-bold text-center mb-8">診断メニュー</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              <CardTitle>簡易診断</CardTitle>
            </div>
            <CardDescription>
              10問の問診に答えるだけで、お住まいの耐震性の目安がわかります。
              専門知識は不要です。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-zinc-600 space-y-1 mb-4">
              <li>対象: 一般の住宅所有者</li>
              <li>所要: 約5分</li>
              <li>基準: 「誰でもできるわが家の耐震診断」準拠</li>
            </ul>
            <Link href="/simple">
              <Button className="w-full">簡易診断を始める</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="h-8 w-8 text-green-600" />
              <CardTitle>精密診断（一般診断法）</CardTitle>
            </div>
            <CardDescription>
              壁量計算・偏心率・劣化度を考慮した上部構造評点(Iw)を算出します。
              建築士・専門家向けです。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-zinc-600 space-y-1 mb-4">
              <li>対象: 建築士・専門家</li>
              <li>計算: 壁量・偏心率・劣化度</li>
              <li>基準: 2012年改訂版 精密診断法1</li>
            </ul>
            <Link href="/detailed/building-info">
              <Button variant="outline" className="w-full">
                精密診断を始める
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 p-4 bg-amber-50 border border-amber-200 rounded-lg max-w-4xl mx-auto">
        <p className="text-sm text-amber-800">
          <strong>ご注意:</strong>{' '}
          本ツールは簡易的な耐震診断の参考情報を提供するものです。
          正確な耐震診断には、建築士等の専門家による現地調査が必要です。
          本ツールの結果のみに基づいて建物の安全性を判断しないでください。
        </p>
      </div>

      <div className="mt-8 max-w-4xl mx-auto">
        <div className="border rounded-lg p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-400 mb-1">関連サービス</p>
              <h3 className="text-lg font-bold mb-2">GOD&apos;S EYE</h3>
              <p className="text-sm text-gray-300 mb-3">
                建物の外観写真からAIが地震倒壊リスクを瞬時に評価。
                住所を入力するだけで、Street View画像から自動診断します。
              </p>
              <a
                href="https://godseye-web.fly.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded transition-colors"
              >
                外観AI診断を試す →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
