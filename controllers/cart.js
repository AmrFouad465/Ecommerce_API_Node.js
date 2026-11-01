const {addRecord,cancelRecord,checkOutRecord,removeRecord}=require('../models/cart');

function message(text){
    return {message:text}
}

const addProduct=async(req,res)=>{
    const user =req.user;
    console.log(JSON.stringify(user))
    const user_id=user.user_id;
    const {product_id,qty}=req.body;
    if(!product_id || !qty)
    {
        return res.status(400).json(message("no product or qty is given"))
    }
    const {defaultLocation}=req.body;
    if(!defaultLocation)
    {
        const {lat,long,country}=req.body;  
        let result=await addRecord(lat,long,country,user_id,product_id,qty);
        return res.status(201).json(message("Product added to your cart"));
    }
    await addRecord(user.lat,user.long,user.country,user_id,product_id,qty);
    return res.status(201).json(message("Product added to your cart"));
    
}
const removeProduct= async (req,res)=>{
    const user =req.user;
    const user_id=user.user_id;
    const product_id=req.params.id;
    let result=await removeRecord(user_id,product_id);
    if(!result){
        return res.status(400).json(message("you have no Product to remove it"));
    }
    return res.status(201).json(message("Order delivered!!!!"));
}

const cancelOrder= async (req,res) => {
    const user =req.user;
    const user_id=user.user_id;
    let result=await cancelRecord(user_id);
    if(!result){
        return res.status(400).json(message("you have no order to cancel it"));
    }
    return res.status(201).json(message("Order cancelled!!!!"));
    
}
const checkOutOrder= async (req,res)=>{
    const user =req.user;
    const user_id=user.user_id;
    let result=await checkOutRecord(user_id);
    if(!result){
        return res.status(400).json(message("you have no order to checkOut it"));
    }
    return res.status(201).json(message("Order checkOut!!!!"));
}


module.exports={addProduct,removeProduct,cancelOrder,checkOutOrder}