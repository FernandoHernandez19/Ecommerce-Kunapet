import type { PaymentMethod } from '@/types/api';
import PaymentMethods from './PaymentMethods';
import { ChevronRight } from 'lucide-react';

interface StepPaymentGatewayProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  onPay: () => void;
  isLoading: boolean;
  error: string | null;
}

export default function StepPaymentGateway({ selectedMethod, onSelectMethod, onPay, isLoading, error }: StepPaymentGatewayProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Método de pago</h1>
      <p className="text-sm text-gray-500 mb-6">Selecciona un método de pago. Es una demo: no se realiza ningún cobro y los datos de tarjeta que escribas no se envían ni se guardan (no uses datos reales).</p>
      
      {error && (
        <div role="alert" className="mb-4 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">{error}</div>
      )}

      <PaymentMethods 
        selectedMethod={selectedMethod}
        onSelectMethod={onSelectMethod}
      />

      <div className="lg:hidden mt-6">
        <button 
          onClick={onPay}
          disabled={isLoading || !selectedMethod}
          className={`w-full text-white font-bold py-4 rounded-xl shadow-md flex justify-center items-center gap-2 transition-all ${
            isLoading || !selectedMethod ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-brand-secondary hover:bg-brand-secondary-hover'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registrando pedido...
            </span>
          ) : (
            <>Confirmar pedido <ChevronRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
}
