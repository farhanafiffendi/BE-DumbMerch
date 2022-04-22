const express = require('express')

const router = express.Router()

// Controller
const { addUsers, getUsers, getUser, updateUser, deleteUser } = require('../controllers/user')
const { getProduct, addProduct, getDetailProduct, updateProduct, deleteProduct } = require('../controllers/product')
const { getCategory, addCategory, getDetailCategory, updateCategory, deleteCategory } = require('../controllers/category')

const { register, login } = require('../controllers/auth')

// Middleware
const { auth } = require('../middlewares/auth')
// Upload file
const { uploadFile } = require('../middlewares/uploadFile')

// Route
router.post('/user', addUsers)
router.get('/users', getUsers)
router.get('/user/:id', getUser)
router.patch('/user/:id', updateUser)
router.delete('/user/:id', deleteUser)

router.post('/category', addCategory)
router.get('/category/:id', getDetailCategory)
router.get('/categories', getCategory)
router.patch('/category/:id', updateCategory)
router.delete('/category/:id', deleteCategory)

router.get('/products', getProduct)
router.get('/product/:id', getDetailProduct)
router.patch('/product/:id', auth, uploadFile("image"), updateProduct)
router.delete('/product/:id', deleteProduct)
router.post('/product', auth, uploadFile("image"), addProduct) // place middleware before controller

// router.get('/transactions', getTransactions)
// router.post('/transaction', auth, addTransaction)

router.post('/register', register)
router.post('/login', login)

module.exports = router