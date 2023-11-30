import {listaDeProfessores, Professor, removerProfessor, carregarProfessores,salvarProfessores, obterChaveLocalStorageProfessores, adicionarProfessorNasOpcoes, adicionarHorariosBloqueadosNoPainel} from './professores.js';

let disciplinas = [];

// Retorna o endereço da página como string. Ex: http://127.0.0.1:5501/periodo8.html
const paginaAtual = window.location.href;


// Função para criar uma chave única no localStorage para cada página
function obterChaveLocalStorageDisciplinas() {
    return `disciplinas_${paginaAtual}`;
}

function obterChaveLocalStorageAnotacoes() {
    return `anotacoesTexto_${paginaAtual}`;
}

function atualizarPagina() {
    location.reload();
}

// Função para salvar as anotações
function salvarAnotacoes() {
    let anotacoesValue = document.getElementById('anotacoesTexto').value;

    if (anotacoesValue.length >= 0) {
        localStorage.setItem(obterChaveLocalStorageAnotacoes(), anotacoesValue);
        console.log('Anotações salvas.');
    } else {
        console.log('Não há anotações para salvar.');
    }
}


// Função para salvar as disciplinas
function salvarDisciplinas() {
    if (disciplinas.length >= 0) {
        const listaJSON = JSON.stringify(disciplinas.map(disciplina => disciplina.toJSON()));
        localStorage.setItem(obterChaveLocalStorageDisciplinas(), listaJSON);
        
        console.log('Disciplinas salvas.');
    } else {
        console.log('Não há disciplinas para serem salvas.');
    };

    // atualizarPagina();
}

document.addEventListener("DOMContentLoaded", function() {
    
    // Carregar anotações ao iniciar a página
    document.getElementById('anotacoesTexto').value = localStorage.getItem(obterChaveLocalStorageAnotacoes()) || '';

    // Adicionar evento para salvar anotações quando houver mudança no conteúdo
    document.getElementById('anotacoesTexto').addEventListener('input', salvarAnotacoes);

    const listaJSON = localStorage.getItem(obterChaveLocalStorageDisciplinas());
    const listaRecuperada = JSON.parse(listaJSON);

    const professoresCarregados = carregarProfessores();

    if(listaRecuperada === null) {
        console.log('Nenhum dado salvo no localStorage das disciplinas.');
    } else {
        if (listaRecuperada.length > 0) {
            disciplinas = listaRecuperada.map(objeto => Disciplina.fromJSON(objeto));

            console.log('Dados carregados.');
            
            disciplinas.forEach((disciplina, indice) => {
                // Adicionar os nomes dos professores ao rol de opções.
                adicionarDisciplinaopcoes(disciplina.nome, indice); // Passar o índice do professor.
                adicionarDisciplinaAoPainel(disciplina.nome);

                for (let i = 0; i < disciplina.dias.length; i++) {
                    const dia = disciplina.dias[i];
                    const hora = disciplina.horas[i];
                    carregarDisciplinaNaTabela(disciplina, dia, hora);
                }
                
                // Limitação em 3 dias por disciplina
                if (verificarOcorrenciaDisciplinaMaisTresDiasCarregadas(disciplina) > 3) {
                    // Criar ocorrência na div de id=ocorrencias
                    const ocorrenciasDiv = document.getElementById("ocorrencias");
                    const ocorrenciaParagrafo = document.createElement("p");
                    ocorrenciaParagrafo.textContent = `A Disciplina ${disciplina.nome} está distribuída em mais de três dias.`;
                    // Criar um botão 'X' para remover a ocorrência
                    const botaoRemoverOcorrencia = document.createElement('button');
                    botaoRemoverOcorrencia.textContent = "X";
                    botaoRemoverOcorrencia.style.fontSize = "60%";
                    // Adicionar um evento de clique para remover a ocorrência
                    botaoRemoverOcorrencia.addEventListener('click', () => {
                        ocorrenciasDiv.removeChild(ocorrenciaParagrafo);
                    });

                    // Adicionar o botão de remover antes do parágrafo da ocorrência
                    ocorrenciaParagrafo.appendChild(botaoRemoverOcorrencia);

                    // Adicionar a ocorrência à div de id=ocorrencias
                    ocorrenciasDiv.appendChild(ocorrenciaParagrafo);
                }
            });
        } else {
            console.log('Nenhum dado salvo no localStorage das disciplinas.');
        }
    }
    console.log(disciplinas);
});


function carregarResponsavelNoPainel(nomeDisciplina, responsavel) {
    const listaDisciplinas = document.getElementById('listaDisciplinas');
    const paragrafos = Array.from(listaDisciplinas.getElementsByTagName('p'));

    if(responsavel === null) {
        console.log("Não há responsável atribuído.")
    } else {
        if (responsavel instanceof Professor) {
            console.log(`${responsavel.nome} é uma instância de Professor.`);
            console.log(`E está atribuído(a) à disciplina: ${nomeDisciplina}.`);
        } else {
            console.log(`NÃO é uma instância de Professor.`);
        };
    };
    
    
    // Adicionar a atualização
    for (let paragrafo of paragrafos) {
        const textoParagrafo = paragrafo.textContent;
        console.log(paragrafo);

        if(responsavel && nomeDisciplina === textoParagrafo) {
            // const novoParagrafo = document.createElement('p');

            // novoParagrafo.textContent = textoParagrafo;

            // Adicionar quebra de linha
            paragrafo.appendChild(document.createElement("br"));

            // Adicionar o responsável ao novo parágrafo
            const spanResponsavel = document.createElement("span");
            spanResponsavel.textContent = ` (${responsavel.nome})`;
            spanResponsavel.style.fontSize = "70%";
            paragrafo.appendChild(spanResponsavel);

            // Adicionar o novo parágrafo à listaDisciplinas no PainelDisciplinas
            listaDisciplinas.appendChild(paragrafo);

            break;
        }
    }

}

class Disciplina {
    constructor(nome, responsavel, dias, horas) {
        this._nome = nome;
        this._responsavel = '';
        this._dias = dias;
        this._horas = horas;
    }

    get nome() {
        return this._nome;
    }

    set nome(novoNome) {
        this._nome = novoNome;
    }

    get responsavel() {
        return this._responsavel;
    }

    set responsavel(novoResponsavel) {
        this._responsavel = novoResponsavel;
    }

    get dias() {
        return this._dias;
    }

    set dias(novosDias) {
        this._Dias = novosDias;
    }
    get horas() {
        return this._horas;
    }

    set horas(novasHoras) {
        this._horas = novasHoras;
    }

    // Método para obter uma representação serializável do objeto
    toJSON() {
        return {
            _nome: this._nome,
            _responsavel: this._responsavel ? this._responsavel.toJSON() : null,
            _dias: this._dias,
            _horas: this._horas
        };
    }

    // Método estático para criar uma instância da classe a partir dos dados serializados
    static fromJSON(json) {
        const disciplina = new Disciplina(json._nome, null, json._dias, json._horas);
        disciplina._nome = json._nome;
        disciplina._responsavel = json._responsavel ? Professor.fromJSON(json._responsavel) : null;
        disciplina._dias = json._dias;
        disciplina._horas = json._horas;
        return disciplina;
    }

}

function criarDisciplina(nomeDaDisciplinaCapturado) {
    // Capturar os valores do formulário
    const nome = document.getElementById("nomeDaDisciplina").value;

    // Verificar se o nome está vazio
    if (!nome.trim()) {
        alert("O nome da disciplina não pode estar vazio.");
        return;  // Sai da função sem criar a disciplina
    }

    // Verificar se o nome da disciplina já existe
    if (disciplinas.some(disciplina => disciplina.nome.toUpperCase() === nomeDaDisciplinaCapturado)) {
        alert(`A disciplina ${nomeDaDisciplinaCapturado} já existe. Escolha um nome diferente.`);
    } else {
        // Criar uma nova instância de Disciplina
        nomeDaDisciplinaCapturado = new Disciplina(nome.toUpperCase(), '',[], []);
                
        // Exibir os detalhes da nova disciplina
        console.log("Nova Disciplina:", nomeDaDisciplinaCapturado);
        
        // Adicionar a disciplina à lista
        disciplinas.push(nomeDaDisciplinaCapturado);

        // Adicionar os nomes das disciplinas no rol de opções.
        adicionarDisciplinaopcoes(nome.toUpperCase(), disciplinas.length - 1); // Passar o índice da disciplina.

        // Adicionar o nome da disciplina ao PainelDisciplinas
        adicionarDisciplinaAoPainel(nome.toUpperCase());

    }
    salvarDisciplinas();
    salvarProfessores();
}


const enterDisciplina = document.getElementById('criarDisciplina');
enterDisciplina.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        const capturarDisciplina = document.getElementById('criarDisciplina').value.toUpperCase();
        criarDisciplina(capturarDisciplina); // Chamar a função para criar uma nova 

        document.getElementById('nomeDaDisciplina').value = '';
    }
})

// Adicionar um ouvinte de evento ao formulário para chamar a função ao enviar
document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault(); // Impedir o envio padrão do formulário
    const capturarNomeDaDisciplina = document.getElementById('nomeDaDisciplina').value.toUpperCase();
    console.log(capturarNomeDaDisciplina);
    criarDisciplina(capturarNomeDaDisciplina.toUpperCase()); // Chamar a função para criar uma nova instância de Disciplina

    document.getElementById('nomeDaDisciplina').value = '';
});

// REMOVER DISCIPLINA
document.getElementById('RemoverDisciplinaId').addEventListener('click', function () {
    const options = document.getElementById('disciplinasOpcoes');
    const disciplinaIndice = options.value;
    console.log(`disciplinaIndice: ${disciplinaIndice}`);

    removerDisciplina(disciplinaIndice);
    salvarDisciplinas();
    salvarProfessores();
})

function removerDisciplina(disciplinaIndice) {
    let disciplina = disciplinas[disciplinaIndice];
    removerDisciplinaDoPainel(disciplinaIndice);

    if (disciplina !== null) {
        // Remover da lista de disciplinas
        disciplinas.splice(disciplinaIndice, 1);

        // Remover da lista de disciplinas
        const disciplinaOptions = document.getElementById('disciplinasOpcoes');
        disciplinaOptions.remove(disciplinaIndice);

        alert(`A Disciplina: ${disciplina.nome} foi removida.`);
        
        // Atualizar as opções após remover
        atualizarOpcoes();
    } else {
        alert('Nenhuma disciplina selecionada ou não existe.');
    }
   
    salvarDisciplinas();
    salvarProfessores();
}

// Função para atualizar as opções após remover uma disciplina
function atualizarOpcoes() {
    // Limpar todas as opções existentes
    const opcoesDisciplina = document.getElementById("disciplinasOpcoes");

    if (opcoesDisciplina) {
        opcoesDisciplina.innerHTML = "";

        // Adicionar novamente as opções atualizadas
        disciplinas.forEach((disciplina, index) => {
            adicionarDisciplinaopcoes(disciplina.nome.toUpperCase(), index);
        });
    } else {
        console.error("Elemento 'disciplinasOpcoes' não encontrado.");
    }
}


// Botão Adicionar Responsável
document.getElementById('adicionarResponsavelid').addEventListener('click', function () {
    const options = document.getElementById('disciplinasOpcoes');
    const disciplinaIndice = options.value;
    console.log(`disciplinaIndice: ${disciplinaIndice}`);
    

    adicionarResponsavel(disciplinaIndice);
});

function adicionarResponsavel(disciplinaIndice) {
    const responsavelIndex = document.getElementById("professorResponsavelOpcoes").value;
    const responsavel = listaDeProfessores[responsavelIndex];
    const disciplinaSelecionada = disciplinas[disciplinaIndice];
    console.log(disciplinaSelecionada.responsavel);
    if (disciplinaSelecionada && disciplinaSelecionada.responsavel === '' || disciplinaSelecionada && disciplinaSelecionada.responsavel === null) {
        if (verificarCompatHorarios(disciplinaSelecionada, responsavel) === false) {
            disciplinaSelecionada.responsavel = responsavel;
            console.log(disciplinaSelecionada);

            // Chamar a função para adicionar a disciplina ao PainelDisciplinas com o responsável
            adicionarDisciplinaAoPainel(disciplinaSelecionada.nome.toUpperCase());
            // Atualizar a função após adicionar o responsável
            atualizarDisciplinaNoPainel(disciplinaSelecionada.nome.toUpperCase(), disciplinaSelecionada.responsavel);
        }
    } else {
        console.error('A disciplina selecionada é inválida ou a propriedade "responsavel" já está preenchida.');
        alert(`A disciplina ${disciplinaSelecionada.nome} já possui um responsável atribuído.`);
    }
    salvarDisciplinas();
    salvarProfessores();
}

// Função para atualizar a disciplina no painel após adicionar o responsável
function atualizarDisciplinaNoPainel(nomeDisciplina, responsavel) {
    const listaDisciplinas = document.getElementById('listaDisciplinas');
    const paragrafos = listaDisciplinas.getElementsByTagName('p');

    // Remover a disciplina existente, se existir
    for (let i = paragrafos.length - 1; i >= 0; i--) {
        const paragrafo = paragrafos[i];

        if (paragrafo.textContent.includes(nomeDisciplina)) {
            listaDisciplinas.removeChild(paragrafo);
        }
    }

    // Adicionar a atualização
    const novoParagrafo = document.createElement("p");
    novoParagrafo.textContent = nomeDisciplina;

    // Adicionar quebra de linha
    novoParagrafo.appendChild(document.createElement("br"));
    
    if(responsavel !== null) {
        // Adicionar o responsável ao novo parágrafo
        const spanResponsavel = document.createElement("span");
        spanResponsavel.textContent = ` (${responsavel.nome})`;
        spanResponsavel.style.fontSize = "90%";
        novoParagrafo.appendChild(spanResponsavel);

        // Adicionar o novo parágrafo à listaDisciplinas no PainelDisciplinas
        listaDisciplinas.appendChild(novoParagrafo);
    } else {
        // Adicionar o responsável ao novo parágrafo
        const spanResponsavel = document.createElement("span");
        spanResponsavel.textContent = null;
        novoParagrafo.appendChild(spanResponsavel);

        // Adicionar o novo parágrafo à listaDisciplinas no PainelDisciplinas
        listaDisciplinas.appendChild(novoParagrafo);
    }
    salvarDisciplinas();
    salvarProfessores();
}


// REMOVER RESPONSÁVEL
document.getElementById('removerResponsavelid').addEventListener('click', function () {
    const options = document.getElementById('disciplinasOpcoes');
    const disciplinaIndice = options.value;
  
    removerResponsavel(disciplinaIndice);

})


function removerResponsavel(disciplinaIndice) {
    const responsavelIndex = document.getElementById("professorResponsavelOpcoes").value;
    const responsavel = listaDeProfessores[responsavelIndex];
    const disciplinaSelecionada = disciplinas[disciplinaIndice];

    if (disciplinaSelecionada.responsavel !== null) {
        if (responsavel.nome === disciplinaSelecionada.responsavel.nome) {
            disciplinaSelecionada.responsavel = '';
            // console.log(disciplinaSelecionada.responsavel); UNDEFINED
            atualizarDisciplinaNoPainel(disciplinaSelecionada.nome, '');
            salvarDisciplinas();
        };

    } else {
        alert(`O(A) docente ${responsavel.nome} não consta na disciplina de ${disciplinaSelecionada.nome}.`)
    }

    
    salvarDisciplinas();
    salvarProfessores();
}


function adicionarHorario(disciplinaIndice) {

    
    const inputDias = document.getElementById("dias");
    const inputHoras = document.getElementById("horas");

    const diaSelecionado = inputDias.value;
    const horaSelecionada = inputHoras.value;

    if(((paginaAtual === 'http://127.0.0.1:5501/periodo8.html' || paginaAtual === 'http://127.0.0.1:5501/periodo9.html' || paginaAtual === 'http://127.0.0.1:5501/periodo10.html') && (diaSelecionado === 'segunda' || diaSelecionado === 'sexta'))) {
        alert('Esta célula está bloqueada. Não é possível inserir informações.');
        return
    } else {
        const disciplinaSelecionada = disciplinas[disciplinaIndice];
   
        // Verificar se o dia e a hora já foram adicionados
        const horarioExistente = disciplinaSelecionada.dias.some((dia, index) => dia === diaSelecionado && disciplinaSelecionada.horas[index] === horaSelecionada);
    
        // Adicionar os dias e horas diretamente à disciplina
        if (diaSelecionado === '' || horaSelecionada === '') {
            alert('É preciso selecionar dia e hora.')
        } else {
            if (disciplinaSelecionada instanceof Disciplina) {
                if (horarioExistente) {
                    alert("Esse horário já foi adicionado.");
                } else {
                    disciplinaSelecionada.dias.push(diaSelecionado);
                    disciplinaSelecionada.horas.push(horaSelecionada);
                
                    adicionarDisciplinaNaTabela();
                }
            } else {
                console.error("A diciplina selecionada não é uma instância de Disciplina.");
                alert('Antes de adicionar horário é preciso criar ou selecionar uma Disciplina.')
            }  
        }
    }    
    
    salvarDisciplinas();
    salvarProfessores();
    
}

// Adicionar horário
document.getElementById('adicionarHorario').addEventListener('click', function () {
    const options = document.getElementById('disciplinasOpcoes');
    const disciplinaIndice = options.value;
    const disciplinaSelecionada = disciplinas[disciplinaIndice];
    console.log(`disciplinaIndice: ${disciplinaIndice}`);

    const options1 = document.getElementById('professorResponsavelOpcoes');
    const professorIndice = options1.value;
    const professorSelecionado = listaDeProfessores[professorIndice];
    console.log(`professor selecionado: ${typeof(professorSelecionado)}`);
    console.log(disciplinaSelecionada.responsavel);
    
    if (professorSelecionado === undefined || disciplinaSelecionada.responsavel === '') {
        adicionarHorario(disciplinaIndice); // Chamar a função para criar uma nova instância de Disciplina
    }

    if (disciplinaSelecionada.responsavel) {
        const verifcacao = verificarCompatHorarios(disciplinaSelecionada, professorSelecionado);
        if (verifcacao === false) {
            adicionarHorario(disciplinaIndice);
        }
    }
    salvarDisciplinas();
    salvarProfessores();    
});


function adicionarDisciplinaopcoes(nomeDisciplina, index) {
    const opcao = document.createElement("option");
    
    opcao.value = index; // O índice é utilizado para referenciar à instância completa da disciplina.
    opcao.textContent = nomeDisciplina;

    const disciplinasOpcoes = document.getElementById("disciplinasOpcoes");
    disciplinasOpcoes.appendChild(opcao);

    // Definir a última opção como selecionada
    disciplinasOpcoes.selectedIndex = disciplinasOpcoes.options.length - 1;
    salvarDisciplinas();
    salvarProfessores();
}

function adicionarDisciplinaAoPainel(nomeDisciplina) {
    // Verificar o número de parágrafos
    const numeroDeParagrafos = document.querySelectorAll("#listaDisciplinas p").length;
    
    if (numeroDeParagrafos < 12) {
        // Criar um novo elemento de parágrafo
        const paragrafo = document.createElement("p");

        // Adicionar o nome da disciplina como conteúdo do parágrafo
        paragrafo.textContent = nomeDisciplina;

        // Adicionar o parágrafo à listaDisciplinas no PainelDisciplinas
        document.getElementById("listaDisciplinas").appendChild(paragrafo);
    } else {
        alert("Você atingiu o limite máximo de 12 disciplinas.");
    }
    salvarDisciplinas();
    salvarProfessores();
}

// Função para remover a disciplina do painel
function removerDisciplinaDoPainel(disciplinaIndice) {
    const disciplinaSelecionada = disciplinas[disciplinaIndice];

    if (disciplinaSelecionada) {
        // Remover a disciplina do painel com id=listaDisciplinas
        const listaDisciplinas = document.getElementById('listaDisciplinas');

        // Encontrar o parágrafo correspondente e removê-lo
        const paragrafos = listaDisciplinas.getElementsByTagName('p');
        
        for (let paragrafo of paragrafos) {
            if (paragrafo.textContent === disciplinaSelecionada.nome.toUpperCase()) {
                listaDisciplinas.removeChild(paragrafo);
                break; // Parar o loop após encontrar e remover o parágrafo
            }
        }

        // Remover da tabela
        removerDisciplinaDaTabela(disciplinaSelecionada.nome);
    } else {
        alert("O objeto disciplina é inválido ou não foi inserido.");
    }
    location.reload();

    salvarDisciplinas();
    salvarProfessores();

}

// Função para remover a disciplina da tabela
function removerDisciplinaDaTabela(disciplinaNome) {
    const tabelaCorpo = document.getElementById("tabelaCorpo");

    // Iterar sobre as linhas da tabela
    for (let i = 0; i < tabelaCorpo.rows.length; i++) {
        const row = tabelaCorpo.rows[i];

        // Iterar sobre as células da linha, excluindo a primeira que contém o horário
        for (let j = 1; j < row.cells.length; j++) {
            const cell = row.cells[j];

            // Remover todos os parágrafos com o nome da disciplina
            const paragrafos = cell.getElementsByTagName("p");
            for (let k = paragrafos.length - 1; k >= 0; k--) {
                const paragrafo = paragrafos[k];
                if (paragrafo.textContent === disciplinaNome) {
                    paragrafo.parentNode.removeChild(paragrafo);
                }
            }
        }
    }
    salvarDisciplinas();
    salvarProfessores();

}


// ADICIONAR DISCIPLINA NA TABELA // CHAMADA NO FORMULÁRIO
function adicionarDisciplinaNaTabela() {
    // Capturar os valores 
    const options = document.getElementById('disciplinasOpcoes');
    const disciplinaNome = options.options[options.selectedIndex].textContent;
    const dia = document.getElementById("dias").value;
    const hora = document.getElementById("horas").value;

    // Encontrar a célula correspondente na tabela
    const tabelaCorpo = document.getElementById("tabelaCorpo");
    const horas = document.getElementsByTagName("tr");

    for (let tr of horas) {
        if (tr.getAttribute('name') == hora) {
            const celulas = tr.getElementsByTagName("td");

            for (let td of celulas) {
                if (td.getAttribute('name') == dia) {
                    // Verificar se já existe uma disciplina na célula
                    const disciplinasNaCelula = td.getElementsByTagName("p");

                    // Criar um novo elemento de parágrafo
                    const paragrafo = document.createElement("p");
                    paragrafo.textContent = disciplinaNome;
                    paragrafo.style.fontSize = "75%";

                    // Adicionar o parágrafo à listaDisciplinas no PainelDisciplinas
                    td.appendChild(paragrafo);

                    // Se já existir uma disciplina, criar uma ocorrência
                    if (disciplinasNaCelula.length > 1) {
                        // Criar ocorrência na div de id=ocorrencias
                        const ocorrenciasDiv = document.getElementById("ocorrencias");
                        const ocorrenciaParagrafo = document.createElement("p");
                        ocorrenciaParagrafo.textContent = `Mais de uma disciplina está inserida na(o) ${dia.toUpperCase()} às ${hora}.`;

                        // Criar um botão 'X' para remover a ocorrência
                        const botaoRemoverOcorrencia = document.createElement('button');
                        botaoRemoverOcorrencia.textContent = "X";
                        botaoRemoverOcorrencia.style.fontSize = "60%";
                        // Adicionar um evento de clique para remover a ocorrência
                        botaoRemoverOcorrencia.addEventListener('click', () => {
                            ocorrenciasDiv.removeChild(ocorrenciaParagrafo);
                        });

                        // Adicionar o botão de remover antes do parágrafo da ocorrência
                        ocorrenciaParagrafo.appendChild(botaoRemoverOcorrencia);

                        // Adicionar a ocorrência à div de id=ocorrencias
                        ocorrenciasDiv.appendChild(ocorrenciaParagrafo);
                    }

                    return false; // Impedir o envio padrão do formulário
                }
            }
        }
    }
    salvarDisciplinas();
    salvarProfessores();
    // Se não encontrar a célula correspondente, exibir um alerta
    alert("Célula correspondente não encontrada!");
    return false; // Impedir o envio padrão do formulário
}

// Função para verificar e registrar a ocorrência para disciplinas em mais de 3 dias.
function verificarOcorrenciaDisciplinaMaisTresDias(disciplina) {
    const tabelaCorpo = document.getElementById("tabelaCorpo");

    // Iterar sobre as disciplinas
    disciplinas.forEach(disciplina => {
        let contagem = 0;

        // Iterar sobre as linhas da tabela
        for (let i = 0; i < tabelaCorpo.rows.length; i++) {
            const row = tabelaCorpo.rows[i];
            
            // Iterar sobre as células da linha, excluindo a primeira que contém o horário
            for (let j = 1; j < row.cells.length; j++) {
                const cell = row.cells[j];

                // Contar todos os parágrafos com o nome da disciplina
                const paragrafos = cell.getElementsByTagName("p");
                for (let k = 0; k < paragrafos.length; k++) {
                    const paragrafo = paragrafos[k];
                    if (paragrafo.textContent === disciplina.nome) {
                        contagem++;
                        console.log(contagem);
                    }
                }
            }
        }

        // Imprimir a contagem para a disciplina atual
        console.log(`Quantidade de disciplinas "${disciplina.nome}": ${contagem}`);
        // Limitação em 3 dias por disciplina
        if (contagem > 3) {
            // Criar ocorrência na div de id=ocorrencias
            const ocorrenciasDiv = document.getElementById("ocorrencias");
            const ocorrenciaParagrafo = document.createElement("p");
            ocorrenciaParagrafo.textContent = `A Disciplina ${disciplina.nome} está distribuída em mais de três dias.`;
            // Criar um botão 'X' para remover a ocorrência
            const botaoRemoverOcorrencia = document.createElement('button');
            botaoRemoverOcorrencia.textContent = "X";
            botaoRemoverOcorrencia.style.fontSize = "60%";
            // Adicionar um evento de clique para remover a ocorrência
            botaoRemoverOcorrencia.addEventListener('click', () => {
                ocorrenciasDiv.removeChild(ocorrenciaParagrafo);
            });

            // Adicionar o botão de remover antes do parágrafo da ocorrência
            ocorrenciaParagrafo.appendChild(botaoRemoverOcorrencia);

            // Adicionar a ocorrência à div de id=ocorrencias
            ocorrenciasDiv.appendChild(ocorrenciaParagrafo);
        }

    });
}


function verificarOcorrenciaDisciplinaMaisTresDiasCarregadas(disciplina) {
    const tabelaCorpo = document.getElementById("tabelaCorpo");
    const diasSemana = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

    // Criar arrays para cada dia da semana
    const domingo = [];
    const segunda = [];
    const terca = [];
    const quarta = [];
    const quinta = [];
    const sexta = [];
    const sabado = [];

    // Iterar sobre as linhas da tabela
    for (let i = 0; i < tabelaCorpo.rows.length; i++) {
        const row = tabelaCorpo.rows[i];

        // Iterar sobre as células da linha
        for (let j = 1; j < row.cells.length; j++) {
            const cell = row.cells[j];
            const dia = diasSemana[j - 1];

            // Adicionar o valor da célula ao array correspondente ao dia
            const paragrafos = cell.getElementsByTagName("p");
            for (let k = 0; k < paragrafos.length; k++) {
                const paragrafo = paragrafos[k];
                const valorCelula = paragrafo.textContent.trim(); // Remover espaços em branco

                switch (dia) {
                    case "domingo":
                        domingo.push(valorCelula);
                        break;
                    case "segunda":
                        segunda.push(valorCelula);
                        break;
                    case "terca":
                        terca.push(valorCelula);
                        break;
                    case "quarta":
                        quarta.push(valorCelula);
                        break;
                    case "quinta":
                        quinta.push(valorCelula);
                        break;
                    case "sexta":
                        sexta.push(valorCelula);
                        break;
                    case "sabado":
                        sabado.push(valorCelula);
                        break;
                }
            }
        }
    }

    const semana = [[domingo], [segunda], [terca],[quarta],[quinta],[sexta],[sabado]];

    let contagem = 0
    for(let i = 0; i < semana.length; i++) {
        let dias1 = semana[i];
        
        for( let j = 0; j < dias1.length; j++) {
            let dias2 = dias1[j];
            
            for(let k = 0; k < dias2.length; k++) {
                const dia = dias2[k];
                
                if(disciplina.nome === dia) {
                    contagem+=1;
                    break;
                } else {
                    contagem+=0;
                }
            }   
        }
    }
    console.log(`A disciplina: ${disciplina.nome} está presente em ${contagem} dias.`);
    return contagem;
}



// ADICIONAR DISCIPLINA NA TABELA // CHAMADA NO FORMULÁRIO
function carregarDisciplinaNaTabela(disciplina, dia, hora) {

    // Encontrar a célula correspondente na tabela
    // const tabelaCorpo = document.getElementById("tabelaCorpo");
    const horas = document.getElementsByTagName("tr");

    for (let tr of horas) {
        if (tr.getAttribute('name') == hora) {
            const celulas = tr.getElementsByTagName("td");
            
            for (let td of celulas) {
                if (td.getAttribute('name') == dia) {
                    // Verifique se há disciplinas existentes e remova apenas aquelas com o mesmo nome
                    const disciplinasNaCelula = td.getElementsByTagName("p");
                    
                    for (let disciplinaExistente of disciplinasNaCelula) {
                        if (disciplinaExistente.textContent === disciplina.nome) {
                            td.removeChild(disciplinaExistente);
                        }
                    }

                    // Criar um novo elemento de parágrafo
                    const paragrafo = document.createElement("p");
                    paragrafo.textContent = disciplina.nome;
                    paragrafo.style.fontSize = "75%";
                    
                    // Adicionar o parágrafo à listaDisciplinas no PainelDisciplinas
                    td.appendChild(paragrafo);

                    // Se já existir uma disciplina, criar uma ocorrência
                    if (disciplinasNaCelula.length > 1) {
                        // Criar ocorrência na div de id=ocorrencias
                        const ocorrenciasDiv = document.getElementById("ocorrencias");
                        const ocorrenciaParagrafo = document.createElement("p");
                        ocorrenciaParagrafo.textContent = `Mais de uma disciplina está inserida na(o) ${dia} e ${hora}.`;

                        // Criar um botão 'X' para remover a ocorrência
                        const botaoRemoverOcorrencia = document.createElement('button');
                        botaoRemoverOcorrencia.textContent = "X";
                        botaoRemoverOcorrencia.style.fontSize = "60%";
                        // Adicionar um evento de clique para remover a ocorrência
                        botaoRemoverOcorrencia.addEventListener('click', () => {
                            ocorrenciasDiv.removeChild(ocorrenciaParagrafo);
                        });

                        // Adicionar o botão de remover antes do parágrafo da ocorrência
                        ocorrenciaParagrafo.appendChild(botaoRemoverOcorrencia);

                        // Adicionar a ocorrência à div de id=ocorrencias
                        ocorrenciasDiv.appendChild(ocorrenciaParagrafo);
                    }

                    salvarDisciplinas();
                    salvarProfessores();
                    return // Impedir o envio padrão do formulário
                }
            }
        }
    }

    // Se não encontrar a célula correspondente, exibir um alerta
    alert("Célula correspondente não encontrada!");
    return false; // Impedir o envio padrão do formulário
}



let diasIncompatives = [];
let horasIncompatives = [];

function verificarCompatHorarios(disciplinaSelecionada, responsavel) {
    for (let dia of disciplinaSelecionada.dias) {
        for (let hora of disciplinaSelecionada.horas) {
            for (let diaR of responsavel.diasBloqueados) {
                for (let horaR of responsavel.horasBloqueadas) {
                    if ((dia === diaR) && (hora === horaR || horaR === 'todos')) {
                        diasIncompatives.push(diaR);
                        horasIncompatives.push(horaR);

                        document.getElementById('dias').valeu = '';
                        document.getElementById('horas').valeu = '';

                        alert(`O(A) Docente ${responsavel.nome} possui bloqueio(s) no(s) seguinte(s) horário(s):\n\nDia: ${diaR.toUpperCase()} e Horário(s): ${horaR.toUpperCase()}.\n\nFaça a correção.`);
                        return true; // Se houver incompatibilidade, retorna false e encerra a função.
                    }
                }
            }
        }
    }
    salvarDisciplinas();
    salvarProfessores();
    
    return false; // Se não houver incompatibilidade, retorna true.
}

// REMOVER HORÁRIO
document.getElementById('retirarUltimoHorario').addEventListener('click', function () {
    const options = document.getElementById('disciplinasOpcoes');
    const disciplinaIndice = options.value;
    console.log(`disciplinaIndice: ${disciplinaIndice}`);
    
    desfazerHorario(disciplinaIndice); // Chamar a função para criar uma nova instância de Disciplina
});

function desfazerHorario(disciplinaIndice) {
    const disciplinaSelecionada = disciplinas[disciplinaIndice];

    if (disciplinaSelecionada && disciplinaSelecionada.dias && disciplinaSelecionada.horas) {
        const diaASerRemovido = document.getElementById("dias").value;
        const horaASerRemovida = document.getElementById("horas").value;

        let remocaoRealizada = false;

        // Verificar e remover todas as instâncias dos dias e horas correspondentes
        for (let i = disciplinaSelecionada.dias.length - 1; i >= 0; i--) {
            if (disciplinaSelecionada.dias[i] === diaASerRemovido && disciplinaSelecionada.horas[i] === horaASerRemovida) {
                disciplinaSelecionada.dias.splice(i, 1);
                disciplinaSelecionada.horas.splice(i, 1);
                remocaoRealizada = true;
            }
        }

        console.log(disciplinaSelecionada);

        if (remocaoRealizada) {
            // Remover o horário da tabela
            const remocaoTabela = removerHorarioDaTabela(diaASerRemovido, horaASerRemovida);

            // Remover a ocorrência, se existir
            if (remocaoTabela) {
                removerOcorrencia(diaASerRemovido, horaASerRemovida);
            }
        } else {
            console.error("Os dias e horas não correspondem aos valores na disciplina.");
        }
    } else {
        console.error("O objeto disciplina é inválido ou não possui propriedades necessárias.");
        alert('A disciplina selecionada não contém o horário selecionado.')
    }
    salvarDisciplinas();
    salvarProfessores();
}



function removerHorarioDaTabela() {
    // Capturar os valores 
    const options = document.getElementById('disciplinasOpcoes');
    console.log(options);
    const disciplinaNome = options.options[options.selectedIndex].textContent;
    console.log(`disciplinaNome: ${disciplinaNome}`);
    const dia = document.getElementById("dias").value;
    const hora = document.getElementById("horas").value;
    
    // Encontrar a célula correspondente na tabela
    const horas = document.getElementsByTagName("tr");
    
    for (let tr of horas) {
        if (tr.getAttribute('name') == hora) {
            const celulas = tr.getElementsByTagName("td");

            for (let td of celulas) {
                if (td.getAttribute('name') == dia) {
                    // Remover todos os parágrafos filhos da célula
                    while (td.firstChild) {
                        td.removeChild(td.firstChild);
                    }
                }
            }
        }
    }
    
    salvarDisciplinas();
    salvarProfessores();

    
    // Se não encontrar a célula correspondente, exibir um alerta
    // alert("Célula correspondente não encontrada!");
    return false; // Impedir o envio padrão do formulário
}

function limparDados() {
    console.log(disciplinas);
    console.log(listaDeProfessores);
    disciplinas.splice(0, disciplinas.length);  // Limpa a lista de disciplinas
    listaDeProfessores.splice(0, listaDeProfessores.length);  // Limpa a lista de professores
    location.reload();
}

document.getElementById('limparProfessoresEDisciplinas').addEventListener('click', function() {

    limparDados();
    
    // Salvar antes de recarregar
    salvarDisciplinas();
    salvarProfessores();
});


document.getElementById('gerarDesignacao').addEventListener('click', function () {
    gerarDesignacao();
})


function gerarDesignacao() {
    let listaDesignacao = []
    
    // listaDeProfessores e disciplinas
    for(let docente of listaDeProfessores) {
        const docenteResponsavel = docente;
        const docenteNome = docenteResponsavel.nome; // OK
        let listaDeResponsaveis = []
        listaDeResponsaveis.push(docenteNome);
        
        for(let disciplina of disciplinas) {
            if(docenteNome === disciplina.responsavel.nome) {
                listaDeResponsaveis.push(disciplina.nome);            
            } 
        }
    
        if (listaDeResponsaveis.length <= 1) {
            console.log(`O(A) docente ${docenteResponsavel.nome} não está designado para nenhuma disciplina.`)
            
        }
        if(listaDeResponsaveis.length > 1) {
            listaDesignacao.push(listaDeResponsaveis);
            console.log(listaDesignacao);
            console.log(listaDesignacao[0][0]);
            console.log(typeof(listaDesignacao[0][0]));
        }
        
    }
    // Criar uma matriz para todas as informações
    let allData = [['Nome do Professor', 'Disciplinas']];

    // Iterar sobre a listaDesignacoes
    listaDesignacao.forEach((listaDeResponsaveis) => {
    const nomeProfessor = listaDeResponsaveis[0];

    // Adicionar cada par nome/disciplina à matriz geral
    for (let i = 1; i < listaDeResponsaveis.length; i++) {
        allData.push([nomeProfessor, listaDeResponsaveis[i]]);
    }
    });

    // Criar uma nova planilha
    const wb = XLSX.utils.book_new();

    // Criar uma nova planilha com todas as informações
    const ws = XLSX.utils.aoa_to_sheet(allData);

    // Adicionar a planilha ao livro
    XLSX.utils.book_append_sheet(wb, ws, 'Todas as Informações');

    // Salvar o arquivo XLSX
    const outputPath = 'designacao.xlsx';
    XLSX.writeFile(wb, outputPath);

    console.log(`Arquivo XLSX gerado em: ${outputPath}`);
}


export {disciplinas, atualizarPagina,atualizarDisciplinaNoPainel, Disciplina, salvarDisciplinas, obterChaveLocalStorageDisciplinas, carregarResponsavelNoPainel}; // Exportando para que eu possa acessá-la em outros arquivos.