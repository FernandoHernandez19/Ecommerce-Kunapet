import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SelectRole from './pages/SelectRole';
import Marketplace from './pages/Marketplace';
import ServiceDetailPage from './pages/ServiceDetail';
import ClientDashboard from './pages/ClientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import AdminDashboard from './pages/AdminDashboard';
import HelpCenter from './pages/HelpCenter';
import ClaimsQueuePage from './pages/ClaimsQueuePage';
import ClaimDetailsPage from './pages/ClaimDetailsPage';
import CheckoutPage from './pages/CheckoutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/service/:id" element={<ServiceDetailPage />} />
        <Route path="/clientdashboard" element={<ClientDashboard />} />
        <Route path="/providerdashboard" element={<ProviderDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />}/>
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/claims-queue" element={<ClaimsQueuePage />} />
        <Route path="/claims/:id" element={<ClaimDetailsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

      </Routes>
    </Router>

  )
}

export default App;
