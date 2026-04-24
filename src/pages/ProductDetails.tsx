import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { REGIONS } from '../constants';
import { BadgeCheck, MapPin, Play, Pause, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      const docSnap = await getDoc(doc(db, 'products', id));
      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">تحميل القصة...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">المنتج غير موجود</div>;

  const region = REGIONS.find(r => r.id === product.regionId);

  return (
    <div className="pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Link to="/" className="inline-flex items-center text-accent hover:text-primary mb-8 group transition-colors">
          <ArrowRight className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          العودة للمعرض
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Image & Audio Section */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[48px] overflow-hidden shadow-2xl"
            >
              <img src={product.imageUrl} alt={product.nameEn} className="w-full h-full object-cover" />
              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center space-x-2">
                <BadgeCheck className="text-secondary" />
                <span className="font-bold text-coffee-dark">جودة {product.qualityStatus === 'gold' ? 'نخبة' : 'موثقة'}</span>
              </div>
            </motion.div>

            {/* Audio Story Player */}
            {product.audioStoryUrl && (
              <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 flex items-center space-x-8">
                <button 
                  onClick={toggleAudio}
                  className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
                </button>
                <div>
                  <h4 className="text-2xl font-serif font-bold text-coffee-dark mb-1">اسمع حكاية المنتج</h4>
                  <p className="text-accent underline">بصوت صانعه الأصلي</p>
                </div>
                <audio 
                  ref={audioRef} 
                  src={product.audioStoryUrl} 
                  onEnded={() => setIsPlaying(false)}
                  className="hidden" 
                />
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center text-secondary font-bold uppercase tracking-[0.2em] text-sm">
                <MapPin size={16} className="mr-2" />
                {region?.nameAr} • {product.category}
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-coffee-dark leading-tight">
                {product.nameAr}
              </h1>
              <p className="text-3xl font-bold text-primary">
                {formatPrice(product.price, product.currency)}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-serif font-bold border-b border-primary/10 pb-4 inline-block">القصة</h3>
              <p className="text-xl text-accent leading-relaxed">
                {product.descriptionAr}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-primary/5">
                <span className="text-xs uppercase tracking-wider text-accent block mb-1">المنطقة</span>
                <span className="font-bold text-lg">{region?.nameAr} - اليمن</span>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-primary/5">
                <span className="text-xs uppercase tracking-wider text-accent block mb-1">المخزون المتوفر</span>
                <span className="font-bold text-lg">{product.stock} وحدة</span>
              </div>
            </div>

            <button className="w-full bg-primary text-white py-5 rounded-full text-xl font-bold flex items-center justify-center space-x-3 shadow-xl hover:bg-coffee-dark transition-all">
              <ShoppingBag size={24} />
              <span>أضف للسلة</span>
            </button>

            <div className="bg-primary/5 rounded-3xl p-6 flex items-start space-x-4">
              <div className="mt-1 text-primary"><ShieldCheck size={24} /></div>
              <div>
                <h5 className="font-bold mb-1">ضمان "مِن يَدِي" للتصدير</h5>
                <p className="text-sm text-accent">يتم فحص هذا المنتج وتغليفه بمعايير عالمية قبل شحنه دولياً.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
