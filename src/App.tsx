import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import TarotFlow from './components/TarotFlow';
import SharedReading from './components/SharedReading';
import DailyThreeCardReading from './components/DailyThreeCardReading';
import SavedReadingsPage from './components/SavedReadingsPage';
import ViewSavedReading from './components/ViewSavedReading';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sidhe-deep-blue via-sidhe-navy to-sidhe-deep-blue flex items-center justify-center">
        <p className="text-sidhe-cream">Loading...</p>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/admin/login" replace />;
}

function AppContent() {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Layout><LandingPage /></Layout>} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<Layout><AdminLogin /></Layout>} />
      <Route path="/admin" element={
        <Layout>
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        </Layout>
      } />

      {/* Reading routes */}
      <Route path="/reading/*" element={<Layout><TarotFlow /></Layout>} />

      {/* Daily reading route */}
      <Route path="/daily" element={<DailyThreeCardReading />} />

      {/* Shared reading route */}
      <Route path="/r/:id" element={<SharedReading />} />
      <Route path="/reading/:id" element={<SharedReading />} />

      {/* Saved readings routes */}
      <Route path="/saved-readings" element={
        <ProtectedRoute>
          <SavedReadingsPage />
        </ProtectedRoute>
      } />
      <Route path="/saved/:id" element={<ViewSavedReading />} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;