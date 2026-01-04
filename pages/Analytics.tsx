
import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { QuizResponse, Question } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Clock, 
  Brain, 
  FileText,
  TrendingUp,
  AlertTriangle,
  X,
  Play,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b'];

const AnalyticsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedResponse, setSelectedResponse] = useState<QuizResponse | null>(null);
  
  const quiz = useMemo(() => id ? storageService.getQuizById(id) : null, [id]);
  const responses = useMemo(() => id ? storageService.getResponsesForQuiz(id) : [], [id]);

  const stats = useMemo(() => {
    if (responses.length === 0) return null;
    const scores = responses.map(r => r.totalScore);
    const avgScore = scores.reduce((a, b) => a + b, 0) / responses.length;
    const maxPossible = quiz?.questions.reduce((a, b) => a + b.points, 0) || 1;
    
    const confData = responses.flatMap(r => r.entries).reduce((acc: any, entry) => {
      const conf = entry.confidence || 0;
      if (!acc[conf]) acc[conf] = { confidence: conf, count: 0, correct: 0 };
      acc[conf].count++;
      if (entry.isCorrect) acc[conf].correct++;
      return acc;
    }, {});

    const confidenceChartData = Object.values(confData).map((d: any) => ({
      ...d,
      accuracy: Math.round((d.correct / d.count) * 100)
    })).sort((a, b) => a.confidence - b.confidence);

    return {
      avgScore,
      accuracy: (avgScore / maxPossible) * 100,
      totalResponses: responses.length,
      confidenceChartData
    };
  }, [responses, quiz]);

  if (!quiz) return <div className="p-10 text-center font-black">Assessment not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20 relative">
      {/* Response Replay Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center md:justify-end p-0 md:p-0">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedResponse(null)} />
          <div className="relative bg-white w-full max-w-2xl h-full md:h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
             <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg md:text-xl">
                      {selectedResponse.respondentName.charAt(0)}
                   </div>
                   <div>
                      <h3 className="text-xl md:text-2xl font-black text-gray-900 truncate max-w-[150px] md:max-w-none">{selectedResponse.respondentName}</h3>
                      <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Submission Replay</p>
                   </div>
                </div>
                <button onClick={() => setSelectedResponse(null)} className="p-2 md:p-3 hover:bg-white rounded-2xl transition-all">
                   <X className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                </button>
             </div>
             
             <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8 md:space-y-12">
                {quiz.questions.map((q, idx) => {
                  const entry = selectedResponse.entries.find(e => e.questionId === q.id);
                  const isCorrect = q.type === 'mcq' ? entry?.isCorrect : true; 
                  
                  return (
                    <div key={q.id} className="relative pl-6 md:pl-10 border-l-2 border-dashed border-gray-100">
                      <div className="absolute -left-[9px] md:-left-[13px] top-0 w-4 h-4 md:w-6 md:h-6 rounded-full bg-white border-2 md:border-4 border-indigo-100" />
                      
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Step {idx + 1}</span>
                        {isCorrect ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[9px] md:text-[10px] bg-emerald-50 px-3 py-1 rounded-full"><CheckCircle className="w-3 h-3" /> Correct</span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-600 font-bold text-[9px] md:text-[10px] bg-red-50 px-3 py-1 rounded-full"><XCircle className="w-3 h-3" /> Incorrect</span>
                        )}
                      </div>

                      <h4 className="text-base md:text-lg font-black text-gray-900 mb-4 md:mb-6">{q.text}</h4>
                      
                      <div className="bg-gray-50 rounded-2xl md:rounded-[24px] p-4 md:p-6 border border-gray-100">
                         <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                            <div className="flex-grow">
                               <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Answer Provided</p>
                               <p className="text-base md:text-lg font-bold text-gray-700">
                                 {q.type === 'mcq' 
                                   ? q.options?.find(o => o.id === entry?.answer)?.text || "No Answer"
                                   : entry?.answer || "No Response"}
                               </p>
                            </div>
                            <div className="md:text-right shrink-0">
                               <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Confidence</p>
                               <div className="flex gap-1 md:justify-end">
                                  {[1,2,3,4,5].map(lvl => (
                                    <div key={lvl} className={`w-1.5 md:w-2 h-3 md:h-4 rounded-full ${lvl <= (entry?.confidence || 0) ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  );
                })}
             </div>

             <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                   <div className="text-indigo-600 text-center sm:text-left">
                      <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Final Grade</p>
                      <p className="text-3xl md:text-4xl font-black">{selectedResponse.totalScore} <span className="text-sm md:text-lg text-indigo-400">/ {quiz.questions.reduce((a, b) => a + b.points, 0)}</span></p>
                   </div>
                   <button 
                     onClick={() => setSelectedResponse(null)}
                     className="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-black transition-all"
                   >
                     Done Reviewing
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-gray-100 py-4 md:py-6 px-6 md:px-8 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-all">
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
            </Link>
            <div className="truncate max-w-[200px] md:max-w-none">
              <h1 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight truncate">{quiz.title}</h1>
              <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global Insights</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-indigo-50 px-4 md:px-6 py-2 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 border border-indigo-100">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
              <span className="font-black text-indigo-900 text-xs md:text-sm">{responses.length} Participated</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-8 mt-6 md:mt-10">
        {responses.length === 0 ? (
          <div className="bg-white p-12 md:p-24 rounded-[32px] md:rounded-[64px] text-center shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="bg-indigo-50 w-16 h-16 md:w-24 md:h-24 rounded-[24px] md:rounded-[32px] flex items-center justify-center mb-6 md:mb-8">
              <TrendingUp className="w-8 h-8 md:w-12 md:h-12 text-indigo-300" />
            </div>
            <h2 className="text-xl md:text-3xl font-black text-gray-900 mb-3 md:mb-4">No data streams found</h2>
            <p className="text-gray-500 max-w-sm mx-auto font-medium text-sm md:text-base">Once students submit their answers, you will see a pedagogical breakdown here.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
              <StatCard 
                icon={<Target className="text-indigo-600" />} 
                label="Accuracy" 
                value={`${Math.round(stats?.accuracy || 0)}%`} 
                trend="Healthy"
              />
              <StatCard 
                icon={<Clock className="text-purple-600" />} 
                label="Avg Time" 
                value="12m" 
                trend="On track"
              />
              <StatCard 
                icon={<Brain className="text-pink-600" />} 
                label="Grip" 
                value="4.2/5" 
                trend="Certain"
              />
              <StatCard 
                icon={<FileText className="text-orange-600" />} 
                label="Done" 
                value="98%" 
                trend="High"
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-8 mb-8">
              <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6 md:mb-10">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900">Knowledge Heatmap</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Metacognition Overview</p>
                  </div>
                </div>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats?.confidenceChartData}>
                      <defs>
                        <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="confidence" stroke="#94a3b8" fontSize={9} fontVariant="bold" />
                      <YAxis stroke="#94a3b8" fontSize={9} fontVariant="bold" />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '10px' }}
                      />
                      <Area type="monotone" dataKey="accuracy" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-6 md:mb-10">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-gray-900">Concept Success</h3>
                    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Per-Question Rate</p>
                  </div>
                </div>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={quiz.questions.map((q, i) => ({
                      name: `Q${i+1}`,
                      accuracy: Math.round((responses.filter(r => r.entries.find(e => e.questionId === q.id)?.isCorrect).length / responses.length) * 100)
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} fontVariant="bold" />
                      <YAxis stroke="#94a3b8" fontSize={9} fontVariant="bold" />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', fontSize: '10px' }} />
                      <Bar dataKey="accuracy" radius={[8, 8, 8, 8]} barSize={24}>
                        {quiz.questions.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[32px] md:rounded-[48px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-10 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="text-xl md:text-2xl font-black text-gray-900">Student Log</h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-100 text-[10px] font-bold text-gray-400">
                  <Users className="w-3.5 h-3.5" /> Live Tracking
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50/30 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      <th className="px-6 md:px-10 py-5 md:py-6">Respondent</th>
                      <th className="px-6 md:px-10 py-5 md:py-6">Date</th>
                      <th className="px-6 md:px-10 py-5 md:py-6">Grade</th>
                      <th className="px-6 md:px-10 py-5 md:py-6">Depth</th>
                      <th className="px-6 md:px-10 py-5 md:py-6 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {responses.map((resp) => (
                      <tr key={resp.id} className="group hover:bg-gray-50/80 transition-all">
                        <td className="px-6 md:px-10 py-6 md:py-8">
                          <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-base md:text-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              {resp.respondentName.charAt(0)}
                            </div>
                            <p className="font-black text-gray-900 text-base md:text-lg truncate max-w-[120px] md:max-w-none">{resp.respondentName}</p>
                          </div>
                        </td>
                        <td className="px-6 md:px-10 py-6 md:py-8">
                           <p className="text-gray-900 font-bold text-sm md:text-base">{new Date(resp.endTime).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 md:px-10 py-6 md:py-8">
                           <div className="flex items-baseline gap-1">
                              <span className="text-xl md:text-2xl font-black text-indigo-600">{resp.totalScore}</span>
                              <span className="text-xs md:text-sm font-bold text-gray-300">/{quiz.questions.reduce((a,b)=>a+b.points, 0)}</span>
                           </div>
                        </td>
                        <td className="px-6 md:px-10 py-6 md:py-8">
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(star => {
                               const avgConf = Math.round(resp.entries.reduce((a,b)=>a+(b.confidence||0),0)/resp.entries.length);
                               return <div key={star} className={`w-1.5 md:w-2 h-4 md:h-5 rounded-full transition-all ${star <= avgConf ? 'bg-indigo-600' : 'bg-gray-200 opacity-30'}`}></div>
                            })}
                          </div>
                        </td>
                        <td className="px-6 md:px-10 py-6 md:py-8 text-right">
                          <button 
                            onClick={() => setSelectedResponse(resp)}
                            className="p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string; trend: string }> = ({ icon, label, value, trend }) => (
  <div className="bg-white p-5 md:p-10 rounded-[28px] md:rounded-[48px] shadow-sm border border-gray-100 group hover:border-indigo-100 transition-all">
    <div className="bg-gray-50 w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-8 transition-all duration-500">
      {/* Fix: use React.isValidElement and cast to React.ReactElement<any> to satisfy TypeScript for cloneElement */}
      {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: 'w-5 h-5 md:w-6 md:h-6' }) : icon}
    </div>
    <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 md:mb-3">{label}</p>
    <p className="text-xl md:text-4xl font-black text-gray-900 mb-1 md:mb-2">{value}</p>
    <p className="text-[9px] md:text-xs text-emerald-500 font-black">{trend}</p>
  </div>
);

export default AnalyticsPage;
