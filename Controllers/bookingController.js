// const { v4: uuidv4 } = require("uuid");
// const stripe = require("stripe")(
//   "sk_test_51P6rMrSJFcrhL6zYjKmTwKZnehvuzaou2DtRl7v7MLhPhnlS3XiIVYfr4ZBkhHszxHmIUrJczpGk0t5niZoFWR8P00kFipp5vT"
// );
// const Booking = require("../Models/bookingModel");
// const Car = require("../Models/carModel");
// exports.bookCar = async (req, res) => {
//   const { token } = req.body;
//   try {
//     const customer = await stripe.customers.create({
//       email: token.email,
//       source: token.id,
//     });

//     const payment = await stripe.charges.create(
//       {
//         amount: req.body.totalAmount * 100,
//         currency: "inr",
//         customer: customer.id,
//         receipt_email: token.email,
//         description: "Car Renting Services",
//       },
//       {
//         idempotencyKey: uuidv4(),
//       }
//     );

//     if (payment) {
//       req.body.transactionId = payment.source.id;
//       const newbooking = new Booking(req.body);
//       await newbooking.save();
//       const car = await Car.findOne({ _id: req.body.car });
//       console.log(req.body.car);
//       car.bookedTimeSlots.push(req.body.bookedTimeSlots);

//       await car.save();
//       res.send("Your booking is successfull");
//     } else {
//       return res.status(400).json(error);
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json(error);
//   }
// };
// exports.getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find().populate("car").populate("user");
//     res.send(bookings);
//   } catch (error) {
//     return res.status(400).json(error);
//   }
// };

const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51P6rMrSJFcrhL6zYjKmTwKZnehvuzaou2DtRl7v7MLhPhnlS3XiIVYfr4ZBkhHszxHmIUrJczpGk0t5niZoFWR8P00kFipp5vT"
);
const Booking = require("../Models/bookingModel");
const Car = require("../Models/carModel");

exports.bookCar = async (req, res) => {
  const { token } = req.body;
  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.totalAmount * 100,
      currency: "inr",
      customer: customer.id,
      receipt_email: token.email,
      description: "Car Renting Services",
      payment_method_types: ["card"],
    });

    if (paymentIntent && paymentIntent.status === "succeeded") {
      req.body.transactionId = paymentIntent.id;
      const newBooking = new Booking(req.body);
      await newBooking.save();
      const car = await Car.findOne({ _id: req.body.car });
      console.log(req.body.car);
      car.bookedTimeSlots.push(req.body.bookedTimeSlots);
      await car.save();
      res.send("Your booking is successful");
    } else {
      return res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("car").populate("user");
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

