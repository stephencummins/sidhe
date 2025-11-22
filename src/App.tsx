import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import TarotFlow from './components/TarotFlow';
import SharedReading from './components/SharedReading';
import DailyThreeCardReading from './components/DailyThreeCardReading';
import SavedReadingsPage from './components/SavedReadingsPage';
import ViewSavedReading from './components/ViewSavedReading';
import ReadingAnalytics from './components/ReadingAnalytics';
import PricingPage from './components/PricingPage';
import SuccessPage from './components/SuccessPage';

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

      {/* Shared reading routes - Must come BEFORE wildcard routes */}
      <Route path="/r/:id" element={<Layout><SharedReading /></Layout>} />

      {/* Reading wizard routes */}
      <Route path="/reading/*" element={<Layout><TarotFlow /></Layout>} />

      {/* Daily reading route */}
      <Route path="/daily" element={<Layout><DailyThreeCardReading /></Layout>} />

      {/* Saved readings routes */}
      <Route path="/saved-readings" element={
        <Layout>
          <ProtectedRoute>
            <SavedReadingsPage />
          </ProtectedRoute>
        </Layout>
      } />
      <Route path="/saved/:id" element={<Layout><ViewSavedReading /></Layout>} />

      {/* Analytics route */}
      <Route path="/analytics" element={
        <Layout>
          <ReadingAnalytics />
        </Layout>
      } />

      {/* Pricing route */}
      <Route path="/pricing" element={<Layout><PricingPage /></Layout>} />

      {/* Success route */}
      <Route path="/success" element={<Layout><SuccessPage /></Layout>} />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <AppContent />
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;