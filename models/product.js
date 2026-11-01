const runQuery=require('../config/db');
// ------------------Public-------------------
const retriveData= async () => {

        const products= await runQuery("select * from products where deleted=false order by product_id ",[]);
        if(products.length>0)
        {
            return products;
        }
        return null;
    
}
module.exports.public={retriveData};
//--------------Authenticated--------------------
const addProduct=async (name,category,description,price)=>{
    const products= await runQuery("insert into products (name,category,description,price) values ($1,$2,$3,$4) returning *",[name,category,description,price]);
    if(products.length>0)
        {
            return products;
        }
    return null;

}
const editProduct=async (id,name,category,description,price)=>{
    let runQueryString="update products set "
  let params=[];
  if(name){
    params.push(name)
    runQueryString+=`name = $${params.length}`
  }
  if(category){
    if(params.length>0)
      runQueryString+=','
    params.push(category)
    runQueryString+=`category = $${params.length}`
  }
  if(description){
    if(params.length>0)
      runQueryString+=','
    params.push(description)
    runQueryString+=`description = $${params.length}`
  }
  if(price){
    if(params.length>0)
      runQueryString+=','
    params.push(price)
    runQueryString+=`price = $${params.length}`
  }
  if(params.length>0){
    params.push(id);
    runQueryString+= ` where product_id=$${params.length} returning *`
    const result= await runQuery(runQueryString,params);
    if( result.length>0){
        return result[0];
    }
    else{
        return null;
    }
  }

}
const deleteProduct= async(id)=>{
    await runQuery('update products set deleted=true where product_id =$1',[id]);
    return true;
}
const restoreProduct= async(id)=>{
    await runQuery('update products set deleted=false where product_id =$1',[id]);
    return true;
}
module.exports.authenticated={addProduct,editProduct,deleteProduct,restoreProduct};