const runQuery=require('../config/db');

////------public----------

const getProductReviews=async (product_id) =>{
    const result= await  runQuery('select u.email,r.product_id,r.reviews, r.comment from users as u join reviews as r on u.user_id=r.user_id where r.product_id=$1 and r.deleted=false',[product_id]);
    return result;
}
module.exports.public={getProductReviews};
////-------Authenticated----------
const addRecord=async (user_id,product_id,review=0.0,comment="") => {

    const exist= await runQuery('select * from reviews where user_id=$1 and product_id=$2',[user_id,product_id]);
    if(exist.length>0){
        return null;
    }
    const result= await runQuery('insert into reviews (user_id,product_id,reviews,comment) values ($1,$2,$3,$4) returning *',[user_id,product_id,review,comment])
    return result;
}
const modifyRecord=async (user_id,product_id,review,comment) => {

  let runQueryString="update reviews set "
  let params=[];
  if(review){
    params.push(review)
    runQueryString+=`reviews = $${params.length}`
  }
  if(comment){
    if(params.length>0)
      runQueryString+=','
    params.push(comment)
    runQueryString+=`comment = $${params.length}`
  }
  
  if(params.length>0){
    params.push(user_id);
    params.push(product_id);
    runQueryString+= ` where user_id=$${params.length-1} and product_id=$${params.length} returning *`
    const result= await runQuery(runQueryString,params);
    if( result.length>0){
        return result[0];
    }
    else{
        return null;
    }
  }
}
const deleteRecord=async (user_id,product_id) => {

    const result= await runQuery('update reviews set deleted=true where user_id=$1 and product_id=$2',[user_id,product_id])
    return true;
}
const restoreRecord=async (user_id,product_id) => {

    const result= await runQuery('update reviews set deleted=false where user_id=$1 and product_id=$2',[user_id,product_id])
    return true;
}
module.exports.authenticated={addRecord,modifyRecord,deleteRecord,restoreRecord};