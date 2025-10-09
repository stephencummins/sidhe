import { useState, useEffect } from 'react';
import { AppScreen, SpreadType, SelectedCard, Reading } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import SpreadSelection from './components/SpreadSelection';
import QuestionInput from './components/QuestionInput';
import CardSelection from './components/CardSelection';
import ReadingDisplay from './components/ReadingDisplay';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';

function AppContent() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [reading, setReading] = useState<Reading | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setScreen('admin' as AppScreen);
    }
  }, []);

  const handleStartReading = () => {
    setScreen('spread-selection');
  };

  const handleSpreadSelect = (spreadType: SpreadType) => {
    setSelectedSpread(spreadType);
    setScreen('question-input');
  };

  const handleQuestionSubmit = (userQuestion: string) => {
    setQuestion(userQuestion);
    setScreen('card-selection');
  };

  const handleCardsSelected = (cards: SelectedCard[]) => {
    if (selectedSpread) {
      setReading({
        spread: selectedSpread,
        question,
        cards,
        timestamp: Date.now()
      });
      setScreen('reading-display');
    }
  };

  const handleNewReading = () => {
    setScreen('landing');
    setSelectedSpread(null);
    setQuestion('');
    setReading(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-purple-300">Loading...</p>
      </div>
    );
  }

  if (screen === 'admin') {
    return user ? <AdminPanel /> : <AdminLogin />;
  }

  return (
    <div className="min-h-screen">
      {screen === 'landing' && (
        <LandingPage onStartReading={handleStartReading} />
      )}
      {screen === 'spread-selection' && (
        <SpreadSelection onSpreadSelect={handleSpreadSelect} />
      )}
      {screen === 'question-input' && selectedSpread && (
        <QuestionInput onSubmit={handleQuestionSubmit} />
      )}
      {screen === 'card-selection' && selectedSpread && (
        <CardSelection
          spreadType={selectedSpread}
          onCardsSelected={handleCardsSelected}
        />
      )}
      {screen === 'reading-display' && reading && (
        <ReadingDisplay
          reading={reading}
          onNewReading={handleNewReading}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
