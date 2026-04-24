import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Order } from '../types';
import { Package, Truck, CheckCircle, PackageOpen, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/utils';
import { motion } from 'motion/react';

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('buyerId', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        
        let loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        
        // Mock default order if none exists just to show the tracking system
        if (loaded.length === 0) {
           loaded = [{
              id: 'MY-2026-98X7',
              buyerId: user.uid,
              items: [
                { productId: '1', quantity: 2, price: 45, nameEn: 'يافعي مجفف فاخر', imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=400' }
              ],
              totalAmount: 115,
              status: 'shipping',
              shippingAddress: '123 Test St, NY',
              createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
              trackingInfo: {
                carrier: 'DHL Express',
                trackingNumber: '8910111213',
                statusDetails: 'في جمارك الرياض - ترانزيت',
                estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString()
              }
           }];
        } else {
           loaded.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        
        setOrders(loaded);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  if (!user) return <div className="text-center py-24">الرجاء تسجيل الدخول...</div>;
  if (loading) return <div className="text-center py-24">جاري التحميل...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/4 space-y-8">
           <div className="card p-8 text-center bg-secondary/50">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e5e5d8]">
                 <span className="text-3xl font-serif text-primary">{user.name.charAt(0)}</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-coffee-dark mb-1">{user.name}</h2>
              <p className="text-accent text-sm mb-4">{user.email}</p>
              <div className="bg-white px-4 py-2 rounded-full inline-flex items-center gap-2 text-sm font-bold border border-[#e5e5d8]">
                <ShieldCheck size={16} className="text-primary" />
                مشتري موثق
              </div>
           </div>
           
           <div className="card p-4">
              <nav className="space-y-2">
                 <button className="w-full text-right px-4 py-3 bg-primary/5 text-primary font-bold rounded-xl flex items-center gap-3">
                   <Package size={20} /> طلباتي وشحناتي
                 </button>
                 <button className="w-full text-right px-4 py-3 hover:bg-secondary/50 text-coffee-dark font-medium rounded-xl flex items-center gap-3 transition-colors">
                   <Heart size={20} className="text-accent" /> المفضلة
                 </button>
                 <button className="w-full text-right px-4 py-3 hover:bg-secondary/50 text-coffee-dark font-medium rounded-xl flex items-center gap-3 transition-colors">
                   <CreditCard size={20} className="text-accent" /> البطاقات المحفوظة
                 </button>
              </nav>
           </div>
        </div>

        <div className="md:w-3/4">
          <h2 className="text-3xl font-serif font-bold text-coffee-dark mb-8">طلباتي وتتبع الشحنات</h2>
          
          <div className="space-y-8">
            {orders.map(order => (
               <div key={order.id} className="card p-0 overflow-hidden">
                 <div className="bg-secondary/50 p-6 flex flex-wrap gap-6 justify-between items-center border-b border-[#e5e5d8]">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-accent font-bold mb-1">رقم الطلب</p>
                      <p className="font-mono font-bold text-coffee-dark">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-accent font-bold mb-1">الإجمالي</p>
                      <p className="font-bold text-primary">{formatPrice(order.totalAmount, 'USD')}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-accent font-bold mb-1">تاريخ الطلب</p>
                      <p className="font-bold text-coffee-dark">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</p>
                    </div>
                    <div>
                       <span className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm">
                         {order.status === 'shipping' ? 'جاري الشحن الدولي' : order.status}
                       </span>
                    </div>
                 </div>

                 <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div>
                     <h4 className="font-bold text-coffee-dark mb-6">المنتجات</h4>
                     <div className="space-y-4">
                       {order.items.map((item, idx) => (
                         <div key={idx} className="flex gap-4 items-center border border-[#e5e5d8] p-3 rounded-2xl">
                           <img src={item.imageUrl} alt={item.nameEn} className="w-16 h-16 rounded-xl object-cover" />
                           <div>
                             <p className="font-bold text-sm text-coffee-dark">{item.nameEn || 'منتج يمني'}</p>
                             <p className="text-accent text-xs">الكمية: {item.quantity}</p>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Tracking System */}
                   <div className="bg-warm-bg rounded-3xl p-6 border border-[#e5e5d8]">
                     <h4 className="font-bold text-primary mb-6 flex items-center justify-between">
                       مسار الشحنة
                       {order.trackingInfo?.carrier && <span className="text-xs bg-white px-3 py-1 rounded-full border border-[#d1d1c1] text-coffee-dark">{order.trackingInfo.carrier}</span>}
                     </h4>
                     
                     <div className="relative border-r-2 border-primary/20 pr-6 space-y-8 mt-4">
                        <div className="relative">
                          <div className="absolute w-4 h-4 bg-primary rounded-full -right-[31px] top-1 ring-4 ring-white"></div>
                          <p className="font-bold text-sm text-coffee-dark">تم استلام الطلب من الحرفي</p>
                          <p className="text-xs text-accent mt-1">صنعاء، اليمن</p>
                        </div>
                        <div className="relative">
                          <div className="absolute w-4 h-4 bg-primary rounded-full -right-[31px] top-1 ring-4 ring-white animate-pulse"></div>
                          <p className="font-bold text-sm text-primary">{order.trackingInfo?.statusDetails || 'في الطريق لمنافذ التصدير'}</p>
                          {order.trackingInfo?.trackingNumber && (
                             <p className="text-xs font-mono bg-white inline-block px-2 py-1 mt-2 rounded border border-[#d1d1c1]">
                               طرد رقم: {order.trackingInfo.trackingNumber}
                             </p>
                          )}
                        </div>
                        <div className="relative opacity-40">
                          <div className="absolute w-4 h-4 border-2 border-[#d1d1c1] bg-white rounded-full -right-[31px] top-1"></div>
                          <p className="font-bold text-sm text-coffee-dark">التوصيل للباب</p>
                          <p className="text-xs text-accent mt-1">المقدر: {order.trackingInfo?.estimatedDelivery ? new Date(order.trackingInfo.estimatedDelivery).toLocaleDateString('ar-SA') : 'قريباً'}</p>
                        </div>
                     </div>
                     
                     {order.trackingInfo?.url && (
                        <a href={order.trackingInfo.url} target="_blank" rel="noreferrer" className="mt-8 block text-center w-full bg-white border border-[#d1d1c1] text-coffee-dark py-3 rounded-xl font-bold text-sm hover:bg-secondary transition-colors">
                           تتبع عبر شركة الشحن
                        </a>
                     )}
                   </div>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Heart(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={props.size || 24} height={props.size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  );
}
