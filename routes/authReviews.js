const express=require('express');
const router=express.Router();
const {addReview,deleteReview,modifyReview,restoreReview}=require('../controllers/authReviews');
router.post('/review',addReview);
router.put('/review/:id',modifyReview);
router.delete('/review/:id',deleteReview);
router.post('/review/:id',restoreReview);
module.exports=router;