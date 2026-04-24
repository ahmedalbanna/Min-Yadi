import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { formatPrice } from '../lib/utils';

export default function Cart() {
  // Simple empty state for now as cart logic requires context/state management
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="max-w-md mx-auto space-y-8">
        <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary">
          <ShoppingBag size={48} />
        </div>
        <h1 className="text-4xl font-serif font-bold">سلتك خالية حالياً</h1>
        <p className="text-accent text-lg">اكتشف أجود المنتجات اليمنية وأضفها لسلتك لتبدأ رحلة الأصالة.</p>
        <Link 
          to="/" 
          className="inline-flex items-center bg-primary text-white px-10 py-4 rounded-full font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
        >
          اذهب للمعرض
          <ArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
}
