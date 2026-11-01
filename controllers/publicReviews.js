const {getProductReviews}=require('../models/review').public;

const getReviews= async (req,res)=>{
    let product_id=req.params.id;
    let result=await getProductReviews(product_id);
    return res.status(200).json(result)
}
module.exports={getReviews};