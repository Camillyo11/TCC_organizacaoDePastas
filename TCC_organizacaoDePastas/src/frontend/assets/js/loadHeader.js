 function loadHeader() {
    const basePath = '/TCC_organizacaoDePastas/src/frontend/';
    const paths = {
        header: `${basePath}UserPages/header.html`,
        css: `${basePath}assets/css/navbarFooter.css`,
        js: `${basePath}assets/js/navbar.js`
    };

    fetch(paths.header)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.text();
        })
        .then(html => {
            document.getElementById('header-container').innerHTML = html;

            // Verificação ao carregar a página
document.addEventListener('DOMContentLoaded', function() {
    updateAccountButton();
    
    // Se não estiver logado, mostra o modal
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
        modal.show();
    }
});
            
            // Carrega CSS
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = paths.css;
            document.head.appendChild(link);
            
            // Carrega JS
            const script = document.createElement('script');
            script.src = paths.js;
            document.body.appendChild(script);
        })
        .catch(error => {
            console.error('Erro ao carregar header:', error);
            document.getElementById('header-container').innerHTML = `
                <nav class="navbar bg-dark">
                    <div class="container">
                        <span class="navbar-brand text-white">BELLA MASSA</span>
                    </div>
                </nav>`;
        });
}

// Inicialização segura
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
} else {
    loadHeader();
} 