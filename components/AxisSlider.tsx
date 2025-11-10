import React from 'react';
import type { QuestionOption } from '../types';

interface AxisSliderProps {
  options: [QuestionOption, QuestionOption];
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AxisSlider: React.FC<AxisSliderProps> = ({ options, value, onChange }) => {
  const [option1, option2] = options;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between items-center text-lg font-semibold mb-3">
        <span className="text-right w-2/5">{option1.text}</span>
        <span className="text-left w-2/5">{option2.text}</span>
      </div>
      <div className="relative flex items-center flex-col">
        <input
          type="range"
          min="1"
          max="6"
          step="1"
          value={value}
          onChange={onChange}
          className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg slider-thumb"
          style={{
            // Custom properties for thumb color
            '--thumb-color': '#a855f7', // purple-500
          } as React.CSSProperties}
        />
        <div className="flex justify-between w-full px-1 text-sm text-gray-400 mt-2">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
        </div>
      </div>
        <style>{`
          .slider-thumb::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 28px;
            height: 28px;
            background: var(--thumb-color);
            border-radius: 50%;
            border: 3px solid white;
            cursor: pointer;
            margin-top: -10px; /* Adjust vertical alignment */
            transition: background-color 0.2s;
          }

          .slider-thumb::-moz-range-thumb {
            width: 24px;
            height: 24px;
            background: var(--thumb-color);
            border-radius: 50%;
            border: 3px solid white;
            cursor: pointer;
          }
          
          .slider-thumb:focus::-webkit-slider-thumb {
             box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.5);
          }
        `}</style>
    </div>
  );
};

export default AxisSlider;