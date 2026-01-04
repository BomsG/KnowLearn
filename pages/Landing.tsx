
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiChevronRight, FiInstagram, FiTwitter, FiFacebook, FiX, FiSend, FiCpu, FiTarget, FiZap, FiShield, FiTrendingUp } from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi2';
import { Button } from '../components/UI';
import { storageService } from '../services/storage';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(0);
  const [studentIndex, setStudentIndex] = useState(0);
  const [showDemo, setShowDemo] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!storageService.getCurrentUser());
  }, []);

  // Auto-slide for student feedback
  useEffect(() => {
    const timer = setInterval(() => {
      setStudentIndex((prev) => (prev + 1) % students.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle escape key for demo modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowDemo(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const values = [
    { 
      icon: <FiCpu className="text-blue-500" />, 
      title: "AI Generation", 
      desc: "Generate expert-level assessments in seconds using our advanced pedagogical AI engine.",
      color: "bg-blue-50"
    },
    { 
      icon: <FiShield className="text-orange-400" />, 
      title: "Integrity Control", 
      desc: "Ensure academic honesty with our integrated anti-cheat measures and randomized question logic.",
      color: "bg-orange-50"
    },
    { 
      icon: <FiTrendingUp className="text-purple-500" />, 
      title: "Grip Analysis", 
      desc: "Analyze not just what students know, but how confident they are with our unique knowledge-grip metrics.",
      color: "bg-purple-50"
    }
  ];

  const frameworks = [
    { 
      title: "Adaptive Diagnostics", 
      desc: "AI-driven difficulty scaling that adjusts in real-time based on student response patterns.",
      icon: <FiTrendingUp />,
      accent: "border-blue-100"
    },
    { 
      title: "Formative Logic", 
      desc: "Integrated feedback loops that guide students through misconceptions during the assessment.",
      icon: <FiZap />,
      accent: "border-purple-100"
    },
    { 
      title: "Summative Security", 
      desc: "High-stakes testing environments with dynamic question banks and proctoring metadata.",
      icon: <FiShield />,
      accent: "border-indigo-100"
    },
    { 
      title: "Metacognitive Tracking", 
      desc: "Exclusive engine that maps student confidence against accuracy to identify 'lucky guesses'.",
      icon: <FiTarget />,
      accent: "border-pink-100"
    }
  ];

  const students = [
    { 
      name: "Martin Watson", 
      subject: "Senior Researcher", 
      flag: "🎓", 
      quote: "knowLearn has completely transformed how we conduct mid-terms. The AI generation saves hours of manual work while maintaining high academic standards." 
    },
    { 
      name: "Sarah Jenkins", 
      subject: "Medical Student", 
      flag: "🏥", 
      quote: "The confidence tracking is a game-changer. It helped me realize I was guessing on topics I thought I knew well, allowing me to focus my studies effectively." 
    },
    { 
      name: "Luca Moretti", 
      subject: "High School Teacher", 
      flag: "🏫", 
      quote: "My students find the interface much more engaging than traditional forms. The real-time feedback loop keeps them motivated throughout the semester." 
    }
  ];

  const faqs = [
    {
      q: "How does the AI ensure question accuracy?",
      a: "Our AI engine leverages Gemini 3 Pro to evaluate pedagogical clarity. It doesn't just generate questions; it analyzes distractor validity and ensures that the difficulty levels align with Bloom's Taxonomy for effective learning verification."
    },
    {
      q: "Can I import existing questions from CSV?",
      a: "Yes, our bulk importer supports CSV, JSON, and standard pedagogical formats, allowing you to transition your legacy assessments into our intelligent framework instantly."
    },
    {
      q: "Is student data encrypted and private?",
      a: "Absolutely. We adhere to SOC2 and GDPR standards. All assessment data is encrypted at rest and in transit, ensuring institutional privacy is never compromised."
    },
    {
      q: "Does it support complex mathematical formulas?",
      a: "We provide full LaTeX support and an integrated symbolic math engine for STEM subjects, ensuring precision in scientific assessments."
    },
    {
      q: "What is the limit for concurrent participants?",
      a: "Our distributed cloud architecture supports up to 50,000 concurrent students per assessment, perfect for large-scale university finals."
    },
    {
      q: "How does the confidence-grip engine work?",
      a: "It maps student confidence levels against actual accuracy to identify 'knowledge gaps' versus 'uncertainty,' providing teachers with a heat-map of real understanding."
    }
  ];

  const handleCta = () => {
    if (isLoggedIn) navigate('/dashboard');
    else navigate('/signup');
  };

  return (
    <div className={`min-h-screen bg-white transition-all duration-500 ${showDemo ? 'overflow-hidden' : ''}`}>
      {/* Demo Modal Overlay */}
      {showDemo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl" onClick={() => setShowDemo(false)} />
           <div className="relative w-full max-w-6xl aspect-video bg-black rounded-[40px] md:rounded-[64px] overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.3)] border border-white/10 group animate-in zoom-in-95 duration-500">
              <button 
                onClick={() => setShowDemo(false)}
                className="absolute top-6 right-6 md:top-10 md:right-10 z-20 w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/10 text-white backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-all"
              >
                <FiX className="w-6 h-6 md:w-8 md:h-8" />
              </button>
              <iframe 
                className="w-full h-full pointer-events-auto"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&controls=1&showinfo=0" 
                title="knowLearn Demo"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
           </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex justify-between items-center px-12 py-8 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-gray-900 cursor-pointer" onClick={() => navigate('/')}>
          know<span className="text-indigo-600">Learn</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="!rounded-full px-8 py-3 border-indigo-100 text-indigo-600 hover:bg-indigo-50 transition-all active:scale-95" 
          onClick={handleCta}
        >
          {isLoggedIn ? 'Go to Dashboard' : 'Get started'}
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="px-12 py-12 lg:py-24 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <div className="lg:w-1/2">
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-10 tracking-tight">
            A <span className="text-indigo-600">unique</span> approach to academic excellence
          </h1>
          <p className="text-gray-400 text-lg mb-12 max-w-sm leading-relaxed font-medium">
            Build intelligent assessments, track student confidence, and unlock data-driven learning outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="!rounded-2xl px-12 py-5 shadow-xl shadow-indigo-100" onClick={handleCta}>
              {isLoggedIn ? 'View Library' : 'Get started'}
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="!rounded-2xl text-gray-400 hover:text-indigo-600 transition-colors" 
              icon={<FiPlay />}
              onClick={() => setShowDemo(true)}
            >
              Watch Demo
            </Button>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative">
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-50/60 rounded-[100px] rotate-12 scale-110" />
          
          <div className="relative">
             <img 
               src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" 
               className="w-full h-auto aspect-[4/5] object-cover rounded-[50px] shadow-2xl" 
               alt="Digital Learning" 
             />
             
             <div className="absolute -top-10 -left-6 bg-white p-4 rounded-3xl shadow-2xl flex items-center gap-3 animate-bounce">
                <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center text-white">
                  <HiOutlineAcademicCap className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-900">Dr. Amanda Morgan</p>
                   <p className="text-[8px] font-bold text-gray-400">Head of Pedagogy</p>
                </div>
             </div>
             
             <div className="absolute top-1/4 -right-12 bg-white p-5 rounded-3xl shadow-2xl">
                <p className="text-xs font-black text-indigo-600">98% Accuracy</p>
                <p className="text-[10px] font-bold text-gray-400">AI Content Engine</p>
             </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 max-w-7xl mx-auto px-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6">Why choose us</p>
        <h2 className="text-5xl font-black text-gray-900 mb-20">Our pillars</h2>
        <div className="grid md:grid-cols-3 gap-16">
          {values.map((v, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className={`w-24 h-24 ${v.color} rounded-3xl flex items-center justify-center text-4xl mb-10 transition-transform group-hover:scale-110 group-hover:rotate-6 duration-500`}>
                {v.icon}
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">{v.title}</h3>
              <p className="text-gray-400 font-medium text-sm leading-relaxed max-w-xs">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Frameworks Section */}
      <section className="py-32 max-w-7xl mx-auto px-12">
        <div className="mb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6">Assessment Methodology</p>
          <h2 className="text-5xl font-black text-gray-900">Versatile Frameworks</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {frameworks.map((f, i) => (
            <div key={i} className={`p-10 rounded-[48px] border-2 ${f.accent} bg-white group hover:bg-indigo-600 transition-all duration-500 hover:border-transparent hover:-translate-y-4`}>
              <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-3xl mb-10 group-hover:bg-white/20 group-hover:text-white transition-colors">
                {f.icon}
              </div>
              <h4 className="text-xl font-black text-gray-900 mb-4 group-hover:text-white transition-colors">{f.title}</h4>
              <p className="text-sm font-medium text-gray-400 leading-relaxed group-hover:text-indigo-50 transition-colors">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section (Restored) */}
      <section className="py-32 max-w-7xl mx-auto px-12">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-6">Common Inquiries</p>
        <h2 className="text-5xl font-black text-gray-900 mb-20">Assessment Intelligence</h2>
        <div className="grid md:grid-cols-2 gap-6">
           {faqs.map((faq, i) => (
             <div 
               key={i} 
               className={`p-10 rounded-[40px] border transition-all duration-500 cursor-pointer select-none ${expandedFAQ === i ? 'bg-indigo-600 text-white border-transparent shadow-2xl shadow-indigo-200' : 'bg-white border-gray-100 hover:border-indigo-100'}`}
               onClick={() => setExpandedFAQ(i === expandedFAQ ? null : i)}
             >
                <div className="flex justify-between items-center">
                   <h4 className="font-bold text-base md:text-lg pr-8">{faq.q}</h4>
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${expandedFAQ === i ? 'bg-white text-indigo-600 rotate-45' : 'bg-indigo-50 text-indigo-600'}`}>
                      {expandedFAQ === i ? <FiX className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5 rotate-90 md:rotate-0" />}
                   </div>
                </div>
                {expandedFAQ === i && (
                  <div className="mt-8 text-sm md:text-base text-indigo-100 leading-relaxed font-medium animate-in fade-in slide-in-from-top-2">
                     {faq.a}
                  </div>
                )}
             </div>
           ))}
        </div>
      </section>

      {/* Trial Section */}
      <section className="py-40 max-w-7xl mx-auto px-12 text-center">
        <h2 className="text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">Try the AI builder today</h2>
        <p className="text-gray-400 font-bold text-lg mb-16">Design your first academic assessment in under 60 seconds.</p>
        <div className="flex max-w-xl mx-auto bg-gray-50 rounded-full p-2 pl-8 border border-gray-100 shadow-inner">
           <input type="email" placeholder="Enter academic email" className="bg-transparent flex-grow outline-none font-bold text-sm" />
           <Button className="!rounded-full px-12 py-5 shadow-lg" icon={<FiSend />} onClick={handleCta}>Get started</Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-12 py-24 max-w-7xl mx-auto bg-indigo-50/40 rounded-[80px] mb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-16">
           <div className="col-span-2 md:col-span-1">
              <div className="text-3xl font-black tracking-tighter text-gray-900 mb-8">
                know<span className="text-indigo-600">Learn</span>
              </div>
              <p className="text-[11px] text-gray-400 font-bold leading-relaxed mb-10">
                2025 knowLearn. All rights reserved. <br/>Precision academic assessments for the modern era.
              </p>
           </div>
           
           <div>
              <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 mb-8">Company</h5>
              <div className="flex flex-col gap-5 text-xs font-bold text-gray-400">
                 <a href="#" className="hover:text-indigo-600 transition-colors">About Us</a>
                 <a href="#" className="hover:text-indigo-600 transition-colors">Support</a>
              </div>
           </div>
           
           <div>
              <h5 className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-900 mb-8">Product</h5>
              <div className="flex flex-col gap-5 text-xs font-bold text-gray-400">
                 <a href="#" className="hover:text-indigo-600 transition-colors">AI Builder</a>
                 <a href="#" className="hover:text-indigo-600 transition-colors">Analytics</a>
              </div>
           </div>
           
           <div className="flex items-end justify-end gap-6 h-full col-span-2">
              <a href="#" className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:shadow-lg transition-all"><FiTwitter className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:shadow-lg transition-all"><FiInstagram className="w-5 h-5" /></a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:shadow-lg transition-all"><FiFacebook className="w-5 h-5" /></a>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
