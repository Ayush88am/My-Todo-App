const mongoose=require("mongoose");
// const { string, boolean } = require("zod");
const todoData=new mongoose.Schema({
  todoName:String,
  todoDate:String,
  todoTime: String,
  isTodoCompleted:String,
  token:String,
})
const userData = new mongoose.Schema({
  userName: String,
  userEmail: String,
  userPassword: String,
})
const todoModel = mongoose.model('UserTodoes',todoData)
const userModel = mongoose.model('UserInfo', userData)

module.exports={
  todoModel,
  userModel
}