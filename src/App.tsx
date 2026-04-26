/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { 
  Camera, 
  X, 
  MapPin, 
  MoveUp, 
  Clock as ClockIcon, 
  Mail, 
  Phone as PhoneIcon, 
  FileText, 
  History,
  Scissors,
  Pointer,
  RotateCcw
} from 'lucide-react';

// --- Types & Data ---

interface Memory {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  defaultImg: string;
  accent: string;
  interactionType: 'click' | 'drag' | 'longpress' | 'tear' | 'phone' | 'zoom';
}

const MEMORIES: Memory[] = [
  {
    id: 'bowl',
    title: '陶瓷碗',
    subtitle: '被遗忘的温度',
    content: '这只搪瓷缸被遗忘在时光角落里。蓝边磨乌，瓷面满是磕碰，花园图案已褪成影子。它盛过三代人的三餐，熬过冬夜的姜汤，然后在橱柜里沉睡了十二年。当它被重新捧起时，很多细节已想不起来。但那些被遗忘的日子从未真正消失——它们住进了旧物件里，替我们记得。',
    defaultImg: 'https://images.unsplash.com/photo-1544965850-6f8a66788f9b?auto=format&fit=crop&q=80&w=800',
    accent: '#B94A48',
    interactionType: 'click',
  },
  {
    id: 'box',
    title: '针线盒',
    subtitle: '慈母的手中线',
    content: '老巷木窗台上，摆着一只蓝漆掉光的旧木盒，是陈阿婆的针线盒。以前谁家衣服破了都找她缝补。后来没人再找了。她老了，穿线要试十几回。盒子还在窗台，只是不再打开。她不是忘了怎么缝，只是忘了，还有谁需要她缝补。',
    defaultImg: 'https://images.unsplash.com/photo-1584285418504-0051e626e257?auto=format&fit=crop&q=80&w=800',
    accent: '#B94A48',
    interactionType: 'longpress',
  },
  {
    id: 'clock',
    title: '老座钟',
    subtitle: '停摆之后',
    content: '老屋东墙上的座钟，停了二十多年，指针永远指向三点十七分。没人记得它究竟停在哪一年，只记得祖父走后，它就不走了。日子一长，全家都忘了这回事。可每次回老屋看见那座钟，就觉得祖父还坐在藤椅上，刚要起身去喂鸡。遗忘把他藏在了那个下午，谁也带不走。',
    defaultImg: 'https://images.unsplash.com/photo-1508050919630-b135583b29ab?auto=format&fit=crop&q=80&w=800',
    accent: '#1B2A3E',
    interactionType: 'drag',
  },
  {
    id: 'letter',
    title: '书信',
    subtitle: '寄出的思念',
    content: '一九九九年冬，李云龙代母亲写信给打工的父亲：“家里快没煤了。”信寄出后，他每天去村委会等回音。后来有了BP机、翻盖手机，书信被遗忘在抽屉深处。几十年后翻出来，那些泛黄的字迹、模糊的邮票，每一页都替他记得完整。',
    defaultImg: 'https://images.unsplash.com/photo-1521123845560-14093637aa7d?auto=format&fit=crop&q=80&w=800',
    accent: '#B94A48',
    interactionType: 'tear',
  },
  {
    id: 'phone',
    title: '电话',
    subtitle: '忙音的回响',
    content: '老屋茶几上的绿色座机，曾每周五响起奶奶的叮嘱。她走后，号码注销，听筒只剩忙音。后来全家忘了这部电话。可每当想起奶奶，耳边最先响起的不是她的声音，而是那阵温柔的忙音——它成了记忆里永远占线的回音。',
    defaultImg: 'https://images.unsplash.com/photo-1510103233159-f83693240292?auto=format&fit=crop&q=80&w=800',
    accent: '#1B2A3E',
    interactionType: 'phone',
  },
  {
    id: 'stamp',
    title: '粮票',
    subtitle: '半两之重',
    content: '父亲书桌底层抽屉里，翻出一张伍市斤粮票。六三年去北京出差，他省下粮票换钱给母亲买了条羊毛围巾。这一张特意留下做纪念，后来忘了。六十年过去，那些拮据的日子他已记不清。但粮票还在，替他记着——他曾经那样年轻，那样用力地为家人省下每一口粮食。',
    defaultImg: 'https://images.unsplash.com/photo-1621641040850-89196b052820?auto=format&fit=crop&q=80&w=800',
    accent: '#B94A48',
    interactionType: 'zoom',
  },
];

// --- Components ---

const MemoryCard = ({ memory, onOpen, customImg, onImageUpload }: { 
  memory: Memory; 
  onOpen: () => void;
  customImg: string | null;
  onImageUpload: (id: string, file: File) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div 
      layoutId={`container-${memory.id}`}
      className="group relative bg-vintage-linen overflow-hidden rough-edge shadow-xl hover:-translate-y-1 transition-all duration-500"
    >
      <div 
        onClick={onOpen}
        className="aspect-[4/5] cursor-pointer relative"
      >
        <img 
          src={customImg || memory.defaultImg} 
          alt={memory.title}
          className="w-full h-full object-cover grayscale-[0.6] sepia-[0.2] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-vintage-blue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white text-xs tracking-widest uppercase mb-1 opacity-80 font-sans">
            {memory.subtitle}
          </p>
          <h3 className="text-white text-2xl font-serif">
            {memory.title}
          </h3>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="p-2 bg-vintage-beige/90 rounded-full shadow-md text-vintage-blue hover:bg-white transition-colors"
        >
          <Camera size={16} />
        </button>
        <input 
          ref={fileInputRef}
          type="file" 
          hidden 
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImageUpload(memory.id, file);
          }}
        />
      </div>
    </motion.div>
  );
};

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customImages, setCustomImages] = useState<Record<string, string>>({});
  
  // Specific interaction states
  const [isPhoneOff, setIsPhoneOff] = useState(false);
  const [clockAngle, setClockAngle] = useState(1); // 0 to 1 progress from 3:17
  const [isTorn, setIsTorn] = useState(false);
  const [threadLength, setThreadLength] = useState(100);
  const selectedMemory = MEMORIES.find(m => m.id === selectedId);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('memory-archive-images');
    if (saved) setCustomImages(JSON.parse(saved));
  }, []);

  const handleImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newImages = { ...customImages, [id]: base64String };
      setCustomImages(newImages);
      localStorage.setItem('memory-archive-images', JSON.stringify(newImages));
    };
    reader.readAsDataURL(file);
  };

  const closeOverlay = () => {
    setSelectedId(null);
    setIsPhoneOff(false);
    setIsTorn(false);
    setThreadLength(100);
  };

  return (
    <div className="min-h-screen bg-vintage-blue paper-texture py-12 px-4 md:px-12 selection:bg-vintage-red selection:text-white">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block p-4 border border-vintage-red/20 rough-edge mb-6"
        >
          <span className="text-vintage-red text-xs tracking-[0.4em] uppercase font-sans">
            The Memory Archive
          </span>
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-serif text-vintage-beige tracking-tight mb-4">
          遗忘的物件，替你记得。
        </h1>
        <p className="text-vintage-beige/40 max-w-xl mx-auto italic font-light text-sm tracking-wide">
          "Pieces of personal history, salvaged from the dust of time."
        </p>
      </header>

      {/* Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
        {MEMORIES.map(m => (
          <MemoryCard 
            key={m.id} 
            memory={m} 
            onOpen={() => setSelectedId(m.id)}
            customImg={customImages[m.id]}
            onImageUpload={handleImageUpload}
          />
        ))}
      </div>

      {/* Overlay Layer */}
      <AnimatePresence>
        {selectedId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeOverlay}
              className="absolute inset-0 bg-vintage-blue/95 backdrop-blur-sm"
            />
            
            <motion.div
              layoutId={`container-${selectedId}`}
              className="relative w-full max-w-4xl bg-vintage-beige rough-edge shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              {/* Image / Interaction Side */}
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-vintage-linen overflow-hidden">
                <img 
                  src={customImages[selectedId] || selectedMemory?.defaultImg} 
                  className={`w-full h-full object-cover transition-all duration-1000 ${selectedId === 'stamp' ? 'scale-110' : ''}`}
                />
                
                {/* Specific Overlays Based on ID */}
                <div className="absolute inset-0 flex items-center justify-center">
                  
                  {/* Bowl: Shimmer Points */}
                  {selectedId === 'bowl' && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.8, 0.3] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-4 h-4 bg-vintage-red rounded-full blur-[2px] cursor-pointer"
                    />
                  )}

                  {/* Box: Sewing Thread */}
                  {selectedId === 'box' && (
                    <div className="relative group cursor-pointer flex flex-col items-center">
                      <motion.div 
                        onPointerDown={() => {
                          const iv = setInterval(() => setThreadLength(prev => Math.max(0, prev - 2)), 50);
                          window.addEventListener('pointerup', () => clearInterval(iv), { once: true });
                        }}
                        style={{ strokeDasharray: 100, strokeDashoffset: 100 - threadLength }}
                        className="w-32 h-32 flex items-center justify-center rounded-full border-2 border-dashed border-vintage-red/50"
                      >
                        <Scissors className="text-vintage-red/40" />
                      </motion.div>
                      <p className="mt-4 text-[10px] uppercase tracking-widest text-vintage-red font-sans opacity-0 group-hover:opacity-100 transition-opacity">
                        Hold to unthread
                      </p>
                    </div>
                  )}

                  {/* Clock: Grabbable Hands */}
                  {selectedId === 'clock' && (
                    <div className="w-64 h-64 rounded-full border-4 border-vintage-blue/20 relative flex items-center justify-center">
                      <motion.div 
                        drag="x"
                        dragConstraints={{ left: 0, right: 100 }}
                        onDrag={(e, info) => setClockAngle(1 + info.offset.x / 100)}
                        onDragEnd={() => setClockAngle(1)}
                        className="absolute w-2 h-24 bg-vintage-blue origin-bottom bottom-1/2 cursor-grab active:cursor-grabbing"
                        style={{ rotate: 100 * clockAngle }}
                      />
                      <div className="w-4 h-4 bg-vintage-blue rounded-full z-10" />
                    </div>
                  )}

                  {/* Letter: Tearing Strip */}
                  {selectedId === 'letter' && (
                    <AnimatePresence>
                      {!isTorn ? (
                        <motion.div 
                          exit={{ y: -100, opacity: 0 }}
                          className="w-4/5 h-20 bg-vintage-red shadow-lg flex items-center justify-center cursor-pointer text-vintage-beige font-serif text-lg tracking-widest"
                          onClick={() => setIsTorn(true)}
                        >
                          撕开信封封口
                          <motion.div animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity }} className="ml-2">
                             →
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="absolute p-4 text-vintage-blue italic font-serif">
                           [ 字迹模糊的文件 ]
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Phone: Busy Signal */}
                  {selectedId === 'phone' && (
                    <button 
                      onClick={() => setIsPhoneOff(!isPhoneOff)}
                      className={`p-10 rounded-full border-2 transition-all duration-700 ${isPhoneOff ? 'bg-vintage-blue text-vintage-beige' : 'bg-transparent text-vintage-blue border-vintage-blue/20'}`}
                    >
                      <PhoneIcon size={48} className={isPhoneOff ? 'animate-pulse' : ''} />
                    </button>
                  )}
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                <button 
                  onClick={closeOverlay}
                  className="absolute top-6 right-6 p-2 text-vintage-blue/20 hover:text-vintage-red transition-colors"
                >
                  <X />
                </button>

                <div className="mb-8">
                   <div className="w-8 h-[1px] bg-vintage-red mb-4" />
                   <h2 className="text-vintage-red text-xs tracking-[0.5em] uppercase font-sans mb-2 font-semibold">
                    {selectedMemory?.subtitle}
                   </h2>
                   <h3 className="text-4xl md:text-5xl font-serif text-vintage-blue">
                    {selectedMemory?.title}
                   </h3>
                </div>

                <div className="prose prose-sm font-serif leading-relaxed text-vintage-blue/80 text-lg">
                   {selectedMemory?.content.split('\n').map((para, i) => (
                     <p key={i} className="mb-4 first-letter:text-2xl first-letter:text-vintage-red first-letter:mr-1">
                        {para}
                     </p>
                   ))}
                </div>

                <div className="mt-12 flex items-center gap-4 border-t border-vintage-blue/10 pt-8">
                   <div className="w-12 h-12 flex items-center justify-center rough-edge bg-vintage-red/10 text-vintage-red">
                      <Pointer size={20} />
                   </div>
                   <p className="text-[10px] uppercase tracking-widest text-vintage-blue/40 font-sans">
                      Click object or interact to reveal memory trail.
                   </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Design */}
      <footer className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center pt-24 pb-8 border-t border-vintage-beige/5">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <History className="text-vintage-red w-4 h-4" />
          <span className="text-[10px] uppercase tracking-widest text-vintage-beige/20 font-sans">
            Digitized Heritage Archive // v1.0.4
          </span>
        </div>
        <div className="text-[10px] uppercase tracking-widest text-vintage-beige/20 font-sans italic">
          "The items stay, while we pass through."
        </div>
      </footer>

      {/* Aesthetic Border Elements */}
      <div className="fixed top-8 left-8 bottom-8 w-[1px] bg-vintage-red/10 hidden xl:block" />
      <div className="fixed top-8 right-8 bottom-8 w-[1px] bg-vintage-red/10 hidden xl:block" />
    </div>
  );
}
