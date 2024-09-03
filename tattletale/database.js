const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://shaqeebsk1234:K51XSj9akiFGZIiv@cluster0.au4cd8l.mongodb.net/test?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to database: ', error);
  }
};

module.exports = connectDB;
