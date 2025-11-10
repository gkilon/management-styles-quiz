import React from 'react';
import type { Question } from '../types';
import AxisSlider from './AxisSlider';

interface QuestionStepProps {
  question: Question;
  onAnswer: (questionId: number, value: number) => void;
  onNext: () => void;
  isLastStep: boolean;
  currentValue: number;
}

const QuestionStep: React.FC<QuestionStepProps> = ({ question, onAnswer, onNext, isLastStep, currentValue }) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAnswer(question.id, parseInt(e.target.value, 10));
  };

  return (
    <div className="animate-slide-in flex flex-col items-center justify-center min-h-[250px] sm:min-h-[200px]">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-gray-100">היכן אתה ממקם את עצמך על הציר?</h2>
      
      <AxisSlider 
        options={question.options}
        value={currentValue}
        onChange={handleSliderChange}
      />

      <div className="mt-10">
        <button
          onClick={onNext}
          className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75"
        >
          {isLastStep ? 'סיים וצפה בניתוח' : 'הבא'}
        </button>
      </div>
    </div>
  );
};

export default QuestionStep;
