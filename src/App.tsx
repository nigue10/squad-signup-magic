
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import AdminPortal from './pages/AdminPortal';
import AdminLogin from './pages/AdminLogin';
import RegistrationForm from './pages/RegistrationForm';
import UserGuide from './pages/UserGuide';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { initAnimations } from './utils/animations';
import './App.css';

function App() {
  // Initialize animations when the app loads
  useEffect(() => {
    // Import GSAP and initialize animations
    import('gsap').then(() => {
      initAnimations();
    });
  }, []);

  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/guide" element={<UserGuide />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
