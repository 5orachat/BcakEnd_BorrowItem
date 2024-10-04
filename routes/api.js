const express = require('express');


const router = express.Router();
const customerController = require('../controller/customers');
const productController = require('../controller/products');
const epmController = require('../controller/employees');
const userController = require('../controller/users');
const orderController = require('../controller/orders');

router.post('/customers', customerController.createCustomer);
router.put('/customers/:id', customerController.updateCustomer);
router.delete('/customers/:id',  customerController.deleteCustomer);
router.get('/customers/:id', customerController.getCustomer);
router.get('/customers/q/:term', customerController.getCustomersByTerm);
router.get('/customers',  customerController.getCustomers);


router.post('/products',  productController.createProduct);
router.put('/products/:id',  productController.updateProduct);
router.delete('/products/:id',  productController.deleteProduct);
router.get('/products/:id', productController.getProduct);
router.get('/products/q/:term', productController.getProductsByTerm);
router.get('/products', productController.getProducts);

router.post('/employees',  epmController.createemployee);
router.put('/employees/:id',  epmController.updateemployee);
router.delete('/employees/:id',  epmController.deleteemployee);
router.get('/employees/:id', epmController.getemployee);
router.get('/employees/q/:term', epmController.getemployeesByTerm);
router.get('/employees', epmController.getemployee);

router.get('/orders', orderController.getOrder);
router.post('/orders',  orderController.createOrder);

router.post('/users',  userController.createUser);



module.exports = router;



