import { Request, Response } from "express";
import { stripHtml } from "string-strip-html";

import {customersSchema} from "../schemas/schemas";
import {connectionDB} from "../config/database";
import {CustomError} from "./types";
import errorHandler from "./errorHandler";


export async function getCustomers(req: Request, res: Response) {
    try {
        const cpfContains = req.query.cpf as string || "";
        const customers = cpfContains 
            ? await connectionDB.query(`SELECT * FROM customers WHERE cpf LIKE $1||'%'`, [cpfContains])
            : await connectionDB.query(`SELECT * FROM customers`)
        res.status(200).send(customers.rows)
    } catch (e) {
        errorHandler(e, res);
    }
}

export async function getCustomer(req: Request, res: Response) {
    try {
        const id = req.params.id || "";
        const customers = await connectionDB.query("SELECT * FROM customers WHERE id = $1", [id]);
        if(customers.rowCount === 0) throw new CustomError("not found");
        res.status(200).send(customers.rows[0]);
    } catch (e) {
        errorHandler(e, res);
    }
}

export async function postCustomers(req: Request, res: Response) {
    const customer = {
        name: stripHtml(req.body.name).result,
        phone: stripHtml(req.body.phone).result,
        cpf: stripHtml(req.body.cpf).result,
        birthday: stripHtml(req.body.birthday).result
    }
    try {
        await customersSchema.validateAsync(customer);
        const existentCustomer = await connectionDB.query("SELECT * FROM customers WHERE cpf = $1", [customer.cpf]);
        if(existentCustomer.rowCount > 0) throw new CustomError("existent");
        await connectionDB.query(`INSERT INTO customers (name,phone,cpf,birthday) VALUES ($1,$2,$3,$4)`, [customer.name, customer.phone, customer.cpf, customer.birthday]);
        res.sendStatus(201);
    } catch (e) {
        errorHandler(e, res);
    }
}

export async function updateCustomers(req: Request, res: Response) {
    const customer = {
        name: stripHtml(req.body.name).result,
        phone: stripHtml(req.body.phone).result,
        cpf: stripHtml(req.body.cpf).result,
        birthday: stripHtml(req.body.birthday).result
    }
    try {
        await customersSchema.validateAsync(customer);
        const existentCustomer = await connectionDB.query("SELECT * FROM customers WHERE cpf = $1", [customer.cpf]);
        if(existentCustomer.rowCount === 0) throw new CustomError("not existent");
        if(existentCustomer.rowCount > 1) throw new CustomError("existent");
        await connectionDB.query(`UPDATE customers SET name=$1,phone=$2,birthday=$4 WHERE cpf = $3`, [customer.name, customer.phone, customer.cpf, customer.birthday]);
        res.sendStatus(200);
    } catch (e) {
        errorHandler(e, res);
    }
}