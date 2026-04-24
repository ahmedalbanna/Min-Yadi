import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, CreditCard, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { motion } from 'motion/react';

const MOCK_CART = [
  {
    id: '1',
    productId: 'prod_1',
    nameAr: 'عسل السدر الملكي دوعني',
    nameEn: 'Royal Doani Sidr Honey',
    price: 85,
    currency: 'USD',
    quantity: 1,
    imageUrl: 'https://images.unsplash.com/photo-1587049352847-81a56d773c1c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    productId: 'prod_2',
    nameAr: 'بن يافعي مجفف فاخر',
    nameEn: 'Premium Yafei Coffee',
    price: 45,
    currency: 'USD',
    quantity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=400'
  }
];

export default function Cart() {
  const [items, setItems] = useState(MOCK_CART);
  const [currency, setCurrency] = useState('USD');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');

  const rates: Record<string, number> = { USD: 1, EUR: 0.92, SAR: 3.75, YER: 250 };
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 25; // Base international shipping
  const total = subtotal + shipping;

  const getConvertedPrice = (amountUsd: number) => {
    return formatPrice(amountUsd * rates[currency], currency);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('success');
  };

  if (checkoutStep === 'success') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-12">
           <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
             <ShieldCheck size={48} />
           </div>
           <h2 className="text-4xl font-serif font-bold mb-4">تمت عملية الدفع بنجاح!</h2>
           <p className="text-xl text-accent mb-8">رقم التتبع الخاص بك هو: <strong className="text-coffee-dark font-mono">MY-2026-98X7</strong></p>
           <p className="text-accent mb-8">يمكنك تتبع شحنتك المباشرة من اليمن عبر لوحة التحكم الخاصة بك.</p>
           <Link to="/" className="bg-primary text-secondary px-8 py-4 rounded-full font-bold inline-block hover:scale-105 transition-transform">
             العودة للمعرض
           </Link>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-serif font-bold mb-12 text-coffee-dark">سلة المشتريات</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-6">
          {checkoutStep === 'cart' ? (
            <div className="card p-8 divide-y divide-[#e5e5d8]">
              {items.map(item => (
                <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-center">
                  <img src={item.imageUrl} alt={item.nameAr} className="w-24 h-24 rounded-2xl object-cover" />
                  <div className="flex-1 text-center sm:text-right">
                    <h3 className="text-xl font-serif font-bold text-coffee-dark">{item.nameAr}</h3>
                    <p className="text-accent text-sm mb-2">{item.nameEn}</p>
                    <div className="font-bold text-primary">{getConvertedPrice(item.price)}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-warm-bg rounded-lg p-1 border border-[#d1d1c1]">
                      <button className="px-3 hover:text-primary active:scale-95" onClick={() => {
                        const newItems = [...items];
                        const idx = newItems.findIndex(i => i.id === item.id);
                        if (newItems[idx].quantity > 1) newItems[idx].quantity--;
                        setItems(newItems);
                      }}>-</button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button className="px-3 hover:text-primary active:scale-95" onClick={() => {
                        const newItems = [...items];
                        const idx = newItems.findIndex(i => i.id === item.id);
                        newItems[idx].quantity++;
                        setItems(newItems);
                      }}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-lg transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCheckout} className="card p-8 space-y-8">
               <h2 className="text-2xl font-serif font-bold border-b border-primary/10 pb-4">معلومات الشحن الدولي</h2>
               <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-coffee-dark mb-2">الاسم الكامل</label>
                    <input required type="text" className="form-input" placeholder="اسمك الكريم..." />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-coffee-dark mb-2">رقم الهاتف</label>
                    <input required type="tel" className="form-input" placeholder="+966 5..." dir="ltr" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-coffee-dark mb-2">العنوان التفصيلي</label>
                    <textarea required className="form-input min-h-[100px]" placeholder="الشارع، الحي، المبنى..."></textarea>
                  </div>
               </div>

               <h2 className="text-2xl font-serif font-bold border-b border-primary/10 pb-4 pt-4">بوابة الدفع (دولي)</h2>
               
               <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setPaymentMethod('stripe')}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${paymentMethod === 'stripe' ? 'border-primary bg-primary/5' : 'border-[#d1d1c1] hover:border-primary/50'}`}
                  >
                    <CreditCard className={paymentMethod === 'stripe' ? 'text-primary' : 'text-accent'} />
                    <div>
                      <div className="font-bold">بطاقة ائتمان</div>
                      <div className="text-[10px] text-accent">Stripe Secure</div>
                    </div>
                  </div>
                  <div 
                    onClick={() => setPaymentMethod('paypal')}
                    className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${paymentMethod === 'paypal' ? 'border-primary bg-primary/5' : 'border-[#d1d1c1] hover:border-primary/50'}`}
                  >
                    {/* Simple generic icon for paypal representation */}
                    <div className="w-6 h-6 bg-[#00457C] text-white font-bold rounded flex items-center justify-center font-serif italic mb-1 text-sm">P</div>
                    <div>
                      <div className="font-bold">باي بال</div>
                      <div className="text-[10px] text-accent">PayPal Express</div>
                    </div>
                  </div>
               </div>

               {paymentMethod === 'stripe' && (
                 <div className="space-y-4 bg-warm-bg p-6 rounded-2xl border border-[#d1d1c1]">
                   <div>
                      <label className="block text-xs font-bold text-coffee-dark mb-2 uppercase tracking-widest">رقم البطاقة</label>
                      <input required type="text" className="form-input bg-white" placeholder="0000 0000 0000 0000" dir="ltr" maxLength={19} />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-coffee-dark mb-2 uppercase tracking-widest">تاريخ الانتهاء</label>
                        <input required type="text" className="form-input bg-white" placeholder="MM/YY" dir="ltr" maxLength={5} />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-coffee-dark mb-2 uppercase tracking-widest">CVC</label>
                        <input required type="text" className="form-input bg-white" placeholder="123" dir="ltr" maxLength={4} />
                      </div>
                   </div>
                 </div>
               )}

               {paymentMethod === 'paypal' && (
                 <div className="bg-warm-bg p-6 rounded-2xl border border-[#d1d1c1] text-center">
                    <p className="text-accent mb-4">سيتم إعادة توجيهك إلى صفحة الدفع الآمنة الخاصة بـ PayPal بعد تأكيد الطلب.</p>
                 </div>
               )}

               <button type="submit" className="w-full bg-coffee-dark text-secondary px-8 py-4 rounded-xl font-bold text-lg hover:bg-black transition-colors">
                  تأكيد ودفع {getConvertedPrice(total)}
               </button>
            </form>
          )}
        </div>
        
        <div className="lg:col-span-4">
          <div className="card p-8 sticky top-8">
            <h3 className="text-xl font-serif font-bold mb-6">ملخص الطلب</h3>
            
            <div className="mb-6">
               <label className="block text-xs font-bold text-coffee-dark mb-2 uppercase tracking-widest">عملة العرض</label>
               <select 
                 value={currency} 
                 onChange={(e) => setCurrency(e.target.value)}
                 className="form-input py-2 text-sm font-bold"
                 dir="ltr"
               >
                 <option value="USD">USD ($)</option>
                 <option value="EUR">EUR (€)</option>
                 <option value="SAR">SAR (ر.س)</option>
               </select>
            </div>

            <div className="space-y-4 text-sm font-medium text-coffee-dark mb-6 border-b border-[#e5e5d8] pb-6">
              <div className="flex justify-between">
                <span className="text-accent">المجموع الفرعي:</span>
                <span>{getConvertedPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-accent">الشحن الدولي:</span>
                <span>{getConvertedPrice(shipping)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold">الإجمالي:</span>
              <span className="text-3xl font-serif font-bold text-primary">{getConvertedPrice(total)}</span>
            </div>

            {checkoutStep === 'cart' && (
              <button 
                onClick={() => setCheckoutStep('checkout')}
                className="w-full bg-primary text-secondary px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-center flex justify-center items-center gap-2"
              >
                متابعة الدفع
                <ArrowRight size={20} />
              </button>
            )}
            
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-accent">
              <ShieldCheck size={16} />
              <span>دفع دولي محمي ومشفر بالكامل</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
