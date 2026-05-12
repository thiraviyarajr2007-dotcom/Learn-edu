import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth, UserProfile } from './context/AuthContext';
import { useEducation, Course, Module, ForumPost, ForumReply, Quiz, Interaction, QuizAttempt, Badge } from './hooks/useEducation';
import { 
  BookOpen, 
  LayoutDashboard, 
  MessageSquare, 
  User, 
  LogOut, 
  GraduationCap, 
  ChevronRight,
  Plus,
  Settings,
  X,
  Send,
  Search,
  Check,
  Award,
  Zap,
  HelpCircle,
  FileText,
  MessageCircle,
  Hash,
  ArrowRight,
  TrendingUp,
  Search as SearchIcon,
  Crown,
  Trophy,
  CheckCircle2,
  Circle,
  ChevronLeft,
  Sparkles,
  AlertTriangle,
  Brain,
  Users,
  Lock,
  Heart,
  PieChart as PieChartIcon,
  Download,
  Lightbulb
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ReactMarkdown from 'react-markdown';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// --- Teacher Alert Hub ---
const TeacherAlertHub = () => {
  const { getTeacherAlerts } = useEducation();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    return getTeacherAlerts(setAlerts);
  }, []);

  return (
    <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 mb-8 overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <AlertTriangle className="w-32 h-32 text-rose-500" />
      </div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-rose-500 text-white rounded-lg animate-pulse">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-rose-700">Priority Intervention Matrix</h2>
            <p className="text-[10px] font-bold text-rose-600/60 uppercase">Real-time identification of learning gaps</p>
          </div>
        </div>
        <span className="text-[10px] font-black text-rose-500 bg-rose-100 px-2 py-1 rounded uppercase">{alerts.length} Pending Actions</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.length > 0 ? alerts.map(alert => (
          <div key={alert.id} className="bg-white border border-rose-100 p-4 rounded-xl flex items-start gap-4 shadow-sm group hover:border-rose-300 transition-all">
            <div className={`p-2 rounded-lg shrink-0 ${alert.severity === 'high' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
               <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
               <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-black text-slate-900 truncate uppercase">{alert.userName}</p>
                  <span className="text-[8px] font-bold text-rose-400 uppercase">{alert.severity} PRIORITY</span>
               </div>
               <p className="text-[10px] text-slate-500 leading-tight mb-3 line-clamp-2">{alert.message}</p>
               <button className="text-[9px] font-black text-rose-600 uppercase tracking-widest hover:underline">Launch Remedial Track →</button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-8 text-center text-rose-400 italic font-bold text-[10px] uppercase">All students tracking positive performance vectors.</div>
        )}
      </div>
    </div>
  );
};

// --- Student Performance Insights ---
const StudentPerformanceInsights = () => {
  const { profile } = useAuth();
  const { getStudentAnalysis } = useEducation();
  const [analysis, setAnalysis] = useState<any>(null);

  useEffect(() => {
    if (!profile) return;
    return getStudentAnalysis(profile.uid, setAnalysis);
  }, [profile]);

  if (!analysis) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
       {/* AI Learner Classification */}
       <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl -mr-12 -mt-12 group-hover:bg-indigo-500/20 transition-all" />
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-indigo-600 text-white rounded-lg">
                <Brain className="w-4 h-4" />
             </div>
             <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">Cognitive Classification</h3>
          </div>
          <div className="mb-4">
             <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
               analysis.type === 'Fast' ? 'bg-emerald-500/10 text-emerald-400' : 
               analysis.type === 'Slow' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
             }`}>
               {analysis.type} Learner
             </span>
          </div>
          <p className="text-2xl font-black text-white mb-2 italic">
            {analysis.type === 'Slow' ? 'Remedial Mode Active' : analysis.type === 'Fast' ? 'Excelling Curve' : 'Stable Growth'}
          </p>
          <div className="flex items-center gap-2">
             <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${
                  analysis.score > 80 ? 'bg-emerald-500' : analysis.score < 50 ? 'bg-rose-500' : 'bg-amber-500'
                }`} style={{ width: `${analysis.score}%` }} />
             </div>
             <span className="text-[10px] font-black text-white/40">{analysis.score}%</span>
          </div>
          
          {/* Marks Trend Sparkline */}
          <div className="mt-4 flex items-end gap-1 h-8 opacity-40">
             {[30, 45, 32, 60, 55, 70, 65].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500 rounded-t-sm" style={{ height: `${h}%` }} />
             ))}
          </div>
          <p className="text-[8px] font-black uppercase text-white/20 mt-2 tracking-widest">Assessment Vector Trend</p>
       </div>

       {/* Peer Mentorship Pair */}
       <div className="bg-white rounded-2xl p-6 border border-slate-200 relative overflow-hidden group">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Users className="w-4 h-4" />
             </div>
             <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Peer Collaboration</h3>
          </div>
          <div className="flex items-center gap-4 mb-4">
             <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-900 flex items-center justify-center text-[10px] font-black text-white">YOU</div>
                <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center text-[10px] font-black text-indigo-600">SM</div>
             </div>
             <div>
                <p className="text-xs font-black text-slate-900 uppercase">Sarah M. (Mentor)</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Direct line active</p>
             </div>
          </div>
          <button className="w-full py-2 bg-slate-100 text-slate-900 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">Start Huddle</button>
       </div>

       {/* Remedial Suggestions */}
       <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
             <div className="p-2 bg-amber-500 text-white rounded-lg">
                <Zap className="w-4 h-4" />
             </div>
             <h3 className="text-xs font-black uppercase tracking-widest text-amber-700">Remedial Focus</h3>
          </div>
          <div className="space-y-2">
             <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Simplified Notes: Motion</span>
                </div>
                <button className="text-[8px] bg-amber-500 text-white px-2 py-0.5 rounded font-black uppercase">Open</button>
             </div>
             <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-200">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span className="text-[10px] font-bold text-slate-600 uppercase">Visual Aid: Periodic Table</span>
                </div>
                <button className="text-[8px] bg-amber-500 text-white px-2 py-0.5 rounded font-black uppercase">Open</button>
             </div>
          </div>
       </div>
    </div>
  );
};// --- Mascots and helper components ---
const MathBuddyMascot = ({ mood = 'happy' }: { mood?: 'happy' | 'excited' | 'thinking' }) => (
  <motion.div 
    animate={{ y: [0, -5, 0] }}
    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    className="relative w-24 h-24"
  >
    <div className="absolute inset-0 bg-indigo-600 rounded-[28%] rotate-6 shadow-xl" />
    <div className="absolute inset-0 bg-slate-800 rounded-[24%] -rotate-3 border-2 border-slate-700 flex flex-col items-center justify-center">
      {/* Face */}
      <div className="flex gap-4 mb-2">
        <motion.div 
          animate={mood === 'happy' ? { scaleY: [1, 0.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.2] }}
          className="w-2.5 h-2.5 bg-emerald-400 rounded-full" 
        />
        <motion.div 
          animate={mood === 'happy' ? { scaleY: [1, 0.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.2] }}
          className="w-2.5 h-2.5 bg-emerald-400 rounded-full" 
        />
      </div>
      <div className={`w-6 h-3 border-b-4 border-emerald-400 ${mood === 'happy' ? 'rounded-full' : 'rounded-none'}`} />
    </div>
    <div className="absolute -top-2 -right-2 bg-indigo-500 w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
      <Zap className="w-4 h-4 text-white fill-white" />
    </div>
  </motion.div>
);

// --- Dashboard Component ---
const Dashboard = ({ 
  onSelectCourse, 
  overallProgress, 
  badges,
  onSeed
}: { 
  onSelectCourse: (c: Course) => void,
  overallProgress: Record<string, number>,
  badges: Badge[],
  onSeed?: () => void
}) => {
  const { profile } = useAuth();
  const { courses, loading, getProgress } = useEducation();
  const [dailyXP, setDailyXP] = useState(0);
  const [selectedTerm, setSelectedTerm] = useState<'Term 1' | 'Term 2' | 'Term 3' | 'Full Year'>('Term 1');
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics');

  useEffect(() => {
    if (!profile) return;
    const unsubProgress = getProgress(profile.uid, (p) => {
      let xp = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      p.forEach(item => {
        if (item.status === 'completed') {
          const updateDate = item.updatedAt?.toDate ? item.updatedAt.toDate() : new Date();
          if (updateDate && updateDate >= today) {
            xp += 50;
          }
        }
      });
      setDailyXP(xp);
    });

    return () => unsubProgress();
  }, [profile]);

  // Filter courses based on user profile and selection
  const filteredCourses = courses.filter(c => 
    c.syllabusId === profile?.syllabus && 
    c.grade === profile?.grade &&
    c.term === selectedTerm &&
    c.subject === selectedSubject
  ).sort((a,b) => a.title.localeCompare(b.title)); // Rough sort if order isn't explicit

  const dailyGoalXPMap = {
    'Casual': 10,
    'Regular': 30,
    'Serious': 50,
    'Insane': 100
  };
  const targetXP = dailyGoalXPMap[profile?.dailyGoal || 'Regular'];
  const progressPercent = Math.min((dailyXP / targetXP) * 100, 100);

  if (loading) return <div className="flex items-center justify-center h-full text-slate-400 font-black uppercase text-xs tracking-widest">Compiling Learning Path...</div>;

  return (
    <div className="p-12 max-w-4xl mx-auto pb-40">
      {/* Progress Overview Section */}
      <section className="mb-20">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Curriculum Health</h2>
            <div className="flex items-center gap-2">
               <TrendingUp className="w-3 h-3 text-indigo-500" />
               <span className="text-[10px] font-black text-indigo-900 uppercase">Growth Mode Active</span>
            </div>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Mathematics', 'Environmental Science'].map(sub => {
               const subCourses = courses.filter(c => c.subject === sub && c.syllabusId === profile?.syllabus && c.grade === profile?.grade);
               const completedTasks = subCourses.reduce((acc, c) => acc + (overallProgress[c.id] || 0), 0);
               const totalPossible = subCourses.length * 5; // Assuming 5 modules per unit for estimation
               const pct = totalPossible > 0 ? Math.round((completedTasks / totalPossible) * 100) : 0;

               return (
                  <div key={sub} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:shadow-md transition-all">
                     <div className="relative w-16 h-16 mb-4">
                        <svg className="w-full h-full -rotate-90">
                           <circle cx="32" cy="32" r="28" className="stroke-slate-50 fill-none" strokeWidth="4" />
                           <motion.circle 
                              cx="32" cy="32" r="28" 
                              className="stroke-indigo-500 fill-none" 
                              strokeWidth="4" 
                              strokeLinecap="round"
                              initial={{ strokeDasharray: "176", strokeDashoffset: "176" }}
                              animate={{ strokeDashoffset: `${176 - (176 * pct) / 100}` }}
                              transition={{ duration: 2, delay: 0.5 }}
                           />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <span className="text-[10px] font-black text-slate-900">{pct}%</span>
                        </div>
                     </div>
                     <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{sub === 'Mathematics' ? 'Logic' : 'Nature'}</p>
                     <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{sub === 'Mathematics' ? 'Math' : 'EVS'}</p>
                  </div>
               );
            })}
            
            <div className="bg-indigo-600 p-6 rounded-3xl text-white flex flex-col items-center justify-center text-center shadow-lg shadow-indigo-200">
               <Zap className="w-6 h-6 fill-white mb-2" />
               <p className="text-[8px] font-black text-indigo-200 uppercase tracking-widest">Global Rank</p>
               <p className="text-xl font-black italic">#14</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-3xl text-white flex flex-col items-center justify-center text-center">
               <Users className="w-6 h-6 text-indigo-400 mb-2" />
               <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Peers Online</p>
               <p className="text-xl font-black italic">128</p>
            </div>
         </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
         {/* Daily Goal Card */}
         <div className="col-span-2 bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-indigo-100/30 flex items-center gap-8 group">
            <div className="relative w-24 h-24 shrink-0">
               <svg className="w-full h-full -rotate-90">
                  <circle cx="48" cy="48" r="40" className="stroke-slate-50 fill-none" strokeWidth="8" />
                  <motion.circle 
                    cx="48" cy="48" r="40" 
                    className="stroke-amber-400 fill-none" 
                    strokeWidth="8" 
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "251", strokeDashoffset: "251" }}
                    animate={{ strokeDashoffset: `${251 - (251 * progressPercent) / 100}` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-slate-900 leading-none">{Math.round(progressPercent)}%</span>
               </div>
            </div>
            <div>
               <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Today's Goal: {profile?.dailyGoal}</h3>
               <p className="text-xl font-black text-slate-900 mb-2">{dailyXP} / {targetXP} XP earned</p>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">You're doing great, {profile?.name.split(' ')[0]}!</span>
               </div>
            </div>
         </div>

         {/* Badge Teaser */}
         <div className="bg-slate-900 rounded-[40px] p-8 border border-slate-800 shadow-xl flex flex-col justify-center items-center text-center">
             <div className="text-4xl mb-4 grayscale hover:grayscale-0 transition-all cursor-pointer">
                {badges[0]?.icon || '🏆'}
             </div>
             <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Latest Achievement</h3>
             <p className="text-white font-black text-sm uppercase truncate w-full">{badges[0]?.title || 'Locked'}</p>
         </div>
      </div>

      <header className="flex flex-col items-center text-center gap-4 mb-16 relative">
        <MathBuddyMascot mood={progressPercent >= 100 ? 'excited' : 'happy'} />
        <div className="mt-4">
          <h2 className="text-indigo-900 font-black uppercase text-[12px] tracking-[0.3em] mb-2">{profile?.grade} • {profile?.syllabus}</h2>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase italic underline decoration-[10px] decoration-indigo-200 underline-offset-4">{selectedSubject} Quest</h1>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-20">
         <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
            {['Term 1', 'Term 2', 'Term 3'].map((t) => (
               <button 
                 key={t}
                 onClick={() => setSelectedTerm(t as any)}
                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   selectedTerm === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 {t}
               </button>
            ))}
         </div>
         <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
            {['Mathematics', 'Environmental Science'].map((s) => (
               <button 
                 key={s}
                 onClick={() => setSelectedSubject(s)}
                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                   selectedSubject === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                 }`}
               >
                 {s === 'Mathematics' ? 'Math' : 'EVS'}
               </button>
            ))}
         </div>
      </div>
      
      <div className="relative flex flex-col items-center gap-12">
        {/* The Connection Line */}
        <div className="absolute top-0 bottom-0 w-3 bg-slate-100 rounded-full left-1/2 -translate-x-1/2 -z-10" />

        {filteredCourses.length > 0 ? filteredCourses.map((course, idx) => {
          const completedCount = overallProgress[course.id] || 0;
          const isUnlocked = idx === 0 || (overallProgress[filteredCourses[idx-1]?.id] || 0) >= 1; 
          const isDone = completedCount >= 1;

          return (
            <motion.div 
               key={course.id}
               initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
               whileInView={{ opacity: 1, x: idx % 2 === 0 ? -40 : 40 }}
               viewport={{ once: true }}
               className="relative"
            >
               <button 
                  onClick={() => isUnlocked && onSelectCourse(course)}
                  className={`path-node ${
                    isDone 
                      ? 'path-node-completed'
                      : isUnlocked 
                        ? 'path-node-unlocked'
                        : 'path-node-locked'
                  }`}
               >
                  {/* Progress Ring */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1">
                    <circle cx="56" cy="56" r="50" className="stroke-slate-100/10 fill-none" strokeWidth="6" />
                    <motion.circle 
                      cx="56" 
                      cy="56" 
                      r="50" 
                      className={`fill-none ${isDone ? 'stroke-emerald-200' : 'stroke-indigo-400'}`}
                      strokeWidth="6" 
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "314", strokeDashoffset: "314" }}
                      animate={{ strokeDashoffset: `${314 - (314 * (completedCount / 5)) / 1}` }} // Estimating 5 modules per unit for now
                      transition={{ duration: 1.5 }}
                    />
                  </svg>

                  {isDone ? <Check className="w-10 h-10" /> : isUnlocked ? <Zap className="w-10 h-10 fill-white" /> : <Lock className="w-10 h-10" />}
                  
                  {/* Tooltip Content Label */}
                  <div className={`absolute top-1/2 -translate-y-1/2 whitespace-nowrap p-4 rounded-2xl bg-white border-2 border-slate-100 shadow-xl pointer-events-none group transition-all z-10 ${
                    idx % 2 === 0 ? 'right-[120%] mr-4' : 'left-[120%] ml-4'
                  }`}>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Chapter {idx + 1}</span>
                     <span className="text-sm font-black text-slate-900 uppercase">{course.title.split(': ')[1]?.split(' (')[0] || course.title}</span>
                     <div className="mt-2 h-1.5 w-24 bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${(completedCount / 5) * 100}%` }} />
                     </div>
                  </div>
               </button>
            </motion.div>
          );
        }) : (
           <div className="flex flex-col items-center justify-center py-32 text-slate-300 gap-6">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-20 animate-pulse" />
                <BookOpen className="w-20 h-20 opacity-20 relative" />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Library Empty</p>
                <p className="text-sm font-bold text-slate-300 mt-2 max-w-xs mx-auto">No courses found for {profile?.syllabus} {profile?.grade} {selectedTerm}.</p>
              </div>
              {profile?.role === 'teacher' ? (
                <button 
                  onClick={onSeed}
                  className="mt-4 px-8 py-4 bg-[#2e5b82] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"
                >
                  Populate Class 1 Curriculum
                </button>
              ) : (
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Teacher to initialize modules</p>
              )}
           </div>
        )}

        {filteredCourses.length > 0 && (
          <div className="w-40 h-40 bg-slate-900 rounded-[40px] flex flex-col items-center justify-center text-white border-b-[12px] border-slate-950 shadow-2xl rotate-3 mt-12">
             <Trophy className="w-16 h-16 text-amber-400 mb-2" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{selectedTerm} Finale</span>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Forum Component ---
const ForumView = ({ courseId }: { courseId: string }) => {
  const { profile } = useAuth();
  const { getForumPosts, createForumPost, getForumReplies, addForumReply } = useEducation();
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newReply, setNewReply] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    return getForumPosts(courseId, setPosts);
  }, [courseId]);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedPost) {
      return getForumReplies(courseId, selectedPost.id, setReplies);
    }
  }, [selectedPost, courseId]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    await createForumPost(courseId, newPostTitle, newPostContent, 'question');
    setNewPostTitle('');
    setNewPostContent('');
    setIsPosting(false);
  };

  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !selectedPost) return;
    await addForumReply(courseId, selectedPost.id, newReply);
    setNewReply('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[500px]">
      <div className="lg:col-span-4 border-r border-slate-100 pr-4 space-y-4">
        <div className="space-y-4 mb-6">
           <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Discussion Threads</h3>
              <button 
                onClick={() => setIsPosting(true)}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
           </div>
           <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search threads..." 
                className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        {isPosting && (
          <form onSubmit={handleCreatePost} className="bg-white p-4 rounded-xl border-2 border-indigo-100 shadow-sm space-y-3 mb-6">
             <input 
               type="text" 
               placeholder="Thread Title" 
               className="w-full text-xs font-bold border-b border-slate-100 pb-2 focus:outline-none focus:border-indigo-500"
               value={newPostTitle}
               onChange={(e) => setNewPostTitle(e.target.value)}
             />
             <textarea 
               placeholder="What's on your mind?" 
               className="w-full text-xs min-h-[80px] focus:outline-none resize-none"
               value={newPostContent}
               onChange={(e) => setNewPostContent(e.target.value)}
             />
             <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsPosting(false)} className="text-[10px] font-black uppercase text-slate-400">Cancel</button>
                <button type="submit" className="bg-slate-900 text-white px-3 py-1 rounded text-[10px] font-black uppercase">Post Thread</button>
             </div>
          </form>
        )}

        <div className="space-y-2">
          {filteredPosts.map(post => (
            <button 
              key={post.id} 
              onClick={() => setSelectedPost(post)}
              className={`w-full text-left p-4 rounded-xl transition-all border ${
                selectedPost?.id === post.id ? 'bg-slate-950 text-white border-slate-950' : 'bg-white border-slate-100 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                 {post.type === 'announcement' ? <Zap className="w-3 h-3 text-amber-500" /> : <Hash className="w-3 h-3 text-indigo-400" />}
                 <span className={`text-[8px] font-black uppercase tracking-widest ${selectedPost?.id === post.id ? 'text-indigo-400' : 'text-slate-400'}`}>{post.type}</span>
              </div>
              <h4 className="text-xs font-black leading-tight mb-2 truncate">{post.title}</h4>
              <p className="text-[10px] opacity-50 truncate">{post.content}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8">
        {selectedPost ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <header className="p-6 bg-slate-50 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-[10px] font-black text-indigo-400">
                        {selectedPost.authorName.substring(0, 1)}
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-900">{selectedPost.authorName}</p>
                         <p className="text-[10px] text-slate-400">Topic Owner</p>
                      </div>
                   </div>
                   <span className="text-[10px] text-slate-400 italic">May 11, 2026</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mb-4 uppercase italic italic underline decoration-indigo-200 underline-offset-4">{selectedPost.title}</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{selectedPost.content}</p>
             </header>

             <div className="p-6 space-y-6 bg-slate-50/30 min-h-[200px]">
                {replies.map(reply => (
                  <div key={reply.id} className="flex gap-4">
                     <div className="w-6 h-6 rounded-full bg-indigo-600 shrink-0 flex items-center justify-center text-[8px] font-black text-white">
                        {reply.authorName.substring(0, 1)}
                     </div>
                     <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                           <span className="text-[10px] font-black uppercase text-indigo-600">{reply.authorName}</span>
                        </div>
                        <p className="text-xs text-slate-600">{reply.content}</p>
                     </div>
                  </div>
                ))}
             </div>

             <footer className="p-6 bg-white border-t border-slate-200">
                <form onSubmit={handleAddReply} className="relative">
                   <input 
                     type="text" 
                     placeholder="Add your perspective..." 
                     className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 pr-12 transition-all"
                     value={newReply}
                     onChange={(e) => setNewReply(e.target.value)}
                   />
                   <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-900 text-white rounded-lg hover:scale-110 transition-transform">
                      <Send className="w-3 h-3 text-indigo-400" />
                   </button>
                </form>
             </footer>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4 opacity-50">
             <MessageCircle className="w-12 h-12" />
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Thread selection required</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Quiz Component ---
const QuizView = ({ courseId, moduleId }: { courseId: string, moduleId: string }) => {
  const { profile } = useAuth();
  const { getQuizzes, submitQuizAttempt, getAttempts } = useEducation();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    return getQuizzes(courseId, moduleId, setQuizzes);
  }, [courseId, moduleId]);

  useEffect(() => {
    if (selectedQuiz && profile) {
      return getAttempts(profile.uid, selectedQuiz.id, setAttempts);
    }
  }, [selectedQuiz, profile]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === null || showResult || !selectedQuiz || !selectedQuiz.timerPerQuestion) return;

    if (timeLeft <= 0) {
       handleNextQuestion();
       return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, showResult, selectedQuiz]);

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      if (selectedQuiz.timerPerQuestion) {
        setTimeLeft(selectedQuiz.timerPerQuestion);
      }
    } else {
      handleSubmit();
    }
  };

  const handleStartQuiz = (quiz: any) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setShowResult(false);
    setCurrentQuestionIndex(0);
    if (quiz.timerPerQuestion) {
      setTimeLeft(quiz.timerPerQuestion);
    } else {
      setTimeLeft(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedQuiz) return;
    setIsSubmitting(true);
    await submitQuizAttempt(courseId, selectedQuiz.id, answers, selectedQuiz.questions);
    setIsSubmitting(false);
    setShowResult(true);
    setTimeLeft(null);
  };

  if (quizzes.length === 0) return <div className="text-center py-20 text-slate-300 font-black uppercase tracking-widest text-xs">No active assessments in this sector</div>;

  if (selectedQuiz && !showResult) {
    const isTimed = !!selectedQuiz.timerPerQuestion;
    const questionsToDisplay = isTimed ? [selectedQuiz.questions[currentQuestionIndex]] : selectedQuiz.questions;

    return (
      <div className="max-w-2xl mx-auto py-8">
        <header className="mb-8 flex items-center justify-between">
           <button onClick={() => setSelectedQuiz(null)} className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 hover:text-rose-500 transition-colors">
              <X className="w-3 h-3" /> Abort Mission
           </button>
           <div className="text-center">
             <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">{selectedQuiz.title}</h2>
             {isTimed && (
               <div className="flex items-center justify-center gap-2 mt-1">
                 <div className={`w-2 h-2 rounded-full animate-pulse ${timeLeft! < 10 ? 'bg-rose-500' : 'bg-indigo-500'}`} />
                 <span className={`text-[10px] font-black uppercase tracking-widest ${timeLeft! < 10 ? 'text-rose-500' : 'text-slate-400'}`}>
                   Time Left: {timeLeft}s
                 </span>
               </div>
             )}
           </div>
           <div className="text-[10px] font-black text-indigo-500">Node: {moduleId}</div>
        </header>

        {isTimed && (
           <div className="w-full h-1 bg-slate-100 rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-indigo-500 transition-all duration-300" 
                style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }} 
              />
           </div>
        )}

        <div className="space-y-8">
          {questionsToDisplay.map((q: any, idx: number) => {
            const actualIdx = isTimed ? currentQuestionIndex : idx;
            return (
              <div key={q.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Question {actualIdx + 1} of {selectedQuiz.questions.length}</span>
                    <span className="bg-indigo-50 text-indigo-600 text-[8px] font-black px-2 py-1 rounded tracking-tighter">{q.points} PTS</span>
                 </div>
                 <p className="text-lg font-black text-slate-900 mb-8 leading-tight">{q.text}</p>
                 
                 <div className="space-y-3">
                   {q.type === 'mcq' && q.options.map((opt: string) => (
                     <button 
                       key={opt}
                       disabled={isTimed ? !!answers[q.id] : false}
                       onClick={() => {
                         setAnswers({...answers, [q.id]: opt});
                         if (isTimed && !answers[q.id]) {
                           // Small delay for feedback before next question
                           setTimeout(() => handleNextQuestion(), 300);
                         }
                       }}
                       className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group ${
                         answers[q.id] === opt ? 'border-indigo-600 bg-indigo-50' : 'border-slate-50 hover:border-slate-200'
                       }`}
                     >
                       <span className={`text-sm font-bold ${answers[q.id] === opt ? 'text-indigo-900' : 'text-slate-600'}`}>{opt}</span>
                       <div className={`w-4 h-4 rounded-full border-2 transition-all ${answers[q.id] === opt ? 'bg-indigo-600 border-indigo-600' : 'border-slate-200 group-hover:border-indigo-300'}`} />
                     </button>
                   ))}
                   
                   {q.type === 'tf' && (
                     <div className="flex gap-4">
                        {['true', 'false'].map(opt => (
                          <button 
                            key={opt}
                            disabled={isTimed ? !!answers[q.id] : false}
                            onClick={() => {
                              setAnswers({...answers, [q.id]: opt});
                              if (isTimed && !answers[q.id]) setTimeout(() => handleNextQuestion(), 300);
                            }}
                            className={`flex-1 py-4 rounded-xl border-2 font-black uppercase text-xs tracking-widest transition-all ${
                              answers[q.id] === opt ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-50 text-slate-400 hover:border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                     </div>
                   )}
  
                   {q.type === 'sa' && (
                     <textarea 
                       placeholder="Type your structured response..."
                       className="w-full min-h-[100px] bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                       onChange={(e) => setAnswers({...answers, [q.id]: e.target.value})}
                     />
                   )}
                 </div>
              </div>
            );
          })}
        </div>

        {!isTimed && (
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full mt-12 bg-slate-950 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Transmitting Data...' : 'Finalize Assessment'}
          </button>
        )}
      </div>
    );
  }

  if (showResult) {
    const lastAttempt = [...attempts].sort((a,b) => (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0))[0];
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
         <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Trophy className="w-12 h-12 text-indigo-600" />
         </div>
         <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic italic mb-4">Grade Decryption Complete</h2>
         <p className="text-slate-500 font-medium mb-8 uppercase text-xs tracking-widest italic">Calculated Score:</p>
         <div className="text-7xl font-black text-indigo-600 tracking-tight mb-8">
            {lastAttempt?.score}<span className="text-2xl text-slate-300">/</span>{lastAttempt?.totalPossible}
         </div>

         {selectedQuiz && (
            <div className="mt-12 text-left space-y-6">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Knowledge Review & Rationales</h3>
               {selectedQuiz.questions.map((q: any) => {
                 const isCorrect = lastAttempt?.answers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
                 return (
                   <div key={q.id} className={`p-6 rounded-2xl border ${isCorrect ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-50/50 border-rose-100'}`}>
                      <div className="flex items-center gap-2 mb-2">
                         {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}
                         <p className="text-xs font-black text-slate-900 uppercase italic leading-tight">{q.text}</p>
                      </div>
                      <div className="ml-6 space-y-2">
                         <p className="text-[10px] text-slate-500 font-bold uppercase">
                           Your Answer: <span className={isCorrect ? 'text-emerald-600' : 'text-rose-600'}>{lastAttempt?.answers[q.id] || 'Skipped'}</span>
                         </p>
                         {!isCorrect && (
                           <p className="text-[10px] text-emerald-600 font-bold uppercase">Correct: {q.correctAnswer}</p>
                         )}
                         {q.rationale && (
                           <div className="mt-4 p-3 bg-white rounded-lg border border-slate-100 italic text-[11px] text-slate-600 leading-relaxed">
                              <span className="font-black text-indigo-500 not-italic uppercase tracking-widest text-[9px] block mb-1">Teacher's Insight:</span>
                              {q.rationale}
                           </div>
                         )}
                      </div>
                   </div>
                 );
               })}
            </div>
         )}

         {!lastAttempt?.graded && (
           <div className="bg-amber-50 text-amber-700 p-4 rounded-xl border border-amber-100 text-xs font-bold uppercase tracking-tighter my-8 italic">
              Contains subjective logic gates. Manual teacher validation pending.
           </div>
         )}
         <button onClick={() => setSelectedQuiz(null)} className="w-full mt-8 border-2 border-slate-900 py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-900 hover:text-white transition-all">
            Return to Assessment Hub
         </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {quizzes.map(quiz => {
        const myAttempt = attempts.find(a => a.quizId === quiz.id);
        return (
          <button 
            key={quiz.id}
            onClick={() => handleStartQuiz(quiz)}
            className={`p-6 rounded-2xl border transition-all text-left bg-white shadow-sm flex flex-col group ${
              myAttempt ? 'border-emerald-500' : 'border-slate-100 hover:border-indigo-300'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
               <div className={`p-2 rounded-lg ${myAttempt ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  <HelpCircle className="w-5 h-5" />
               </div>
               {myAttempt && <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">Passed {myAttempt.score}/{myAttempt.totalPossible}</span>}
            </div>
            <h3 className="font-black text-slate-900 leading-tight mb-2 uppercase italic italic text-sm">{quiz.title}</h3>
            <p className="text-[10px] text-slate-400 font-bold mb-6 flex-1">{quiz.questions.length} LOGIC GATES • {quiz.totalPoints} TOTAL PTS</p>
            <div className="flex justify-end">
               <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        );
      })}
    </div>
  );
};

// --- Auth Entrance (Login/Signup) ---
const AuthEntrance = () => {
  const { signInEmail, signUpEmail, signIn } = useAuth();
  const [view, setView] = useState<'splash' | 'login' | 'signup'>('splash');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [syllabus, setSyllabus] = useState<'CBSE' | 'TN State Board'>('CBSE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (view === 'login') {
        await signInEmail(email, password);
      } else {
        await signUpEmail(email, password, name, role, syllabus);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signIn(role);
    } catch (err: any) {
      setError(err.message || 'Google Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'splash') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center max-w-md w-full"
        >
          <div className="w-32 h-32 bg-slate-800 rounded-[40px] flex items-center justify-center shadow-2xl mb-8 rotate-3">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[32px] flex items-center justify-center rotate-6">
              <Zap className="text-white fill-white w-12 h-12" />
            </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4 uppercase italic">MathBuddy</h1>
          <p className="text-slate-400 font-medium mb-12 text-lg">Your interactive gateway to mathematical mastery.</p>
          
          <div className="grid grid-cols-2 gap-4 w-full mb-8">
             <button 
               onClick={() => { setRole('student'); setView('signup'); }}
               className="group relative bg-[#f8fafc] p-6 rounded-[32px] border-2 border-slate-100 hover:border-indigo-300 transition-all text-left overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 -mr-12 -mt-12 rounded-full" />
                <GraduationCap className="w-8 h-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Join as</p>
                <p className="text-lg font-black text-slate-900 uppercase italic">Student</p>
             </button>
             <button 
               onClick={() => { setRole('teacher'); setView('signup'); }}
               className="group relative bg-[#f8fafc] p-6 rounded-[32px] border-2 border-slate-100 hover:border-emerald-300 transition-all text-left overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -mr-12 -mt-12 rounded-full" />
                <Users className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Join as</p>
                <p className="text-lg font-black text-slate-900 uppercase italic">Teacher</p>
             </button>
          </div>

          <button 
            onClick={() => setView('login')}
            className="w-full text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] py-4 hover:text-indigo-600 transition-colors"
          >
            I already have an account
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[40px] p-10 shadow-2xl shadow-indigo-100/30 border border-slate-100"
      >
        <button 
           onClick={() => setView('splash')}
           className="mb-8 text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
        >
           <ChevronLeft className="w-4 h-4" /> Back
        </button>

        <header className="mb-10">
           <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{view === 'login' ? 'Welcome Back!' : 'Create Account'}</h1>
           <p className="text-slate-400 font-medium">{view === 'login' ? 'Let\'s pick up where you left off.' : 'Start your mathematical adventure today.'}</p>
        </header>

        {view === 'login' && (
          <div className="space-y-4 mb-8">
            <button 
              onClick={() => { setRole('student'); handleGoogleSignIn(); }}
              disabled={loading}
              className="w-full bg-white border-2 border-slate-50 flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
            >
              <div className="flex items-center gap-4">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-black text-slate-600 text-sm">Login as Student</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-500 transition-colors" />
            </button>

            <button 
              onClick={() => { setRole('teacher'); handleGoogleSignIn(); }}
              disabled={loading}
              className="w-full bg-slate-900 border-2 border-slate-900 flex items-center justify-between px-6 py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-sm group"
            >
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-black text-white text-sm">Login as Teacher</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
            </button>
          </div>
        )}

        {view === 'login' && (
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {view === 'signup' && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="Math Explorer"
                className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-100 transition-all font-bold placeholder:text-slate-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="email" 
              placeholder="hello@math.com"
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-100 transition-all font-bold placeholder:text-slate-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-indigo-100 transition-all font-bold placeholder:text-slate-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {view === 'signup' && (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Who are you?</label>
                <div className="grid grid-cols-2 gap-4">
                  {['student', 'teacher'].map(r => (
                    <button 
                      key={r}
                      type="button"
                      onClick={() => setRole(r as any)}
                      className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                        role === r ? 'border-[#2e5b82] bg-indigo-50 text-[#2e5b82]' : 'border-slate-50 bg-slate-50 text-slate-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Learning Stream</label>
                <div className="grid grid-cols-1 gap-3">
                  {['CBSE', 'TN State Board'].map(s => (
                    <button 
                      key={s}
                      type="button"
                      onClick={() => setSyllabus(s as any)}
                      className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-3 ${
                        syllabus === s ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-50 text-slate-400 bg-slate-50'
                      }`}
                    >
                      {s === 'CBSE' ? '📚' : '🏫'} {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {error && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest bg-rose-50 p-4 rounded-xl border border-rose-100">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full duo-button-indigo disabled:opacity-50"
          >
            {loading ? 'Processing...' : (view === 'login' ? 'Login' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center">
           <button 
             onClick={() => setView(view === 'login' ? 'signup' : 'login')}
             className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
           >
             {view === 'login' ? 'Don\'t have an account? Sign Up' : 'Already have an account? Login'}
           </button>
        </div>
      </motion.div>
    </div>
  );
};

// --- Profile Setup Component ---
const ProfileSetupFlow = () => {
  const { profile, updateProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [grade, setGrade] = useState(profile?.grade || 'Class 1');
  const [goal, setGoal] = useState(profile?.learningGoal || '');
  const [dailyGoal, setDailyGoal] = useState<'Casual' | 'Regular' | 'Serious' | 'Insane'>(profile?.dailyGoal || 'Regular');
  const [loading, setLoading] = useState(false);

  const classes = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleFinish = async () => {
    setLoading(true);
    await updateProfile({ 
      grade, 
      learningGoal: goal,
      dailyGoal
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]">
      {/* Progress Bar */}
      <div className="w-full max-w-lg mb-12 flex items-center gap-4">
         <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <motion.div 
               className="h-full bg-[#2e5b82]"
               initial={{ width: 0 }}
               animate={{ width: `${(step / 4) * 100}%` }}
               transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            />
         </div>
         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{step} / 4</span>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl shadow-indigo-100/30 border border-slate-100"
          >
            <h1 className="text-3xl font-black text-slate-900 mb-2">Choose your Level</h1>
            <p className="text-slate-400 font-medium mb-8">What class/grade are you currently studying in?</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10 overflow-y-auto max-h-[300px] p-2 custom-scrollbar">
              {classes.map(c => (
                <button 
                  key={c}
                  onClick={() => setGrade(c)}
                  className={`py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 transition-all ${
                    grade === c ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-100/50' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-100 font-bold font-bold font-bold'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <button 
              onClick={handleNext}
              className="w-full bg-[#2e5b82] text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl shadow-indigo-100/30 border border-slate-100"
          >
            <h1 className="text-3xl font-black text-slate-900 mb-2">Your Syllabus</h1>
            <p className="text-slate-400 font-medium mb-8">Confirm your educational stream to unlock specialized content.</p>
            
            <div className="space-y-4 mb-10">
              {['CBSE', 'TN State Board'].map(s => (
                <button 
                  key={s}
                  onClick={() => updateProfile({ syllabus: s as any })}
                  className={`w-full p-6 rounded-[32px] border-2 transition-all flex items-center gap-6 ${
                    profile?.syllabus === s ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : 'border-slate-50 bg-slate-50'
                  }`}
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-slate-100">
                    {s === 'CBSE' ? '🇮🇳' : '🏛️'}
                  </div>
                  <div className="text-left">
                    <span className={`block font-black text-sm uppercase tracking-widest ${profile?.syllabus === s ? 'text-indigo-700' : 'text-slate-400'}`}>{s}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Mathematics Curriculum</span>
                  </div>
                  {profile?.syllabus === s && <Check className="ml-auto text-indigo-600 w-6 h-6" />}
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={handleBack} className="flex-1 py-5 rounded-3xl font-black text-sm uppercase tracking-widest text-slate-400 border-2 border-slate-50 hover:bg-slate-50 transition-all">Back</button>
              <button 
                onClick={handleNext}
                className="flex-[2] bg-[#2e5b82] text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl shadow-indigo-100/30 border border-slate-100"
          >
            <h1 className="text-3xl font-black text-slate-900 mb-2">Why Math?</h1>
            <p className="text-slate-400 font-medium mb-8">What's your main goal for learning mathematics?</p>
            
            <div className="space-y-3 mb-10">
              {[
                { id: 'exam', label: 'Ace my school exams', icon: '📝' },
                { id: 'foundation', label: 'Build a strong foundation', icon: '🏗️' },
                { id: 'fun', label: 'Just for fun & puzzles', icon: '🧩' },
                { id: 'future', label: 'Prepare for future career', icon: '🚀' },
              ].map(g => (
                <button 
                  key={g.id}
                  onClick={() => setGoal(g.label)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    goal === g.label ? 'border-indigo-600 bg-indigo-50 shadow-lg' : 'border-slate-50 bg-slate-50'
                  }`}
                >
                  <span className="text-2xl">{g.icon}</span>
                  <span className={`text-xs font-black uppercase tracking-widest ${goal === g.label ? 'text-indigo-700' : 'text-slate-400'}`}>{g.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={handleBack} className="flex-1 py-5 rounded-3xl font-black text-sm uppercase tracking-widest text-slate-400 border-2 border-slate-50 hover:bg-slate-50 transition-all">Back</button>
              <button 
                onClick={handleNext}
                disabled={!goal}
                className="flex-[2] bg-[#2e5b82] text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-lg bg-white rounded-[40px] p-10 shadow-2xl shadow-indigo-100/30 border border-slate-100"
          >
            <h1 className="text-3xl font-black text-slate-900 mb-2">Daily Goal</h1>
            <p className="text-slate-400 font-medium mb-8">Commit to a daily learning habit. You can change this later.</p>
            
            <div className="space-y-3 mb-10">
              {[
                { id: 'Casual', desc: '5 mins / day', pts: '10' },
                { id: 'Regular', desc: '10 mins / day', pts: '30' },
                { id: 'Serious', desc: '20 mins / day', pts: '50' },
                { id: 'Insane', desc: '30 mins / day', pts: '100' },
              ].map(g => (
                <button 
                  key={g.id}
                  onClick={() => setDailyGoal(g.id as any)}
                  className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    dailyGoal === g.id ? 'border-amber-400 bg-amber-50 shadow-lg' : 'border-slate-50 bg-slate-50'
                  }`}
                >
                  <div className="text-left">
                    <span className={`block font-black text-sm uppercase tracking-widest ${dailyGoal === g.id ? 'text-amber-700' : 'text-slate-400'}`}>{g.id}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">{g.desc}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full font-black text-[10px] ${dailyGoal === g.id ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-400 italic italic font-bold'}`}>
                    +{g.pts} XP
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button onClick={handleBack} className="flex-1 py-5 rounded-3xl font-black text-sm uppercase tracking-widest text-slate-400 border-2 border-slate-50 hover:bg-slate-50 transition-all">Back</button>
              <button 
                onClick={handleFinish}
                disabled={loading}
                className="flex-[2] bg-emerald-500 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-100 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {loading ? 'Finalizing...' : 'Start Learning!'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
// --- Teacher Review Console ---
const TeacherReview = ({ courseId }: { courseId: string }) => {
  const { getTeacherReviews, gradeAttempt } = useEducation();
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [bonusPoints, setBonusPoints] = useState(0);

  useEffect(() => {
    return getTeacherReviews(courseId, setReviews);
  }, [courseId]);

  const handleGrade = async () => {
    if (!selectedReview) return;
    await gradeAttempt(selectedReview.userId, selectedReview.id, bonusPoints, feedback);
    setSelectedReview(null);
    setFeedback('');
    setBonusPoints(0);
  };

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-300 gap-4">
         <Check className="w-12 h-12 opacity-20" />
         <p className="text-[10px] font-black uppercase tracking-[0.3em]">All logic gates verified</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
       <div className="lg:col-span-4 space-y-2">
          <h3 className="text-[10px] font-black uppercase text-slate-400 mb-4">Pending Verifications</h3>
          {reviews.map(rev => (
            <button 
              key={rev.id} 
              onClick={() => setSelectedReview(rev)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedReview?.id === rev.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
               <p className="text-[10px] font-black uppercase opacity-60 mb-1">Student UID: {rev.userId.substring(0, 8)}</p>
               <p className="text-xs font-bold truncate">Quiz ID: {rev.quizId}</p>
            </button>
          ))}
       </div>

       <div className="lg:col-span-8">
          {selectedReview ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
               <header className="flex justify-between items-center pb-6 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 uppercase">Attempt Review</h2>
                    <p className="text-xs text-slate-400">Current Auto-Score: {selectedReview.score}/{selectedReview.totalPossible}</p>
                  </div>
                  <div className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black">PENDING MANUAL REVIEW</div>
               </header>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-slate-400">Student Responses</h4>
                  {Object.entries(selectedReview.answers).map(([qId, ans]: [string, any]) => (
                    <div key={qId} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                       <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Question {qId}</p>
                       <p className="text-sm text-slate-700">{ans}</p>
                    </div>
                  ))}
               </div>

               <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Subjective Points Awarded</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={bonusPoints}
                      onChange={(e) => setBonusPoints(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Pedagogical Feedback</label>
                    <textarea 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[100px] resize-none"
                      placeholder="Guidance for the student..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleGrade}
                    className="w-full bg-slate-950 text-white py-4 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all"
                  >
                    Commit Verification
                  </button>
               </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50">
               <FileText className="w-12 h-12 mb-4" />
               <p className="text-[10px] font-black uppercase">Awaiting Selection</p>
            </div>
          )}
       </div>
    </div>
  );
};

// --- Course View Component ---
const CourseView = ({ course, onBack }: { course: Course, onBack: () => void }) => {
  const { profile } = useAuth();
  const { getModules, updateProgress, getProgress, sendInteraction, getInteractions } = useEducation();
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'lessons' | 'quizzes' | 'forum' | 'review'>('lessons');
  const [isDownloading, setIsDownloading] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!contentRef.current || !selectedModule) return;
    setIsDownloading(true);
    try {
      const element = contentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${selectedModule.title.replace(/\s+/g, '_')}_Study_Notes.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    const unsubModules = getModules(course.id, setModules);
    const unsubProgress = getProgress(profile!.uid, (p) => {
      const map: Record<string, string> = {};
      p.forEach(item => map[item.moduleId] = item.status);
      setProgress(map);
    });
    const unsubMessages = getInteractions(course.id, setMessages);

    return () => {
      unsubModules();
      unsubProgress();
      unsubMessages();
    };
  }, [course.id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendInteraction(course.id, newMessage);
    setNewMessage('');
  };

  const calculateProgress = () => {
    if (modules.length === 0) return 0;
    const completed = modules.filter(m => progress[m.id] === 'completed').length;
    return Math.round((completed / modules.length) * 100);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden font-sans">
      {/* Course Sidebar */}
      <div className="w-full lg:w-72 border-r border-slate-200 flex flex-col bg-white shrink-0">
        <div className="p-5 border-b border-slate-100">
          <button onClick={onBack} className="text-slate-400 hover:text-indigo-600 mb-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter transition-colors">
            <ChevronRight className="w-3 h-3 rotate-180" /> Back to Dashboard
          </button>
          <div className="mb-4">
             <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest block mb-1">Current Syllabus: {course.syllabusId}</span>
             <h2 className="font-bold text-lg text-slate-900 leading-tight">{course.title}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${calculateProgress()}%` }}
                className="h-full bg-indigo-600"
              />
            </div>
            <span className="text-[10px] font-black text-slate-400">{calculateProgress()}%</span>
          </div>
        </div>
        
        <div className="p-3 border-b border-slate-100 space-y-1">
          {[
            { id: 'lessons', icon: BookOpen, label: 'Curriculum' },
            { id: 'quizzes', icon: HelpCircle, label: 'Assessments' },
            { id: 'forum', icon: MessageCircle, label: 'Discussion' },
            ...(profile?.role === 'teacher' ? [{ id: 'review', icon: FileText, label: 'Verifications' }] : [])
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all ${
                activeTab === tab.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {activeTab === 'lessons' ? (
            modules.map((m, idx) => {
              const isCompleted = progress[m.id] === 'completed';
              const isSelected = selectedModule?.id === m.id;

              return (
                <button 
                  key={m.id}
                  onClick={() => setSelectedModule(m)}
                  className={`w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition-all border ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md translate-x-1' 
                      : isCompleted
                        ? 'bg-emerald-50/50 text-emerald-900 border-emerald-100/50 hover:bg-emerald-50 hover:border-emerald-200'
                        : 'hover:bg-slate-50 border-transparent text-slate-600'
                  }`}
                >
                  <div className="flex-shrink-0 relative">
                    {isCompleted ? (
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-400 text-slate-900' : 'bg-emerald-500 text-white shadow-sm shadow-emerald-200'}`}>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-indigo-400 text-white' : 'border-slate-200 text-slate-300'}`}>
                        <span className="text-[10px] font-black">{idx + 1}</span>
                      </div>
                    )}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className={`text-[8px] font-black uppercase tracking-[0.15em] ${isSelected ? 'text-white/40' : isCompleted ? 'text-emerald-600/40' : 'text-slate-400'}`}>Part {idx + 1}</p>
                      {isCompleted && !isSelected && (
                        <div className="flex items-center gap-1">
                          <span className="text-[7px] font-black uppercase text-emerald-600">Complete</span>
                        </div>
                      )}
                    </div>
                    <p className={`font-bold text-[11px] truncate leading-none tracking-tight ${isSelected ? 'text-white' : isCompleted ? 'text-emerald-900' : 'text-slate-700'}`}>{m.title}</p>
                  </div>
                </button>
              );
            })
          ) : activeTab === 'quizzes' ? (
            <div className="p-1 space-y-2">
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-4">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Interactive Challenge</p>
                <h3 className="text-sm font-black text-slate-900 uppercase">Knowledge Sprinkles</h3>
              </div>
              {modules.map((m, idx) => (
                <button 
                  key={`quiz_${m.id}`}
                  onClick={() => {
                    setSelectedModule(m);
                    setActiveTab('lessons');
                    setTimeout(() => {
                      const el = document.getElementById('quiz-anchor');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="w-full text-left px-4 py-4 rounded-xl flex items-center justify-between transition-all border border-slate-100 hover:bg-slate-50 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                      <Zap className="w-4 h-4 fill-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Quiz {idx + 1}</p>
                      <p className="text-xs font-black text-slate-900 uppercase leading-none">{m.title} Fun</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">System routing active for {activeTab}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50/50">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center px-8 sticky top-0 z-10">
           <span className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">{activeTab === 'lessons' ? (selectedModule?.title || 'Curriculum Overview') : activeTab.toUpperCase()}</span>
        </header>
        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'lessons' ? (
              selectedModule ? (
                <LessonPlayer 
                  key={selectedModule.id} 
                  module={selectedModule} 
                  course={course}
                  progress={progress[selectedModule.id]}
                  onComplete={(status) => updateProgress(course.id, selectedModule.id, status)}
                  onBack={() => setSelectedModule(null)}
                />
              ) : (
                <div className="flex items-center justify-center h-[calc(100vh-140px)] text-slate-300 flex-col gap-6">
                  <div className="w-24 h-24 bg-slate-100 rounded-[32px] flex items-center justify-center animate-bounce">
                    <BookOpen className="w-12 h-12 opacity-20" />
                  </div>
                  <div className="text-center">
                    <p className="font-black uppercase tracking-[0.2em] text-xs text-slate-400">Mission Awaits</p>
                    <p className="text-[10px] font-bold text-slate-300 mt-1 uppercase">Select a module from the sidebar to begin</p>
                  </div>
                </div>
              )
            ) : activeTab === 'quizzes' ? (
              <QuizView courseId={course.id} moduleId={selectedModule?.id || 'general'} />
            ) : activeTab === 'review' ? (
              <TeacherReview courseId={course.id} />
            ) : (
              <ForumView courseId={course.id} />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Side Chat */}
      <div className="w-full lg:w-80 border-l border-slate-200 flex flex-col bg-slate-900 text-white shrink-0">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400">Class Feed</h3>
            <div className="flex items-center gap-1 mt-1">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-bold text-white/50 lowercase italic">Real-time discussion</span>
            </div>
          </div>
          <div className="flex -space-x-1.5">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-5 h-5 rounded-full border-2 border-slate-900 bg-slate-700 shadow-sm" />
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className="flex flex-col">
              <div className={`p-3 rounded-xl text-xs border-l-2 transition-colors ${
                msg.senderId === profile?.uid 
                  ? 'bg-white/5 border-indigo-500' 
                  : msg.role === 'teacher' 
                    ? 'bg-amber-500/10 border-amber-500 text-amber-200'
                    : 'bg-white/5 border-slate-700'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-black text-[9px] uppercase tracking-tighter ${msg.role === 'teacher' ? 'text-amber-500' : 'text-indigo-400'}`}>
                    {msg.senderName} {msg.role === 'teacher' && '• INSTRUCTOR'}
                  </span>
                  <span className="text-[8px] opacity-30">12:44</span>
                </div>
                <p className="leading-relaxed opacity-90">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10">
          <div className="relative">
            <input 
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message..."
              className="w-full bg-slate-800 text-white text-xs pl-4 pr-10 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            />
            <button type="submit" className="absolute right-2 top-2 p-1 text-indigo-500 hover:text-white transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Lesson Player Component (Duolingo Style) ---
const LessonPlayer = ({ module, course, progress, onComplete, onBack }: { 
  module: Module, 
  course: Course, 
  progress?: string,
  onComplete: (status: 'completed' | 'in-progress') => void,
  onBack: () => void 
}) => {
  const [step, setStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Split content by paragraphs or headers for screens
  const parts = module.content.split('\n\n').filter(p => !p.includes('[QUIZ_PLACEHOLDER]'));
  const totalSteps = parts.length + 1; // +1 for the quiz/completion screen

  const handleNext = () => {
    if (step < parts.length - 1) {
      setStep(s => s + 1);
    } else {
      setShowQuiz(true);
    }
  };

  if (showQuiz) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <header className="mb-12 flex items-center justify-between">
           <button onClick={() => setShowQuiz(false)} className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 transition-all">
              Re-read Lesson
           </button>
           <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">{module.title} Challenge</h2>
           <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-sm font-black text-slate-900">+50 XP</span>
           </div>
        </header>

        <div className="bg-white rounded-[40px] border-2 border-slate-100 p-10 shadow-xl shadow-indigo-100/30">
          <QuizView courseId={course.id} moduleId={module.id} />
          
          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-center gap-4">
             <button 
                onClick={() => {
                  onComplete('completed');
                  onBack();
                }}
                className="bg-emerald-600 text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 hover:scale-105 transition-all"
             >
                Finish & Claim Rewards
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {/* Duolingo Progress Bar */}
      <div className="flex items-center gap-6 mb-16">
         <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
         </button>
         <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
               className="h-full bg-emerald-500 rounded-full"
               initial={{ width: 0 }}
               animate={{ width: `${((step + 1) / (parts.length)) * 100}%` }}
               transition={{ type: "spring", bounce: 0, duration: 0.8 }}
            />
         </div>
         <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="text-[10px] font-black text-rose-600">5</span>
         </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -50, scale: 0.95 }}
          className="bg-white rounded-[48px] border-2 border-slate-100 p-12 shadow-2xl shadow-indigo-100/20 min-h-[400px] flex flex-col"
        >
          <div className="flex-1">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-[#2e5b82] rounded-2xl flex items-center justify-center text-white shadow-lg">
                   <Lightbulb className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Step {step + 1} of {parts.length}</h3>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">{module.title}</h2>
                </div>
             </div>
             
             <div className="prose prose-slate max-w-none prose-lg prose-p:font-medium prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tighter">
                <ReactMarkdown>{parts[step]}</ReactMarkdown>
             </div>
          </div>

          {/* Encouraging Mascot (Placeholder icon for now) */}
          <div className="mt-12 flex items-center gap-6 bg-indigo-50/50 p-6 rounded-[32px] border border-indigo-100/50">
             <div className="w-16 h-16 bg-amber-400 rounded-3xl flex items-center justify-center text-3xl shadow-lg -rotate-6">
                🐘
             </div>
             <div>
                <p className="text-sm font-black text-indigo-900 italic italic">"You're doing great! Keep going to unlock more points!"</p>
                <div className="mt-2 flex gap-1">
                   {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-indigo-200 rounded-full" />)}
                </div>
             </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex items-center justify-between">
         <button 
           onClick={() => step > 0 && setStep(s => s - 1)}
           disabled={step === 0}
           className={`px-8 py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all ${
             step === 0 ? 'opacity-0' : 'text-slate-400 hover:text-slate-900'
           }`}
         >
            Previous
         </button>
         <button 
           onClick={handleNext}
           className="bg-[#2e5b82] text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all text-center min-w-[200px]"
         >
            {step === parts.length - 1 ? 'Start Challenge' : 'Continue'}
         </button>
      </div>
    </div>
  );
};

// --- Main App ---
const AppContent = () => {
  const { user, profile, loading, signOutUser, updateProfile } = useAuth();
  const { seedData, courses, getProgress, getBadges } = useEducation();
  const [view, setView] = useState<'dashboard' | 'reports' | 'learning' | 'profile' | 'teacher-console'>('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [overallProgress, setOverallProgress] = useState<Record<string, number>>({});
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (!profile) return;
    const unsubProgress = getProgress(profile.uid, (p) => {
      const pMap: Record<string, number> = {};
      p.forEach(item => {
        if (!pMap[item.courseId]) pMap[item.courseId] = 0;
        if (item.status === 'completed') pMap[item.courseId] += 1;
      });
      setOverallProgress(pMap);
    });
    const unsubBadges = getBadges(profile.uid, setBadges);
    return () => {
      unsubProgress();
      unsubBadges();
    };
  }, [profile]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return (
    <div className="h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center shadow-xl mb-8 rotate-6">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center rotate-6">
            <Zap className="text-white fill-white w-8 h-8" />
          </div>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">MathBuddy</h1>
        <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden mt-4">
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-full w-16 bg-slate-800"
          />
        </div>
      </motion.div>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen bg-white gap-6">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-[#2e5b82] rounded-full animate-spin" />
      <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Syncing Learning Nodes...</p>
    </div>
  );

  if (!user) return (
    <AuthEntrance />
  );

  // Profile setup flow if profile is incomplete (only for students)
  if (profile && profile.role === 'student' && (!profile.grade || !profile.dailyGoal)) {
    return <ProfileSetupFlow />;
  }

  // App logic

  return (
    <div className="h-screen flex bg-[#f8fafc] font-sans selection:bg-indigo-600 selection:text-white overflow-hidden">
      {/* App Sidebar */}
      <aside className="w-24 lg:w-72 bg-white flex flex-col shrink-0 border-r border-slate-100">
        <div className="p-8 pb-12">
          <div className="flex flex-col lg:items-start items-center gap-2">
             <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center shadow-xl shadow-slate-100/50 rotate-3 cursor-pointer group" onClick={() => setView('dashboard')}>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center rotate-6 group-hover:rotate-12 transition-transform">
                <Zap className="text-white fill-white w-6 h-6" />
              </div>
            </div>
            <div className="lg:block hidden mt-4">
              <span className="text-2xl font-black text-indigo-900 tracking-tighter uppercase leading-none block">MathBuddy</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mt-1">Duolingo for Math</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-4">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Learn' },
            { id: 'reports', icon: PieChartIcon, label: 'Stats' },
            { id: 'profile', icon: User, label: 'Profile' },
            ...(profile?.role === 'teacher' ? [{ id: 'teacher-console', icon: GraduationCap, label: 'Teach' }] : []),
          ].map(item => (
            <button 
              key={item.id}
              onClick={() => { setView(item.id as any); setSelectedCourse(null); }}
              className={`w-full flex lg:flex-row flex-col items-center gap-4 px-6 lg:py-6 py-4 rounded-[24px] transition-all group border-2 ${
                view === item.id 
                  ? 'bg-white border-slate-100 text-[#2e5b82] shadow-2xl shadow-indigo-100/50' 
                  : 'text-slate-400 border-transparent hover:text-[#2e5b82] hover:bg-slate-50'
              }`}
            >
              <div className={`p-2 rounded-xl border flex items-center justify-center ${view === item.id ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-50 border-transparent'}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="font-black text-xs uppercase tracking-widest lg:block hidden">{item.label}</span>
              {view === item.id && <div className="ml-auto w-1.5 h-6 bg-[#2e5b82] rounded-full lg:block hidden" />}
            </button>
          ))}
          
          {profile?.role === 'teacher' && (
            <button 
              onClick={() => seedData()}
              className="w-full flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-indigo-600 transition-all font-black text-xs uppercase tracking-widest mt-8"
            >
              <div className="w-full py-2 bg-slate-50 rounded-lg border-2 border-dashed border-slate-100 text-center">
                 + Reset Math Content
              </div>
            </button>
          )}
        </nav>

        <div className="p-8 space-y-8">
          <button className="flex items-center gap-4 text-slate-400 hover:text-indigo-600 transition-all">
            <span className="text-sm font-black uppercase tracking-widest">Help</span>
          </button>
          <button 
            onClick={signOutUser}
            className="flex items-center gap-4 text-slate-900 hover:text-rose-600 transition-all"
          >
            <span className="text-sm font-black uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Universal Top Header - Gamification Bar */}
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-12 shrink-0">
          <div className="flex items-center gap-8">
             <div className="flex items-center gap-2 group cursor-help">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                   <Zap className="w-6 h-6 fill-orange-500" />
                </div>
                <span className="text-xl font-black text-slate-900">1</span>
             </div>
             
             <div className="flex items-center gap-2 group cursor-help">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                   <Heart className="w-6 h-6 fill-rose-500" />
                </div>
                <span className="text-xl font-black text-slate-900">5</span>
             </div>

             <div className="flex items-center gap-2 group cursor-help">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                   <Award className="w-6 h-6 fill-indigo-600" />
                </div>
                <span className="text-xl font-black text-slate-900">{profile?.points || 0}</span>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="bg-slate-100 px-4 py-2 rounded-full hidden md:block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{profile?.syllabus} • {profile?.grade}</span>
             </div>
             <div className="w-12 h-12 rounded-full bg-[#2e5b82] flex items-center justify-center text-white font-black text-sm shadow-xl shadow-indigo-100 border-4 border-white cursor-pointer hover:scale-105 transition-all" onClick={() => setView('profile')}>
                {profile?.name.substring(0, 2).toUpperCase()}
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          <div className="absolute inset-0 overflow-y-auto">
            {view === 'dashboard' && (
               selectedCourse ? (
                 <CourseView course={selectedCourse} onBack={() => setSelectedCourse(null)} />
               ) : (
                 <Dashboard 
                   onSelectCourse={(c) => setSelectedCourse(c)} 
                   overallProgress={overallProgress}
                   badges={badges}
                   onSeed={() => seedData()}
                 />
               )
            )}
            {view === 'learning' && (
              <div className="p-12 space-y-12">
                 <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Learning Hub</h1>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => (
                       <button 
                          key={course.id}
                          onClick={() => { setSelectedCourse(course); setView('dashboard'); }}
                          className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 text-left hover:scale-[1.02] transition-all"
                       >
                          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
                             <BookOpen className="w-8 h-8" />
                          </div>
                          <h3 className="text-2xl font-black text-slate-900 mb-2">{course.title}</h3>
                          <p className="text-slate-400 font-medium">{course.description}</p>
                       </button>
                    ))}
                 </div>
              </div>
            )}
            {view === 'reports' && (
               <div className="p-12 max-w-5xl mx-auto space-y-12 pb-32">
                  <header>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Analytics Terminal</h1>
                    <p className="text-slate-400 font-medium">Tracking your mathematical resonance and learning velocity.</p>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl shadow-indigo-100/20 min-w-0">
                        <div className="flex items-center justify-between mb-10">
                           <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Knowledge Absorption Curve</h3>
                           <div className="flex gap-4">
                              <div className="flex items-center gap-2">
                                 <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                                 <span className="text-[10px] font-black uppercase text-slate-400">XP</span>
                              </div>
                           </div>
                        </div>
                     <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                              <Pie
                                 data={[
                                    { name: 'Completed', value: Object.values(overallProgress).reduce((a, b) => a + b, 0) },
                                    { name: 'Remaining', value: Math.max(0, (courses.length * 5) - Object.values(overallProgress).reduce((a, b) => a + b, 0)) }
                                 ]}
                                 innerRadius={80}
                                 outerRadius={100}
                                 paddingAngle={8}
                                 dataKey="value"
                                 animationDuration={1500}
                              >
                                 <Cell fill="#2e5b82" stroke="#ffffff" strokeWidth={2} />
                                 <Cell fill="#f1f5f9" stroke="#f1f5f9" strokeWidth={2} />
                              </Pie>
                              <Tooltip 
                                 contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              />
                           </PieChart>
                        </ResponsiveContainer>
                     </div>
                     </div>

                     <div className="space-y-8">
                        <div className="bg-slate-900 rounded-[48px] p-8 text-white">
                           <div className="text-indigo-400 mb-2"><Sparkles className="w-8 h-8" /></div>
                           <h4 className="text-xs font-black uppercase tracking-widest opacity-50 mb-4">Learner Profile</h4>
                           <p className="text-2xl font-black italic mb-2 capitalize">{profile?.learningGoal || 'Exploration'}</p>
                           <p className="text-[10px] font-bold text-white/30 uppercase leading-relaxed">System has detected a high affinity for logical puzzles and structural patterns.</p>
                        </div>
                        
                        <div className="bg-white rounded-[40px] p-8 border border-slate-100 flex flex-col items-center text-center">
                           <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-4">
                              <Trophy className="w-10 h-10" />
                           </div>
                           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Rank</h4>
                           <p className="text-3xl font-black text-slate-900 italic">Advanced</p>
                        </div>
                     </div>
                  </div>

                  <div className="bg-indigo-600 rounded-[48px] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative group">
                     <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform">
                        <Brain className="w-64 h-64" />
                     </div>
                     <div className="relative z-10">
                        <h3 className="text-4xl font-black tracking-tight mb-4 uppercase italic">Cognitive Boost</h3>
                        <p className="text-indigo-100 font-medium max-w-sm">Complete 3 more modules today to maintain your 'Genius' streak and unlock exclusive avatars.</p>
                     </div>
                     <button className="bg-white text-indigo-600 px-8 py-5 rounded-3xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-indigo-900/50 hover:scale-105 transition-all whitespace-nowrap">
                        Continue Mission
                     </button>
                  </div>
               </div>
            )}
            {view === 'teacher-console' && profile?.role === 'teacher' && (
              <div className="p-12 max-w-6xl mx-auto space-y-12 pb-32">
                 <header className="flex items-center justify-between">
                   <div>
                     <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Teacher Console</h1>
                     <p className="text-slate-400 font-medium">Overseeing pedagogical flow and student intervention.</p>
                   </div>
                   <div className="bg-rose-50 px-6 py-3 rounded-2xl border border-rose-100 flex items-center gap-3">
                      <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping" />
                      <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Live Monitor Active</span>
                   </div>
                 </header>

                 <TeacherAlertHub />
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <section>
                       <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" /> Pending Submissions for Review
                       </h2>
                       {/* This could map through all courses of this teacher */}
                       {courses.map(course => (
                          <div key={course.id} className="mb-6">
                             <h3 className="text-[10px] font-black uppercase text-indigo-500 mb-4 px-2">{course.title}</h3>
                             <TeacherReview courseId={course.id} />
                          </div>
                       ))}
                    </section>
                    
                    <section>
                       <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" /> Global Performance Matrix
                       </h2>
                       <div className="bg-white rounded-[40px] border border-slate-100 p-8 shadow-xl shadow-slate-100/50">
                          <p className="text-slate-400 font-bold uppercase text-[10px] text-center py-20 italic">Data visualization engine warming up...</p>
                       </div>
                    </section>
                 </div>
              </div>
            )}
            {view === 'profile' && (
              <div className="p-12 max-w-4xl mx-auto">
                <header className="mb-12">
                   <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Profile Hub</h1>
                   <p className="text-slate-400 font-medium">Manage your educational identity and learning preferences.</p>
                </header>
                
                <div className="space-y-10">
                   <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-2xl shadow-indigo-100/30">
                      <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-50">
                         <div className="w-24 h-24 rounded-[32px] bg-[#2e5b82] flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-100">
                            {profile?.name.substring(0, 2).toUpperCase()}
                         </div>
                         <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h2 className="text-3xl font-black text-slate-900">{profile?.name}</h2>
                              <button 
                                onClick={() => updateProfile({ role: profile?.role === 'teacher' ? 'student' : 'teacher' })}
                                className="bg-indigo-50 px-3 py-1 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                              >
                                {profile?.role} (Tap to Switch)
                              </button>
                            </div>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1 italic italic">Student_Node_{profile?.uid.substring(0, 8)}</p>
                         </div>
                      </div>

                      <div className="space-y-10">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade / Class</label>
                               <select 
                                 className="w-full appearance-none bg-slate-50 border-2 border-slate-50 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-100 transition-all font-black text-slate-900 shadow-sm"
                                 value={profile?.grade || ''}
                                 onChange={(e) => updateProfile({ grade: e.target.value })}
                               >
                                 {Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`).map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Daily Commitment</label>
                               <div className="grid grid-cols-2 gap-2">
                                  {['Casual', 'Regular', 'Serious', 'Insane'].map(g => (
                                    <button 
                                      key={g}
                                      onClick={() => updateProfile({ dailyGoal: g as any })}
                                      className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                                        profile?.dailyGoal === g ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm' : 'border-slate-50 bg-slate-50 text-slate-400'
                                      }`}
                                    >
                                      {g}
                                    </button>
                                  ))}
                               </div>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Syllabus Preference</label>
                               <div className="flex gap-2">
                                  {['CBSE', 'TN State Board'].map(s => (
                                    <button 
                                      key={s}
                                      onClick={() => updateProfile({ syllabus: s as any })}
                                      className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                                        profile?.syllabus === s ? 'border-[#2e5b82] bg-[#2e5b82] text-white shadow-lg shadow-indigo-100' : 'border-slate-50 bg-slate-50 text-slate-400'
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                               </div>
                            </div>
                         </div>

                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Learning Goals</label>
                            <textarea 
                              className="w-full bg-slate-50 border-2 border-slate-50 rounded-3xl p-6 text-sm font-medium focus:outline-none focus:border-indigo-100 transition-all min-h-[120px] shadow-sm italic italic"
                              placeholder="What do you want to achieve?"
                              value={profile?.learningGoal || ''}
                              onChange={(e) => updateProfile({ learningGoal: e.target.value })}
                            />
                         </div>

                         <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Favorite Subjects / Interests</label>
                            <div className="flex flex-wrap gap-2">
                               {['Physics', 'Chemistry', 'Biology', 'Electronics', 'Astronomy', 'Mathematics'].map(interest => {
                                 const isSelected = profile?.interests?.includes(interest);
                                 return (
                                   <button 
                                     key={interest}
                                     onClick={() => {
                                       const current = profile?.interests || [];
                                       const next = isSelected ? current.filter(i => i !== interest) : [...current, interest];
                                       updateProfile({ interests: next });
                                     }}
                                     className={`px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                                       isSelected ? 'border-amber-400 bg-amber-50 text-amber-700 shadow-sm shadow-amber-100' : 'border-slate-50 bg-slate-50 text-slate-400'
                                     }`}
                                   >
                                     {interest}
                                   </button>
                                 )
                               })}
                            </div>
                         </div>

                         <div className="pt-8 border-t border-slate-50">
                            <button 
                               onClick={signOutUser}
                               className="w-full py-5 rounded-[24px] bg-rose-50 text-rose-600 font-black text-sm uppercase tracking-widest hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
                            >
                               <LogOut className="w-5 h-5" />
                               Terminate Session
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
