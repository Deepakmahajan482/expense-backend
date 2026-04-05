const express=require('express')
const {userModel,expenseModel}=require('./models')
const jwt=require('jsonwebtoken')
const {Authmiddleware}=require("./middleware")
const Secret="Deepak1234"
const app=express()
app.use(express.json())


app.get('/signup',(req,res)=>{
res.sendFile('D:/mern project/Expense-Tracker/frontend/signup.html')
})
// done
app.post('/signup',async(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const userExists=await userModel.findOne({
    username:username
  })
  if(userExists){
    res.status(403).json({
      message:"user already exists"
    })
    return 
  }
  const user=await userModel.create({
    username:username,
    password:password
  })
  res.json({
    message:"user created successfully"
  })
})

app.get('/signin',(req,res)=>{
res.sendFile('D:/mern project/Expense-Tracker/frontend/signin.html')
})
// done
app.post('/signin',async(req,res)=>{
  const username=req.body.username;
  const password=req.body.password;
  const userExists=await userModel.findOne({
    username:username,
    password:password
  })
  if(!userExists){
    res.status(403).json({
      message:"user not exists"
    })
    return 
  }
  const token=jwt.sign({id:userExists._id},Secret);
  res.json({
    token:token
  })

})


app.get('/dashboard',(req,res)=>{
res.sendFile('D:/mern project/Expense-Tracker/frontend/dashboard.html')
})

//done
app.post("/add",Authmiddleware,async(req,res)=>{
  const title=req.body.title;
  const amount=req.body.amount;
  const category=req.body.category;
  const userId=req.userId;
  const expense=await expenseModel.create({
    title:title,
    amount:amount,
    category:category,
    user:userId
  })
  res.json({
    message:"added successfully"
  })
})


//done
app.get("/view",Authmiddleware,async(req,res)=>{
  const userId=req.userId;
  const expenses=await expenseModel.find({
    user:userId
  })
  res.json({
    message:expenses
  })
})

//done
app.delete("/delete/:id",Authmiddleware,async(req,res)=>{
  const userId=req.userId;
  const id=req.params.id;
  const expense=await expenseModel.findOne({
    _id:id,
    user:userId
  })
  if(!expense){
    res.status(403).json({
      message:"expense not found"
    })
    return
  }
  const deleted=await expenseModel.findByIdAndDelete(expense._id)
  res.json({
    message:"deleted successfully"
  })
})

//done
app.get('/sum',Authmiddleware,async(req,res)=>{
  const userId=req.userId;
  const expense=await expenseModel.find({
    user:userId
  })
  let sum=0;
  for(let i=0;i<expense.length;i++){
    sum+=expense[i].amount;
  }
  res.json({
    message:sum
  })

})

app.get('/category', Authmiddleware, async (req, res) => {
  const result = await expenseModel.aggregate([
    {
      $match: { user: req.userId }
    },
    {
      $group: {
        _id: "$category",
        totalAmount: { $sum: "$amount" }
      }
    }
  ]);

  res.json(result);
});

app.listen(3000,()=>{
  console.log("server is running")
})
