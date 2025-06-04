async function registerUser() {
  const senha = document.getElementById('senha').value;
  const repetirSenha = document.getElementById('confirmar_senha').value;

  const cpf = document.getElementById('cpf').value;
    if (!validarCPF(cpf)) {
      alert('Por favor, insira um CPF válido');
      return false;
    };

  if (senha !== repetirSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  if (senha.length < 8) {
    alert("A senha deve ter no mínimo 8 caracteres.");
    return;
  }

  const userData = {
    nome: document.getElementById('nome').value,
    cpf: document.getElementById('cpf').value,
    email: document.getElementById('email').value,
    senha: document.getElementById('senha').value,
    telefone: document.getElementById('telefone').value,
    data_nascimento: document.getElementById('data_nascimento').value
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    console.log(result);
    if (result.error) {
      // Mostra detalhes do erro no console e no alert
      console.error(result.error.details);
      alert(
        (result.error.message || 'Erro') +
        '\n' +
        (result.error.details ? result.error.details.join('\n') : '')
      );
    } else {
      alert(result.message);
      window.location.href = 'index.html';
    }
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    alert('Erro ao registrar usuário.');
  }
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;
  return true;
}