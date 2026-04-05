const url='mongodb+srv://deepak:1234@expense-tracker.dp26hzx.mongodb.net/'
const mongoose=require('mongoose')
mongoose.connect(url)
const userSchema=new mongoose.Schema({
  username:String,
  password:String
})

const expenseSchema=new mongoose.Schema({
  title:String,
  amount:Number,
  category:String,
  user:mongoose.Types.ObjectId,
  date:{
    type:Date,
    default:Date.now()
  }
  
})
const userModel=mongoose.model("users",userSchema)
const expenseModel=mongoose.model("expenses",expenseSchema)
console.log("connected")
module.exports=({
  userModel:userModel,
  expenseModel:expenseModel
})