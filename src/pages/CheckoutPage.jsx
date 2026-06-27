import React, { useState } from 'react';
import CheckoutLayout from '../layouts/CheckoutLayout';
import CheckoutStepper from '../components/Checkout/CheckoutStepper';
import PetSelector from '../components/Checkout/PetSelector';
import PaymentMethods from '../components/Checkout/PaymentMethods';
import OrderSummary from '../components/Checkout/OrderSummary';

// Componente pequeño local para la dirección
const AddressCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold text-gray-900 flex items-center">
        <span className="text-[#006D44] mr-2">🚚</span> Dirección de Envío y Servicio
      </h2>
      <button className="text-xs font-bold text-[#006D44] hover:text-[#005233]">Editar</button>
    </div>
    <div className="bg-[#FAF9F6] border border-gray-200 rounded-xl p-4 flex items-start space-x-3">
      <span className="text-gray-400 mt-1">📍</span>
      <div>
        <p className="text-sm font-bold text-gray-900">Casa (Principal)</p>
        <p className="text-sm text-gray-600 mt-1">Av. Javier Prado Este 456, Dpto 302</p>
        <p className="text-sm text-gray-600">San Isidro, Lima, Perú</p>
        <p className="text-xs text-gray-500 font-medium mt-2">Ref: Frente al parque El Olivar</p>
      </div>
    </div>
  </div>
);

export default function CheckoutPage() {
  // Manejo de estado para controlar la validación de la compra
  const [selectedPet, setSelectedPet] = useState('luna');
  const [selectedPayment, setSelectedPayment] = useState('card');

  const orderItems = [
    { 
      title: 'Paseo de 1 hora', subtitle: 'Para Luna • 12 Oct, 10:00 AM', price: 'S/ 35.00', 
      image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=100&q=80' 
    },
    { 
      title: 'Alimento Premium 15kg', subtitle: 'Cant: 1', price: 'S/ 180.00', 
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100&q=80' 
    }
  ];

  const orderTotals = {
    subtotal: 'S/ 215.00',
    shipping: 'S/ 15.00',
    serviceFee: 'S/ 2.50',
    total: 'S/ 232.50'
  };

  const handlePayment = () => {
    console.log("Procesando pago con:", selectedPayment, "para mascota:", selectedPet);
    // Redirigir a la página de confirmación (Paso 4)
  };

  return (
    <CheckoutLayout>
      <CheckoutStepper />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Columna Izquierda: Formularios (Ocupa 7 de 12 columnas) */}
        <div className="lg:col-span-7">
          <PetSelector 
            selectedPet={selectedPet} 
            onSelectPet={setSelectedPet} 
          />
          <AddressCard />
          <PaymentMethods 
            selectedMethod={selectedPayment} 
            onSelectMethod={setSelectedPayment} 
          />
        </div>

        {/* Columna Derecha: Resumen (Ocupa 5 de 12 columnas) */}
        <div className="lg:col-span-5">
          <OrderSummary 
            items={orderItems} 
            totals={orderTotals} 
            onPay={handlePayment}
            isReadyToPay={selectedPet !== null && selectedPayment !== null}
          />
        </div>
        
      </div>
    </CheckoutLayout>
  );
}