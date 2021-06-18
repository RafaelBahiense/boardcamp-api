import express from 'express';

import {getCategories, postCategories} from "../controller/categoriesController";
import {getGames, postGames} from "../controller/gamesController";
import {getCustomers, getCustomer, postCustomers, updateCustomers} from "../controller/customersController";
import {getRentals, postRentals, returnRental, deleteRental} from "../controller/rentalsController";

const routes = express.Router();

routes.get('/categories', (req, res) => getCategories(req, res));

routes.post('/categories', (req, res) => postCategories(req, res));

routes.get('/games', (req, res) => getGames(req, res));

routes.post('/games', (req, res) => postGames(req, res));

routes.get('/customers', (req, res) => getCustomers(req, res));

routes.get('/customers/:id', (req, res) => getCustomer(req, res));

routes.post('/customers', (req, res) => postCustomers(req, res));

routes.put('/customers', (req, res) => updateCustomers(req, res));

routes.get('/rentals', (req, res) => getRentals(req, res));

routes.post('/rentals', (req, res) => postRentals(req, res));

routes.post('/rentals/:id/return', (req, res) => returnRental(req, res));

routes.delete('/rentals/:id', (req, res) => deleteRental(req, res));


export default routes;