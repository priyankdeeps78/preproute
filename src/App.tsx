import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { ToastHost } from '@/components/ui/ToastHost'
import { LoginPage } from '@/features/auth/LoginPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { CreateTestPage } from '@/features/testForm/CreateTestPage'

const QuestionsWorkspacePage = lazy(() =>
  import('@/features/questions/QuestionsWorkspacePage').then((m) => ({
    default: m.QuestionsWorkspacePage,
  })),
)
const PublishPage = lazy(() =>
  import('@/features/publish/PublishPage').then((m) => ({
    default: m.PublishPage,
  })),
)

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/tests/new" element={<CreateTestPage />} />
          <Route
            path="/tests/:testId/questions"
            element={
              <Suspense fallback={<FullPageSpinner />}>
                <QuestionsWorkspacePage />
              </Suspense>
            }
          />
          <Route
            path="/tests/:testId/publish"
            element={
              <Suspense fallback={<FullPageSpinner />}>
                <PublishPage />
              </Suspense>
            }
          />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ToastHost />
    </>
  )
}
