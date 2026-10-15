// ─── mockData.ts — Datos de ejemplo que AÚN no tienen API ─────────────────────
// Mascotas, pedidos y catálogo ya vienen de la API real (src/api/*) y sus mocks se
// retiraron. Lo que queda sigue aquí porque el contrato (docs/api-contract.md §6)
// todavía no cubre estas secciones, y la interfaz las rotula «Datos de ejemplo»:
//   mockUser          → direcciones, métodos de pago y notificaciones (SettingsView, checkout)
//   mockActivity      → actividad reciente del panel (DashboardHome)
//   mockReservations  → reservas (ReservationsView, mapa en vivo de PetsManager)
//   mockChats         → mensajes (MessagesView)
//   mockNotifications → campana de notificaciones (ClientDashboardLayout)
//   mockMyReviews     → reseñas (MyReviewsView)
// Cuando exista cada endpoint, se borra su bloque de este archivo.

// ─── Tipos propios (la API no tiene estos datos, por eso no salen de src/types/api.ts) ──
export interface MockAddress {
  id: string;
  label: string;
  address: string;
  isDefault: boolean;
}

export interface MockPaymentMethod {
  id: string;
  type: string;
  lastFour: string;
  expiry: string;
  isDefault: boolean;
}

export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  avatar: string | null;
  role: 'client';
  addresses: MockAddress[];
  paymentMethods: MockPaymentMethod[];
  notifications: { email: boolean; whatsapp: boolean };
}

export type ActivityStatus = 'in_progress' | 'scheduled' | 'completed' | 'delivered';

export interface MockActivity {
  id: string;
  time: string;
  title: string;
  details: string;
  status: ActivityStatus;
  petId: string | null;
}

export type ReservationStatus = 'in_progress' | 'scheduled' | 'completed' | 'cancelled';

export interface MockReservation {
  id: string;
  type: string;
  petName: string;
  petId: string;
  provider: string;
  providerAvatar: string | null;
  date: string;
  time: string;
  status: ReservationStatus;
  price: string;
}

export interface MockMessage {
  id: string;
  text: string;
  sender: 'provider' | 'client';
  time: string;
}

export interface MockChat {
  id: string;
  provider: string;
  providerAvatar: string | null;
  serviceType: string;
  isUnread: boolean;
  lastMessage: string;
  lastTime: string;
  messages: MockMessage[];
}

export type NotificationType = 'success' | 'warning' | 'info';

export interface MockNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  isUnread: boolean;
  type: NotificationType;
}

export interface MockReview {
  id: number;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  rating: number;
  comment: string;
  date: string;
}

export const mockUser: MockUser = {
  id: 'usr-001',
  name: 'Camila Rodríguez',
  email: 'camila@email.com',
  phone: '987 654 321',
  city: 'Miraflores',
  avatar: null,
  role: 'client',
  addresses: [
    { id: 'a1', label: 'Casa', address: 'Av. Pardo 420, Miraflores', isDefault: true },
    { id: 'a2', label: 'Trabajo', address: 'Jr. Tacna 200, Lima Centro', isDefault: false },
  ],
  paymentMethods: [
    { id: 'pm1', type: 'Visa', lastFour: '4242', expiry: '12/27', isDefault: true },
    { id: 'pm2', type: 'Mastercard', lastFour: '8888', expiry: '06/26', isDefault: false },
  ],
  notifications: { email: true, whatsapp: false },
};

export const mockActivity: MockActivity[] = [
  {
    id: 'a1',
    time: 'Hoy, 14:00',
    title: 'Paseo de 1 hora',
    details: 'Luna con Carlos M.',
    status: 'in_progress',
    petId: 'p1',
  },
  {
    id: 'a2',
    time: 'Mañana, 10:00',
    title: 'Consulta Veterinaria',
    details: 'Milo en VetClinic Miraflores',
    status: 'scheduled',
    petId: 'p2',
  },
  {
    id: 'a3',
    time: 'Ayer',
    title: 'Peluquería Canina',
    details: 'Luna en PetStyle',
    status: 'completed',
    petId: 'p1',
  },
  {
    id: 'a4',
    time: '12 Jul',
    title: 'Alimento Premium 15kg',
    details: 'Tienda KunaPet · Entregado',
    status: 'delivered',
    petId: null,
  },
];

export const mockReservations: MockReservation[] = [
  {
    id: 'r1',
    type: 'Paseo',
    petName: 'Luna',
    petId: 'p1',
    provider: 'Carlos Medina',
    providerAvatar: null,
    date: 'Hoy, 29 Jun 2025',
    time: '14:00 – 15:00',
    status: 'in_progress', // ← activa widget de mapa en detalle de mascota
    price: 'S/ 35',
  },
  {
    id: 'r2',
    type: 'Veterinaria',
    petName: 'Milo',
    petId: 'p2',
    provider: 'Dra. Ana Torres',
    providerAvatar: null,
    date: 'Mañana, 30 Jun 2025',
    time: '10:00 – 10:30',
    status: 'scheduled',
    price: 'S/ 80',
  },
  {
    id: 'r3',
    type: 'Peluquería',
    petName: 'Luna',
    petId: 'p1',
    provider: 'PetStyle Centro',
    providerAvatar: null,
    date: '28 Jun 2025',
    time: '09:00 – 10:00',
    status: 'completed',
    price: 'S/ 55',
  },
  {
    id: 'r4',
    type: 'Guardería',
    petName: 'Luna',
    petId: 'p1',
    provider: 'HappyPaws',
    providerAvatar: null,
    date: '20 Jun 2025',
    time: 'Todo el día',
    status: 'completed',
    price: 'S/ 120',
  },
];

export const mockChats: MockChat[] = [
  {
    id: 'chat-1',
    provider: 'Carlos Medina',
    providerAvatar: null,
    serviceType: 'Paseos',
    isUnread: true,
    lastMessage: '¡Luna está disfrutando el parque! 🐕',
    lastTime: '14:23',
    messages: [
      { id: 'm1', text: 'Hola Camila, ya recogí a Luna.', sender: 'provider', time: '14:05' },
      { id: 'm2', text: 'Perfecto, gracias Carlos! Cualquier cosa me avisas.', sender: 'client', time: '14:06' },
      { id: 'm3', text: '¡Luna está disfrutando el parque! 🐕', sender: 'provider', time: '14:23' },
    ],
  },
  {
    id: 'chat-2',
    provider: 'Dra. Ana Torres',
    providerAvatar: null,
    serviceType: 'Veterinaria',
    isUnread: false,
    lastMessage: 'Recuerde traer el carnet de vacunación de Milo.',
    lastTime: 'Ayer',
    messages: [
      { id: 'm4', text: 'Buenos días! Le confirmo su cita para mañana a las 10:00.', sender: 'provider', time: 'Ayer 09:00' },
      { id: 'm5', text: 'Confirmado, gracias doctora!', sender: 'client', time: 'Ayer 09:05' },
      { id: 'm6', text: 'Recuerde traer el carnet de vacunación de Milo.', sender: 'provider', time: 'Ayer 09:06' },
    ],
  },
];

export const mockNotifications: MockNotification[] = [
  {
    id: 'notif-1',
    title: 'Reserva confirmada',
    message: 'El paseo de Luna con Carlos M. ha sido confirmado.',
    time: 'Hace 5 min',
    isUnread: true,
    type: 'success', 
  },
  {
    id: 'notif-2',
    title: 'Recordatorio de Vacuna',
    message: 'La vacuna "Antirrábica" de Luna vence pronto.',
    time: 'Hace 2 horas',
    isUnread: true,
    type: 'warning',
  },
  {
    id: 'notif-3',
    title: 'Pedido Entregado',
    message: 'Tu pedido de Alimento Royal Canin ha llegado.',
    time: 'Ayer',
    isUnread: false,
    type: 'info',
  },
];

// ─── Mock para "Mis Reseñas" del Dashboard ────────────────────────────────
export const mockMyReviews: MockReview[] = [
  {
    id: 101,
    itemId: '1',
    itemTitle: "NutriCan Pro Adultos Raza Grande",
    itemImage: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400&q=80",
    rating: 5,
    comment: "A mi perro le encantó, el pelo le brilla más desde que come esto. El envío fue súper rápido a San Borja.",
    date: "Hace 2 semanas"
  },
  {
    id: 102,
    itemId: '3',
    itemTitle: "Consulta Veterinaria General en Casa",
    itemImage: "https://images.unsplash.com/photo-1628009368231-7bb7cbcb8122?w=400&q=80",
    rating: 4,
    comment: "El doctor fue muy amable y puntual, aunque me gustaría que explicaran un poco más la receta al finalizar.",
    date: "Hace 1 mes"
  }
];
