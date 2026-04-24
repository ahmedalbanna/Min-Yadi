import { Link } from 'react-router-dom';
import { BadgeCheck, Play, MapPin, Heart } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { REGIONS } from '../constants';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-utils';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const region = REGIONS.find(r => r.id === product.regionId);
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistId, setWishlistId] = useState<string | null>(null);
  const [loadingHeart, setLoadingHeart] = useState(false);

  useEffect(() => {
    async function checkWishlist() {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'wishlists'), 
          where('userId', '==', user.uid),
          where('productId', '==', product.id)
        );
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
  }, [user, product.id]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert('الرجاء تسجيل الدخول لإضافة المنتجات للمفضلة');
      return;
    }
    setLoadingHeart(true);
    const path = 'wishlists';
    try {
      if (isWishlisted && wishlistId) {
        await deleteDoc(doc(db, path, wishlistId));
        setIsWishlisted(false);
        setWishlistId(null);
      } else {
        const docRef = await addDoc(collection(db, path), {
          userId: user.uid,
          productId: product.id,
          createdAt: serverTimestamp()
        });
        setIsWishlisted(true);
        setWishlistId(docRef.id);
      }
    } catch (err) {
      handleFirestoreError(err, isWishlisted ? OperationType.DELETE : OperationType.CREATE, path);
    } finally {
      setLoadingHeart(false);
    }
  };
  
  const statusColors = {
    pending: 'text-gray-400',
    bronze: 'text-orange-600',
    silver: 'text-gray-500',
    gold: 'text-yellow-600'
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="card group overflow-hidden flex flex-col relative"
    >
      <Link to={`/product/${product.id}`} className="block flex-grow relative aspect-[4/5] overflow-hidden">
        <img 
          src={product.imageUrl || 'https://images.unsplash.com/photo-1544413155-73130545f441?auto=format&fit=crop&q=80&w=800'} 
          alt={product.nameEn}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-secondary text-primary px-3 py-1 rounded flex items-center space-x-1.5 shadow-sm">
          <BadgeCheck className={cn(statusColors[product.qualityStatus], "w-3.5 h-3.5")} />
          <span className="text-[9px] font-bold uppercase tracking-tighter">
            {product.qualityStatus === 'gold' ? 'منتج ذهبي' : product.qualityStatus}
          </span>
        </div>
        
        <button 
          onClick={toggleWishlist}
          disabled={loadingHeart}
          className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-sm hover:scale-110 transition-transform text-primary/40 hover:text-red-500"
        >
          <Heart size={18} className={isWishlisted ? 'fill-red-500 text-red-500' : ''} />
        </button>

        {product.audioStoryUrl && (
          <div className="absolute bottom-4 left-4 bg-primary text-white p-2.5 rounded-full shadow-lg">
            <Play size={16} fill="white" />
          </div>
        )}
      </Link>

      <div className="p-6">
        <div className="flex items-center text-accent/60 text-xs mb-2 uppercase tracking-widest font-semibold">
          <MapPin size={12} className="mr-1" />
          {region?.nameAr || product.regionId}
        </div>
        <h3 className="text-xl font-serif font-bold text-coffee-dark mb-1 line-clamp-1">
          {product.nameAr}
        </h3>
        <p className="text-sm text-accent mb-2.5 line-clamp-2 leading-relaxed h-10">
          {product.descriptionAr}
        </p>
        <div className="text-xs text-primary/70 font-semibold mb-3">
          المخزون: {product.stock > 0 ? product.stock : 'نفدت الكمية'}
        </div>
        <div className="flex items-baseline justify-between pt-4 border-t border-primary/5">
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price, product.currency)}
          </span>
          <Link 
            to={`/product/${product.id}`}
            className="text-primary font-bold text-sm border-b-2 border-primary/20 hover:border-primary transition-all pb-0.5"
          >
            اكتشف القصة
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
