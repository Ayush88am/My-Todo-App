const z = require("zod");
const jwt=require('jsonwebtoken')
const todoDataSchema = z.object({
  todoDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  todoName: z.string().min(1),
  todoTime: z.string().regex(/^\d{2}:\d{2}$/)

});
const userSignUPData=z.object({
  userName:z.string().min(3),
  userEmail:z.string().email(),
  userPassword:z.string().min(5)

})
const userLoginData = z.object({
  userEmail: z.string().email(),
  userPassword: z.string().min(5)

})
const jwtMiddleware=(req,res,next)=>{
  const token = req.cookies.token; // Retrieve the token from cookies
  if (!token) {
    return res.status(400).json({
      "messege":"Access Denied. Login first"
    });
  }
  try {
    const verified = jwt.verify(token, process.env.SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({
      "message":'Invalid token.'}
    );
  }
};
const todoDataValidation = (req, res, next) => {
  const data = todoDataSchema.safeParse(req.body);

  if (data.success) {
    next();
  } else {
    res.status(400).json({
      messege: "Invalid input data",
    });
  }
};
const userSignUpMiddleware=(req,res,next)=>{
const data=userSignUPData.safeParse(req.body);
if(data.success){
  next();
}
else{
  res.status(400).json({
    message:"Invalid data"
  })
  return
}
}
const userLoginMiddleware = (req, res, next) => {
  const data = userLoginData.safeParse(req.body);
  if (data.success) {
    next();
  }
  else {
    res.status(400).json({
      messege: "Invalid data"
    })
    return
  }
}

module.exports = {
  todoDataValidation,
  userSignUpMiddleware,
  userLoginMiddleware,
  jwtMiddleware
};
