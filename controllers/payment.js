const config = require("../config/database");
const razorpay = require("razorpay");
const mongoose = require("mongoose");
const Payment = require("../models/payment");
const Credit = require("../models/credit");
const User = require("../models/user");

var instance = new razorpay({
  key_id: config.keys.razorpay.keyId,
  key_secret: config.keys.razorpay.keySecret,
});

exports.getAllPayments = async (req, res, next) => {
  try {
    let payments = await Payment.find();
    res.status(200).json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.createPayment = async (req, res, next) => {
  try {
    var options = {
      amount: req.body.amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: "EI" + new Date().getTime(),
      payment_capture: "0",
    };
    instance.orders.create(options, async (err, order) => {
      if (err) {
        res.json({ sucess: false, error: err });
      } else {
        const payment = new Payment({
          order: order.id,
          amount: order.amount / 100,
          capture: false,
          receipt: order.receipt,
          userId: req.userData.userId,
          created_at: order.created_at,
        });
        let result = await payment.save();
        const credit = new Credit({
          credit: (order.amount * 4) / 100,
          amount: order.amount / 100,
          user: req.userData.userId,
          raz_order_id: order.id,
          raz_status: "created",
          created_at: Date.now(),
        });
        await credit.save();
        res.status(201).json({ success: true, data: result });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.paymentCallbackWithOrderId = async (req, res, next) => {
  try {
    const id = req.params.id;
    instance.payments.fetch(id, (err, info) => {
      if (err) {
        return res.json({ success: false, error: "Inavlid callback url" });
      } else if (!info.order_id) {
        return res.json({ success: false, error: "Invalid orderId" });
      } else if (info.captured) {
        data = {
          capture: true,
          amount: info.amount / 100,
          raz_payment_id: info.id,
          raz_status: info.status,
          data: info,
        };
        Payment.findOne({
          $and: [{ order: info.order_id }, { capture: false }],
        })
          .exec()
          .then((result) => {
            if (result) {
              Payment.updateOne(
                { order: info.order_id },
                { $set: data },
                { new: true, useFindAndModify: false }
              )
                .exec()
                .then((ret) => {
                  if (ret) {
                    const credit_data = {
                      credit: result.amount * 4,
                      amount: result.amount,
                      raz_payment_id: info.id,
                      raz_status: info.status,
                      capture: true,
                    };
                    Credit.findOneAndUpdate(
                      { raz_order_id: info.order_id },
                      { $set: credit_data }
                    )
                      .exec()
                      .then((resul) => {
                        console.log(resul);
                        res.json({
                          success: true,
                          message: "Credit has been added to your account",
                        });
                      })
                      .catch((err) => {
                        res.json({ success: false, error: err });
                      });
                  } else {
                    return res.json({
                      success: false,
                      error: "Document not found",
                    });
                  }
                })
                .catch((er1) => {
                  res.json({ success: false, error: er1 });
                });
            } else {
              res.json({ success: false, error: "Document not found" });
            }
          })
          .catch((err) => {
            res.json({ success: false, error: err });
          });
      } else {
        res.json({
          success: false,
          error: "your order has not been captured ",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

/**for subscription buy controllers */

const calculateExpireDate = (date, days) => {
  const expDate = new Date(Number(date));
  expDate.setDate(date.getDate() + days);
  return expDate;
};

exports.createPaymentToSubscribe = async (req, res, next) => {
  try {
    let expireDate = calculateExpireDate(new Date(), req.body.dayCount);
    var options = {
      amount: req.body.amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: "EI" + new Date().getTime(),
      payment_capture: "0",
    };
    instance.orders.create(options, async (err, order) => {
      if (err) {
        res.json({ sucess: false, error: err });
      } else {
        const payment = new Payment({
          order: order.id,
          amount: order.amount,
          capture: false,
          receipt: order.receipt,
          userId: req.userData.userId,
          expireDate: expireDate,
          created_at: order.created_at,
        });
        let result = await payment.save();
        res.status(201).json({ success: true, data: result });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.paymentCallbackWithOrderIdToSubscribe = async (req, res, next) => {
  try {
    const id = req.params.id; //payment id
    instance.payments.fetch(id, async (err, info) => {
      if (err) {
        return res.json({ success: false, error: "Inavlid callback url" });
      } else if (!info.order_id) {
        return res.json({ success: false, error: "Invalid orderId" });
      } else if (info.captured) {
        let data = {
          capture: true,
          amount: info.amount,
          raz_payment_id: info.id,
          raz_status: info.status,
          data: info,
        };
        /**find payment record */
        let result = await Payment.findOne({
          $and: [{ order: info.order_id }, { capture: false }],
        });
        if (!result) {
          return res.json({ success: false, error: "Document not found" });
        }
        /**update payment status */
        let ret = await Payment.updateOne(
          { order: info.order_id },
          { $set: data },
          { new: true, useFindAndModify: false }
        );
        if (!ret) {
          return res.json({ success: false, error: "Document not found" });
        }
        /**update expire date for loggedin user */
        const update_user = {
          expireDate: result.expireDate,
        };
        await User.findOneAndUpdate(
          { _id: result.userId },
          { $set: update_user }
        );
        res.json({
          success: true,
          message: `Subscription is valid upto ${result.expireDate}`,
        });
      } else {
        res.json({
          success: false,
          error: "your order has not been captured ",
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

exports.freeTrial = async (req, res, next) => {
  try {
    let expireDate = calculateExpireDate(new Date(), req.body.dayCount);
    let data = {
      capture: true,
      amount: 0,
      userId: req.userData.userId,
      expireDate: expireDate,
      created_at: new Date(),
    };

    const payment = new Payment(data);
    await payment.save();

    /**update expire date for loggedin user */
    const update_user = {
      expireDate: expireDate,
    };
    let updated_value = await User.findOneAndUpdate(
      { _id: req.userData.userId },
      { $set: update_user },
      { new: true }
    );
    console.log(updated_value)
    let expDt =
      expireDate.getDate() +
      "/" +
      parseInt(expireDate.getMonth() + 1) +
      "/" +
      expireDate.getFullYear();
    res.json({
      success: true,
      message: `Your Free Trial is valid upto ${expDt}`,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error });
  }
};
