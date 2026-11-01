const runQuery=require('../config/db');
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
const addRecord= async(location)=>{

    let loc=await geocode(location);
    const result = await runQuery("insert into branches (location,lat,long,country,city) values ($1,$2,$3,$4,$5) returning *",[location,loc.lat,loc.lng,loc.country,loc.city]);
    if(result.length>0){
        return result;
    }
    else {
        return null;
    }
}


const deleteRecord= async(branch_id)=>{
    await runQuery("update branches set deleted=true where branch_id=$1",[branch_id]);
    return true;


}

module.exports={addRecord,deleteRecord};