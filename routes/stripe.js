const express = require('express')
const stripeController = require('../controllers/stripe')

const router = express.Router()

router.post('/payment', stripeController.payment)

module.exports = router
