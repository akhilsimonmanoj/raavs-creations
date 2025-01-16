const express = require('express')

const {authenticateUser} = require('./middlewares/authentication')
const {protect} = require('./middlewares/protect')
const userController = require('./controllers/userController')
const statusController = require('./controllers/statusController')
const reviewController = require('./controllers/reviewController')
const productController = require('./controllers/productController')
const paymentController = require('./controllers/paymentController')
const orderController = require('./controllers/orderController')
const categoryController = require('./controllers/categoryController')
const cartController = require('./controllers/cartController')
const vendorController = require('./controllers/vendorController')

const router = express.Router()

//User Routes
router.post('/user/register', userController.register)
router.post('/user/login', userController.login)
router.get('/user/account', userController.getAccount)
router.put('/user/update', userController.updateAccount)
router.put('/user/reset-password', userController.changePassword)
router.post('/user/forgot-password', userController.forgotPassword)
router.put('/user/delete', authenticateUser , protect , userController.deleteUser)

//Category Routes
router.post('/category/', authenticateUser , protect, categoryController.create)
router.get('/category/', categoryController.list)
router.get('/category/:id', categoryController.show)
router.put('/category/:id', authenticateUser , protect, categoryController.update)
router.delete('/category/:id', authenticateUser , protect, categoryController.destroy)

//Vendor Routes
router.post('/', authenticateUser, protect, vendorController.create)
router.get('/', authenticateUser, protect, vendorController.list)
router.put('/:id', authenticateUser, protect, vendorController.update)
router.delete('/:id', authenticateUser, protect, vendorController.destroy)

//Product Routes
router.post('/product/', authenticateUser , protect, productController.create)
router.get('/product/', productController.list)
router.get('/product/:id', productController.show)
router.put('/product/:id', authenticateUser , protect, productController.update)
router.delete('/product/:id', authenticateUser , protect, productController.destroy)

//Order Routes
router.post('/order/', authenticateUser , orderController.create)
router.get('/order/', authenticateUser , protect, orderController.list)
router.get('/order/:id', authenticateUser , orderController.show)
router.put('/order/:id', authenticateUser , protect, orderController.update)

//Status Routes
router.post('/status/', authenticateUser , protect, statusController.create)
router.get('/status/', authenticateUser , statusController.list)
router.get('/status/:id', authenticateUser , statusController.show)
router.put('/status/:id', authenticateUser , protect, statusController.update)
router.delete('/status/:id', authenticateUser , protect, statusController.destroy)

//Review Routes
router.post('/review/', authenticateUser , reviewController.create)
router.get('/review/', reviewController.list)
router.get('/review/:id', reviewController.show)
router.put('/review/:id', authenticateUser , reviewController.update)
router.delete('/review/:id', authenticateUser , protect, reviewController.destroy)

//Payment Routes
router.post('/payment/', authenticateUser , paymentController.create)
router.get('/payment/', authenticateUser , protect, paymentController.list)
router.get('/payment/:id', authenticateUser , paymentController.show)
router.put('/payment/:id', authenticateUser , protect, paymentController.update)
router.delete('/payment/:id', authenticateUser , paymentController.softDelete)
router.post('/verify', authenticateUser, paymentController.verifyPayment)

//Cart Controller
router.post('/cart/', cartController.create)
router.get('/cart/', cartController.listItems)
router.put('/cart/:id', cartController.update)
router.put('/cart/remove', cartController.removeFromCart)
router.put('/cart/clear/:id', cartController.clearCart)



module.exports = router