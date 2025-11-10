import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { QUESTIONS } from './constants';
import type { Answers, Scores, Column } from './types';
import QuizCard from './components/QuizCard';
import QuestionStep from './components/QuestionStep';
import ResultsStep from './components/ResultsStep';
import { generateQuizAnalysis } from './services/geminiService';

const initialAnswers = (): Answers => {
  const answers: Answers = {};
  QUESTIONS.forEach(q => {
    answers[q.id] = 3; // Default to a non-extreme position
  });
  return answers;
};

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [scores, setScores] = useState<Scores | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalSteps = QUESTIONS.length;

  useEffect(() => {
    // Check for results in URL hash on initial load
    const hash = window.location.hash;
    if (hash.startsWith('#results=')) {
      try {
        const scoresStr = hash.substring('#results='.length);
        const [A, B, C, D] = scoresStr.split(',').map(Number);
        if (!isNaN(A) && !isNaN(B) && !isNaN(C) && !isNaN(D)) {
            const loadedScores = { A, B, C, D };
            setScores(loadedScores);
            setIsLoading(true);
            generateQuizAnalysis(loadedScores)
                .then(result => {
                    setAnalysis(result);
                    setIsQuizComplete(true);
                })
                .catch(e => {
                    setError('An error occurred while generating the analysis from the link. Please try again.');
                    console.error(e);
                })
                .finally(() => setIsLoading(false));
        }
      } catch (e) {
        console.error("Failed to parse scores from URL hash", e);
        // If parsing fails, just start the quiz normally
      }
    }
  }, []);

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
       handleSubmit(answers);
    }
  };
  
  const handleSubmit = useCallback(async (finalAnswers: Answers | Scores) => {
    setIsLoading(true);
    setError(null);
    let calculatedScores: Scores;

    // Check if we are calculating from answers or using pre-loaded scores
    if ('A' in finalAnswers) {
        calculatedScores = finalAnswers;
    } else {
        calculatedScores = { A: 0, B: 0, C: 0, D: 0 };
        QUESTIONS.forEach(question => {
            const value = (finalAnswers as Answers)[question.id];
            const [option1, option2] = question.options;

            const pointsMapping = {
                1: { p1: 5, p2: 0 }, 2: { p1: 4, p2: 1 }, 3: { p1: 3, p2: 2 },
                4: { p1: 2, p2: 3 }, 5: { p1: 1, p2: 4 }, 6: { p1: 0, p2: 5 },
            };

            const distribution = pointsMapping[value as keyof typeof pointsMapping];
            
            calculatedScores[option1.column] += distribution.p1;
            calculatedScores[option2.column] += distribution.p2;
        });
    }

    setScores(calculatedScores);
    
    try {
      const result = await generateQuizAnalysis(calculatedScores);
      setAnalysis(result);
      setIsQuizComplete(true);
    } catch (e) {
      setError('An error occurred while generating the analysis. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const handleRestart = useCallback(() => {
    // Reset URL hash
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
    setCurrentStep(0);
    setAnswers(initialAnswers());
    setIsQuizComplete(false);
    setAnalysis('');
    setScores(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const currentQuestion = useMemo(() => QUESTIONS[currentStep], [currentStep]);
  
  const showQuiz = !isQuizComplete && !isLoading && !scores;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-2xl mx-auto">
        {showQuiz ? (
          <QuizCard
            currentStep={currentStep}
            totalSteps={totalSteps}
          >
            <QuestionStep
              question={currentQuestion}
              onAnswer={handleAnswer}
              onNext={handleNext}
              isLastStep={currentStep === totalSteps - 1}
              currentValue={answers[currentQuestion.id]}
            />
          </QuizCard>
        ) : (
          <>
            {isLoading && (
               <div className="flex flex-col items-center justify-center text-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl p-8 h-64">
                    <svg className="animate-spin h-10 w-10 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <h2 className="text-2xl font-bold">מחשב את מפת הסגנונות שלך...</h2>
                    <p className="text-gray-300 mt-2">הניתוח האישי שלך יופיע ממש עוד רגע.</p>
               </div>
            )}
            {isQuizComplete && scores && (
                <ResultsStep analysis={analysis} scores={scores} onRestart={handleRestart} />
            )}
          </>
        )}
         {error && <p className="text-red-400 text-center mt-4 bg-red-900/50 p-3 rounded-lg">{error}</p>}
        <footer className="text-center text-gray-400 mt-8 text-sm">
          <p>ניתוח AI מופעל על ידי Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;