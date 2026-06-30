import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, Image, Phone, MoreVertical } from 'lucide-react';

const ACCENT = '#2D6A4F';

const SERVICE_COLORS = {
  'Paseos':      { bg: 'bg-blue-50',   text: 'text-blue-700'   },
  'Veterinaria': { bg: 'bg-red-50',    text: 'text-red-700'    },
  'Peluquería':  { bg: 'bg-purple-50', text: 'text-purple-700' },
  'Guardería':   { bg: 'bg-amber-50',  text: 'text-amber-700'  },
};

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 10 }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ backgroundColor: ACCENT, fontSize: size <= 9 ? '0.75rem' : '1rem' }}
    >
      {name?.[0] ?? '?'}
    </div>
  );
}

// ─── Item de bandeja ──────────────────────────────────────────────────────────
function InboxItem({ chat, isActive, onClick }) {
  const sc = SERVICE_COLORS[chat.serviceType] ?? { bg: 'bg-gray-100', text: 'text-gray-600' };
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${
        isActive ? '' : 'hover:bg-gray-50'
      }`}
      style={isActive ? { backgroundColor: `${ACCENT}12` } : {}}
    >
      <Avatar name={chat.provider} size={10} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-bold text-gray-900 truncate">{chat.provider}</p>
          <span className="text-xs text-gray-400 shrink-0">{chat.lastTime}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full shrink-0 ${sc.bg} ${sc.text}`}>
            {chat.serviceType}
          </span>
          <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
        </div>
      </div>
      {chat.isUnread && (
        <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
      )}
    </button>
  );
}

// ─── Burbuja de mensaje ───────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isClient = msg.sender === 'client';
  return (
    <div className={`flex ${isClient ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
          isClient
            ? 'rounded-br-sm text-white'
            : 'rounded-bl-sm bg-gray-100 text-gray-800'
        }`}
        style={isClient ? { backgroundColor: ACCENT } : {}}
      >
        <p className="leading-relaxed">{msg.text}</p>
        <p className={`text-xs mt-1 ${isClient ? 'text-white/70' : 'text-gray-400'} text-right`}>
          {msg.time}
        </p>
      </div>
    </div>
  );
}

// ─── MessagesView Principal ───────────────────────────────────────────────────
export default function MessagesView({ chats: initialChats }) {
  const [chats, setChats] = useState(initialChats);
  const [activeChat, setActiveChat] = useState(chats[0]);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const scrollRef = useRef();

  // Auto-scroll al abrir / enviar mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeChat?.id, activeChat?.messages?.length]);

  const filtered = chats.filter((c) =>
    c.provider.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!input.trim() || !activeChat) return;
    const newMsg = { id: `m${Date.now()}`, text: input.trim(), sender: 'client', time: 'Ahora' };
    const updatedChats = chats.map((c) =>
      c.id === activeChat.id
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, lastTime: 'Ahora', isUnread: false }
        : c
    );
    setChats(updatedChats);
    setActiveChat(updatedChats.find((c) => c.id === activeChat.id));
    setInput('');
  };

  const selectChat = (chat) => {
    setActiveChat(chat);
    setChats((prev) => prev.map((c) => c.id === chat.id ? { ...c, isUnread: false } : c));
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-extrabold text-gray-900">Mensajes</h1>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex"
        style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>

        {/* ── Bandeja (30%) ─────────────────────────────────────────────── */}
        <div className="w-72 border-r border-gray-100 flex flex-col shrink-0">
          {/* Búsqueda */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversación…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-100 rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
          {/* Lista */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.map((chat) => (
              <InboxItem
                key={chat.id}
                chat={chat}
                isActive={activeChat?.id === chat.id}
                onClick={() => selectChat(chat)}
              />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">Sin resultados</p>
            )}
          </div>
        </div>

        {/* ── Ventana de chat (70%) ──────────────────────────────────────── */}
        {activeChat ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header del chat */}
            <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 shrink-0">
              <Avatar name={activeChat.provider} size={9} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate">{activeChat.provider}</p>
                <p className="text-xs text-gray-400">{activeChat.serviceType}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-all">
                  <Phone size={16} strokeWidth={1.5} />
                </button>
                <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-all">
                  <MoreVertical size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Burbujas — scroll independiente */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {activeChat.messages.map((msg) => (
                <Bubble key={msg.id} msg={msg} />
              ))}
            </div>

            {/* Footer input */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-2 shrink-0">
              <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-all shrink-0">
                <Paperclip size={16} strokeWidth={1.5} />
              </button>
              <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 transition-all shrink-0">
                <Image size={16} strokeWidth={1.5} />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe un mensaje…"
                className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none text-gray-900 placeholder:text-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40 shrink-0"
                style={{ backgroundColor: ACCENT }}
              >
                <Send size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
            Selecciona una conversación
          </div>
        )}
      </div>
    </div>
  );
}
