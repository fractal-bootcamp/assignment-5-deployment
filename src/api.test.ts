import { InMemoryTicTacToeApi } from './api'
import { DbTicTacToeApi } from './db/db'
import type { GameState } from './game'

describe('DbTicTacToeApi', () => {
    let api: DbTicTacToeApi

    beforeEach(() => {
        api = new DbTicTacToeApi()
    })

    describe('createGame', () => {
        it('should create a new game with correct initial state', async () => {
            const game = await api.createGame()

            expect(game).toBeDefined()
            expect(game.id).toBeDefined()
            expect(game.currentPlayer).toBe('X')
            expect(game.result).toBeNull()
            expect(game.board).toEqual([
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ])
        })

        it('should create games with unique IDs', async () => {
            const game1 = await api.createGame()
            const game2 = await api.createGame()

            expect(game1.id).not.toBe(game2.id)
        })
    })

    describe('makeMove', () => {
        it('should make a valid move and update the game state', async () => {
            const game = await api.createGame()
            const updatedGame = await api.makeMove(game.id, 0, 0)

            expect(updatedGame.board[0][0]).toBe('X')
            expect(updatedGame.currentPlayer).toBe('O')
        })

        it('should reject moves on non-existent games', async () => {
            await expect(api.makeMove('non-existent-id', 0, 0))
                .rejects.toThrow('Game not found')
        })

        it('should not allow moves on already filled cells', async () => {
            const game = await api.createGame()
            await api.makeMove(game.id, 0, 0)
            const updatedGame = await api.makeMove(game.id, 0, 0)

            expect(updatedGame.board[0][0]).toBe('X')
            expect(updatedGame.currentPlayer).toBe('O')
        })

        it('should not allow moves after game is won', async () => {
            const game = await api.createGame()
            // Make moves to create a winning condition
            await api.makeMove(game.id, 0, 0) // X
            await api.makeMove(game.id, 1, 0) // O
            await api.makeMove(game.id, 0, 1) // X
            await api.makeMove(game.id, 1, 1) // O
            const finalGame = await api.makeMove(game.id, 0, 2) // X wins

            expect(finalGame.result).toBe('X')

            // Try to make another move
            const unchangedGame = await api.makeMove(game.id, 2, 0)
            expect(unchangedGame).toEqual(finalGame)
        })

        it('should not allow moves after game ends in a tie', async () => {
            const game = await api.createGame()
            // Make moves to create a tie condition
            // X | O | X
            // O | O | X
            // X | X | O
            await api.makeMove(game.id, 0, 0) // X
            await api.makeMove(game.id, 0, 1) // O
            await api.makeMove(game.id, 0, 2) // X
            await api.makeMove(game.id, 1, 0) // O
            await api.makeMove(game.id, 1, 2) // X
            await api.makeMove(game.id, 1, 1) // O
            await api.makeMove(game.id, 2, 0) // X
            await api.makeMove(game.id, 2, 2) // O
            const finalGame = await api.makeMove(game.id, 2, 1) // X

            expect(finalGame.result).toBe('Tie')

            // Try to make another move
            const unchangedGame = await api.makeMove(game.id, 0, 0)
            expect(unchangedGame).toEqual(finalGame)
        })
    })

    describe('getGame', () => {
        it('should return undefined for non-existent game', async () => {
            await expect(api.getGame('non-existent-id'))
                .rejects.toThrow('Game not found')
        })

        it('should return the correct game state', async () => {
            const createdGame = await api.createGame()
            const retrievedGame = await api.getGame(createdGame.id)

            expect(retrievedGame).toEqual(createdGame)
        })

        it('should return updated game state after moves', async () => {
            const game = await api.createGame()
            await api.makeMove(game.id, 0, 0)
            const updatedGame = await api.getGame(game.id)

            expect(updatedGame?.board[0][0]).toBe('X')
            expect(updatedGame?.currentPlayer).toBe('O')
        })
    })
}) 