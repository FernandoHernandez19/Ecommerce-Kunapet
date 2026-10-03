import React, { useState } from 'react';
import CheckoutLayout from '../layouts/CheckoutLayout';
import CheckoutStepper from '../components/Checkout/CheckoutStepper';
import OrderSummary from '../components/Checkout/OrderSummary';

import StepCartReview from '../components/Checkout/StepCartReview';
import StepLogistics from '../components/Checkout/StepLogistics';
import StepPaymentGateway from '../components/Checkout/StepPaymentGateway';
import StepOrderSuccess from '../components/Checkout/StepOrderSuccess';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado para la validación del checkout (simulado)
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [isLogisticsReady, setIsLogisticsReady] = useState(true); // En un caso real esto se valida con la tarjeta y fecha

  const orderItems = [
    { 
      id: 'srv-1',
      type: 'service',
      title: 'Paseo de 1 hora', 
      subtitle: 'Para Luna • 12 Oct, 10:00 AM', 
      price: 'S/ 35.00', 
      image: 'https://images.unsplash.com/photo-1544568100-847a948585b9?w=100&q=80' 
    },
    { 
      id: 'prd-1',
      type: 'product',
      title: 'Alimento Premium 15kg', 
      subtitle: 'Cant: 1', 
      price: 'S/ 180.00', 
      image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=100&q=80' 
    }
  ];

  const orderTotals = {
    subtotal: 'S/ 215.00',
    shipping: 'S/ 15.00',
    serviceFee: 'S/ 2.50',
    total: 'S/ 232.50'
  };

  const handleNextStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePayment = () => {
    setIsLoading(true);
    // Simulación de carga de pasarela de pago (1.5s)
    setTimeout(() => {
      setIsLoading(false);
      handleNextStep(); // Pasar al Success (Paso 4)
    }, 1500);
  };

  const isReadyToPay = currentStep === 1 ? true : currentStep === 2 ? isLogisticsReady : selectedPayment !== null;

  // Render condicional del paso actual
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <StepCartReview items={orderItems} onNext={handleNextStep} />;
      case 2:
        return <StepLogistics items={orderItems} onNext={handleNextStep} />;
      case 3:
        return (
          <StepPaymentGateway 
            selectedMethod={selectedPayment}
            onSelectMethod={setSelectedPayment}
            onPay={handlePayment}
            isLoading={isLoading}
          />
        );
      case 4:
        return <StepOrderSuccess />;
      default:
        return null;
    }
  };

  // Si estamos en el paso 4, renderizamos pantalla completa
  if (currentStep === 4) {
    return (
      <CheckoutLayout>
        {renderStepContent()}
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout>
      <CheckoutStepper currentStep={currentStep} onStepClick={setCurrentStep} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative pb-12">
        
        {/* Columna Izquierda: Orquestador de Pasos (Ocupa 7 de 12 columnas) */}
        <div className="lg:col-span-7">
          {renderStepContent()}
        </div>

        {/* Columna Derecha: Resumen (Ocupa 5 de 12 columnas) */}
        <div className="lg:col-span-5 relative">
          <OrderSummary 
            items={orderItems} 
            totals={orderTotals} 
            onPay={handlePayment}
            isReadyToPay={isReadyToPay}
            currentStep={currentStep}
            onNextStep={handleNextStep}
            isLoading={isLoading}
          />
        </div>
        
      </div>
    </CheckoutLayout>
  );
}