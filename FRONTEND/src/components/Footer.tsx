const Footer = () => (
  <footer style={{ 
    backgroundColor: '#1A1A1A', 
    color: '#F4F1ED', 
    padding: '60px 0 20px', 
    marginTop: '80px' 
  }}>
    <div className="footer-content" style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
      <div className="footer-section">
        <h4 style={{ fontFamily: 'Playfair Display', fontSize: '22px', color: '#F4F1ED' }}>
          LA COCINA DEL <span style={{ color: '#8B0000' }}>CAPITÁN</span>
        </h4>
        <p style={{ color: '#A0A0A0', fontSize: '14px' }}>Sabores a leña y tradición de barrio.</p>
      </div>
      <div className="footer-section">
        <label style={{ color: '#8B0000', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>HORARIOS</label>
        <p style={{ fontSize: '14px' }}>Mar - Dom: 11:30 a 15:00 <br/> y 19:30 a 23:30</p>
      </div>
      <div className="footer-section">
        <label style={{ color: '#8B0000', fontWeight: 'bold', display: 'block', marginBottom: '10px' }}>UBICACIÓN</label>
        <p style={{ fontSize: '14px' }}>Calle de los Fuegos 1234, AR</p>
      </div>
    </div>
    <div style={{ textAlign: 'center', marginTop: '40px', borderTop: '1px solid #333', paddingTop: '20px', fontSize: '11px', color: '#666' }}>
      2024 © LA COCINA DEL CAPITÁN - ARTESANOS DEL SABOR
    </div>
  </footer>
);

export default Footer;