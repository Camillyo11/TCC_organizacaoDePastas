// ==================== CARREGA ENDEREÇOS ====================
const loadAddresses = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Faça login primeiro!');
        return window.location.href = 'login.html';
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