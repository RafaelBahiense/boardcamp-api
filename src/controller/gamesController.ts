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
    console.log(stripHtml(req.body.name).result)
    const game = {
        name: stripHtml(req.body.name).result,
        image: stripHtml(req.body.image).result,
        stockTotal: (req.body.stockTotal as unknown) as number,
        categoryId: (req.body.categoryId as unknown) as number,
        pricePerDay: (req.body.pricePerDay as unknown) as number
    }
    try {
        await gameSchema.validateAsync(game);
        const existentGame = await connectionDB.query("SELECT * FROM games WHERE name = $1", [game.name]);
        if(existentGame.rowCount > 0) throw new CustomError("existent");
        const existentCategory = await connectionDB.query("SELECT * FROM categories WHERE id = $1", [game.categoryId]);
        if(existentCategory.rowCount === 0) throw new CustomError("no such category");
        await connectionDB.query(`INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5)`, [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay]);
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        switch (e.details[0].type) {
            case "no such category":
            case 'any.required':
            case 'any.required':
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