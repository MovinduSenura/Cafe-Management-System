const mongoose = require("mongoose")

const ConnectDB = () => {
    
    try{
       
        mongoose.connect(process.env.MONGO_URL)
        .then(() =>{
            console.log(`🎯::Database Connected!`)
        })
        .catch((err) => {
            console.log(`☠️::Error on mongoDB URL : ${err.message}`)
        })
  
    }catch(err){
        console.log(`☠️::Error on mongoDB URL : ${err.message}`)
        }
    }
    
module.exports = {ConnectDB}