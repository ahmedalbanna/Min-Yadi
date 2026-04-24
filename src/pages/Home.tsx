import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { CATEGORIES, REGIONS } from '../constants';
import ProductCard from '../components/ProductCard';
import { Search, ChevronRight, Sprout, ShieldCheck, Globe, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [qualityFilter, setQualityFilter] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let q = collection(db, 'products');
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        let filtered = fetched.filter(p => p.qualityStatus !== 'pending'); // only show approved
        
        if (activeCategory) filtered = filtered.filter(p => p.category === activeCategory);
        if (activeRegion) filtered = filtered.filter(p => p.regionId === activeRegion);
        if (qualityFilter) filtered = filtered.filter(p => p.qualityStatus === qualityFilter);
        if (searchQuery) {
          const lowerQ = searchQuery.toLowerCase();
          filtered = filtered.filter(p => 
            p.nameAr.toLowerCase().includes(lowerQ) || 
            p.nameEn.toLowerCase().includes(lowerQ) ||
            p.descriptionAr.toLowerCase().includes(lowerQ)
          );
        }
        filtered = filtered.filter(p => p.price <= maxPrice);
        
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory, activeRegion, searchQuery, qualityFilter, maxPrice]);

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544413155-73130545f441?auto=format&fit=crop&q=80&w=2000" 
            alt="Yemeni Landscapes" 
            className="w-full h-full object-cover brightness-[0.7]"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl text-white"
          >
            <span className="inline-block px-4 py-1.5 bg-secondary text-coffee-dark font-bold text-xs uppercase tracking-widest rounded-full mb-6 relative overflow-hidden group">
               <span className="relative z-10">مِراس الأصالة اليمني</span>
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[1.1] mb-6 drop-shadow-lg">
              من يد الحرفي... <br /> إلى باب بيتك.
            </h1>
            <p className="text-xl text-white/90 mb-10 leading-relaxed font-medium drop-shadow-md">
              نحن نوثق القصص خلف كل حبة بن وكل قطرة عسل. اكتشف كنوز اليمن الموثقة والمضمونة من بلد المنشأ.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-white border border-primary px-10 py-4 rounded-full text-lg font-bold shadow-xl shadow-black/20 hover:scale-105 hover:bg-opacity-90 transition-all">
                تسوق الآن
              </button>
              <Link to="/auth" className="bg-white/10 backdrop-blur-md text-white border border-white/40 px-10 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all shadow-lg">
                بِع منتجاتك
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-secondary/50 p-12 rounded-[48px] border border-primary/10">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto text-primary shadow-sm">
              <Sprout size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold">عضوي ومباشر</h3>
            <p className="text-accent">من الحقل أو المشغل مباشرة دون وسطاء جشعين يقتلون القصة.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto text-primary shadow-sm">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold">جودة موثوقة</h3>
            <p className="text-accent">كل منتج يُفحص من قبل خبراء محليين ويُمنح علامة "مِن يَدِي" للجودة.</p>
          </div>
          <div className="space-y-4">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto text-primary shadow-sm">
              <Globe size={32} />
            </div>
            <h3 className="text-2xl font-serif font-bold">تصدير عالمي</h3>
            <p className="text-accent">نتولى تعقيدات الشحن والجمارك ليصلك طعم الوطن أينما كنت.</p>
          </div>
        </div>
      </section>

      {/* Filters & Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-5xl font-serif font-bold text-coffee-dark mb-4">المعرض الرقمي</h2>
            <p className="text-accent text-lg">استكشف الكنوز اليمنية حسب المنطقة أو النوع.</p>
          </div>
          <div className="relative w-full md:w-96">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-accent" size={20} />
            <input 
              type="text" 
              placeholder="ابحث عن العسل، البن، الأقمشة..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-12 pl-4 py-4 rounded-2xl bg-[#f0f0e8] border border-[#d1d1c1] focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium placeholder-accent/60"
            />
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="bg-white p-6 rounded-[32px] border border-primary/10 flex flex-col lg:flex-row gap-6 justify-between items-center shadow-sm">
           <div className="flex flex-wrap gap-2 w-full lg:w-auto">
             {CATEGORIES.map(cat => (
               <button 
                 key={cat.id}
                 onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                 className={cn(
                   "px-5 py-2 rounded-xl text-sm font-bold transition-all border",
                   activeCategory === cat.id 
                    ? "bg-primary text-secondary border-primary shadow-md shadow-primary/20" 
                    : "bg-warm-bg text-coffee-dark border-[#d1d1c1] hover:border-primary/40 focus:bg-primary/5"
                 )}
               >
                 {cat.nameAr}
               </button>
             ))}
           </div>
           
           <div className="w-full lg:w-auto flex items-center gap-6 border-t lg:border-t-0 lg:border-r border-[#d1d1c1] pt-6 lg:pt-0 lg:pr-6">
             <div className="flex items-center gap-3">
                <SlidersHorizontal size={18} className="text-accent" />
                <span className="text-sm font-bold text-coffee-dark">السعر (أقل من ${maxPrice})</span>
             </div>
             <input 
               type="range" 
               min="10" max="1000" step="10"
               value={maxPrice}
               onChange={(e) => setMaxPrice(Number(e.target.value))}
               className="w-32 accent-primary"
             />
             
             <select 
               value={qualityFilter || ''}
               onChange={(e) => setQualityFilter(e.target.value || null)}
               className="bg-warm-bg border border-[#d1d1c1] rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-primary"
             >
                <option value="">جميع الجودات</option>
                <option value="gold">نخبة ذهبية</option>
                <option value="silver">اعتماد فضي</option>
                <option value="bronze">توثيق برونزي</option>
             </select>
           </div>
        </div>

        {/* Region pills */}
        <div className="flex overflow-x-auto pb-4 scrollbar-hide gap-3">
           {REGIONS.map(region => (
             <button 
               key={region.id}
               onClick={() => setActiveRegion(activeRegion === region.id ? null : region.id)}
               className={cn(
                 "flex-shrink-0 px-6 py-2.5 rounded-xl text-sm font-medium transition-all border",
                 activeRegion === region.id 
                  ? "bg-secondary text-primary border-[#d1d1c1] shadow-sm font-bold" 
                  : "bg-white text-accent border-transparent hover:border-[#d1d1c1]"
               )}
             >
               {region.nameAr}
             </button>
           ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-[32px] h-96 animate-pulse bg-secondary/50 border border-primary/5" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-secondary/30 rounded-[48px] py-32 text-center border border-primary/10">
             <div className="max-w-md mx-auto space-y-6">
                <Search size={48} className="mx-auto text-accent/40" />
                <h3 className="text-3xl font-serif font-bold text-coffee-dark">لا توجد منتجات تطابق بحثك</h3>
                <p className="text-accent">الرجاء تغيير المرشحات أو كلمات البحث والمحاولة مرة أخرى.</p>
                <button 
                  onClick={() => { setActiveCategory(null); setActiveRegion(null); setSearchQuery(''); setQualityFilter(null); setMaxPrice(1000); }}
                  className="bg-primary text-secondary px-8 py-3 rounded-full font-bold inline-block hover:scale-105 transition-transform"
                >
                  إعادة ضبط المرشحات
                </button>
             </div>
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white p-8 md:p-16 rounded-[48px] border border-[#e5e5d8] shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000" 
                alt="Artisan"
                className="w-full max-h-[500px] object-cover rounded-[32px]"
              />
              <div className="absolute -bottom-8 -right-8 bg-warm-bg p-8 rounded-[32px] border border-[#e5e5d8] max-w-xs hidden md:block shadow-sm">
                 <p className="text-sm text-accent mb-2 uppercase tracking-widest font-bold">بصوت الحرفي</p>
                 <p className="italic text-lg text-primary font-serif mb-4 leading-relaxed">"كل رشفة عسل تحكي قصة نحلة في وادي دوعن..."</p>
                 <p className="font-bold text-coffee-dark text-sm">— الحاج محمد الدوعني</p>
              </div>
           </div>
           <div className="space-y-8">
              <h2 className="text-5xl font-serif font-bold leading-tight text-coffee-dark">أكثر من مجرد متجر، <br /> سفارة ثقافية.</h2>
              <div className="space-y-6 text-lg text-accent leading-relaxed">
                <p>
                  "مِن يَدِي" هي منصة وُلدت من رحم المعاناة والأمل. نحن نسعى لكسر العزلة عن المنتجين الصغار في اليمن، ومنحهم النافذة التي يستحقونها للوصول إلى السوق العالمي.
                </p>
                <p>
                  يتم توثيق المنتجات بصوت الأصالة، ونقوم بالتحقق من الجودة والشحن الآمن لضمان وصول تجربة لا تُنسى إلى باب بيتك.
                </p>
              </div>
              <div className="pt-4">
                <Link to="/auth" className="inline-flex items-center text-primary font-bold text-xl group hover:text-coffee-dark transition-colors">
                  انضم إلينا في هذه الرحلة
                  <ChevronRight className="mr-2 transform group-hover:-translate-x-1 transition-transform rotate-180" />
                </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
