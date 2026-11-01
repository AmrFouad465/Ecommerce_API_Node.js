const express=require('express');
const router=express.Router();
const {getAllProducts}=require('../controllers/publicProduct');
router.get('/products',getAllProducts);
module.exports=router;