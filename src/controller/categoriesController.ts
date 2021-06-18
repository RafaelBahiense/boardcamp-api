import { Request, Response } from "express";
import { stripHtml } from "string-strip-html";

import {categorySchema} from "../schemas/schemas";
import {connectionDB} from "../config/database";
import {CustomError} from "./types";
import errorHandler from "./errorHandler";


export async function getCategories(_: Request, res: Response) {
    try {
        const categories = await connectionDB.query("SELECT * FROM categories");
        res.status(200).send(categories.rows)
    } catch (e) {
        errorHandler(e, res);
    }
}

export async function postCategories(req: Request, res: Response) {
    const categoryName = stripHtml(req.body.name).result;
    try {
        await categorySchema.validateAsync(categoryName);
        const existentCategory = await connectionDB.query("SELECT * FROM categories WHERE name = $1", [categoryName]);
        if(existentCategory.rowCount > 0) throw new CustomError("existent");
        await connectionDB.query("INSERT INTO categories (name) VALUES ($1)", [categoryName]);
        res.sendStatus(201);
    } catch (e) {
        errorHandler(e, res);
    }
}