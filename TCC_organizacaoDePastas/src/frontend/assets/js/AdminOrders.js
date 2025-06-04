// src/frontend/assets/js/adminOrders.js
import ApiService from './APIConfig.js';

async function loadOrders() {
  try {
    const orders = await ApiService.request('/admin/orders', 'GET', null, true);
    renderOrdersTable(orders);
  } catch (error) {
    console.error('Erro ao carregar pedidos:', error);
    document.getElementById('ordersContainer').innerHTML = `
      <p class="error">Erro ao carregar pedidos: ${error.message}</p>
    `;
  }
}

function renderOrdersTable(orders) {
  const tableBody = document.querySelector('#ordersTable tbody');
  tableBody.innerHTML = orders.map(order => `
    <tr data-id="${order.id}">
      <td>#${order.id}</td>
      <td>${new Date(order.data_pedido).toLocaleString()}</td>
      <td>${order.cliente_nome}</td>
      <td>R$ ${order.total.toFixed(2)}</td>
      <td>
        <select class="status-select" data-id="${order.id}">
          <option value="pendente" ${order.status === 'pendente' ? 'selected' : ''}>Pendente</option>
          <option value="em_preparo" ${order.status === 'em_preparo' ? 'selected' : ''}>Em preparo</option>
          <option value="entregue" ${order.status === 'entregue' ? 'selected' : ''}>Entregue</option>
          <option value="cancelado" ${order.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>
      </td>
    </tr>
  `).join('');

  // Adiciona eventos para atualização de status
  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const orderId = e.target.dataset.id;
      const newStatus = e.target.value;
      
      try {
        await ApiService.request(`/admin/orders/${orderId}/status`, 'PUT', { status: newStatus }, true);
        alert('Status atualizado com sucesso!');
      } catch (error) {
        alert(`Erro ao atualizar status: ${error.message}`);
        e.target.value = orders.find(o => o.id == orderId).status; // Reverte a mudança
      }
    });
  });
}

// Carrega os pedidos quando a página é carregada
document.addEventListener('DOMContentLoaded', loadOrders);