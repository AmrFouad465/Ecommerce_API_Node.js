const {retriveData}=require('../models/product').public;

const getAllProducts=async (req,res)=>{
    const result=await retriveData();
    return res.status(200).json(result);
}

module.exports={getAllProducts};