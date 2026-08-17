import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../firebase/firebaseConfig';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('products'); 
  const [statusFilter, setStatusFilter] = useState('All'); 
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Bread',
    subCategory: 'cakes',
    image: '',
    description: '',
  });

  
  const fetchData = async () => {
    setLoading(true);
    try {
    
      const productSnap = await getDocs(collection(db, 'products'));
      const productList = productSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setProducts(productList);

     
      const orderSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      const orderList = orderSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(orderList);

      
      const messageSnap = await getDocs(query(collection(db, 'messages'), orderBy('createdAt', 'desc')));
      const messageList = messageSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(messageList);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Form Category Switch
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const defaultSub = selectedCategory === 'Bread' ? 'cakes' : 'coffee';
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      subCategory: defaultSub,
    }));
  };

  // Add / Edit Product Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const priceNumber = parseFloat(formData.price);
      const productPayload = {
        name: formData.name,
        price: isNaN(priceNumber) ? formData.price : priceNumber,
        category: formData.category,
        subCategory: formData.subCategory,
        image: formData.image,
        description: formData.description,
      };

      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), productPayload);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'products'), productPayload);
      }

      setFormData({
        name: '',
        price: '',
        category: 'Bread',
        subCategory: 'cakes',
        image: '',
        description: '',
      });

      fetchData();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    // Smart fallback detection for items missing subCategory
    let subCat = product.subCategory || product.subcategory || product.sub_category;
    if (!subCat) {
      if (product.category === 'Bread') {
        subCat = product.name?.toLowerCase().includes('cake') ? 'cakes' : 'sweet';
      } else {
        subCat = 'coffee';
      }
    }

    setFormData({
      name: product.name || '',
      price: product.price || '',
      category: product.category || 'Bread',
      subCategory: subCat,
      image: product.image || product.img || '',
      description: product.description || product.desc || '',
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product permanently?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchData();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Update Order Approval Status in Firestore
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>
      
      {/* HEADER WITH VIEW TOGGLES & LOGOUT */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'serif', color: '#2B1E16', margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: '#666', margin: '0.2rem 0 0 0' }}>Manage menu products, customer orders & messages</p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveView('products')}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: activeView === 'products' ? '#d97706' : '#f3f4f6',
              color: activeView === 'products' ? '#fff' : '#374151',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            📦 Products ({products.length})
          </button>

          <button
            onClick={() => setActiveView('orders')}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: activeView === 'orders' ? '#d97706' : '#f3f4f6',
              color: activeView === 'orders' ? '#fff' : '#374151',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            📋 Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveView('messages')}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: activeView === 'messages' ? '#d97706' : '#f3f4f6',
              color: activeView === 'messages' ? '#fff' : '#374151',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            💬 Messages ({messages.length})
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#fecaca',
              color: '#dc2626',
              border: '1px solid #f87171',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* PRODUCTS VIEW */}
      {activeView === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
          
          {/* ADD / EDIT FORM */}
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
            <h3 style={{ marginTop: 0, color: '#2B1E16' }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>Product Name</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>Price ($)</label>
                <input type="text" required value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>Category</label>
                <select value={formData.category} onChange={handleCategoryChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="Bread">Bread</option>
                  <option value="Drinks">Drinks</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>Sub-Category</label>
                <select value={formData.subCategory} onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  {formData.category === 'Bread' ? (
                    <>
                      <option value="cakes">🍰 Cakes</option>
                      <option value="sweet">🍯 Sweet</option>
                      <option value="salty">🧀 Salty & Savoury</option>
                    </>
                  ) : (
                    <>
                      <option value="coffee">☕ Coffee</option>
                      <option value="tea-cold">🍵 Tea & Cold Drinks</option>
                      <option value="smoothies">🥤 Smoothies</option>
                    </>
                  )}
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>Image URL</label>
                <input type="text" required placeholder="https://..." value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '0.3rem' }}>Description</label>
                <textarea rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#d97706', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                {editingId ? 'Update Product' : '+ Add Product'}
              </button>
            </form>
          </div>

          {/* PRODUCT LIST */}
          <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
            <h3 style={{ marginTop: 0, color: '#2B1E16' }}>Current Products</h3>
            {loading ? <p>Loading products...</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '600px', overflowY: 'auto' }}>
                {products.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.8rem', border: '1px solid #eee', borderRadius: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={item.image || item.img} alt={item.name} style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <div style={{ fontWeight: 'bold', color: '#2B1E16' }}>{item.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price} | <span style={{ backgroundColor: '#eee', padding: '2px 6px', borderRadius: '4px' }}>{item.category} ({item.subCategory || 'auto'})</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEdit(item)} style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => handleDelete(item.id)} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CUSTOMER ORDERS VIEW */}
      {activeView === 'orders' && (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
          
          {/* FILTER BAR HEADER */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ margin: 0, color: '#2B1E16' }}>Customer Orders</h3>
            
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {['All', 'Approved', 'Completed', 'Rejected'].map((statusOption) => (
                <button
                  key={statusOption}
                  onClick={() => setStatusFilter(statusOption)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    backgroundColor: statusFilter === statusOption ? '#2B1E16' : '#f9fafb',
                    color: statusFilter === statusOption ? '#fff' : '#374151',
                    fontWeight: statusFilter === statusOption ? 'bold' : 'normal',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  {statusOption}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p>Loading orders...</p>
          ) : (
            (() => {
              const filteredOrders = orders.filter((order) => {
                const currentStatus = order.status || 'Approved';
                if (statusFilter === 'All') return true;
                return currentStatus === statusFilter;
              });

              if (filteredOrders.length === 0) {
                return <p style={{ color: '#666' }}>No orders found under the "{statusFilter}" filter.</p>;
              }

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredOrders.map((order) => {
                    const currentStatus = order.status || 'Approved';

                    return (
                      <div key={order.id} style={{ border: '1px solid #e5e7eb', padding: '1.2rem', borderRadius: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem' }}>
                          <div>
                            <strong>Order ID:</strong> #{order.id.slice(0, 8)}<br />
                            <span style={{ fontSize: '0.85rem', color: '#666' }}>Customer: {order.customerEmail || 'Guest'}</span>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 'bold', color: '#d97706', fontSize: '1.1rem', display: 'block' }}>
                              Total: ${(() => {
                                const val = order.totalAmount ?? order.total ?? order.totalPrice ?? order.grandTotal ?? order.amount;
                                
                                if (val !== undefined && val !== null && val !== 0 && val !== '0.00' && val !== '0') {
                                  const parsed = parseFloat(val.toString().replace('$', ''));
                                  if (!isNaN(parsed) && parsed > 0) return parsed.toFixed(2);
                                }

                                if (Array.isArray(order.items) && order.items.length > 0) {
                                  const sum = order.items.reduce((acc, item) => {
                                    const p = parseFloat((item.price || '0').toString().replace('$', ''));
                                    const q = item.quantity || 1;
                                    return acc + (isNaN(p) ? 0 : p * q);
                                  }, 0);
                                  return sum.toFixed(2);
                                }

                                return '0.00';
                              })()}
                            </span>
                            
                            <span
                              style={{
                                display: 'inline-block',
                                marginTop: '0.3rem',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                backgroundColor:
                                  currentStatus === 'Approved' ? '#dcfce7' :
                                  currentStatus === 'Rejected' ? '#fee2e2' :
                                  currentStatus === 'Completed' ? '#dbeafe' : '#dcfce7',
                                color:
                                  currentStatus === 'Approved' ? '#15803d' :
                                  currentStatus === 'Rejected' ? '#b91c1c' :
                                  currentStatus === 'Completed' ? '#1d4ed8' : '#15803d',
                              }}
                            >
                              ● {currentStatus}
                            </span>
                          </div>
                        </div>

                        {/* ORDER ITEMS */}
                        <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                          <strong>Items Ordered:</strong>
                          <ul style={{ margin: '0.4rem 0 0 0', paddingLeft: '1.2rem' }}>
                            {(order.items || []).map((item, idx) => (
                              <li key={idx}>
                                {item.name} x {item.quantity || 1} — {item.price}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* ADMIN ACTION CONTROLS */}
                        <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #eee' }}>
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Approved')}
                            disabled={currentStatus === 'Approved'}
                            style={{
                              backgroundColor: currentStatus === 'Approved' ? '#9ca3af' : '#16a34a',
                              color: '#fff',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              fontSize: '0.8rem',
                              cursor: currentStatus === 'Approved' ? 'not-allowed' : 'pointer',
                            }}
                          >
                            ✓ Approved
                          </button>

                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                            disabled={currentStatus === 'Completed'}
                            style={{
                              backgroundColor: currentStatus === 'Completed' ? '#9ca3af' : '#2563eb',
                              color: '#fff',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              fontSize: '0.8rem',
                              cursor: currentStatus === 'Completed' ? 'not-allowed' : 'pointer',
                            }}
                          >
                            🚚 Mark Completed
                          </button>

                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'Rejected')}
                            disabled={currentStatus === 'Rejected'}
                            style={{
                              backgroundColor: currentStatus === 'Rejected' ? '#9ca3af' : '#dc2626',
                              color: '#fff',
                              border: 'none',
                              padding: '0.4rem 0.8rem',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              fontSize: '0.8rem',
                              cursor: currentStatus === 'Rejected' ? 'not-allowed' : 'pointer',
                            }}
                          >
                            ✕ Reject
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* CUSTOMER MESSAGES VIEW */}
      {activeView === 'messages' && (
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '8px', border: '1px solid #eee' }}>
          <h3 style={{ marginTop: 0, color: '#2B1E16' }}>Customer Contact Messages</h3>
          
          {loading ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <p style={{ color: '#666' }}>No messages found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ border: '1px solid #e5e7eb', padding: '1.2rem', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <strong>Name:</strong> {msg.fname} {msg.lname}<br />
                      <span style={{ fontSize: '0.85rem', color: '#666' }}>Email: {msg.email}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#d97706', display: 'block' }}>
                        Subject: {msg.subject}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#888' }}>
                        {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#333', background: '#f9fafb', padding: '0.8rem', borderRadius: '6px' }}>
                    <strong>Message:</strong>
                    <p style={{ margin: '0.3rem 0 0 0', whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}