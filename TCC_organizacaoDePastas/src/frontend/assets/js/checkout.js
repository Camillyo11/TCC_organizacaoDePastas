// src/frontend/assets/js/checkout.js
import ApiService from './APIConfig.js';

document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = '../UserPages/index.html';
    return;
  }

  const cartItems = JSON.parse(localStorage.getItem('cart') || []);
  if (cartItems.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }

  const orderData = {
    id_cliente: user.id,
    total: calculateTotal(), // Implemente esta função
    metodo_pagamento: document.querySelector('input[name="payment"]:checked').value,
    tipo_entrega: document.getElementById('deliveryType').value,
    observacoes: document.getElementById('orderNotes').value,
    id_endereco: document.getElementById('deliveryAddress').value,
    pizzas: cartItems.filter(item => item.type === 'pizza'),
    bebidas: cartItems.filter(item => item.type === 'drink')
  };

  try {
    const order = await ApiService.request('/orders', 'POST', orderData, true);
    
    localStorage.removeItem('cart');
    alert(`Pedido #${order.id} realizado com sucesso!`);
    window.location.href = `/order-confirmation.html?id=${order.id}`;
  } catch (error) {
    console.error('Erro ao finalizar pedido:', error);
    document.getElementById('orderError').textContent = error.message;
  }
});