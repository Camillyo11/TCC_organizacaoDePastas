fetch('../UserPages/header.html')
      .then(response => response.text())
      .then(data => {
        document.getElementById('header-container').innerHTML = data;
      })
      .catch(error => console.error('Erro ao carregar o header:', error));

    // Re-inicialize os componentes Bootstrap que dependem de data-bs-toggle
    const modalTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="modal"]'));
    modalTriggerList.map(function (modalTriggerEl) {
      new bootstrap.Modal(modalTriggerEl);
    });







    // Barra de pesquisa 
document.getElementById("barraPesquisa").addEventListener("input", function() {
    const termo = this.value.toLowerCase();
    const abaAtiva = document.querySelector(".tab-pane.active");
    const itensRetirados = JSON.parse(localStorage.getItem('itensRetirados')) || [];
    
    abaAtiva.querySelectorAll(".pizza-card").forEach(card => {
        const itemContainer = card.closest('[data-id]');
        const itemId = itemContainer.dataset.id;
        const nome = card.querySelector(".pizza-nome, .bebida-nome")?.innerText?.toLowerCase() || "";
        const descricao = card.querySelector(".card-text")?.innerText?.toLowerCase() || "";
        
        const correspondeBusca = nome.includes(termo) || descricao.includes(termo);
        const estaRetirado = itensRetirados.includes(itemId);
        
        // Aplicar lógica de visibilidade
        if(estaRetirado) {
            card.parentElement.style.display = "none";
            card.parentElement.classList.add('item-retirado');
        } else {
            card.parentElement.style.display = correspondeBusca ? "" : "none";
            card.parentElement.classList.remove('item-retirado');
        }
    });
});

// Funções de retirar/voltar (separadas, fora do evento de pesquisa)
function retirarItem(event) {
    const btn = event.target;
    const itemContainer = btn.closest('[data-id]');
    const itemId = itemContainer.dataset.id;
    const card = itemContainer.querySelector('.card, .borda-option');
    
    card.classList.add('item-retirado');
    salvarItemRetirado(itemId, true);
    itemContainer.style.display = 'none';
}

function voltarItem(event) {
    const btn = event.target;
    const itemContainer = btn.closest('[data-id]');
    const itemId = itemContainer.dataset.id;
    const card = itemContainer.querySelector('.card, .borda-option');
    
    card.classList.remove('item-retirado');
    salvarItemRetirado(itemId, false);
    
    const termo = document.getElementById("barraPesquisa").value.toLowerCase();
    if(termo === '') {
        itemContainer.style.display = '';
    } else {
        const nome = card.querySelector(".pizza-nome, .bebida-nome")?.innerText?.toLowerCase() || "";
        const descricao = card.querySelector(".card-text")?.innerText?.toLowerCase() || "";
        itemContainer.style.display = (nome.includes(termo) || descricao.includes(termo) )? '' : 'none';
    }
}

// Função auxiliar para salvar no localStorage
function salvarItemRetirado(itemId, retirar) {
    let itensRetirados = JSON.parse(localStorage.getItem('itensRetirados')) || [];
    
    if(retirar) {
        if(!itensRetirados.includes(itemId)) {
            itensRetirados.push(itemId);
        }
    } else {
        itensRetirados = itensRetirados.filter(id => id !== itemId);
    }
    
    localStorage.setItem('itensRetirados', JSON.stringify(itensRetirados));
}






    // Inicialização do Offcanvas
    const offcanvasTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="offcanvas"]'));
    offcanvasTriggerList.map(function (offcanvasTriggerEl) {
      new bootstrap.Offcanvas(offcanvasTriggerEl);
    });
    const form = document.getElementById("avaliacaoForm");
    let meioMeioAtivo = false;
    let pizzasSelecionadas = [];

    function isPizzaTab(tabId) {
      return tabId === "salgadas" || tabId === "doces";
    }

  function atualizarVisibilidadePizzas() {
  const todasPizzas = document.querySelectorAll(".pizza-card");

  todasPizzas.forEach(card => {
    const isBebida = card.closest("#bebidas") !== null;
    const qtd = parseInt(card.querySelector(".quantidade span").innerText);
    const selecionada = card.classList.contains("selecionada");

    if (meioMeioAtivo && !isBebida) {
      if (qtd > 0 || pizzasSelecionadas.length < 2 || selecionada) {
        card.parentElement.style.display = "";
      } else {
        card.parentElement.style.display = "none";
      }
    } else {
      card.parentElement.style.display = "";
    }
  });
}

document.querySelectorAll('input[name="modoPizza"]').forEach(radio => {
  radio.addEventListener("change", function () {
    meioMeioAtivo = (this.value === "meio");
    pizzasSelecionadas = [];

    const abaAtiva = document.querySelector(".tab-pane.active");
    const tabId = abaAtiva.id;

    abaAtiva.querySelectorAll(".pizza-card").forEach(card => {
      const span = card.querySelector(".quantidade span");
      const nome = card.querySelector(".pizza-nome")?.innerText;
      const qtd = parseInt(span.innerText);

      if (isPizzaTab(tabId)) {
        if (meioMeioAtivo) {
          span.innerText = "0";
          card.classList.remove("selecionada");
        } else {
          span.innerText = "0";
          card.classList.remove("selecionada");
        }
      }
      card.parentElement.style.display = "";
    });

    // Exibir o botão correto
    document.getElementById("confirmarPizzaInteira").style.display = meioMeioAtivo ? "none" : "block";
    document.getElementById("confirmarMeioMeio").style.display = meioMeioAtivo ? "block" : "none";

    atualizarVisibilidadePizzas();
  });
});




// BOTÃO DE ADICIONAR
document.querySelectorAll(".btn_adicionar").forEach(button => {
  button.addEventListener("click", function () {
    const span = this.parentElement.querySelector("span");
    let valor = parseInt(span.innerText);
    const card = this.closest(".pizza-card");
    const nome = card.querySelector(".pizza-nome, .bebida-nome")?.innerText;
    const abaAtiva = document.querySelector(".tab-pane.active");
    const tabId = abaAtiva.id;

    const isPizza = tabId === "salgadas" || tabId === "doces";
    const isBebida = tabId === "bebidas";

    if (meioMeioAtivo && isPizza) {
      if (valor < 1 && pizzasSelecionadas.length < 2) {
        span.innerText = valor + 1;
        card.classList.add("selecionada");
        pizzasSelecionadas.push(nome);
      }
    } else {
      if (valor < 10) {
        span.innerText = valor + 1;
      }
    }

    if (meioMeioAtivo && isPizza) {
      atualizarVisibilidadePizzas();
      //  MANTÉM O BOTÃO VISÍVEL
      document.getElementById("confirmarMeioMeio").style.display = "block";
    }
  });
});

// BOTÃO DE RETIRAR
document.querySelectorAll(".btn_retirar").forEach(button => {
  button.addEventListener("click", function () {
    const card = this.closest(".pizza-card");
    const nome = card.querySelector(".pizza-nome, .bebida-nome")?.innerText;
    const abaAtiva = document.querySelector(".tab-pane.active");
    const tabId = abaAtiva.id;
    const span = card.querySelector(".quantidade span");
    let valor = parseInt(span.innerText);

    if (valor > 0) {
      span.innerText = valor - 1;
      if (meioMeioAtivo && isPizzaTab(tabId) && valor - 1 === 0) {
        card.classList.remove("selecionada");
        pizzasSelecionadas = pizzasSelecionadas.filter(p => p !== nome);
      }
    }

    if (meioMeioAtivo && isPizzaTab(tabId)) {
      atualizarVisibilidadePizzas();
      //  GARANTE QUE O BOTÃO CONTINUE VISÍVEL MESMO APÓS REMOVER UMA PIZZA
      document.getElementById("confirmarMeioMeio").style.display = "block";
    }
  });
});

 /* função de confirmar meio a meio */
function confirmarMeioMeio() {
  if (pizzasSelecionadas.length !== 2) {
    alert("Escolha as duas metades da pizza.");
    return;
  }

  const bebidasSelecionadas = [];
  document.querySelectorAll("#bebidas .pizza-card").forEach(card => {
    const nome = card.querySelector(".bebida-nome")?.innerText || "";
    const qtd = parseInt(card.querySelector(".quantidade span")?.innerText || "0");
    if (qtd > 0) {
      bebidasSelecionadas.push({ nome, qtd });
    }
  });

  const bordaSelecionada = document.querySelector('input[name="pagamento"]:checked');
  const bordaLabel = bordaSelecionada?.closest(".borda-option")?.querySelector("h5")?.innerText || "Nenhuma";

  const carrinho = [{
    tipo: "meio a meio",
    pizzas: pizzasSelecionadas,
    borda: bordaLabel,
    bebidas: bebidasSelecionadas,
    preco: calcularPrecoPizza("meio", [], bebidasSelecionadas)
  }];

  // Salva no localStorage
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  // Mostra resumo
  const bebidasText = bebidasSelecionadas.length > 0
    ? bebidasSelecionadas.map(b => `${b.nome} x${b.qtd}`).join(", ")
    : "Nenhuma";

  alert(
    `Resumo do pedido:\n` +
    ` Meio a Meio: ${pizzasSelecionadas.join(" + ")}\n` +
    ` Borda: ${bordaLabel}\n` +
    ` Bebidas: ${bebidasText}\n\n` +
    `Clique em adicionar ao Carrinho" para finalizar.`
  );

  atualizarBotaoCarrinho();
}




/* função de confirmar pizza inteira */
function confirmarPizzaInteira() {
  const pizzasSelecionadasInteiras = [];
  const bebidasSelecionadas = [];

  document.querySelectorAll(".pizza-card").forEach(card => {
    const nome = card.querySelector(".pizza-nome, .bebida-nome")?.innerText;
    const span = card.querySelector(".quantidade span");
    const qtd = parseInt(span.innerText);

    if (qtd > 0) {
      const isBebida = !!card.querySelector(".bebida-nome");

      if (isBebida) {
        bebidasSelecionadas.push({ nome, qtd });
      } else {
        pizzasSelecionadasInteiras.push({ nome, qtd });
      }
    }
  });

  if (pizzasSelecionadasInteiras.length === 0) {
    alert("Selecione ao menos uma pizza.");
    return;
  }

  const bordaSelecionada = document.querySelector('input[name="pagamento"]:checked');
  const bordaLabel = bordaSelecionada?.closest(".borda-option")?.querySelector("h5")?.innerText || "Nenhuma";

  const carrinho = [{
    tipo: "inteira",
    pizzas: pizzasSelecionadasInteiras,
    borda: bordaLabel,
    bebidas: bebidasSelecionadas,
    preco: calcularPrecoPizza("inteira", pizzasSelecionadasInteiras, bebidasSelecionadas)
  }];

  // Salva o pedido no localStorage
  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  // Mostra resumo do pedido
  const pizzasText = pizzasSelecionadasInteiras.map(p => `${p.nome} x${p.qtd}`).join(", ");
  const bebidasText = bebidasSelecionadas.length > 0
    ? bebidasSelecionadas.map(b => `${b.nome} x${b.qtd}`).join(", ")
    : "Nenhuma";

  alert(
    `Resumo do pedido:\n` +
    `Pizza(s): ${pizzasText}\n` +
    ` Borda: ${bordaLabel}\n` +
    ` Bebidas: ${bebidasText}\n\n` +
    `Clique em "adicionar ao Carrinho" para finalizar.`
  );

  atualizarBotaoCarrinho();
}


    document.getElementById("barraPesquisa").addEventListener("input", function () {
      const termo = this.value.toLowerCase();
      const abaAtiva = document.querySelector(".tab-pane.active");

      // Verifica se a aba é de pizza ou bebida
      const isPizzaTab = abaAtiva.id === "salgadas" || abaAtiva.id === "doces";

      abaAtiva.querySelectorAll(".pizza-card").forEach(card => {
        const nome = card.querySelector(".pizza-nome, .bebida-nome")?.innerText?.toLowerCase() || "";
        const descricao = card.querySelector(".card-text")?.innerText?.toLowerCase() || "";
        const corresponde = nome.includes(termo) || descricao.includes(termo);

        if (isPizzaTab && meioMeioAtivo) {
          const qtd = parseInt(card.querySelector(".quantidade span").innerText);
          const selecionada = card.classList.contains("selecionada");
          const podeExibir = corresponde && (qtd > 0 || pizzasSelecionadas.length < 2 || selecionada);
          card.parentElement.style.display = podeExibir ? "" : "none";
        } else {
          card.parentElement.style.display = corresponde ? "" : "none";
        }
      });
      
    });
    


 // Função principal chamada ao clicar em "Adicionar ao Carrinho"
function adicionarAoCarrinho() {
  const modoPizza = document.querySelector('input[name="modoPizza"]:checked')?.value;
  const carrinho = [];

  // Coletar borda
  const bordaSelecionada = document.querySelector('input[name="pagamento"]:checked');
  const bordaLabel = bordaSelecionada?.closest(".borda-option")?.querySelector("h5")?.innerText || "Nenhuma";

  // Coletar bebidas
  const bebidasSelecionadas = [];
  document.querySelectorAll("#bebidas .pizza-card").forEach(card => {
    const nome = card.querySelector(".bebida-nome")?.innerText || "";
    const qtd = parseInt(card.querySelector(".quantidade span")?.innerText || "0");
    if (qtd > 0) {
      bebidasSelecionadas.push({ nome, qtd });
    }
  });

  // Coletar pizzas
  if (modoPizza === "meio") {
    if (pizzasSelecionadas.length !== 2) {
      alert("Selecione duas pizzas para o modo meio a meio.");
      return;
    }

    carrinho.push({
      tipo: "meio a meio",
      pizzas: pizzasSelecionadas,
      borda: bordaLabel,
      bebidas: bebidasSelecionadas,
      preco: calcularPrecoPizza("meio", [], bebidasSelecionadas)
    });

  } else if (modoPizza === "inteira") {
    const pizzasInteiras = [];
    document.querySelectorAll("#salgadas .pizza-card, #doces .pizza-card").forEach(card => {
      const nome = card.querySelector(".pizza-nome")?.innerText;
      const qtd = parseInt(card.querySelector(".quantidade span")?.innerText);
      if (qtd > 0) {
        pizzasInteiras.push({ nome, qtd });
      }
    });

    if (pizzasInteiras.length === 0) {
      alert("Selecione ao menos uma pizza inteira.");
      return;
    }

    carrinho.push({
      tipo: "inteira",
      pizzas: pizzasInteiras,
      borda: bordaLabel,
      bebidas: bebidasSelecionadas,
      preco: calcularPrecoPizza("inteira", pizzasInteiras, bebidasSelecionadas)
    });

  } else {
    alert("Selecione se deseja pizza inteira ou meio a meio.");
    return;
  }

  // Salvar no localStorage e redirecionar para carrinho
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
  window.location.href = "carrinho.html";
}

// Função para calcular o preço total
function calcularPrecoPizza(tipo, pizzas = [], bebidas = []) {
  let preco = 0;

  if (tipo === "meio") {
    preco += 71.00; // Preço fixo para meio a meio
  } else {
    pizzas.forEach(p => {
      preco += 47.90 * p.qtd; // Preço por pizza inteira
    });
  }


  const bordaSelecionada = document.querySelector('input[name="pagamento"]:checked');
  const bordaTipo = bordaSelecionada?.value;
  if (["catupiry", "cheddar",].includes(bordaTipo)) {
    preco += 10.00;
  }
   if (["chocolate"].includes(bordaTipo)) {
    preco += 15.00;
  }

  
  bebidas.forEach(b => {
    preco += b.qtd * 15.00; // Exemplo: cada bebida custa R$15
  });

  return preco;
}

function atualizarBotaoCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");
  const botao = document.getElementById("btnIrCarrinho");
  botao.disabled = carrinho.length === 0;
}


function irParaCarrinho() {
  const carrinho = JSON.parse(localStorage.getItem("carrinho") || "[]");

  if (carrinho.length === 0) {
    alert("Por favor, confirme seu pedido antes de ir para o carrinho.");
    return;
  }

  // Redireciona para a página do carrinho
  window.location.href = "carrinho.html";
}

// Chama ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  atualizarBotaoCarrinho();
});

//testes
document.addEventListener("DOMContentLoaded", () => {
  const modoInicial = document.querySelector('input[name="modoPizza"]:checked')?.value;
  meioMeioAtivo = modoInicial === "meio";

  document.getElementById("confirmarPizzaInteira").style.display = meioMeioAtivo ? "none" : "block";
  document.getElementById("confirmarMeioMeio").style.display = meioMeioAtivo ? "block" : "none";

  atualizarBotaoCarrinho();
});






// Adicione esta função global para ser chamada de outras páginas
async function carregarProdutos() {
  try {
    console.log('Iniciando carregamento de produtos...');
    
    const token = localStorage.getItem('token') || '';
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 1. Busca produtos do backend
    const [pizzasResponse, bebidasResponse] = await Promise.all([
      fetch('http://localhost:3000/api/menu/pizzas', { headers }),
      fetch('http://localhost:3000/api/menu/bebidas', { headers })
    ]);

    console.log('Respostas recebidas:', { pizzasResponse, bebidasResponse });

    // Verifica se as respostas são JSON válidos
    const pizzasBackend = await verificarRespostaJSON(pizzasResponse);
    const bebidasBackend = await verificarRespostaJSON(bebidasResponse);

    console.log('Dados do backend:', { pizzasBackend, bebidasBackend });

    // 2. Busca imagens do localStorage
    const produtosLocais = {
      pizzas: JSON.parse(localStorage.getItem('pizzas')) || [],
      bebidas: JSON.parse(localStorage.getItem('bebidas')) || []
    };

    // 3. Combina os dados
    const pizzasCompletas = pizzasBackend.map(pizzaBackend => {
      const pizzaLocal = produtosLocais.pizzas.find(p => 
        p.backendId === pizzaBackend.id_pizza || p.nome === pizzaBackend.sabor
      );
      
      return {
        ...pizzaBackend,
        imagem: pizzaLocal?.imagem || 'img/produtos/padrao.png',
        nome: pizzaBackend.sabor,
        descricao: pizzaBackend.observacao,
        categoria: determinarCategoria(pizzaBackend)
      };
    });

    const bebidasCompletas = bebidasBackend.map(bebidaBackend => {
      const bebidaLocal = produtosLocais.bebidas.find(b => 
        b.backendId === bebidaBackend.id_bebida || b.nome === bebidaBackend.nome
      );
      
      return {
        ...bebidaBackend,
        imagem: bebidaLocal?.imagem || 'img/produtos/bebida-padrao.png',
        nome: bebidaBackend.nome
      };
    });

    // 4. Exibe os produtos
    preencherPizzasSalgadas(pizzasCompletas.filter(p => p.categoria === 'salgada'));
    preencherPizzasDoces(pizzasCompletas.filter(p => p.categoria === 'doce'));
    preencherBebidas(bebidasCompletas);
    
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    // Fallback: tenta carregar apenas do localStorage se o backend falhar
    carregarApenasLocal();
    
    // Mostra mensagem amigável para o usuário
    mostrarMensagemErro('Não foi possível carregar o cardápio completo. Alguns produtos podem estar indisponíveis.');
  }
}

// Funções auxiliares
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



function carregarApenasLocal() {
  const produtosLocais = {
    pizzas: JSON.parse(localStorage.getItem('pizzas')) || [],
    bebidas: JSON.parse(localStorage.getItem('bebidas')) || []
  };
  
  preencherPizzasSalgadas(produtosLocais.pizzas.filter(p => p.categoria === 'salgada'));
  preencherPizzasDoces(produtosLocais.pizzas.filter(p => p.categoria === 'doce'));
  preencherBebidas(produtosLocais.bebidas);
}

// Modifique as funções de preenchimento para usar a estrutura de dados unificada
function criarCardPizza(pizza) {
  // Usa pizza.preco, se não existir tenta pizza.preco_sabor, se não existir usa 0
  const preco = pizza.preco !== undefined ? pizza.preco : (pizza.preco_sabor !== undefined ? pizza.preco_sabor : 0);
  return `
    <section class="col-md-6 col-lg-4">
      <div class="card pizza-card h-100">
        <div class="card-body">
          <img src="${pizza.imagem}" class="card-img-top" alt="${pizza.sabor}" onerror="this.src='imagem-padrao.png'">
          <h5 class="card-title pizza-nome">${pizza.sabor}</h5>
          <p class="card-text">${pizza.observacao}</p>
          <div class="pizza-preco" data-preco="${preco}" data-categoria="${pizza.categoria}">
            <p class="pizza-preco">R$ ${preco.toFixed(2).replace('.', ',')}</p>
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



document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
  });

  function carregarProdutos() {
    // Carrega produtos do localStorage (imagens)
    const produtosLocais = {
      pizzas: JSON.parse(localStorage.getItem('pizzas')) || [],
      bebidas: JSON.parse(localStorage.getItem('bebidas')) || []
    };

    // Carrega produtos do backend (dados textuais)
    Promise.all([
      fetch('http://localhost:3000/api/menu/pizzas').then(res => res.json()),
      fetch('http://localhost:3000/api/menu/bebidas').then(res => res.json())
    ])
    .then(([pizzasBackend, bebidasBackend]) => {
      // Combinar dados locais (com imagens) com dados do backend
      const pizzasCompletas = pizzasBackend.map(pizzaBackend => {
        const pizzaLocal = produtosLocais.pizzas.find(p => p.nome === pizzaBackend.sabor);
        return {
          ...pizzaBackend,
          imagem: pizzaLocal?.imagem || 'imagem-padrao.png',
          descricao: pizzaBackend.observacao,
          categoria: pizzaBackend.tipo_borda.includes('Doce') ? 'doce' : 'salgada'
        };
      });

      const bebidasCompletas = bebidasBackend.map(bebidaBackend => {
        const bebidaLocal = produtosLocais.bebidas.find(b => b.nome === bebidaBackend.nome);
        return {
          ...bebidaBackend,
          imagem: bebidaLocal?.imagem || 'imagem-padrao-bebida.png'
        };
      });

      // Preencher as seções
      preencherPizzasSalgadas(pizzasCompletas.filter(p => p.categoria === 'salgada'));
      preencherPizzasDoces(pizzasCompletas.filter(p => p.categoria === 'doce'));
      preencherBebidas(bebidasCompletas);
    })
    .catch(error => console.error('Erro ao carregar produtos:', error));
  }

  function preencherPizzasSalgadas(pizzas) {
    const container = document.querySelector('#salgadas .row');
    container.innerHTML = '';
    
    pizzas.forEach(pizza => {
      container.innerHTML += criarCardPizza(pizza);
    });
    
    configurarBotoes();
  }

  function preencherPizzasDoces(pizzas) {
    const container = document.querySelector('#doces .row');
    container.innerHTML = '';
    
    pizzas.forEach(pizza => {
      container.innerHTML += criarCardPizza(pizza);
    });
    
    configurarBotoes();
  }

  function preencherBebidas(bebidas) {
    const container = document.querySelector('#bebidas .row');
    container.innerHTML = '';
    
    bebidas.forEach(bebida => {
      container.innerHTML += criarCardBebida(bebida);
    });
    
    configurarBotoes();
  }

  function criarCardPizza(pizza) {
    // Usa pizza.preco, se não existir tenta pizza.preco_sabor, se não existir usa 0
    const preco = pizza.preco !== undefined ? pizza.preco : (pizza.preco_sabor !== undefined ? pizza.preco_sabor : 0);
    return `
      <section class="col-md-6 col-lg-4">
        <div class="card pizza-card h-100">
          <div class="card-body">
            <img src="${pizza.imagem}" class="card-img-top" alt="${pizza.sabor}" onerror="this.src='imagem-padrao.png'">
            <h5 class="card-title pizza-nome">${pizza.sabor}</h5>
            <p class="card-text">${pizza.observacao}</p>
            <div class="pizza-preco" data-preco="${preco}" data-categoria="${pizza.categoria}">
              <p class="pizza-preco">R$ ${preco.toFixed(2).replace('.', ',')}</p>
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
            <h5 class="card-title pizza-nome">${bebida.nome} ${bebida.tamanho}</h5>
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

  

/* PARA RETIRAR E VOLTAR COM UM PRODUTO  */

document.addEventListener('DOMContentLoaded', function() {
    // Verifica itens retirados no localStorage
    const itensRetirados = JSON.parse(localStorage.getItem('itensRetirados')) || [];
    
    // Esconde os itens retirados
    itensRetirados.forEach(id => {
        const item = document.querySelector(`[data-id="${id}"]`);
        if (item) {
            item.style.display = 'none';
            
            // Opcional: Se você usar a classe item-retirado no cliente também
            // item.classList.add('item-retirado');
        }
    });
    
    // Opcional: Atualização em tempo real (se o cliente ficar com a página aberta)
    window.addEventListener('storage', function(e) {
        if (e.key === 'itensRetirados') {
            location.reload(); // Recarrega a página quando houver mudanças
        }
    });
});

function configurarBotoes() {
  // Botão de adicionar
  document.querySelectorAll(".btn_adicionar").forEach(button => {
    button.onclick = function () {
      const span = this.parentElement.querySelector("span");
      let valor = parseInt(span.innerText);
      if (valor < 10) span.innerText = valor + 1;
    };
  });

  // Botão de retirar
  document.querySelectorAll(".btn_retirar").forEach(button => {
    button.onclick = function () {
      const span = this.parentElement.querySelector("span");
      let valor = parseInt(span.innerText);
      if (valor > 0) span.innerText = valor - 1;
    };
  });
}


