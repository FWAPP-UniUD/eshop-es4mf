import jwt from 'express-jwt';
import { Router } from 'express';
import Order from './models/order';
import config from './config';

const router = Router();

router.use(jwt({ secret: config.secret_key })); //verifica che le richieste sono autorizzate (middleware jwt)
// middleware to get limit and page for paging
router.use('/', function(req, res, next) {
    req.limit = req.query.limit || 3;
    req.page = req.query.page || 1;
    next();
});

router.get('/', function(req, res, next) {

});

router.post('/', function(req, res, next) {
    // fill in to manage a new order req.user = oggetto dell'utente che sta interagendo, 
   // req.user.roles if (req.user.roles.indexOf('admin') != -1) può interagire solo un admin
});