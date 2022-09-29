const stripe = require('stripe')(
  'sk_test_51LK0zIBz45u3eU5C1c9VpP8e3CuT4XPsCwvYAQ1VRJh0bcti1q1a2mlb6Jarh0W9ouFGFM6OXr8ChWAKUZ263kzz00UruPQGBv '
)
const { v4: uuidv4 } = require('uuid')

exports.payment = async (req, res, next) => {
  const { token = {}, amount = 0 } = req.body
  const idempotencyKey = uuidv4()

  // if (!Objectj.keys(token).length || !amount) {
  //   res.status(400).json({ success: false })
  // }
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

  const charge = await stripe.charges
    .create(
      {
        amount, //amount * 100,
        currency: 'USD',
        customer: customerId,
        receipt_email: token.email,
        description: 'Payment'
      },
      { idempotencyKey: idempotencyKey }
    )
    .catch(e => {
      console.log(e)
    })

  if (!charge) {
    res.status(500).json({ success: false })
    return
  }
  res.status(201).json({ success: true })
}

//? Another try
// app.post('/payment', async (req, res) => {
//   let status, error
//   const { token, amount } = req.body
//   console.log('amount', amount)
//   //onsole.log('TOKEN', token)
//   try {
//     await stripe.charges.create({
//       source: token.id,
//       amount,
//       currency: 'usd'
//     })
//     status: 'success'
//   } catch (error) {
//     console.log(error)
//     status: 'fail'
//   }
//   res.json({ error, status })
// })

//? Another try
// app.post('/payment', async (req, res) => {
//   const { token, product } = req.body
//   console.log('PRODUCT', product)
//   console.log('PIRCE', product.price)
//   const idempontencyKey = uuidv4()

//   return stripe.customers
//     .create({
//       email: token.email,
//       source: token.id
//     })
//     .then(customer => {
//       stripe.charges.create(
//         {
//           amount: product.price * 100,
//           currency: 'usd',
//           customer: customer.id,
//           receipt_email: token.email,
//           description: product.title,
//           shipping: {
//             name: token.card.name,
//             address: {
//               country: token.card.address_country
//             }
//           }
//         },
//         { idempontencyKey: idempontencyKey }
//       )
//     })
//     .then(result => res.status(200).json(result))
//     .catch(err => console.log(err))
// })
