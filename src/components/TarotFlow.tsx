import { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { SpreadType, SelectedCard, Reading } from '../types';
import SpreadSelection from './SpreadSelection';
import QuestionInput from './QuestionInput';
import CardSelection from './CardSelection';
import ReadingDisplay from './ReadingDisplay';

export default function TarotFlow() {
  const [selectedSpread, setSelectedSpread] = useState<SpreadType | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [reading, setReading] = useState<Reading | null>(null);
  const navigate = useNavigate();

  const handleSpreadSelect = (spreadType: SpreadType) => {
    setSelectedSpread(spreadType);
    navigate('/reading/question');
  };

  const handleQuestionSubmit = (userQuestion: string) => {
    setQuestion(userQuestion);
    navigate('/reading/cards');
  };

  const handleCardsSelected = (cards: SelectedCard[]) => {
    if (selectedSpread) {
      setReading({
        spread: selectedSpread,
        question,
        cards,
        timestamp: Date.now()
      });
      navigate('/reading/display');
    }
  };

  const handleNewReading = () => {
    setSelectedSpread(null);
    setQuestion('');
    setReading(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<SpreadSelection onSpreadSelect={handleSpreadSelect} />} />
        <Route
          path="/question"
          element={
            selectedSpread ? (
              <QuestionInput onSubmit={handleQuestionSubmit} />
            ) : (
              <Navigate to="/reading" replace />
            )
          }
        />
        <Route
          path="/cards"
          element={
            selectedSpread ? (
              <CardSelection
                spreadType={selectedSpread}
                onCardsSelected={handleCardsSelected}
              />
            ) : (
              <Navigate to="/reading" replace />
            )
          }
        />
        <Route
          path="/display"
          element={
            reading ? (
              <ReadingDisplay
                reading={reading}
                onNewReading={handleNewReading}
              />
            ) : (
              <Navigate to="/reading" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}
