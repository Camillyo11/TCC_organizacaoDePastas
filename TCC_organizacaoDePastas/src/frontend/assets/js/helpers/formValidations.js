/**
 * Valida o formulário de cadastro antes do envio
 */
function validateCadastroForm(form) {
    let isValid = true;
    
    // Validação do nome
    const nome = form.nome.value.trim();
    if (!nome || nome.length < 3) {
        form.nome.classList.add('is-invalid');
        isValid = false;
    } else {
        form.nome.classList.remove('is-invalid');
    }
    
    // Validação de data de nascimento (maior de 18 anos)
    const dataNasc = new Date(form.data_nascimento.value);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNasc.getFullYear();
    const mes = hoje.getMonth() - dataNasc.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNasc.getDate())) {
        idade--;
    }
    
    if (idade < 18) {
        form.data_nascimento.classList.add('is-invalid');
        isValid = false;
    } else {
        form.data_nascimento.classList.remove('is-invalid');
    }
    
    // Validação de CPF (formato)
    const cpf = form.cpf.value.replace(/\D/g, '');
    if (cpf.length !== 11) {
        form.cpf.classList.add('is-invalid');
        isValid = false;
    } else {
        form.cpf.classList.remove('is-invalid');
    }
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.value.trim())) {
        form.email.classList.add('is-invalid');
        isValid = false;
    } else {
        form.email.classList.remove('is-invalid');
    }
    
    // Validação de senha
    if (form.senha.value.length < 8) {
        form.senha.classList.add('is-invalid');
        isValid = false;
    } else {
        form.senha.classList.remove('is-invalid');
    }
    
    // Validação de confirmação de senha
    if (form.senha.value !== form.confirmar_senha.value) {
        form.confirmar_senha.classList.add('is-invalid');
        isValid = false;
    } else {
        form.confirmar_senha.classList.remove('is-invalid');
    }
    
    return isValid;
}

// Exporta para uso em outros arquivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateCadastroForm };
} else {
    window.validateCadastroForm = validateCadastroForm;
}