import express from 'express';

import {getCategories, postCategories} from "../controller/categoriesController";
import {getGames, postGames} from "../controller/gamesController";

const routes = express.Router();

routes.get('/categories', (req, res) => getCategories(req, res));

routes.post('/categories', (req, res) => postCategories(req, res));

routes.get('/games', (req, res) => getGames(req, res));

routes.post('/games', (req, res) => postGames(req, res));

export default routes;