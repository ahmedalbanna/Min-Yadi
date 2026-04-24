import { Link, Outlet, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../App';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Navbar() {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-warm-bg/80 backdrop-blur-md border-b border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-3xl font-serif font-bold text-primary tracking-tight">مِن يَدِي</span>
              <span className="hidden sm:block text-xs uppercase tracking-[0.2em] text-accent/60 mt-1 font-medium">Min Yadi</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-accent hover:text-primary transition-colors font-medium text-sm lg:text-base uppercase tracking-wider">المعرض</Link>
            <Link to="/#about" className="text-accent hover:text-primary transition-colors font-medium text-sm lg:text-base uppercase tracking-wider">قصتنا</Link>
            {user?.role === 'producer' && (
              <Link to="/producer" className="bg-primary/5 text-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary/10 transition-colors">لوحة المنتج</Link>
            )}
            {user?.role === 'agent' && (
              <Link to="/agent" className="bg-secondary text-primary px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-secondary/80 transition-colors">التدقيق</Link>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative p-2 text-primary hover:scale-110 transition-transform">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-2 text-primary">
                  <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-primary/10">
                    {user.photoUrl ? <img src={user.photoUrl} alt="" className="w-full h-full object-cover" /> : <User size={18} className="text-primary" />}
                  </div>
                </Link>
                <button onClick={handleLogout} className="p-2 text-accent hover:text-red-600 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="bg-primary text-white px-8 py-2.5 rounded-full text-sm font-bold shadow-sm hover:shadow-lg hover:scale-105 transition-all">
                دخول / تسجيل
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="p-2 text-coffee-dark">
              <ShoppingCart size={22} />
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-coffee-dark">
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-warm-bg border-b border-primary/10 pb-6 px-4"
          >
            <div className="flex flex-col space-y-4 pt-4">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">المعرض</Link>
              <Link to="/#about" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">قصتنا</Link>
              {user?.role === 'producer' && (
                <Link to="/producer" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-primary">لوحة المنتج</Link>
              )}
              {user ? (
                 <>
                   <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium">الملف الشخصي</Link>
                   <button onClick={handleLogout} className="text-left text-lg font-medium text-red-600">تسجيل الخروج</button>
                 </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="bg-primary text-white px-6 py-3 rounded-full text-center font-medium">دخول / تسجيل</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-coffee-dark text-white/80 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-serif text-white mb-6">مِن يَدِي</h3>
            <p className="max-w-md text-lg leading-relaxed mb-8">
              نحن نؤمن أن خلف كل منتج يمني عظيم قصة إنسان يستحق أن يُسمع صوته. 
              منحنا للمنتج اليمني كرامته وللمشتري العالمي جودة يثق بها.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons Placeholder */}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">أقسامنا</h4>
            <ul className="space-y-3">
              <li><Link to="/?cat=honey" className="hover:text-secondary transition-colors">عسل وادي دوعن</Link></li>
              <li><Link to="/?cat=coffee" className="hover:text-secondary transition-colors">بن خولاني وكهولاني</Link></li>
              <li><Link to="/?cat=crafts" className="hover:text-secondary transition-colors">حرف يدوية</Link></li>
              <li><Link to="/?cat=textiles" className="hover:text-secondary transition-colors">منسوجات تراثية</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">الدعم والمجتمع</h4>
            <ul className="space-y-3">
              <li><Link to="/ambassador" className="hover:text-secondary transition-colors text-secondary font-bold">برنامج السفراء والمكافآت</Link></li>
              <li><Link to="/faq" className="hover:text-secondary transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link to="/shipping" className="hover:text-secondary transition-colors">معلومات الشحن</Link></li>
              <li><Link to="/terms" className="hover:text-secondary transition-colors">الشروط والأحكام</Link></li>
              <li><Link to="/contact" className="hover:text-secondary transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-sm">
          <p>© {new Date().getFullYear()} مِن يَدِي. جميع الحقوق محفوظة ليد الحرفي اليمني.</p>
        </div>
      </div>
    </footer>
  );
}
