import { UUID } from 'mongodb';
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const todoSchema = new Schema({
    title: {
        type: String, 
        required: true},
    content: {
        type: String, 
        required: true},
    email: {
        type: String, 
        required: true
    },
    date: { 
        type: Date, 
        default: Date.now },
  }, {timestamps: true});
  const CompletedTodo = model('CompletedTodo', todoSchema);
  export default CompletedTodo;