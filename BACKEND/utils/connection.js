const mongoose = require("mongoose");

const connectDB = ()=> {

    try{
        mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("🎯 :: Database Connected!");
        })
        .catch((err) =>{
            console.log(`💀 :: Error on mongoDB URL : ${err.message}`)
        })

    }catch(err){
        console.log(`💀 :: Error on mongoDB connect : ${err.message}`)
    }
}

module.exports = {connectDB}