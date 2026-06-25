const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Send money via Phone Number OR UPI ID
// @route   POST /api/transactions/send
// @access  Private
const sendMoney = async (req, res) => {
  const { receiverIdentifier, amount, mpin } = req.body;
  const senderId = req.user._id;

  if (!mpin) {
    return res.status(400).json({ message: 'MPIN is required for transactions' });
  }

  if (!receiverIdentifier) {
    return res.status(400).json({ message: 'Receiver phone or UPI ID is required' });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Amount must be greater than zero' });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const sender = await User.findById(senderId).session(session);

    if (!sender.mpin) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Please setup your MPIN first' });
    }

    const isMpinCorrect = await bcrypt.compare(mpin.toString(), sender.mpin);
    if (!isMpinCorrect) {
      await session.abortTransaction();
      return res.status(401).json({ message: 'Incorrect MPIN' });
    }

    const receiver = await User.findOne({
      $or: [{ phone: receiverIdentifier }, { upiId: receiverIdentifier }],
    }).session(session);

    if (!receiver) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Receiver not found (Invalid Phone/UPI)' });
    }

    if (senderId.toString() === receiver._id.toString()) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'You cannot send money to yourself' });
    }

    if (sender.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save({ session });
    await receiver.save({ session });

    const transaction = await Transaction.create(
      [
        {
          sender: senderId,
          receiver: receiver._id,
          type: 'TRANSFER',
          amount,
          status: 'SUCCESS',
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: 'Money Transfer Successful',
      transaction: transaction[0],
      newBalance: sender.balance,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name phone upiId')
      .populate('receiver', 'name phone upiId')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sendMoney, getTransactionHistory };
