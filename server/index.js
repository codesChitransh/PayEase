import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { User } from './models/user.js';
import { Bank } from './models/bank.js';
import { Transaction } from './models/transaction.js'; 
import dotenv from "dotenv"

dotenv.config();
const port = 3005;
const app = express();


app.use(express.json());
app.use(cors());


mongoose
  .connect(process.env.MONGO_URI, {
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });


app.post('/signup', (req, res) => {
  const { name, username, password, mobile } = req.body;

  User.create({ name, username, password, mobile })
    .then((user) => {
      return Bank.create({ userId: user._id, balance: 5000 }).then((account) => {
        res.json({
          user,
          account,
          success: true,
          message: 'User and account created successfully',
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          res.json({
            user,
            success: true,
            message: 'Login successful',
          });
        } else {
          res.json({
            message: 'Incorrect password',
            success: false,
          });
        }
      } else {
        res.json({
          message: 'No user found',
          success: false,
        });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});


app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/pay', async (req, res) => {
  const { payerUsername, receiverUsername, amount } = req.body;

  const session = await mongoose.startSession(); 
  session.startTransaction(); 

  try {
    const payer = await User.findOne({ username: payerUsername }).session(session);
    const receiver = await User.findOne({ username: receiverUsername }).session(session);

    if (!payer || !receiver) {
      await session.abortTransaction();   
      session.endSession();
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const payerAccount = await Bank.findOne({ userId: payer._id }).session(session);
    const receiverAccount = await Bank.findOne({ userId: receiver._id }).session(session);

    if (!payerAccount || !receiverAccount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: 'Bank account not found' });
    }

    const transferAmount = Number(amount);

    if (payerAccount.balance < transferAmount) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    payerAccount.balance -= transferAmount;
    receiverAccount.balance += transferAmount;

    await payerAccount.save({ session });
    await receiverAccount.save({ session });

    await Transaction.create([{ payerUsername, receiverUsername, amount: transferAmount }], { session });

    
    await session.commitTransaction();
    session.endSession();

    res.json({
      success: true,
      message: `Transferred ${transferAmount} from ${payerUsername} to ${receiverUsername}`,
      payer: { username: payerUsername, balance: payerAccount.balance },
      receiver: { username: receiverUsername, balance: receiverAccount.balance },
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({ success: false, message: err.message });
  }
});


app.get('/user/:username/balance', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const account = await Bank.findOne({ userId: user._id });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Bank account not found' });
    }

    res.json({ balance: account.balance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/user/:username/transactions', async (req, res) => {
  const { username } = req.params;

  try {
    const transactions = await Transaction.find({
      $or: [{ payerUsername: username }, { receiverUsername: username }],
    }).sort({ date: -1 }); 

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});