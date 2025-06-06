// Atualiza o botão da conta para abrir o perfil
function updateAccountButton() {
  const btn = document.getElementById('accountButton');
  if (btn) {
    btn.innerHTML = '<img src="../img/do-utilizador (3).png" height="25" width="25"> Minha Conta';
    btn.setAttribute('data-bs-toggle', 'offcanvas');
    btn.setAttribute('data-bs-target', '#meusDadosOffcanvas');
  }
}

if (localStorage.getItem('token')) {
  updateAccountButton();
  buscarDadosUsuario();
}

// Preenche o perfil com os dados do usuário
function preencherPerfil(user) {
  document.getElementById('dadoNome').textContent = user.nome || '';
  document.getElementById('dadoNascimento').textContent = user.data_nascimento
    ? new Date(user.data_nascimento).toLocaleDateString()
    : '';
  document.getElementById('dadoCpf').textContent = user.cpf || '';
  document.getElementById('dadoTelefone').textContent = user.telefone || '';
  document.getElementById('dadoEmail').textContent = user.email || '';

  window.dadosUsuario = user;
}

// Busca os dados do usuário autenticado
function buscarDadosUsuario() {
  const token = localStorage.getItem('token');
  if (!token) return;

  fetch('http://localhost:3000/api/users/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar dados do usuário');
      return res.json();
    })
    .then(user => {
      console.log('Resposta da API /api/users/me:', user);
      preencherPerfil(user);

      // Mostra os dados e oculta mensagem de não cadastrado
      const dados = document.getElementById('dadosUsuarioContent');
      const msg = document.getElementById('semCadastroMsg');
      if (dados && msg) {
        dados.style.display = 'block';
        msg.style.display = 'none';
      }
    })
    .catch(err => {
      console.error('Erro ao buscar dados do usuário:', err);
    });
}

// Ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('token')) {
    updateAccountButton();
    buscarDadosUsuario();
  }

  const editarBtn = document.getElementById('btnEditarDados');
  if (editarBtn) {
    editarBtn.addEventListener('click', function () {
      document.getElementById('formEditarDados').style.display = 'block';
      document.getElementById('dadosUsuarioContent').style.display = 'none';
      document.getElementById('editarNome').value = window.dadosUsuario.nome || '';
    });
  }

  const cancelEdit = document.querySelector('#formEditarDados button[type="button"]');
  if (cancelEdit) {
    cancelEdit.addEventListener('click', function () {
      document.getElementById('formEditarDados').style.display = 'none';
      document.getElementById('dadosUsuarioContent').style.display = 'block';
    });
  }

  const editForm = document.getElementById('formEditarDados');
  if (editForm) {
    editForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nome = document.getElementById('editarNome').value.trim() || window.dadosUsuario.nome;
      const ddd = document.getElementById('editarDDD').value.trim();
      const telefoneNumero = document.getElementById('editarTelefone').value.trim();
      const telefone = ddd && telefoneNumero ? `${ddd}${telefoneNumero}` : window.dadosUsuario.telefone;

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Usuário não autenticado.');
        return;
      }

      fetch('http://localhost:3000/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome, telefone })
      })
        .then(res => {
          if (!res.ok) throw new Error('Erro ao atualizar dados');
          return res.json();
        })
        .then(data => {
          alert('Dados atualizados com sucesso!');
          document.getElementById('formEditarDados').style.display = 'none';
          document.getElementById('dadosUsuarioContent').style.display = 'block';
          preencherPerfil(data);
        })
        .catch(() => alert('Erro ao atualizar dados.'));
    });
  }
});

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const senha = document.getElementById('loginSenha').value;

    fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    })
      .then(res => {
        if (!res.ok) throw new Error('Erro no login');
        return res.json();
      })
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('isLoggedIn', 'true');
          alert("Login realizado com sucesso!");

          const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
          if (modal) modal.hide();

          updateAccountButton();
          buscarDadosUsuario();

          // Mostra os dados e oculta mensagem de não cadastrado
          const dados = document.getElementById('dadosUsuarioContent');
          const msg = document.getElementById('semCadastroMsg');
          if (dados && msg) {
            dados.style.display = 'block';
            msg.style.display = 'none';
          }

        } else {
          alert("Erro: " + (data.message || 'Login falhou.'));
        }
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao conectar com o servidor.");
      });
  });
}

// Logout
const logoutBtn = document.getElementById('profileLogout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', function () {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    location.reload();
  });
}