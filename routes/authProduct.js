const express=require('express');
const router=express.Router();
const {addNewProduct,removeProduct,updateProduct,restoringProduct}=require('../controllers/authProduct');
router.post('/product',addNewProduct);
router.put('/product/:id',updateProduct);
router.delete('/product/:id',removeProduct);
router.post('/product/:id',restoringProduct);
module.exports=router;