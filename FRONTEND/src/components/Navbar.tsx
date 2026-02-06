import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setShowNavMenu, showNavMenu, menuRef, cartCount, onSearch, searchTerm }: any) => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('gentleman-user');
  let user = null;

  if (userJson && userJson !== "undefined") {
    try { 
      user = JSON.parse(userJson); 
    } catch (e) { 
      console.error("Error parseando usuario:", e); 
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('gentleman-user');
    navigate('/');
    window.location.reload();
  };

  // Función mejorada: busca cualquier valor que contenga un '@' en el objeto
  const getDisplayName = () => {
    if (!user) return "INVITADO";

    try {
      // 1. Buscamos en las propiedades comunes
      const directEmail = user.email || user.username || user.user || "";
      
      // 2. Si lo de arriba falló, buscamos en TODO el objeto cualquier string con '@'
      let foundEmail = directEmail;
      if (!foundEmail || !foundEmail.includes('@')) {
        const values = Object.values(user);
        const autoDetected = values.find(v => typeof v === 'string' && v.includes('@'));
        if (autoDetected) foundEmail = autoDetected as string;
      }

      // 3. Si encontramos el email, cortamos antes del @
      if (foundEmail && typeof foundEmail === 'string' && foundEmail.includes('@')) {
        return foundEmail.split('@')[0].toUpperCase();
      }

      // 4. Si no hay email con @, buscamos un nombre
      const name = user.first_name || user.name || user.display_name;
      if (name) return name.toUpperCase();

    } catch (err) {
      return "USUARIO";
    }

    return "CAPITÁN";
  };

  return (
    <nav className="top-nav" style={{ 
      backgroundColor: '#1A1A1A', 
      borderBottom: '3px solid #8B0000', 
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000
    }}>
      <div className="nav-container" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '12px 20px' 
      }}>
        
        {/* IZQUIERDA: LOGO Y MENÚ */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ 
              fontFamily: 'Playfair Display, serif', 
              fontSize: '1.3rem', 
              color: '#F4F1ED', 
              fontWeight: 'bold', 
              margin: 0,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}>
              LA COCINA DEL <span style={{ color: '#8B0000' }}>CAPITÁN</span>
            </h1>
          </Link>
          
          <div className="nav-dropdown-wrapper" ref={menuRef} style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNavMenu(!showNavMenu)}
              style={{ 
                backgroundColor: '#8B0000', 
                color: '#FFFFFF', 
                fontFamily: 'serif', 
                padding: '8px 18px', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '11px', 
                fontWeight: 'bold',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: '0.3s'
              }}
            >
              CARTA ▾
            </button>

            {showNavMenu && (
              <div style={{ 
                position: 'absolute', top: '115%', left: 0, 
                backgroundColor: '#1A1A1A', 
                border: '1px solid #8B0000', 
                minWidth: '240px', 
                boxShadow: '0 10px 40px rgba(0,0,0,0.6)', 
                zIndex: 1100,
                borderRadius: '4px'
              }}>
                <Link to="/explorar?categoria=OFERTAS" className="menu-item" style={menuItemStyle} onClick={() => setShowNavMenu(false)}>🔥 OFERTAS</Link>
                <Link to="/explorar?categoria=AL_FUEGO" className="menu-item" style={menuItemStyle} onClick={() => setShowNavMenu(false)}>🔥 AL FUEGO</Link>
                <Link to="/explorar?categoria=BURGUERS" className="menu-item" style={menuItemStyle} onClick={() => setShowNavMenu(false)}>🍔 BURGERS</Link>
                <Link to="/explorar?categoria=PIZZAS" className="menu-item" style={menuItemStyle} onClick={() => setShowNavMenu(false)}>🍕 PIZZAS</Link>
                <Link to="/explorar?categoria=EMPANADAS" className="menu-item" style={menuItemStyle} onClick={() => setShowNavMenu(false)}>🥟 EMPANADAS</Link>
                <Link to="/explorar?categoria=POSTRES" className="menu-item" style={menuItemStyle} onClick={() => setShowNavMenu(false)}>🍰 POSTRES</Link>
                <Link to="/explorar?categoria=BEBIDAS" className="menu-item" style={{...menuItemStyle, borderBottom: 'none'}} onClick={() => setShowNavMenu(false)}>🍷 BEBIDAS</Link>
                <div style={{ height: '1px', background: '#333' }}></div>
                <Link to="/explorar?categoria=TODOS" style={{...menuItemStyle, color: '#FFAB40', textAlign: 'center', fontWeight: 'bold'}} onClick={() => setShowNavMenu(false)}>VER TODO EL MENÚ</Link>
              </div>
            )}
          </div> 
        </div>

        {/* CENTRO: BUSCADOR */}
        <div style={{ flex: '0 0 250px', margin: '0 20px' }}>
          <input 
            type="text" 
            placeholder="Buscar sabor..." 
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px 15px', 
              backgroundColor: '#2D2D2D', 
              border: '1px solid #444', 
              borderRadius: '25px', 
              fontSize: '12px',
              color: '#F4F1ED',
              outline: 'none'
            }}
          />
        </div>

        {/* DERECHA: ICONOS Y LOGIN */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flex: 1, justifyContent: 'flex-end' }}>
          
          {user && (
            <div style={{ 
              color: '#F4F1ED', 
              fontSize: '11px', 
              fontFamily: 'Playfair Display, serif',
              textAlign: 'right',
              marginRight: '5px',
              letterSpacing: '1px'
            }}>
              HOLA, <span style={{ color: '#FFAB40', fontWeight: 'bold' }}>{getDisplayName()}</span>
            </div>
          )}

          {user && (
            <Link to="/admin" style={{ 
              color: '#FFAB40', 
              fontWeight: 'bold', 
              textDecoration: 'none', 
              fontSize: '11px',
              paddingRight: '10px'
            }}>
              PANEL
            </Link>
          )}

          <Link to="/checkout" style={{ color: '#F4F1ED', position: 'relative', display: 'flex' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <path d="M3 6h18M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span style={{ 
              position: 'absolute', top: '-7px', right: '-9px', 
              backgroundColor: '#8B0000', color: 'white', 
              borderRadius: '50%', padding: '1px 6px', fontSize: '10px', fontWeight: 'bold' 
            }}>{cartCount}</span>
          </Link>

          {user ? (
            <button onClick={handleLogout} style={{ 
              background: 'transparent', border: '1px solid #F4F1ED', 
              color: '#F4F1ED', padding: '5px 12px', cursor: 'pointer', 
              fontSize: '10px', fontWeight: 'bold', borderRadius: '4px'
            }}>SALIR</button>
          ) : (
            <Link to="/auth?mode=login" style={{ 
              color: '#F4F1ED', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold' 
            }}>INGRESAR</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const menuItemStyle = {
  display: 'block',
  padding: '12px 20px',
  color: '#F4F1ED', 
  textDecoration: 'none',
  fontFamily: 'serif',
  fontSize: '13px',
  borderBottom: '1px solid #2D2D2D',
  transition: 'background 0.3s'
};

export default Navbar;