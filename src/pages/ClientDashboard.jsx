import React, { useState, useEffect, useCallback } from 'react';
import useAuthStore from '../store/useAuthStore';
import usePetsStore from '../store/usePetsStore';
import { useLocation } from 'react-router-dom';
import ClientDashboardLayout from '../layouts/ClientDashboardLayout';

// Vistas del Dashboard
import DashboardHome     from '../components/ClientDashboard/DashboardHome';
import PetsManager       from '../components/ClientDashboard/PetsManager';
import ReservationsView  from '../components/ClientDashboard/ReservationsView';
import OrdersView        from '../components/ClientDashboard/OrdersView';
import MessagesView      from '../components/ClientDashboard/MessagesView';
import SettingsView      from '../components/ClientDashboard/SettingsView';
import MyReviewsView     from '../components/ClientDashboard/MyReviewsView';

// Mock Data centralizado (pets ahora viene del store global)
import {
  mockUser,
  mockActivity,
  mockReservations,
  mockChats,
} from '../data/mockData';

const VIEWS = ['home', 'pets', 'reservations', 'orders', 'messages', 'reviews', 'settings'];

export default function ClientDashboard() {
  const { user: authUser } = useAuthStore();
  const [activeView, setActiveView] = useState('home');
  const location = useLocation();
  // Mascotas desde la API (store global: se actualiza al crear, editar o borrar)
  const pets = usePetsStore((state) => state.pets);
  const petsStatus = usePetsStore((state) => state.status);
  const petsError = usePetsStore((state) => state.error);
  const fetchPets = usePetsStore((state) => state.fetchPets);

  const loadPets = useCallback((signal) => fetchPets(signal), [fetchPets]);
  useEffect(() => {
    const controller = new AbortController();
    loadPets(controller.signal);
    return () => controller.abort();
  }, [loadPets]);

  // Si el navbar navegó con { state: { tab } }, activar esa pestaña al montar
  useEffect(() => {
    const tab = location.state?.tab ?? new URLSearchParams(location.search).get('tab');
    if (VIEWS.includes(tab)) setActiveView(tab);
  }, [location.state, location.search]);

  // Usar datos de auth si existen, si no usar mockUser como fallback
  const user = authUser ?? mockUser;

  // Contar mensajes no leídos para el badge del sidebar
  const unreadCount = mockChats.filter((c) => c.isUnread).length;

  // ── Renderizado de la vista activa ─────────────────────────────────────────
  const renderView = () => {
    switch (activeView) {
      case 'home':
        return (
          <DashboardHome
            user={user}
            pets={pets}
            petsStatus={petsStatus}
            petsError={petsError}
            onRetryPets={() => loadPets()}
            activity={mockActivity}
            setActiveView={setActiveView}
          />
        );
      case 'pets':
        return (
          <PetsManager
            pets={pets}
            status={petsStatus}
            error={petsError}
            onRetry={() => loadPets()}
            reservations={mockReservations}
          />
        );
      case 'reservations':
        return <ReservationsView reservations={mockReservations} />;
      case 'orders':
        return <OrdersView />;
      case 'messages':
        return <MessagesView chats={mockChats} />;
      case 'reviews':
        return <MyReviewsView />;
      case 'settings':
        return <SettingsView user={{ ...mockUser, ...authUser }} />;
      default:
        return null;
    }
  };

  return (
    <ClientDashboardLayout
      activeView={activeView}
      setActiveView={setActiveView}
      user={user}
      unreadCount={unreadCount}
    >
      {renderView()}
    </ClientDashboardLayout>
  );
}