import { Request, Response } from "express";
import dayjs from "dayjs";

import {rentalSchema} from "../schemas/schemas";
import {connectionDB} from "../config/database";
import {CustomError} from "./types";
import errorHandler from "./errorHandler";


export async function getRentals(_: Request, res: Response) {
    try {
        const rentals = await connectionDB.query(`SELECT * FROM rentals`);
        res.status(200).send(rentals.rows)
    } catch (e) {
        errorHandler(e, res);
    }
}

export async function postRentals(req: Request, res: Response) {
    const rental = {
        customerId: req.body.customerId,
        gameId: req.body.gameId,
        daysRented: parseInt(req.body.daysRented),
        rentDate: dayjs().format("YYYY-MM-DD"),
        returnDate: null,
        delayFee: null,
        originalPrice: 0
    }
    try {
        await rentalSchema.validateAsync(rental);
        const gameAndCustomer = await connectionDB.query(`SELECT customers.id AS "customerId", games.id AS "gameId", games."pricePerDay" FROM customers JOIN games ON games.id=$1 AND customers.id=$2`, [rental.gameId, rental.customerId])
        if(gameAndCustomer.rowCount === 0) throw new CustomError("No customer or game");
        rental.originalPrice = rental.daysRented * gameAndCustomer.rows[0].pricePerDay;
        const rentals = await connectionDB.query(`INSERT INTO rentals ("customerId","gameId", "daysRented","rentDate","delayFee","originalPrice") VALUES ($1,$2,$3,$4,$5,$6)`, [rental.customerId, rental.gameId, rental.daysRented, rental.rentDate, rental.delayFee, rental.originalPrice]);
        res.sendStatus(201)
    } catch (e) {
        errorHandler(e, res);
    }
}

export async function returnRental(req: Request, res: Response) {
    const id = req.params.id;
    try {
        const existentRental = await connectionDB.query(`SELECT rentals.*, games."pricePerDay" FROM rentals JOIN games ON rentals.id=$1 AND games.id=rentals."gameId"`, [id])
        if (existentRental.rowCount === 0) throw new CustomError('not found');
        if (existentRental.rows[0].returnDate) throw new CustomError('finished');
        const returnDate = dayjs().format("YYYY-MM-DD");
        const rawOffset= Date.now() - dayjs(existentRental.rows[0].rentDate).valueOf();
        const offset = Math.floor((rawOffset/1000)/60/60/24);
        const delayFee = offset > existentRental.rows[0].daysRented ? (offset - existentRental.rows[0].daysRented) * (existentRental.rows[0].pricePerDay * 2) : 0;
        await connectionDB.query(`UPDATE rentals SET "returnDate"=$1,"delayFee"=$2 WHERE id=$3`, [returnDate,delayFee,id]);
        res.sendStatus(201)
    } catch (e) {
        errorHandler(e, res);
    }
}

export async function deleteRental(req: Request, res: Response) {
    const id = req.params.id;
    try {
        const existentRental = await connectionDB.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
        if (existentRental.rowCount === 0) throw new CustomError('not found')
        if (existentRental.rows[0].returnDate) throw new CustomError('finished')
        await connectionDB.query(`DELETE FROM rentals WHERE id=$1`, [id]);
        res.sendStatus(200)
    } catch (e) {
        errorHandler(e, res);
    }
}