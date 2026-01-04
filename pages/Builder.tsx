
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Quiz, Question, User, Option, QuestionType } from '../types';
import { storageService } from '../services/storage';
import { aiService } from '../services/gemini';
import { FiPlus, FiTrash2, FiSave, FiZap, FiSettings, FiArrowLeft, FiImage, FiClock, FiCheck, FiMoreVertical } from 'react-icons/fi';
import { LuGripVertical } from 'react-icons/lu';
// Fixed: Added missing import for HiOutlineClipboardDocumentList
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { Button, Card, Input } from '../components/UI';

const THEME_COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#10b981', '#06b6d4', '#3b82f6'];

const BuilderPage: React.FC<{ user: User }> = ({ user }) => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz>({
    id: id || Math.random().toString(36).substr(2, 9),
    title: '',
    description: '',
    creatorId: user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    questions: [],
    themeColor: THEME_COLORS[0],
    settings: { isReleased: true, requireConfidence: true, shuffleQuestions: false, overallTimer: 0 }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isReviewing, setIsReviewing] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, any>>({});

  useEffect(() => {
    if (id) {
      const existing = storageService.getQuizById(id);
      if (existing) setQuiz(existing);
    }
  }, [id]);

  const save = () => {
    if (!quiz.title.trim()) return alert('Please enter a title.');
    setIsSaving(true);
    storageService.saveQuiz({ ...quiz, updatedAt: new Date().toISOString() });
    setTimeout(() => { setIsSaving(false); if(!id) navigate(`/builder/${quiz.id}`); }, 500);
  };

  const addQuestion = (type: QuestionType) => {
    const newQ: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: '',
      points: 1,
      options: type === 'mcq' ? [{ id: Math.random().toString(), text: '', isCorrect: false }] : undefined
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQ] });
  };

  const updateQ = (qId: string, updates: Partial<Question>) => {
    setQuiz({ ...quiz, questions: quiz.questions.map(q => q.id === qId ? { ...q, ...updates } : q) });
  };

  const handleAiReview = async (q: Question) => {
    if (!q.text) return;
    setIsReviewing(q.id);
    try {
      const result = await aiService.reviewQuestion(q);
      setAiSuggestions(p => ({ ...p, [q.id]: result }));
    } catch (e) { console.error(e); }
    finally { setIsReviewing(null); }
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-32">
      <div className="bg-white border-b border-gray-100 py-6 px-12 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <Button variant="ghost" className="!p-2" onClick={() => navigate('/dashboard')}><FiArrowLeft className="w-6 h-6" /></Button>
            <div className="h-8 w-px bg-gray-100 hidden md:block" />
            <div className="flex-grow">
               <input 
                 className="text-2xl font-black text-gray-900 bg-transparent outline-none w-full" 
                 placeholder="Assessment Title..." 
                 value={quiz.title}
                 onChange={(e) => setQuiz({...quiz, title: e.target.value})}
               />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
             <Button variant="outline" icon={<FiSettings />}>Settings</Button>
             <Button 
               onClick={save} 
               loading={isSaving} 
               style={{ backgroundColor: quiz.themeColor }}
               icon={isSaving ? null : <FiSave />}
             >
               Save Changes
             </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Fixed: style prop now accepted by Card component */}
        <Card className="p-12 mb-12 border-t-[8px]" style={{ borderTopColor: quiz.themeColor }}>
           <div className="flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="flex-grow space-y-6 w-full">
                 <textarea 
                    className="w-full text-lg font-medium text-gray-400 bg-transparent outline-none resize-none"
                    placeholder="Instructions for students..."
                    rows={3}
                    value={quiz.description}
                    onChange={(e) => setQuiz({...quiz, description: e.target.value})}
                 />
                 <div className="flex gap-2 p-1.5 bg-gray-50 rounded-2xl w-max">
                    {THEME_COLORS.map(c => (
                      <button 
                        key={c} 
                        className={`w-6 h-6 rounded-full transition-all ${quiz.themeColor === c ? 'scale-125 border-4 border-white shadow-sm' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                        onClick={() => setQuiz({...quiz, themeColor: c})}
                      />
                    ))}
                 </div>
              </div>
              <div className="w-full md:w-48 h-48 bg-gray-50 rounded-[2rem] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 group cursor-pointer hover:border-indigo-100 transition-colors">
                 <FiImage className="w-10 h-10 mb-2 group-hover:text-indigo-600 transition-colors" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Add Banner</span>
              </div>
           </div>
        </Card>

        <div className="space-y-12">
          {quiz.questions.map((q, idx) => (
            <Card key={q.id} className="p-12 relative group/q transition-all hover:border-gray-200">
               <div className="absolute top-8 right-8 flex gap-2">
                  <Button variant="ghost" className="!p-2 text-gray-300 hover:text-red-500" onClick={() => setQuiz({...quiz, questions: quiz.questions.filter(quest => quest.id !== q.id)})}><FiTrash2 /></Button>
               </div>
               
               <div className="flex gap-6 mb-12">
                  <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black shrink-0">{idx + 1}</div>
                  <input 
                    className="flex-grow text-2xl font-bold bg-transparent outline-none" 
                    placeholder="Question text..."
                    value={q.text}
                    onChange={(e) => updateQ(q.id, { text: e.target.value })}
                  />
               </div>

               {q.type === 'mcq' && (
                 <div className="space-y-3 mb-12 md:ml-12">
                    {q.options?.map((opt, oIdx) => (
                      <div key={opt.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl group/opt border border-transparent hover:border-gray-100">
                         <button 
                           onClick={() => updateQ(q.id, { options: q.options?.map(o => ({...o, isCorrect: o.id === opt.id})) })}
                           className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${opt.isCorrect ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white text-gray-200'}`}
                         >
                            <FiCheck />
                         </button>
                         <input 
                           className="flex-grow font-bold text-gray-700 bg-transparent outline-none" 
                           placeholder={`Option ${oIdx + 1}`}
                           value={opt.text}
                           onChange={(e) => updateQ(q.id, { options: q.options?.map(o => o.id === opt.id ? {...o, text: e.target.value} : o) })}
                         />
                         <button onClick={() => updateQ(q.id, { options: q.options?.filter(o => o.id !== opt.id) })} className="opacity-0 group-hover/opt:opacity-100 p-2 text-gray-200 hover:text-red-500 transition-all"><FiTrash2 /></button>
                      </div>
                    ))}
                    <button onClick={() => updateQ(q.id, { options: [...(q.options || []), { id: Math.random().toString(), text: '', isCorrect: false }] })} className="md:ml-4 text-xs font-black text-indigo-600 flex items-center gap-2 mt-4 hover:translate-x-1 transition-transform"><FiPlus /> Add Option</button>
                 </div>
               )}

               <div className="mt-12 pt-8 border-t border-gray-50 flex justify-between items-center">
                  <div className="flex gap-8">
                     <div className="flex items-center gap-2 text-gray-400">
                        <FiClock /> <input type="number" className="w-12 bg-transparent font-black outline-none" placeholder="N/A" value={q.timer || ''} onChange={(e) => updateQ(q.id, { timer: parseInt(e.target.value) || 0 })} />
                     </div>
                     <div className="flex items-center gap-2 text-gray-400">
                        <HiOutlineClipboardDocumentList /> <input type="number" className="w-12 bg-transparent font-black outline-none" value={q.points} onChange={(e) => updateQ(q.id, { points: parseInt(e.target.value) || 0 })} />
                     </div>
                  </div>
                  <Button variant="ghost" size="sm" icon={<FiZap />} loading={isReviewing === q.id} onClick={() => handleAiReview(q)}>AI Optimization</Button>
               </div>

               {aiSuggestions[q.id] && (
                 <div className="mt-8 p-8 bg-indigo-50/50 rounded-[2rem] border border-indigo-100 flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100"><FiZap className="w-6 h-6" /></div>
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-2">AI Suggestion</p>
                       <p className="text-indigo-900 font-bold leading-relaxed">{aiSuggestions[q.id].suggestion}</p>
                    </div>
                 </div>
               )}
            </Card>
          ))}
        </div>

        <div className="mt-20 flex justify-center sticky bottom-10">
           <div className="bg-white/80 backdrop-blur-xl p-3 rounded-[3rem] shadow-2xl border border-white flex gap-3">
              <Button onClick={() => addQuestion('mcq')} icon={<FiPlus />}>Choice Question</Button>
              <Button onClick={() => addQuestion('short_answer')} variant="secondary" icon={<FiPlus />}>Short Response</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
