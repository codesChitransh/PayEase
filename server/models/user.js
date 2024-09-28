import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username:{
    type:String,
    required:true
  },
  password: { type: String, required: true },
  mobile: { type: String, required: true,min:[10],max:[10] }
});

export const User = mongoose.model('User', userSchema);
