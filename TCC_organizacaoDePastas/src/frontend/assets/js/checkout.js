async function carregarEnderecosUsuario() {
  const token = localStorage.getItem('token');
  if (!token) return;

  const response = await fetch('http://localhost:3000/api/users/endereco', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) return;

  const enderecos = await response.json();
  const container = document.getElementById('enderecosUsuario');
  if (!enderecos.length) {
    container.innerHTML = '<span class="text-danger">Nenhum endereço cadastrado.</span>';
    return;
  }
  container.innerHTML = enderecos.map(e => `
    <div class="form-check">
      <input class="form-check-input" type="radio" name="enderecoSelecionado" value="${e.id}" id="endereco${e.id}">
      <label class="form-check-label" for="endereco${e.id}">
        ${e.rua || ''}, ${e.numero || ''} - ${e.bairro || ''}
      </label>
    </div>
  `).join('');
}


async function aplicarCupom() {
  const cupom = document.getElementById('cupom-aplique').value.trim();
  const feedback = document.getElementById('feedback-cupom');
  const subtotalSpan = document.getElementById('subtotal');
  if (!subtotalSpan) {
    feedback.textContent = 'Subtotal não encontrado!';
    feedback.className = 'text-danger';
    return;
  }

  // CORREÇÃO AQUI: Alterada a expressão regular para manter o ponto decimal.
  let subtotalStr = subtotalSpan.textContent.replace(/[^\d.]/g, ''); // Remove tudo que não for dígito ou ponto
  let subtotal = parseFloat(subtotalStr);

  console.log("DEBUG - Subtotal (string original):", subtotalSpan.textContent);
  console.log("DEBUG - Subtotal (após replace):", subtotalStr);
  console.log("DEBUG - Subtotal (parseFloat):", subtotal);


  if (isNaN(subtotal) || subtotal <= 0) {
    feedback.textContent = 'Subtotal inválido!';
    feedback.className = 'text-danger';
    return;
  }

  if (!cupom) {
    feedback.textContent = 'Digite um cupom!';
    feedback.className = 'text-danger';
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/api/cupons/validar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        codigo: cupom,
        valorCompra: subtotal
      })
    });
    const resultado = await response.json();

    console.log("DEBUG - Resposta da API de cupom:", resultado);


    if (response.ok && resultado.valido) {
      const percentual = parseFloat(resultado.percentual);
      
      console.log("DEBUG - Percentual do cupom (parseFloat):", percentual);
      console.log("DEBUG - Calculando desconto: subtotal * (percentual / 100) = ", subtotal, " * (", percentual, " / 100)");
      
      const descontoCalculado = subtotal * (percentual / 100);
      
      console.log("DEBUG - Desconto calculado:", descontoCalculado);


      // Salva no localStorage para uso correto
      localStorage.setItem("descontoCupom", descontoCalculado.toString());

      feedback.textContent = `Cupom aplicado! Desconto de ${percentual}% (R$ ${descontoCalculado.toFixed(2).replace('.', ',')})`;
      feedback.className = 'text-success';

      // Chama a função renderizarCarrinho de carrinho.html para re-renderizar o carrinho
      if (typeof window.renderizarCarrinho === 'function') {
        window.renderizarCarrinho();
      } else if (typeof renderizarCarrinho === 'function') {
        renderizarCarrinho();
      }
    } else {
      localStorage.removeItem("descontoCupom"); // Limpa o desconto se inválido
      feedback.textContent = resultado.mensagem || 'Cupom inválido!';
      feedback.className = 'text-danger';
      // Re-renderiza para remover qualquer exibição de desconto antiga
      if (typeof window.renderizarCarrinho === 'function') {
        window.renderizarCarrinho();
      } else if (typeof renderizarCarrinho === 'function') {
        renderizarCarrinho();
      }
    }
  } catch (error) {
    console.error("DEBUG - Erro ao validar cupom:", error);
    localStorage.removeItem("descontoCupom"); // Limpa o desconto em caso de erro
    feedback.textContent = 'Erro ao validar cupom. Tente novamente.';
    feedback.className = 'text-danger';
    // Re-renderiza para remover qualquer exibição de desconto antiga
    if (typeof window.renderizarCarrinho === 'function') {
      window.renderizarCarrinho();
    } else if (typeof renderizarCarrinho === 'function') {
      renderizarCarrinho();
    }
  }
}

document.addEventListener('DOMContentLoaded', carregarEnderecosUsuario);