const express = require("express")
const cookieParser = require("cookie-parser")
const cors=require('cors')
const app=express()
const path=require('path')
require('dotenv').config({ path: '.env.local' });
app.use(express.static(path.join(__dirname, 'public')));

const {router}=require('./Routes/route')
app.use(express.json())
app.use(cookieParser());
app.use(cors())
app.post("/addTodo", router)
app.get("/UnCompletedTodoes", router)
app.get("/CompletedTodoes", router)
app.put("/UpdateTodo", router)
app.post("/userSignup", router)
app.post("/userLogin", router)
app.post("/userLogout", router)
app.get("/home", router)
app.get('/login',router)
app.delete('/delete-todo',router);
const PORT=process.env.PORT || 3000
app.listen(PORT)