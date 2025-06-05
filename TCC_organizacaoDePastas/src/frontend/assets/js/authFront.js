// auth.js

import { cadastrarUsuario, loginUsuario } from './helpers/apiService.js';
import { validarCPF, validarDataNascimento } from './helpers/formValidations.js';

// Função para cadastro de usuário
export function handleCadastroSubmit(e) {
  e.preventDefault();

  const form = e.target;

  const nome = form.nome.value.trim();
  const dataNascimento = form.data_nascimento.value;
  const cpf = form.CPF.value.trim();
  const telefone = form.telefone.value.trim();
  const email = form.email.value.trim();
  const senha = form.senha.value;
  const confirmarSenha = form.confirmar_senha.value;

  if (senha !== confirmarSenha) {
    Swal.fire('Erro', 'As senhas não coincidem!', 'error');
    return;
  }

  if (!validarDataNascimento(dataNascimento)) {
    Swal.fire('Erro', 'Você deve ter pelo menos 18 anos!', 'error');
    return;
  }

  if (!validarCPF(cpf)) {
    Swal.fire('Erro', 'CPF inválido!', 'error');
    return;
  }

  const usuario = {
    nome,
   dataNascimento,  // mudar a chave para corresponder ao backend
    cpf,
    telefone,
    email,
    senha
  };

  cadastrarUsuario(usuario)
    .then(response => {
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Cadastro realizado com sucesso!',
          text: 'Você já pode fazer login.',
          confirmButtonText: 'OK'
        }).then(() => {
          // Redireciona para página inicial após sucesso no cadastro (ou pode trocar pra login)
          window.location.href = '../UserPages/index.html';
        });
      } else {
        Swal.fire('Erro', response.message || 'Erro ao cadastrar usuário.', 'error');
      }
    })
    .catch(() => {
      Swal.fire('Erro', 'Erro ao cadastrar usuário.', 'error');
    });
}

// Função para login de usuário
export function handleLoginSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const email = form.email.value.trim();
  const senha = form.senha.value;

  if (senha.length < 6) {
    Swal.fire('Erro', 'A senha deve ter pelo menos 6 caracteres', 'error');
    return;
  }

  loginUsuario(email, senha)
    .then(response => {
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Login realizado com sucesso!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          // Fecha o modal de login
          const modalElement = document.getElementById('exampleModal');
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) modalInstance.hide();

          // Limpa o formulário e mensagens
          form.reset();
          const alertDiv = document.getElementById('loginAlert');
          if (alertDiv) {
            alertDiv.classList.add('d-none');
            alertDiv.textContent = '';
          }

          // Aqui você pode adicionar código para atualizar a UI, ex: mostrar nome do usuário
        });
      } else {
        // Exibe mensagem de erro dentro do modal
        const alertDiv = document.getElementById('loginAlert');
        if (alertDiv) {
          alertDiv.classList.remove('d-none');
          alertDiv.textContent = response.message || 'Email ou senha incorretos';
        } else {
          Swal.fire('Erro', response.message || 'Email ou senha incorretos', 'error');
        }
      }
    })
    .catch(() => {
      Swal.fire('Erro', 'Erro ao conectar com o servidor', 'error');
    });
}

// Adiciona os event listeners após o carregamento da página
document.addEventListener('DOMContentLoaded', () => {
  const formCadastro = document.getElementById('formCadastro');
  if (formCadastro) {
    formCadastro.addEventListener('submit', handleCadastroSubmit);
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }
});
