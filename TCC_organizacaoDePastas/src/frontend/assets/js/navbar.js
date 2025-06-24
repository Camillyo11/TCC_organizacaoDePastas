

// Verificação de carregamento duplicado
if (window.navbarLoaded) {
  console.warn('Navbar já foi carregado anteriormente');
  throw new Error('Script navbar.js já carregado');
}
window.navbarLoaded = true;

const IMG_PATHS = {
  user: '../public/icons/conta.png',
  fast: '../public/icons/rapido.png',
  map: '../public/icons/fixar-mapa (1).png',
  pen: '../public/icons/caneta-do-usuario.png',
  exit: '../public/icons/deixar.png'
};

/* === GERENCIAMENTO DO BOTÃO CONTA/PERFIL === */
function updateAccountButton() {
  const isLoggedIn = localStorage.getItem('token') !== null;
  const accountBtn = document.getElementById('accountButton');

  if (!accountBtn) return;

  if (isLoggedIn) {
    // Usuário logado - mostra "Meu Perfil"
    accountBtn.innerHTML = `<img src="${IMG_PATHS.user}" height="25" width="25"> Meu Perfil`;
    accountBtn.onclick = function(e) {
      e.preventDefault();
      showProfileOffcanvas();
    };
    accountBtn.removeAttribute('data-bs-toggle');
    accountBtn.removeAttribute('data-bs-target');
  } else {
    // Usuário não logado - mostra "Conta"
    accountBtn.innerHTML = `<img src="${IMG_PATHS.user}" height="25" width="25"> Conta`;
    accountBtn.setAttribute('data-bs-toggle', 'modal');
    accountBtn.setAttribute('data-bs-target', '#exampleModal');
    accountBtn.onclick = null;
  }
}

/* === OFFCANVAS DE PERFIL COM OPÇÕES === */
function showProfileOffcanvas() {
  // Remove instâncias antigas (se houver)
  const existing = document.getElementById('profileOffcanvas');
  if (existing) existing.remove();

  // Cria e insere o novo offcanvas
  const offcanvasHTML = `
    <div class="offcanvas-perfil offcanvas offcanvas-end" tabindex="-1" id="profileOffcanvas" aria-labelledby="profileOffcanvasLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="profileOffcanvasLabel">MEU PERFIL</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body">
        <div class="text-center">
          <img src="${IMG_PATHS.user}" width="100" class="rounded-circle mb-3">
          <h6>Bem-vindo de volta!</h6>
        </div>
        <div class="buttons-perfil mt-4">
          <button class="button-laranja-perfil mb-2" id="historicoPedidosBtn">
            <img src="${IMG_PATHS.fast}" width="25"> Histórico de Pedidos
          </button>
          <button class="button-branco-perfil mb-2" id="enderecosBtn">
            <img src="${IMG_PATHS.map}" width="25"> Endereços Salvos
          </button>
          <button class="button-laranja-perfil mb-2" id="minhasInfoBtn">
            <img src="${IMG_PATHS.pen}" width="25"> Minhas informações
          </button>
        </div>
        <button id="profileLogout" class="btn btn-danger mt-4 w-100">
          <img src="${IMG_PATHS.exit}" width="25"> Sair
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', offcanvasHTML);
  const offcanvas = new bootstrap.Offcanvas(document.getElementById('profileOffcanvas'));
  offcanvas.show();

  // Configura eventos
  setupProfileOffcanvasEvents(offcanvas);
}

function setupProfileOffcanvasEvents(offcanvas) {
  // Botão Minhas Informações
  document.getElementById('minhasInfoBtn')?.addEventListener('click', () => {
    offcanvas.hide();
    setTimeout(() => {
      // Mostra o offcanvas de dados do usuário
      const meusDadosOffcanvas = new bootstrap.Offcanvas(document.getElementById('meusDadosOffcanvas'));
      meusDadosOffcanvas.show();
      
      // Se estiver logado, busca os dados
      if (localStorage.getItem('token') && window.buscarDadosUsuario) {
        window.buscarDadosUsuario();
      }
    }, 300);
  });

  // Botão Histórico de Pedidos
  document.getElementById('historicoPedidosBtn')?.addEventListener('click', () => {
    offcanvas.hide();
    setTimeout(() => {
      const pedidosOffcanvas = new bootstrap.Offcanvas(document.getElementById('pedidosOffcanvas'));
      pedidosOffcanvas.show();
    }, 300);
  });

  // Botão Endereços Salvos
  document.getElementById('enderecosBtn')?.addEventListener('click', () => {
    offcanvas.hide();
    setTimeout(() => {
      const modalEndereco = new bootstrap.Modal(document.getElementById('exampleModalSegundo'));
      modalEndereco.show();
    }, 300);
  });

  // Botão Sair
  document.getElementById('profileLogout')?.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('token');
      updateAccountButton();
      location.reload();
    }
  });
}

/* === INICIALIZAÇÃO === */
document.addEventListener('DOMContentLoaded', function() {
  if (typeof bootstrap === 'undefined') {
    console.error('Bootstrap não está carregado!');
    return;
  }

  // Atualiza o botão da conta
  updateAccountButton();

  // Configura o evento de login para atualizar o botão após login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // ... seu código de login existente ...
      
      
      updateAccountButton();
    });
  }
});