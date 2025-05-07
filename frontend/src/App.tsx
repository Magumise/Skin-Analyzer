import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import Home from './pages/Home';
import SkinAnalysis from './pages/SkinAnalysis';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import Recommendations from './pages/Recommendations';
import Auth from './pages/Auth';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import DermatologistBooking from './pages/DermatologistBooking';
import ProtectedRoute from './components/ProtectedRoute';
import DirectAITest from './components/DirectAITest';
import AIModelTest from './components/AIModelTest';
import ConsultSpecialists from './pages/ConsultSpecialists';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';

// ScrollToTop component to handle scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <ChakraProvider>
      <Box className="app-container min-h-screen bg-white">
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/analysis" element={
              <ProtectedRoute>
                <SkinAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/results" element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            } />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/dermatologist-booking" element={<DermatologistBooking />} />
            <Route path="/ai-test" element={<DirectAITest />} />
            <Route path="/test-ai-model" element={<AIModelTest />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/consult-specialists" element={<ConsultSpecialists />} />
          </Routes>
        </Router>
      </Box>
    </ChakraProvider>
  );
}

export default App; 