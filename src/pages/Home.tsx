import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { CATEGORIES, REGIONS } from '../constants';
import ProductCard from '../components/ProductCard';
import { Search, ChevronRight, Sprout, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let q = collection(db, 'products');
        // Simple mock fetching for now as we don't have indexes set up for complex queries
        const snapshot = await getDocs(q);
        const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        
        let filtered = fetched;
        if (activeCategory) filtered = filtered.filter(p => p.category === activeCategory);
        if (activeRegion) filtered = filtered.filter(p => p.regionId === activeRegion);
        
        setProducts(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory, activeRegion]);

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
            <span className="inline-block px-4 py-1.5 bg-secondary text-coffee-dark font-bold text-xs uppercase tracking-widest rounded-full mb-6">
              مِراس الأصالة اليمني
            </span>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[1.1] mb-6">
              من يد الحرفي... <br /> إلى باب بيتك.
            </h1>
            <p className="text-xl text-white/80 mb-10 leading-relaxed font-light">
              نحن نوثق القصص خلف كل حبة بن وكل قطرة عسل. اكتشف كنوز اليمن الموثقة والمضمونة من بلد المنشأ.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-white px-10 py-4 rounded-full text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                تسوق الآن
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all">
                بِع منتجاتك
              </button>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-5xl font-serif font-bold text-coffee-dark mb-4">المعرض الرقمي</h2>
            <p className="text-accent text-lg">استكشف الكنوز اليمنية حسب المنطقة أو النوع.</p>
          </div>
          <div className="flex flex-wrap gap-3">
             {CATEGORIES.map(cat => (
               <button 
                 key={cat.id}
                 onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                 className={cn(
                   "px-6 py-2.5 rounded-full text-sm font-bold transition-all border",
                   activeCategory === cat.id 
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                    : "bg-white text-coffee-dark border-primary/10 hover:border-primary/30"
                 )}
               >
                 {cat.nameAr}
               </button>
             ))}
          </div>
        </div>

        {/* Region pills */}
        <div className="flex overflow-x-auto pb-4 scrollbar-hide gap-3">
           {REGIONS.map(region => (
             <button 
               key={region.id}
               onClick={() => setActiveRegion(activeRegion === region.id ? null : region.id)}
               className={cn(
                 "flex-shrink-0 px-5 py-2 rounded-2xl text-sm font-medium transition-all",
                 activeRegion === region.id 
                  ? "bg-secondary text-coffee-dark shadow-md" 
                  : "bg-primary/5 text-primary hover:bg-primary/10"
               )}
             >
               {region.nameAr}
             </button>
           ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card h-96 animate-pulse bg-primary/5" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-primary/5 rounded-[48px] py-24 text-center">
             <div className="max-w-md mx-auto space-y-6">
                <Search size={64} className="mx-auto text-primary/20" />
                <h3 className="text-3xl font-serif font-bold">لا توجد منتجات حالياً</h3>
                <p className="text-accent">نحن نعمل مع المنتجين اليمنيين لإدراج أفضل ما لديهم. يرجى العودة قريباً.</p>
                <button 
                  onClick={() => { setActiveCategory(null); setActiveRegion(null); }}
                  className="bg-primary text-white px-8 py-3 rounded-full font-bold"
                >
                  إعادة ضبط المرشحات
                </button>
             </div>
          </div>
        )}
      </section>

      {/* About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1000" 
                alt="Artisan"
                className="pill-image w-full max-h-[600px] shadow-2xl"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-8 card max-w-xs hidden md:block">
                 <p className="italic text-lg text-primary font-serif mb-4">"كل رشفة عسل تحكي قصة نحلة في وادي دوعن، وكل حبة بن هي ثمرة جهد عائلة في صعدة."</p>
                 <p className="font-bold text-coffee-dark">— الحاج صالح، منتج عسل</p>
              </div>
           </div>
           <div className="space-y-8">
              <h2 className="text-5xl font-serif font-bold leading-tight">أكثر من مجرد متجر، <br /> هي سفارة ثقافية.</h2>
              <div className="space-y-6 text-lg text-accent leading-relaxed">
                <p>
                  "مِن يَدِي" هي منصة وُلدت من رحم المعاناة والأمل. نحن نسعى لكسر العزلة عن المنتجين الصغار في اليمن، ومنحهم النافذة التي يستحقونها للوصول إلى السوق العالمي.
                </p>
                <p>
                  نحن نعتمد على "العلامة الصوتية" - حيث تسمع قصة المنتج بصوت صانعه، وترى تقييم الجودة من قبل مندوبينا الميدانيين الموثوقين.
                </p>
              </div>
              <div className="pt-4">
                <Link to="/auth" className="inline-flex items-center text-primary font-bold text-xl group">
                  انضم إلينا كمنتج أو مشتري
                  <ChevronRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
}
