const mongoose = require("mongoose");


const ConnectDB = () => {

    try {

        mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Database Connected!👍👍")
        })
        .catch((err) => {
            console.log(`Error on MongoDB URL: ${err.message}`)
        })
        
    } catch (error) {
        console.log(`Error on MongoDB connect : ${err.message}`)
    }
   
}

//should export all functions  by using a coma

module.exports = {ConnectDB}