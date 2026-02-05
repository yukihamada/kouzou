'use client'

import { useEffect, useRef, useCallback } from 'react'
import { toast } from '@/hooks/use-toast'

/**
 * 自動保存通知とページ離脱時の警告を管理するフック
 */
export function useAutoSaveNotification(
  lastSavedAt: string | null,
  options?: {
    /** トーストの表示を有効にするか */
    showToast?: boolean
    /** ページ離脱警告を有効にするか */
    warnOnLeave?: boolean
  }
) {
  const { showToast = true, warnOnLeave = true } = options ?? {}
  const prevSavedAt = useRef<string | null>(null)
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 自動保存トーストの表示（デバウンス付き）
  useEffect(() => {
    if (!showToast || !lastSavedAt) return
    if (lastSavedAt === prevSavedAt.current) return

    // 初回ロード時はトーストを表示しない
    if (prevSavedAt.current === null) {
      prevSavedAt.current = lastSavedAt
      return
    }

    prevSavedAt.current = lastSavedAt

    // 連続した保存でトーストが大量に出ないようにデバウンス
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current)
    }

    toastTimeoutRef.current = setTimeout(() => {
      toast({
        title: '自動保存しました',
        description: '入力内容は自動的に保存されています',
      })
    }, 500)

    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [lastSavedAt, showToast])

  // ページ離脱時の警告
  useEffect(() => {
    if (!warnOnLeave) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 標準的なブラウザ警告を表示（カスタムメッセージは多くのブラウザで無視される）
      e.preventDefault()
      // Chrome requires returnValue to be set
      e.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [warnOnLeave])

  // カスタムの離脱確認メッセージを表示するコールバック
  const confirmLeave = useCallback((callback: () => void) => {
    if (window.confirm('入力内容は自動保存されています。後で続きから再開できます。\n\nページを離れますか？')) {
      callback()
    }
  }, [])

  return { confirmLeave }
}
