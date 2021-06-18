import {Response} from "express";

import {CustomError} from "./types";

export default function errorHandler(error: CustomError, res: Response) {
    console.log(error);
        switch (error.details[0].type) {
            case "no such category":
            case 'any.required':
            case 'any.required':
            case "string.empty":
            case 'number.min':
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