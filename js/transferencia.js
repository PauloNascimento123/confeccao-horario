import { disciplinas } from "./disciplina.js";
import { listaDeProfessores } from "./professores.js";


document.getElementById('gerarDesignacao').addEventListener('click', function () {
    gerarDesignacao();
})


function gerarDesignacao() {
    let listaDesignacao = []
    let listaDeResponsaveis = []
    // listaDeProfessores e disciplinas
    for(let docente of listaDeProfessores) {
        const docenteResponsavel = docente;
        const docenteNome = docenteResponsavel.nome; 
        listaDeResponsaveis.push(docenteNome);
        for(let disciplina of disciplinas) {
            if(docenteResponsavel === disciplina.responsavel) {
                listaDeResponsaveis.push(disciplina.nome);
                listaDesignacao.push(listaDeResponsaveis);
                listaDeResponsaveis = [];
            }
        }
    
        if (listaDeResponsaveis.length <= 1) {
            console.log(`O(A) docente ${docenteResponsavel.nome} não está designado para nenhuma disciplina.`)
        }
    console.log(listaDesignacao);
    }
}
