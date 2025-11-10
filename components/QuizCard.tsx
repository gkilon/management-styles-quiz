
import React from 'react';
import ProgressBar from './ProgressBar';

interface QuizCardProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}

const QuizCard: React.FC<QuizCardProps> = ({ children, currentStep, totalSteps }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl p-6 sm:p-8 animate-fade-in">
      <div className="mb-8">
        <ProgressBar current={currentStep} total={totalSteps} />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default QuizCard;
