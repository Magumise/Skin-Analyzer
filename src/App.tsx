import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box } from '@chakra-ui/react';
import Home from './pages/Home';
import SkinAnalysis from './pages/SkinAnalysis';
import Questionnaire from './pages/Questionnaire';
import Results from './pages/Results';
import Recommendations from './pages/Recommendations';
import Auth from './pages/Auth';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ChakraProvider>
      <Box className="app-container min-h-screen bg-white">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route path="/analysis" element={<SkinAnalysis />} />
            <Route path="/results" element={<Results />} />
            <Route path="/recommendations" element={<Recommendations />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </Box>
    </ChakraProvider>
  );
}

export default App; 