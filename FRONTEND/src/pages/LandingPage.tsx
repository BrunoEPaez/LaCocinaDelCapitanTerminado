import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = ({ products, loading, addToCart, cart, isMaintenance }: any) => {
  const [categoryFilter, setCategoryFilter] = useState('TODOS');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const baseProducts = products ? [...products].reverse() : [];

  const filtered = baseProducts.filter((p: any) => {
    const filtro = categoryFilter.toUpperCase();
    if (filtro === 'TODOS') return true;
    if (filtro === 'OFERTAS') return p.on_sale === true;
    
    // Filtro por categoría normal
    return p.category?.toUpperCase() === filtro;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const displayProducts = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="landing-wrapper" style={{ backgroundColor: '#1A1A1A', minHeight: '100vh', padding: '120px 20px 60px' }}>
      
      {/* SECCIÓN DE TÍTULO */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ 
          fontFamily: 'Playfair Display, serif', 
          fontSize: '4.5rem', 
          color: '#F4F1ED', 
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '4px'
        }}>
          LA COCINA DEL <span style={{ color: '#8B0000' }}>CAPITÁN</span>
        </h1>
        <p style={{ color: '#FFCC80', fontSize: '1.2rem', letterSpacing: '3px', marginTop: '10px', textTransform: 'uppercase' }}>
          SABOR A LEÑA Y TRADICIÓN EN CADA PLATO
        </p>
      </div>

      {/* --- FOTO DEL CAPITÁN --- */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '60px' }}>
        <div style={{
          width: '640px', 
          height: '640px',
          borderRadius: '50%',
          border: '10px solid #8D0606',
          boxShadow: '0 15px 50px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          backgroundColor: '#2A2A2A',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img 
            src="https://lacocinadelcapitan.onrender.com/media/imagen/capitan.png"
            alt="Capitán Cocinando" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="main-red-container" style={{ 
          backgroundColor: '#8D0606', 
          maxWidth: '1300px',
          width: '100%',
          borderRadius: '20px', 
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '4px solid #A01A1A',
        }}>
          
          {/* FILTROS */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '20px', 
            marginBottom: '40px',
            borderBottom: '1px solid rgba(255,204,128,0.2)',
            paddingBottom: '20px'
          }}>
            {['TODOS', 'OFERTAS'].map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategoryFilter(cat); setPage(1); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: categoryFilter === cat ? '#FFCC80' : '#E57373',
                  fontFamily: 'Playfair Display',
                  fontSize: '18px',
                  fontWeight: categoryFilter === cat ? 'bold' : 'normal',
                  cursor: 'pointer',
                  textShadow: categoryFilter === cat ? '0 0 10px rgba(255,204,128,0.5)' : 'none',
                  transition: '0.3s'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* GRILLA DE PRODUCTOS */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '30px' 
          }}>
            {loading ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: '#FFCC80' }}>
                <p style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: '1.5rem' }}>AVIVANDO EL FUEGO...</p>
              </div>
            ) : displayProducts.map((p: any) => {
              const basePrice = Number(p.price) || 0;
              const discount = Number(p.discount_percentage) || 0;
              const finalPrice = p.on_sale ? basePrice - (basePrice * discount / 100) : basePrice;

              return (
                <div key={p.id} style={{ 
                  backgroundColor: '#FFF8E1', 
                  borderRadius: '15px', 
                  overflow: 'hidden', 
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                }}>
                  <Link to={`/producto/${p.id}`} style={{ display: 'block', height: '220px', overflow: 'hidden' }}>
                    <img 
                      src={p.image?.startsWith('http') ? p.image : `https://lacocinadelcapitan.onrender.com${p.image}`} 
                      alt={p.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Link>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <span style={{ color: '#D84315', fontSize: '10px', letterSpacing: '2px', fontWeight: '900' }}>{p.category}</span>
                    <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', margin: '8px 0', color: '#3E2723' }}>{p.name}</h3>
                    
                    {/* PRECIOS CON DESCUENTO VISIBLE */}
                    <div style={{ marginBottom: '15px' }}>
                      {p.on_sale && (
                        <span style={{ 
                          textDecoration: 'line-through', 
                          color: '#757575', 
                          marginRight: '10px', 
                          fontSize: '1rem' 
                        }}>
                          ${basePrice.toLocaleString()}
                        </span>
                      )}
                      <span style={{ fontWeight: '900', color: '#B71C1C', fontSize: '1.6rem' }}>
                        ${finalPrice.toLocaleString()}
                      </span>
                    </div>

                    <button 
                      onClick={() => addToCart(p)}
                      disabled={Number(p.stock) <= 0 || isMaintenance} 
                      style={{
                        background: '#D84315', color: 'white', borderRadius: '30px', width: '100%', padding: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer'
                      }}
                    >
                      {isMaintenance ? 'PAUSADO' : Number(p.stock) <= 0 ? 'AGOTADO' : '¡PEDIR AHORA!'}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div style={{ 
                gridColumn: '1/-1', display: 'flex', justifyContent: 'center', alignItems: 'center', 
                gap: '20px', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255,204,128,0.2)' 
              }}>
                <button 
                  disabled={page === 1} 
                  onClick={() => { setPage(page - 1); window.scrollTo(0,0); }}
                  style={{ 
                    backgroundColor: page === 1 ? 'transparent' : '#1A1A1A', color: page === 1 ? '#666' : '#FFCC80',
                    border: '1px solid #FFCC80', padding: '10px 20px', borderRadius: '5px', cursor: page === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  ANTERIOR
                </button>
                <span style={{ color: '#FFCC80' }}>{page} / {totalPages}</span>
                <button 
                  disabled={page >= totalPages} 
                  onClick={() => { setPage(page + 1); window.scrollTo(0,0); }}
                  style={{ 
                    backgroundColor: page >= totalPages ? 'transparent' : '#1A1A1A', color: page >= totalPages ? '#666' : '#FFCC80',
                    border: '1px solid #FFCC80', padding: '10px 20px', borderRadius: '5px', cursor: page >= totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  SIGUIENTE
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;