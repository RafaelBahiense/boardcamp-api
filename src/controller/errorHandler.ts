import {Response} from "express";

import {CustomError} from "./types";

export default function errorHandler(error: CustomError, res: Response) {
    if(!("details" in error)) {
        console.log("elp")
        error = new CustomError(error['routine']);
    }
    console.log(error);
    switch (error.details[0].type) {
        case "no such category":
        case 'any.required':
        case "string.empty":
        case 'string.min':
        case 'string.length':
        case 'number.min':
        case "date.base":
        case "DateTimeParseError":
            res.sendStatus(400);
            break;
        case "not found":
            res.sendStatus(404);
            break;
        case "existent":
            res.sendStatus(409);
            break;
        default:
            res.sendStatus(500);
            break;
    }
}