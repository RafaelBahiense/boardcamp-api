import express from 'express';

import {getCategories, postCategories} from "../controller/categoriesController";
import {getGames, postGames} from "../controller/gamesController";
import {getCustomers, getCustomer, postCustomers, updateCustomers} from "../controller/customersController";

const routes = express.Router();

routes.get('/categories', (req, res) => getCategories(req, res));

routes.post('/categories', (req, res) => postCategories(req, res));

routes.get('/games', (req, res) => getGames(req, res));

routes.post('/games', (req, res) => postGames(req, res));

routes.get('/customers', (req, res) => getCustomers(req, res));

routes.get('/customers/:id', (req, res) => getCustomer(req, res));

routes.post('/customers', (req, res) => postCustomers(req, res));

routes.put('/customers', (req, res) => updateCustomers(req, res));


export default routes;