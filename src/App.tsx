import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { User } from './types';

// Pages
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import ProducerDashboard from './pages/ProducerDashboard';
import AgentDashboard from './pages/AgentDashboard';
import Cart from './pages/Cart';
import AuthPage from './pages/AuthPage';
import Layout from './components/Layout';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        } else {
          // This might happen if user is created but doc not yet synced or created through social login
          // We can handle profile creation in AuthPage
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-warm-bg">
        <div className="animate-pulse text-primary font-serif text-3xl">مِن يَدِي...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected Routes */}
            <Route 
              path="/producer/*" 
              element={user?.role === 'producer' ? <ProducerDashboard /> : <Navigate to="/auth" />} 
            />
            <Route 
              path="/agent/*" 
              element={user?.role === 'agent' ? <AgentDashboard /> : <Navigate to="/auth" />} 
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
