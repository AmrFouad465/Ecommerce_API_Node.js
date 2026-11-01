const express=require('express');
const {getReviews}=require('../controllers/publicReviews');
const router=express.Router();
router.get('/reviews/:id',getReviews);
module.exports=router;
