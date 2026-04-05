const jwt=require("jsonwebtoken")
const Secret=process.env.JWT_SECRET
function Authmiddleware(req,res,next){
  const token=req.headers.token
  if(!token){
    res.status(403).json({
      message:"token not found"
    })
  }
  const decoded=jwt.verify(token,Secret)
  req.userId=decoded.userId
  next()
  
}

module.exports={
  Authmiddleware:Authmiddleware
}