// --- CONFIGURAÇÃO DO JOGO ---
const GRID_SIZE = 12; // Tamanho da grade (12x12)
const wordsToHide = ["JAVASCRIPT", "HTML", "CSS", "ALGORITMO", "PROGRAMA", "WEB", "CODIGO", "FUNCAO"];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

// --- VARIÁVEIS GLOBAIS ---
let grid = [];
let foundWords = [];
let isSelecting = false;
let selection = [];

// --- ELEMENTOS DO DOM ---
const gridContainer = document.getElementById('grid-container');
const wordListElement = document.getElementById('word-list');
const messageElement = document.getElementById('message');

// --- FUNÇÕES PRINCIPAIS ---

/**
 * Inicializa o jogo: cria a grade, posiciona as palavras e preenche o resto.
 */
function init() {
  createGrid();
  placeWords();
  fillEmptyCells();
  renderGrid();
  renderWordList();
  addEventListeners();
}

/**
 * Cria uma grade 2D vazia.
 */
function createGrid() {
  grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
}

/**
 * Tenta posicionar todas as palavras da lista na grade.
 */
function placeWords() {
  for (const word of wordsToHide) {
    let placed = false;
    while (!placed) {
      const direction = Math.floor(Math.random() * 2); // 0: horizontal, 1: vertical
      const reversed = Math.random() > 0.5;
      const wordToPlace = reversed ? word.split('').reverse().join('') : word;

      let row, col;
      if (direction === 0) { // Horizontal
        row = Math.floor(Math.random() * GRID_SIZE);
        col = Math.floor(Math.random() * (GRID_SIZE - wordToPlace.length + 1));
      } else { // Vertical
        row = Math.floor(Math.random() * (GRID_SIZE - wordToPlace.length + 1));
        col = Math.floor(Math.random() * GRID_SIZE);
      }

      if (canPlaceWord(wordToPlace, row, col, direction)) {
        for (let i = 0; i < wordToPlace.length; i++) {
          if (direction === 0) {
            grid[row][col + i] = wordToPlace[i];
          } else {
            grid[row + i][col] = wordToPlace[i];
          }
        }
        placed = true;
      }
    }
  }
}

/**
 * Verifica se uma palavra pode ser colocada em uma determinada posição sem sobrepor outras.
 */
function canPlaceWord(word, row, col, direction) {
  for (let i = 0; i < word.length; i++) {
    let r = row;
    let c = col;
    if (direction === 0) { // Horizontal
      c += i;
    } else { // Vertical
      r += i;
    }

    if (grid[r][c] !== '' && grid[r][c] !== word[i]) {
      return false; // Conflito com outra palavra
    }
  }
  return true;
}

/**
 * Preenche as células vazias da grade com letras aleatórias.
 */
function fillEmptyCells() {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }
}

/**
 * Renderiza a grade de letras na página (cria os elementos HTML).
 */
function renderGrid() {
  gridContainer.innerHTML = '';
  gridContainer.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.textContent = grid[r][c];
      cell.dataset.row = r;
      cell.dataset.col = c;
      gridContainer.appendChild(cell);
    }
  }
}

/**
 * Renderiza a lista de palavras a serem encontradas.
 */
function renderWordList() {
  wordListElement.innerHTML = '';
  for (const word of wordsToHide) {
    const li = document.createElement('li');
    li.textContent = word;
    li.id = `word-${word}`;
    wordListElement.appendChild(li);
  }
}

/**
 * Adiciona os eventos de mouse para permitir a seleção de palavras.
 */
function addEventListeners() {
  gridContainer.addEventListener('mousedown', startSelection);
  gridContainer.addEventListener('mouseover', continueSelection);
  document.addEventListener('mouseup', endSelection); // No documento para pegar mesmo se soltar fora
}

function startSelection(e) {
  if (e.target.classList.contains('cell')) {
    isSelecting = true;
    selection = [e.target];
    e.target.classList.add('selecting');
  }
}

function continueSelection(e) {
  if (isSelecting && e.target.classList.contains('cell') && !selection.includes(e.target)) {
    selection.push(e.target);
    e.target.classList.add('selecting');
  }
}

function endSelection() {
  if (!isSelecting) return;
  isSelecting = false;

  const selectedWord = selection.map(cell => cell.textContent).join('');
  checkWord(selectedWord);

  // Limpa a classe 'selecting' de todas as células
  document.querySelectorAll('.cell.selecting').forEach(cell => {
    cell.classList.remove('selecting');
  });
  selection = [];
}

/**
 * Verifica se a palavra selecionada está na lista (normal ou invertida).
 */
function checkWord(selectedWord) {
  const reversedWord = selectedWord.split('').reverse().join('');

  if ((wordsToHide.includes(selectedWord) && !foundWords.includes(selectedWord)) ||
    (wordsToHide.includes(reversedWord) && !foundWords.includes(reversedWord))) {

    const correctWord = wordsToHide.includes(selectedWord) ? selectedWord : reversedWord;

    // Marcar a palavra como encontrada
    foundWords.push(correctWord);

    // Destacar as células na grade permanentemente
    selection.forEach(cell => cell.classList.add('found'));

    // Riscar a palavra na lista
    document.getElementById(`word-${correctWord}`).classList.add('found');

    // Verificar condição de vitória
    if (foundWords.length === wordsToHide.length) {
      messageElement.textContent = "Parabéns! Você encontrou todas as palavras!";
    }
  }
}

// --- INICIAR O JOGO ---
init();
