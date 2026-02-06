import { Link, useNavigate } from 'react-router-dom';

const SearchPage = ({ products, searchTerm, addToCart, cart, isMaintenance }: any) => {  
  const navigate = useNavigate();
  
  // 1. Filtrado de resultados + Orden inverso (Nuevos primero)
  const results = products
    ? [...products]
        .reverse()
        .filter((p: any) => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    : [];

  return (
    /* CAMBIO: backgroundColor a #1A1A1A */
    <main className="explore-layout" style={{ backgroundColor: '#1A1A1A', minHeight: '100vh', paddingTop: '140px' }}>
      <div className="content-wrapper" style={{ maxWidth: '1300px', margin: '0 auto', width: '100%', padding: '0 20px' }}>
        
        <header className="search-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ 
                background: 'transparent', 
                border: 'none', 
                fontFamily: 'Inter', 
                fontSize: '12px', 
                letterSpacing: '2px', 
                cursor: 'pointer',
                marginBottom: '20px',
                textDecoration: 'underline',
                /* CAMBIO: color de texto a blanco/crema */
                color: '#FFCC80'
            }}
          >
            VOLVER AL INICIO
          </button>
          
          <h2 style={{ 
            fontFamily: 'Playfair Display', 
            fontSize: '2.5rem', 
            textTransform: 'uppercase', 
            /* CAMBIO: color a crema/dorado */
            color: '#FFCC80',
            letterSpacing: '2px' 
          }}>
            RESULTADOS PARA: "{searchTerm.toUpperCase()}"
          </h2>
          
          <p style={{ 
            fontFamily: 'Inter', 
            fontSize: '14px', 
            /* CAMBIO: color suave para contraste */
            color: '#A0A0A0', 
            marginTop: '10px',
            letterSpacing: '1px'
          }}>
            {results.length} ARTÍCULOS ENCONTRADOS
          </p>
        </header>

        <div className="items-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '40px' 
        }}>
          {results.length > 0 ? (
            results.map((p: any) => {
              const discount = Number(p.discount_percentage) || 0;
              const basePrice = Number(p.price) || 0;
              const finalPrice = p.on_sale 
                ? basePrice - (basePrice * (discount / 100)) 
                : basePrice;
              
              const itemEnCarrito = cart?.find((item: any) => item.id === p.id);
              const sinStockReal = Number(p.stock) <= 0;
              const limiteAlcanzado = itemEnCarrito && itemEnCarrito.quantity >= p.stock;

              return (
                /* CAMBIO OPCIONAL: Puedes añadir un borde suave a la card para separarla del fondo */
                <div key={p.id} className="product-card-gentleman" style={{ border: '1px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                  {/* WRAPPER DE IMAGEN CON ETIQUETA DE OFERTA */}
                  <Link to={`/producto/${p.id}`} className="image-wrapper" style={{ height: '350px', position: 'relative', display: 'block', overflow: 'hidden' }}>
                    <img 
                     src={p.image ? (p.image.startsWith('http') ? p.image : `http://localhost:8000${p.image}`) : 'https://via.placeholder.com/300'} 
                     alt={p.name} 
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    {/* CARTELITO DE OFERTA */}
                    {p.on_sale && (
                      <span style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        right: '10px', 
                        background: '#D84315', /* Color más vibrante para fondo negro */
                        color: 'white', 
                        padding: '5px 12px', 
                        fontSize: '10px', 
                        fontWeight: 'bold', 
                        letterSpacing: '1px',
                        zIndex: 2
                      }}>
                        OFERTA
                      </span>
                    )}
                  </Link>

                  <div className="product-info" style={{ textAlign: 'center', padding: '20px' }}>
                    <span style={{ color: '#D84315', fontSize: '10px', letterSpacing: '2px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {p.category || 'COLECCIÓN'}
                    </span>
                    
                    {/* CAMBIO: Color de título a blanco */}
                    <h3 style={{ fontFamily: 'Playfair Display, serif', textTransform: 'uppercase', letterSpacing: '1px', margin: '10px 0', fontSize: '1.2rem', color: 'white' }}>
                      {p.name}
                    </h3>

                    <div className="price-container-gentleman" style={{ marginBottom: '15px' }}>
                      {p.on_sale ? (
                        <>
                          <span className="old-price" style={{ color: '#666', textDecoration: 'line-through', marginRight: '10px', fontSize: '0.9rem' }}>
                            ${basePrice.toLocaleString()}
                          </span>
                          {/* CAMBIO: Color a crema */}
                          <span className="current-price" style={{ fontWeight: 'bold', color: '#FFCC80', fontSize: '1.2rem' }}>
                            ${finalPrice.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        /* CAMBIO: Color a blanco */
                        <span className="current-price" style={{ fontWeight: 'bold', color: 'white', fontSize: '1.2rem' }}>
                            ${basePrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button 
                      className="add-btn" 
                      onClick={() => !limiteAlcanzado && addToCart(p)}
                      disabled={sinStockReal || limiteAlcanzado || isMaintenance} 
                      style={{
                        /* CAMBIO: Colores del botón para fondo oscuro */
                        background: (sinStockReal || limiteAlcanzado || isMaintenance) ? '#333' : '#FFCC80',
                        color: (sinStockReal || limiteAlcanzado || isMaintenance) ? '#666' : '#1A1A1A',
                        border: 'none',
                        width: '100%',
                        padding: '14px',
                        cursor: (sinStockReal || limiteAlcanzado || isMaintenance) ? 'not-allowed' : 'pointer',
                        fontFamily: 'Playfair Display',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                        fontSize: '11px',
                        transition: 'all 0.3s ease',
                        fontWeight: 'bold'
                      }}
                    >
                      {isMaintenance ? 'PAUSADO' : sinStockReal ? 'AGOTADO' : limiteAlcanzado ? 'EN CARRITO' : 'AÑADIR AL CARRITO'}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', gridColumn: '1/-1', marginTop: '50px' }}>
              {/* CAMBIO: Color blanco para mensaje sin resultados */}
              <h2 style={{ fontFamily: 'Playfair Display', color: 'white', fontSize: '2rem' }}>
                SIN RESULTADOS EN EL CATÁLOGO
              </h2>
              <button 
                onClick={() => navigate('/explorar')}
                style={{
                    marginTop: '20px',
                    padding: '12px 30px',
                    background: '#FFCC80',
                    color: '#1A1A1A',
                    border: 'none',
                    fontFamily: 'Inter',
                    letterSpacing: '2px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
              >
                VER TODA LA COLECCIÓN
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;