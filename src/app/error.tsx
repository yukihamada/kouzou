'use client'

import { Button } from '@/components/ui/button'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-zinc-300 mb-4">500</h1>
      <h2 className="text-xl font-semibold mb-2">エラーが発生しました</h2>
      <p className="text-zinc-600 mb-8">
        予期しないエラーが発生しました。もう一度お試しください。
      </p>
      <Button onClick={reset}>再試行</Button>
    </div>
  )
}
