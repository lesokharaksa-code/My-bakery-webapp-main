import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Customer Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNote, setOrderNote] = useState('');

  const cartContext = useCart() || {};
  const { 
    cartItems = [], 
    isOpen = false, 
    setIsOpen = () => {}, 
    setCartItems = () => {} 
  } = cartContext;

  if (!isOpen) return null;

  const updateQuantity = (id, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.id === id) {
            const newQty = (item.quantity || 1) + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => {
        const numericPrice = typeof item.price === 'number'
          ? item.price
          : parseFloat(item.price?.toString().replace(/[^0-9.]/g, '')) || 0;
        return sum + numericPrice * (item.quantity || 1);
      }, 0)
      .toFixed(2);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'orders'), {
        customer: {
          name: customerName,
          phone: customerPhone,
          note: orderNote || 'None',
        },
        items: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        totalPrice: calculateTotal(),
        status: 'Pending',
        createdAt: serverTimestamp(),
      });

      setOrderSuccess(true);
      setCartItems([]);
      setCustomerName('');
      setCustomerPhone('');
      setOrderNote('');
      
      setTimeout(() => {
        setOrderSuccess(false);
        setIsOpen(false);
      }, 2500);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '360px',
        height: '100vh',
        backgroundColor: '#fff',
        boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#3b2a1a' }}>Your Cart</h2>
        <button
          type="button"
          onClick={() => {
            setOrderSuccess(false);
            setIsOpen(false);
          }}
          style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
        >
          ✕
        </button>
      </div>

      {orderSuccess ? (
        <div style={{ textAlign: 'center', margin: 'auto 0', padding: '20px' }}>
          <div style={{ fontSize: '3rem' }}>🎉</div>
          <h3 style={{ color: '#2e7d32', marginTop: '10px' }}>Order Placed!</h3>
          <p style={{ color: '#555' }}>Thank you! Your order is being prepared.</p>
        </div>
      ) : (
        <>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#777', marginTop: '40px' }}>Your cart is empty.</p>
          ) : (
            <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              {/* Cart Items List */}
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px', marginBottom: '10px' }}>
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px',
                      borderBottom: '1px solid #eee',
                      paddingBottom: '10px',
                    }}
                  >
                    <img
                      src={item.image || item.img}
                      alt={item.name}
                      style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ color: '#7a4f2e', fontSize: '0.8rem' }}>{item.price}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          style={{ padding: '1px 6px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.85rem' }}>{item.quantity || 1}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          style={{ padding: '1px 6px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Customer Details Form */}
                <div style={{ backgroundColor: '#fdfbf7', padding: '12px', borderRadius: '8px', border: '1px solid #e8e0d5', marginTop: '10px' }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#3b2a1a' }}>Customer Details</h4>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <input
                      type="text"
                      placeholder="Full Name *"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <textarea
                      placeholder="Delivery note / pickup time preference..."
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      rows="2"
                      style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.85rem', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              </div>

              {/* Checkout Footer */}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1rem', marginBottom: '10px' }}>
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: isSubmitting ? '#a3a3a3' : '#d97706',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
}