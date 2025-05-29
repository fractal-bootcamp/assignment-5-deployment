
export type Player = 'X' | 'O'
export type GameResult = Player | 'Tie' | null
export type Board = (Player | null)[][]
export type GameState = {
    id: string
    currentPlayer: 'X' | 'O'
    board: Board
    result: GameResult
}

export function createGame(): GameState {
    return {
        id: crypto.randomUUID(),
        currentPlayer: 'X',
        board: [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ],
        result: null,
    }
}

export function makeMove(gameState: GameState, row: number, col: number): GameState {
    if (gameState.board[row][col] !== null || gameState.result !== null) {
        return gameState
    }

    const newBoard = structuredClone(gameState.board)
    newBoard[row][col] = gameState.currentPlayer

    return {
        ...gameState,
        board: newBoard,
        currentPlayer: gameState.currentPlayer === 'X' ? 'O' : 'X',
        result: getResult(newBoard),
    }
}

export function getResult(board: (Player | null)[][]): GameResult {

    // Check rows
    for (let row = 0; row < 3; row++) {
        if (board[row][0] && board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
            return board[row][0]
        }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
        if (board[0][col] && board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
            return board[0][col]
        }
    }

    // Check diagonals
    if (board[0][0] && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0]
    }

    if (board[0][2] && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2]
    }

    if (board.flat().every(cell => cell !== null)) {
        return 'Tie'
    }

    return null
}
