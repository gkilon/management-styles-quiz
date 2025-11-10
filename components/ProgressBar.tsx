
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progressPercentage = ((current + 1) / total) * 100;

  return (
    <div className="w-full">
      <p className="text-sm text-gray-300 mb-2 text-center">
        שאלה {current + 1} מתוך {total}
      </p>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-purple-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
