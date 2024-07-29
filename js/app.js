// Valor do data-contexto
const html = document.querySelector('html');

// Botoes
const focoBtn = document.querySelector('.app__card-button--foco');
const curtoBtn = document.querySelector('.app__card-button--curto');
const longoBtn = document.querySelector('.app__card-button--longo');
const ComecarPausar = document.getElementById('start-pause');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBtn = document.getElementById('start-pause');

// Timer, fotos e texto
const timer = document.getElementById('timer');
const imagem = document.querySelector('.app__image');
const texto = document.querySelector('.app__title');

// Música
const musicaInput = document.getElementById('alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3');
musica.loop = true;
const iniciarAud = new Audio('/sons/play.wav');
const pausarAud = new Audio('/sons/pause.mp3');
const timerFim = new Audio('/sons/beep.mp3');

// Valores timer 
let timerValue = 10;
let intervalo = null;

musicaInput.addEventListener('change', () => {
    if (musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

// Evento do clique
focoBtn.addEventListener('click', () => {
    timerValue = 10;
    alterarContexto('foco');
    focoBtn.classList.add('active');
})

curtoBtn.addEventListener('click', () => {
    timerValue = 300;
    alterarContexto('descanso-curto');
    curtoBtn.classList.add('active');
})

longoBtn.addEventListener('click', () => {
    timerValue = 900;
    alterarContexto('descanso-longo');
    longoBtn.classList.add('active');
})

// Alterar página
function alterarContexto(contexto) {
    mostrarTimer();
    botoes.forEach(function(contexto) {
        contexto.classList.remove('active');
    })
    html.setAttribute('data-contexto', contexto);
    imagem.setAttribute('src', `/imagens/${contexto}.png`);
    switch (contexto) {
        case 'foco':
            texto.innerHTML = `Otimize sua produtividade, <br><strong class="app__title-strong">mergulhe no que importa</strong>`;
            break;
        
        case 'descanso-curto': 
            texto.innerHTML = `Que tal dar uma respirada? <br><strong class="app__title-strong">Faça uma pausa curta!</strong>`;
            break;

        case "descanso-longo":
            texto.innerHTML = `Hora de voltar à superfície. <br><strong class="app__title-strong">Faça uma pausa longa.</strong>`;
            break;

        default:
            break;
    }
}

// Programar a contagem
const contagem = () => {
    if(timerValue <= 0){
        zerar();
        const focoAtivo = html.getAttribute('data-contexto') == 'foco';
        if (focoAtivo) {
            const evento = new CustomEvent('focoFinalizado');
            document.dispatchEvent(evento);
        }
        timerFim.play();
        timerValue = 10;
        mostrarTimer();
        return;
    }
    timerValue -= 1;
    mostrarTimer();
}

// Evento de clique
startPauseBtn.addEventListener('click', iniciarPausar);

// Iniciar e pausar cronômetro
function iniciarPausar() {
    if(intervalo){
        zerar();
        pausarAud.play();
        return;
    }
    intervalo = setInterval(contagem, 1000);
    iniciarAud.play();
    startPauseBtn.innerHTML = '<img class="app__card-primary-butto-icon" src="/imagens/pause.png" alt=""><span>Pausar</span>';
}

// Fim da contagem
function zerar() {
    clearInterval(intervalo);
    startPauseBtn.innerHTML = '<img class="app__card-primary-butto-icon" src="/imagens/play_arrow.png" alt=""><span>Começar</span>';
    intervalo = null;
}

// Mostrar timer na tela
function mostrarTimer() {
    const tempo = new Date(timerValue*1000);
    const tempoFormatado = tempo.toLocaleString('pt-br', {minute: '2-digit', second: '2-digit'});
    timer.innerHTML = `${tempoFormatado}`;
}

mostrarTimer();