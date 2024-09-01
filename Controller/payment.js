const connection = require('../database');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.payment = async (req, res) => {
  try {
    const priceId = req.body.price_id;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'amazon_pay', 'link'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      shipping_address_collection: {
        allowed_countries: ['IN', 'US', 'AE'],
      },
      phone_number_collection: {
        enabled: true,
      },
      success_url:
        'https://myntra-apis.onrender.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://myntra-apis.onrender.com/cancel',
    });
    res.redirect(session.url);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server  error in payment' });
  }
};

exports.success = async (req, res) => {
  try {
    const result1 = await Promise.all([
      stripe.checkout.sessions.retrieve(req.query.session_id, {
        expand: ['payment_intent.payment_method'],
      }),
      stripe.checkout.sessions.listLineItems(req.query.session_id),
    ]);

    const result = result1;

    if (result.length > 0) {
      const startPlanDate = new Date();
      const endPlanDate = new Date();
      const IndianCurrency = 'INR';
      endPlanDate.setMonth(endPlanDate.getMonth() + 1);

      const sqlquery =
        'INSERT INTO transactions(transaction_id, user_name, user_email, user_phone, subscription_id, subscription_name, amount, currency, payment_method, transaction_type, status,start_plan_date,end_plan_date) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)';

      const transactionData = [
        result[0]?.id,
        result[0]?.customer_details?.name,
        result[0]?.customer_details?.email,
        result[0]?.customer_details?.phone,
        result[0]?.subscription,
        result[1]?.data[0]?.description,
        result[0]?.amount_total,
        IndianCurrency,
        result[0]?.payment_method_types.join(', '),
        result[0]?.mode,
        result[0]?.status,
        startPlanDate,
        endPlanDate,
      ];
      const [queryResult] = await connection
        .promise()
        .execute(sqlquery, transactionData);

      if (queryResult.affectedRows === 0) {
        res.status(200).send({ message: 'Transaction not created' });
      } else {
        res.cookie('session_id', req.query.session_id, {
          maxAge: 5 * 60 * 60 * 1000, // 5 hours in milliseconds
        });
        console.log('session ', req.query.session_id);
        res.send('Your payment was successfull');
      }
    } else {
      res.status(404).send({ message: 'No results found.' });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ error: 'Internal server error', details: error.message });
  }
};
exports.refundPayment = async (req, res) => {
  try {
    const sessionId = req.body.session_id;

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'setup_intent'],
    });

    let paymentIntentId;

    if (session.payment_intent) {
      paymentIntentId = session.payment_intent.id;
    } else if (session.subscription) {
      const subscriptionId = session.subscription.id;
      const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['latest_invoice.payment_intent'],
      });
      paymentIntentId = subscription.latest_invoice.payment_intent.id;
    } else if (session.setup_intent) {
      paymentIntentId = session.setup_intent.id;
    }

    if (!paymentIntentId) {
      return res.status(404).send({ message: 'Payment Intent ID not found' });
    }
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });

    if (refund) {
      const updateQueryForRefundedAmount = `
        UPDATE transactions 
        SET refunded_amount = ?, 
            start_plan_date = NULL, 
            end_plan_date = NULL 
        WHERE transaction_id = ?;
      `;

      const [queryResult] = await connection
        .promise()
        .execute(updateQueryForRefundedAmount, [refund.amount, sessionId]);

      if (queryResult.affectedRows === 0) {
        return res.status(200).send({ message: 'No rows updated' });
      } else {
        console.log('Refund updated:', queryResult);
      }
    }
    // res.send({ message: 'Refund processed successfully', refund });
    res.send('Refund processed successfully');
  } catch (error) {
    console.error('Refund error:', error);
    res
      .status(500)
      .send({ error: 'Internal server error', details: error.message });
  }
};

exports.cancel = async (req, res) => {
  res.send('Your payment is failed ');
};
