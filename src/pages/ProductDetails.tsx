import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, getDocs, serverTimestamp, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, Review } from '../types';
import { REGIONS } from '../constants';
import { BadgeCheck, MapPin, Play, Pause, ShoppingBag, ArrowRight, Heart, Star } from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '../App';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // Review Form
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, 'products', id));
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `products/${id}`);
      }
      
      // Fetch Reviews
      try {
        const qR = query(collection(db, 'reviews'), where('productId', '==', id));
        const rSnap = await getDocs(qR);
        setReviews(rSnap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'reviews');
      }
      
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    async function checkWishlist() {
      if (!user || !id) return;
      try {
        const q = query(collection(db, 'wishlists'), where('userId', '==', user.uid), where('productId', '==', id));
        const docs = await getDocs(q);
        if (!docs.empty) {
          setIsWishlisted(true);
          setWishlistId(docs.docs[0].id);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, 'wishlists');
      }
    }
    checkWishlist();
  }, [user, id]);

  const toggleWishlist = async () => {
    if (!user || !id) return alert('سجل الدخول للمتابعة');
    setLoadingAction(true);
    const path = 'wishlists';
    try {
      if (isWishlisted && wishlistId) {
        await deleteDoc(doc(db, path, wishlistId));
        setIsWishlisted(false);
        setWishlistId(null);
      } else {
        const docRef = await addDoc(collection(db, path), {
          userId: user.uid,
          productId: id,
          createdAt: serverTimestamp()
        });
        setIsWishlisted(true);
        setWishlistId(docRef.id);
      }
    } catch (e) {
      handleFirestoreError(e, isWishlisted ? OperationType.DELETE : OperationType.CREATE, path);
    }
    setLoadingAction(false);
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) return alert('سجل الدخول لإضافة تقييم');
    setLoadingAction(true);
    const path = 'reviews';
    try {
      const docRef = await addDoc(collection(db, path), {
        userId: user.uid,
        productId: id,
        rating,
        comment,
        createdAt: serverTimestamp()
      });
      setReviews([{ id: docRef.id, userId: user.uid, productId: id, rating, comment, createdAt: new Date().toISOString() }, ...reviews]);
      setComment('');
      setRating(5);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, path);
    }
    setLoadingAction(false);
  };

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
  if (!product) return <div className="min-h-screen flex items-center justify-center text-xl font-serif">المنتج غير موجود</div>;

  const region = REGIONS.find(r => r.id === product.regionId);
  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0';

  return (
    <div className="pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Link to="/" className="inline-flex items-center text-accent hover:text-primary mb-8 group transition-colors">
          <ArrowRight className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
          العودة للمعرض
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-24">
          {/* Image & Audio Section */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[48px] overflow-hidden shadow-2xl bg-secondary"
            >
              {product.imageUrl && <img src={product.imageUrl} alt={product.nameEn} className="w-full h-full object-cover" />}
              <div className="absolute top-8 right-8 bg-secondary text-primary px-4 py-2 rounded-full flex items-center space-x-2 shadow-sm border border-primary/10">
                <BadgeCheck size={20} className="ml-1" />
                <span className="font-bold text-sm tracking-wider uppercase">{product.qualityStatus === 'gold' ? 'منتج ذهبي' : product.qualityStatus}</span>
              </div>
              <button 
                onClick={toggleWishlist}
                disabled={loadingAction}
                className="absolute top-8 left-8 bg-white/90 backdrop-blur p-4 rounded-full shadow-lg hover:scale-110 transition-transform text-primary/40 hover:text-red-500"
              >
                <Heart size={24} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
              </button>
            </motion.div>

            {/* Audio Story Player */}
            {product.audioStoryUrl && (
              <div className="card p-8 bg-white border border-[#e5e5d8] rounded-[32px] flex items-center space-x-8">
                <button 
                  onClick={toggleAudio}
                  className="w-16 h-16 bg-coffee-dark text-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause size={28} fill="white" /> : <Play size={28} fill="white" className="ml-1" />}
                </button>
                <div>
                  <h4 className="text-2xl font-serif font-bold text-coffee-dark mb-1">اسمع حكاية المنتج</h4>
                  <p className="text-accent text-sm">بصوت صانعه الأصلي</p>
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
              <div className="flex items-center text-primary font-bold uppercase tracking-widest text-xs">
                <MapPin size={16} className="mr-2" />
                {region?.nameAr} • {product.category}
              </div>
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-coffee-dark leading-tight">
                {product.nameAr}
              </h1>
              <div className="flex items-center gap-4">
                <p className="text-4xl font-serif font-bold text-primary">
                  {formatPrice(product.price, product.currency)}
                </p>
                {reviews.length > 0 && (
                  <div className="flex items-center gap-1 bg-secondary px-3 py-1.5 rounded-xl border border-primary/10">
                    <Star size={16} className="fill-yellow-500 text-yellow-500" />
                    <span className="font-bold text-sm pt-1">{avgRating} <span className="text-[10px] text-accent">({reviews.length})</span></span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-serif font-bold border-b border-[#e5e5d8] pb-4 inline-block">القصة</h3>
              <p className="text-lg text-accent leading-relaxed">
                {product.descriptionAr}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card p-6 bg-secondary/30">
                <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-2">المنطقة</span>
                <span className="font-serif font-bold text-xl text-coffee-dark">{region?.nameAr} - اليمن</span>
              </div>
              <div className="card p-6 bg-secondary/30">
                <span className="text-[10px] uppercase tracking-widest text-accent font-bold block mb-2">المخزون المتوفر</span>
                <span className="font-serif font-bold text-xl text-coffee-dark" dir="ltr">{product.stock} وحدة</span>
              </div>
            </div>

            <button className="w-full bg-primary text-secondary py-5 rounded-full text-xl font-bold flex items-center justify-center gap-3 shadow-lg hover:bg-coffee-dark transition-all hover:scale-105 active:scale-95">
              <ShoppingBag size={24} />
              <span>أضف للسلة</span>
            </button>

            <div className="card p-6 bg-white/50 flex items-start gap-4">
              <div className="mt-1 text-primary"><ShieldCheck size={28} /></div>
              <div>
                <h5 className="font-serif font-bold text-lg mb-1">ضمان "مِن يَدِي" للتصدير</h5>
                <p className="text-sm text-accent leading-relaxed">يتم فحص هذا المنتج وتغليفه بمعايير عالمية للمنتجات العضوية والتراثية قبل شحنه دولياً.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-3xl mx-auto border-t border-[#e5e5d8] pt-16">
          <h2 className="text-4xl font-serif font-bold text-coffee-dark mb-12 text-center">آراء مجتمعنا</h2>
          
          {user ? (
            <form onSubmit={submitReview} className="card p-8 bg-secondary/20 mb-12">
              <h3 className="font-serif font-bold text-xl mb-6">أضف تقييمك الخاص</h3>
              <div className="mb-6 flex gap-2">
                {[1,2,3,4,5].map(star => (
                   <button 
                     key={star} 
                     type="button" 
                     onClick={() => setRating(star)}
                     className="hover:scale-110 transition-transform"
                   >
                     <Star size={32} className={star <= rating ? "fill-yellow-500 text-yellow-500" : "text-[#d1d1c1]"} />
                   </button>
                ))}
              </div>
              <textarea 
                required
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="كيف كانت تجربتك مع هذا المنتج؟"
                className="form-input min-h-[120px] mb-6"
              />
              <button disabled={loadingAction} type="submit" className="bg-coffee-dark text-white px-8 py-3 rounded-xl font-bold">
                نشر التقييم
              </button>
            </form>
          ) : (
            <div className="card p-8 text-center bg-white border border-[#e5e5d8] mb-12">
              <p className="text-accent mb-4">سجل الدخول لتتمكن من مشاركة تجربتك وتقييم المنتج.</p>
              <Link to="/auth" className="bg-primary text-secondary px-6 py-2 rounded-full font-bold inline-block">تسجيل الدخول</Link>
            </div>
          )}

          <div className="space-y-6">
             {reviews.length === 0 ? (
               <p className="text-center text-accent py-8">لا توجد تقييمات حتى الآن. كن أول من يقيّم هذا المنتج!</p>
             ) : (
               reviews.map((rev, idx) => (
                 <div key={rev.id || idx} className="card p-6 bg-white/50">
                    <div className="flex gap-1 mb-3">
                      {[1,2,3,4,5].map(star => (
                         <Star key={star} size={16} className={star <= rev.rating ? "fill-yellow-500 text-yellow-500" : "text-[#d1d1c1]"} />
                      ))}
                    </div>
                    <p className="text-coffee-dark leading-relaxed font-medium">{rev.comment}</p>
                 </div>
               ))
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck({ size }: { size: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
