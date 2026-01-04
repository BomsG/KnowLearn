
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quiz, ResponseEntry, QuizResponse } from '../types';
import { storageService } from '../services/storage';
import { FiArrowLeft, FiArrowRight, FiCheck, FiX, FiClock, FiThumbsUp, FiInfo } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineLightBulb } from 'react-icons/hi2';
import { Button, Card, Input } from '../components/UI';

const QuizPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [respondentName, setRespondentName] = useState(storageService.getCurrentUser()?.name || '');
  const [isStarted, setIsStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [confidences, setConfidences] = useState<Record<string, number>>({});
  const [timer, setTimer] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (id) {
      const q = storageService.getQuizById(id);
      if (q) setQuiz(q);
    }
  }, [id]);

  useEffect(() => {
    if (isStarted && !submitted) {
      timerRef.current = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [isStarted, submitted]);

  const handleStart = () => {
    if (!respondentName.trim()) return alert('Please enter your name.');
    setIsStarted(true);
  };

  const handleSubmit = () => {
    if (!quiz) return;
    const entries: ResponseEntry[] = quiz.questions.map(q => ({
      questionId: q.id,
      answer: answers[q.id] || '',
      confidence: confidences[q.id] || 3,
      timeSpent: 0,
      isCorrect: q.type === 'mcq' ? q.options?.find(o => o.id === answers[q.id])?.isCorrect : undefined
    }));

    const response: QuizResponse = {
      id: Math.random().toString(36).substr(2, 9),
      quizId: quiz.id,
      respondentName,
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      entries,
      totalScore: entries.reduce((acc, e) => {
        const q = quiz.questions.find(quest => quest.id === e.questionId);
        return acc + (e.isCorrect ? (q?.points || 0) : 0);
      }, 0)
    };

    storageService.saveResponse(response);
    setSubmitted(true);
  };

  if (!quiz) return <div className="p-10 text-center font-black">Assessment not found.</div>;

  const themeColor = quiz.themeColor || '#6366f1';
  const progress = ((currentQIndex + 1) / quiz.questions.length) * 100;

  if (submitted && !showReview) {
    const score = quiz.questions.reduce((acc, q) => {
      const isCorrect = q.type === 'mcq' ? q.options?.find(o => o.id === answers[q.id])?.isCorrect : false;
      return acc + (isCorrect ? q.points : 0);
    }, 0);
    const maxScore = quiz.questions.reduce((acc, q) => acc + q.points, 0);

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <Card className="max-w-md w-full p-12 text-center">
          <FiThumbsUp className="w-16 h-16 text-green-500 mx-auto mb-8" />
          <h2 className="text-3xl font-black mb-2">Great Job!</h2>
          <p className="text-gray-400 font-medium mb-10">Assessment complete for {respondentName}.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-gray-50 p-6 rounded-[2rem]">
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Score</p>
               <p className="text-3xl font-black" style={{ color: themeColor }}>{score}/{maxScore}</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-[2rem]">
               <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Time</p>
               <p className="text-3xl font-black" style={{ color: themeColor }}>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
            </div>
          </div>
          
          <Button className="w-full mb-4" onClick={() => setShowReview(true)} style={{ backgroundColor: themeColor }}>Review Answers</Button>
          <Button variant="outline" className="w-full" onClick={() => navigate('/')}>Exit</Button>
        </Card>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <Card className="max-w-xl w-full overflow-hidden">
          {quiz.coverImage && <img src={quiz.coverImage} className="w-full h-48 object-cover" />}
          <div className="p-12 text-center">
            <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl" style={{ backgroundColor: themeColor }}>
              <HiOutlineAcademicCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">{quiz.title}</h1>
            <p className="text-gray-500 font-medium mb-12">{quiz.description}</p>
            
            <Input 
              label="Identify Yourself" 
              placeholder="Full Name" 
              value={respondentName} 
              onChange={(e) => setRespondentName(e.target.value)}
              className="mb-8"
            />
            
            <Button className="w-full" size="lg" onClick={handleStart} style={{ backgroundColor: themeColor }}>Start Assessment</Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQIndex];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-6 md:px-12 py-6 bg-white border-b border-gray-100 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Button variant="ghost" className="!p-2" onClick={() => navigate('/')}><FiX className="w-6 h-6" /></Button>
          <div className="hidden sm:block">
            <h2 className="text-sm font-black text-gray-900 line-clamp-1 max-w-[200px]">{quiz.title}</h2>
            <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div className="h-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: themeColor }} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-gray-50 px-5 py-2.5 rounded-2xl flex items-center gap-3 text-sm font-mono font-black border border-gray-100">
            <FiClock style={{ color: themeColor }} /> {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </header>

      <div className="flex-grow max-w-4xl mx-auto w-full px-6 py-12 lg:py-20">
        <Card className="p-8 md:p-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: themeColor }}>Question {currentQIndex + 1}</span>
            <div className="flex-grow h-px bg-gray-100" />
          </div>
          
          <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-12 leading-tight tracking-tight">{currentQ.text}</h3>

          <div className="space-y-4 mb-16">
            {currentQ.type === 'mcq' ? (
              currentQ.options?.map((opt) => (
                <button 
                  key={opt.id}
                  onClick={() => setAnswers({...answers, [currentQ.id]: opt.id})}
                  className={`w-full text-left p-6 md:p-8 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${
                    answers[currentQ.id] === opt.id 
                    ? 'text-white border-transparent shadow-xl' 
                    : 'bg-gray-50 border-transparent hover:bg-gray-100 text-gray-700'
                  }`}
                  style={answers[currentQ.id] === opt.id ? { backgroundColor: themeColor } : {}}
                >
                  <span className="text-lg font-bold">{opt.text}</span>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${answers[currentQ.id] === opt.id ? 'bg-white/20 border-white' : 'border-gray-200 group-hover:border-gray-300'}`}>
                    {answers[currentQ.id] === opt.id && <FiCheck className="text-white" />}
                  </div>
                </button>
              ))
            ) : (
              <textarea 
                className="w-full bg-gray-50 rounded-[2rem] p-8 outline-none text-xl font-bold min-h-[200px] border-2 border-transparent focus:bg-white transition-all"
                style={{ '--tw-border-color': `${themeColor}20` } as any}
                placeholder="Type your answer here..."
                value={answers[currentQ.id] || ''}
                onChange={(e) => setAnswers({...answers, [currentQ.id]: e.target.value})}
              />
            )}
          </div>

          {quiz.settings.requireConfidence && (
            <div className="bg-gray-50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100">
               <div className="flex items-center gap-3 mb-8 text-gray-400">
                  <HiOutlineLightBulb className="w-5 h-5" style={{ color: themeColor }} />
                  <span className="text-xs font-black uppercase tracking-widest">Confidence Level</span>
               </div>
               <div className="flex justify-between gap-2 md:gap-4">
                  {[1,2,3,4,5].map(lvl => (
                    <button 
                      key={lvl}
                      onClick={() => setConfidences({...confidences, [currentQ.id]: lvl})}
                      className={`flex-1 py-4 md:py-6 rounded-[1.5rem] font-black text-lg transition-all border-2 ${
                        confidences[currentQ.id] === lvl 
                        ? 'text-white border-transparent shadow-lg scale-105' 
                        : 'bg-white text-gray-300 border-transparent hover:border-gray-100'
                      }`}
                      style={confidences[currentQ.id] === lvl ? { backgroundColor: themeColor } : {}}
                    >
                      {lvl}
                    </button>
                  ))}
               </div>
               <div className="flex justify-between mt-4 px-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  <span>Unsure</span>
                  <span>Confident</span>
               </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-16 pt-8 border-t border-gray-50">
            <Button 
              variant="ghost" 
              disabled={currentQIndex === 0} 
              onClick={() => setCurrentQIndex(p => p - 1)}
              icon={<FiArrowLeft />}
            >
              Back
            </Button>
            
            <div className="text-xs font-black text-gray-300 uppercase tracking-widest">
              {currentQIndex + 1} / {quiz.questions.length}
            </div>

            <Button 
              size="lg"
              onClick={() => currentQIndex === quiz.questions.length - 1 ? handleSubmit() : setCurrentQIndex(p => p + 1)}
              style={{ backgroundColor: themeColor }}
              className="!px-12"
              icon={currentQIndex === quiz.questions.length - 1 ? <FiCheck /> : <FiArrowRight />}
            >
              {currentQIndex === quiz.questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizPlayerPage;
