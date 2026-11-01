const express=require('express');
const router=express.Router();
const {addBranch,deleteBranch}=require('../controllers/branches')
router.post('/branch',addBranch);
router.delete('/branch/:id',deleteBranch);
module.exports=router;