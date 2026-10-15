import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import NavbarHeader from '../components/NavbarHeader';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { listItems } from '../api/items';
import { categoryToSlug, solesToCents } from '../api/adapters';
import { friendlyMessage } from '../api/errorMessages';

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: 'recent',     label: 'Más recientes' },
  { value: 'price_asc',  label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
];

/** Convierte los filtros de la pantalla en los parámetros de GET /items (el servidor filtra). */
export function buildQuery({ type, category, q, priceMin, priceMax }) {
  const params = {};
  if (type) params.type = type;
  if (category) params.category = category;
  if (q) params.q = q;
  const min = priceMin === '' || priceMin == null ? null : solesToCents(priceMin);
  const max = priceMax === '' || priceMax == null ? null : solesToCents(priceMax);
  if (min !== null) params.minPriceCents = min;
  if (max !== null) params.maxPriceCents = max;
  return params;
}

function useCatalog(query) {
  const key = JSON.stringify(query);
  const [state, setState] = useState({ items: [], total: 0, page: 1, loading: true, loadingMore: false, error: null, moreError: null });
  const [tick, setTick] = useState(0);
  const moreController = useRef(null);
  const busy = useRef(false); // evita doble clic en «Cargar más» antes del siguiente render

  useEffect(() => {
    const controller = new AbortController();
    moreController.current?.abort();
    busy.current = false;
    setState((s) => ({ ...s, items: [], total: 0, page: 1, loading: true, loadingMore: false, error: null, moreError: null }));
    listItems({ ...JSON.parse(key), page: 1, limit: PAGE_SIZE }, { signal: controller.signal })
      .then(({ data, meta }) => {
        if (!controller.signal.aborted) setState((s) => ({ ...s, items: data, total: meta.total, page: 1, loading: false }));
      })
      .catch((err) => {
        if (!controller.signal.aborted) setState((s) => ({ ...s, loading: false, error: friendlyMessage(err) }));
      });
    return () => controller.abort();
  }, [key, tick]);

  // Se lee el estado desde una ref: así loadMore nunca dispara efectos dentro de un
  // actualizador de setState (StrictMode los ejecuta dos veces → peticiones duplicadas).
  const stateRef = useRef(state);
  stateRef.current = state;

  const loadMore = useCallback(() => {
    const cur = stateRef.current;
    if (busy.current || cur.loadingMore || cur.loading) return;
    busy.current = true;
    const controller = new AbortController();
    moreController.current = controller;
    const nextPage = cur.page + 1;
    setState((s) => ({ ...s, loadingMore: true, moreError: null }));
    listItems({ ...JSON.parse(key), page: nextPage, limit: PAGE_SIZE }, { signal: controller.signal })
      .then(({ data, meta }) => {
        if (controller.signal.aborted) return;
        busy.current = false;
        setState((s) => ({
          ...s,
          items: [...s.items, ...data.filter((n) => !s.items.some((o) => o.id === n.id))],
          total: meta.total,
          page: nextPage,
          loadingMore: false,
        }));
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        busy.current = false;
        setState((s) => ({ ...s, loadingMore: false, moreError: friendlyMessage(err) }));
      });
  }, [key]);

  useEffect(() => () => moreController.current?.abort(), []);

  return { ...state, reload: () => setTick((t) => t + 1), loadMore };
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse" aria-hidden="true">
      <div className="h-44 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-1/3 bg-gray-100 rounded" />
        <div className="h-4 w-4/5 bg-gray-100 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
        <div className="h-8 w-full bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [sortBy, setSortBy]     = useState('recent');
  const [showSort, setShowSort] = useState(false);
  const navigate                = useNavigate();
  const location                = useLocation();

  const params = new URLSearchParams(location.search);
  const urlCategory = params.get('category')?.split(',')[0] ?? '';
  const q = params.get('q')?.trim() ?? '';

  const [filters, setFilters] = useState({ type: '', category: urlCategory ? categoryToSlug(urlCategory) : '', priceMin: '', priceMax: '' });

  // La URL (carrusel, buscador del navbar) manda sobre la categoría.
  useEffect(() => {
    setFilters((f) => ({ ...f, category: urlCategory ? categoryToSlug(urlCategory) : '' }));
  }, [urlCategory]);

  const query = useMemo(() => buildQuery({ ...filters, q }), [filters, q]);
  const { items, total, loading, loadingMore, error, moreError, reload, loadMore } = useCatalog(query);

  const sortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? SORT_OPTIONS[0].label;

  const sorted = useMemo(() => {
    const list = [...items];
    if (sortBy === 'price_asc') list.sort((a, b) => a.priceCents - b.priceCents);
    if (sortBy === 'price_desc') list.sort((a, b) => b.priceCents - a.priceCents);
    return list;
  }, [items, sortBy]);

  const hasMore = items.length < total;
  const hasFilters = Boolean(filters.type || filters.category || filters.priceMin !== '' || filters.priceMax !== '' || q);

  const clearAll = () => {
    setFilters({ type: '', category: '', priceMin: '', priceMax: '' });
    if (location.search) navigate('/marketplace', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarHeader />

      <div className="flex max-w-screen-xl mx-auto">
        <FilterSidebar
          onApply={(f) => setFilters({ type: f.type, category: f.category, priceMin: f.priceMin, priceMax: f.priceMax })}
          initialCategory={urlCategory}
        />

        <main className="flex-1 px-6 py-6 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Resultados</h1>
              <p className="text-sm text-gray-500 mt-1" aria-live="polite">
                {loading
                  ? 'Buscando…'
                  : error
                    ? ''
                    : <>Mostrando <strong>{items.length}</strong> de <strong>{total}</strong> {total === 1 ? 'resultado' : 'resultados'}{q && <> para «<strong>{q}</strong>»</>}.</>}
              </p>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSort((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={showSort}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 transition"
              >
                {sortLabel}
                {showSort ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </button>

              {showSort && (
                <div role="listbox" className="absolute right-0 mt-1 w-52 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={sortBy === opt.value}
                      onClick={() => { setSortBy(opt.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortBy === opt.value ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {sortBy !== 'recent' && hasMore && !loading && (
            <p className="text-xs text-gray-400 mb-3">Ordenando los resultados ya cargados; pulsa «Cargar más» para ver el resto.</p>
          )}

          {/* ── Cargando ── */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" role="status" aria-label="Cargando resultados">
              {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
            </div>
          )}

          {/* ── Error ── */}
          {!loading && error && (
            <div role="alert" className="bg-white border border-red-100 rounded-2xl p-8 text-center">
              <p className="text-sm font-medium text-red-600 mb-4">{error}</p>
              <button type="button" onClick={reload} className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white text-sm font-bold rounded-xl transition-colors">
                Reintentar
              </button>
            </div>
          )}

          {/* ── Vacío ── */}
          {!loading && !error && items.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
              <p className="text-3xl mb-3" aria-hidden="true">🐾</p>
              <h2 className="text-lg font-bold text-gray-900">No encontramos resultados</h2>
              <p className="text-sm text-gray-500 mt-1 mb-5">
                {hasFilters ? 'Prueba con otros filtros o quita la búsqueda.' : 'Todavía no hay productos ni servicios publicados.'}
              </p>
              {hasFilters && (
                <button type="button" onClick={clearAll} className="px-5 py-2.5 border border-gray-300 bg-white text-sm font-semibold text-gray-700 rounded-xl hover:bg-gray-50 transition">
                  Limpiar filtros
                </button>
              )}
            </div>
          )}

          {/* ── Resultados ── */}
          {!loading && !error && items.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sorted.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    provider={product.provider.name}
                    onVerMas={() => navigate('/item/' + product.id)}
                  />
                ))}
              </div>

              {moreError && (
                <p role="alert" className="text-center text-sm text-red-600 mt-6">{moreError}</p>
              )}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition disabled:opacity-60"
                  >
                    {loadingMore ? 'Cargando…' : moreError ? 'Reintentar' : 'Cargar más resultados'}
                    {!loadingMore && <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
