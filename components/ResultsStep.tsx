import React, { useState, useRef } from 'react';
import { Scores } from '../types';
import { SCENARIOS } from '../constants';
import { generateScenarioAnalysis } from '../services/geminiService';

declare const html2pdf: any;

const MarkdownRenderer = ({ content }: { content: string }) => {
  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  };

  const lines = content.split('\n');
  const renderedLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Handle numbered lists
    if (line.match(/^\d\.\s/)) {
        const listItems = [];
        // Loop through all consecutive list items
        while(i < lines.length && lines[i].match(/^\d\.\s/)) {
            const itemContent = lines[i].substring(lines[i].indexOf(' ') + 1);
            listItems.push(<li key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: formatText(itemContent) }} />);
            i++;
        }
        i--; // Decrement i because the outer loop will increment it
        renderedLines.push(<ol key={`ol-${i}`} className="list-decimal list-outside space-y-2 my-4 pr-6">{listItems}</ol>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
        renderedLines.push(<h3 key={i} className="text-xl font-semibold text-purple-400 mt-6 mb-3">{line.substring(2,line.length - 2)}</h3>)
    } else if (line.trim() !== '') { // Render non-empty paragraphs
      renderedLines.push(<p key={i} className="mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatText(line) }} />);
    }
  }

  return <div className="prose prose-invert text-gray-300">{renderedLines}</div>;
};

const ColorMap = ({ scores }: { scores: Scores }) => {
  const { A, B, C, D } = scores;
  const totalAB = A + B || 1;
  const totalCD = C + D || 1;

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `${B / totalAB * 100}% ${A / totalAB * 100}%`,
    gridTemplateRows: `${C / totalCD * 100}% ${D / totalCD * 100}%`,
    width: '100%',
    aspectRatio: '1 / 1',
  };

  return (
    <div className="w-full max-w-xs mx-auto mb-8">
      <div style={gridStyle} className="rounded-lg overflow-hidden shadow-2xl border-2 border-gray-600">
        <div className="bg-blue-500"></div> {/* Top-Left: B*C - Blue */}
        <div className="bg-red-500"></div> {/* Top-Right: A*C - Red */}
        <div className="bg-green-500"></div> {/* Bottom-Left: B*D - Green */}
        <div className="bg-yellow-400"></div> {/* Bottom-Right: A*D - Yellow */}
      </div>
    </div>
  );
};


const AiScenarios = ({ scores }: { scores: Scores }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [activeScenario, setActiveScenario] = useState<string | null>(null);

    const handleScenarioClick = async (scenario: {key: string, text: string}) => {
        if (activeScenario === scenario.key && analysis) {
             // If clicking the active scenario again, hide the analysis
            setActiveScenario(null);
            setAnalysis(null);
            return;
        }

        setIsLoading(true);
        setError(null);
        setAnalysis(null);
        setActiveScenario(scenario.key);

        try {
            const result = await generateScenarioAnalysis(scores, scenario.text);
            setAnalysis(result);
        } catch (e) {
            setError('התרחשה שגיאה. נסה שוב.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="my-8 pt-6 border-t border-gray-700">
             <h3 className="text-2xl font-bold text-purple-400 mb-4 text-center">סימולציות AI: קבל ייעוץ מותאם אישית</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {SCENARIOS.map(s => (
                     <button 
                        key={s.key} 
                        onClick={() => handleScenarioClick(s)}
                        className={`w-full p-3 rounded-lg transition-colors duration-200 font-semibold ${activeScenario === s.key ? 'bg-purple-700 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        {s.text}
                    </button>
                ))}
             </div>
             {isLoading && (
                 <div className="flex justify-center items-center p-4">
                     <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                 </div>
             )}
             {error && <p className="text-red-400 text-center">{error}</p>}
             {analysis && (
                 <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700 text-right animate-fade-in">
                     <MarkdownRenderer content={analysis} />
                 </div>
             )}
        </div>
    )
}

interface ResultsStepProps {
  analysis: string;
  scores: Scores;
  onRestart: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({ analysis, scores, onRestart }) => {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [copyStatus, setCopyStatus] = useState('');

  const handleShare = async () => {
    const { A, B, C, D } = scores;
    const url = `${window.location.origin}${window.location.pathname}#results=${A},${B},${C},${D}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'מפת סגנונות התקשורת שלי',
                text: 'גלו את סגנון התקשורת שלכם עם שאלון מבוסס AI! הנה התוצאות שלי:',
                url: url,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    } else {
        navigator.clipboard.writeText(url).then(() => {
            setCopyStatus('הקישור הועתק!');
            setTimeout(() => setCopyStatus(''), 2000);
        }, () => {
            setCopyStatus('שגיאה בהעתקה');
             setTimeout(() => setCopyStatus(''), 2000);
        });
    }
  };
  
  const handleDownload = () => {
    const element = resultsRef.current;
    if (element) {
        const opt = {
            margin:       0.5,
            filename:     'my-communication-style.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, backgroundColor: '#111827' }, // bg-gray-900
            jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8 animate-fade-in w-full">
      <div ref={resultsRef} className="p-2">
        <h2 className="text-3xl font-bold text-purple-400 mb-6 text-center">מפת סגנונות התקשורת שלך</h2>
        {scores && <ColorMap scores={scores} />}
        <div className="text-right text-lg space-y-4 max-h-[28rem] overflow-y-auto pr-4 custom-scrollbar">
            {analysis ? <MarkdownRenderer content={analysis} /> : <p>טוען ניתוח...</p>}
        </div>
      </div>
      
      {scores && <AiScenarios scores={scores} />}

      <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col sm:flex-row-reverse items-center justify-center gap-4">
        <button
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition-colors duration-300"
        >
          מלא שאלון חדש
        </button>
        <button
            onClick={handleShare}
            className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors duration-300 relative"
        >
            {copyStatus || 'שתף קישור לתוצאות'}
        </button>
        <button
            onClick={handleDownload}
            className="w-full sm:w-auto px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-colors duration-300"
        >
            הורד כ-PDF
        </button>
      </div>
    </div>
  );
};

export default ResultsStep;