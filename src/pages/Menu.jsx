import React, { useState } from 'react';
import { useCart } from '../context/Cartcontext';

const breadItems = [
  { id: 'b1', img: 'images/BrownBread.jpg', cat: 'Rolls', name: 'Brown Breads', desc: 'whole wheat flour, water, yeast, sugar, salt, and a little butter or oil.', price: '$3.50' },
  { id: 'b2', img: 'images/Blueberry Loaf.jpg', cat: 'Loaf', name: 'Blueberry Loaf', desc: 'flour, sugar, butter, eggs, milk, and fresh blueberries', price: '$4.00' },
  { id: 'b3', img: 'images/CheeseBun.jpg', cat: 'Savoury', name: 'CheeseBun', desc: 'flour, yeast, sugar, butter, milk, eggs, and filled or topped with cheese.', price: '$2.50' },
  { id: 'b4', img: 'images/CheeseCake.jpg', cat: 'Cake', name: 'Brioche Loaf', desc: 'cream cheese, sugar, eggs,and a graham cracker crust.', price: '$1.50' },
  { id: 'b5', img: 'images/Cheesy Garlic Toast.jpg', cat: 'Toast', name: 'Cheesy Garlic Toast', desc: 'bread, butter, garlic, cheese, salt, grated Parmesan.', price: '$3.00' },
  { id: 'b6', img: 'images/chocolate chip muffin.jpg', cat: 'Rolls', name: 'chocolate chip muffin', desc: 'flour, sugar, butter, eggs, milk, baking powder, and plenty of chocolate chips.', price: '$2.00' },
  { id: 'b7', img: 'images/CreamCheeseGarlic.jpg', cat: 'Savoury', name: 'CreamCheeseGarlic', desc: 'cream cheese, minced garlic, butter, salt, and herbs.', price: '$2.00' },
  { id: 'b8', img: 'images/CreamyRoll.jpg', cat: 'Savoury', name: 'CreamyRoll', desc: 'flour, yeast, sugar, butter, milk, eggs, and filled with a smooth cream mixture.', price: '$2.50' },
  { id: 'b9', img: 'images/Croissant.jpg', cat: 'Croissant', name: 'Croissant', desc: 'flour, butter, milk, sugar, yeast, and salt, layered and folded .', price: '$2.00' },
  { id: 'b10', img: 'images/egg tart.jpg', cat: 'egg tart', name: 'egg tart', desc: 'cream cheese, sugar, eggs, and a graham cracker crust.', price: '$1.00' },
  { id: 'b11', img: 'images/Salted Croissant Rolls.jpg', cat: 'Rolls', name: 'Salted Croissant Rolls', desc: 'flour, butter, yeast, sugar, milk, eggs, and a sprinkle of salt on top.', price: '$2.00' },
  { id: 'b12', img: 'images/SausagesBread.jpg', cat: 'Bread', name: 'SausagesBread', desc: 'flour, yeast, sugar, butter, milk, eggs, and sausages.', price: '$1.50' },
  { id: 'b13', img: 'images/SoftMilkBun.jpg', cat: 'Bun', name: 'SoftMilkBun', desc: 'flour, milk, sugar, butter, yeast, and eggs.', price: '$3.50' },
  { id: 'b14', img: 'images/VelVetCookie.jpg', cat: 'Cake', name: 'VelVetCookie', desc: 'flour, cocoa powder, butter, sugar, eggs, red food coloring.', price: '$1.25' },
  { id: 'b15', img: 'images/WhiteBread.jpg', cat: 'Cookie', name: 'WhiteBread', desc: 'flour, water, yeast, sugar, salt, and a little butter or oil.', price: '$2.00' },
  { id: 'b16', img: 'images/Bagutte.jpg', cat: 'Baguette', name: 'Bagutte', desc: 'flour, cold water, yeast, sugar,butter and salt .', price: '$1.00' },
  { id: 'b17', img: 'images/PizzaRoll.jpg', cat: 'Pizza Roll', name: 'Pizza Roll', desc: 'Roll dough with tomato sauce, cheese, and toppings.', price: '$1.75' },
  { id: 'b18', img: 'images/CreamDonut.jpg', cat: 'CreamDonut', name: 'CreamDonut', desc: 'Fry yeast dough, fill with cream, and dust with sugar.', price: '$1.50' },
  { id: 'b19', img: 'images/MelonPan.jpg', cat: 'MelonPan', name: 'MelonPan', desc: 'Wrap sweet bread dough with cookie crust and bake.', price: '$1.50' },
  { id: 'b20', img: 'images/Puffy.jpg', cat: 'Puffy', name: 'Puffy', desc: 'Mix flour, yeast, sugar, milk, butter, and bake until fluffy.', price: '$1.00' }
];

const drinkItems = [
  { id: 'd1', img: 'images/IcedAmericano.jpg', cat: 'Coffee', name: 'IcedAmericano', desc: 'Pour espresso over ice, top with cold water, and stir..', price: '$2.50' },
  { id: 'd2', img: 'images/CaramelLatte.jpg', cat: 'Coffee', name: 'CaramelLatte', desc: 'Espresso, steamed milk, and house caramel syrup.', price: '$3.00' },
  { id: 'd3', img: 'images/GreenTea.jpg', cat: 'Tea', name: 'GreenTea', desc: 'Brew green tea, stir in steamed milk, sweeten lightly.', price: '$2.00' },
  { id: 'd4', img: 'images/ChocoLatte.jpg', cat: 'Latte', name: 'ChocoLatte', desc: 'Whisk cocoa with cold milk,choco syrub, add ice.', price: '$2.00' },
  { id: 'd5', img: 'images/MatchaSmoothies.jpg', cat: 'Smoothies', name: 'MatchaSmoothies', desc: 'Ceremonial grade matcha mix with oat milk.', price: '$2.50' },
  { id: 'd6', img: 'images/LemonTea.jpg', cat: 'Tea', name: 'LemonTea', desc: 'Steep black tea, add lemon juice, sweeten, and serve hot or iced.', price: '$1.50' },
  { id: 'd7', img: 'images/PassionFruitSoda.jpg', cat: 'Soda', name: 'PassionFruitSoda', desc: 'Mix passion fruit juice with soda water over ice.', price: '$2.00' },
  { id: 'd8', img: 'images/StrawBerrySoda.jpg', cat: 'Soda', name: 'StrawBerrySoda', desc: 'Mix strawberry puree with soda water, serve cold.', price: '$2.50' },
  { id: 'd9', img: 'images/PeachTea.jpg', cat: 'Tea', name: 'PeachTea', desc: 'Steep black tea, add peach syrup, pour over ice. .', price: '$2.00' },
  { id: 'd10', img: 'images/MangoSmoothies.jpg', cat: 'Smoothie', name: 'MangoSmoothies', desc: 'Blend mango, milk, ice cubes until creamy.', price: '$2.50' },
  { id: 'd11', img: 'images/Iced Cappucino.png', cat: 'Coffee', name: 'Iced Cappucino', desc: 'Shake espresso, milk, ice—frothy chill.', price: '$2.00' },
  { id: 'd12', img: 'images/Iced Latte.png', cat: 'Coffee', name: 'Iced Latte', desc: 'Pour espresso over ice, add milk .', price: '$2.00' },
  { id: 'd13', img: 'images/Mocha Latte.png', cat: 'Coffee', name: 'Mocha Latte', desc: 'Mix espresso, milk, Mocha .', price: '$2.00' },
  { id: 'd14', img: 'images/Matcha latte.png', cat: 'Latte', name: 'Matcha Latte', desc: 'Whisk matcha, milk, ice—green calm.', price: '$2.00' },
  { id: 'd15', img: 'images/Vanilla Frappe.png', cat: 'Frappes', name: 'Vanilla Frappe', desc: 'ice, milk, espresso, vanilla.', price: '$2.00' }
];

export default function Menu() {
  const [activeTab, setActiveTab] = useState('all');
  const { addToCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.img
    });
  };

  const renderCard = (item) => (
    <div key={item.id} className="menu-card">
      <img src={item.img} alt={item.name} />
      <div className="menu-card-body">
        <div className="menu-card-cat">{item.cat}</div>
        <div className="menu-card-name">{item.name}</div>
        <div className="menu-card-desc">{item.desc}</div>
        <div className="menu-card-footer">
          <span className="menu-price">{item.price}</span>
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
  );

  return (
    <>
      <section className="page-hero">
        <div className="eyebrow">What We Offer</div>
        <h1>Our <em>Menu</em></h1>
        <p>Fresh breads and drinks made daily.</p>
        
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
            🍞 Breads
          </button>
          <button 
            onClick={() => setActiveTab('drinks')} 
            className={`btn-outline-light ${activeTab === 'drinks' ? 'active' : ''}`}
          >
            ☕ Drinks
          </button>
        </div>
      </section>

      {/* Breads Section */}
      {(activeTab === 'all' || activeTab === 'breads') && (
        <>
          <section className="menu-heading">
            <h2>
              <span className="bread-icon">🍞</span>
              Breads
            </h2>
            <p>Freshly baked artisan breads, soft buns, croissants, and pastries made daily.</p>
          </section>

          <div id="tab-breads" className="tab-panel active">
            {breadItems.map(renderCard)}
          </div>
        </>
      )}

      {/* Drinks Section */}
      {(activeTab === 'all' || activeTab === 'drinks') && (
        <>
          <section className="menu-heading">
            <h2>
              <span className="coffee-icon">☕</span>
              Drinks
            </h2>
            <p>Fresh coffee, tea, smoothies, and refreshing beverages.</p>
          </section>

          <div id="tab-drinks" className="tab-panel active">
            {drinkItems.map(renderCard)}
          </div>
        </>
      )}
    </>
  );
}