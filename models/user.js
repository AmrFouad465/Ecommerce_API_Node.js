const runQuery = require('../config/db');
async function geocode(address) {
  const url = "https://nominatim.openstreetmap.org/search?" +
    new URLSearchParams({
      q: address,
      format: "json",
      limit: "1",
      addressdetails: "1",   
    });

  const res = await fetch(url, {
    headers: { "Accept-Language": "en" },
  });
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);

  const data = await res.json();
  if (data.length === 0) return null;

  const a = data[0].address;
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    city: a.city || a.town || a.village || a.municipality || a.state || null,
    country: a.country || null,
    countryCode: a.country_code ? a.country_code.toUpperCase() : null, 
  };
}
const checkCredentials= async (email) => {

  const result=await runQuery("select * from users where email=$1",[email]);
  if(result.length>0) {
      return result[0];
  }
  else{
      return null;
  }
    
}
const insertNewUser=async(fName,lName,email,password,location)=>{
    
    let loc=await geocode(location);
    const result = await runQuery("insert into users (fname,lname,email,password,user_location,lat,long,country,city) Values ($1,$2,$3,$4) returning *",[fName,lName,email,password,location,loc.lat,loc.lng,loc.country,loc.city]);
    if( result.length>0){
        return  result[0];
    }
    else{
        return null;
    }
}
const userExist=async (email) => {
    const result=await runQuery("select * from users where email=$1",[email]);
    return result.length>0;
    
}
const updateUser=async (id,fName,lName,email,password,location)=>{
  let runQueryString="update users set "
  let params=[];
  if(fName){
    params.push(fName)
    runQueryString+=`fname = $${params.length}`
  }
  if(lName){
    if(params.length>0)
      runQueryString+=','
    params.push(lName)
    runQueryString+=`lname = $${params.length}`
  }
  if(email){
    if(params.length>0)
      runQueryString+=','
    params.push(email)
    runQueryString+=`email = $${params.length}`
  }
  if(password){
    if(params.length>0)
      runQueryString+=','
    params.push(password)
    runQueryString+=`password = $${params.length}`
  }
  if(location){
    if(params.length>0)
      runQueryString+=','
    params.push(location)
    runQueryString+=`user_location = $${params.length}`
    let loc=await geocode(location);
    runQueryString+=','
    params.push(loc.lat)
    runQueryString+=`lat = $${params.length}`
    runQueryString+=','
    params.push(loc.lng)
    runQueryString+=`long = $${params.length}`
    runQueryString+=','
    params.push(loc.country)
    runQueryString+=`country = $${params.length}`
    runQueryString+=','
    params.push(loc.city)
    runQueryString+=`city = $${params.length}`

  }
  if(params.length>0){
    params.push(id);
    runQueryString+= ` where user_id=$${params.length} returning *`
    const result= await runQuery(runQueryString,params);
    if( result.length>0){
        return result[0];
    }
    else{
        return null;
    }
  }

}
module.exports={checkCredentials,insertNewUser,userExist}