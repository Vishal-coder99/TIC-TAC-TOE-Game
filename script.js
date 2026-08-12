const WINS = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

let cells = Array(9).fill(null);
let current = 'X';
let gameOver = false;
let scores = { X: 0, O: 0, D: 0 };

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const statusText = document.getElementById('statusText');
const turnDot = document.getElementById('turnDot');
const winLineEl = document.getElementById('winLine');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDEl = document.getElementById('scoreD');

function buildBoard(){
  boardEl.innerHTML = '';
  cells.forEach((val, i) => {
    const btn = document.createElement('button');
    btn.className = 'cell';
    btn.dataset.index = i;
    btn.addEventListener('click', () => handleMove(i));
    boardEl.appendChild(btn);
  });
}

function handleMove(i){
  if (gameOver || cells[i]) return;
  cells[i] = current;
  render();
  const result = checkWinner();
  if (result){
    gameOver = true;
    if (result.winner){
      scores[result.winner]++;
      drawWinLine(result.combo);
      statusText.textContent = `Player ${result.winner} wins!`;
      statusEl.classList.add('win');
      dimLosers(result.combo);
    } else {
      scores.D++;
      statusText.textContent = "It's a draw";
      statusEl.classList.add('draw');
    }
    updateScoreboard();
  } else {
    current = current === 'X' ? 'O' : 'X';
    updateStatus();
  }
}

function render(){
  [...boardEl.children].forEach((btn, i) => {
    const val = cells[i];
    btn.textContent = val || '';
    btn.classList.toggle('filled', !!val);
    btn.classList.remove('x','o');
    if (val === 'X') btn.classList.add('x');
    if (val === 'O') btn.classList.add('o');
    if (val && !btn.classList.contains('pop')){
      btn.classList.add('pop');
      btn.addEventListener('animationend', () => btn.classList.remove('pop'), { once:true });
    }
  });
}

function updateStatus(){
  statusText.textContent = `Player ${current}'s turn`;
  turnDot.classList.toggle('o', current === 'O');
}

function checkWinner(){
  for (const combo of WINS){
    const [a,b,c] = combo;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]){
      return { winner: cells[a], combo };
    }
  }
  if (cells.every(c => c)) return { winner: null, combo: null };
  return null;
}

function dimLosers(combo){
  [...boardEl.children].forEach((btn, i) => {
    if (cells[i] && !combo.includes(i)) btn.classList.add('dim');
    if (!cells[i]) btn.classList.add('locked');
  });
}

function cellCenter(i){
  const row = Math.floor(i/3), col = i%3;
  return { x: col*33.333 + 16.666, y: row*33.333 + 16.666 };
}

function drawWinLine(combo){
  const p1 = cellCenter(combo[0]);
  const p2 = cellCenter(combo[2]);
  winLineEl.innerHTML = `<path d="M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}" pathLength="1"/>`;
}

function updateScoreboard(){
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDEl.textContent = scores.D;
}

function newRound(){
  cells = Array(9).fill(null);
  current = 'X';
  gameOver = false;
  statusEl.classList.remove('win','draw');
  turnDot.classList.remove('o');
  winLineEl.innerHTML = '';
  buildBoard();
  updateStatus();
}

function resetScore(){
  scores = { X:0, O:0, D:0 };
  updateScoreboard();
  newRound();
}

document.getElementById('newRound').addEventListener('click', newRound);
document.getElementById('resetScore').addEventListener('click', resetScore);

buildBoard();
updateStatus();
