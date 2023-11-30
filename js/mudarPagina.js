// Função para destacar o período atual
document.addEventListener("DOMContentLoaded", function () {
    // Obtém o número do período a partir do nome da página
    const numeroPaginaAtual = window.location.pathname.match(/\d+/); // Retorna um number. Ex.: 8
    
    // Remove a classe "selecionado" de todos os links
    const links = document.querySelectorAll("#painelPeriodos a");
    links.forEach(link => link.classList.remove("selecionado"));

    // Adiciona a classe "selecionado" ao link correspondente ao período atual
    if (numeroPaginaAtual && numeroPaginaAtual[0]) {
        const linkAtual = document.querySelector(`#painelPeriodos a[href="periodo${numeroPaginaAtual[0]}.html"]`);
        if (linkAtual) {
            linkAtual.classList.add("selecionado");
        }
    }
});

