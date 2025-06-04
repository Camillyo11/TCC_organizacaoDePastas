// src/frontend/assets/js/produtos.js
import { api } from './helpers/api.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const cardapio = await api.getCardapio();
    renderizarCardapio(cardapio);
  } catch (error) {
    mostrarErro('Falha ao carregar cardápio');
  }
});

function renderizarCardapio(produtos) {
  const container = document.getElementById('cardapio-container');
  container.innerHTML = produtos.map(produto => `
    <div class="produto-card">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <span>R$ ${produto.preco.toFixed(2)}</span>
      <button class="btn-adicionar" data-id="${produto.id}">Adicionar</button>
    </div>
  `).join('');
}