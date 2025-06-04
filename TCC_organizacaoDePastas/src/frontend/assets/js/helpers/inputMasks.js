/**
 * Aplica máscaras aos campos de formulário
 */
function applyMasks() {
    // Máscara para CPF
    const cpfField = document.getElementById('CPF');
    if (cpfField) {
        cpfField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = value.substring(0, 14);
        });
    }
    
    // Máscara para telefone
    const telField = document.getElementById('telefone');
    if (telField) {
        telField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value.substring(0, 15);
        });
    }
    
    // Outras máscaras podem ser adicionadas aqui...
}

// Exporta para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { applyMasks };
} else {
    window.applyMasks = applyMasks;
}