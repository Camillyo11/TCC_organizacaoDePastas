# Requisitos do Sistema – Site para Pizzaria

## 1. Descrição Geral
O sistema tem como objetivo facilitar os pedidos online em uma pizzaria, permitindo que os clientes realizem cadastros, escolham suas pizzas no cardápio, façam pedidos, tenha acesso a promoções e acompanhem o status de entrega.

---

## 2. Requisitos Funcionais (RF)

- **RF01** – O sistema deve permitir o cadastro de usuários com nome, e-mail e senha.
- **RF02** – O sistema deve permitir login e logout de usuários.
- **RF03** – O sistema deve exibir o cardápio com pizzas, bebidas e acompanhamentos.
- **RF04** – O sistema deve permitir ao cliente adicionar produtos ao carrinho.
- **RF05** – O sistema deve permitir a finalização do pedido com escolha de forma de pagamento.
- **RF06** – O sistema deve permitir o acompanhamento do status do pedido.
- **RF07** – O sistema deve permitir ao administrador cadastrar, editar e excluir produtos.
- **RF08** – O sistema deve gerar relatório simples de pedidos (para uso interno).

---

## 3. Requisitos Não Funcionais (RNF)

- **RNF01** – O sistema deve ser responsivo (funcionar em dispositivos móveis e desktop).
- **RNF02** – O sistema deve armazenar dados de forma persistente em banco de dados MySQL.
- **RNF03** – O tempo de carregamento de qualquer página não deve ultrapassar 3 segundos.
- **RNF04** – A interface deve ser simples, clara e intuitiva para qualquer usuário.
- **RNF05** – O sistema deve estar hospedado localmente () durante o desenvolvimento e testes.

---

## 4. Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap
- **Backend:** Javascript (procedural ou orientado a objetos)
- **Banco de Dados:** MySQL
- **Outros:** 


## 5. Estruturas de pastas 

TCC_organizacaoDePastas/
│
├── 📁 docs/                     
│   ├── requisitos.md           
│   ├── cronograma.md           
│   └── 📁 diagramas/           
│       ├── caso-uso.png
│       ├── fluxo-pedido.png
│       └── wireframe-home.png
│
├── 📁 src/                      
│   ├── 📁 frontend/             
│   │   ├── 📁 assets/
│   │   │   ├── 📁 css/
│   │   │   │   ├── base.css
│   │   │   │   ├── components.css
│   │   │   │   ├── navbar.css
│   │   │   │   ├── auth.css
│   │   │   │   ├── utilities.css
│   │   │   │   └── main.css
│   │   │   ├── 📁 js/
│   │   │   │   ├── main.js
│   │   │   │   ├── auth.js
│   │   │   │   ├── user-profile.js
│   │   │   │   ├── produtos.js
│   │   │   │   ├── pedidos.js
│   │   │   │   └── 📁 helpers/
│   │   │   │       ├── form-validation.js
│   │   │   │       ├── api.js
│   │   │   │       └── utils.js
│   │   ├── 📁 UserPages/
│   │   │   ├── index.html
│   │   │   ├── cadastro.html
│   │   │   ├── cardapio.html
│   │   │   └── ...
│   │   ├── 📁 AdmPages/
│   │   │   ├── index.html
│   │   │   ├── cadastro.html
│   │   │   ├── cardapio.html
│   │   │   └── ...
│   │   └── 📁 public/           
│   │       ├── icons/ 
│   │       ├── banners/
│   │       └── img/
│   │           └── produto/
│
│   ├── 📁 backend/              # Agora com backend em Node.js
│   │   ├── 📁 controllers/
│   │   │   ├── authController.js
│   │   │   ├── pedidoController.js
│   │   │   └── produtoController.js
│   │   ├── 📁 models/
│   │   │   ├── usuario.js
│   │   │   ├── pedido.js
│   │   │   └── produto.js
│   │   ├── 📁 Service/
│   │   │   ├── usuario.js
│   │   │   ├── pedido.js
│   │   │   └── produto.js
│   │   ├── 📁 routes/
│   │   │   ├── api.js
│   │   │   └── web.js
│   │   └── 📄 config.js         # Conexão com o banco (ex: MongoDB, MySQL via Sequelize)
│
│   └── 📁 database/             
│       ├── schema.sql          
│       ├── inserts.sql         
│       └── README.md           
│             
├── 📁 tests/                    
│   ├── 📁 unit/
│   └── 📁 e2e/
│
├── 📄 README.md                 
├── 📄 .gitignore                
└── 📄 package.json              # Agora essencial para o backend em Node.js
