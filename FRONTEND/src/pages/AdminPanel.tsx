import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = ({ products, isMaintenance, setIsMaintenance }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const [salesPage, setSalesPage] = useState(1);
  const salesPerPage = 10;

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [sales, setSales] = useState<any[]>([]);
  
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: 'AL_FUEGO', 
    secondary_category: '',
    on_sale: false,
    discount_percentage: 0,
    new_until_days: 7 
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<FileList | null>(null);

  const categoriasDisponibles = [
    'AL_FUEGO', 
    'BURGUERS', 
    'PIZZAS', 
    'EMPANADAS', 
    'POSTRES', 
    'BEBIDAS'
  ];

  const fetchSales = async () => {
    try {
      const res = await axios.get(${import.meta.env.VITE_API_URL}/api/sales/);
      setSales(res.data || []);
    } catch (e) {
      console.error("Error cargando ventas", e);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);
  
  const prepareEdit = (p: any) => {
    setIsEditing(true);
    setEditingId(p.id);
    setProductData({
      name: p.name,
      price: p.price,
      stock: p.stock || 0,
      description: p.description || '',
      category: p.category ? p.category.toUpperCase() : 'AL_FUEGO',
      secondary_category: p.secondary_category || '',
      on_sale: p.on_sale || false,
      discount_percentage: p.discount_percentage || 0,
      new_until_days: p.new_until_days || 7
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setProductData({ 
      name: '', price: '', stock: '', description: '', 
      category: 'AL_FUEGO', secondary_category: '', 
      on_sale: false, discount_percentage: 0, new_until_days: 7 
    });
    setMainImage(null);
    setGalleryImages(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    
    formData.append('name', productData.name);
    formData.append('price', String(productData.price));
    formData.append('stock', String(productData.stock));
    formData.append('description', productData.description);
    formData.append('category', productData.category);
    formData.append('on_sale', String(productData.on_sale));
    formData.append('discount_percentage', String(productData.discount_percentage));

    if (mainImage) {
      formData.append('image', mainImage);
    }

    try {
      const url = isEditing && editingId 
        ? `https://lacocinadelcapitan.onrender.com/api/platos/${editingId}/` 
        : 'https://lacocinadelcapitan.onrender.com/api/platos/';

      if (isEditing) {
        await axios.put(url, formData);
      } else {
        await axios.post(url, formData);
      }
      
      alert("¡OPERACIÓN EXITOSA!");
      window.location.href = '/admin'; 
    } catch (error: any) {
      console.error("DETALLE DEL ERROR:", error.response?.data);
      alert("Error al guardar. Revisa los datos ingresados.");
    }
  };

 const toggleMaintenance = async () => {
  const nuevoEstado = !isMaintenance;
  try {
    // Enviamos el cambio al servidor
    await axios.post(`https://lacocinadelcapitan.onrender.com/api/settings/maintenance/`, { 
      value: nuevoEstado 
    });
    // Actualizamos el estado global en React
    setIsMaintenance(nuevoEstado); 
    alert(nuevoEstado ? "MODO VACACIONES ACTIVADO" : "COCINA ABIERTA");
  } catch (e) {
    console.error(e);
    alert("Error al conectar con el servidor de ajustes");
  }
};

  const handleDelete = async (id: number) => {
    if (window.confirm("¿QUITAR ESTE PLATO DE LA CARTA?")) {
      try {
        await axios.delete(`https://lacocinadelcapitan.onrender.com/api/platos/${id}/`);
        window.location.reload();
      } catch (error) {
        alert("ERROR AL ELIMINAR");
      }
    }
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const sortedProducts = [...safeProducts].sort((a: any, b: any) => b.id - a.id);
  const filteredProducts = sortedProducts.filter((p: any) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toString() === searchTerm
  );
  
  const currentProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage);

  const currentSales = sales.slice((salesPage - 1) * salesPerPage, salesPage * salesPerPage);
  const totalSalesPages = Math.ceil(sales.length / salesPerPage);

  const inputStyle = {
    padding: '12px',
    border: '1px solid #444',
    borderRadius: '8px',
    background: '#1A1A1A',
    color: '#FFF',
    fontFamily: 'serif'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: '900',
    color: '#FFCC80',
    letterSpacing: '1px'
  };

  return (
    <div className="admin-container" style={{ backgroundColor: '#121212', paddingTop: '140px', paddingBottom: '80px', minHeight: '100vh', color: '#FFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* BUSCADOR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '3px solid #8D0606', paddingBottom: '20px' }}>
          <h2 style={{ fontFamily: 'Playfair Display', fontSize: '2.2rem', color: '#FFCC80', margin: 0 }}>PANEL DEL CAPITÁN</h2>
          <input 
            type="text" 
            placeholder="BUSCAR EN LA CARTA..." 
            style={{ ...inputStyle, width: '300px' }}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
          />
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} style={{ background: '#2A2A2A', color: '#FFF', padding: '40px', marginBottom: '60px', borderRadius: '15px', border: '1px solid #444', display: 'grid', gap: '25px', gridTemplateColumns: '1fr 1fr', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
          <h3 style={{ gridColumn: 'span 2', fontFamily: 'Playfair Display', borderBottom: '2px solid #8D0606', paddingBottom: '10px', color: '#FFCC80', fontSize: '1.8rem', textAlign: 'center', margin: 0 }}>
            {isEditing ? `📝 MODIFICANDO: ${productData.name}` : '🔥 AÑADIR NUEVO PLATO'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={labelStyle}>NOMBRE DEL PLATO</label>
            <input type="text" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} style={inputStyle} required />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={labelStyle}>CATEGORÍA DE COCINA</label>
            <select value={productData.category} onChange={e => setProductData({...productData, category: e.target.value})} style={inputStyle}>
              {categoriasDisponibles.map(cat => <option key={cat} value={cat}>{cat.replace('_', ' ')}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={labelStyle}>PRECIO AL PÚBLICO ($)</label>
            <input type="number" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} style={inputStyle} required />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={labelStyle}>STOCK (PORCIONES)</label>
            <input type="number" value={productData.stock} onChange={e => setProductData({...productData, stock: e.target.value})} style={inputStyle} required />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={labelStyle}>ETIQUETA (EJ: RECOMENDADO)</label>
            <input type="text" value={productData.secondary_category} onChange={e => setProductData({...productData, secondary_category: e.target.value.toUpperCase()})} style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={labelStyle}>DÍAS COMO "NUEVO"</label>
            <select value={productData.new_until_days} onChange={e => setProductData({...productData, new_until_days: parseInt(e.target.value)})} style={inputStyle}>
              {[1, 3, 7, 15, 30].map(d => <option key={d} value={d}>{d} DÍAS</option>)}
            </select>
          </div>

          <div style={{ gridColumn: 'span 2', background: 'rgba(255, 204, 128, 0.05)', padding: '20px', borderRadius: '10px', border: '1px dashed #555', display: 'flex', alignItems: 'center', gap: '30px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold', color: '#FFCC80' }}>
              <input type="checkbox" checked={productData.on_sale} onChange={e => setProductData({...productData, on_sale: e.target.checked})} /> ¿ES UNA OFERTA?
            </label>
            {productData.on_sale && (
              <input type="number" placeholder="% DESC" value={productData.discount_percentage} onChange={e => setProductData({...productData, discount_percentage: parseInt(e.target.value)})} style={{ ...inputStyle, width: '150px' }} />
            )}
          </div>

          <textarea placeholder="INGREDIENTES O DESCRIPCIÓN..." style={{ ...inputStyle, gridColumn: 'span 2', minHeight: '80px' }} value={productData.description} onChange={e => setProductData({...productData, description: e.target.value})} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={labelStyle}>FOTO PRINCIPAL</label>
            <input type="file" onChange={e => setMainImage(e.target.files![0])} style={{ color: '#aaa', fontSize: '12px' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={labelStyle}>GALERÍA</label>
            <input type="file" multiple onChange={e => setGalleryImages(e.target.files)} style={{ color: '#aaa', fontSize: '12px' }} />
          </div>
          
          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button type="submit" style={{ flex: 2, background: '#8D0606', color: 'white', padding: '18px', border: 'none', borderRadius: '50px', fontFamily: 'Playfair Display', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
              {isEditing ? 'GUARDAR CAMBIOS' : 'AÑADIR A LA CARTA'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleCancelEdit} style={{ flex: 1, background: 'transparent', border: '2px solid #555', color: '#AAA', padding: '15px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
                CANCELAR
              </button>
            )}
          </div>
        </form>

        {/* LISTADO DE PRODUCTOS */}
        <div style={{ background: '#2A2A2A', padding: '30px', borderRadius: '15px', border: '1px solid #444', overflowX: 'auto' }}>
          <h3 style={{ fontFamily: 'Playfair Display', color: '#FFCC80', borderBottom: '1px solid #444', paddingBottom: '10px' }}>GESTIÓN DE STOCK</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#EEE' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #444' }}>
                <th style={{ padding: '15px' }}>ID</th>
                <th>FOTO</th>
                <th>PLATO</th>
                <th>CATEGORÍA</th>
                <th>STOCK</th>
                <th>PRECIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((p: any) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '15px', color: '#FFCC80', fontWeight: 'bold' }}>#{p.id}</td>
                  <td>
                    {p.image ? (
                      <img src={p.image.startsWith('http') ? p.image : `https://lacocinadelcapitan.onrender.com${p.image}`} width="50" height="50" style={{ objectFit: 'cover', borderRadius: '5px', border: '1px solid #444' }} alt={p.name} />
                    ) : (
                      <div style={{ width: 50, height: 50, background: '#1A1A1A', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#555' }}>SIN FOTO</div>
                    )}
                  </td>
                  <td style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{p.name}</td>
                  <td style={{ fontSize: '12px', color: '#AAA' }}>{p.category}</td>
                  <td style={{ fontWeight: 'bold', color: p.stock <= 3 ? '#FF5252' : '#4CAF50' }}>{p.stock}</td>
                  <td style={{ fontWeight: 'bold' }}>${Number(p.price).toLocaleString()}</td>
                  <td>
                    <button onClick={() => prepareEdit(p)} style={{ marginRight: '10px', cursor: 'pointer', background: '#444', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px' }}>EDITAR</button>
                    <button onClick={() => handleDelete(p.id)} style={{ cursor: 'pointer', background: '#8D0606', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px' }}>BORRAR</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center' }}>
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={{ background: 'none', border: '1px solid #444', color: '#FFCC80', padding: '5px 15px', cursor: 'pointer' }}>Anterior</button>
            <span style={{ fontWeight: 'bold', color: '#FFCC80' }}> {currentPage} / {totalProductPages || 1} </span>
            <button disabled={currentPage === totalProductPages} onClick={() => setCurrentPage(currentPage + 1)} style={{ background: 'none', border: '1px solid #444', color: '#FFCC80', padding: '5px 15px', cursor: 'pointer' }}>Siguiente</button>
          </div>
        </div>

        {/* HISTORIAL DE VENTAS */}
        <div style={{ marginTop: '80px' }}>
          <h2 style={{ fontFamily: 'Playfair Display', color: '#FFCC80', borderBottom: '3px solid #8D0606', paddingBottom: '10px' }}>COMANDAS FINALIZADAS</h2>
          <div style={{ background: '#2A2A2A', padding: '20px', borderRadius: '15px', border: '1px solid #444', marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '2px solid #8D0606' }}>
                  <th style={{ padding: '12px' }}>FECHA/HORA</th>
                  <th>ID TRANSACCIÓN</th>
                  <th>DETALLE DEL PEDIDO</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {currentSales.length > 0 ? currentSales.map((sale: any) => (
                  <tr key={sale.id} style={{ borderBottom: '1px solid #333' }}>
                    <td style={{ padding: '12px' }}>{new Date(sale.fecha || sale.creado_en).toLocaleString()}</td>
                    <td>#{sale.id}</td>
                    <td style={{ fontSize: '12px' }}>
                      {typeof sale.productos === 'string' ? sale.productos : 
                       sale.productos?.map((p: any) => `${p.qty}x ${p.name}`).join(', ')}
                    </td>
                    <td style={{ fontWeight: 'bold', color: '#FFCC80' }}>${Number(sale.total).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>No hay comandas registradas</td></tr>
                )}
              </tbody>
            </table>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center' }}>
              <button disabled={salesPage === 1} onClick={() => setSalesPage(salesPage - 1)} style={{ background: '#444', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>Anterior</button>
              <span style={{ color: '#FFCC80' }}>Página {salesPage} de {totalSalesPages || 1}</span>
              <button disabled={salesPage === totalSalesPages} onClick={() => setSalesPage(salesPage + 1)} style={{ background: '#444', color: 'white', border: 'none', padding: '5px 15px', cursor: 'pointer' }}>Siguiente</button>
            </div>
          </div>
        </div>

        {/* MANTENIMIENTO */}
        <div style={{ marginTop: '60px', padding: '40px', borderRadius: '20px', border: `4px solid ${isMaintenance ? '#FFCC80' : '#2E7D32'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isMaintenance ? '#8D0606' : '#1b4d21', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
          <div style={{ color: 'white' }}>
            <h4 style={{ margin: 0, fontFamily: 'Playfair Display', fontSize: '1.5rem' }}>ESTADO DE LA COCINA: {isMaintenance ? '⚠️ CERRADO' : '✅ ABIERTO'}</h4>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
              {isMaintenance ? 'Los clientes no pueden realizar pedidos en este momento.' : 'La tienda está recibiendo pedidos con normalidad.'}
            </p>
          </div>
          <button onClick={toggleMaintenance} style={{ padding: '15px 30px', background: 'white', color: isMaintenance ? '#8D0606' : '#1b4d21', border: 'none', borderRadius: '50px', fontWeight: '900', cursor: 'pointer', fontFamily: 'serif', letterSpacing: '1px', boxShadow: '0 5px 10px rgba(0,0,0,0.2)' }}>
            {isMaintenance ? 'ABRIR PERSIANA' : 'CERRAR POR VACACIONES'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminPanel;