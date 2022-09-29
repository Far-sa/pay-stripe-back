const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const stripe = require('stripe')(
  'sk_test_51LK0zIBz45u3eU5C1c9VpP8e3CuT4XPsCwvYAQ1VRJh0bcti1q1a2mlb6Jarh0W9ouFGFM6OXr8ChWAKUZ263kzz00UruPQGBv '
)
const dotenv = require('dotenv')
const { v4: uuidv4 } = require('uuid')

//* Load COnfig
dotenv.config({ path: './config/.env' })

const app = express()

//? Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

//? Routes
app.get('/', (req, res) => {
  res.send(' Hey Puppet')
})

app.post('/payment', async (req, res, next) => {
  const { token = {}, amount = 0 } = req.body
  const idempotencyKey = uuidv4()

  const { id: customerId } = await stripe.customers
    .create({
      email: token.email,
      source: token.id
    })
    .catch(err => {
      console.log(err)
    })

  if (!customerId) {
    res.status(500).json({ success: false })
  }
  //* such as uuid proccess
  // const invoiceId = `${
  //   token.email
  // }-${Math.random().toString()}-${Date.now().toString()}`

  try {
    charge = await stripe.charges.create(
      {
        amount: amount * 100,
        currency: 'USD',
        customer: customerId,
        receipt_email: token.email,
        description: 'Payment'
      },
      { idempotencyKey }
    )
  } catch (err) {
    console.log(err)
  }
  return charge

  if (!charge) {
    res.status(500).json({ success: false })
    return
  }
  res.status(201).json({ success: true })
})

//? Lunch Server
const PORT = process.env.Port || 5000
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})
