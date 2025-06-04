// Verificação de carregamento duplicado
if (window.navbarLoaded) {
  console.warn('Navbar já foi carregado anteriormente');
  throw new Error('Script navbar.js já carregado');
}
window.navbarLoaded = true;

/* === CONSTANTES GLOBAIS === */

function getAssetPath(relativePath) {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `/TCC_organizacaoDePastas/src/frontend/${relativePath}`;
  }
  return `/${relativePath}`;
}

const IMG_PATHS = {
  user: '../public/icons/conta.png',
  fast: '../public/icons/rapido.png',
  map:  '../public/icons/fixar-mapa (1).png',
  pen:  '../public/icons/caneta-do-usuario.png',
  exit: '../public/icons/deixar.png'
};

/* === GERENCIAMENTO DE OFFCANVAS/MODAL === */


function setupOffcanvasTransitions() {
  document.querySelectorAll('[data-bs-toggle="offcanvas"]').forEach(element => {
    element.addEventListener('click', function() {
      const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModalSegundo'));
      if (modal) modal.hide();
      
      const offcanvasEl = document.getElementById('edicaoEnderecoOffcanvas');
      if (offcanvasEl) {
        const offcanvas = new bootstrap.Offcanvas(offcanvasEl);
        offcanvas.show();
      }
    });
  });
}


/* === GERENCIAMENTO DE LOGIN === */


function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email')?.value;
    const senha = document.getElementById('senha')?.value;
    
    if (email && senha) {
      handleSuccessfulLogin();
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  });
}

function handleSuccessfulLogin() {
  try {
    // 1. Armazena o estado de login
    localStorage.setItem('isLoggedIn', 'true');
    
    // 2. Fecha o modal de login
    const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
    if (modal) modal.hide();
    
    // 3. Atualiza a interface IMEDIATAMENTE
    updateAccountButton();
    
    console.log('Login realizado com sucesso!');
  } catch (error) {
    console.error('Erro durante o login:', error);
  }
}


/* === GERENCIAMENTO DE PERFIL === */


function updateAccountButton() {
  try {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const accountBtn = document.getElementById('accountButton');
    
    if (!accountBtn) {
      console.warn('Botão de conta não encontrado!');
      return;
    }
    
    if (isLoggedIn) {
      // Modo logado
      accountBtn.innerHTML = `<img src="${IMG_PATHS.user}" height="25" width="25"> Meu Perfil`;
      accountBtn.removeAttribute('data-bs-toggle');
      accountBtn.removeAttribute('data-bs-target');
      accountBtn.href = "#";
      accountBtn.onclick = function(e) {
        e.preventDefault();
        showProfileOffcanvas();
      };
    } else {
      // Modo não logado
      accountBtn.innerHTML = `<img src="${IMG_PATHS.user}" height="25" width="25"> Conta`;
      accountBtn.setAttribute('data-bs-toggle', 'modal');
      accountBtn.setAttribute('data-bs-target', '#exampleModal');
      accountBtn.onclick = null;
    }
  } catch (error) {
    console.error('Erro ao atualizar botão de conta:', error);
  }
}

function showProfileOffcanvas() {
  try {
    // Remove offcanvas existente se houver
    const existingOffcanvas = document.getElementById('profileOffcanvas');
    if (existingOffcanvas) existingOffcanvas.remove();

    const offcanvasHTML = `
    <div class="offcanvas-perfil offcanvas offcanvas-end" data-bs-backdrop="static" tabindex="-1" id="profileOffcanvas">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title">MEU PERFIL</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas"></button>
      </div>
      <div class="offcanvas-body">
        <div class="text-center">
          <img src="${IMG_PATHS.user}" width="100" class="rounded-circle mb-3">
          <h6>Bem-vindo de volta!</h6>
        </div>
        <div class="buttons-perfil mt-4">
          <button class="button-laranja-perfil mb-2" id="historicoPedidosBtn">
            <img src="${IMG_PATHS.fast}" width="25">Histórico de Pedidos
          </button>
          <button class="button-branco-perfil mb-2" id="enderecosBtn">
            <img src="${IMG_PATHS.map}" width="25">Endereços Salvos
          </button>
          <button class="button-laranja-perfil mb-2" id="minhasInfoBtn">
            <img src="${IMG_PATHS.pen}" width="25">Minhas informações
          </button>
        </div>
        
        <h5 class="section-title">Programa de Fidelidade</h5>
        <div class="card card-fidelidade mb-3">
          <div class="card-body">
            <h5 class="card-title"><i class="fas fa-award me-2"></i> Pontos acumulados: </h5>
            <p class="card-text">Próxima recompensa:</p>
            <div class="progress mb-3">
              <div class="progress-bar bg-danger" role="progressbar" style="width: 75%" aria-valuenow="75" aria-valuemin="0" aria-valuemax="200"></div>
            </div>
            <small class="text-muted">Você está a 50 pontos da próxima recompensa!</small>
          </div>
        </div>

        <div class="position-button-sair">
          <h6>Desconectar da conta</h6>
          <button class="button-sair" id="profileLogout">
            <img src="${IMG_PATHS.exit}" width="25">Sair
          </button>
        </div>
      </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', offcanvasHTML);
    const profileOffcanvas = new bootstrap.Offcanvas(document.getElementById('profileOffcanvas'));
    profileOffcanvas.show();
    
    setupProfileOffcanvasEvents(profileOffcanvas);
  } catch (error) {
    console.error('Erro ao mostrar perfil:', error);
  }
}

function setupProfileOffcanvasEvents(profileOffcanvas) {
  // Histórico de Pedidos
  document.getElementById('historicoPedidosBtn')?.addEventListener('click', () => {
    profileOffcanvas.hide();
    const pedidosOffcanvas = document.getElementById('pedidosOffcanvas');
    if (pedidosOffcanvas) new bootstrap.Offcanvas(pedidosOffcanvas).show();
  });
  
  // Endereços Salvos
  document.getElementById('enderecosBtn')?.addEventListener('click', () => {
    profileOffcanvas.hide();
    const enderecosModal = document.getElementById('exampleModalSegundo');
    if (enderecosModal) new bootstrap.Modal(enderecosModal).show();
  });
  
  // Minhas Informações (ADICIONE ESTA PARTE)

document.getElementById('minhasInfoBtn')?.addEventListener('click', () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const semCadastroMsg = document.getElementById('semCadastroMsg');
  const dadosUsuarioContent = document.getElementById('dadosUsuarioContent');

  if (!usuario) {
    if (semCadastroMsg && dadosUsuarioContent) {
      semCadastroMsg.style.display = 'block';
      dadosUsuarioContent.style.display = 'none';
    }
  } else {
    if (semCadastroMsg && dadosUsuarioContent) {
      semCadastroMsg.style.display = 'none';
      dadosUsuarioContent.style.display = 'block';
    }
    atualizarExibicaoDados();
  }

  const profileOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('profileOffcanvas'));
  if (profileOffcanvas) profileOffcanvas.hide();
// Exemplo de como criar e destruir um Offcanvas corretamente:
const offcanvasElement = document.getElementById('meusDadosOffcanvas');
if (offcanvasElement) {
  const offcanvasInstance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement);
  offcanvasInstance.dispose(); // Aqui sim é uma função válida
}

});
  // Logout
  document.getElementById('profileLogout')?.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('isLoggedIn');
      profileOffcanvas.hide();
      updateAccountButton();
    }
  });
}


/* === GERENCIAMENTO DE ENDEREÇOS === */


function setupAddressButtons() {
  try {
    const addressButtons = document.querySelectorAll('.btn-address-type');
    const customNameContainer = document.getElementById('custom-address-name-container');
    const customNameInput = document.getElementById('custom-address-name');
    
    addressButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove seleção de todos os botões
        addressButtons.forEach(btn => {
          btn.classList.remove('active');
          const radio = btn.querySelector('input[type="radio"]');
          if (radio) radio.removeAttribute('checked');
        });
        
        // Seleciona o botão clicado
        this.classList.add('active');
        const radio = this.querySelector('input[type="radio"]');
        if (radio) radio.setAttribute('checked', 'checked');
        
        // Mostra/oculta campo de nome personalizado
        if (customNameContainer) {
          customNameContainer.style.display = this.dataset.addressType === 'outros' ? 'block' : 'none';
        }
        if (customNameInput) {
          customNameInput.required = this.dataset.addressType === 'outros';
        }
      });
    });
    
    if (customNameInput) {
      customNameInput.addEventListener('change', function() {
        if (this.value.trim() !== '') {
          const outroRadio = document.querySelector('[data-address-type="outros"] input[type="radio"]');
          if (outroRadio) outroRadio.value = this.value;
        }
      });
    }
  } catch (error) {
    console.error('Erro ao configurar botões de endereço:', error);
  }
}


/* === INICIALIZAÇÃO === */


// No seu navbar.js, modifique a inicialização:
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se Bootstrap está disponível
    if (typeof bootstrap === 'undefined') {
        console.error('Bootstrap não está carregado!');
        return;
    }

    // Adicione um delay para garantir que o header foi carregado
    setTimeout(() => {
        setupOffcanvasTransitions();
        setupLoginForm();
        setupAddressButtons();
        updateAccountButton();
        
        // Novo: Verifica existência de elementos antes de adicionar listeners
        if (document.getElementById('btnEditarDados')) {
            document.getElementById('btnEditarDados').addEventListener('click', function() {
                document.getElementById('formEditarDados').style.display = 'block';
                this.style.display = 'none';
            });
        }
    }, 300); // Pequeno delay para garantir carregamento


// ======================================Funções de formatação (NOVAS)==========================================

function formatarCPF(cpf) {
  if (!cpf) return 'Não informado';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatarTelefone(telefone) {
  if (!telefone) return 'Não informado';
  return telefone.replace(/(\d{5})(\d{4})/, '$1-$2');
}

// Atualização dos dados do usuário (NOVO)
function atualizarExibicaoDados() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  if (usuario) {
    document.getElementById('dadoNome').textContent = usuario.nome || 'Não informado';
    document.getElementById('dadoTelefone').textContent = 
      (usuario.ddd && usuario.telefone) ? `(${usuario.ddd}) ${formatarTelefone(usuario.telefone)}` : 'Não informado';
    document.getElementById('dadoNascimento').textContent = usuario.nascimento || 'Não informado';
    document.getElementById('dadoCpf').textContent = formatarCPF(usuario.cpf);
    document.getElementById('dadoEmail').textContent = usuario.email || 'Não informado';
    document.getElementById('emailAtual').value = usuario.email || '';
  }
}

// Edição de informações (NOVO)
document.getElementById('btnEditarDados')?.addEventListener('click', function() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));

  document.getElementById('editarNome').value = usuario.nome || '';
  document.getElementById('editarDDD').value = usuario.ddd || '';
  document.getElementById('editarTelefone').value = usuario.telefone || '';

  document.getElementById('formEditarDados').style.display = 'block';
  this.style.display = 'none';
});

document.getElementById('formEditarDados')?.addEventListener('submit', function(e) {
  e.preventDefault();

  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};
  usuario.nome = document.getElementById('editarNome').value;
  usuario.ddd = document.getElementById('editarDDD').value;
  usuario.telefone = document.getElementById('editarTelefone').value;

  localStorage.setItem('usuario', JSON.stringify(usuario));

  atualizarExibicaoDados();
  cancelarEdicao();

  alert('Dados atualizados com sucesso!');
});

function cancelarEdicao() {
  document.getElementById('formEditarDados').style.display = 'none';
  document.getElementById('btnEditarDados').style.display = 'block';
}

// Botão "Minhas Informações" com lógica de verificação (ATUALIZADO)
document.getElementById('minhasInfoBtn')?.addEventListener('click', function() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const semCadastroMsg = document.getElementById('semCadastroMsg');
  const dadosUsuarioContent = document.getElementById('dadosUsuarioContent');

  if (!usuario) {
    if (semCadastroMsg && dadosUsuarioContent) {
      semCadastroMsg.style.display = 'block';
      dadosUsuarioContent.style.display = 'none';
    }

    const profileOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('profileOffcanvas'));
    if (profileOffcanvas) profileOffcanvas.hide();

    const meusDadosOffcanvas = new bootstrap.Offcanvas(document.getElementById('meusDadosOffcanvas'));
    meusDadosOffcanvas.show();
    return;
  }

  if (semCadastroMsg && dadosUsuarioContent) {
    semCadastroMsg.style.display = 'none';
    dadosUsuarioContent.style.display = 'block';
  }

  atualizarExibicaoDados();

  const profileOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('profileOffcanvas'));
  if (profileOffcanvas) profileOffcanvas.hide();

  const meusDadosOffcanvas = new bootstrap.Offcanvas(document.getElementById('meusDadosOffcanvas'));
  meusDadosOffcanvas.show();
});

// Botão para abrir offcanvas de cadastro de endereço (NOVO)
document.querySelector('#cadastroEnderecoOffcanvas button.button-black')?.addEventListener('click', function() {
  const enderecosModal = bootstrap.Modal.getInstance(document.getElementById('exampleModalSegundo'));
  if (enderecosModal) enderecosModal.hide();

  const cadastroOffcanvas = new bootstrap.Offcanvas(document.getElementById('cadastroEnderecoOffcanvas'));
  cadastroOffcanvas.show();
});

// Remove o offcanvas de perfil ao ser fechado (MANTIDO + VERIFICADO)
document.getElementById('profileOffcanvas')?.addEventListener('hidden.bs.offcanvas', function() {
  this.remove();
});

//====================================================================================================================

});

// Formulário de edição
document.getElementById('btnEditarDados')?.addEventListener('click', function() {
  document.getElementById('formEditarDados').style.display = 'block';
  this.style.display = 'none';
});

document.getElementById('formEditarDados')?.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Aqui você adicionaria a lógica para salvar os dados
  alert('Dados salvos com sucesso!');
  
  // Atualiza a exibição
  document.getElementById('dadoNome').textContent = document.getElementById('editarNome').value;
  document.getElementById('dadoTelefone').textContent = 
    `(${document.getElementById('editarDDD').value}) ${document.getElementById('editarTelefone').value}`;
  
  // Esconde o formulário
  document.getElementById('formEditarDados').style.display = 'none';
  document.getElementById('btnEditarDados').style.display = 'block';
});

function cancelarEdicao() {
  document.getElementById('formEditarDados').style.display = 'none';
  document.getElementById('btnEditarDados').style.display = 'block';
}
console.log('Elemento meusDadosOffcanvas existe:', document.getElementById('meusDadosOffcanvas') !== null);
console.log('Bootstrap está carregado:', typeof bootstrap !== 'undefined');
console.log('Usuário logado:', localStorage.getItem('isLoggedIn')); 