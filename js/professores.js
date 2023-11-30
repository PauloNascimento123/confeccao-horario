// Importando a lista de objetos disciplinas.
import { disciplinas, atualizarPagina,atualizarDisciplinaNoPainel, Disciplina, salvarDisciplinas, obterChaveLocalStorageDisciplinas, carregarResponsavelNoPainel } from "./disciplina.js";


let listaDeProfessores = [];

const paginaAtual = window.location.href;


// Função para criar uma chave única no localStorage para cada página
function obterChaveLocalStorageProfessores() {
    return `listaDeProfessores_${paginaAtual}`;
}


// Função para salvar os professores
function salvarProfessores() {
    if (listaDeProfessores.length >= 0) {
        const listaJSON = JSON.stringify(listaDeProfessores.map(professor => professor.toJSON()));
        localStorage.setItem(obterChaveLocalStorageProfessores(), listaJSON);
        
        console.log('Docentes salvos.');
    } else {
        console.log('Não há docentes para serem salvos.');
    }
    // atualizarPagina();
}

// professor.js
function carregarProfessores() {
    const listaJSON = localStorage.getItem(obterChaveLocalStorageProfessores());
    
    if (!listaJSON) {
        console.log('Nenhum dado salvo no localStorage dos Professores.');
        return [];
    }

    const listaRecuperada = JSON.parse(listaJSON);

    if (Array.isArray(listaRecuperada) && listaRecuperada.length > 0) {
        listaDeProfessores = listaRecuperada.map(objeto => Professor.fromJSON(objeto));

        console.log('Dados carregados.');
        setTimeout(() => {
            console.log('Execução após meio segundo de espera');
            console.log(disciplinas);
            disciplinas.forEach((disciplina) => {
                console.log('Processando disciplina:', disciplina.nome);
            
                const responsavel = disciplina.responsavel;
            
                if (responsavel) {
                    console.log('Responsável encontrado:', responsavel.nome);
            
                    const professorEncontrado = listaDeProfessores.find(professor => professor.nome === responsavel.nome);
            
                    if (professorEncontrado) {
                        console.log('Professor encontrado:', professorEncontrado.nome);
                        carregarResponsavelNoPainel(disciplina.nome, professorEncontrado);
                    } else {
                        console.log('Responsável não carregado no Painel.');
                    }
                }
            });
        }, 400); // 400 milissegundos = meio segundo
        listaDeProfessores.forEach((professor, indice) => {
            adicionarProfessorNasOpcoes(professor.nome, indice);
            adicionarHorariosBloqueadosNoPainel(professor);
        });

    } else {
        console.log('Nenhum dado válido salvo no localStorage dos professores.');
    }

    salvarDisciplinas();
    salvarProfessores();

    return listaDeProfessores;
}





class Professor {
    constructor(nome) {
        this._nome = nome;
        this._diasBloqueados = [];
        this._horasBloqueadas = [];
    }

    get nome() {
        return this._nome;
    }

    set nome(novoNome) {
        return this._nome = novoNome;
    }

    get diasBloqueados() {
        return this._diasBloqueados;
    }

    set diasBloqueados(novoDiaBloqueado) {
        return this._diasBloqueados = novoDiaBloqueado;
    }

    get horasBloqueadas() {
        return this._horasBloqueadas;
    }

    set horasBloqueadas(novasHorasBloqueadas) {
        return this._horasBloqueadas = novasHorasBloqueadas;
    }

    // Método para obter uma representação serializável do objeto
    toJSON() {
        return {
            _nome: this._nome,
            _diasBloqueados: this._diasBloqueados,
            _horasBloqueadas: this._horasBloqueadas
        };
    }

    // Método estático para criar uma instância da classe a partir dos dados serializados
    static fromJSON(json) {
        const professor = new Professor(json._nome);
        professor._diasBloqueados = json._diasBloqueados;
        professor._horasBloqueadas = json._horasBloqueadas;
        return professor;
    }
}


function registrarProfessor(nomeRegistrado) {
    
    if (listaDeProfessores.some(professor => professor.nome === nomeRegistrado)) {
        alert(`O Professor ${nomeRegistrado} já existe.`);
    } else {
        const nome = document.getElementById('professor').value;

        nomeRegistrado = new Professor(nome.toUpperCase());

        listaDeProfessores.push(nomeRegistrado);

        // Adicionar os nomes dos professores ao rol de opções.
        adicionarProfessorNasOpcoes(nome.toUpperCase(), listaDeProfessores.length - 1); // Passar o índice do professor.
    
        console.log(nomeRegistrado);
    }
    salvarDisciplinas();
    salvarProfessores();
}

const enterProfessor = document.getElementById('professor');
enterProfessor.addEventListener('keydown', function (event) {
    if (event.key === "Enter") {
        
        const capturarNomeDoProfessor = document.getElementById('professor').value.toUpperCase();
        
        if(capturarNomeDoProfessor !== '') {
            registrarProfessor(capturarNomeDoProfessor); // Chamar a função para criar uma nova 

            document.getElementById('professor').value = '';
        } else {
            alert('O campo DOCENTE não pode estár vazio.');
        } 

    }
    salvarDisciplinas();
    salvarProfessores();
})

document.getElementById('registrarProfessor').addEventListener('click', function () {
    const capturarNomeDoProfessor = document.getElementById('professor').value.toUpperCase();

    if(capturarNomeDoProfessor !== '') {
        registrarProfessor(capturarNomeDoProfessor); // Chamar a função para criar uma nova instância de Professor

        document.getElementById('professor').value = '';  
    } else {
        alert('O campo DOCENTE não pode estár vazio.');
    }
    salvarDisciplinas();
    salvarProfessores();
})

function adicionarProfessorNasOpcoes(nomeProfessor, index) {
    const opcao = document.createElement("option");
    opcao.value = index; // O índice é utilizado para referenciar à instância completa do professor.
    opcao.textContent = nomeProfessor;

    const opcaoClone = opcao.cloneNode(true);

    const listaDeProfessoresOpcoes = document.getElementById("listaDeProfessoresOpcoes");
    listaDeProfessoresOpcoes.appendChild(opcao);

    const professorResponsavelOpcoes = document.getElementById('professorResponsavelOpcoes');
    professorResponsavelOpcoes.appendChild(opcaoClone);

    // Definir a última opção como selecionada
    listaDeProfessoresOpcoes.selectedIndex = listaDeProfessoresOpcoes.options.length - 1;
    professorResponsavelOpcoes.selectedIndex = professorResponsavelOpcoes.options.length - 1;

    salvarDisciplinas();
    salvarProfessores();
}


document.getElementById('removerProfessorId').addEventListener('click', function () {
    const options = document.getElementById('listaDeProfessoresOpcoes');
    const professorIndice = options.value;
    console.log(`professorIndice: ${professorIndice}`);

    removerProfessor(professorIndice);
    salvarProfessores();
    salvarDisciplinas();
})

// REMOVER PROFESSOR
function removerProfessor(professorIndice) {
    const professor = listaDeProfessores[professorIndice];

    if (professor !== undefined) {
        if (disciplinas.length > 0) {
            // Verificar se o docente é responsável por alguma disciplina
            const responsavelDisciplina = disciplinas.find(disciplina => disciplina.responsavel === professor);

            if (responsavelDisciplina) {
                alert(`Você precisa retirar o(a) docente ${professor.nome} como responsável da disciplina ${responsavelDisciplina.nome} primeiro.`);
            } else {
                // Remover da lista de professores
                listaDeProfessores.splice(professorIndice, 1);
                console.log(listaDeProfessores);
                console.log(disciplinas);

                // Remover da lista de professores responsáveis
                const professorOptions = document.getElementById('listaDeProfessoresOpcoes');
                professorOptions.remove(professorIndice);
                const responsavelOptions = document.getElementById('professorResponsavelOpcoes');
                responsavelOptions.remove(professorIndice);

                alert(`Professor: ${professor.nome.toUpperCase()} removido.`);
                atualizarOpcoes();
                removerTodosOsHorarios(professor);
            }
        }
        // Caso a lista de disciplinas esteja vazia, executar o trecho de remoção de professor
        else {
            // Remover da lista de professores
            listaDeProfessores.splice(professorIndice, 1);
            console.log(listaDeProfessores);
            console.log(disciplinas);

            // Remover da lista de professores responsáveis
            const professorOptions = document.getElementById('listaDeProfessoresOpcoes');
            professorOptions.remove(professorIndice);
            const responsavelOptions = document.getElementById('professorResponsavelOpcoes');
            responsavelOptions.remove(professorIndice);

            alert(`Professor: ${professor.nome.toUpperCase()} removido.`);
            atualizarOpcoes();
            removerTodosOsHorarios(professor);
        }
    } else {
        alert('Nenhum professor selecionado ou não existe.');
    }

    salvarProfessores();
    salvarDisciplinas();
}




// Função para atualizar as opções após remover um professor
function atualizarOpcoes() {
    // Limpar todas as opções existentes
    const opcoesListaDeProfessores = document.getElementById("listaDeProfessoresOpcoes");
    const opcoesProfessorResponsavel = document.getElementById("professorResponsavelOpcoes");

    opcoesListaDeProfessores.innerHTML = "";
    opcoesProfessorResponsavel.innerHTML = "";

    // Adicionar novamente as opções atualizadas
    listaDeProfessores.forEach((professor, index) => {
        adicionarProfessorNasOpcoes(professor.nome, index)    
    });

    salvarDisciplinas();
    salvarProfessores();
}

let diasIncompatives = [];
let horasIncompatives = [];

function verificarCompatHorarios(professorIndice) {
    console.log('A função está sendo chamada.');

    const professor = listaDeProfessores[professorIndice];
    const options1 = document.getElementById('disciplinasOpcoes');
    const disciplinaIndice = options1.value;
    const disciplinaSelecionada = disciplinas[disciplinaIndice];
    
    const inputDias = document.getElementById("diasBloqueados");
    const inputHoras = document.getElementById("horasBloqueadas");

    const diaSelecionado = inputDias.value;
    const horaSelecionada = inputHoras.value;

    if (disciplinaSelecionada.responsavel === professor) {

        for (let dia of disciplinaSelecionada.dias) {
            for (let hora of disciplinaSelecionada.horas) {
                if (dia === diaSelecionado && hora === horaSelecionada || horaSelecionada === 'todos') {
                    diasIncompatives.push(diaSelecionado);
                    horasIncompatives.push(horaSelecionada);

                    document.getElementById('diasBloqueados').value = '';
                    document.getElementById('horasBloqueadas').value = '';     

                    alert(`O(A) Docente ${professor.nome} possui bloqueio(s) no(s) seguinte(s) horário(s):\n\nDia: ${diaSelecionado.toUpperCase()} e Horário(s): ${horaSelecionada.toUpperCase()}.\n\nFaça as correções necessárias.`);
                    return true; // Se houver incompatibilidade, retorna false e encerra a função.
                
                }
                
            }
        }
        
    } else {
        console.log(`O(A) Docente ${professor.nome} não está como responsável da ${disciplinaSelecionada.nome}.`)
        
    }
    salvarDisciplinas();
    salvarProfessores();
    
    return false; // Se não houver incompatibilidade, retorna true.
}


function adicionarHorarioBloqueado(professorIndice) {
    const inputDias = document.getElementById("diasBloqueados");
    const inputHoras = document.getElementById("horasBloqueadas");

    const diaSelecionado = inputDias.value;
    const horaSelecionada = inputHoras.value;
    
    // Pegando o objeto na listaDeProfessores
    const professorSelecionado = listaDeProfessores[professorIndice];
    
    // Verificar se o par já existe na lista de dias e horas bloqueados
    const parJaExiste = professorSelecionado.diasBloqueados.includes(diaSelecionado) &&
                        professorSelecionado.horasBloqueadas.includes(horaSelecionada);

    if (diaSelecionado === '' || horaSelecionada === '') {
        alert('É preciso selecionar dia e hora.')
        
    } else {
        if (!parJaExiste) {
            // Adicionar os dias e horas diretamente ao professor
            professorSelecionado.diasBloqueados.push(diaSelecionado);
            professorSelecionado.horasBloqueadas.push(horaSelecionada);

            console.log(professorSelecionado);

            adicionarHorariosBloqueadosNoPainel(professorSelecionado);
            salvarProfessores();
        } else {
            alert("Esse horário já foi bloqueado pelo professor.");
        }
    }                    
    salvarDisciplinas();
    salvarProfessores();

    return professorSelecionado;
}


// Adicionar horário
document.getElementById('adicionarHorarioBloqueado').addEventListener('click', function () {
    const options = document.getElementById('listaDeProfessoresOpcoes');
    const professorIndice = options.value;
    console.log(`professorIndice: ${professorIndice}`);
    
    const options1 = document.getElementById('disciplinasOpcoes');
    const disciplinaIndice = options1.value;
    console.log(disciplinaIndice);   
    
    if (disciplinaIndice !== '') {
        let verificacao = verificarCompatHorarios(professorIndice);
        
        if (verificacao === false) {
            adicionarHorarioBloqueado(professorIndice); // Chamar a função para criar uma nova instância de Professor.
        }
    }

    if (disciplinaIndice === '') {
        adicionarHorarioBloqueado(professorIndice); // Chamar a função para criar uma nova instância de Professor.
    }  
    salvarDisciplinas();
    salvarProfessores();
});

function adicionarHorariosBloqueadosNoPainel(objeto) {
    const listaDeProfessoresOpcoes = document.getElementById('painelHorariosBloqueados');

    // Limpar o conteúdo anterior da lista
    listaDeProfessoresOpcoes.innerHTML = "";

    for (let i = 0; i < objeto.diasBloqueados.length && i < objeto.horasBloqueadas.length; i++) {
        const dia = objeto.diasBloqueados[i];
        const hora = objeto.horasBloqueadas[i];
        let texto = (`${dia} - ${hora}`).toUpperCase();

        const horario = document.createElement('p');
        horario.textContent = texto; 
        horario.style.fontSize = '60%';
        listaDeProfessoresOpcoes.appendChild(horario);
    }
    salvarDisciplinas();
    salvarProfessores();
}

document.getElementById('desfazerUltimoBloqueio').addEventListener('click', function () {
    const options = document.getElementById('listaDeProfessoresOpcoes');
    const professorIndice = options.value;
    const professorSelecionado = listaDeProfessores[professorIndice];
    console.log(`professorIndice: ${professorIndice}`);
    desfazerUltimoBloqueio(professorSelecionado);
});


function desfazerUltimoBloqueio(professor) {
    if (professor && professor.diasBloqueados && professor.horasBloqueadas) {
        const diaASerRemovido = document.getElementById("diasBloqueados").value;
        const horaASerRemovida = document.getElementById("horasBloqueadas").value;

        // Verificar e remover todas as instâncias dos dias e horas correspondentes
        for (let i = professor.diasBloqueados.length - 1; i >= 0; i--) {
            if (professor.diasBloqueados[i] === diaASerRemovido && professor.horasBloqueadas[i] === horaASerRemovida) {
                professor.diasBloqueados.splice(i, 1);
                professor.horasBloqueadas.splice(i, 1);

                // Remover o parágrafo correspondente
                const listaDeProfessoresOpcoes = document.getElementById('painelHorariosBloqueados');
                const paragrafos = listaDeProfessoresOpcoes.getElementsByTagName('p');

                if (paragrafos.length > i) {
                    const paragrafoARemover = paragrafos[i];
                    listaDeProfessoresOpcoes.removeChild(paragrafoARemover);
                    
                } else {
                    console.error("Não há parágrafos correspondentes a serem removidos.");
                }

                console.log(professor);
            }
        }
    } else {
        console.error("O objeto professor é inválido ou não possui propriedades necessárias.");
    }
    salvarDisciplinas();
    salvarProfessores();

}



document.getElementById('listaDeProfessoresOpcoes').addEventListener('change', function () {
    const options = document.getElementById('listaDeProfessoresOpcoes');
    const professorIndice = options.value;
    const professorSelecionado = listaDeProfessores[professorIndice];

    document.getElementById("painelHorariosBloqueados").innerHTML = "";
    adicionarHorariosBloqueadosNoPainel(professorSelecionado);
});

function removerTodosOsHorarios(professor) {
    if (professor && professor.diasBloqueados && professor.horasBloqueadas) {
        professor.diasBloqueados = [];
        professor.horasBloqueadas = [];
        console.log(professor);

        // Remover todos os parágrafos criados na div listaDeProfessoresOpcoes
        const listaDeProfessoresOpcoes = document.getElementById('painelHorariosBloqueados');
        const paragrafos = listaDeProfessoresOpcoes.getElementsByTagName('p');
        
        // Iterar sobre a NodeList e remover os parágrafos
        for (let i = paragrafos.length - 1; i >= 0; i--) {
            const paragrafo = paragrafos[i];
            listaDeProfessoresOpcoes.removeChild(paragrafo);
        }
    } else {
        console.error("O objeto professor é inválido ou não possui propriedades necessárias.");
    }
    salvarDisciplinas();
    salvarProfessores();

}

export {listaDeProfessores, Professor, removerProfessor, carregarProfessores, salvarProfessores, obterChaveLocalStorageProfessores, adicionarProfessorNasOpcoes, adicionarHorariosBloqueadosNoPainel};