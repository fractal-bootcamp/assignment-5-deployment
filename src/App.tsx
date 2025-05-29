import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { type GameState } from './game'
import { TicTacToeApiClient } from './api'

function App() {
  const api = useMemo(() => new TicTacToeApiClient(), [])
  const [gameState, setGameState] = useState<GameState | undefined>()
  async function initializeGame() {
    const initialState = await api.createGame()
    setGameState(initialState)
  }
  useEffect(() => {
    initializeGame()
  }, [])

  async function handleCellClick(row: number, col: number) {
    const game = await api.makeMove(gameState!.id, row, col)
    setGameState(game)
  }

  if (!gameState) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <>
      <div>
        <h1>Tic Tac Toe</h1>
        <div className="board">
          {gameState.board.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div key={colIndex} className="cell" onClick={() => handleCellClick(rowIndex, colIndex)}>
                  {cell}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="announcement">
          {gameState.result && (
            <div>
              {gameState.result === 'Tie' ? 'Tie' : `Winner: ${gameState.result}`}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
