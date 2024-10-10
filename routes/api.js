const express = require('express');


const router = express.Router();

const { uploadimg, createProduct } = require('../controller/products');
const productController = require("../controller/products")
const userController = require('../controller/users');
const borrowController = require('../controller/borrow');

router.post('/products', uploadimg, createProduct);
router.put('/products/:id',  productController.updateProduct);
router.delete('/products/:id',  productController.deleteProduct);
router.get('/products', productController.getProducts);

router.get('/borrows', borrowController.getBorrow);
router.post('/borrows',  borrowController.createBorrow);

router.post('/users',  userController.createUser);
router.delete('/users/:id',  userController.deleteUser);
router.get('/users/q/:term', userController.getUsersByName);
router.get('/users',  userController.getUser);



module.exports = router;



