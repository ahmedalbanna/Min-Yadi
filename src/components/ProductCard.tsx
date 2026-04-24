import { Link } from 'react-router-dom';
import { BadgeCheck, Play, MapPin } from 'lucide-react';
import { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { REGIONS } from '../constants';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const region = REGIONS.find(r => r.id === product.regionId);
  
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
      className="card group overflow-hidden"
    >
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden">
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
          {product.audioStoryUrl && (
            <div className="absolute bottom-4 left-4 bg-primary text-white p-2.5 rounded-full shadow-lg">
              <Play size={16} fill="white" />
            </div>
          )}
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center text-accent/60 text-xs mb-2 uppercase tracking-widest font-semibold">
          <MapPin size={12} className="mr-1" />
          {region?.nameAr || product.regionId}
        </div>
        <h3 className="text-xl font-serif font-bold text-coffee-dark mb-1 line-clamp-1">
          {product.nameAr}
        </h3>
        <p className="text-sm text-accent mb-4 line-clamp-2 leading-relaxed h-10">
          {product.descriptionAr}
        </p>
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
