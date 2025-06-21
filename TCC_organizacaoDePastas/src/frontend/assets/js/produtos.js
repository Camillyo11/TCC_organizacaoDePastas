// produtos.js atualizado e funcional

// IMPORTAÇÃO DO HEADER
fetch('../UserPages/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;
  })
  .catch(error => console.error('Erro ao carregar o header:', error));

// Bootstrap init
const modalTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="modal"]'));
modalTriggerList.map(modalTriggerEl => new bootstrap.Modal(modalTriggerEl));
const offcanvasTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="offcanvas"]'));
offcanvasTriggerList.map(offcanvasTriggerEl => new bootstrap.Offcanvas(offcanvasTriggerEl));

// Funções auxiliares
function verificarRespostaJSON(response) {
  if (!response.ok) throw new Error('Resposta inválida');
  return response.json();
}

function determinarCategoria(pizza) {
  const obs = pizza.observacao?.toLowerCase() || "";
  return obs.includes("doce") ? "doce" : "salgada";
}

function mostrarMensagemErro(mensagem) {
  const alerta = document.createElement('div');
  alerta.className = 'alert alert-warning fixed-top m-3';
  alerta.textContent = mensagem;
  document.body.prepend(alerta);
  setTimeout(() => alerta.remove(), 5000);
}

async function carregarProdutos() {
  try {
    const token = localStorage.getItem('token') || '';
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const [pizzasResponse, bebidasResponse] = await Promise.all([
      fetch('http://localhost:3000/api/menu/pizzas', { headers }),
      fetch('http://localhost:3000/api/menu/bebidas', { headers })
    ]);

    const pizzasBackend = await verificarRespostaJSON(pizzasResponse);
    const bebidasBackend = await verificarRespostaJSON(bebidasResponse);

    const pizzasCompletas = pizzasBackend.map(pizza => ({
      ...pizza,
      nome: pizza.sabor,
      descricao: pizza.observacao,
      imagem: pizza.imagem_url && pizza.imagem_url !== '' ? `/${pizza.imagem_url.replace(/^\/+/, '')}` : '/produtos/imgPizzas/imagem-padrao.png',
      preco: pizza.preco_sabor || 0,
      categoria: determinarCategoria(pizza)
    }));

    const bebidasCompletas = bebidasBackend.map(bebida => ({
      ...bebida,
      nome: bebida.nome,
      imagem: bebida.imagem_url || 'imagem-padrao-bebida.png',
      preco: bebida.preco || 0
    }));

    preencherPizzasSalgadas(pizzasCompletas.filter(p => p.categoria === 'salgada'));
    preencherPizzasDoces(pizzasCompletas.filter(p => p.categoria === 'doce'));
    preencherBebidas(bebidasCompletas);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    mostrarMensagemErro('Erro ao carregar cardápio. Tente novamente mais tarde.');
  }
}

function criarCardPizza(pizza) {
  return `
    <section class="col-md-6 col-lg-4">
      <div class="card pizza-card h-100">
        <div class="card-body">
          <img src="${pizza.imagem}" class="card-img-top" alt="${pizza.nome}" onerror="this.src='imagem-padrao.png'">
          <h5 class="card-title pizza-nome">${pizza.nome}</h5>
          <p class="card-text">${pizza.descricao}</p>
          <div class="pizza-preco" data-preco="${pizza.preco}" data-categoria="${pizza.categoria}">
            <p class="pizza-preco">R$ ${Number(pizza.preco).toFixed(2).replace('.', ',')}</p>
            <div class="quantidade">
              <div class="quantidade-itens">
                <button class="btn_retirar btn-outline-secondary btn-sm">-</button>
                <span class="mx-2">0</span>
                <button class="btn_adicionar btn-outline-secondary btn-sm">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function criarCardBebida(bebida) {
  return `
    <section class="col-md-6 col-lg-4">
      <div class="card pizza-card h-100">
        <div class="card-body">
          <img src="${bebida.imagem}" class="card-img-top" alt="${bebida.nome}" onerror="this.src='imagem-padrao-bebida.png'">
          <h5 class="card-title pizza-nome">${bebida.nome}</h5>
          <div class="pizza-preco" data-preco="${bebida.preco}" data-categoria="bebida">
            <p class="pizza-preco">R$ ${bebida.preco.toFixed(2).replace('.', ',')}</p>
            <div class="quantidade">
              <div class="quantidade-itens">
                <button class="btn_retirar btn-outline-secondary btn-sm">-</button>
                <span class="mx-2">0</span>
                <button class="btn_adicionar btn-outline-secondary btn-sm">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function preencherPizzasSalgadas(pizzas) {
  const container = document.querySelector('#salgadas .row');
  container.innerHTML = '';
  pizzas.forEach(pizza => container.innerHTML += criarCardPizza(pizza));
  configurarBotoes();
}

function preencherPizzasDoces(pizzas) {
  const container = document.querySelector('#doces .row');
  container.innerHTML = '';
  pizzas.forEach(pizza => container.innerHTML += criarCardPizza(pizza));
  configurarBotoes();
}

function preencherBebidas(bebidas) {
  const container = document.querySelector('#bebidas .row');
  container.innerHTML = '';
  bebidas.forEach(bebida => container.innerHTML += criarCardBebida(bebida));
  configurarBotoes();
}

function configurarBotoes() {
  document.querySelectorAll(".btn_adicionar").forEach(button => {
    button.onclick = function () {
      const span = this.parentElement.querySelector("span");
      let valor = parseInt(span.innerText);
      if (valor < 10) span.innerText = valor + 1;
    };
  });
  document.querySelectorAll(".btn_retirar").forEach(button => {
    button.onclick = function () {
      const span = this.parentElement.querySelector("span");
      let valor = parseInt(span.innerText);
      if (valor > 0) span.innerText = valor - 1;
    };
  });
}

function calcularPrecoPizza(tipo, pizzas = [], bebidas = []) {
  let preco = 0;
  if (tipo === "meio") {
    preco += 71.00;
  } else {
    pizzas.forEach(p => preco += 47.90 * p.qtd);
  }
  const bordaSelecionada = document.querySelector('input[name="pagamento"]:checked');
  const bordaTipo = bordaSelecionada?.value || "";
  if (["catupiry", "cheddar"].includes(bordaTipo)) preco += 10;
  if (["chocolate"].includes(bordaTipo)) preco += 15;
  bebidas.forEach(b => preco += b.qtd * 15.00);
  return preco;
}

function atualizarBotaoCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
  const botao = document.getElementById("btnIrCarrinho");
  if (botao) botao.disabled = carrinho.length === 0;
}

function confirmarPizzaInteira() {
  const pizzasSelecionadas = [];
  const bebidasSelecionadas = [];

  document.querySelectorAll(".pizza-card").forEach(card => {
    const nome = card.querySelector(".pizza-nome")?.innerText;
    const qtd = parseInt(card.querySelector(".quantidade span").innerText);
    if (qtd > 0) {
      const isBebida = card.closest("#bebidas") !== null;
      if (isBebida) bebidasSelecionadas.push({ nome, qtd });
      else pizzasSelecionadas.push({ nome, qtd });
    }
  });

  if (pizzasSelecionadas.length === 0) {
    alert("Selecione ao menos uma pizza.");
    return;
  }

  const bordaSelecionada = document.querySelector('input[name="pagamento"]:checked');
  const bordaLabel = bordaSelecionada?.closest(".borda-option")?.querySelector("h5")?.innerText || "Nenhuma";

  const carrinho = [{
    tipo: "inteira",
    pizzas: pizzasSelecionadas,
    borda: bordaLabel,
    bebidas: bebidasSelecionadas,
    preco: calcularPrecoPizza("inteira", pizzasSelecionadas, bebidasSelecionadas)
  }];

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  const pizzasText = pizzasSelecionadas.map(p => `${p.nome} x${p.qtd}`).join(", ");
  const bebidasText = bebidasSelecionadas.length > 0
    ? bebidasSelecionadas.map(b => `${b.nome} x${b.qtd}`).join(", ")
    : "Nenhuma";

  alert(`Resumo do pedido:\nPizza(s): ${pizzasText}\nBorda: ${bordaLabel}\nBebidas: ${bebidasText}\n\nClique em \"Adicionar ao Carrinho\" para finalizar.`);
  atualizarBotaoCarrinho();
}

async function irParaCarrinho() {
  // 1. Verifica se há itens no carrinho
  const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio. Adicione itens antes de finalizar.");
    return;
  }

  // 2. Verifica se está logado
  const token = localStorage.getItem("token");
  if (!token) {
    localStorage.setItem('redirectAfterLogin', 'carrinho.html');
    window.location.href = "../UserPages/login.html";
    return;
  }

  // 3. Verifica endereço (apenas se logado e com carrinho não vazio)
  try {
    const response = await fetch("http://localhost:3000/api/users/endereco", {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Erro na API");

    const enderecos = await response.json();

    // Redireciona SE não houver endereços
    if (!enderecos || enderecos.length === 0) {
      window.location.href = "../UserPages/endereco.html";
      return;
    }

    // Se tudo OK, vai para o carrinho
    window.location.href = "carrinho.html";

  } catch (error) {
    console.error("Erro:", error);
    // Em caso de erro, permite continuar para o carrinho
    window.location.href = "carrinho.html";
  }
}
document.addEventListener('DOMContentLoaded', () => {
  carregarProdutos();
});
