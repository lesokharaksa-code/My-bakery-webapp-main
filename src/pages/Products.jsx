import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useCart } from '../context/CartContext';

// Dynamically import all images from src/assets/images/
const assetImages = import.meta.glob('../assets/images/**/*', { eager: true, import: 'default' });

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('breads');
  const [breadFilter, setBreadFilter] = useState('all');
  const [drinkFilter, setDrinkFilter] = useState('all');

  const categoryImages = {
    breads: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1400',
    drinks: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1400',
  };

  const cartContext = useCart() || {};
  const { addToCart, addItem } = cartContext;

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
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper function to match image path to src/assets/images/
  const resolveImage = (path) => {
    if (!path) return '';
    // If it's already an external URL (like Unsplash), return as is
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const cleanPath = path.replace(/^\/+/, '').replace(/^images\//, '');
    
    for (const key in assetImages) {
      if (key.includes(cleanPath)) {
        return assetImages[key];
      }
    }
    return path; 
  };

  const handleAddToCart = (product) => {
    const rawPrice = product.price;
    const formattedPrice =
      typeof rawPrice === 'number'
        ? `$${rawPrice.toFixed(2)}`
        : rawPrice?.toString().startsWith('$')
        ? rawPrice
        : `$${rawPrice}`;

    const itemImage = resolveImage(product.image || product.img);

    const itemToAdd = {
      id: product.id,
      name: product.name,
      price: formattedPrice,
      image: itemImage,
      img: itemImage,
    };

    if (typeof addToCart === 'function') {
      addToCart(itemToAdd);
    } else if (typeof addItem === 'function') {
      addItem(itemToAdd);
    }
  };

  const filteredProducts = products.filter((p) => {
    const cat = (p.category || '').toLowerCase();
    const subCat = (p.subCategory || p.subcategory || p.sub_category || '').toLowerCase();
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || p.desc || '').toLowerCase();

    if (activeTab === 'drinks') {
      const isDrink = cat.includes('drink') || ['coffee', 'tea', 'latte', 'smoothie', 'soda', 'frappe', 'matcha', 'espresso', 'juice'].some((type) =>
        cat.includes(type) || name.includes(type)
      );

      if (!isDrink) return false;
      if (drinkFilter === 'all') return true;

      if (subCat) {
        return subCat === drinkFilter.toLowerCase();
      }

      if (drinkFilter === 'coffee') {
        return ['coffee', 'espresso', 'latte', 'cappuccino', 'americano', 'mocha', 'macchiato', 'cold brew', 'brew'].some(
          (type) => cat.includes(type) || name.includes(type) || desc.includes(type)
        );
      }
      
      if (drinkFilter === 'tea-cold') {
        return ['tea', 'matcha', 'chai', 'green tea', 'black tea', 'earl grey', 'herbal', 'iced', 'cold', 'soda', 'juice', 'lemonade'].some(
          (type) => cat.includes(type) || name.includes(type) || desc.includes(type)
        );
      }

      if (drinkFilter === 'smoothies') {
        return ['smoothie', 'shake', 'frappe', 'blended'].some(
          (type) => cat.includes(type) || name.includes(type) || desc.includes(type)
        );
      }

      return false;
    }

    const isBread = [
      'bread', 'breads', 'cake', 'cookie', 'roll', 'loaf', 'toast', 'croissant',
      'savoury', 'bun', 'baguette', 'pizza roll', 'creamdonut', 'melonpan', 'puffy',
    ].some((type) => cat.includes(type));

    if (!isBread) return false;
    if (breadFilter === 'all') return true;

    if (subCat) {
      return subCat === breadFilter.toLowerCase();
    }

    if (breadFilter === 'cakes') {
      return cat.includes('cake') || name.includes('cake');
    }
    if (breadFilter === 'sweet') {
      return ['cookie', 'donut', 'sweet', 'cream', 'chocolate', 'cinnamon', 'melonpan', 'puffy'].some(
        (type) => cat.includes(type) || name.includes(type) || desc.includes(type)
      );
    }
    if (breadFilter === 'salty') {
      return ['savoury', 'pizza', 'garlic', 'cheese', 'salty', 'bacon', 'sausage', 'salt'].some(
        (type) => cat.includes(type) || name.includes(type) || desc.includes(type)
      );
    }

    return false;
  });

  const renderCard = (item) => {
    const rawPrice = item.price;
    const displayPrice =
      typeof rawPrice === 'number'
        ? `$${rawPrice.toFixed(2)}`
        : rawPrice?.toString().startsWith('$')
        ? rawPrice
        : `$${rawPrice}`;

    const resolvedImg = resolveImage(item.image || item.img);

    return (
      <div key={item.id} className="menu-card transition-card">
        <div className="img-container">
          <img src={resolvedImg} alt={item.name} />
        </div>
        <div className="menu-card-body">
          <div className="menu-card-cat">{item.category || item.cat}</div>
          <div className="menu-card-name">{item.name}</div>
          <div className="menu-card-desc">{item.description || item.desc}</div>
          <div className="menu-card-footer">
            <span className="menu-price">{displayPrice}</span>
            <button
              type="button"
              className="add-btn transition-btn"
              onClick={() => handleAddToCart(item)}
            >
              ADD
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .page-hero-container {
          position: relative;
          padding: 5rem 2rem;
          text-align: center;
          color: #FFFFFF;
          overflow: hidden;
          background-color: #2B1E16;
        }
        .hero-bg-layer {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background-size: cover; background-position: center;
          transition: opacity 0.8s ease-in-out; z-index: 1;
        }
        .category-tab-btn {
          background-color: transparent; border: 1px solid rgba(255, 255, 255, 0.4);
          color: #FFFFFF; padding: 0.75rem 1.8rem; border-radius: 4px;
          font-weight: 600; font-size: 0.85rem; letter-spacing: 1px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .category-tab-btn:hover, .category-tab-btn.active {
          background-color: #D97706 !important; border-color: #D97706 !important;
          box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4); transform: translateY(-2px);
        }
        .sub-filter-pill {
          background-color: #F3EFEA; border: 1px solid #E5DFD5; color: #5C4033;
          padding: 0.4rem 1.2rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;
          cursor: pointer; transition: all 0.25s ease;
        }
        .sub-filter-pill:hover { background-color: #E2D9CD; transform: translateY(-1px); }
        .sub-filter-pill.active { background-color: #2B1E16; color: #FFFFFF; border-color: #2B1E16; }
        .transition-card { transition: transform 0.3s ease, box-shadow 0.3s ease; overflow: hidden; }
        .transition-card:hover { transform: translateY(-6px); box-shadow: 0 12px 24px rgba(43, 30, 22, 0.15); }
        .transition-card img { transition: transform 0.4s ease; width: 100%; display: block; }
        .transition-card:hover img { transform: scale(1.06); }
        .transition-btn { cursor: pointer; border: none; transition: all 0.2s ease; }
        .transition-btn:hover { transform: scale(1.05); filter: brightness(1.1); }
      `}</style>

      <section className="page-hero-container">
        <div
          className="hero-bg-layer"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${categoryImages.breads})`,
            opacity: activeTab === 'breads' ? 1 : 0,
          }}
        />
        <div
          className="hero-bg-layer"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${categoryImages.drinks})`,
            opacity: activeTab === 'drinks' ? 1 : 0,
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="eyebrow" style={{ color: '#D97706', letterSpacing: '2px', fontWeight: 'bold' }}>
            WHAT WE OFFER
          </div>
          <h1 style={{ fontSize: '3rem', fontFamily: 'serif', margin: '0.5rem 0' }}>
            Our <em>Products</em>
          </h1>
          <p style={{ opacity: 0.9 }}>Fresh baked goods and handcrafted beverages from our store.</p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <button
              onClick={() => { setActiveTab('breads'); setBreadFilter('all'); }}
              className={`category-tab-btn ${activeTab === 'breads' ? 'active' : ''}`}
            >
              🍞 Breads
            </button>
            <button
              onClick={() => { setActiveTab('drinks'); setDrinkFilter('all'); }}
              className={`category-tab-btn ${activeTab === 'drinks' ? 'active' : ''}`}
            >
              ☕ Drinks
            </button>
          </div>
        </div>
      </section>

      <section className="menu-heading" style={{ textAlign: 'center', padding: '2.5rem 1rem 1rem' }}>
        <h2>{activeTab === 'breads' ? 'Breads Menu' : 'Drinks Menu'}</h2>
        <p style={{ margin: '0.4rem 0 1.5rem' }}>Browse our fresh {activeTab} selection.</p>

        {activeTab === 'breads' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button onClick={() => setBreadFilter('all')} className={`sub-filter-pill ${breadFilter === 'all' ? 'active' : ''}`}>All Breads</button>
            <button onClick={() => setBreadFilter('sweet')} className={`sub-filter-pill ${breadFilter === 'sweet' ? 'active' : ''}`}>🍯 Sweet</button>
            <button onClick={() => setBreadFilter('salty')} className={`sub-filter-pill ${breadFilter === 'salty' ? 'active' : ''}`}>🧀 Salty & Savoury</button>
            <button onClick={() => setBreadFilter('cakes')} className={`sub-filter-pill ${breadFilter === 'cakes' ? 'active' : ''}`}>🍰 Cakes</button>
          </div>
        )}

        {activeTab === 'drinks' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button onClick={() => setDrinkFilter('all')} className={`sub-filter-pill ${drinkFilter === 'all' ? 'active' : ''}`}>All Drinks</button>
            <button onClick={() => setDrinkFilter('coffee')} className={`sub-filter-pill ${drinkFilter === 'coffee' ? 'active' : ''}`}>☕ Coffee</button>
            <button onClick={() => setDrinkFilter('tea-cold')} className={`sub-filter-pill ${drinkFilter === 'tea-cold' ? 'active' : ''}`}>🍵 Tea & Cold Drinks</button>
            <button onClick={() => setDrinkFilter('smoothies')} className={`sub-filter-pill ${drinkFilter === 'smoothies' ? 'active' : ''}`}>🥤 Smoothies</button>
          </div>
        )}
      </section>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#7a4f2e', padding: '2rem' }}>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#7a4f2e', padding: '2rem' }}>No products found matching this filter.</p>
      ) : (
        <div key={`${activeTab}-${breadFilter}-${drinkFilter}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1200px', margin: '2rem auto 5rem', padding: '0 1.5rem' }} className="animated-grid">
          {filteredProducts.map(renderCard)}
        </div>
      )}
    </>
  );
}