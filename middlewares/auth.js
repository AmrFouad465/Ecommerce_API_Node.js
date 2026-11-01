const {verifyToken}=require('../controllers/auth')
module.exports=(req,res,next)=>{
    let token=req.session?.authorization;
    if(!token){
        return res.status(401).json({message:'please login or signup first :3'})
    }
    let user=verifyToken(token);
    if(!user){
        return res.status(401).json({message:'Invalid token :|'})
    }
    req.user=user;
    next();
}