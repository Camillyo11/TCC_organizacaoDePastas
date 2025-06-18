// produtos.js (versão corrigida)

// IMPORTAÇÃO DO HEADER
fetch('../UserPages/header.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-container').innerHTML = data;
  })
  .catch(error => console.error('Erro ao carregar o header:', error));

// Inicialização de componentes Bootstrap
const modalTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="modal"]'));
modalTriggerList.map(modalTriggerEl => new bootstrap.Modal(modalTriggerEl));

const offcanvasTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="offcanvas"]'));
offcanvasTriggerList.map(offcanvasTriggerEl => new bootstrap.Offcanvas(offcanvasTriggerEl));

// Função para verificar JSON válido
async function verificarRespostaJSON(response) {
  if (!response.ok) throw new Error('Resposta inválida');
  return await response.json();
}

// Função para determinar categoria
function determinarCategoria(pizza) {
  if (pizza.tipo_borda?.toLowerCase().includes('doce')) return 'doce';
  if (pizza.observacao?.toLowerCase().includes('doce')) return 'doce';
  if (pizza.sabor?.toLowerCase().includes('doce')) return 'doce';
  return 'salgada';
}

function mostrarMensagemErro(mensagem) {
  const alerta = document.createElement('div');
  alerta.className = 'alert alert-warning fixed-top m-3';
  alerta.textContent = mensagem;
  document.body.prepend(alerta);
  setTimeout(() => alerta.remove(), 5000);
}

// Função principal
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

    const produtosLocais = {
      pizzas: JSON.parse(localStorage.getItem('pizzas')) || [],
      bebidas: JSON.parse(localStorage.getItem('bebidas')) || []
    };

    const pizzasCompletas = pizzasBackend.map(pizzaBackend => {
      const pizzaLocal = produtosLocais.pizzas.find(p => p.backendId === pizzaBackend.id_pizza || p.nome === pizzaBackend.sabor);
      return {
        ...pizzaBackend,
        imagem: pizzaLocal?.imagem || 'imagem-padrao.png',
        nome: pizzaBackend.sabor,
        descricao: pizzaBackend.observacao,
        categoria: determinarCategoria(pizzaBackend),
        preco: pizzaBackend.preco_sabor || 47.90
      };
    });

    const bebidasCompletas = bebidasBackend.map(bebidaBackend => {
      const bebidaLocal = produtosLocais.bebidas.find(b => b.backendId === bebidaBackend.id_bebida || b.nome === bebidaBackend.nome);
      return {
        ...bebidaBackend,
        imagem: bebidaLocal?.imagem || 'imagem-padrao-bebida.png',
        nome: bebidaBackend.nome
      };
    });

    preencherPizzasSalgadas(pizzasCompletas.filter(p => p.categoria === 'salgada'));
    preencherPizzasDoces(pizzasCompletas.filter(p => p.categoria === 'doce'));
    preencherBebidas(bebidasCompletas);

  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    carregarApenasLocal();
    mostrarMensagemErro('Não foi possível carregar o cardápio completo. Alguns produtos podem estar indisponíveis.');
  }
}

function carregarApenasLocal() {
  const produtosLocais = {
    pizzas: JSON.parse(localStorage.getItem('pizzas')) || [],
    bebidas: JSON.parse(localStorage.getItem('bebidas')) || []
  };
  preencherPizzasSalgadas(produtosLocais.pizzas.filter(p => p.categoria === 'salgada'));
  preencherPizzasDoces(produtosLocais.pizzas.filter(p => p.categoria === 'doce'));
  preencherBebidas(produtosLocais.bebidas);
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
            <p class="pizza-preco">R$ ${pizza.preco.toFixed(2).replace('.', ',')}</p>
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
          <h5 class="card-title pizza-nome">${bebida.nome} ${bebida.tamanho || ''}</h5>
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

document.addEventListener('DOMContentLoaded', function () {
  carregarProdutos();
});
function confirmarPizzaInteira() {
  const pizzasSelecionadas = [];
  const bebidasSelecionadas = [];

  document.querySelectorAll(".pizza-card").forEach(card => {
    const nome = card.querySelector(".pizza-nome")?.innerText;
    const qtd = parseInt(card.querySelector(".quantidade span").innerText);
    if (qtd > 0) {
      const isBebida = card.closest("#bebidas") !== null;
      if (isBebida) {
        bebidasSelecionadas.push({ nome, qtd });
      } else {
        pizzasSelecionadas.push({ nome, qtd });
      }
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

  alert(
    `Resumo do pedido:\n` +
    `Pizza(s): ${pizzasText}\n` +
    `Borda: ${bordaLabel}\n` +
    `Bebidas: ${bebidasText}\n\n` +
    `Clique em \"Adicionar ao Carrinho\" para finalizar.`
  );

  atualizarBotaoCarrinho();
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
  if (botao) {
    botao.disabled = carrinho.length === 0;
  }
};

function irParaCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");

  if (carrinho.length === 0) {
    alert("Por favor, confirme seu pedido antes de ir para o carrinho.");
    return;
  }

  // Redireciona para a página do carrinho
  window.location.href = "carrinho.html";
};