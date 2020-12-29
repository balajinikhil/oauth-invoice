const AppError = require("./AppError");

module.exports = (req,res,next)=>{
    if(!req.user) next(new AppError('Unauthorized', 400));
    next();
};