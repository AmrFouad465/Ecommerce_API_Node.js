const {addRecord,modifyRecord,restoreRecord,deleteRecord}=require('../models/review').authenticated;

const addReview= async (req,res) => {
    const user_id=req.user.user_id;
    const admin=req.user.admin;
    if(admin){
       return  res.status(403).json({message:"Admin don't add review due to Credibility"})
    }
    const {product_id,review,comment}=req.body;
    const result=await addRecord(user_id,product_id,review,comment);
    if(!result){
        return res.status(409).json({message:"Your review is already exist"});
    }
    return res.status(201).json({message:"review added!!!!!"});
}
const modifyReview= async (req,res)=>{
    const user_id=req.user.user_id;
    const {product_id,review,comment}=req.body;
    const result=await modifyRecord(user_id,product_id,review,comment);
    if(!result){
        return res.status(409).json({message:"Your review is not exist"});
    }
    return res.status(201).json({message:"review modified!!!!!"});
}

const deleteReview= async (req,res)=>{
    const user_id=req.user.user_id;
    const product_id=req.params.id;
    await deleteRecord(user_id,product_id);
    res.status(201).json({message:"review deleted!!!!!"})
}
const restoreReview= async (req,res)=>{
    const user_id=req.user.user_id;
    const product_id=req.params.id;
    await restoreRecord(user_id,product_id);
    res.status(201).json({message:"review restored!!!!!"})
}
module.exports={addReview,modifyReview,deleteReview,restoreReview};