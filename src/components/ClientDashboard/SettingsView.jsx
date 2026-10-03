import React, { useState } from 'react';
import { User, MapPin, CreditCard, Bell, Plus, Trash2, CheckCircle2, X } from 'lucide-react';
import { Input } from '../ui';

const ACCENT = '#2D6A4F';

// ─── Toggle iOS ───────────────────────────────────────────────────────────────
function Toggle({ id, checked, onChange, label, desc }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between gap-4 py-4 cursor-pointer group">
      <div>
        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#2D6A4F] transition-colors">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div className="relative shrink-0">
        <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="w-12 h-6 rounded-full transition-all duration-300" style={{ backgroundColor: checked ? ACCENT : '#D1D5DB' }} />
        <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300" style={{ left: checked ? '26px' : '2px' }} />
      </div>
    </label>
  );
}

function PaymentCard({ card, onSetDefault, onDelete }) {
  return (
    <div className={`relative p-5 rounded-2xl text-white overflow-hidden ${card.isDefault ? '' : 'opacity-80'}`}
      style={{ background: `linear-gradient(135deg, ${ACCENT} 0%, #054a2e 100%)` }}>
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
        style={{ backgroundColor: '#fff' }} />
      <div className="flex justify-between items-start mb-8">
        <p className="text-xs font-bold opacity-70 uppercase tracking-wider">{card.type}</p>
        {card.isDefault && (
          <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">Principal</span>
        )}
      </div>
      <p className="font-mono text-lg font-bold tracking-widest mb-3 relative z-10">**** **** **** {card.lastFour}</p>
      <div className="flex justify-between items-end relative z-10">
        <p className="text-xs opacity-70">Vence {card.expiry}</p>
        <div className="flex gap-2 items-center">
          {!card.isDefault && (
            <button onClick={onSetDefault} className="text-[10px] font-bold uppercase tracking-wider bg-black/20 hover:bg-black/30 px-2 py-1 rounded-full transition-colors">
              Hacer Principal
            </button>
          )}
          <button onClick={onDelete} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <Trash2 size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Secciones ────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'profile',   label: 'Perfil Personal',          Icon: User       },
  { id: 'addresses', label: 'Mis Direcciones',           Icon: MapPin     },
  { id: 'payments',  label: 'Métodos de Pago',           Icon: CreditCard },
  { id: 'notifs',    label: 'Notificaciones',            Icon: Bell       },
];

export default function SettingsView({ user }) {
  const [activeSection, setActiveSection] = useState('profile');

  // Estado local del formulario de perfil
  const [profile, setProfile] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    city: user?.city ?? '',
  });

  // Direcciones
  const [addresses, setAddresses] = useState(user?.addresses ?? []);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '', district: '', reference: '' });

  const handleSetDefaultAddress = (id) => {
    setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.label || !newAddress.address) return;
    const id = Date.now().toString();
    setAddresses([...addresses, { id, ...newAddress, isDefault: addresses.length === 0 }]);
    setNewAddress({ label: '', address: '', district: '', reference: '' });
    setShowAddressModal(false);
  };

  // Pagos
  const [payments, setPayments] = useState(user?.paymentMethods ?? []);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState({ type: 'Visa', number: '', expiry: '', cvv: '' });

  const handleSetDefaultPayment = (id) => {
    setPayments(payments.map((p) => ({ ...p, isDefault: p.id === id })));
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    if (!newPayment.number || !newPayment.expiry) return;
    const id = Date.now().toString();
    const lastFour = newPayment.number.slice(-4) || 'XXXX';
    setPayments([...payments, { id, type: newPayment.type, lastFour, expiry: newPayment.expiry, isDefault: payments.length === 0 }]);
    setNewPayment({ type: 'Visa', number: '', expiry: '', cvv: '' });
    setShowPaymentModal(false);
  };

  // Notificaciones
  const [notifs, setNotifs] = useState(user?.notifications ?? { email: true, whatsapp: false });

  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-extrabold text-gray-900">Configuración</h1>

      <div className="flex gap-6 items-start">
        {/* Menú secundario */}
        <aside className="w-52 shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-2">
          {SECTIONS.map(({ id, label, Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left ${
                  isActive ? '' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
                style={isActive ? { backgroundColor: `${ACCENT}15`, color: ACCENT } : {}}
              >
                <Icon size={16} strokeWidth={1.5} /> {label}
              </button>
            );
          })}
        </aside>

        {/* Contenido */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">

          {/* ── Perfil Personal ───────────────────────────────────────────── */}
          {activeSection === 'profile' && (
            <div className="flex flex-col gap-6">
              <h2 className="text-base font-bold text-gray-900">Perfil Personal</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input id="s-name"  label="Nombre Completo" value={profile.name}
                  onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} />
                <Input id="s-email" label="Correo Electrónico" type="email" value={profile.email}
                  onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} />
                <Input id="s-phone" label="Teléfono" value={profile.phone}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} />
                <Input id="s-city"  label="Ciudad" value={profile.city}
                  onChange={(e) => setProfile((p) => ({ ...p, city: e.target.value }))} />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 text-sm font-bold text-white rounded-xl transition-all hover:opacity-90"
                  style={{ backgroundColor: ACCENT }}
                >
                  Guardar Cambios
                </button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                    <CheckCircle2 size={16} strokeWidth={2} /> ¡Guardado!
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── Mis Direcciones ───────────────────────────────────────────── */}
          {activeSection === 'addresses' && (
            <div className="flex flex-col gap-5">
              <h2 className="text-base font-bold text-gray-900">Mis Direcciones</h2>
              {addresses.map((addr) => (
                <div key={addr.id} className="flex items-center gap-3 p-4 border border-gray-100 rounded-2xl">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${ACCENT}12` }}>
                    <MapPin size={16} strokeWidth={1.5} style={{ color: ACCENT }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{addr.label}</p>
                    <p className="text-xs text-gray-500 truncate">{addr.address}</p>
                  </div>
                  {addr.isDefault ? (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
                      Principal
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className="text-xs font-bold text-gray-400 hover:text-gray-900 underline transition-colors shrink-0"
                    >
                      Hacer Principal
                    </button>
                  )}
                  <button className="p-2 rounded-xl text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all ml-2"
                    onClick={() => setAddresses((prev) => prev.filter((a) => a.id !== addr.id))}>
                    <Trash2 size={14} strokeWidth={1.5} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setShowAddressModal(true)}
                className="flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-[#2D6A4F]/40 hover:text-[#2D6A4F] transition-all"
              >
                <Plus size={16} strokeWidth={2} /> Añadir nueva dirección
              </button>
            </div>
          )}

          {/* ── Métodos de Pago ───────────────────────────────────────────── */}
          {activeSection === 'payments' && (
            <div className="flex flex-col gap-5">
              <h2 className="text-base font-bold text-gray-900">Métodos de Pago</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {payments.map((card) => (
                  <PaymentCard 
                    key={card.id} 
                    card={card} 
                    onSetDefault={() => handleSetDefaultPayment(card.id)}
                    onDelete={() => setPayments((prev) => prev.filter((p) => p.id !== card.id))}
                  />
                ))}
              </div>
              <button 
                onClick={() => setShowPaymentModal(true)}
                className="flex items-center gap-2 text-sm font-bold px-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-[#2D6A4F]/40 hover:text-[#2D6A4F] transition-all w-fit"
              >
                <Plus size={16} strokeWidth={2} /> Añadir tarjeta
              </button>
            </div>
          )}

          {/* ── Notificaciones ────────────────────────────────────────────── */}
          {activeSection === 'notifs' && (
            <div className="flex flex-col gap-2">
              <h2 className="text-base font-bold text-gray-900 mb-2">Notificaciones</h2>
              <div className="bg-gray-50 rounded-2xl divide-y divide-gray-100 px-5">
                <Toggle
                  id="notif-email"
                  label="Notificaciones por correo"
                  desc="Confirmaciones, novedades y ofertas exclusivas."
                  checked={notifs.email}
                  onChange={(v) => setNotifs((p) => ({ ...p, email: v }))}
                />
                <Toggle
                  id="notif-whatsapp"
                  label="Recordatorios por WhatsApp"
                  desc="Recordatorios de citas y mensajes de tu proveedor."
                  checked={notifs.whatsapp}
                  onChange={(v) => setNotifs((p) => ({ ...p, whatsapp: v }))}
                />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Modal Nueva Dirección ── */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Nueva Dirección</h3>
              <button onClick={() => setShowAddressModal(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={20} strokeWidth={2} />
              </button>
            </div>
            <form onSubmit={handleAddAddress} className="p-6 flex flex-col gap-4">
              <Input label="Etiqueta (Ej. Casa, Trabajo)" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} required />
              <Input label="Dirección completa" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Distrito / Ciudad" value={newAddress.district} onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })} />
                <Input label="Referencia" value={newAddress.reference} onChange={(e) => setNewAddress({ ...newAddress, reference: e.target.value })} />
              </div>
              <button type="submit" className="mt-2 w-full py-3.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-[#c93623] transition-colors">
                Guardar Dirección
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Nueva Tarjeta ── */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-slide-up">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Añadir Tarjeta</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={20} strokeWidth={2} />
              </button>
            </div>
            <form onSubmit={handleAddPayment} className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-gray-700 ml-1">Tipo de Tarjeta</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all appearance-none"
                  value={newPayment.type}
                  onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}
                >
                  <option value="Visa">Visa</option>
                  <option value="MasterCard">MasterCard</option>
                  <option value="American Express">American Express</option>
                </select>
              </div>
              <Input label="Número de Tarjeta" value={newPayment.number} onChange={(e) => setNewPayment({ ...newPayment, number: e.target.value })} maxLength="19" placeholder="0000 0000 0000 0000" required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Vencimiento" value={newPayment.expiry} onChange={(e) => setNewPayment({ ...newPayment, expiry: e.target.value })} placeholder="MM/AA" maxLength="5" required />
                <Input label="CVV" type="password" value={newPayment.cvv} onChange={(e) => setNewPayment({ ...newPayment, cvv: e.target.value })} maxLength="4" placeholder="***" required />
              </div>
              <button type="submit" className="mt-2 w-full py-3.5 bg-brand-primary text-white font-bold rounded-xl hover:bg-[#c93623] transition-colors">
                Guardar Tarjeta
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
