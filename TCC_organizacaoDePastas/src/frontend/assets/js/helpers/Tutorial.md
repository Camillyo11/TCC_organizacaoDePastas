

### 📁 `helpers/` – O que deve ir lá?

| Arquivo                       | O que contém                                                               |
|------------------------------|----------------------------------------------------------------------------|
| `form-validation.js`         | Funções de validação de formulário (e.g., campos obrigatórios, senhas)     |
| `api.js`                     | Funções para fazer chamadas à API (usando `fetch`, `POST`, etc.)           |
| `utils.js`                   | Funções genéricas (formatar data, calcular valor total, máscaras, etc.)    |

---

### 🧠 Exemplos reais do que colocar:

#### 📄 `form-validation.js`
```js
export function validarEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export function validarSenha(senha) {
  return senha.length >= 6;
}
```

#### 📄 `api.js`
```js
export async function postData(url, data) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

#### 📄 `utils.js`
```js
export function formatarPreco(valor) {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
}

export function capitalizarTexto(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
```

---

### Como usar os helpers nas páginas:

No seu `cadastro.js`:
```js
import { validarEmail } from './helpers/form-validation.js';

const emailValido = validarEmail(emailInput.value);
```

> 📝 *Obs:* Esse tipo de `import/export` moderno funciona em arquivos `.js` se você usar a tag `<script type="module">` no HTML.

---

Se você quiser, posso te ajudar a montar esses helpers com base nas funcionalidades do seu site. Me diz o que você já tem pronto ou o que pretende fazer!