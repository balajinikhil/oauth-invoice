module.exports = (err,req,res,next)=>{
    
  err.statusCode = err.statusCode || 500;

  if (err.message.includes("jwt malformed")) {
    err.message = "Login Again";
  } else if (
    err.message.includes("Cannot read property 'emailVerifed' of null")
  ) {
    err.message = "User does not exist login again";
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
}