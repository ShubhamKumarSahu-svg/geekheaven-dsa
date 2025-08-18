import mongoose from 'mongoose';

const connect_db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connect_db;
