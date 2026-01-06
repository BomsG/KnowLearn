import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  GraduationCap,
  BookOpen,
  ClipboardList,
  Award,
  Sparkles,
  ArrowLeft,
  Search,
  Layout,
  X,
  Brain,
  AlertCircle,
  Key,
  ExternalLink,
} from "lucide-react";
import { aiService } from "../services/gemini";
import { storageService } from "../services/storage";

const CreateQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [showAiModal, setShowAiModal] = useState(false);
  const [topic, setTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [hasKey, setHasKey] = useState(true);

  // Removed checkKeyStatus and handleOpenKeySelector to prevent local environment errors
  // The app will rely on process.env.API_KEY being injected by the environment.

  const handleAiGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setError("");

    const user = storageService.getCurrentUser();
    if (!user) {
      setError("Session expired. Please log in again.");
      setIsGenerating(false);
      return;
    }

    try {
      const generatedQuiz = await aiService.generateQuizFromTopic(
        topic,
        user.id
      );
      storageService.saveQuiz(generatedQuiz);
      navigate(`/builder/${generatedQuiz.id}`);
    } catch (err: any) {
      if (
        err.message === "API_KEY_INVALID" ||
        err.message?.includes("Requested entity was not found")
      ) {
        setError(
          "AI connection failed. Please ensure a valid API key is configured."
        );
      } else {
        setError(
          err.message || "The magic failed. Please try a different topic."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const templates = [
    {
      id: "blank",
      icon: <Plus className="w-8 h-8" />,
      label: "Blank Assessment",
      color: "bg-indigo-600 text-white",
      desc: "Start from scratch",
    },
    {
      id: "final",
      icon: <GraduationCap className="w-8 h-8" />,
      label: "Final Exam",
      color: "bg-blue-50 text-blue-600",
      desc: "Formal testing mode",
    },
    {
      id: "quiz",
      icon: <BookOpen className="w-8 h-8" />,
      label: "Quick Quiz",
      color: "bg-purple-50 text-purple-600",
      desc: "Engagement check",
    },
    {
      id: "hw",
      icon: <ClipboardList className="w-8 h-8" />,
      label: "Homework",
      color: "bg-emerald-50 text-emerald-600",
      desc: "Take-home assignment",
    },
    {
      id: "placement",
      icon: <Award className="w-8 h-8" />,
      label: "Placement",
      color: "bg-amber-50 text-amber-600",
      desc: "Level assessment",
    },
    {
      id: "ai",
      icon: <Sparkles className="w-8 h-8" />,
      label: "AI Generator",
      color: "bg-pink-50 text-pink-600",
      desc: "Build with Magic",
      action: () => setShowAiModal(true),
    },
  ];

  return (
    <div className="min-h-screen bg-[#fcfdff] py-16 px-8 relative">
      {/* AI Builder Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-xl transition-all"
            onClick={() => !isGenerating && setShowAiModal(false)}
          />
          <div className="relative bg-white w-full max-w-xl rounded-[48px] shadow-[0_32px_128px_rgba(0,0,0,0.2)] p-12 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="absolute top-0 right-0 p-8 text-indigo-50 font-black text-8xl pointer-events-none uppercase opacity-50">
              Magic
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-100">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                    AI Assessment
                  </h3>
                </div>
                {!isGenerating && (
                  <button
                    onClick={() => setShowAiModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                )}
              </div>

              {isGenerating ? (
                <div className="py-12 text-center">
                  <div className="relative inline-block mb-10">
                    <div className="w-24 h-24 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
                    <Brain className="w-10 h-10 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-2">
                    Crafting Assessment...
                  </h4>
                  <p className="text-gray-500 font-medium">
                    Researching context and pedagogical distractors.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAiGenerate} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                      What is the assessment topic?
                    </label>
                    <textarea
                      className={`w-full px-8 py-6 bg-gray-50 border-2 rounded-[32px] focus:bg-white focus:border-indigo-600 outline-none transition-all text-xl font-bold text-gray-900 shadow-inner h-44 resize-none ${
                        error ? "border-red-100" : "border-transparent"
                      }`}
                      placeholder="e.g. Molecular biology basics for high schoolers..."
                      value={topic}
                      onChange={(e) => {
                        setTopic(e.target.value);
                        setError("");
                      }}
                      autoFocus
                    />
                  </div>

                  {error && (
                    <div className="p-5 bg-red-50 text-red-700 rounded-3xl text-sm font-bold border border-red-100 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!topic.trim()}
                    className="w-full py-6 bg-indigo-600 text-white rounded-[28px] font-black text-2xl hover:brightness-110 transition-all shadow-2xl shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    Spark Magic <Sparkles className="w-6 h-6" />
                  </button>

                  <p className="text-center text-[10px] font-black text-gray-300 uppercase tracking-widest">
                    Powered by Gemini 3 Flash
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 gap-8">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
              New Assessment
            </h1>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:border-indigo-600 transition-all text-sm font-bold shadow-sm"
            />
          </div>
        </div>

        <div className="mb-20">
          <div className="flex items-center gap-3 mb-10">
            <Layout className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-black text-gray-900">Templates</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={tmpl.action ? tmpl.action : () => navigate("/builder")}
                className="group bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all text-left flex flex-col items-start h-full"
              >
                <div
                  className={`w-16 h-16 ${tmpl.color} rounded-2xl flex items-center justify-center mb-8 transition-all group-hover:scale-110 group-hover:rotate-6`}
                >
                  {tmpl.icon}
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-2">
                  {tmpl.label}
                </h3>
                <p className="text-gray-400 font-medium text-base leading-relaxed mb-8">
                  {tmpl.desc}
                </p>
                <div className="mt-auto flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                  Get Started <Plus className="w-4 h-4" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateQuizPage;
