// כל הקוד אוחד לקובץ זה לנוחות ופשטות.
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
    Pause, Play, ChevronLeft, ChevronRight, MessageCircle, 
    Flower2, Bird, TreeDeciduous, ShieldCheck, Sun 
} from 'lucide-react';


// --- 1. TYPE DEFINITIONS (from types.ts) ---
interface SectionProps {
  key?: number;
  sectionIndex: number;
}

interface SectionConfig {
  id: string;
  component: (props: SectionProps) => JSX.Element;
  title: string;
}

interface UIControlsProps {
  currentIndex: number;
  totalSections: number;
  isPaused: boolean;
  progress: number;
  onNext: () => void;
  onPrev: () => void;
  onGoToSection: (index: number) => void;
  onTogglePause: () => void;
}

interface Testimonial {
    quote: string;
    author: string;
    avatar: string;
}

interface Benefit {
    icon: React.ElementType;
    text: string;
}

interface EffectConfig {
  count: number;
  sizeRange: [number, number];
  speedRange: [number, number];
  colors: string[];
  visualStyle: 'rising' | 'falling' | 'wind';
  shape: 'circle' | 'line';
}


// --- 2. COMPONENT DEFINITIONS ---

// Helper Component: AnimatedText
const AnimatedText = ({ text, el = 'p', className, delay = 0, style }: { text: string; el?: keyof React.JSX.IntrinsicElements; className?: string; delay?: number; style?: React.CSSProperties; }) => {
  const words = text.split(' ');
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: i * delay },
    }),
  };
  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
    hidden: { opacity: 0, y: 20, transition: { type: 'spring', damping: 12, stiffness: 100 } },
  };
  const MotionComponent = motion[el];
  return (
    <MotionComponent style={{ display: 'flex', flexWrap: 'wrap', ...style }} variants={container} initial="hidden" animate="visible" className={className}>
      {words.map((word, index) => (
        <motion.span variants={child} style={{ marginRight: '0.25em' }} key={index}>
          {word}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

// Helper Component: SectionWrapper
const sectionVariants: Variants = {
  enter: { opacity: 0, scale: 1.2, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  center: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.6, ease: [0.42, 0, 1, 1] } },
};
const SectionWrapper = ({ children, className, imageUrl, backgroundColor }: { children: React.ReactNode; className?: string; imageUrl: string; backgroundColor: string; }) => {
  return (
    <motion.section variants={sectionVariants} initial="enter" animate="center" exit="exit" className="absolute inset-0 w-full h-full">
      <div className="absolute inset-0 w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }} aria-hidden="true" />
      <div className="absolute inset-0 w-full h-full" style={{ backgroundColor, opacity: 0.5 }} aria-hidden="true" />
      <div className={`relative z-10 w-full h-full flex flex-col items-center justify-center text-center text-white p-4 ${className || ''}`}>
        {children}
      </div>
    </motion.section>
  );
};


// Section Components (must be defined before CONSTANTS)
const HeroSection = ({ sectionIndex }: SectionProps) => (
  <SectionWrapper imageUrl={SECTION_VISUALS[sectionIndex]} backgroundColor={BACKGROUND_COLORS[sectionIndex]}>
    <div className="relative z-10 flex flex-col items-center max-w-4xl">
      <AnimatedText el="h1" text="הזרם המרפא: שחרר את הפוטנציאל שלך" className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.7)' }} />
      <AnimatedText el="h2" text="מסע טרנספורמטיבי לגילוי העוצמה הפנימית שלך." className="text-xl md:text-2xl text-orange-200" delay={0.5} />
    </div>
  </SectionWrapper>
);

const ProblemSection = ({ sectionIndex }: SectionProps) => {
  const problems = ["תחושת תקיעות ולחץ יומיומי?", "חיפוש אחר משמעות ושלווה פנימית?", "רצון עז לממש את הפוטנציאל האמיתי שלך?"];
  const listVariants = { visible: { opacity: 1, transition: { when: "beforeChildren", staggerChildren: 0.5, delayChildren: 0.5 } }, hidden: { opacity: 0 } };
  const itemVariants = { visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }, hidden: { opacity: 0, y: 20 } };
  return (
    <SectionWrapper imageUrl={SECTION_VISUALS[sectionIndex]} backgroundColor={BACKGROUND_COLORS[sectionIndex]}>
      <div className="relative z-10 flex flex-col items-center bg-black/40 backdrop-blur-sm p-8 rounded-2xl max-w-2xl shadow-lg border border-white/10">
        <AnimatedText el="h2" text="מה עוצר בעדך?" className="text-3xl md:text-5xl font-bold mb-8" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }} />
        <motion.ul className="space-y-4 text-lg md:text-xl text-gray-200" variants={listVariants} initial="hidden" animate="visible">
          {problems.map((problem, index) => (<motion.li key={index} variants={itemVariants}>{problem}</motion.li>))}
        </motion.ul>
      </div>
    </SectionWrapper>
  );
};

const SolutionSection = ({ sectionIndex }: SectionProps) => {
  const solutions = ["כלים לשחרור חסמים רגשיים.", "טכניקות להשגת בהירות ושקט פנימי.", "נתיב לחיבור עמוק עם האינטואיציה שלך.", "גילוי ומימוש הפוטנציאל הטמון בך."];
  const listVariants = { visible: { transition: { staggerChildren: 0.7, delayChildren: 1 } }, hidden: {} };
  const itemVariants: Variants = { visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100 } }, hidden: { opacity: 0, x: -50 } };
  return (
    <SectionWrapper imageUrl={SECTION_VISUALS[sectionIndex]} backgroundColor={BACKGROUND_COLORS[sectionIndex]}>
      <div className="max-w-3xl bg-black/20 p-8 rounded-xl backdrop-blur-xs shadow-lg border border-white/10">
        <AnimatedText el="h2" text="השביל אל הריפוי" className="text-3xl md:text-5xl font-bold mb-4" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }} />
        <AnimatedText el="p" text="במסע המשותף שלנו, נגלה יחד:" className="text-xl md:text-2xl mb-8 text-orange-200" delay={0.3} />
        <motion.div className="space-y-3 text-lg md:text-xl text-gray-100 max-w-2xl text-right" variants={listVariants} initial="hidden" animate="visible">
          {solutions.map((solution, index) => (<motion.p key={index} variants={itemVariants}>{solution}</motion.p>))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
};

const BenefitsSection = ({ sectionIndex }: SectionProps) => {
  const containerVariants = { visible: { transition: { staggerChildren: 0.3, delayChildren: 0.5 } }, hidden: {} };
  const itemVariants: Variants = { visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 15, stiffness: 100 } }, hidden: { opacity: 0, scale: 0.5 } };
  return (
    <SectionWrapper imageUrl={SECTION_VISUALS[sectionIndex]} backgroundColor={BACKGROUND_COLORS[sectionIndex]}>
      <AnimatedText el="h2" text="פירות המסע שלך" className="text-3xl md:text-5xl font-bold mb-12 text-white" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }} />
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl" variants={containerVariants} initial="hidden" animate="visible">
        {BENEFITS_DATA.map((benefit, index) => (
          <motion.div key={index} className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20" variants={itemVariants} whileHover={{ scale: 1.05, boxShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)', transition: { duration: 0.2 } }}>
            <benefit.icon className="w-12 h-12 text-orange-300 mb-4" />
            <p className="text-center text-md text-white">{benefit.text}</p>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
};

const InstructorSection = ({ sectionIndex }: SectionProps) => (
  <SectionWrapper imageUrl={SECTION_VISUALS[sectionIndex]} backgroundColor={BACKGROUND_COLORS[sectionIndex]} className="items-center">
    <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 p-8 text-white bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1, transition: { delay: 0.4, duration: 0.8, ease: 'easeOut' } }} className="relative w-48 h-48 md:w-56 md:h-56 flex-shrink-0">
        <img src="https://picsum.photos/id/237/200/200" alt="תמונת המנחה" className="w-full h-full rounded-full object-cover shadow-2xl border-4 border-orange-300" />
      </motion.div>
      <div className="text-center md:text-right">
        <AnimatedText el="h2" text="סימון: המדריכה שלך במסע" className="text-3xl md:text-4xl font-bold mb-4" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }} />
        <div className="space-y-3 text-lg text-gray-200">
          <AnimatedText text="מפתחת שיטת 'הזרם המרפא' הייחודית." delay={0.6} />
          <AnimatedText text="ליוותה אלפים בתהליכי ריפוי וצמיחה אישית." delay={0.8} />
          <AnimatedText text="מעל 15 שנות ניסיון בהנחייה וטיפול." delay={1.0} />
        </div>
      </div>
    </div>
  </SectionWrapper>
);

const TestimonialsSection = ({ sectionIndex }: SectionProps) => {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => { setIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS_DATA.length); }, 2300);
    return () => clearTimeout(timer);
  }, [index]);
  const testimonial = TESTIMONIALS_DATA[index];
  return (
    <SectionWrapper imageUrl={SECTION_VISUALS[sectionIndex]} backgroundColor={BACKGROUND_COLORS[sectionIndex]}>
      <div className="bg-black/40 backdrop-blur-sm p-8 rounded-xl max-w-2xl w-full shadow-lg border border-white/10">
        <AnimatedText el="h2" text="קולות מהדרך" className="text-3xl md:text-5xl font-bold mb-8" style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }} />
        <div className="relative w-full h-48 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }} className="w-full flex flex-col items-center text-center">
              <img src={testimonial.avatar} alt={testimonial.author} className="w-16 h-16 rounded-full mb-4 border-2 border-orange-200" />
              <blockquote className="text-lg italic text-white" style={{ fontFamily: "'Frank Ruhl Libre', serif" }}>"{testimonial.quote}"</blockquote>
              <cite className="mt-4 not-italic font-semibold text-orange-200">- {testimonial.author}</cite>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  );
};

const CtaSection = ({ sectionIndex }: SectionProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); if (name && email) { console.log('Registration:', { name, email }); setSubmitted(true); } };
  return (
    <SectionWrapper imageUrl={SECTION_VISUALS[sectionIndex]} backgroundColor={BACKGROUND_COLORS[sectionIndex]}>
      <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1, transition: { delay: 0.5, duration: 1 } }} className="relative z-10 bg-black/40 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full border border-white/20">
        <AnimatedText el="h2" text="התחנה הסופית: ההרשמה שלך" className="text-3xl md:text-4xl font-bold mb-2 text-white" />
        <AnimatedText el="h3" text="שריין את מקומך בוובינר 'הזרם המרפא'" className="text-lg md:text-xl mb-4 text-orange-200" delay={0.2} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 1 } }} className="text-lg my-4 text-white">
          <p><strong>תאריך:</strong> 25 באוגוסט, 2025 | <strong>שעה:</strong> 20:00</p>
          <p className="text-2xl font-bold text-yellow-300 mt-2">ללא עלות! אך מספר המקומות מוגבל.</p>
        </motion.div>
        {submitted ? (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1}} className="text-2xl font-bold text-green-400 mt-6">תודה על הרשמתך! פרטים נוספים ישלחו למייל.</motion.div>
        ) : (
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 1.5 } }} className="flex flex-col gap-4 mt-6">
            <input type="text" placeholder="שם מלא" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 bg-white/10 text-white placeholder-white/60 rounded-lg border-2 border-transparent focus:border-orange-300 focus:outline-none transition-all" required aria-label="שם מלא" />
            <input type="email" placeholder="כתובת אימייל" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-white/10 text-white placeholder-white/60 rounded-lg border-2 border-transparent focus:border-orange-300 focus:outline-none transition-all" required aria-label="כתובת אימייל" />
            <motion.button whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }} whileTap={{ scale: 0.95 }} type="submit" className="w-full p-4 bg-orange-500 text-white text-xl font-bold rounded-lg hover:bg-orange-600 transition-colors shadow-lg">הבטח את מקומי עכשיו</motion.button>
          </motion.form>
        )}
        <AnimatedText text="אל תחמיצו את ההזדמנות לשינוי עמוק בחייכם!" className="text-md mt-4 text-white/80" delay={2} />
      </motion.div>
    </SectionWrapper>
  );
};


// --- 3. CONSTANTS & DATA ---
const BENEFITS_DATA: Benefit[] = [
    { icon: Flower2, text: "בהירות מנטלית ושלווה עמוקה בחייך." },
    { icon: Bird, text: "שחרור מכאב רגשי, מתח וחרדה." },
    { icon: TreeDeciduous, text: "הגשמה עצמית וחיבור למטרת חייך." },
    { icon: ShieldCheck, text: "כוח פנימי, חוסן נפשי ויכולת התמודדות משופרת." },
    { icon: Sun, text: "חיים מתוך זרימה, קלילות ושמחה אמיתית." }
];
const TESTIMONIALS_DATA: Testimonial[] = [
    { quote: "הוובינר הזה שינה את חיי מקצה לקצה! סוף סוף אני מרגיש חופשי.", author: "דנה כהן", avatar: "https://picsum.photos/100/100?random=1" },
    { quote: "מעולם לא חשבתי שאמצא שלווה כזו. הכלים שקיבלתי פשוט מדהימים.", author: "יוסי לוי", avatar: "https://picsum.photos/100/100?random=2" },
    { quote: "חוויה עוצמתית ומרגשת. ממליצה בחום לכל מי שמחפש שינוי אמיתי.", author: "מיכל שחר", avatar: "https://picsum.photos/100/100?random=3" }
];
const SECTION_VISUALS = [
    'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=1920&auto=format&fit=crop', // Hero
    'https://images.unsplash.com/photo-1484821580136-79059537b944?q=80&w=1920&auto=format&fit=crop', // Problem
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1920&auto=format&fit=crop', // Solution
    'https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=1920&auto=format&fit=crop', // Benefits
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1920&auto=format&fit=crop', // Instructor
    'https://images.unsplash.com/photo-1519672199294-4ba991a13a83?q=80&w=1920&auto=format&fit=crop', // Testimonials
    'https://images.unsplash.com/photo-1511376868136-742c0de4c9bb?q=80&w=1920&auto=format&fit=crop', // CTA
];
const BACKGROUND_COLORS = ['#2c2a4a', '#4f4a6f', '#52796f', '#f4a261', '#582f0e', '#9e97c1', '#e76f51'];
const SECTION_DURATIONS = [6, 6, 7, 8, 7, 7, 10];
const SECTIONS_CONFIG: SectionConfig[] = [
  { id: 'hero', component: HeroSection, title: 'הכניסה לזרם' },
  { id: 'problem', component: ProblemSection, title: 'מה חוסם אותך?' },
  { id: 'solution', component: SolutionSection, title: 'הדרך לריפוי' },
  { id: 'benefits', component: BenefitsSection, title: 'מה תרוויחי?' },
  { id: 'instructor', component: InstructorSection, title: 'המומחית שתוביל אותך' },
  { id: 'testimonials', component: TestimonialsSection, title: 'קולות של שינוי' },
  { id: 'cta', component: CtaSection, title: 'מקומך מחכה לך' },
];

// UI Component: UIControls
const UIControls = ({ currentIndex, totalSections, isPaused, progress, onNext, onPrev, onGoToSection, onTogglePause, }: UIControlsProps) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4">
      <div className="flex items-center gap-3 bg-black/30 backdrop-blur-sm p-2 rounded-full shadow-lg">
        <button onClick={onPrev} className="p-2 text-white hover:text-orange-300 transition-colors rounded-full" aria-label="Previous Section"><ChevronLeft size={20} /></button>
        <button onClick={onTogglePause} className="p-3 text-white bg-black/20 rounded-full hover:text-orange-300 transition-colors" aria-label={isPaused ? "Play" : "Pause"}>{isPaused ? <Play size={24} /> : <Pause size={24} />}</button>
        <button onClick={onNext} className="p-2 text-white hover:text-orange-300 transition-colors rounded-full" aria-label="Next Section"><ChevronRight size={20} /></button>
      </div>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalSections }).map((_, index) => (
          <button key={index} onClick={() => onGoToSection(index)} className="relative w-3 h-3 rounded-full bg-white/30 transition-colors hover:bg-white/70" aria-label={`Go to section ${index + 1}`}>
            {currentIndex === index && (<motion.div className="absolute inset-0 rounded-full bg-orange-400" layoutId="active-dot" initial={false} animate={{ scale: 1.2 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }} />)}
            {currentIndex === index && !isPaused && (
              <div className="absolute top-0 left-0 w-full h-full" style={{transform: `rotate(-90deg)`}}>
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <motion.path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ffffff" strokeWidth="3" strokeDasharray={`${progress}, 100`} />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// UI Component: Footer
const Footer = () => (
  <motion.footer className="fixed bottom-0 right-0 p-3 md:p-5 z-40 text-right text-xs md:text-sm text-white/70" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.5 }}>
    <div className="bg-black/20 backdrop-blur-sm p-3 rounded-lg">
      <p className="font-semibold">צריכים אתר מדהים, לוגו קליט או סרטון מקצועי?</p>
      <p>אתר זה נבנה ועוצב על ידי <strong className="font-bold text-orange-300">סיימונולושן</strong></p>
      <p>לפרטים והצעת מחיר: <strong className="font-bold">055-3151070</strong></p>
      <a href="https://wa.me/972553151070" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-2 bg-green-500 text-white font-bold py-1 px-3 rounded-full hover:bg-green-600 transition-colors">
        <MessageCircle size={16} /><span>שלחו הודעת WhatsApp</span>
      </a>
    </div>
  </motion.footer>
);


// --- 4. MAIN APP COMPONENT ---
const App = () => {
  const [sectionIndex, setSectionIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleNext = useCallback(() => { setSectionIndex((prev) => (prev + 1) % SECTIONS_CONFIG.length); }, []);
  const handlePrev = () => { setSectionIndex((prev) => (prev - 1 + SECTIONS_CONFIG.length) % SECTIONS_CONFIG.length); };
  const handleGoToSection = (index: number) => { setSectionIndex(index); };
  const togglePause = () => { setIsPaused((prev) => !prev); };

  useEffect(() => {
    if (isPaused) return;
    const duration = SECTION_DURATIONS[sectionIndex] * 1000;
    setProgress(0);
    const progressInterval = setInterval(() => { setProgress(p => p + 100 / (duration / 100)); }, 100);
    const timer = setTimeout(() => { handleNext(); }, duration);
    return () => { clearTimeout(timer); clearInterval(progressInterval); };
  }, [sectionIndex, isPaused, handleNext]);

  const CurrentSection = SECTIONS_CONFIG[sectionIndex].component;

  return (
    <div className="relative w-full min-h-screen h-full overflow-hidden bg-black">
      <main className="w-full h-full">
        <AnimatePresence mode="wait">
          <CurrentSection key={sectionIndex} sectionIndex={sectionIndex} />
        </AnimatePresence>
      </main>
      <UIControls currentIndex={sectionIndex} totalSections={SECTIONS_CONFIG.length} isPaused={isPaused} progress={progress} onNext={handleNext} onPrev={handlePrev} onGoToSection={handleGoToSection} onTogglePause={togglePause} />
      <Footer />
    </div>
  );
};


// --- 5. RENDERER ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
