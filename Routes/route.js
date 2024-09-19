const express = require("express")
const mongoose=require("mongoose")
const jwt=require("jsonwebtoken")
const path = require('path')

const { todoDataValidation,userSignUpMiddleware,userLoginMiddleware,jwtMiddleware}=require('../Middlewares/todoDataMiddleware')
const { todoModel,userModel } = require('../Models/todoDataModel')
const router=express.Router();
mongoose.connect(process.env.CONNECTIONSTRING)
router.post('/userSignup', userSignUpMiddleware, async (req, res) => {
  try{
    const istoken = req.cookies.token;
    if (istoken) {
      res.status(400).json({
        "message":"Please logout first"
      });
      return
    }
  const userEmail = req.body.userEmail;
  const isUser=await userModel.findOne({userEmail})
  if (isUser){
    res.status(400).json({
      "message": "User already exist Please logIn",
      
      
    })
    return
   }

  const newTodo = new userModel(req.body)
  const status = await newTodo.save();
  if (status) {
    const token=jwt.sign(userEmail,process.env.SECRET);
      res.cookie('token', token,{
        httpOnly: false,
        sameSite: 'Lax',
        domain: 'yourdomain.com',  
        path: '/'
      
      }
);
    res.status(200).json({
      "message": "You are signIn Succefully",
      "token": token
    })
  }
  else{
    res.json({
      "message": "Some unexpected error occured"
    })
  }
}
  catch (err) {
    res.sendStatus(500);
  }
})
router.post('/userLogin', userLoginMiddleware, async (req, res) => {
  try{
    const istoken = req.cookies.token;
  if(istoken){
    res.status(400).json({
      "messege":"Logout First"
    })
    return
  }
  const {userEmail,userPassword}=req.body;
  const isUser = await userModel.findOne({
    userEmail,userPassword
  })
  
  if (isUser) {
    const token = jwt.sign(userEmail, process.env.SECRET);
    res.cookie('token', token, { httpOnly: false });

    res.status(200).json({
      "messege":"Your are login successFully",
      "token":token
    })
  }
  else{
    res.status(404).json({
      "messege": "User not found Creat an account first"
    })
  }
}
  catch (err) {
    res.status(500).json({
      "messege":"internal server error"
    });
  }
})
router.get('/home',(req,res)=>{
  res.sendFile(path.join(__dirname, '../public', 'home.html'));
})
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'login.html'));
})
router.post('/addTodo', todoDataValidation,jwtMiddleware,async(req,res)=>{
  try{
  const token = req.cookies.token;
 
  const {todoName,todoDate,todoTime} = req.body;
   let isTodoCompleted="Uncompleted";
  const newTodo=new todoModel({
    itemName:todoName,
    isTodoCompleted,
    token,
    todoName,
    todoDate,
    todoTime
  })
  const status = await newTodo.save();
  if(status){
  res.status(200).json({
    "messege":"Todo Created SuccessFully"
  })
  }
  } catch (err) {
    res.sendStatus(500);
  }
})
router.get('/UnCompletedTodoes', jwtMiddleware, async (req, res) => {
  try{
  let isTodoCompleted = "Uncompleted";
  const token = req.cookies.token;
  const CompletedTodoes = await todoModel.find({ isTodoCompleted,token});
  if (CompletedTodoes) {
    res.status(200).json(CompletedTodoes)
  }
  else{
res.status(200).json({
  "messege":"you have not any todoes right now Creat an todo"
})
  }
}
catch(err){
    res.sendStatus(500);
}

})
router.get('/CompletedTodoes',jwtMiddleware,async(req,res)=>{
  try{
  let isTodoCompleted="Completed";
  const token = req.cookies.token;

  const CompletedTodoes = await todoModel.find({ isTodoCompleted, token });
  if (CompletedTodoes)
 {
  res.status(200).json(CompletedTodoes)
   }
   else{
    res.status.json({
      "messege":"you have'n completed any todo yet !"
    })
   }
  }
  catch (err) {
    res.sendStatus(500);
  }
})
router.put('/UpdateTodo', todoDataValidation, jwtMiddleware, async (req, res) => {
  try {
    const { isTodoCompleted, todoName, todoDate, todoTime } = req.body;
    const token = req.cookies.token;

    const updatedUser = await todoModel.findOneAndUpdate(
      { todoName: todoName, token: token, todoDate: todoDate, todoTime: todoTime },  
      {                 
        $set: {
          isTodoCompleted: isTodoCompleted,
          todoName: todoName,
          todoDate: todoDate,
          todoTime: todoTime,
          token:token
        }
      },
           
    );

   
    if (updatedUser) {
      res.status(200).json({"messege":"update"});
    } else {
      res.status(400).json({"messege":"not update"});
    }
  } catch (error) {
    res.status(500).send("An error occurred: " + error.message);
  }
});
router.delete('/delete-todo',async(req,res)=>{
  try{
    const isTodoDeletedawait = await todoModel.findOneAndDelete(req.body);
    if (isTodoDeletedawait) {
      res.status(200).json({
        "messege":"Todo deleted successfully."
      })
    }
  }
  catch(err){
    res.sendStatus(500);
  }
  
})
router.post('/userLogout', (req, res) => {
  const token=req.cookies.token;
  if(token){
  res.clearCookie('token');
  res.status(200).json({"messege":"Logged out successfully"});
  return
}
res.status(400).json({"messege":"login please"})
});


module.exports={
  router
}