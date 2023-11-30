function gerarXlsx() {
    // Obter o nome da página atual (sem extensão e caminho)
    const enderecoPaginaGeral = window.location;
    console.log(enderecoPaginaGeral);
    const enderecoPagina = window.location.pathname;
    console.log(enderecoPagina);
    const nomePagina = window.location.pathname.split('/').pop().replace('.html', '');
    console.log(nomePagina);
    // Obter elementos da tabela
    const tabelaCorpo = document.getElementById("tabelaInteira");
    const linhas = tabelaCorpo.getElementsByTagName("tr");

    // Criar array para armazenar dados da tabela
    let data = [];

    // Iterar sobre as linhas da tabela
    for (let i = 0; i < linhas.length; i++) {
        const linha = linhas[i];
        const colunas = linha.getElementsByTagName("td");

        // Se for a primeira linha, obter os elementos <th> em vez de <td>
        const celulas = i === 0 ? linha.getElementsByTagName("th") : colunas;

        // Criar array para armazenar dados da linha
        const rowData = [];

        // Iterar sobre as células da linha
        for (let j = 0; j < celulas.length; j++) {
            const celula = celulas[j];
            rowData.push(celula.textContent);
        }

        // Adicionar dados da linha ao array principal
        data.push(rowData);
    }

    // Criar o livro e adicionar a tabela
    const livro = XLSX.utils.book_new();
    const planilha = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(livro, planilha, nomePagina);

    // Salvar o arquivo com o nome da página atual
    XLSX.writeFile(livro, `${nomePagina}.xlsx`);
}


// function iterarPaginas() {
//     // Lista de páginas
//     let paginas = ['periodo1.html', 'periodo2.html', 'periodo3.html', 'periodo4.html',
//         'periodo5.html', 'periodo6.html', 'periodo7.html', 'periodo8.html', 'periodo9.html',
//         'periodo10.html'];
    
//     for(pagina of paginas) {
//         gerarXlsx(pagina);
//     }
// }


// CLONA A TABELA DO PERÍODO E JOGA NA DIV tabelasSalvas.
// function clonarTabela() {
//     // Obter a tabela original
//     const tabelaOriginal = document.getElementById("tabelaInteira");

//     // Clonar a tabela
//     const tabelaClonada = tabelaOriginal.cloneNode(true);

//     // Atribuir um novo ID para a tabela clonada para evitar conflitos com a tabela original
//     const novoId = "tabelaClonada" + Math.floor(Math.random() * 1000);
//     tabelaClonada.setAttribute("id", novoId);

//     // Remover a classe "horario" da tabela clonada (se necessário)
//     tabelaClonada.classList.remove("horario");

//     // Inserir a tabela clonada dentro da div com id "tabelasSalvas"
//     const divTabelasSalvas = document.getElementById("tabelasSalvas");
//     divTabelasSalvas.appendChild(tabelaClonada);

//     // gerarXlsxTabelasSalvas();
// }


// SALVA AS TABELAS EM ABAS DIFERENTES
// function gerarXlsxTabelasSalvas() {
//     // Obter todas as tabelas dentro da div de id=tabelasSalvas
//     const tabelasSalvas = document.getElementById("tabelasSalvas").getElementsByTagName("table");

//     // Criar array para armazenar dados de todas as tabelas
//     let data = [];

//     // Iterar sobre cada tabela
//     for (let i = 0; i < tabelasSalvas.length; i++) {
//         const tabela = tabelasSalvas[i];
//         const linhas = tabela.getElementsByTagName("tr");

//         // Criar array para armazenar dados de uma tabela específica
//         let tabelaData = [];

//         // Iterar sobre as linhas da tabela
//         for (let j = 0; j < linhas.length; j++) {
//             const linha = linhas[j];
//             const colunas = linha.getElementsByTagName("td");

//             // Se for a primeira linha, obter os elementos <th> em vez de <td>
//             const celulas = j === 0 ? linha.getElementsByTagName("th") : colunas;

//             // Criar array para armazenar dados da linha
//             const rowData = [];

//             // Iterar sobre as células da linha
//             for (let k = 0; k < celulas.length; k++) {
//                 const celula = celulas[k];
//                 rowData.push(celula.textContent);
//             }

//             // Adicionar dados da linha ao array da tabela específica
//             tabelaData.push(rowData);
//         }

//         // Adicionar os dados da tabela específica ao array principal
//         data.push({
//             name: `Tabela${i + 1}`, // Nome da aba
//             data: tabelaData,
//         });
//     }

//     // Criar o livro e adicionar as abas para cada tabela
//     const livro = XLSX.utils.book_new();

//     data.forEach(tabela => {
//         const planilha = XLSX.utils.json_to_sheet(tabela.data);
//         XLSX.utils.book_append_sheet(livro, planilha, tabela.name);
//     });

//     // Salvar o arquivo
//     XLSX.writeFile(livro, "tabelas_salvas.xlsx");
// }


// Função para gerar o arquivo DOC
function gerarDOC() {
    // Obter o conteúdo HTML da tabela
    const tabelaCorpo = document.getElementById("tabelaInteira");
    const htmlContent = tabelaCorpo.outerHTML;

    // Converter HTML para DOCX usando mammoth.js
    mammoth.convertToMammoth({ arrayBuffer: htmlContent })
        .then(displayResult)
        .catch(handleError);

    function displayResult(result) {
        // Criar um blob com o conteúdo convertido
        const blob = new Blob([result.arrayBuffer], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });

        // Criar um link de download e clicar nele para baixar o arquivo
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "documento.docx";
        link.click();
    }

    function handleError(err) {
        console.error("Erro ao gerar documento DOCX:", err);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('salvarExterno').addEventListener('click', function() {
        // Objeto para armazenar todos os dados
        let dadosGlobais = {};
    
        // Lista de páginas
        let paginas = ['periodo1.html', 'periodo2.html', 'periodo3.html', 'periodo4.html',
         'periodo5.html', 'periodo6.html', 'periodo7.html', 'periodo8.html', 'periodo9.html',
          'periodo10.html'];
    
        // Itera sobre cada página
        paginas.forEach(function(pagina) {
            // Obtém as chaves específicas da página
            
            let chavesPagina = [
                'disciplinas_https://paulonascimento123.github.io/confeccao-horario/' + pagina,
                'listaDeProfessores_https://paulonascimento123.github.io/confeccao-horario/' + pagina,
                'anotacoesTexto_https://paulonascimento123.github.io/confeccao-horario/' + pagina
            ];
    
            // Objeto para armazenar os dados da página atual
            let dadosPagina = {};
    
            // Obtém os dados do localStorage para cada chave da página
            chavesPagina.forEach(function(chave) {
                let valor = localStorage.getItem(chave);

                // Adiciona a chave ao objeto atendendo as condições
                if (valor !== null && valor !== undefined) {
                    dadosPagina[chave] = valor;
                }
            });
    
            // Armazena os dados da página no objeto global apenas se houver dados válidos
            if (Object.keys(dadosPagina).length > 0) {
                dadosGlobais[pagina] = dadosPagina;
            }
        });
    
        // Cria um blob com os dados e um tipo de MIME
        let blob = new Blob([JSON.stringify(dadosGlobais)], { type: 'application/json' });
    
        // Cria um link para o blob
        let link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
    
        // Define o nome do arquivo
        link.download = 'horarioDireito.json';
    
        // Adiciona o link ao documento
        document.body.appendChild(link);
    
        // Clica no link para iniciar o download
        link.click();
    
        // Remove o link do documento
        document.body.removeChild(link);
        
    });

    document.getElementById('carregarExterno').addEventListener('click', function() {
        // Cria um input de arquivo invisível
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', function() {
            var file = input.files[0];
    
            // Lê o conteúdo do arquivo como texto
            var reader = new FileReader();
            reader.onload = function(e) {
                // Parseia o JSON
                var dadosGlobais = JSON.parse(e.target.result);
    
                // Itera sobre cada página
                for (var pagina in dadosGlobais) {
                    if (dadosGlobais.hasOwnProperty(pagina)) {
                        var dadosPagina = dadosGlobais[pagina];
    
                        // Itera sobre cada chave da página
                        for (var chave in dadosPagina) {
                            if (dadosPagina.hasOwnProperty(chave)) {
                                // Coloca os dados no localStorage
                                localStorage.setItem(chave, dadosPagina[chave]);
                                sessionStorage.setItem(chave, dadosPagina[chave]);
                            }
                        }
                    }
                }
    
                location.reload();
            };
            reader.readAsText(file);
        });
    
        // Clica no input para abrir a janela de seleção de arquivo
        input.click();
    });
    
});