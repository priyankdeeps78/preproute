import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import { Logo } from '@/components/layout/Logo'
import { useAuthStore } from '@/store/authStore'

export function AppShell({
  children,
  breadcrumb,
  actions,
}: {
  children: ReactNode
  breadcrumb?: ReactNode
  actions?: ReactNode
}) {
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  function handleLogout() {
    setMenuOpen(false)
    clearAuth()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="flex items-center justify-between border-b border-ink-300/40 bg-white px-8 py-4">
        <div className="flex items-center gap-6">
          <Logo />
          {breadcrumb && (
            <span className="text-sm text-ink-500">{breadcrumb}</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {actions}
          <button className="rounded-full p-2 text-ink-500 hover:bg-surface-muted">
            <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
              <path d="M10 2a6 6 0 00-6 6v3.1L2.6 14a1 1 0 00.9 1.5h13a1 1 0 00.9-1.5L16 11.1V8a6 6 0 00-6-6zm0 16a2.2 2.2 0 002.2-2H7.8A2.2 2.2 0 0010 18z" />
            </svg>
          </button>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-600">
                {(user?.name ?? user?.userId ?? 'A').slice(0, 1).toUpperCase()}
              </span>
              <span className="text-left text-sm">
                <span className="block font-medium text-ink-900">
                  {user?.name ?? user?.userId ?? 'Admin'}
                </span>
                <span className="block text-xs text-ink-500">
                  {user?.role ?? 'Admin'}
                </span>
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-2 w-36 rounded-xl border border-ink-300/50 bg-white p-1 shadow-lg">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="p-8">{children}</main>
    </div>
  )
}
