import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../ExplorarPage.css'; 

const ExplorarPage = ({ products, addToCart, cart, isMaintenance, loading }: any) => {
  const location = useLocation(); 
  const [category, setCategory] = useState('TODOS');
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryFromUrl = queryParams.get('categoria') || 'TODOS';
    setCategory(categoryFromUrl.toUpperCase());
    setPage(1);
  }, [location.search]);

  // Lógica de filtrado
  let baseProducts = products ? [...products].reverse() : [];
  let filtered = baseProducts.filter((p: any) => {
    const productCat = p.category ? p.category.toUpperCase() : "";
    if (category === 'TODOS') return true;
    if (category === 'OFERTAS') return p.on_sale === true;
    return productCat === category;
  });
  
  const displayProducts = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="explore-outer-wrapper" style={{ 
      backgroundColor: '#1A1A1A', 
      minHeight: '100vh', 
      padding: '140px 20px 60px', 
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div className="main-red-container" style={{ 
        backgroundColor: '#8D0606', 
        maxWidth: '1300px',
        width: '100%',
        borderRadius: '20px', 
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        border: '4px solid #A01A1A', 
        display: 'grid',
        gridTemplateColumns: '250px 1fr', 
        gap: '40px',
        height: 'fit-content'
      }}>
        
        {/* COLUMNA IZQUIERDA: FILTROS */}
        <aside className="filters-sidebar">
          <div className="filter-group">
            <label className="sidebar-title" style={{ color: '#FFCC80', borderColor: '#B71C1C', fontSize: '1.1rem' }}>LA CARTA</label>
            <div className="filter-buttons-container mobile-grid-filters">
              {[
                { id: 'TODOS', label: 'TODOS' },
                { id: 'OFERTAS', label: 'OFERTAS' },
                { id: 'AL_FUEGO', label: '🔥 AL FUEGO' },
                { id: 'BURGUERS', label: 'BURGUERS' },
                { id: 'PIZZAS', label: 'PIZZAS' },
                { id: 'EMPANADAS', label: 'EMPANADAS' },
                { id: 'POSTRES', label: 'POSTRES' },
                { id: 'BEBIDAS', label: 'BEBIDAS' }
              ].map(cat => (
                <button 
                  key={cat.id} 
                  className={category === cat.id ? 'active' : ''} 
                  onClick={() => { setCategory(cat.id); setPage(1); }}
                  style={{ 
                      color: category === cat.id ? '#FFCC80' : '#E57373',
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: category === cat.id ? 'bold' : 'normal',
                      fontSize: '15px',
                      padding: '12px 0',
                      textShadow: category === cat.id ? '0 0 10px rgba(255,204,128,0.5)' : 'none',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* COLUMNA DERECHA: GRILLA Y PAGINACIÓN */}
        <div className="products-section">
          <div className="items-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
            {loading ? (
               <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: '#FFCC80' }}>
                  <p style={{ fontFamily: 'Playfair Display', fontStyle: 'italic', fontSize: '1.5rem' }}>AVIVANDO LAS BRASAS...</p>
               </div>
            ) : displayProducts.length > 0 ? (
              <>
                {displayProducts.map((p: any) => {
                  // Cálculo de precio con descuento
                  const basePrice = Number(p.price) || 0;
                  const discount = Number(p.discount_percentage) || 0;
                  const finalPrice = p.on_sale ? basePrice - (basePrice * discount / 100) : basePrice;
                  const sinStockReal = Number(p.stock) <= 0;

                  return (
                    <div key={p.id} className="product-card-gentleman" style={{ 
                      backgroundColor: '#FFF8E1', 
                      borderRadius: '15px', 
                      overflow: 'hidden', 
                      boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                      position: 'relative'
                    }}>
                      {/* Badge de Oferta flotante */}
                      {p.on_sale && (
                        <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#B71C1C', color: 'white', padding: '5px 10px', borderRadius: '5px', fontWeight: 'bold', fontSize: '12px', zIndex: 2 }}>
                          {p.discount_percentage}% OFF
                        </div>
                      )}

                      <Link to={`/producto/${p.id}`} className="image-wrapper" style={{ display: 'block', height: '220px', overflow: 'hidden' }}>
                        <img 
                          src={p.image?.startsWith('http') ? p.image : `https://lacocinadelcapitan.onrender.com${p.image}`} 
                          alt={p.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Link>

                      <div className="product-info" style={{ textAlign: 'center', padding: '20px' }}>
                        <span style={{ color: '#D84315', fontSize: '10px', letterSpacing: '2px', fontWeight: '900' }}>{p.category}</span>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', margin: '8px 0', color: '#3E2723' }}>{p.name}</h3>
                        
                        {/* SECCIÓN DE PRECIOS CORREGIDA */}
                        <div style={{ marginBottom: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                          {p.on_sale ? (
                            <>
                              <span style={{ textDecoration: 'line-through', color: '#9E9E9E', fontSize: '0.9rem' }}>
                                ${basePrice.toLocaleString()}
                              </span>
                              <span style={{ fontWeight: '900', color: '#B71C1C', fontSize: '1.7rem' }}>
                                ${finalPrice.toLocaleString()}
                              </span>
                            </>
                          ) : (
                            <span style={{ fontWeight: '900', color: '#B71C1C', fontSize: '1.7rem' }}>
                              ${basePrice.toLocaleString()}
                            </span>
                          )}
                        </div>

                        <button 
                          className="add-btn" 
                          onClick={() => addToCart(p)}
                          disabled={sinStockReal || isMaintenance} 
                          style={{
                            background: '#D84315', color: 'white', borderRadius: '30px', width: '100%', padding: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer'
                          }}
                        >
                          {isMaintenance ? 'PAUSADO' : sinStockReal ? 'AGOTADO' : '¡PEDIR AHORA!'}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* --- SECCIÓN DE PAGINACIÓN --- */}
                {totalPages > 1 && (
                  <div className="pagination" style={{ 
                    gridColumn: '1/-1', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '20px', 
                    marginTop: '40px',
                    paddingTop: '20px',
                    borderTop: '1px solid rgba(255,204,128,0.2)'
                  }}>
                    <button 
                      disabled={page === 1} 
                      onClick={() => setPage(page - 1)}
                      style={{ 
                        backgroundColor: page === 1 ? 'transparent' : '#1A1A1A',
                        color: page === 1 ? '#666' : '#FFCC80',
                        border: '1px solid #FFCC80',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: page === 1 ? 'not-allowed' : 'pointer',
                        fontFamily: 'Playfair Display'
                      }}
                    >
                      ANTERIOR
                    </button>
                    <span style={{ color: '#FFCC80', fontFamily: 'serif' }}>{page} / {totalPages}</span>
                    <button 
                      disabled={page === totalPages} 
                      onClick={() => setPage(page + 1)}
                      style={{ 
                        backgroundColor: page === totalPages ? 'transparent' : '#1A1A1A',
                        color: page === totalPages ? '#666' : '#FFCC80',
                        border: '1px solid #FFCC80',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: page === totalPages ? 'not-allowed' : 'pointer',
                        fontFamily: 'Playfair Display'
                      }}
                    >
                      SIGUIENTE
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#FFCC80' }}>
                <h2>PRONTO MÁS DELICIAS...</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorarPage;