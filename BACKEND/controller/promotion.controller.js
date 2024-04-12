const promotionModel = require("../models/promotion.model");

//Add / Create promotion router controller
const addpromotion = async (req, res) => {
    try{

   
        const{promotionName,promotionValues,promotionDescription,promotionItempic} = req.body;

        const newpromotionData = {
           
            promotionName: promotionName,
            promotionValues: promotionValues,
            promotionDescription: promotionDescription,
            promotionItempic: promotionItempic,
        }

        const newpromotionobj = new promotionModel(newpromotionData);
        await newpromotionobj.save();
        await res.status(200).send({
            status: true,
            message:"✨ :: Data saved successfuly!"
        })

        }catch(err){
            return res.status(500).send({
                status: false,
                message:err.message
            })
        }
    }

    //get all promotion router controller
    const getAllpromotions = async (req,res)=> {
    
       try{

        const allpromotions = await promotionModel.find();

        return res.status(200).send({
            status: true,
            message:"✨::All items are fetched!",
            Allpromotions: allpromotions,
        })

        }catch(err){
            return res.status(500).send({
                status: false,
                message:err.message,
        })
    }

    }
    //get one specified promotion router controller
    const getOnepromotion = async (req, res) => {

        try{

            const promotionID = req.params.id;
            const promotion = await promotionModel.findById(promotionID);

            return res.status(200).send({
                status: true,
                message:"✨::promotion fetched!",
                Promotion: promotion,
        })
      
    }catch(err){
            return res.status(500).send({
                status: false,
                message:err.message,

            })
        }
    }           
    
    //update promotion details router controller

    const updatepromotion =async (req,res)=>{
     
        try{

            const promotionID = req.params.id;
            const{promotionName,promotionValues,promotionDescription,promotionItempic} = req.body;

            const promotionData = {
                promotionName:promotionName,
                promotionValues:promotionValues,
                promotionDescription:promotionDescription,
                promotionItempic:promotionItempic,

            }
            const updatepromotionobj = await promotionModel.findByIdAndUpdate(promotionID,promotionData);

            return  res.status(200).send({
                status: true,
                message: "✨:: promotion Updated!",

            }) 
            
        }catch(err){
            return res.status(500).send({
                status: false,
                message:err.message,

        })

    }   

    }

    //Delete promotion router controller
    const deletepromotion = async (req,res)=>{

        try{

            const promotionID= req.params.id;
            const delpromotion = await promotionModel.findByIdAndDelete(promotionID);

            return res.status(200).send({
                status: true,
                message: "✨:: promotion Delete!",
        })

    }catch(err){
        return res.status(500).send({
            status: false,
            message:err.message,

    })

}
    }

    module.exports = {
        addpromotion,
        getAllpromotions,
        getOnepromotion,
        updatepromotion,
        deletepromotion,
    }

