let Piece = require("./piece");

/**
 * Returns a 2D array (8 by 8) with two black pieces at [3, 4] and [4, 3]
 * and two white pieces at [3, 3] and [4, 4]
 */
function _makeGrid () {
  let board = new Array();

  for (let i = 0; i < 8; i++) {
    let row = new Array(8); 
    board.push(row);
  }

  board[4][3] = new Piece('black');
  board[3][4] = new Piece('black');
  board[3][3] = new Piece('white');
  board[4][4] = new Piece('white');

  return board;
}

/**
 * Constructs a Board with a starting grid set up.
 */
function Board () {
  this.grid = _makeGrid();
}

Board.DIRS = [
  [ 0,  1], [ 1,  1], [ 1,  0],
  [ 1, -1], [ 0, -1], [-1, -1],
  [-1,  0], [-1,  1]
];

/**
 * Returns the piece at a given [x, y] position,
 * throwing an Error if the position is invalid.
 */
Board.prototype.getPiece = function (pos) {
  if (!this.isValidPos(pos)) {
    throw new Error("Position outside of board!");
  } 
  
  let [row, col] = pos;

  return this.grid[row][col];
};

/**
 * Checks if there are any valid moves for the given color.
 */
Board.prototype.hasMove = function (color) {
  return this.validMoves(color).length !== 0;
};

/**
 * Checks if the piece at a given position
 * matches a given color.
 */
Board.prototype.isMine = function (pos, color) {
  let piece = this.getPiece(pos);
  return piece && piece.color === color; 
};

/**
 * Checks if a given position has a piece on it.
 */
Board.prototype.isOccupied = function (pos) {
  let piece = this.getPiece(pos);
  return !!piece;
};

/**
 * Checks if both the white player and
 * the black player are out of moves.
 */
Board.prototype.isOver = function () {
  return !this.hasMove("black") && !this.hasMove("white");
};

/**
 * Checks if a given position is on the Board.
 */
Board.prototype.isValidPos = function (pos) {
  let [row, col] = pos;
  return (col >= 0 && col <= 7) && (row >= 0 && row <= 7);
};

/**
 * Recursively follows a direction away from a starting position, adding each
 * piece of the opposite color until hitting another piece of the current color.
 * It then returns an array of all pieces between the starting position and
 * ending position.
 *
 * Returns null if it reaches the end of the board before finding another piece
 * of the same color.
 *
 * Returns null if it hits an empty position.
 *
 * Returns null if no pieces of the opposite color are found.
 */
function _positionsToFlip (board, pos, color, dir, piecesToFlip) {
  let [dirY, dirX] = dir;
  let [row, col] = pos;
  let newPos = [row + dirY, col + dirX];
  if (!piecesToFlip)
    piecesToFlip = [];
  else
    piecesToFlip.push(pos);
  
  if (!board.isValidPos(newPos))
    return null;

  let newPiece = board.getPiece(newPos);
  if (!newPiece)
    return null;
  else if (newPiece.color === color)  
    return piecesToFlip.length === 0 ? null : piecesToFlip;
  else 
    return _positionsToFlip(board, newPos, color, dir, piecesToFlip);
}

/**
 * Adds a new piece of the given color to the given position, flipping the
 * color of any pieces that are eligible for flipping.
 *
 * Throws an error if the position represents an invalid move.
 */
Board.prototype.placePiece = function (pos, color) {
  if (!this.validMove(pos, color))
    throw new Error("Invalid move!"); 
  
  let [row, col] = pos;
  let positionsToFlip = [];

  this.grid[row][col] = new Piece(color);
  Board.DIRS.forEach((dir) => {
    positionsToFlip = positionsToFlip.concat(_positionsToFlip(this, pos, color, dir) || []);
  });
  positionsToFlip.forEach((pos) => this.getPiece(pos).flip()); 
};

/**
 * Prints a string representation of the Board to the console.
 */
Board.prototype.print = function () {
  let headerRow = "  ";
  for (let i = 0; i < 8; i++) {
    headerRow += i;
  }
  console.log(headerRow);

  for (let i = 0; i < 8; i++) {
    let rowStr = i + "|";
    
    for (let j = 0; j < 8; j++) {
      let pos = [i, j];
      rowStr += (this.getPiece(pos) ? this.getPiece(pos).toString() : "."); 
    }
    console.log(rowStr);
  }
};

/**
 * Checks that a position is not already occupied and that the color
 * taking the position will result in some pieces of the opposite
 * color being flipped.
 */
Board.prototype.validMove = function (pos, color) {
  if (!this.isValidPos(pos))
    return false;
  if (this.isOccupied(pos))
    return false;

  for (let i = 0; i < Board.DIRS.length; i++) {
    let positionsToFlip = [];
    positionsToFlip = (_positionsToFlip(this, pos, color, Board.DIRS[i]) || []); 
    if (positionsToFlip.length > 0)
      return true;
  }

  return false;
};

/**
 * Produces an array of all valid positions on
 * the Board for a given color.
 */
Board.prototype.validMoves = function (color) {
  let validMovesArr = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (this.validMove([i, j], color))
        validMovesArr.push([i, j]);
    }
  }

  return validMovesArr;
};

module.exports = Board;
