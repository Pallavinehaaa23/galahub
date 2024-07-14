const mongoose=require("mongoose");
const conndb=async()=>{
    try{
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Server connected on db`);
    }
    catch(e){
        console.log(e);
    }
}
module.exports=conndb;