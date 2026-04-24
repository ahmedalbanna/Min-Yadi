import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../App';
import { Product, QualityStatus } from '../types';
import { CheckCircle, XCircle, Mic, Star } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AgentDashboard() {
  const { user } = useAuth();
  const [pendingProducts, setPendingProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPending() {
      const q = query(collection(db, 'products'), where('qualityStatus', '==', 'pending'));
      const snap = await getDocs(q);
      setPendingProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
      setLoading(false);
    }
    fetchPending();
  }, []);

  const handleVerify = async (productId: string, status: QualityStatus) => {
    try {
      await updateDoc(doc(db, 'products', productId), { qualityStatus: status });
      setPendingProducts(pendingProducts.filter(p => p.id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-serif font-bold text-coffee-dark mb-2">لوحة التدقيق</h1>
        <p className="text-accent text-lg">أنت حارس الجودة لـ "مِن يَدِي". تأكد من أن كل منتج يستحق علامته.</p>
      </div>

      {loading ? (
        <div className="text-center py-24">جاري التحميل...</div>
      ) : pendingProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {pendingProducts.map(product => (
            <div key={product.id} className="card p-8 flex flex-col md:flex-row gap-8 items-center">
              <img src={product.imageUrl} alt="" className="w-48 h-48 rounded-[32px] object-cover" />
              <div className="flex-grow space-y-4">
                <div>
                   <h3 className="text-3xl font-serif font-bold">{product.nameAr}</h3>
                   <p className="text-accent">{product.descriptionAr}</p>
                </div>
                <div className="flex gap-4">
                   {product.audioStoryUrl && (
                     <div className="flex items-center gap-2 text-primary bg-primary/5 px-4 py-2 rounded-full text-sm font-bold">
                        <Mic size={16} /> استمع للقصة
                     </div>
                   )}
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                 <button 
                   onClick={() => handleVerify(product.id, 'gold')}
                   className="flex items-center justify-center gap-2 bg-yellow-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-yellow-700"
                 >
                   <Star size={18} fill="white" /> منح العلامة الذهبية
                 </button>
                 <button 
                   onClick={() => handleVerify(product.id, 'silver')}
                   className="flex items-center justify-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-600"
                 >
                   <CheckCircle size={18} /> اعتماد كـ فضي
                 </button>
                 <button 
                   onClick={() => handleVerify(product.id, 'pending')} // Re-pending or reject logic
                   className="flex items-center justify-center gap-2 border border-red-200 text-red-500 px-6 py-3 rounded-2xl font-bold hover:bg-red-50"
                 >
                   <XCircle size={18} /> رفض المنتج
                 </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-24 text-center border-2 border-dashed border-primary/10">
           <p className="text-2xl font-serif text-accent">لا توجد منتجات بانتظار التدقيق حالياً.</p>
        </div>
      )}
    </div>
  );
}
