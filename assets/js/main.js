$(document).ready(function () {
    // Variáveis para armazenar os símbolos dos jogadores e o estado do jogo
    var user, computer;
    var $tiles = $('.casa'); // Seleciona todas as casas do tabuleiro
    var $userScore = $('.stats_user .score'); // Seleciona o elemento de pontuação do usuário
    var $compScore = $('.stats_computer .score'); // Seleciona o elemento de pontuação do computador
    var $msg = $('.msg'); // Seleciona a área de mensagens
    var userTurn = true, round = 0; // Estado inicial do jogo: turno do usuário e número da rodada

    // Evento para iniciar o jogo quando o usuário escolhe 'X' ou 'O'
    $('.start span').on('click', function () {
        user = this.innerHTML; // Define o símbolo do usuário
        computer = user === 'X' ? 'O' : 'X'; // Define o símbolo do computador
        $('.start').fadeOut(); // Esconde a tela de escolha
        checkTurn(); // Verifica de quem é a vez de jogar
    });

    // Evento de clique para as casas do tabuleiro
    $tiles.on('click', function () {
        if (this.innerHTML === '' && userTurn) {
            userTurn = false; // Marca o fim do turno do usuário
            this.innerHTML = user; // Marca a jogada do usuário
            if (!isGameOver()) playComputer(); // Verifica se o jogo acabou; se não, o computador joga
        }
    });

    // Função para verificar se o jogo terminou
    function isGameOver() {
        if (checkWin(user)) {
            endGame('Você ganhou!', $userScore); // Usuário venceu
            return true;
        }
        if (checkWin(computer)) {
            endGame('Você perdeu!', $compScore); // Computador venceu
            return true;
        }
        if (checkDraw()) {
            endGame('Empate!'); // Jogo empatado
            return true;
        }
        return false;
    }

    // Função para verificar se um jogador venceu
    function checkWin(player) {
        var winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
            [0, 4, 8], [2, 4, 6]             // Diagonais
        ];

        // Verifica se alguma das combinações de vitória está preenchida pelo mesmo jogador
        return winPatterns.some(function (pattern) {
            if (pattern.every(index => $tiles[index].innerHTML === player)) {
                pattern.forEach(index => $tiles[index].style.color = '#ed6060'); // Marca a linha vencedora em vermelho
                return true;
            }
            return false;
        });
    }

    // Função para verificar se o jogo empatou
    function checkDraw() {
        return Array.from($tiles).every(tile => tile.innerHTML !== '');
    }

    // Função para finalizar o jogo, exibindo a mensagem e atualizando a pontuação
    function endGame(message, $score) {
        $msg.html(message);
        if ($score) $score.html(parseInt($score.html()) + 1); // Incrementa a pontuação
        setTimeout(resetBoard, 3000); // Reseta o tabuleiro após 3 segundos
    }

    // Função para resetar o tabuleiro
    function resetBoard() {
        $msg.html(''); // Limpa a mensagem
        $tiles.each(function () {
            this.style.color = 'rgb(254, 254, 254)'; // Reseta a cor
            this.innerHTML = ''; // Limpa a casa
        });
        round++; // Incrementa a rodada
        checkTurn(); // Verifica de quem é a vez de jogar
    }

    // Função para verificar de quem é a vez de jogar
    function checkTurn() {
        if (round % 2 === 0) {
            $msg.html('Comece'); // Mensagem para o usuário começar
            userTurn = true;
        } else {
            userTurn = false;
            playComputer(); // Computador começa
        }
        setTimeout(function () { $msg.html(''); }, 3000); // Limpa a mensagem após 3 segundos
    }

    // Função para a jogada do computador
    function playComputer() {
        if (!makeMove(computer) && !makeMove(user)) {
            var emptyTiles = $tiles.filter(function () { return this.innerHTML === ''; }); // Encontra casas vazias
            var randomTile = emptyTiles[Math.floor(Math.random() * emptyTiles.length)]; // Escolhe uma casa aleatória
            randomTile.innerHTML = computer; // Marca a jogada do computador
        }
        if (!isGameOver()) userTurn = true; // Se o jogo não acabou, é a vez do usuário
    }

    // Função para fazer uma jogada
    function makeMove(player) {
        return checkLines(player, getRow) || checkLines(player, getColumn) || checkLines(player, getDiagonal); // Verifica linhas, colunas e diagonais
    }

    // Função para verificar as linhas, colunas ou diagonais
    function checkLines(player, getLine) {
        for (var i = 0; i < 3; i++) {
            var line = getLine(i);
            if (line.filter(tile => tile.innerHTML === player).length === 2) { // Se duas casas da linha estiverem marcadas pelo jogador
                var emptyTile = line.find(tile => tile.innerHTML === ''); // Encontra a casa vazia
                if (emptyTile) {
                    emptyTile.innerHTML = computer; // Marca a jogada do computador
                    return true;
                }
            }
        }
        return false;
    }

    // Funções para obter as linhas, colunas e diagonais
    function getRow(row) {
        return [$tiles[3 * row], $tiles[3 * row + 1], $tiles[3 * row + 2]];
    }

    function getColumn(col) {
        return [$tiles[col], $tiles[3 + col], $tiles[6 + col]];
    }

    function getDiagonal(diag) {
        return diag === 0 ? [$tiles[0], $tiles[4], $tiles[8]] : [$tiles[2], $tiles[4], $tiles[6]];
    }
});
