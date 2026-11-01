const {startTransaction,endTransaction} = require("../config/db").Transaction;

async function getNearestBranch(client,long,lat,country,product_id,qty) {

  let {rows:branches}=await client.query("select b.* from branches as b join inventory as i on i.branch_id=b.branch_id where  i.qty >= $1 and b.country = $2 and i.product_id=$3",[qty,country,product_id]);
  if(branches.length===0){
    return null;
  }

  let nearestBranch=branches[0];
  let minDis=Math.sqrt((nearestBranch.lat-lat)**2 + (nearestBranch.long -long)**2)

  for(let branch of branches){
    let dis=Math.sqrt((branch.lat-lat)**2 + (branch.long -long)**2)
    if(dis<minDis){
      nearestBranch=branch;
      minDis=dis;
    }
  }
  return nearestBranch.branch_id;
}

async function getUserCart(client,user_id){
  let {rows:carts}=await client.query("select c.cart_id from carts as c join cart_status as s on c.status = s.status_id where c.user_id=$1 and s.status='OPEN' order by c.cart_id desc limit 1",[user_id]);

  if(carts.length>0){
    return carts[0].cart_id;
  }
  else{
    let {rows:result}=await client.query("insert into carts (user_id) values ($1) returning *",[user_id]);
    return result[0].cart_id;
  }
}

async function modifyInventory(client,cart_id,product_id,branch_id,qty,addToCart) {

  if(addToCart)
    {
         
          let {rows:result}=await client.query("update inventory set qty = qty - $1 where product_id=$2 and branch_id=$3 and qty >= $1 returning *",[qty,product_id,branch_id]);
          if(result.length>0)
          {
            await client.query("insert into cart_item (cart_id,product_id,branch_id,qty) values ($1,$2,$3,$4) on conflict (cart_id, product_id, branch_id) do update set qty = cart_item.qty + $4",[cart_id,product_id,branch_id,qty]);
            return true;
          }
          else{
            return false;
          }
      
    }
  else{
          await client.query("update inventory set qty = qty + $1 where product_id=$2 and branch_id=$3",[qty,product_id,branch_id]);
          await client.query("delete from cart_item where cart_id=$1 and product_id=$2",[cart_id,product_id]);
          return true;
  }
  
 }


const addRecord=async (lat,long,country,user_id,product_id,qty) => {
  
  let commit=true;
  let client=await startTransaction(user_id);
  try{
  let cart_id=await getUserCart(client,user_id);
  
    let nearestBranchId=await getNearestBranch(client,long,lat,country,product_id,qty);

    if(!nearestBranchId){
      commit=false;
    }
    else{
    let result=await modifyInventory(client,cart_id,product_id,nearestBranchId,qty,true);
    if(!result){
      commit=false;
    }
    }
  }catch(e){
    await endTransaction(client,1);
    throw e;
  }

  await endTransaction(client,commit? 0:1);
  return commit;
}
const removeRecord = async (user_id,product_id)=>{
  let client=await startTransaction(user_id);
  try{
    let {rows:carts}=await client.query("select c.cart_id from carts as c join cart_status as s on c.status = s.status_id where c.user_id=$1 and s.status='OPEN'",[user_id]);
   if(carts.length===0){
    await endTransaction(client,1);
    return false;
   }
  let cart_id=carts[0].cart_id;
  let {rows:product}=await client.query("select * from cart_item where cart_id=$1 and product_id=$2",[cart_id,product_id]);
  if(product.length===0)
  {
    await endTransaction(client,1);
    return false;
  }
  await client.query("delete from cart_item where cart_id=$1 and product_id=$2 returning *",[cart_id,product_id]);
  for(let p of product){
  await modifyInventory(client,cart_id,product_id,p.branch_id,p.qty,false);
  }
  }catch(e){
    await endTransaction(client,1);
    throw e;
  }
  await endTransaction(client,0)
  return true;
}
const checkOutRecord = async (user_id)=>{
  const client= await startTransaction(user_id);
  try{
      let {rows:status}=await client.query("select * from cart_status where status='CHECKED_OUT'");
      let {rows:cart}=await client.query("select c.cart_id from carts as c join cart_status as s on c.status = s.status_id where c.user_id=$1 and s.status='OPEN'  order by c.cart_id desc limit 1",[user_id]);
      if(cart.length===0)
      {
        await endTransaction(client,1);
        return false;
      }
      let cart_id=cart[0].cart_id;
      let status_id=status[0].status_id
      await client.query("update carts set status = $1 where cart_id = $2",[status_id,cart_id]);
      
  }catch(e){
    await endTransaction(client,1);
    throw e;
  }
  await endTransaction(client,0)
  return true;

}
const cancelRecord= async (user_id)=>{
  const client= await startTransaction(user_id);
  try{
      let {rows:status}=await client.query("select * from cart_status where status='CANCELLED'");
      let {rows:cart}=await client.query("select c.cart_id from carts as c join cart_status as s on c.status = s.status_id where c.user_id=$1 and s.status='CHECKED_OUT' order by c.cart_id desc limit 1",[user_id]);
      if(cart.length===0)
      {
        await endTransaction(client,1);
        return false;
      }
      let cart_id=cart[0].cart_id;
      let status_id=status[0].status_id
      let {rows:products}=await client.query("select * from cart_item where cart_id=$1",[cart_id]);
      for(let product of products)
      {
        await client.query("delete from cart_item where cart_id=$1 and product_id=$2 returning *",[cart_id,product.product_id]);
        await modifyInventory(client,cart_id,product.product_id,product.branch_id,product.qty,false);
      }
      await client.query("update carts set status = $1 where cart_id = $2",[status_id,cart_id]);
      
  }catch(e){
    await endTransaction(client,1);
    throw e;
  }
  await endTransaction(client,0)
  return true;
}
module.exports = {
  addRecord,
  removeRecord,
  checkOutRecord,
  cancelRecord
};
