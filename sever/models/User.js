import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String, 
        required: true},
    password: {
        type: String, 
        required: true},
    firstname: {
        type: String, 
        required: true
    },
    lastname: {
        type: String, 
        required: true
    },
  }, {timestamps: true});
  const UserData = model('UserData', userSchema);
  export default UserData;