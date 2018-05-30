import mongoose from 'mongoose';
import md5 from 'md5';
import User from './user';
import Product from './product';
import config from './config';
import fs from 'fs';

mongoose.connect(config.db);

const p1 = new Promise((resolve) => {
    mongoose.connection.dropCollection('users')
    .catch(function() { 
        // do nothing, probably the collection didn't exist
    })
    .then(function() {
        User.create([
            {
                email: "test@example.com",
                name: "Test Account",
                password: md5("test"),
                roles: ['admin', 'user']
            },
            {
                email: "test2@example.com",
                name: "Test Account",
                password: md5("test"),
                roles: ['user']
            }
        ]).then(users => {
            console.log(`${users.length} users created`);
            resolve();
        }).catch((err) => {
            console.log(err);
            resolve();
        });
    });
});

const p2 = new Promise((resolve) => {
    mongoose.connection.dropCollection('products')
    .catch(function() {
        // do nothing, probably the collection didn't exist
    })
    .then(function() {
        const products = [
            { file: 'nutella.jpg', name: "Nutella Spray", price: 3.5 },
            { file: 'peanut.jpg', name: "Peanuts Butter", price: 2.25 },
            { file: 'karnemelk.jpg', name: "Verse Karnemelk", price: 0.94 },
            { file: 'frico.jpg', name: "Frico", price: 1.5 },
            { file: 'filet_americain.jpg', name: "Filet Americain", price: 2.1 },
            { file: 'vegemite.jpg', name: "Real Vegemite", price: 3.45 }]
            .map((item) => ({ 
                name: item.name, 
                price: item.price, 
                picture: { 
                    data: fs.readFileSync(__dirname + `/../images/${item.file}`), 
                    contentType: 'image/jpeg'} 
            }));
        
        Product.create(products).then(products => {
            console.log(`${products.length} products created`);
            resolve();
        }).catch((err) => {
            console.log(err);
            resolve();
        }); 
    });
});

Promise.all([p1, p2]).then(function() {
    mongoose.connection.close();
});