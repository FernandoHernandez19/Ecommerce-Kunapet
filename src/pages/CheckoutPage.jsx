import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CheckoutLayout from '../layouts/CheckoutLayout';
import CheckoutStepper from '../components/Checkout/CheckoutStepper';
import OrderSummary from '../components/Checkout/OrderSummary';

import StepCartReview from '../components/Checkout/StepCartReview';
import StepLogistics from '../components/Checkout/StepLogistics';
import StepPaymentGateway from '../components/Checkout/StepPaymentGateway';
import StepOrderSuccess from '../components/Checkout/StepOrderSuccess';

import useCartStore, { toEstimateLines, unitCents } from '../store/useCartStore';
import { estimateTotals, formatMoney } from '../api/adapters';
import { createOrder, findOffendingItemId } from '../api/orders';
import { friendlyMessage } from '../api/errorMessages';

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('card');
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [order, setOrder] = useState(null); // pedido devuelto por el servidor

  const cartItems = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const removeItemsById = useCartStore((s) => s.removeItemsById);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  // Items tal como los dibujan los pasos del checkout (precios SOLO para mostrar).
  const orderItems = useMemo(
    () =>
      cartItems.map((i) => ({
        id: i.id,
        type: i.type,
        title: i.title,
        image: i.image ?? null,
        quantity: i.quantity,
        subtitle: `Cant: ${i.quantity} × ${formatMoney(unitCents(i))}`,
        price: formatMoney(unitCents(i) * i.quantity),
      })),
    [cartItems],
  );

  // ESTIMACIÓN: el total válido es el que devuelve el servidor al crear el pedido.
  const estimate = useMemo(() => estimateTotals(toEstimateLines(cartItems)), [cartItems]);
  const orderTotals = {
    subtotal: formatMoney(estimate.subtotalCents),
    shipping: formatMoney(estimate.shippingCents),
    serviceFee: formatMoney(estimate.platformFeeCents),
    total: formatMoney(estimate.totalCents),
  };

  const goToStep = (step) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(step);
  };
  const handleNextStep = () => goToStep(Math.min(currentStep + 1, 3));

  // POST /orders — se envían SOLO itemId, quantity y paymentMethod.
  const handleConfirm = async () => {
    if (isLoading || cartItems.length === 0) return;
    setIsLoading(true);
    setError(null);
    setNotice(null);
    const lines = cartItems.map((i) => ({ itemId: i.id, quantity: i.quantity }));
    try {
      const created = await createOrder(lines, selectedPayment);
      clearCart();
      setOrder(created);
      goToStep(4);
    } catch (err) {
      const offendingId = findOffendingItemId(err, lines);
      if (offendingId) {
        // El servidor ya no reconoce o no puede vender ese item (p. ej. ids antiguos del carrito).
        const title = cartItems.find((i) => i.id === offendingId)?.title ?? 'Un item';
        removeItemsById([offendingId]);
        setNotice(`Quitamos «${title}» del carrito porque ya no está disponible. Revisa tu carrito e inténtalo de nuevo.`);
        goToStep(1);
      } else {
        setError(friendlyMessage(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Pantalla final con el pedido del servidor (el carrito ya está vacío).
  if (currentStep === 4 && order) {
    return (
      <CheckoutLayout>
        <StepOrderSuccess order={order} />
      </CheckoutLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <CheckoutLayout>
        {notice && <div role="alert" className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">{notice}</div>}
        <div className="text-center py-20">
          <p className="text-4xl mb-3" aria-hidden="true">🛒</p>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h1>
          <p className="text-sm text-gray-500 mb-6">Agrega productos o servicios para crear un pedido.</p>
          <Link to="/marketplace" className="inline-block px-6 py-3 bg-brand-secondary hover:bg-brand-secondary-hover text-white font-bold rounded-xl no-underline">
            Ir al marketplace
          </Link>
        </div>
      </CheckoutLayout>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepCartReview
            items={orderItems}
            onNext={handleNextStep}
            onRemove={(item) => removeItem(item.id, item.type)}
            onQuantity={(item, qty) => updateQuantity(item.id, item.type, qty)}
          />
        );
      case 2:
        return <StepLogistics items={orderItems} onNext={handleNextStep} />;
      case 3:
        return (
          <StepPaymentGateway
            selectedMethod={selectedPayment}
            onSelectMethod={setSelectedPayment}
            onPay={handleConfirm}
            isLoading={isLoading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <CheckoutLayout>
      <CheckoutStepper currentStep={currentStep} onStepClick={goToStep} />

      {notice && (
        <div role="alert" className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-800">
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative pb-12">
        <div className="lg:col-span-7">{renderStepContent()}</div>

        <div className="lg:col-span-5 relative">
          <OrderSummary
            items={orderItems}
            totals={orderTotals}
            onPay={handleConfirm}
            isReadyToPay={selectedPayment !== null}
            currentStep={currentStep}
            onNextStep={handleNextStep}
            isLoading={isLoading}
          />
        </div>
      </div>
    </CheckoutLayout>
  );
}
