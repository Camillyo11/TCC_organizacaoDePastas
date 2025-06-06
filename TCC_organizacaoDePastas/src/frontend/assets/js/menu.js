// src/frontend/assets/js/menu.js
import ApiService from './APIConfig.js';

async function loadMenu() {
  try {
    const [pizzas, drinks] = await Promise.all([
      ApiService.request('/menu/pizzas'),
      ApiService.request('/menu/bebidas')
    ]);

    renderMenuSection('pizzas-container', pizzas);
    renderMenuSection('drinks-container', drinks);
  } catch (error) {
    console.error('Erro ao carregar cardápio:', error);
    // Mostrar mensagem de erro para o usuário
  }
}

function renderMenuSection(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="menu-item">
      <img src="${item.imagem_url || 'images/default-food.png'}" alt="${item.nome}">
      <h3>${item.nome}</h3>
      <p>${item.descricao || ''}</p>
      <span class="price">R$ ${item.preco.toFixed(2)}</span>
      <button class="btn-add-to-cart" data-id="${item.id}" data-type="${containerId.includes('pizza') ? 'pizza' : 'drink'}">
        Adicionar
      </button>
    </div>
  `).join('');

  // Adiciona eventos aos botões
  container.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', addToCart);
  });
}

function addToCart(e) {
  const productId = e.target.dataset.id;
  const productType = e.target.dataset.type;
  
  // Implemente sua lógica de carrinho aqui
  console.log(`Adicionado ${productType} ID ${productId} ao carrinho`);
}

// Carrega o cardápio quando a página é carregada
document.addEventListener('DOMContentLoaded', loadMenu);