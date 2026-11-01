const {addProduct,deleteProduct,editProduct,restoreProduct}=require('../models/product').authenticated;

const addNewProduct= async (req,res) => {
    const {name,category,description,price}=req.body;
    if(req.user.admin===false){
        return res.status(403).json({message:"you are forbidden from this critical section"});
    }
    const result=await addProduct(name,category,description,price);
     if(!result){
      return res.status(500).json({message:`Product can't be added!!!!`});   
    }
    if(result.length>0){
        return res.status(201).json({message:`Product added!!!!`});
    }
    return res.status(500).json({message:`Product can't be added!!!!`});
}
const updateProduct= async (req,res) => {
    const {name,category,description,price}=req.body;
    const product_id=req.params.id;
    if(req.user.admin===false){
        return res.status(403).json({message:"you are forbidden from this critical section"});
    }
    const result=await editProduct(name,category,description,price);
    if(!result){
      return res.status(500).json({message:`Product can't be modified!!!!`});   
    }
    if(result.length>0){
        return res.status(201).json({message:`Product modified!!!!`});
    }
    return res.status(500).json({message:`Product can't be modified!!!!`});
}
const removeProduct= async (req,res) => {
    const product_id=req.params.id;
    if(req.user.admin===false){
        return res.status(403).json({message:"you are forbidden from this critical section"});
    }
    const result=await deleteProduct(product_id);
    res.status(201).json({message:"Product deleted!!!!!"});
    
}
const restoringProduct= async (req,res) => {
    const product_id=req.params.id;
    if(req.user.admin===false){
        return res.status(403).json({message:"you are forbidden from this critical section"});
    }
    const result=await restoreProduct(product_id);
    res.status(201).json({message:"Product restored!!!!!"});
    
}
module.exports={addNewProduct,updateProduct,removeProduct,restoringProduct}