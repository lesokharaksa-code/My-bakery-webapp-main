import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productList);
      } catch (error) {
        console.error('Error fetching products from Firestore:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || item.img
    });
  };

  // Filter products based on selected tab
  const filteredProducts = products.filter((product) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'breads') {
      return product.category?.toLowerCase().includes('bread') || 
             product.category?.toLowerCase().includes('roll') || 
             product.category?.toLowerCase().includes('pastry') ||
             product.category?.toLowerCase().includes('cake');
    }
    if (activeTab === 'drinks') {
      return product.category?.toLowerCase().includes('coffee') || 
             product.category?.toLowerCase().includes('tea') || 
             product.category?.toLowerCase().includes('drink') ||
             product.category?.toLowerCase().includes('soda');
    }
    return true;
  });

  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">What We Offer</div>
        <h1>Our <em>Products</em></h1>
        <p>Fresh baked goods and handcrafted beverages made daily.</p>

        {/* Tab Selection Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button 
            onClick={() => setActiveTab('all')} 
            className={`btn-outline-light ${activeTab === 'all' ? 'active' : ''}`}
          >
            All Items
          </button>
          <button 
            onClick={() => setActiveTab('breads')} 
            className={`btn-outline-light ${activeTab === 'breads' ? 'active' : ''}`}
          >
            🍞 Breads & Pastries
          </button>
          <button 
            onClick={() => setActiveTab('drinks')} 
            className={`btn-outline-light ${activeTab === 'drinks' ? 'active' : ''}`}
          >
            ☕ Drinks
          </button>
        </div>
      </section>

      <div className="products-page" style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
        {loading ? (
          <p className="loading-text" style={{ textAlign: 'center' }}>Loading fresh products from database...</p>
        ) : filteredProducts.length === 0 ? (
          <p className="no-products" style={{ textAlign: 'center' }}>No products found for this category.</p>
        ) : (
          <div className="tab-panel active" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {filteredProducts.map((item) => (
              <div key={item.id} className="menu-card">
                <img src={item.image || item.img} alt={item.name} />
                <div className="menu-card-body">
                  <div className="menu-card-cat">{item.category || 'General'}</div>
                  <div className="menu-card-name">{item.name}</div>
                  <div className="menu-card-desc">{item.description || item.desc}</div>
                  <div className="menu-card-footer">
                    <span className="menu-price">${item.price}</span>
                    <button 
                      type="button" 
                      className="add-btn"
                      onClick={() => handleAddToCart(item)}
                      style={{ cursor: 'pointer', border: 'none' }}
                    >
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}