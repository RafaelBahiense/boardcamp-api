import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import routes from "./routes/routes";

dotenv.config({ path: __dirname+'/./../.env' });
const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', routes);


app.listen(PORT,function(){
    console.log(`Server runing on port ${PORT}`)
});
