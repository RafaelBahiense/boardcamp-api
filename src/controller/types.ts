interface Details {
    type: string;
}

export class CustomError {
    details: Details[];
    constructor(type: string){
        this.details = [
            {
                type
            }
        ]
    }  
}