import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../App';
import { Product } from '../types';
import { CATEGORIES, REGIONS } from '../constants';
import { Plus, Package, Mic, Image as ImageIcon, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice, cn } from '../lib/utils';

export default function ProducerDashboard() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    category: 'honey',
    regionId: 'hadramout',
    price: 0,
    stock: 0,
    imageUrl: '',
    audioStoryUrl: ''
  });

  useEffect(() => {
    async function fetchMyProducts() {
      if (!user) return;
      const q = query(collection(db, 'products'), where('producerId', '==', user.uid));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    }
    fetchMyProducts();
  }, [user]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        ...newProduct,
        producerId: user.uid,
        currency: 'USD',
        qualityStatus: 'pending',
        tags: [],
        createdAt: serverTimestamp()
      });
      setProducts([...products, { id: docRef.id, ...newProduct, producerId: user.uid, currency: 'USD', qualityStatus: 'pending', tags: [], createdAt: new Date().toISOString() } as Product]);
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-5xl font-serif font-bold text-coffee-dark mb-2">مرحباً {user?.name}</h1>
          <p className="text-accent text-lg">أهلاً بك في منصة "مِن يَدِي". أضف فخر إنتاجك للعالم.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-primary/20 flex items-center"
        >
          <Plus size={20} className="mr-2" />
          إضافة منتج جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="card p-8 bg-coffee-dark text-white">
            <h3 className="text-sm font-bold uppercase tracking-widest text-secondary mb-6">ملخص النشاط</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/60">إجمالي المنتجات</span>
                <span className="text-2xl font-bold">{products.length}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/60">بانتظار التدقيق</span>
                <span className="text-2xl font-bold">{products.filter(p => p.qualityStatus === 'pending').length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">إجمالي المبيعات</span>
                <span className="text-2xl font-bold">$0.00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          {products.length > 0 ? (
            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="card p-6 flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={product.imageUrl || 'https://via.placeholder.com/80'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-lg">{product.nameAr}</h4>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full uppercase font-bold",
                        product.qualityStatus === 'pending' ? "bg-gray-100 text-gray-500" : "bg-primary/10 text-primary"
                      )}>
                        {product.qualityStatus === 'pending' ? 'بانتظار الفحص' : product.qualityStatus}
                      </span>
                    </div>
                    <p className="text-sm text-accent line-clamp-1">{product.descriptionAr}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{formatPrice(product.price, product.currency)}</p>
                    <p className="text-xs text-accent">المخزون: {product.stock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-16 text-center border-2 border-dashed border-primary/10">
               <Package className="mx-auto text-primary/10 mb-6" size={64} />
               <h3 className="text-2xl font-serif font-bold mb-4">لا توجد منتجات بعد</h3>
               <p className="text-accent mb-8">ابدأ بإضافة منتجك الأول لتبدأ البيع عالمياً.</p>
               <button onClick={() => setIsAdding(true)} className="text-primary font-bold">إضافة منتج الآن</button>
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setIsAdding(false)}
               className="absolute inset-0 bg-coffee-dark/60 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-12"
             >
                <h2 className="text-3xl font-serif font-bold mb-8">إضافة منتج جديد</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input 
                      type="text" required placeholder="اسم المنتج (بالعربية)" 
                      className="form-input" 
                      value={newProduct.nameAr}
                      onChange={e => setNewProduct({...newProduct, nameAr: e.target.value})}
                    />
                    <input 
                      type="text" required placeholder="Product Name (English)" 
                      className="form-input"
                      value={newProduct.nameEn}
                      onChange={e => setNewProduct({...newProduct, nameEn: e.target.value})}
                    />
                  </div>

                  <textarea 
                    required placeholder="وصف المنتج وحكايته" 
                    className="form-input h-32"
                    value={newProduct.descriptionAr}
                    onChange={e => setNewProduct({...newProduct, descriptionAr: e.target.value})}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <select 
                      className="form-input"
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    >
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
                    </select>
                    <select 
                      className="form-input"
                      value={newProduct.regionId}
                      onChange={e => setNewProduct({...newProduct, regionId: e.target.value})}
                    >
                      {REGIONS.map(r => <option key={r.id} value={r.id}>{r.nameAr}</option>)}
                    </select>
                    <input 
                      type="number" required placeholder="السعر ($)" 
                      className="form-input"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                       <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                       <input 
                         type="url" placeholder="رابط صورة المنتج" 
                         className="form-input pl-12"
                         value={newProduct.imageUrl}
                         onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})}
                       />
                    </div>
                    <div className="relative">
                       <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                       <input 
                         type="url" placeholder="رابط القصة الصوتية (MP3)" 
                         className="form-input pl-12"
                         value={newProduct.audioStoryUrl}
                         onChange={e => setNewProduct({...newProduct, audioStoryUrl: e.target.value})}
                       />
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold">إدراج المنتج</button>
                    <button type="button" onClick={() => setIsAdding(false)} className="px-8 border border-primary/10 rounded-2xl">إلغاء</button>
                  </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
