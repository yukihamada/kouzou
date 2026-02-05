export function Footer() {
  return (
    <footer className="border-t bg-zinc-50 py-6">
      <div className="container mx-auto px-4 text-center text-sm text-zinc-500">
        <p>
          本ツールは簡易的な耐震診断の参考情報を提供するものであり、
          専門家による正式な耐震診断の代替にはなりません。
        </p>
        <p className="mt-1">
          正確な診断には建築士等の専門家にご相談ください。
        </p>
        <div className="mt-4 pt-4 border-t border-zinc-200">
          <p className="text-xs text-zinc-400 mb-2">関連サービス</p>
          <a
            href="https://godseye-web.fly.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-xs"
          >
            GOD&apos;S EYE - AI画像解析による建物倒壊リスク評価
          </a>
        </div>
      </div>
    </footer>
  )
}
