import React from 'react';
import './FilterSidebar.css';

const FilterSidebar = () => {
  // Datos estáticos para las opciones
  const petTypes = ['Perro', 'Gato', 'Ave', 'Exótico'];
  const categories = ['Alimentos', 'Medicina', 'Grooming', 'Veterinaria', 'Accesorios'];
  const districts = ['San Borja, Lima', 'Miraflores', 'Surco', 'La Molina', 'Barranco'];
  const ratings = [1, 2, 3, 4, 5];

  return (
    <aside className="filter-sidebar">
      {/* Header */}
      <div className="filter-header">
        <h2>Filtros</h2>
        <button className="clear-btn">Limpiar</button>
      </div>

      {/* Pet Type Filter */}
      <section className="filter-section">
        <h3 className="filter-title">Tipo de Mascota</h3>
        <div className="pet-type-pills">
          {petTypes.map((type) => (
            <button key={type} className="pet-pill">
              {type}
            </button>
          ))}
        </div>
      </section>

      {/* Category Filter */}
      <section className="filter-section">
        <h3 className="filter-title">Categoría</h3>
        <div className="checkbox-group">
          {categories.map((category) => (
            <label key={category} className="checkbox-label">
              <input type="checkbox" className="checkbox-input" />
              <span className="checkbox-text">{category}</span>
            </label>
          ))}
        </div>
      </section>

      {/* District Filter */}
      <section className="filter-section">
        <h3 className="filter-title">Distrito</h3>
        <select className="district-select">
          {districts.map((district) => (
            <option key={district} value={district}>
              {district}
            </option>
          ))}
        </select>
      </section>

      {/* Price Range Filter */}
      <section className="filter-section">
        <h3 className="filter-title">Precio (S/)</h3>
        <div className="price-inputs">
          <div className="price-input-group">
            <label htmlFor="min-price" className="price-label">Mín</label>
            <input
              id="min-price"
              type="number"
              className="price-input"
              placeholder="0"
            />
          </div>
          <div className="price-input-group">
            <label htmlFor="max-price" className="price-label">Máx</label>
            <input
              id="max-price"
              type="number"
              className="price-input"
              placeholder="5000"
            />
          </div>
        </div>
      </section>

      {/* Rating Filter */}
      <section className="filter-section">
        <h3 className="filter-title">Calificación</h3>
        <div className="rating-container">
          <button className="rating-btn">
            <div className="stars">
              {ratings.map((star) => (
                <span key={star} className="star">★</span>
              ))}
            </div>
            <span className="rating-text">4+ & más</span>
          </button>
        </div>
      </section>

      {/* Available Now Toggle */}
      <section className="filter-section">
        <h3 className="filter-title">Disponible Ahora</h3>
        <label className="toggle-label">
          <input type="checkbox" className="toggle-input" />
          <span className="toggle-switch"></span>
        </label>
      </section>

      {/* Apply Button */}
      <button className="apply-btn">Aplicar Filtros</button>
    </aside>
  );
};

export default FilterSidebar;
