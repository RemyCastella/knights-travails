function generateGrid() {
  let coords = [];
  for (let x = 0; x <= 7; x++) {
    for (let y = 0; y <= 7; y++) {
      let coord = [x, y];
      coords.push(coord);
    }
  }
  return coords;
}

const gameBoard = generateGrid();

class Graph {
  constructor() {
    this.adjacencyList = {};
  }

  createVertices(gameBoard) {
    gameBoard.forEach((square) => {
      this.adjacencyList[square] = [];
    });
  }

  createEdges() {
    for (let square in this.adjacencyList) {
      let x = Number(square[0]);
      let y = Number(square[2]);
      const adjacency = [];
      let moves = [
        [x + 1, y + 2],
        [x + 1, y - 2],
        [x - 1, y + 2],
        [x - 1, y - 2],
        [x + 2, y + 1],
        [x + 2, y - 1],
        [x - 2, y + 1],
        [x - 2, y - 1],
      ];
      moves.forEach(([newX, newY]) => {
        if (newX >= 0 && newX <= 7 && newY >= 0 && newY <= 7) {
          adjacency.push([newX, newY]);
        }
      });
      this.adjacencyList[square] = adjacency;
    }
  }

  knightMoves(start, end) {
    const visited = new Set();
    let queue = [start];
    let path;
    let moves;

    while (queue.length) {
      let next = [];

      while (queue.length) {
        let current = queue.shift();
        visited.add(current.toString());
        if (current[0] === end[0] && current[1] === end[1]) {
          path = this.findPath(start, end, visited);
          moves = path.length - 1;
          console.log(
            `Path: ${JSON.stringify(path)} Number of moves: ${moves}`
          );
          return { path, moves };
        } else {
          const neighbors = this.adjacencyList[current.toString()];
          for (let neighbor of neighbors) {
            if (!visited.has(neighbor.toString())) {
              if (neighbor[0] === end[0] && neighbor[1] === end[1]) {
                path = this.findPath(start, end, visited);
                moves = path.length - 1;
                console.log(
                  `Path: ${JSON.stringify(path)} Number of moves: ${moves}`
                );
                return { path, moves };
              } else {
                next.push(neighbor);
              }
            }
          }
        }
      }
      queue = next;
    }
  }

  findPath(start, end, visited) {
    let path = [end];
    let adjacencyList = this.adjacencyList;

    function helper(start, end, visited) {
      let current = end;
      if (current[0] === start[0] && current[1] === start[1]) {
        return null;
      }

      for (let node of visited) {
        const neighbors = adjacencyList[node];
        for (let neighbor of neighbors) {
          if (neighbor.toString() === current.toString()) {
            let nodeArr = node.split(',').map(Number);
            path.push(nodeArr);
            return helper(start, nodeArr, visited);
          }
        }
      }
    }
    helper(start, end, visited);

    return path.reverse();
  }
}

const g = new Graph();
g.createVertices(gameBoard);
g.createEdges();

const UI = (function () {
  const startPosition = document.querySelector('#start');
  const endPosition = document.querySelector('#end');
  const findPath = document.querySelector('button');
  const resultDisplay = document.querySelector('.result');

  startPosition.value = '[0, 0]';
  endPosition.value = '[7, 7]';

  findPath.addEventListener('click', (e) => {
    e.preventDefault();

    if (resultDisplay.innerHTML) {
      resultDisplay.innerHTML = '';
    }

    const inputStart = JSON.parse(startPosition.value);
    const inputEnd = JSON.parse(endPosition.value);

    const results = g.knightMoves(inputStart, inputEnd);
    const resultPath = document.createElement('div');
    resultPath.classList.add('result-display');
    resultPath.textContent = 'Path:  ' + results.path.join(' => ');
    const resultMoves = document.createElement('div');
    resultMoves.classList.add('result-display');
    resultMoves.textContent = 'Moves: ' + results.moves;
    resultDisplay.appendChild(resultMoves);
    resultDisplay.appendChild(resultPath);
  });

  document.addEventListener('DOMContentLoaded', (e) => {
    findPath.click();
  });
})();
