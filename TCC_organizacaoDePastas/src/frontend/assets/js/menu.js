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
    <section class="col-md-6 col-lg-4" data-id="${item.id}">
      <div class="card pizza-card h-100">
        <div class="card-body">
          <img src="${item.imagem_url || 'images/default-food.png'}" class="card-img-top" alt="${item.nome}">
          <h5 class="card-title pizza-nome">${item.nome}</h5>
          <p class="card-text">${item.descricao || ''}</p>
          <div class="pizza-preco" data-preco="${item.preco}">
            <p class="pizza-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
            <div class="quantidade">
              <div class="quantidade-itens">
                <button class="btn_retirar btn-outline-secondary btn-sm">-</button>
                <span class="mx-2">0</span>
                <button class="btn_adicionar btn-outline-secondary btn-sm">+</button>
              </div>
            </div>
            <button class="btn-add-to-cart" data-id="${item.id}" data-type="${containerId.includes('pizza') ? 'pizza' : 'drink'}">
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </section>
  `).join('');

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