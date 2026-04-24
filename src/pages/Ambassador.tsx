import { useState } from 'react';
import { useAuth } from '../App';
import { Link } from 'react-router-dom';
import { Share2, Gift, DollarSign, ArrowRight, Copy, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export default function Ambassador() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const inviteLink = user ? `https://minyadi.com/invite/${user.uid}` : '';

  const copyToClipboard = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-full text-primary mb-2 shadow-sm border border-primary/10">
          <Share2 size={36} />
        </div>
        <h1 className="text-5xl font-serif font-bold text-coffee-dark">سفراء "مِن يَدِي"</h1>
        <p className="text-xl text-accent leading-relaxed">
          كن صوتاً للحرفي والمزارع اليمني. شارك أصالة منتجاتنا مع عائلتك وأصدقائك في المهجر، واحصل على مكافآت حصرية وعمولات نقدية.
        </p>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="card p-8 text-center bg-white/50 relative overflow-hidden group hover:bg-white transition-colors">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 text-xl font-bold">1</div>
          <h3 className="text-2xl font-serif font-bold mb-3">شارك رابطك الخاص</h3>
          <p className="text-accent text-sm">انشر رابطك المميز عبر واتساب أو منصات التواصل.</p>
        </div>
        <div className="card p-8 text-center bg-white/50 relative overflow-hidden group hover:bg-white transition-colors">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6"><Gift size={24} /></div>
          <h3 className="text-2xl font-serif font-bold mb-3">خصم لأصدقائك</h3>
          <p className="text-accent text-sm">أصدقاؤك يحصلون على خصم 10% على أول طلب بفضل رابطك.</p>
        </div>
        <div className="card p-8 text-center bg-white/50 relative overflow-hidden group hover:bg-white transition-colors">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6"><DollarSign size={24} /></div>
          <h3 className="text-2xl font-serif font-bold mb-3">عمولة لك</h3>
          <p className="text-accent text-sm">تحصل على 5% عمولة رصيد في محفظتك عن كل عملية شراء ناجحة.</p>
        </div>
      </div>

      {/* Dashboard or CTA */}
      {user ? (
        <div className="card p-10 bg-primary text-white border-none shadow-xl max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 flex-1 w-full text-center md:text-right">
              <h3 className="text-3xl font-serif font-bold text-secondary">رابطك الخاص جاهز</h3>
              <p className="text-white/80">انسخ الرابط وشاركه الآن لتبدأ بجمع النقاط والعمولات.</p>
              
              <div className="mt-4 flex items-center gap-2 bg-coffee-dark/20 p-2 rounded-xl backdrop-blur-sm border border-white/10">
                <input 
                  type="text" 
                  readOnly 
                  value={inviteLink} 
                  className="bg-transparent text-white flex-1 outline-none font-mono text-sm px-2 text-left w-full"
                  dir="ltr"
                />
                <button 
                  onClick={copyToClipboard}
                  className="bg-secondary text-primary px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-white transition-colors whitespace-nowrap"
                >
                  {copied ? <><CheckCircle size={18} /> تم النسخ</> : <><Copy size={18} /> نسخ الرابط</>}
                </button>
              </div>
            </div>
            <div className="flex gap-6 w-full md:w-auto mt-6 md:mt-0 justify-center">
              <div className="text-center px-6 py-4 bg-white/10 rounded-2xl border border-white/5">
                <p className="text-secondary text-sm font-bold uppercase tracking-widest mb-1">دعوات ناجحة</p>
                <p className="text-4xl font-serif">0</p>
              </div>
              <div className="text-center px-6 py-4 bg-white/10 rounded-2xl border border-white/5">
                <p className="text-secondary text-sm font-bold uppercase tracking-widest mb-1">الرصيد المكتسب</p>
                <p className="text-4xl font-serif">$0</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center max-w-xl mx-auto card p-10">
          <h3 className="text-2xl font-serif font-bold mb-4">سجل الدخول للانضمام للبرنامج</h3>
          <p className="text-accent mb-8">لتتمكن من تتبع دعواتك وعمولاتك، يرجى تسجيل الدخول أو إنشاء حساب.</p>
          <Link to="/auth" className="bg-primary text-white px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:scale-105 transition-transform mx-auto w-fit">
            دخول / تسجيل
            <ArrowRight size={20} />
          </Link>
        </div>
      )}
    </div>
  );
}
