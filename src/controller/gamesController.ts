import { Request, Response } from "express";
import { stripHtml } from "string-strip-html";

import {gameSchema} from "../schemas/schemas";
import {connectionDB} from "../config/database";
import {CustomError} from "./types";


export async function getGames(req: Request, res: Response) {
    try {
        const games = await connectionDB.query("SELECT * FROM games");
        res.status(200).send(games.rows)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export async function postGames(req: Request, res: Response) {
    const game = {
        name: stripHtml(req.body.name).result,
        image: stripHtml(req.body.name).result,
        stockTotal: (stripHtml(req.body.name).result as unknown) as number,
        categoryId: (stripHtml(req.body.name).result as unknown) as number,
        pricePerDay: (stripHtml(req.body.name).result as unknown) as number
    }
    try {
        await gameSchema.validateAsync(game);
        const existentGame = await connectionDB.query("SELECT * FROM games WHERE name = $1", [game]);
        if(existentGame.rowCount > 0) throw new CustomError("existent");
        await connectionDB.query("INSERT INTO games (name,image,stockTotal,categoryId,pricePerDay) VALUES ($1,$2,$3,$4,$5)", [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay]);
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        switch (e.details[0].type) {
            case "string.empty":
                res.sendStatus(400);
                break;
            case "existent":
                res.sendStatus(409);
                break;
            default:
                res.sendStatus(500);
                break;
        }
    }
}