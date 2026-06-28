import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute, { PublicOnlyRoute } from './components/ProtectedRoute';
import { ROLES } from './store/useAuthStore';

// ─── Páginas Públicas ──────────────────────────────────────────────────────────
import Home             from './pages/Home';
import Login            from './pages/Login';
import SelectRole       from './pages/SelectRole';
import Marketplace      from './pages/Marketplace';
import ServiceDetailPage from './pages/ServiceDetail';
import HelpCenter       from './pages/HelpCenter';

// ─── Área Cliente ──────────────────────────────────────────────────────────────
import ClientDashboard      from './pages/ClientDashboard';
import PetDashboardPage     from './pages/PetDashboardPage';
import AddPetWizard         from './pages/AddPetWizard';
import StepBehaviorPage     from './pages/StepBehaviorPage';
import RegisterPage         from './pages/RegistrationSuccessPage';
import CheckoutPage         from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';

// ─── Área Proveedor ────────────────────────────────────────────────────────────
import ProviderDashboard      from './pages/ProviderDashboard';
import ProviderRegistrationPage from './pages/ProviderRegistration';
import StepVerificationPage   from './pages/StepVerificationPage';
import ProviderSuccessPage    from './pages/ProviderSuccessPage';
import ServiceManagementPage  from './pages/ServiceManagementPage';

// ─── Área Administrador ────────────────────────────────────────────────────────
import AdminDashboard    from './pages/AdminDashboard';
import ClaimsQueuePage   from './pages/ClaimsQueuePage';
import ClaimDetailsPage  from './pages/ClaimDetailsPage';

// ─── Páginas de Error ──────────────────────────────────────────────────────────
import NotFoundPage      from './pages/NotFoundPage';
import UnauthorizedPage  from './pages/UnauthorizedPage';

function App() {
  return (
    <Router>
      <Routes>

        {/* ══════════════════════════════════════════════════════════════════════
            RUTAS PÚBLICAS — Accesibles sin autenticación
            PublicOnlyRoute: si ya está logueado, redirige al dashboard del rol
        ══════════════════════════════════════════════════════════════════════ */}
        <Route path="/" element={<Home />} />
        <Route path="/marketplace"  element={<Marketplace />} />
        <Route path="/service/:id"  element={<ServiceDetailPage />} />
        <Route path="/help-center"  element={<HelpCenter />} />

        {/* Login y registro — bloqueados para usuarios ya autenticados */}
        <Route path="/login" element={
          <PublicOnlyRoute><Login /></PublicOnlyRoute>
        } />
        <Route path="/select-role" element={
          <PublicOnlyRoute><SelectRole /></PublicOnlyRoute>
        } />

        {/* ══════════════════════════════════════════════════════════════════════
            ONBOARDING PROVEEDOR — Semi-público (se puede acceder sin cuenta,
            pero el flujo completo requiere estar registrado)
        ══════════════════════════════════════════════════════════════════════ */}
        <Route path="/provider-registration" element={<ProviderRegistrationPage />} />
        <Route path="/step-verification"     element={<StepVerificationPage />} />
        <Route path="/provider-success"      element={<ProviderSuccessPage />} />

        {/* ══════════════════════════════════════════════════════════════════════
            ÁREA CLIENTE — Requiere autenticación (cualquier rol puede pasar,
            el backend validará datos propios del usuario)
        ══════════════════════════════════════════════════════════════════════ */}
        <Route path="/clientdashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
            <ClientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/pet-dashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
            <PetDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/add-pet" element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
            <AddPetWizard />
          </ProtectedRoute>
        } />
        <Route path="/step-behavior" element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
            <StepBehaviorPage />
          </ProtectedRoute>
        } />
        <Route path="/register-success" element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
            <RegisterPage />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
            <CheckoutPage />
          </ProtectedRoute>
        } />
        <Route path="/order-confirmation" element={
          <ProtectedRoute allowedRoles={[ROLES.CLIENT]}>
            <OrderConfirmationPage />
          </ProtectedRoute>
        } />

        {/* ══════════════════════════════════════════════════════════════════════
            ÁREA PROVEEDOR — Solo rol 'provider'
        ══════════════════════════════════════════════════════════════════════ */}
        <Route path="/providerdashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.PROVIDER]}>
            <ProviderDashboard />
          </ProtectedRoute>
        } />
        <Route path="/service-management" element={
          <ProtectedRoute allowedRoles={[ROLES.PROVIDER]}>
            <ServiceManagementPage />
          </ProtectedRoute>
        } />

        {/* ══════════════════════════════════════════════════════════════════════
            ÁREA ADMINISTRADOR — Solo rol 'admin'
        ══════════════════════════════════════════════════════════════════════ */}
        <Route path="/admindashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/claims-queue" element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <ClaimsQueuePage />
          </ProtectedRoute>
        } />
        <Route path="/claims/:id" element={
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <ClaimDetailsPage />
          </ProtectedRoute>
        } />

        {/* ══════════════════════════════════════════════════════════════════════
            PÁGINAS DE ERROR
        ══════════════════════════════════════════════════════════════════════ */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*"             element={<NotFoundPage />} />

      </Routes>
    </Router>
  );
}

export default App;
