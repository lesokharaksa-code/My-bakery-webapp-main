import React, { useState, useEffect } from 'react';
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Bread',
    subCategory: 'Cakes',
    image: '',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const productsCollectionRef = collection(db, 'products');

  const fetchProducts = async () => {
    try {
      const data = await getDocs(productsCollectionRef);
      setProducts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products: ', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please fill out the required fields.');
      return;
    }

    try {
      if (editingId) {
        const productDoc = doc(db, 'products', editingId);
        await updateDoc(productDoc, formData);
        setEditingId(null);
      } else {
        await addDoc(productsCollectionRef, formData);
      }
      setFormData({ name: '', price: '', category: 'Bread', subCategory: 'Cakes', image: '', description: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product: ', error);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      category: product.category || 'Bread',
      subCategory: product.subCategory || product.sub_category || '',
      image: product.image || product.img || '',
      description: product.description || ''
    });
  };

  const handleDelete = async (id) => {
    try {
      const productDoc = doc(db, 'products', id);
      await deleteDoc(productDoc);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  };

  // Safe image path resolution for GitHub Pages / local paths vs external URLs
  const resolveImageSource = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
      return imagePath;
    }
    const baseURL = import.meta.env.BASE_URL || '/';
    const formattedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${baseURL}${formattedPath}`;
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading Admin Dashboard...</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Top Header & Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0' }}>Admin Dashboard</h2>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>Manage menu products, customer orders & messages</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('products')}
            style={{ padding: '8px 16px', background: activeTab === 'products' ? '#d97706' : '#f3f4f6', color: activeTab === 'products' ? '#fff' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📦 Products ({products.length})
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            style={{ padding: '8px 16px', background: activeTab === 'orders' ? '#d97706' : '#f3f4f6', color: activeTab === 'orders' ? '#fff' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            📄 Orders (2)
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            style={{ padding: '8px 16px', background: activeTab === 'messages' ? '#d97706' : '#f3f4f6', color: activeTab === 'messages' ? '#fff' : '#333', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            💬 Messages (1)
          </button>
          <button 
            onClick={() => alert('Logout clicked')}
            style={{ padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Logout
          </button>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', marginBottom: '25px' }} />

      {activeTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px' }}>
          {/* Add/Edit Form Section */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', height: 'fit-content' }}>
            <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', background: '#fff' }}
                >
                  <option value="Bread">Bread</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Cakes">Cakes</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Sub-Category</label>
                <select
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box', background: '#fff' }}
                >
                  <option value="Cakes">🎂 Cakes</option>
                  <option value="salty">Bread (salty)</option>
                  <option value="sweet">Bread (sweet)</option>
                  <option value="tea-cold">Drinks (tea-cold)</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Image URL</label>
                <input
                  type="text"
                  name="image"
                  placeholder="https://..."
                  value={formData.image}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, background: '#2563eb', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                  {editingId ? 'Update Product' : 'Add Product'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: '', price: '', category: 'Bread', subCategory: 'Cakes', image: '', description: '' });
                    }}
                    style={{ background: '#6b7280', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Current Products List Section */}
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ marginTop: 0 }}>Current Products</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {products.length === 0 ? (
                <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>No products found.</p>
              ) : (
                products.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', background: '#fafafa' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img
                        src={resolveImageSource(item.image || item.img)}
                        alt={item.name}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ddd' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50?text=No+Img';
                        }}
                      />
                      <div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{item.name}</h4>
                        <span style={{ fontSize: '13px', color: '#555' }}>
                          ${Number(item.price).toFixed(2)} | {item.category} ({item.subCategory || item.sub_category || 'General'})
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3>Customer Orders</h3>
          <p style={{ color: '#666' }}>Order management view placeholder.</p>
        </div>
      )}

      {activeTab === 'messages' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <h3>Customer Messages</h3>
          <p style={{ color: '#666' }}>Messages view placeholder.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;