import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//1.Pagina Inicial de presentacion por defecto, con un navbar superior, transicion de imagenes, y cards de servicios destacados
import Home from './pages/Home';
//2.Pagina de Login con formulario de inicio de sesion y registro para usuarios que ya se registraron con rol de cliente o proveedor y cerraron sesion
import Login from './pages/Login';
//3.Pagina de seleccion de rol, para que el usuario pueda elegir si quiere registrarse como cliente o proveedor
import SelectRole from './pages/SelectRole';
//4.Pagina de Marketplace, donde se muestran todos los servicios y/o productos  disponibles para los clientes, con filtros y busqueda
import Marketplace from './pages/Marketplace';
//5.Pagina de detalle de servicio, donde se muestra la informacion del servicio seleccionado, con opcion de agendar o comprar
import ServiceDetailPage from './pages/ServiceDetail';
//6.Pagina de dashboard del cliente, donde se muestran los servicios contratados,productos comprados, historial de compras y perfil del cliente
import ClientDashboard from './pages/ClientDashboard';
//7.Pagina de dashboard del proveedor, donde se muestran los servicios/productos ofrecidos, historial de ventas y perfil del proveedor
import ProviderDashboard from './pages/ProviderDashboard';
//8.Pagina de dashboard del administrador, donde se muestran los servicios de la app-webs, ganancias y perfil del administrador
import AdminDashboard from './pages/AdminDashboard';
//9.Pagina de centro de ayuda, donde se muestran las preguntas frecuentes y un formulario de contacto para los usuarios
import HelpCenter from './pages/HelpCenter';
//10.Pagina de cola de reclamos, donde se muestran los reclamos pendientes de revision por el administrador
import ClaimsQueuePage from './pages/ClaimsQueuePage';
//11.Pagina de detalle de reclamo, donde se muestra la informacion del reclamo seleccionado, con opcion de aprobar o rechazar el reclamo
import ClaimDetailsPage from './pages/ClaimDetailsPage';
//12.Pagina de checkout, donde se muestra el resumen de la compra o servicio seleccionado, con opcion de pagar y finalizar la compra
import CheckoutPage from './pages/CheckoutPage';
//13.Pagina de dashboard de la mascota, donde se muestra la informacion de la mascota, historial de servicios y productos, y perfil de la mascota
import PetDashboardPage from './pages/PetDashboardPage';
//14.Pagina de wizard de registro de mascota, donde se muestra un formulario paso a paso para registrar la mascota del cliente
import AddPetWizard from './pages/AddPetWizard';
//15.Pagina de wizard de registro de comportamiento de la mascota, donde se muestra un formulario paso a paso para registrar el comportamiento de la mascota del cliente
import StepBehaviorPage from './pages/StepBehaviorPage';
//16.Pagina de registro exitoso de mascota, donde se muestra un formulario paso a paso para registrar la verificacion del proveedor
import RegisterPage from './pages/RegistrationSuccessPage';
//17.Pagina de wizard de registro del proveedor, donde se muestra un formulario paso a paso para registrar el proveedor
import ProviderRegistrationPage from './pages/ProviderRegistration';
//18.Pagina de wizard de verificacion del proveedor, donde se muestra un formulario paso a paso para registrar la verificacion del proveedor
import StepVerificationPage from './pages/StepVerificationPage';
//19.Pagina de registro exitoso del proveedor
import ProviderSuccessPage from './pages/ProviderSuccessPage';
//20.Pagina de gestion de servicios del proveedor, donde se muestra un listado de los servicios ofrecidos por el proveedor, con opcion de agregar, editar o eliminar servicios
import ServiceManagementPage from './pages/ServiceManagementPage';

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
        <Route path="/pet-dashboard" element={<PetDashboardPage />} />
        <Route path="/add-pet" element={<AddPetWizard />} />
        <Route path="/step-behavior" element={<StepBehaviorPage />} />
        <Route path="/register-success" element={<RegisterPage />} />
        <Route path="/provider-registration" element={<ProviderRegistrationPage />} />
        <Route path="/step-verification" element={<StepVerificationPage />} />
        <Route path="/provider-success" element={<ProviderSuccessPage />} />
        <Route path="/service-management" element={<ServiceManagementPage />} />
      </Routes>
    </Router>

  )
}

export default App;
