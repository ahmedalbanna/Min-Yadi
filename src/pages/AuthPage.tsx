import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserRole } from '../types';
import { LogIn, UserPlus, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<UserRole>('buyer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name: result.user.displayName || 'Unnamed User',
          email: result.user.email,
          role: 'buyer', // Default for social login
          createdAt: new Date().toISOString(),
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEmailAuth = async (e: any) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name,
          email,
          role,
          createdAt: new Date().toISOString(),
        });
        navigate(role === 'producer' ? '/producer' : '/');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[48px] shadow-sm border border-primary/5">
        <div className="text-center">
          <h2 className="text-4xl font-serif font-bold text-coffee-dark mb-2">
            {isLogin ? 'مرحباً بك مجدداً' : 'انضم لعائلة "مِن يَدِي"'}
          </h2>
          <p className="text-accent">
            {isLogin ? 'سجل دخولك لمتابعة طلباتك أو منتجاتك' : 'اختر نوع الحساب لبدء رحلتك معنا'}
          </p>
        </div>

        {!isLogin && (
          <div className="flex p-1 bg-primary/5 rounded-2xl">
            <button 
              onClick={() => setRole('buyer')}
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
                role === 'buyer' ? "bg-white text-primary shadow-sm" : "text-accent"
              )}
            >
              مشتري
            </button>
            <button 
              onClick={() => setRole('producer')}
              className={cn(
                "flex-1 py-2 rounded-xl text-sm font-bold transition-all",
                role === 'producer' ? "bg-white text-primary shadow-sm" : "text-accent"
              )}
            >
              منتج يمني
            </button>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailAuth}>
          <div className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                required
                placeholder="الاسم الكامل"
                className="w-full px-6 py-4 rounded-2xl bg-warm-bg border-none focus:ring-2 focus:ring-primary/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <input
              type="email"
              required
              placeholder="البريد الإلكتروني"
              className="w-full px-6 py-4 rounded-2xl bg-warm-bg border-none focus:ring-2 focus:ring-primary/20"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              placeholder="كلمة المرور"
              className="w-full px-6 py-4 rounded-2xl bg-warm-bg border-none focus:ring-2 focus:ring-primary/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center"
          >
            {isLogin ? <LogIn className="mr-2" size={20} /> : <UserPlus className="mr-2" size={20} />}
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-primary/10"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-accent">أو عبر</span></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          className="w-full border border-primary/10 py-4 rounded-2xl flex items-center justify-center font-bold hover:bg-warm-bg transition-colors"
        >
          <Globe className="mr-2 text-blue-600" size={20} />
          Google متابعة باستخدام
        </button>

        <p className="text-center text-sm text-accent">
          {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </button>
        </p>
      </div>
    </div>
  );
}
