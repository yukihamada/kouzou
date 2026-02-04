import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-zinc-300 mb-4">404</h1>
      <h2 className="text-xl font-semibold mb-2">ページが見つかりません</h2>
      <p className="text-zinc-600 mb-8">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <Link href="/">
        <Button>トップページに戻る</Button>
      </Link>
    </div>
  )
}
