const profitModel = require("../models/profit.model");

//Add item router controller
const addProfit = async(req,res) => { //async---java script is single threaded. So this cannot do two functions together that's why we use async.....await

    try{
    const{income,salary,other,profit} = req.body;

    const newProfitData = {
        income:income,
        // salary:salary,
        other:other,
        profit:profit
    }

    //newProfitObj->ProfitModel object  ---assign newProfitData object data into newProfitObj
    const newProfitObj = new profitModel(newProfitData);
    await newProfitObj.save();//until async part done this part will be hold

    //static codes(alsways like this in res. Only change the number)
    return res.status(200).send({
        status: true,
        message:"🌟 :: Data saved successfuly!"
    })
}catch(err){
    return res.status(500).send({
        status: false,
        message: err.message
    })
}

}


//get all item router controller
const getAllProfits = async(req,res)=>{

    try{
        const allProfits = await profitModel.find();//find data in monogoDB database

        return res.status(200).send({
        status:true,
        message: "🌟 :: All Profits are fetched!",
        allProfits:allProfits
    })

    }catch(err){
        return res.status(500).send({
            status:false,
            message:err.message
        })     
    }
    
}

//get one-specified item router controller
const getOneProfit = async(req,res) => {
    try{

        const profitID = req.params.id;
        const profit = await profitModel.findById(profitID);

        return res.status(200).send({
            status: true,
            message: "🌟:: Profit Fetched!",
            Profit : profit,
        })

    }catch(err){
        return res.status(500).send({
            status:false,
            message:err.message,
        })

    }               
}

//Update item details router controller
const updateProfit = async(req,res) => {

    try{
        const profitID =  req.params.id;
        const{ income,salary,other,profit } = req.body;

        const ProfitData = {
            income:income,
            salary:salary,
            other:other,
            profit:profit
        }

        const updateProfitObj = await profitModel.findByIdAndUpdate(profitID,ProfitData);

        return res.status(200).send({
            status:true,
            message:"🌟 :: Profit updated!"
        })
    }catch(err){
        return res.status(500).send({
            status:false,
            message:err.message,
        })
    }
}


module.exports = {
    addProfit, 
    getAllProfits, 
    getOneProfit, 
    updateProfit,             
}