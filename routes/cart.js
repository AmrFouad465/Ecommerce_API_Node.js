const express=require('express');
const router=express.Router()
const {addProduct,cancelOrder,checkOutOrder,removeProduct}=require("../controllers/cart");
router.post("/cart",addProduct);
router.delete("/cart",cancelOrder)
router.put("/cart",checkOutOrder);
router.delete("/cart/:id",removeProduct)
module.exports=router;