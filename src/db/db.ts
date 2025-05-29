
import { drizzle } from 'drizzle-orm/postgres-js'
import type { TicTacToeApi } from '../api';
import  { type Board, type GameResult, type GameState, type Player, createGame as createGameState, makeMove as makeMoveState } from '../game';
import { gamesTable } from './schema';
import { eq } from 'drizzle-orm';
const db = drizzle(process.env.DATABASE_URL!);

export class DbTicTacToeApi implements TicTacToeApi {

    async createGame(): Promise<GameState> {
        const game = createGameState()
        const values: typeof gamesTable.$inferInsert = game
        await db.insert(gamesTable).values(values)
        return game
    }

    async makeMove(gameId: string, row: number, col: number): Promise<GameState> {
        const game = await this.getGame(gameId)
        const newGame = makeMoveState(game, row, col)
        const values: typeof gamesTable.$inferInsert = newGame
        await db.update(gamesTable).set(values).where(eq(gamesTable.id, gameId))
        return newGame
    }

    async getGame(gameId: string): Promise<GameState> {
        const results = await db.select().from(gamesTable).where(eq(gamesTable.id, gameId))
        if (results.length === 0) {
            throw new Error('Game not found')
        }
        const game = results[0]
        return {
            id: game.id,
            currentPlayer: game.currentPlayer as Player,
            board: game.board as Board,
            result: game.result as GameResult,
        }
    }
}
