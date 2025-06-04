// ==================== CARREGA ENDEREÇOS ====================
const loadAddresses = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Faça login primeiro!');
        return window.location.href = 'login.html';
    }

    try {
        const response = await fetch('http://localhost:3000/api/address', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const addresses = await response.json();
            renderAddresses(addresses);
        }
    } catch (error) {
        console.error('Erro ao carregar endereços:', error);
    }
};

// ==================== RENDERIZA ENDEREÇOS ====================
const renderAddresses = (addresses) => {
    const container = document.querySelector('.conteiner-endereço');
    if (!container) return;

    container.innerHTML = addresses.map(addr => `
        <div class="d-flex justify-content-between align-items-center">
            <button class="endereco-item">
                <img src="../public/icons/fixar-mapa (1).png" width="30">
                <h7>${addr.endereco}, ${addr.numero_casa}</h7>
            </button>
        </div>
    `).join('');
};

// ==================== CADASTRA ENDEREÇO ====================
document.getElementById('form-endereco')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Sessão expirada! Faça login novamente.');
        return window.location.href = 'login.html';
    }

    const addressData = {
        endereco: document.getElementById('endereco').value,
        numero_casa: document.getElementById('numero').value,
        complemento: document.getElementById('complemento').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        cep: document.getElementById('cep').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/address', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(addressData)
        });

        if (response.ok) {
            alert('Endereço salvo!');
            loadAddresses(); // Recarrega a lista
        }
    } catch (error) {
        alert('Erro ao salvar endereço');
    }
});

// Carrega endereços quando a página abre
if (document.querySelector('.conteiner-endereço')) {
    loadAddresses();
}