const adicionarTarefaBtn = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const cancelarFormBtn = document.querySelector('.app__form-footer__button--cancel');
const tarefaEmAndamento = document.querySelector('.app__section-active-task-description');

const removerConcluidasBtn = document.getElementById('btn-remover-concluidas');
const removerTodasBtn = document.getElementById('btn-remover-todas');

// Lista de tarefas no localStorage
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

// Atualizar tarefa no localStorage
function atualizarTarefas() {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Adicionar tarefas
function adicionarTarefas(tarefa) {
    const elementoTarefa = document.createElement('li');
    elementoTarefa.classList.add('app__section-task-list-item');

    const svg = document.createElement('svg');
    svg.innerHTML = `<svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
        <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.17192" fill="#01080e"></path>
    </svg>`;

    const paragrafo = document.createElement('p');
    paragrafo.textContent = tarefa.descricao;
    paragrafo.classList.add('app__section-task-list-item-description');

    const botao = document.createElement('button');
    botao.classList.add('app_button-edit');

    botao.onclick = () => {
        let novaDescricao = prompt('Qual a nova tarefa?');
        if (novaDescricao == null) {
            novaDescricao = tarefa.descricao;
        } else {
            switch (novaDescricao) {
                case '':
                    alert('Digite uma tarefa válida!');
                    break;
            
                default:
                    paragrafo.textContent = novaDescricao;
                    tarefa.descricao = novaDescricao;
                    atualizarTarefas();
                    break;
            }
        }
    }
    
    const botaoImagem = document.createElement('img');
    botaoImagem.setAttribute('src', '/imagens/pen-to-square-regular.svg');
    botaoImagem.setAttribute('width', '24');
    botao.append(botaoImagem);

    elementoTarefa.append(svg);
    elementoTarefa.append(paragrafo);
    elementoTarefa.append(botao);

        if (tarefa.completa) {
            elementoTarefa.classList.add('app__section-task-list-item-complete');
            botao.setAttribute('disabled', 'disabled');
        } else {
            elementoTarefa.onclick = () => {
                document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active');
                });
                if (tarefaSelecionada == tarefa) {
                    tarefaEmAndamento.textContent = '';
                    tarefaSelecionada = null;
                    liTarefaSelecionada = null;
                    return;
                }
                tarefaSelecionada = tarefa;
                liTarefaSelecionada = elementoTarefa;
                tarefaEmAndamento.textContent = tarefa.descricao;
                elementoTarefa.classList.add('app__section-task-list-item-active');
            }
        }

    return elementoTarefa;
}

// Ativar form
adicionarTarefaBtn.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden');
})

// Evento de clicar no botão para adicionar tarefa
formAdicionarTarefa.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const tarefa = {
            descricao: textarea.value,
            completa: false
        }
        
        
        tarefas.push(tarefa);
        const elementoTarefa = adicionarTarefas(tarefa);
        ulTarefas.append(elementoTarefa);
        atualizarTarefas();
        formAdicionarTarefa.classList.add('hidden');
        textarea.value = '';
})

cancelarFormBtn.addEventListener('click', () => {
    formAdicionarTarefa.classList.add('hidden');
})

// Para cada elemento da lista tarefa, se adiciona na lista ul
tarefas.forEach(tarefa => {
    const elementoTarefa = adicionarTarefas(tarefa);
    ulTarefas.append(elementoTarefa);
});

document.addEventListener('focoFinalizado', () => {
    if (tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
})

function removerTarefas(somenteCompletas) {
    let seletor = somenteCompletas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item';
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    })
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
}

removerConcluidasBtn.onclick = () => removerTarefas(true);
removerTodasBtn.onclick = () => removerTarefas(false);
