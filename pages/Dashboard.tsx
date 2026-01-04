
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Quiz, User } from '../types';
import { storageService } from '../services/storage';
import { FiPlus, FiSearch, FiTrash2, FiExternalLink, FiBarChart2, FiPlay, FiEdit3, FiCheck, FiFilter } from 'react-icons/fi';
import { HiOutlineClock, HiOutlineClipboardDocumentList } from 'react-icons/hi2';
import { Button, Card, Input } from '../components/UI';

interface DashboardProps {
  user: User;
}

const DashboardPage: React.FC<DashboardProps> = ({ user }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setQuizzes(storageService.getQuizzes().filter(q => q.creatorId === user.id));
  }, [user.id]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this assessment permanently?')) {
      storageService.deleteQuiz(id);
      setQuizzes(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleShare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const url = `${window.location.origin}/#/quiz/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <header className="bg-white border-b border-gray-100 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter">My Assessments</h1>
            <p className="text-gray-400 font-medium">You have {quizzes.length} active projects in your library.</p>
          </div>
          <Button onClick={() => navigate('/create')} size="lg" icon={<FiPlus />}>
            New Assessment
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <Input 
            placeholder="Search assessments..." 
            icon={<FiSearch />} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="outline" icon={<FiFilter />}>Filters</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredQuizzes.length === 0 ? (
            <div className="col-span-full py-32 text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                <HiOutlineClipboardDocumentList className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No assessments found</h3>
              <p className="text-gray-400 font-medium mb-8">Start by creating a new quiz from a template or using AI.</p>
              <Button onClick={() => navigate('/create')}>Create First Quiz</Button>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <Card 
                key={quiz.id} 
                onClick={() => navigate(`/builder/${quiz.id}`)}
                className="group h-full flex flex-col overflow-hidden"
              >
                <div 
                  className="h-32 relative transition-all"
                  style={{ backgroundColor: quiz.themeColor || '#6366f1' }}
                >
                  {quiz.coverImage && <img src={quiz.coverImage} className="w-full h-full object-cover mix-blend-overlay opacity-50" />}
                  <button 
                    onClick={(e) => handleDelete(e, quiz.id)}
                    className="absolute top-4 right-4 p-2 bg-black/10 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="p-8 flex-grow flex flex-col">
                  <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-1">{quiz.title || "Untitled"}</h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-8">
                    <span className="flex items-center gap-1.5"><HiOutlineClock /> {new Date(quiz.updatedAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><HiOutlineClipboardDocumentList /> {quiz.questions.length} Qs</span>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant={copiedId === quiz.id ? 'primary' : 'outline'} 
                        onClick={(e) => handleShare(e, quiz.id)}
                        className="!rounded-xl"
                        icon={copiedId === quiz.id ? <FiCheck /> : <FiExternalLink />}
                      >
                        {copiedId === quiz.id ? 'Copied' : 'Share'}
                      </Button>
                      <Button 
                        variant="primary" 
                        onClick={(e) => { e.stopPropagation(); navigate(`/quiz/${quiz.id}`); }}
                        className="!rounded-xl"
                        icon={<FiPlay />}
                        style={{ backgroundColor: quiz.themeColor }}
                      >
                        Play
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={(e) => { e.stopPropagation(); navigate(`/analytics/${quiz.id}`); }}
                      className="w-full !rounded-xl"
                      icon={<FiBarChart2 />}
                    >
                      Analytics
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
