const {addRecord,deleteRecord}=require('../models/branches');
const addBranch=async (req,res) => {
    if(req.user.admin===false){
        return res.status(403).json({message:"you are forbidden from this critical section"});
    }
    const {location}=req.body;
    const result=await addRecord(location);
    if(!result){
        return res.status(409).json({message:"failed to add ur address , please try another format"})
    }
    return res.status(201).json({message:"Branch added!!!!!"});
    
}
const deleteBranch=async (req,res) => {
    if(req.user.admin===false){
        return res.status(403).json({message:"you are forbidden from this critical section"});
    }
    const branch_id=req.params.id;
    const result=await deleteRecord(branch_id);
    return res.status(201).json({message:"Branch deleted!!!!!"});
    
}
module.exports={addBranch,deleteBranch};