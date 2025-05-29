import express from "express";
import ViteExpress from "vite-express";
import { InMemoryTicTacToeApi } from "./src/api";
import { DbTicTacToeApi } from "./src/db/db";
const app = express();
app.use(express.json())
const api = new DbTicTacToeApi()

app.get("/message", (_, res) => res.send("Hello from express!"));
app.get("/api/game/:gameId", async (req, res) => {
    const game = await api.getGame(req.params.gameId)
    res.json(game)
})
app.post("/api/game", async (req, res) => {
    const game = await api.createGame()
    res.json(game)
})
app.post("/api/game/:gameId/move", async (req, res) => {
    const game = await api.makeMove(req.params.gameId, req.body.row, req.body.col)
    res.json(game)
})

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));