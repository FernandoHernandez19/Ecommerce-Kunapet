import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import SelectRole from './pages/SelectRole';
import Marketplace from './pages/Marketplace';
import ServiceDetailPage from './pages/ServiceDetail';
import ClientDashboard from './pages/ClientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';

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
      </Routes>
    </Router>

  )
}

export default App;
