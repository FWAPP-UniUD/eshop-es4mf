import jwt from 'express-jwt';
import { Router } from 'express';
import Product from './models/product';
import config from './config';

const router = Router();

// middleware to get limit and page for paging
router.use('/', function(req, res, next) {
    req.limit = req.query.limit || 3; //elementi per pagina, noi non lo richiediamo
    req.page = req.query.page || 1;//o è un valore oppure usa il valore di default
    next();
});

// this route will serve the picture (which has to be served separately)
router.get('/:id/picture', function(req, res, next) {
    Product.findOne({ _id: req.params.id }, { picture: 1 }).then(function(product) {
        if (!product)
            throw new Error(`Could not find product ${req.params.id}`);
        res.contentType(product.picture.contentType);
        res.send(product.picture.data);
    }).catch(function(error) {
        next(new Error(error));
    });
});

router.get('/:id', function(req, res, next) {
    Product.findOne({ _id: req.params.id }, { picture: 0 }).then(function(product) {
        if (!product)
           throw new Error(`Could not find product ${req.params.id}`);
        res.json(product.toObject());
    }).catch(function(error) {
        next(new Error(error));
    });
});

router.get('/', function(req, res, next) {
    Promise.all([
        Product.find({}, { picture: 0 }).limit(req.limit).skip((req.page - 1) * req.limit), 
        Product.count({})
    ]).then((values) => {
        const products = values[0], n_products = values[1];
        const result = { 
            products: products.map((p) => p.toObject({ virtuals: true })),
        };
        result.count = n_products;
        result.pages = Math.ceil(n_products / req.limit);
        result.limit = req.limit;
        result.current_page = req.page;
        if (req.page > 1)
            result.prevPage = Math.max(req.page - 1, 0);
        if ((req.page - 1) * req.limit + products.length < n_products)
            result.nextPage = req.page + 1;
        res.json(result);
    });
});

export default router;